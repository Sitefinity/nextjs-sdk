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
import { LayoutServiceResponse } from '../../rest-sdk/dto/layout-service.response';
import { FormViewProps, getFormRulesViewProps, getFormHiddenFields } from './form.view-props';
import { FormEntity } from './form.entity';
import { RestClientForContext } from '../../services/rest-client-for-context';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { ErrorCodeException } from '../../rest-sdk/errors/error-code.exception';

export async function Form(props: WidgetContext<FormEntity>) {
    const { span, ctx } = Tracer.traceWidget(props, true);
    const entity = props.model.Properties;
    const context = props.requestContext;
    const searchParams = context.searchParams;
    const queryParams = { ...searchParams };

    const viewProps: FormViewProps = {
        customSubmitAction: false,
        visibilityClasses: StylingConfig.VisibilityClasses,
        invalidClass: StylingConfig.InvalidClass
    };

    if (entity.SelectedItems && entity.SelectedItems.ItemIdsOrdered && entity.SelectedItems.ItemIdsOrdered.length > 0) {
        let formDto: FormDto | null = null;
        try {
            formDto = await RestClientForContext.getItem<FormDto>(entity.SelectedItems, { type: RestSdkTypes.Form, culture: props.requestContext.culture, traceContext: ctx});
        } catch (error) {
            let errorMessage: string;
            if (error instanceof ErrorCodeException) {
                errorMessage = error.message;
            } else {
                errorMessage = error as string;
            }

            const attributes = htmlAttributes(props, errorMessage);
            return (props.requestContext.isEdit ? <div {...attributes} /> : null);
        }

        if (searchParams && searchParams['sf-content-action']) {
            viewProps.skipDataSubmission = true;
            queryParams['sf-content-action'] = encodeURIComponent(searchParams['sf-content-action']);
        }

        if (!context.isLive) {
            viewProps.skipDataSubmission = true;
        }

        let formModel: LayoutServiceResponse;
        try {
            formModel = await RestClient.getFormLayout({ id: formDto.Id, additionalQueryParams: queryParams, traceContext: ctx });
        } catch (err) {
            if (context.isEdit) {
                queryParams[QueryParamNames.Action] = 'edit';
                formModel = await RestClient.getFormLayout({ id: formDto.Id, queryParams: queryParams, traceContext: ctx });
                viewProps.warning = 'This form is a Draft and will not be displayed on the site until you publish the form.';
            } else {
                throw err;
            }
        }

        viewProps.formModel = formModel;
        viewProps.rules = getFormRulesViewProps(formDto);
        viewProps.submitUrl = `/forms/submit/${formDto.Name}/${context.culture}?${QueryParamNames.Site}=${context.layout?.SiteId}&${QueryParamNames.SiteTempFlag}=true`;
        viewProps.hiddenFields = getFormHiddenFields(viewProps.formModel).join(',');
        viewProps.attributes = entity.Attributes;

        if (entity.FormSubmitAction === FormSubmitAction.Redirect && entity.RedirectPage) {
            try {
                const redirectPage = await RestClientForContext.getItem<PageItem>(entity.RedirectPage, { type: RestSdkTypes.Pages, culture: props.requestContext.culture, traceContext: ctx });
                if (redirectPage) {
                    viewProps.customSubmitAction = true;
                    viewProps.redirectUrl = await redirectPage.ViewUrl;
                }
            } catch (error) { /* empty */ }
        } else if (entity.FormSubmitAction === FormSubmitAction.Message) {
            viewProps.customSubmitAction = true;
            viewProps.successMessage = entity.SuccessMessage as string;
        }
    }

    const formDataAttributes = htmlAttributes(props);
    const defaultClass = entity.CssClass;
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);
    const containerClass = classNames(
        defaultClass,
        marginClass
    );

    const renderForm = (<FormClient
      viewProps={viewProps}
      className={containerClass}
      formDataAttributes={formDataAttributes}>
      {(viewProps.rules) &&
        <>
          <input type="hidden" data-sf-role="form-rules" value={viewProps.rules} />
          <input type="hidden" data-sf-role="form-rules-skip-fields" name="sf_FormSkipFields" autoComplete="off" />
          <input type="hidden" data-sf-role="form-rules-notification-emails" name="sf_FormNotificationEmails" autoComplete="off" />
          <input type="hidden" data-sf-role="form-rules-message" name="sf_FormMessage" autoComplete="off" />
          <input type="hidden" data-sf-role="form-rules-redirect-page" name="sf_FormRedirectPage" autoComplete="off" />
        </>
        }

      <input type="hidden" data-sf-role="form-rules-hidden-fields" name="sf_FormHiddenFields" value={viewProps.hiddenFields} autoComplete="off" />
      <input type="hidden" data-sf-role="redirect-url" value={viewProps.redirectUrl} />
      <input type="hidden" data-sf-role="custom-submit-action" value={viewProps.customSubmitAction!.toString()} />
      {viewProps.skipDataSubmission && <span data-sf-role="skip-data-submission" />}
      <div data-sf-role="fields-container" >
        {viewProps.formModel && viewProps.formModel.ComponentContext.Components.map((widgetModel: WidgetModel<any>, idx: number) => {
                return RenderWidgetService.createComponent(widgetModel, context, ctx);
            })
            }
      </div>
    </FormClient>);

    return (
      <>
        {viewProps.formModel &&
        <>
          {renderForm}
        </>
            }
        {!viewProps.formModel && context.isEdit &&
        <>
          <div {...formDataAttributes} />
        </>}
        { Tracer.endSpan(span) }
      </>
    );
}
