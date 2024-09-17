import { StylingConfig } from '../styling/styling-config';
import { PostRegistrationAction } from './interfaces/post-registration-action';
import { WidgetContext, getMinimumWidgetContext } from '../../editor/widget-framework/widget-context';
import { ExternalProvider } from '../../rest-sdk/dto/external-provider';
import { ActivationMethod } from '../../rest-sdk/dto/registration-settings';
import { RestClient, RestSdkTypes } from '../../rest-sdk/rest-client';
import { RootUrlService } from '../../rest-sdk/root-url.service';
import { RegistrationEntity } from './registration.entity';
import { RegistrationViewProps } from './interfaces/registration.view-props';
import { RestClientForContext } from '../../services/rest-client-for-context';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { getHostServerContext } from '../../services/server-context';
import { RenderView } from '../common/render-view';
import { RegistrationDefaultView } from './registration.view';
import { getCustomAttributes, htmlAttributes } from '../../editor/widget-framework/attributes';
import { classNames } from '../../editor/utils/classNames';
import { StyleGenerator } from '../styling/style-generator.service';
import { Dictionary } from '../../typings/dictionary';
import { VisibilityStyle } from '../styling/visibility-style';

export async function Registration(props: WidgetContext<RegistrationEntity>) {
    const {span, ctx} = Tracer.traceWidget(props, true);
    const entity: RegistrationEntity = props.model.Properties;
    const context = props.requestContext;
    const viewProps: RegistrationViewProps<RegistrationEntity> = populateViewProps(entity, props);

    if (entity.ExternalProviders && entity.ExternalProviders.length){
        const externalProviders = await RestClient.getExternalProviders({ traceContext: ctx });
        viewProps.externalProviders = externalProviders.filter((p: ExternalProvider) => entity.ExternalProviders?.indexOf(p.Name) !== -1);
    }

    try {
        const loginPage = await RestClientForContext.getItem<PageItem>(entity.LoginPage!, { type: RestSdkTypes.Pages, culture: props.requestContext.culture, traceContext: ctx });
        if (loginPage) {
            viewProps.loginPageUrl = loginPage.ViewUrl;
        }
    } catch (error) { /* empty */ }

    if (context.isLive) {
      const host = getHostServerContext() || RootUrlService.getServerCmsUrl();
      viewProps.activationPageUrl = host + '/' + context.url;
    }

    if (entity.PostRegistrationAction === PostRegistrationAction.RedirectToPage) {
        try {
            const postRegistrationRedirectPage = await RestClientForContext.getItem<PageItem>(entity.PostRegistrationRedirectPage!, { type: RestSdkTypes.Pages, culture: context.culture });
            if (postRegistrationRedirectPage) {
                viewProps.redirectUrl = postRegistrationRedirectPage.ViewUrl;
            }
        } catch (error) { /* empty */ }
    }

    const regSettings = await RestClient.getRegistrationSettings({ traceContext: ctx });
    if (regSettings.ActivationMethod === ActivationMethod.AfterConfirmation && !regSettings.SmtpConfigured) {
        viewProps.warning = 'Confirmation email cannot be sent because the system has not been configured to send emails. Configure SMTP settings or contact your administrator for assistance.';
    }
    viewProps.requiresQuestionAndAnswer = regSettings.RequiresQuestionAndAnswer;
    viewProps.activationMethod = regSettings.ActivationMethod;

    return (
      <RenderView
        viewName={entity.SfViewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <RegistrationDefaultView {...viewProps}/>
      </RenderView>
    );
}

function populateViewProps(entity: RegistrationEntity, widgetContext: WidgetContext<RegistrationEntity>): RegistrationViewProps<RegistrationEntity> {
    const dataAttributes = htmlAttributes(widgetContext);
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);
    dataAttributes['className'] = classNames(entity.CssClass, marginClass);
    const customAttributes = getCustomAttributes(entity.Attributes, 'Registration');
    const widgetAttributes: Dictionary = {
        ['data-sf-invalid']: StylingConfig.InvalidClass,
        ['data-sf-role']: 'sf-registration-container',
        ['data-sf-visibility-hidden']: StylingConfig.VisibilityClasses[VisibilityStyle.Hidden]
    };

    return {
        registrationHandlerPath: `/${RootUrlService.getWebServicePath()}/Registration`,
        resendConfirmationEmailHandlerPath: `/${RootUrlService.getWebServicePath()}/ResendConfirmationEmail`,
        externalLoginHandlerPath: '/sitefinity/external-login-handler',
        postRegistrationAction: entity.PostRegistrationAction,
        labels: {
            header: entity.Header,
            firstNameLabel: entity.FirstNameLabel,
            lastNameLabel: entity.LastNameLabel,
            emailLabel: entity.EmailLabel,
            passwordLabel: entity.PasswordLabel,
            repeatPasswordLabel: entity.RepeatPasswordLabel,
            secretQuestionLabel: entity.SecretQuestionLabel,
            secretAnswerLabel: entity.SecretAnswerLabel,
            registerButtonLabel: entity.RegisterButtonLabel,
            activationLinkHeader: entity.ActivationLinkHeader,
            activationLinkLabel: entity.ActivationLinkLabel,
            sendAgainLink: entity.SendAgainLink,
            sendAgainLabel: entity.SendAgainLabel,
            successHeader: entity.SuccessHeader,
            successLabel: entity.SuccessLabel,
            loginLabel: entity.LoginLabel,
            loginLink: entity.LoginLink,
            externalProvidersHeader: entity.ExternalProvidersHeader,
            validationRequiredMessage: entity.ValidationRequiredMessage,
            validationMismatchMessage: entity.ValidationMismatchMessage,
            validationInvalidEmailMessage: entity.ValidationInvalidEmailMessage
        },
        visibilityClasses: StylingConfig.VisibilityClasses,
        invalidClass: StylingConfig.InvalidClass,
        attributes: {...dataAttributes, ...customAttributes, ...widgetAttributes},
        widgetContext: getMinimumWidgetContext(widgetContext)
    };
}
