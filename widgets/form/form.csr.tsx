'use client';

import { StyleGenerator } from '../styling/style-generator.service';
import { FormSubmitAction } from './interfaces/form-submit-action';
import { FormDto } from './interfaces/form-dto';
import { StylingConfig } from '../styling/styling-config';
import { RenderWidgetService } from '../../services/render-widget-service';
import { QueryParamNames } from '../../rest-sdk/query-params-names';
import { FormClient } from './form-client';
import { classNames } from '../../editor/utils/classNames';
import { htmlAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { WidgetModel } from '../../editor/widget-framework/widget-model';
import { RestClient, RestSdkTypes } from '../../rest-sdk/rest-client';
import { FormEntity } from './form.entity';
import { RestClientForContext } from '../../services/rest-client-for-context';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { useEffect, useState } from 'react';
import { FormViewModel, getFormRulesViewModel, getFormHiddenFields } from './form-view-model';

export function FormCSR(props: WidgetContext<FormEntity>) {
    const entity = props.model.Properties;
    const context = props.requestContext;
    const searchParams = context.searchParams;
    
    const [viewModel, setViewModel] = useState<FormViewModel>({
        CustomSubmitAction: false,
        VisibilityClasses: StylingConfig.VisibilityClasses,
        InvalidClass: StylingConfig.InvalidClass,
        SkipDataSubmission: !context.isLive || (searchParams && !!searchParams['sf-content-action']),
        Attributes: entity.Attributes
    });
    const [error, setError] = useState<string>('');
    
    const queryParams = { ...searchParams };

    const getFormModel = (formDto: FormDto) => {
        const currentQueryParams = {...queryParams};
        if (searchParams && searchParams['sf-content-action']) {
            currentQueryParams['sf-content-action'] = encodeURIComponent(searchParams['sf-content-action']);
        }
        return RestClient.getFormLayout({ id: formDto.Id, queryParams: currentQueryParams }).then(formModel => {
            return formModel;
        }).catch(err => {
            if (context.isEdit) {
                return RestClient.getFormLayout({ id: formDto.Id, queryParams: Object.assign({}, currentQueryParams, {[QueryParamNames.Action]: 'edit'})}).then(formModel => {
                    setViewModel(Object.assign({}, viewModel, {Warning: 'This form is a Draft and will not be displayed on the site until you publish the form.'}));
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
                getFormModel(formDto).then(formModel => {
                    setViewModel(Object.assign({}, viewModel, {
                        FormModel: formModel,
                        Rules: getFormRulesViewModel(formDto),
                        SubmitUrl: `/forms/submit/${formDto.Name}/${context.culture}?${QueryParamNames.Site}=${context.layout.SiteId}&${QueryParamNames.SiteTempFlag}=true`,
                        HiddenFields: getFormHiddenFields(formModel).join(',')
                    }));
                });
            }).catch(error => {
                setError(error);
            });

            if (entity.FormSubmitAction === FormSubmitAction.Redirect && entity.RedirectPage) {
                RestClientForContext.getItem<PageItem>(entity.RedirectPage, { type: RestSdkTypes.Pages }).then(redirectPage => {
                    if (redirectPage) {
                        setViewModel(Object.assign({}, viewModel, {
                            CustomSubmitAction: true,
                            RedirectUrl: redirectPage.ViewUrl
                        }));
                    }
                });
            } else if (entity.FormSubmitAction === FormSubmitAction.Message) {
                setViewModel(Object.assign({}, viewModel, {
                    CustomSubmitAction: true,
                    SuccessMessage:entity.SuccessMessage as string
                }));
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formDataAttributes = htmlAttributes(props);
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
        {viewModel.FormModel &&
        <>
          {<FormClient
            viewModel={viewModel}
            className={containerClass}
            formDataAttributes={formDataAttributes}>
            {(viewModel.Rules) &&
            <>
              <input type="hidden" data-sf-role="form-rules" value={viewModel.Rules} />
              <input type="hidden" data-sf-role="form-rules-hidden-fields" name="sf_FormHiddenFields" value={viewModel.HiddenFields} autoComplete="off" />
              <input type="hidden" data-sf-role="form-rules-skip-fields" name="sf_FormSkipFields" autoComplete="off" />
              <input type="hidden" data-sf-role="form-rules-notification-emails" name="sf_FormNotificationEmails" autoComplete="off" />
              <input type="hidden" data-sf-role="form-rules-message" name="sf_FormMessage" autoComplete="off" />
              <input type="hidden" data-sf-role="form-rules-redirect-page" name="sf_FormRedirectPage" autoComplete="off" />
            </>
        }

            <input type="hidden" data-sf-role="redirect-url" value={viewModel.RedirectUrl} />
            <input type="hidden" data-sf-role="custom-submit-action" value={viewModel.CustomSubmitAction!.toString()} />
            {viewModel.SkipDataSubmission && <span data-sf-role="skip-data-submission" />}
            <div data-sf-role="fields-container" >
              {viewModel.FormModel && viewModel.FormModel.ComponentContext.Components.map((widgetModel: WidgetModel<any>, idx: number) => {
                return RenderWidgetService.createComponent(widgetModel, context);
            })
            }
            </div>
          </FormClient>}
        </>
            }
        {!viewModel.FormModel && context.isEdit &&
        <>
          <div {...formDataAttributes} />
        </>}
      </>
    );
}
