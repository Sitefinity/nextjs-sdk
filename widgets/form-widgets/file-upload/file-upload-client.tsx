'use client';

import React from 'react';
import { StylingConfig } from '../../styling/styling-config';
import { VisibilityStyle } from '../../styling/visibility-style';
import { classNames } from '../../../editor/utils/classNames';
import { getUniqueId } from '../../../editor/utils/getUniqueId';
import { RequestContext } from '../../../editor/request-context';
import { FormContext } from '../../form/form-context';

export interface FileUploadViewModel {
    Required: boolean;
    InstructionalText: string;
    ViolationRestrictionsJson: any;
    Label: string;
    ValidationAttributes: {[key: string]: string};
    FieldName: string;
    AllowMultipleFiles: boolean;
    MinFileSizeInMb: number;
    MaxFileSizeInMb: number;
    FileSizeViolationMessage: string;
    AllowedFileTypes: string[];
    CssClass: string;
    FileTypeViolationMessage: string;
    RequiredErrorMessage: string;
}

export function FileUploadClient(props: {
    viewModel: FileUploadViewModel,
    fileFieldUniqueId: string,
    fileFieldErrorMessageId: string,
    fileFieldInfoMessageId: string,
    context: RequestContext
}) {
    const {viewModel, fileFieldUniqueId, fileFieldErrorMessageId, fileFieldInfoMessageId, context} = props;
    const {
        formViewModel, sfFormValueChanged, dispatchValidity,
        hiddenInputs, skippedInputs,
        formSubmitted
    } = React.useContext(FormContext);
    const [initialLoad, setInitialLoad] = React.useState(true);
    const [ fileInputs, setFileInputs ] = React.useState<{[key: string]: {
        value?: string;
        fileSizeMessage?: boolean;
        fileTypeMessage?: boolean;
    }}>({
        [fileFieldUniqueId]: {}
    });
    let delayTimer: ReturnType<typeof setTimeout>;
    function dispatchValueChanged() {
        clearTimeout(delayTimer);
        delayTimer = setTimeout(function () {
             sfFormValueChanged();
        }, 300);
     }

    const someInputHasValue = React.useMemo(()=>{
        return initialLoad || viewModel.Required && Object.values(fileInputs).some(i=>i.value);
    },[fileInputs, viewModel.Required, initialLoad]);


    const containerRef = React.useRef<HTMLDivElement>(null);
    const isHidden = hiddenInputs[fileFieldUniqueId];
    const isSkipped = skippedInputs[fileFieldUniqueId];
    const labelAdditionalClassList = viewModel.InstructionalText ? 'mb-1' : null;
    const ariaDescribedByAttribute = viewModel.InstructionalText ? `${fileFieldUniqueId} ${fileFieldErrorMessageId}` : fileFieldErrorMessageId;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFileValidation();
        dispatchValueChanged();
    };

    const handleAddInput = () =>{
        const newInputs = {...fileInputs};
        newInputs[getUniqueId(fileFieldUniqueId)] = {};
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

            const validationRestrictions = viewModel.ViolationRestrictionsJson;
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
        const isRequiredFilled = viewModel.Required && Object.values(newInputs).some(i=>i.value) || !viewModel.Required;
        return isRequiredFilled && isValid;
    };

    React.useEffect(()=>{
        let isValid = false;
        if (formSubmitted) {
            isValid = handleFileValidation();
        }
        dispatchValidity(fileFieldUniqueId, isValid);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[formSubmitted]);

     return ( <div
       ref={containerRef}
       className={classNames(
        'mb-3',
        viewModel.CssClass,
        isHidden
            ? StylingConfig.VisibilityClasses[VisibilityStyle.Hidden]
            : StylingConfig.VisibilityClasses[VisibilityStyle.Visible]
        )} data-sf-role="file-field-container">
       <label className={classNames('h6', 'd-block', labelAdditionalClassList)} htmlFor={fileFieldUniqueId}>{viewModel.Label}</label>
       { viewModel.InstructionalText &&
       <div id={fileFieldInfoMessageId} className="form-text mt-1 mb-2">{viewModel.InstructionalText}</div>
        }
       <input data-sf-role="violation-restrictions" type="hidden" value={viewModel.ViolationRestrictionsJson} />
       <div data-sf-role="file-field-inputs">
         { context.isEdit ?
           <div data-sf-role="single-file-input">
             <input
               className="form-control"
               id={fileFieldUniqueId}
               title={viewModel.Label}
               name={fileFieldUniqueId}
               type="file"
               disabled={isHidden || isSkipped}
               aria-describedby={ariaDescribedByAttribute}
               {...viewModel.ValidationAttributes} />
           </div> :
            (
                Object.entries(fileInputs).map(([inputKey, inputValue]) =>{
                    const isInvalid = (inputValue.fileSizeMessage || inputValue.fileTypeMessage || (viewModel.Required && !someInputHasValue));
                    return (<div data-sf-role="single-file-input-wrapper" key={inputKey}>
                      <div
                        className={classNames('d-flex', 'mb-2')}
                        data-sf-role="single-file-input">
                        <input
                          className={classNames('form-control',
                                {
                                    [formViewModel.InvalidClass!]: formViewModel.InvalidClass
                                        && isInvalid
                            })}
                          id={inputKey}
                          title={viewModel.Label}
                          name={viewModel.FieldName}
                          type="file"
                          onChange={handleFileChange}
                          onInvalid={handleFileChange}
                          aria-describedby={ariaDescribedByAttribute}
                          {...viewModel.ValidationAttributes} />

                        { viewModel.AllowMultipleFiles && Object.entries(fileInputs).length > 1 &&
                        <button type="button" title="Remove" data-sf-role="remove-input" id={'remove-' + inputKey} onClick={handleRemoveInput} className="btn btn-light ms-1">X</button>
                       }
                      </div>
                      { (viewModel.MinFileSizeInMb > 0 || viewModel.MaxFileSizeInMb > 0) && inputValue.fileSizeMessage &&
                      <div data-sf-role="filesize-violation-message" className={classNames('invalid-feedback my-2',
                      {
                        [StylingConfig.VisibilityClasses[VisibilityStyle.Visible]]: isInvalid
                        }
                      )} role="alert" aria-live="assertive">
                        {viewModel.FileSizeViolationMessage}
                      </div>
                   }
                      { (viewModel.AllowedFileTypes !== null) && inputValue.fileTypeMessage &&
                      <div data-sf-role="filetype-violation-message" className={classNames('invalid-feedback my-2',
                      {
                        [StylingConfig.VisibilityClasses[VisibilityStyle.Visible]]: isInvalid
                        }
                      )} role="alert" aria-live="assertive">
                        {viewModel.FileTypeViolationMessage}
                      </div>
                     }
                    </div>);
                })

            )
        }
       </div>
       { viewModel.AllowMultipleFiles &&
       <button type="button" data-sf-role="add-input" onClick={handleAddInput} className="btn btn-secondary my-2">+</button>
        }

       { viewModel.Required && !someInputHasValue &&
       <div data-sf-role="required-violation-message" className={classNames(
        'invalid-feedback',{
            [StylingConfig.VisibilityClasses[VisibilityStyle.Visible]]: !someInputHasValue
        }
          )} role="alert" aria-live="assertive">
         {viewModel.RequiredErrorMessage.replace('{0}', viewModel.Label)}
       </div>
        }
     </div>);
}
