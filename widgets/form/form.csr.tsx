'use client';

import { StyleGenerator } from '../styling/style-generator.service';
import { FormSubmitAction } from './interfaces/form-submit-action';
import { FormDto } from './interfaces/form-dto';
import { StylingConfig } from '../styling/styling-config';
import { RenderWidgetService } from '../../services/render-widget-service';
import { QueryParamNames } from '../../rest-sdk/query-params-names';
import { FormClient } from './form-client';
import { classNames } from '../../editor/utils/classNames';
import { htmlAttributes, setWarning } from '../../editor/widget-framework/attributes';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { WidgetModel } from '../../editor/widget-framework/widget-model';
import { RestClient, RestSdkTypes } from '../../rest-sdk/rest-client';
import { FormEntity } from './form.entity';
import { RestClientForContext } from '../../services/rest-client-for-context';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getQueryParams } from '../common/query-params';
import { TransferableRequestContext } from '../../editor/request-context';
import { FormViewProps, getFormRulesViewProps, getFormHiddenFields } from './form.view-props';
import { ErrorCodeException } from '../../rest-sdk/errors/error-code.exception';

export function FormCSR(props: WidgetContext<FormEntity>) {
    const entity = props.model.Properties;
    const searchParams = useSearchParams();
    const queryParams = useMemo(() => {
        return getQueryParams(searchParams);
    }, [searchParams]);

    const context: TransferableRequestContext = useMemo(() => {
        return {
            ...props.requestContext,
            searchParams: queryParams
        };
    }, [props.requestContext, queryParams]);

    const [viewProps, setViewProps] = useState<FormViewProps>({
        customSubmitAction: false,
        visibilityClasses: StylingConfig.VisibilityClasses,
        invalidClass: StylingConfig.InvalidClass,
        skipDataSubmission: !context.isLive || (queryParams && !!queryParams['sf-content-action']),
        attributes: entity.Attributes
    });
    const [error, setError] = useState<string>('');

    const getFormModel = (formDto: FormDto) => {
        const currentQueryParams: {[key: string]: string} = {...queryParams};
        if (queryParams && queryParams['sf-content-action']) {
            currentQueryParams['sf-content-action'] = encodeURIComponent(queryParams['sf-content-action']);
        }
        return RestClient.getFormLayout({ id: formDto.Id, queryParams: currentQueryParams }).then(formModel => {
            return formModel;
        }).catch(err => {
            if (context.isEdit) {
                return RestClient.getFormLayout({ id: formDto.Id, queryParams: Object.assign({}, currentQueryParams, {[QueryParamNames.Action]: 'edit'})}).then(formModel => {
                    setViewProps(currentProps => Object.assign<any, FormViewProps, Partial<FormViewProps>>({}, currentProps, {
                        warning: 'This form is a Draft and will not be displayed on the site until you publish the form.'
                    }));
                    return formModel;
                });
            } else {
                throw err;
            }
        });
    };

    useEffect(() => {
        if (entity.SelectedItems && entity.SelectedItems.ItemIdsOrdered && entity.SelectedItems.ItemIdsOrdered.length > 0) {
            RestClientForContext.getItem<FormDto>(entity.SelectedItems!, { type: RestSdkTypes.Form }).then(formDto => {
                return getFormModel(formDto).then(formModel => {
                    setViewProps(currentProps => Object.assign<any, FormViewProps, Partial<FormViewProps>>({}, currentProps, {
                        formModel: formModel,
                        rules: getFormRulesViewProps(formDto),
                        submitUrl: `/forms/submit/${formDto.Name}/${context.culture}?${QueryParamNames.Site}=${context.layout?.SiteId}&${QueryParamNames.SiteTempFlag}=true`,
                        hiddenFields: getFormHiddenFields(formModel).join(',')
                    }));

                    if (entity.FormSubmitAction === FormSubmitAction.Redirect && entity.RedirectPage) {
                        return RestClientForContext.getItem<PageItem>(entity.RedirectPage, { type: RestSdkTypes.Pages }).then(redirectPage => {
                            if (redirectPage) {
                                setViewProps(currentProps => Object.assign<any, FormViewProps, Partial<FormViewProps>>({}, currentProps, {
                                    customSubmitAction: true,
                                    redirectUrl: redirectPage.ViewUrl
                                }));
                            }
                        });
                    } else if (entity.FormSubmitAction === FormSubmitAction.Message) {
                        setViewProps(currentProps => Object.assign<any, FormViewProps, Partial<FormViewProps>>({}, currentProps, {
                            customSubmitAction: true,
                            successMessage: entity.SuccessMessage as string
                        }));
                    }

                });
            }).catch(error => {
                let errorMessage = JSON.stringify(error);
                if (error instanceof ErrorCodeException) {
                    errorMessage = error.message;
                }

                setError(errorMessage);
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formDataAttributes = htmlAttributes(props);
    if (viewProps.warning) {
        setWarning(formDataAttributes, viewProps.warning);
    }

    const defaultClass = entity.CssClass;
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);
    const containerClass = classNames(
        defaultClass,
        marginClass
    );

    return (
      <>{
            error && <div {...htmlAttributes(props, error as string)} />
        }
        {viewProps.formModel &&
        <>
          {<FormClient
            viewProps={viewProps}
            className={containerClass}
            formDataAttributes={formDataAttributes}>
            {(viewProps.rules) &&
            <>
              <input type="hidden" data-sf-role="form-rules" value={viewProps.rules} />
              <input type="hidden" data-sf-role="form-rules-hidden-fields" name="sf_FormHiddenFields" value={viewProps.hiddenFields} autoComplete="off" />
              <input type="hidden" data-sf-role="form-rules-skip-fields" name="sf_FormSkipFields" autoComplete="off" />
              <input type="hidden" data-sf-role="form-rules-notification-emails" name="sf_FormNotificationEmails" autoComplete="off" />
              <input type="hidden" data-sf-role="form-rules-message" name="sf_FormMessage" autoComplete="off" />
              <input type="hidden" data-sf-role="form-rules-redirect-page" name="sf_FormRedirectPage" autoComplete="off" />
            </>
        }

            <input type="hidden" data-sf-role="redirect-url" value={viewProps.redirectUrl} />
            <input type="hidden" data-sf-role="custom-submit-action" value={viewProps.customSubmitAction!.toString()} />
            {viewProps.skipDataSubmission && <span data-sf-role="skip-data-submission" />}
            <div data-sf-role="fields-container" >
              {viewProps.formModel && viewProps.formModel.ComponentContext.Components.map((widgetModel: WidgetModel<any>, idx: number) => {
                return RenderWidgetService.createComponent(widgetModel, context);
            })
            }
            </div>
          </FormClient>}
        </>
            }
        {!viewProps.formModel && context.isEdit &&
        <>
          <div {...formDataAttributes} />
        </>}
      </>
    );
}
