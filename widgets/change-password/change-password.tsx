import React from 'react';
import { StyleGenerator } from '../styling/style-generator.service';
import { PostPasswordChangeAction } from './interfaces/post-password-change-action';
import { StylingConfig } from '../styling/styling-config';
import { ChangePasswordFormClient } from './change-password-form.client';
import { VisibilityStyle } from '../styling/visibility-style';
import { ChangePasswordViewModel } from './interfaces/change-password-view-model';
import { UserDto } from '../../rest-sdk/dto/user-item';
import { classNames } from '../../editor/utils/classNames';
import { htmlAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { RestClient, RestSdkTypes } from '../../rest-sdk/rest-client';
import { RootUrlService } from '../../rest-sdk/root-url.service';
import { ChangePasswordEntity } from './change-password.entity';
import { RestClientForContext } from '../../services/rest-client-for-context';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

export async function ChangePassword(props: WidgetContext<ChangePasswordEntity>) {
    const {span, ctx} = Tracer.traceWidget(props, true);
    const entity = props.model.Properties;

    const dataAttributes = htmlAttributes(props);
    const defaultClass =  entity.CssClass;
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);

    dataAttributes['className'] = classNames(defaultClass, marginClass);

    const viewModel: ChangePasswordViewModel = {
        ChangePasswordHandlerPath: `${RootUrlService.getClientServiceUrl()}/ChangePassword`,
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
        }
    };

    const user: UserDto = await RestClient.getCurrentUser(ctx);
    viewModel.ExternalProviderName = user?.ExternalProviderName;

    if (entity.PostPasswordChangeAction === PostPasswordChangeAction.RedirectToPage) {
        const item = await RestClientForContext.getItem<PageItem>(entity.PostPasswordChangeRedirectPage!, { type: RestSdkTypes.Pages, traceContext: ctx });
        viewModel.RedirectUrl = item.ViewUrl;
    } else {
        viewModel.PostPasswordChangeMessage = entity.PostPasswordChangeMessage;
    }

    const hasUser = (user && user.IsAuthenticated);
    const labels = viewModel.Labels;

    return (
      <>
        <div
          data-sf-role="sf-change-password-container"
          data-sf-visibility-hidden={viewModel.VisibilityClasses[VisibilityStyle.Hidden]}
          data-sf-invalid={viewModel.InvalidClass}
          {...dataAttributes}
          >
          { !hasUser
          ? <div className="alert alert-danger my-3">{labels.LoginFirstMessage}</div>
          : viewModel.ExternalProviderName
          ? <div>{`${labels.ExternalProviderMessageFormat}${viewModel.ExternalProviderName}`}</div>
          :  <>
            <ChangePasswordFormClient
              viewModel={viewModel} />
            <input type="hidden" name="redirectUrl" value={viewModel.RedirectUrl} />
            <input type="hidden" name="postChangeMessage" value={viewModel.PostPasswordChangeMessage} />
            <input type="hidden" name="postChangeAction" value={viewModel.PostPasswordChangeAction} />
            <input type="hidden" name="validationRequiredMessage" value={labels.ValidationRequiredMessage} />
            <input type="hidden" name="validationMismatchMessage" value={labels.ValidationMismatchMessage} />
          </>
          }
        </div>
        {Tracer.endSpan(span)}
      </>
    );
}
