'use client';

import React from 'react';
import { StylingConfig } from '../styling/styling-config';
import { VisibilityStyle } from '../styling/visibility-style';
import { FormRulesExecutor } from './rules/form-rules-executor';
import { classNames } from '../../editor/utils/classNames';
import { FormContext } from './form-context';
import { FormViewProps } from './form.view-props';


const generateHiddenFields = (fields: string[]) =>{
    return fields.reduce((obj: object, item: string) =>
    Object.assign(obj, { [item]: true })
    , {});
};

export function FormClient(props: FromContainerProps) {
    const { children, viewProps, className, formDataAttributes } = props;
    const fromElementRef = React.useRef<HTMLFormElement>(null);
    const formRef = React.useRef<HTMLDivElement>(null);
    const formRules = React.useRef<FormRulesExecutor>(null);
    const [ disabledSubmitButton, setDisabledSubmitButton] = React.useState(false);
    const [ showLoading, setShowLoading] = React.useState(false);
    const [ showFields, setShowFields] = React.useState(true);
    const [ errorMessage, setErrorMessage] = React.useState<string>();
    const [ successMessage, setSuccessMessage] = React.useState<string>();
    const [ formSubmitted, setFormSubmitted] = React.useState(false);
    const splitHiddenFields = viewProps.hiddenFields?.split(',') || [];
    const [ hiddenInputs, setHiddenInputs ] = React.useState<{[key: string]: boolean}>(generateHiddenFields(splitHiddenFields));
    const [ skippedInputs, setSkippedInputs ] = React.useState<{[key: string]: boolean}>({});
    const [ validatedInputs, setValidatedInputs ] = React.useState<{[key: string]: boolean}>({});
    const sfFormValueChanged = () => {
        formRules.current!.process();
    };

    const dispatchValidity = (inputKey: string, valid: boolean) => {
         setValidatedInputs(vI => {
            const newValidatedInputs = {
                ...vI,
                [inputKey]: valid
            };
            return newValidatedInputs;
        });
    };

    const updateFields = React.useCallback((args: {
        show?: string;
        hide?: string;
        skip?: string;
        unSkip?: string;
    }) => {
        if (args.show) {
            setHiddenInputs(hI => {
                const newHiddenFields = {...hI};
                delete newHiddenFields[args.show!];
                return newHiddenFields;
            });
        }

        if (args.hide) {
            setHiddenInputs(hI => {
                const newHiddenFields = {...hI};
                newHiddenFields[args.hide!] = true;
                return newHiddenFields;
            });
        }

        if (args.skip) {
            setSkippedInputs(sI => {
                const newSkippedFields = {...sI};
                delete newSkippedFields[args.skip!];
                return newSkippedFields;
            });
        }

        if (args.unSkip) {
            setSkippedInputs(sI => {
                const newSkippedFields = {...sI};
                newSkippedFields[args.unSkip!] = true;
                return newSkippedFields;
            });
        }
    },[]);

    const formCreateRef = React.useCallback((node: HTMLDivElement) => {
        if (node !== null) {
            formRef.current = node;
            const fr = new FormRulesExecutor(node, updateFields);
            formRules.current = fr;
            fr.process();
        }
      }, [updateFields]);


    function showSuccessMessage(message: string) {
        setShowLoading(false);

        setShowFields(false);

        setSuccessMessage(message);
    }

    function showErrorMessage(message: string) {
        setErrorMessage(message);

        setShowLoading(false);

        setShowFields(false);
    }

    function triggerLoading() {
        setErrorMessage('');

        setShowLoading(true);

        setSuccessMessage('');

       setShowFields(false);
    }

    function showSubmittedForm() {
        setDisabledSubmitButton(true);

        setShowLoading(false);

        setSuccessMessage('');

        setShowFields(true);
    }

    const handleResponse = (redirectUrl?: string, successMessageVal?: string, openInNewWindow?: boolean) => {
        if (redirectUrl) {
            if (openInNewWindow) {
                showSubmittedForm();
                window.open(redirectUrl, '_blank');
            } else {
                document.location.replace(redirectUrl);
            }
        } else {
            showSuccessMessage(successMessageVal || viewProps.successMessage || '');
        }
    };

    const validFormSubmit = () => {
        const form = fromElementRef.current!;
        if (viewProps.skipDataSubmission) {
            handleResponse(viewProps.redirectUrl);
            return false;
        }

        const genericFormError = 'Form could not be submitted';
        const headerName = 'X-SF-ANTIFORGERY-REQUEST';
        const headers: {[key: string]: string} = {};
        headers[headerName] = '';

        fetch('/sitefinity/anticsrf', { headers: headers }).then(function (csrfResponse) {
            function sendSubmitRequest(headerValue?: string) {
                if (headerValue) {
                    headers[headerName] = headerValue;
                }

                const formData = new FormData(form);
                formData.set('sf_antiforgery', headerValue || '');
                const hiddenInputsTrueKeys = Object.entries(hiddenInputs).filter(([key, value]) => value === true).map(([key, value]) => key);
                formData.set('sf_FormHiddenFields', hiddenInputsTrueKeys.join(',') );

                fetch(viewProps.submitUrl!, { method: 'POST', body: formData }).then(function (formSubmitResponse) {
                    formSubmitResponse.json().then(function (jsonFormSubmitResponse) {
                        // Successfull request statuses
                        if (formSubmitResponse.status >= 200 && formSubmitResponse.status < 300) {
                            if (jsonFormSubmitResponse.success) {
                                if (viewProps.customSubmitAction!.toString().toLowerCase() === 'true') {
                                    handleResponse(viewProps.redirectUrl);
                                } else {
                                    handleResponse(jsonFormSubmitResponse.redirectUrl, jsonFormSubmitResponse.message, jsonFormSubmitResponse.openInNewWindow);
                                }
                            } else {
                                showErrorMessage(jsonFormSubmitResponse.error);
                            }
                            // Client and Server error request statuses
                        } else if (formSubmitResponse.status >= 400 && formSubmitResponse.status < 600) {
                            showErrorMessage(jsonFormSubmitResponse.error);
                        }
                    }, function (error) {
                        if (formSubmitResponse.status === 413) {
                            showErrorMessage('Request was too large');
                        } else {
                            showErrorMessage(genericFormError);
                        }
                    });
                }, function (error) {
                    const serializedError = JSON.stringify(error);

                    if (serializedError === '{}') {
                        showErrorMessage(genericFormError);
                    } else {
                        showErrorMessage(serializedError);
                    }
                });
            }
            if (csrfResponse.status === 200) {
                if (csrfResponse.headers.get('content-type') === 'application/json') {
                    csrfResponse.json().then(function (jsonCsrfResponse) {
                        sendSubmitRequest(jsonCsrfResponse.Value);
                    });
                } else {
                    sendSubmitRequest();
                }
            } else if (csrfResponse.status === 204 || csrfResponse.status === 404) {
                sendSubmitRequest();
            } else {
                showErrorMessage('Failed to submit form due to lack of csrf token');
            }
        });
    };

    const handleSubmit = function (e: React.FormEvent<HTMLFormElement>) {
        e?.preventDefault();
        setFormSubmitted(true);
    };

    const allInputsAreValid = React.useMemo(()=>{
        return Object.entries(validatedInputs)
            .filter(([inputKey, inputValue]) => !hiddenInputs[inputKey])
            .map(([inputKey, inputValue])=>{
                return !skippedInputs[inputKey] && inputValue;
        }).every((i) => i);
    }, [validatedInputs, hiddenInputs, skippedInputs]);

    React.useEffect(()=>{
        if (formSubmitted && allInputsAreValid) {
            validFormSubmit();
        }
        if (formSubmitted) {
            setTimeout(()=>{
                setFormSubmitted(false);
            },10);
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[formSubmitted, allInputsAreValid]);

    return (
      <form ref={fromElementRef} action={viewProps.submitUrl} onSubmit={handleSubmit} method="post" {...formDataAttributes}  noValidate={true}>
        <div data-sf-role="success-message" className={classNames(
                'valid-feedback',
                successMessage
                    ? [StylingConfig.VisibilityClasses[VisibilityStyle.Visible]]
                    : [StylingConfig.VisibilityClasses[VisibilityStyle.Hidden]]
            )}
          role="alert" aria-live="assertive">{successMessage || viewProps.successMessage}</div>
        <div data-sf-role="error-message"
          className={classNames(
                'invalid-feedback',
                errorMessage
                    ? [StylingConfig.VisibilityClasses[VisibilityStyle.Visible]]
                    : [StylingConfig.VisibilityClasses[VisibilityStyle.Hidden]]
                )}
          role="alert" aria-live="assertive">
          { errorMessage }
        </div>
        <div data-sf-role="loading"
          className={classNames(
                showLoading
                    ? [StylingConfig.VisibilityClasses[VisibilityStyle.Visible]]
                    : [StylingConfig.VisibilityClasses[VisibilityStyle.Hidden]]
                )}>
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
        <FormContext.Provider value={{
            formViewProps: viewProps,
            sfFormValueChanged,
            hiddenInputs,
            skippedInputs,
            formSubmitted,
            disabledSubmitButton,
            dispatchValidity
        }}>
          <div
            ref={formCreateRef}
            className={classNames(
                className,
                showFields
                    ? [StylingConfig.VisibilityClasses[VisibilityStyle.Visible]]
                    : [StylingConfig.VisibilityClasses[VisibilityStyle.Hidden]]
                )}
            data-sf-role="form-container"
            data-sf-invalid={viewProps.invalidClass}
            data-sf-visibility-inline-visible={viewProps.visibilityClasses[VisibilityStyle.InlineVisible]}
            data-sf-visibility-hidden={viewProps.visibilityClasses[VisibilityStyle.Hidden]}
            data-sf-visibility-visible={viewProps.visibilityClasses[VisibilityStyle.Visible]}>
            {children}
          </div>
        </FormContext.Provider>
      </form>
    );
}

export interface FromContainerProps {
    children: React.ReactNode;
    className: string | undefined;
    viewProps: FormViewProps;
    formDataAttributes: {[key: string]: string};
}
