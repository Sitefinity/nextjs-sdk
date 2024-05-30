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
import { FormViewModel, getFormRulesViewModel, getFormHiddenFields } from './form-view-model';
import { FormEntity } from './form.entity';
import { RestClientForContext } from '../../services/rest-client-for-context';
import { PageItem } from '../../rest-sdk/dto/page-item';

export async function Form(props: WidgetContext<FormEntity>) {
    const entity = props.model.Properties;
    const context = props.requestContext;
    const searchParams = context.searchParams;
    const queryParams = { ...searchParams };

    const viewModel: FormViewModel = {
        CustomSubmitAction: false,
        VisibilityClasses: StylingConfig.VisibilityClasses,
        InvalidClass: StylingConfig.InvalidClass
    };

    if (entity.SelectedItems && entity.SelectedItems.ItemIdsOrdered && entity.SelectedItems.ItemIdsOrdered.length > 0) {
        let formDto: FormDto | null = null;
        try {
            formDto = await RestClientForContext.getItem<FormDto>(entity.SelectedItems, { type: RestSdkTypes.Form });
        } catch (error) {
            const attributes = htmlAttributes(props, error as string);
            return (props.requestContext.isEdit ? <div {...attributes} /> : null);
        }

        if (!formDto) {
            const attributes = htmlAttributes(props, `The item with key '${entity.SelectedItems.ItemIdsOrdered[0]}' was not found`);
            return (props.requestContext.isEdit ? <div {...attributes} /> : null);
        }

        if (searchParams && searchParams['sf-content-action']) {
            viewModel.SkipDataSubmission = true;
            queryParams['sf-content-action'] = encodeURIComponent(searchParams['sf-content-action']);
        }

        if (!context.isLive) {
            viewModel.SkipDataSubmission = true;
        }

        let formModel: LayoutServiceResponse;
        try {
            formModel = await RestClient.getFormLayout({ id: formDto.Id, queryParams: queryParams });
        } catch (err) {
            if (context.isEdit) {
                queryParams[QueryParamNames.Action] = 'edit';
                formModel = await RestClient.getFormLayout({ id: formDto.Id, queryParams: queryParams });
                viewModel.Warning = 'This form is a Draft and will not be displayed on the site until you publish the form.';
            } else {
                throw err;
            }
        }

        viewModel.FormModel = formModel;
        viewModel.Rules = getFormRulesViewModel(formDto);
        viewModel.SubmitUrl = `/forms/submit/${formDto.Name}/${context.culture}?${QueryParamNames.Site}=${context.layout.SiteId}&${QueryParamNames.SiteTempFlag}=true`;
        viewModel.HiddenFields = getFormHiddenFields(viewModel.FormModel).join(',');
        viewModel.Attributes = entity.Attributes;

        if (entity.FormSubmitAction === FormSubmitAction.Redirect && entity.RedirectPage) {
            const redirectPage = await RestClientForContext.getItem<PageItem>(entity.RedirectPage, { type: RestSdkTypes.Pages });
            if (redirectPage) {
                viewModel.CustomSubmitAction = true;
                viewModel.RedirectUrl = await redirectPage.ViewUrl;
            }
        } else if (entity.FormSubmitAction === FormSubmitAction.Message) {
            viewModel.CustomSubmitAction = true;
            viewModel.SuccessMessage = entity.SuccessMessage as string;
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
    </FormClient>);

    return (
      <>
        {viewModel.FormModel &&
        <>
          {renderForm}
        </>
            }
        {!viewModel.FormModel && context.isEdit &&
        <>
          <div {...formDataAttributes} />
        </>}
      </>
    );
}
