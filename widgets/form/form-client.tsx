'use client';

import React from 'react';
import { StylingConfig } from '../styling/styling-config';
import { VisibilityStyle } from '../styling/visibility-style';
import { FormRulesExecutor } from './rules/form-rules-executor';
import { classNames } from '../../editor/utils/classNames';
import { FormContext } from './form-context';
import { FormViewModel } from './form-view-model';


const generateHiddenFields = (fields: string[]) =>{
    return fields.reduce((obj: object, item: string) =>
    Object.assign(obj, { [item]: true })
    , {});
};

export function FormClient(props: FromContainerProps) {
    const { children, viewModel, className, formDataAttributes } = props;
    const fromElementRef = React.useRef<HTMLFormElement>(null);
    const formRef = React.useRef<HTMLDivElement>();
    const formRules = React.useRef<FormRulesExecutor>();
    const [ disabledSubmitButton, setDisabledSubmitButton] = React.useState(false);
    const [ showLoading, setShowLoading] = React.useState(false);
    const [ showFields, setShowFields] = React.useState(true);
    const [ errorMessage, setErrorMessage] = React.useState<string>();
    const [ successMessage, setSuccessMessage] = React.useState<string>();
    const [ formSubmitted, setFormSubmitted] = React.useState(false);
    const splitHiddenFields = viewModel.HiddenFields?.split(',') || [];
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            showSuccessMessage(successMessageVal || viewModel.SuccessMessage || '');
        }
    };

    const validFormSubmit = () => {
        const form = fromElementRef.current!;
        if (viewModel.SkipDataSubmission) {
            handleResponse(viewModel.RedirectUrl);
            return false;
        }

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

                fetch(viewModel.SubmitUrl!, { method: 'POST', body: formData }).then(function (formSubmitResponse) {
                    formSubmitResponse.json().then(function (jsonFormSubmitResponse) {
                        // Successfull request statuses
                        if (formSubmitResponse.status >= 200 && formSubmitResponse.status < 300) {
                            if (jsonFormSubmitResponse.success) {
                                if (viewModel.CustomSubmitAction!.toString().toLowerCase() === 'true') {
                                    handleResponse(viewModel.RedirectUrl);
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
                        showErrorMessage('Form submit response was not in json format and could not be parsed');
                    });
                }, function (error) {
                    showErrorMessage(JSON.stringify(error));
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
      <form ref={fromElementRef} action={viewModel.SubmitUrl} onSubmit={handleSubmit} method="post" {...formDataAttributes}  noValidate={true}>
        <div data-sf-role="success-message" className={classNames(
                'valid-feedback',
                successMessage
                    ? [StylingConfig.VisibilityClasses[VisibilityStyle.Visible]]
                    : [StylingConfig.VisibilityClasses[VisibilityStyle.Hidden]]
            )}
          role="alert" aria-live="assertive">{successMessage || viewModel.SuccessMessage}</div>
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
            formViewModel: viewModel,
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
            data-sf-invalid={viewModel.InvalidClass}
            data-sf-visibility-inline-visible={viewModel.VisibilityClasses[VisibilityStyle.InlineVisible]}
            data-sf-visibility-hidden={viewModel.VisibilityClasses[VisibilityStyle.Hidden]}
            data-sf-visibility-visible={viewModel.VisibilityClasses[VisibilityStyle.Visible]}>
            {children}
          </div>
        </FormContext.Provider>
      </form>
    );
}

export interface FromContainerProps {
    children: React.ReactNode;
    className: string | undefined;
    viewModel: FormViewModel;
    formDataAttributes: {[key: string]: string};
}
