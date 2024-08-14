'use client';

import React from 'react';
import { StylingConfig } from '../../styling/styling-config';
import { VisibilityStyle } from '../../styling/visibility-style';
import { classNames } from '../../../editor/utils/classNames';
import { getUniqueId } from '../../../editor/utils/getUniqueId';
import { FormContext } from '../../form/form-context';
import { FileUploadEntity } from './file-upload.entity';
import { FileUploadViewProps } from './interface/file-upload.view-props';

export function FileUploadClient(props: FileUploadViewProps<FileUploadEntity>) {
    const {
        formViewProps, sfFormValueChanged, dispatchValidity,
        hiddenInputs, skippedInputs,
        formSubmitted
    } = React.useContext(FormContext);
    const [initialLoad, setInitialLoad] = React.useState(true);
    const [ fileInputs, setFileInputs ] = React.useState<{[key: string]: {
        value?: string;
        fileSizeMessage?: boolean;
        fileTypeMessage?: boolean;
    }}>({
        [props.fieldName]: {}
    });
    let delayTimer: ReturnType<typeof setTimeout>;
    function dispatchValueChanged() {
        clearTimeout(delayTimer);
        delayTimer = setTimeout(function () {
             sfFormValueChanged();
        }, 300);
     }

    const someInputHasValue = React.useMemo(()=>{
        return initialLoad || props.required && Object.values(fileInputs).some(i=>i.value);
    },[fileInputs, props.required, initialLoad]);


    const containerRef = React.useRef<HTMLDivElement>(null);
    const isHidden = hiddenInputs[props.fieldName];
    const isSkipped = skippedInputs[props.fieldName];
    const labelAdditionalClassList = props.instructionalText ? 'mb-1' : null;
    const fileFieldErrorMessageId = getUniqueId('FileFieldErrorMessage', props.widgetContext.model.Id);
    const fileFieldInfoMessageId = getUniqueId('FileFieldInfo', props.widgetContext.model.Id);
    const ariaDescribedByAttribute = props.instructionalText ? `${props.fieldName} ${fileFieldErrorMessageId}` : fileFieldErrorMessageId;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFileValidation();
        dispatchValueChanged();
    };

    const handleAddInput = () =>{
        const newInputs = {...fileInputs};
        newInputs[getUniqueId(props.fieldName)] = {};
        setFileInputs(newInputs);
    };

    const handleRemoveInput = (event: React.MouseEvent<HTMLButtonElement>) =>{
        const newInputs = {...fileInputs};

        delete newInputs[(event.target as HTMLButtonElement).id.split('remove-')[1]];
        setFileInputs(newInputs);
    };

    const handleFileValidation = ()=>{
        const newInputs = {...fileInputs};
        let isValid = true;
        const fileInputElements = containerRef.current!.querySelectorAll('input[type="file"]');
        for (let i = 0; i < fileInputElements.length; i++) {
            const fileInput = fileInputElements[i] as HTMLInputElement;
            const hasFiles = fileInput.files && fileInput.files.length;

            const validationRestrictions = props.violationRestrictionsJson;
            setInitialLoad(false);
            if (!fileInput.value) {
                newInputs[fileInput.id] = {};
            } else {
                newInputs[fileInput.id] = {
                    ...newInputs[fileInput.id],
                    value: fileInput.value
                };
            }

            if (hasFiles && validationRestrictions.required) {
                if (fileInput.value) {
                    newInputs[fileInput.id] = {
                        ...newInputs[fileInput.id],
                        value: fileInput.value
                    };
                } else {
                    const newInputOptions = {
                        ...newInputs[fileInput.id]
                    };
                    delete newInputOptions.value;
                    newInputs[fileInput.id] = newInputOptions;
                }
            }

            if (hasFiles && (validationRestrictions.maxSize || validationRestrictions.minSize)) {
                const minSize = validationRestrictions.minSize * 1000 * 1000;
                const maxSize = validationRestrictions.maxSize * 1000 * 1000;
                const file = fileInput.files![0];
                const isFileOutOfSize = (minSize > 0 && file.size < minSize) || (maxSize > 0 && file.size > maxSize);

                if (isFileOutOfSize) {
                    newInputs[fileInput.id] = {
                        ...newInputs[fileInput.id],
                        fileSizeMessage: true
                    };
                    isValid = false;
                } else {
                    const newInputOptions = {
                        ...newInputs[fileInput.id]
                    };
                    delete newInputOptions.fileSizeMessage;
                    newInputs[fileInput.id] = newInputOptions;
                }
            }
            if (hasFiles && validationRestrictions.allowedFileTypes) {

                if (fileInput.value) {
                    const stopIndex = fileInput.value.lastIndexOf('.');
                    if (stopIndex >= 0) {
                        const extension = fileInput.value.substring(stopIndex).toLowerCase();
                        if (validationRestrictions.allowedFileTypes.indexOf(extension) < 0) {
                            newInputs[fileInput.id] = {
                                ...newInputs[fileInput.id],
                                fileTypeMessage: true
                            };
                            fileInput.focus();
                            isValid = false;
                        } else {
                            const newInputOptions = {
                                ...newInputs[fileInput.id]
                            };
                            delete newInputOptions.fileTypeMessage;
                            newInputs[fileInput.id] = newInputOptions;
                        }
                    }
                }
            }
        }

        setFileInputs(newInputs);
        const isRequiredFilled = props.required && Object.values(newInputs).some(i=>i.value) || !props.required;
        return isRequiredFilled && isValid;
    };

    React.useEffect(()=>{
        let isValid = false;
        if (formSubmitted) {
            isValid = handleFileValidation();
        }
        dispatchValidity(props.fieldName, isValid);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[formSubmitted]);

     return ( <div
       ref={containerRef}
       className={classNames(
        'mb-3',
        props.cssClass,
        isHidden
            ? StylingConfig.VisibilityClasses[VisibilityStyle.Hidden]
            : StylingConfig.VisibilityClasses[VisibilityStyle.Visible]
        )} data-sf-role="file-field-container">
       <label className={classNames('h6', 'd-block', labelAdditionalClassList)} htmlFor={props.fieldName}>{props.label}</label>
       { props.instructionalText &&
       <div id={fileFieldInfoMessageId} className="form-text mt-1 mb-2">{props.instructionalText}</div>
        }
       <input data-sf-role="violation-restrictions" type="hidden" value={props.violationRestrictionsJson} />
       <div data-sf-role="file-field-inputs">
         { props.widgetContext.requestContext.isEdit ?
           <div data-sf-role="single-file-input">
             <input
               className="form-control"
               id={props.fieldName}
               title={props.label}
               name={props.fieldName}
               type="file"
               disabled={isHidden || isSkipped}
               aria-describedby={ariaDescribedByAttribute}
               {...props.validationAttributes} />
           </div> :
            (
                Object.entries(fileInputs).map(([inputKey, inputValue]) =>{
                    const isInvalid = (inputValue.fileSizeMessage || inputValue.fileTypeMessage || (props.required && !someInputHasValue));
                    return (<div data-sf-role="single-file-input-wrapper" key={inputKey}>
                      <div
                        className={classNames('d-flex', 'mb-2')}
                        data-sf-role="single-file-input">
                        <input
                          className={classNames('form-control',
                                {
                                    [formViewProps.invalidClass!]: formViewProps.invalidClass
                                        && isInvalid
                            })}
                          id={inputKey}
                          title={props.label}
                          name={props.fieldName}
                          type="file"
                          onChange={handleFileChange}
                          onInvalid={handleFileChange}
                          aria-describedby={ariaDescribedByAttribute}
                          {...props.validationAttributes} />

                        { props.allowMultipleFiles && Object.entries(fileInputs).length > 1 &&
                        <button type="button" title="Remove" data-sf-role="remove-input" id={'remove-' + inputKey} onClick={handleRemoveInput} className="btn btn-light ms-1">X</button>
                       }
                      </div>
                      { (props.minFileSizeInMb > 0 || props.maxFileSizeInMb > 0) && inputValue.fileSizeMessage &&
                      <div data-sf-role="filesize-violation-message" className={classNames('invalid-feedback my-2',
                      {
                        [StylingConfig.VisibilityClasses[VisibilityStyle.Visible]]: isInvalid
                        }
                      )} role="alert" aria-live="assertive">
                        {props.fileSizeViolationMessage}
                      </div>
                   }
                      { (props.allowedFileTypes !== null) && inputValue.fileTypeMessage &&
                      <div data-sf-role="filetype-violation-message" className={classNames('invalid-feedback my-2',
                      {
                        [StylingConfig.VisibilityClasses[VisibilityStyle.Visible]]: isInvalid
                        }
                      )} role="alert" aria-live="assertive">
                        {props.fileTypeViolationMessage}
                      </div>
                     }
                    </div>);
                })

            )
        }
       </div>
       { props.allowMultipleFiles &&
       <button type="button" data-sf-role="add-input" onClick={handleAddInput} className="btn btn-secondary my-2">+</button>
        }

       { props.required && !someInputHasValue &&
       <div data-sf-role="required-violation-message" className={classNames(
        'invalid-feedback',{
            [StylingConfig.VisibilityClasses[VisibilityStyle.Visible]]: !someInputHasValue
        }
          )} role="alert" aria-live="assertive">
         {props.requiredErrorMessage.replace('{0}', props.label)}
       </div>
        }
     </div>);
}
