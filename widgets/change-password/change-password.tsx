import { StyleGenerator } from '../styling/style-generator.service';
import { PostPasswordChangeAction } from './interfaces/post-password-change-action';
import { StylingConfig } from '../styling/styling-config';
import { ChangePasswordFormClient } from './change-password-form.client';
import { VisibilityStyle } from '../styling/visibility-style';
import { ChangePasswordViewModel } from './interfaces/change-password-view-model';
import { classNames } from '../../editor/utils/classNames';
import { htmlAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { RestClient, RestSdkTypes } from '../../rest-sdk/rest-client';
import { RootUrlService } from '../../rest-sdk/root-url.service';
import { ChangePasswordEntity } from './change-password.entity';
import { RestClientForContext } from '../../services/rest-client-for-context';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { getUniqueId } from '../../editor/utils/getUniqueId';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

export async function ChangePassword(props: WidgetContext<ChangePasswordEntity>) {
    const {span, ctx} = Tracer.traceWidget(props, true);
    const entity = props.model.Properties;

    const dataAttributes = htmlAttributes(props);
    const defaultClass =  entity.CssClass;
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);

    const oldPasswordInputId = getUniqueId('sf-old-password-');
    const newPasswordInputId = getUniqueId('sf-new-password-');
    const repeatPasswordInputId = getUniqueId('sf-repeat-password-');

    dataAttributes['className'] = classNames(defaultClass, marginClass);

    const viewModel: ChangePasswordViewModel = {
        ChangePasswordHandlerPath: `/${RootUrlService.getWebServicePath()}/ChangePassword`,
        Attributes: entity.Attributes,
        VisibilityClasses: StylingConfig.VisibilityClasses,
        InvalidClass: StylingConfig.InvalidClass,
        PostPasswordChangeAction: entity.PostPasswordChangeAction,
        Labels: {
          Header: entity.Header,
          OldPassword: entity.CurrentPassword,
          NewPassword: entity.NewPassword,
          RepeatPassword: entity.ConfirmPassword,
          SubmitButtonLabel: entity.SubmitButtonLabel,
          LoginFirstMessage: entity.LoginFirstMessage,
          ValidationRequiredMessage: entity.ValidationRequiredMessage,
          ValidationMismatchMessage: entity.ValidationMismatchMessage,
          ExternalProviderMessageFormat: entity.ExternalProviderMessageFormat
        },
        IsLive: props.requestContext.isLive
    };

    if (entity.PostPasswordChangeAction === PostPasswordChangeAction.RedirectToPage) {
        const item = await RestClientForContext.getItem<PageItem>(entity.PostPasswordChangeRedirectPage!, { type: RestSdkTypes.Pages, traceContext: ctx });
        viewModel.RedirectUrl = item.ViewUrl;
    } else {
        viewModel.PostPasswordChangeMessage = entity.PostPasswordChangeMessage;
    }

    return (
      <>
        <div
          data-sf-role="sf-change-password-container"
          data-sf-visibility-hidden={viewModel.VisibilityClasses[VisibilityStyle.Hidden]}
          data-sf-invalid={viewModel.InvalidClass}
          {...dataAttributes}
          >
          {
            <>
              <ChangePasswordFormClient viewModel={viewModel} oldPasswordInputId={oldPasswordInputId} newPasswordInputId={newPasswordInputId} repeatPasswordInputId={repeatPasswordInputId} />
            </>
          }
        </div>
        {Tracer.endSpan(span)}
      </>
    );
}
