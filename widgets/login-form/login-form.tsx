import React from 'react';
import { ExternalLoginBase } from '../external-login-base';
import { StyleGenerator } from '../styling/style-generator.service';
import { StylingConfig } from '../styling/styling-config';
import { LoginFormClient } from './login-form.client';
import { PostLoginAction } from './interfaces/post-login-action';
import { LoginFormEntity } from './login-form.entity';
import { VisibilityStyle } from '../styling/visibility-style';
import { classNames } from '../../editor/utils/classNames';
import { getCustomAttributes, htmlAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { ExternalProvider } from '../../rest-sdk/dto/external-provider';
import { LoginFormViewModel } from './interfaces/login-form-view-model';
import { RestClient, RestSdkTypes } from '../../rest-sdk/rest-client';
import { RestClientForContext } from '../../services/rest-client-for-context';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { getUniqueId } from '../../editor/utils/getUniqueId';

export async function LoginForm(props: WidgetContext<LoginFormEntity>) {
    const {span, ctx} = Tracer.traceWidget(props, true);
    const entity: LoginFormEntity = props.model.Properties;
    const context = props.requestContext;
    const dataAttributes = htmlAttributes(props);
    const defaultClass =  entity.CssClass;
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);
    const usernameInputId = getUniqueId('sf-username-');
    const passwordInputId = getUniqueId('sf-password-');
    const rememberInputId = getUniqueId('sf-remember-');

    dataAttributes['className'] = classNames(defaultClass, marginClass);

    const viewModel: LoginFormViewModel = populateViewModel(entity);

    if (entity.ExternalProviders && entity.ExternalProviders.length) {
        const externalProviders = await RestClient.getExternalProviders(ctx);
        viewModel.ExternalProviders = externalProviders.filter((p: ExternalProvider) => entity.ExternalProviders?.indexOf(p.Name) !== -1);
    }

    if (entity.PostLoginAction === PostLoginAction.RedirectToPage) {
        const postLoginRedirectPage = await RestClientForContext.getItem<PageItem>(entity.PostLoginRedirectPage!, { type: RestSdkTypes.Pages, traceContext: ctx });
        if (postLoginRedirectPage) {
            viewModel.RedirectUrl =  postLoginRedirectPage.ViewUrl;
        }
    }

    const registrationPage = await RestClientForContext.getItem<PageItem>(entity.RegistrationPage!, { type: RestSdkTypes.Pages, traceContext: ctx });
    if (registrationPage) {
        viewModel.RegistrationLink = registrationPage.ViewUrl;
    }

    const resetPasswordPage = await RestClientForContext.getItem<PageItem>(entity.ResetPasswordPage!, { type: RestSdkTypes.Pages, traceContext: ctx });
    if (resetPasswordPage) {
        viewModel.ForgottenPasswordLink = resetPasswordPage.ViewUrl;
    }

    const customAttributes = getCustomAttributes(entity.Attributes, 'LoginForm');

    return (
      <>
        <div
          data-sf-invalid={viewModel.InvalidClass}
          data-sf-role="sf-login-form-container"
          data-sf-visibility-hidden={viewModel.VisibilityClasses[VisibilityStyle.Hidden]}
          {...dataAttributes}
          {...customAttributes}>
          <LoginFormClient viewModel={viewModel} context={context} usernameInputId={usernameInputId} passwordInputId={passwordInputId} rememberInputId={rememberInputId} />
        </div>
        {Tracer.endSpan(span)}
      </>
    );
}

// TODO: figure out login handler path generation
function populateViewModel(entity: LoginFormEntity): LoginFormViewModel {
    return {
        LoginHandlerPath: '/sitefinity/login-handler',
        RememberMe: entity.RememberMe,
        MembershipProviderName: entity.MembershipProviderName,
        Attributes: entity.Attributes,
        VisibilityClasses: StylingConfig.VisibilityClasses,
        InvalidClass: StylingConfig.InvalidClass,
        Labels: {
            EmailLabel: entity.EmailLabel,
            ErrorMessage: entity.ErrorMessage,
            ExternalProvidersHeader: entity.ExternalProvidersHeader,
            ForgottenPasswordLinkLabel: entity.ForgottenPasswordLinkLabel,
            Header: entity.Header,
            NotRegisteredLabel: entity.NotRegisteredLabel,
            PasswordLabel: entity.PasswordLabel,
            RegisterLinkText: entity.RegisterLinkText,
            RememberMeLabel: entity.RememberMeLabel,
            SubmitButtonLabel: entity.SubmitButtonLabel,
            ValidationInvalidEmailMessage: entity.ValidationInvalidEmailMessage,
            ValidationRequiredMessage: entity.ValidationRequiredMessage
        }
    };

}

