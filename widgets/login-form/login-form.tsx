import { StylingConfig } from '../styling/styling-config';
import { PostLoginAction } from './interfaces/post-login-action';
import { LoginFormEntity } from './login-form.entity';
import { WidgetContext, getMinimumWidgetContext } from '../../editor/widget-framework/widget-context';
import { ExternalProvider } from '../../rest-sdk/dto/external-provider';
import { LoginFormViewProps } from './interfaces/login-form.view-props';
import { RestClient, RestSdkTypes } from '../../rest-sdk/rest-client';
import { RestClientForContext } from '../../services/rest-client-for-context';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { RenderView } from '../common/render-view';
import { LoginFormDefaultView } from './login-form.view';
import { getCustomAttributes, htmlAttributes } from '../../editor/widget-framework/attributes';
import { StyleGenerator } from '../styling/style-generator.service';
import { classNames } from '../../editor/utils/classNames';

export async function LoginForm(props: WidgetContext<LoginFormEntity>) {
    const {span, ctx} = Tracer.traceWidget(props, true);
    const entity: LoginFormEntity = props.model.Properties;
    const viewProps: LoginFormViewProps<LoginFormEntity> = populateviewProps(entity, props);

    if (entity.ExternalProviders && entity.ExternalProviders.length) {
        const externalProviders = await RestClient.getExternalProviders(ctx);
        viewProps.externalProviders = externalProviders.filter((p: ExternalProvider) => entity.ExternalProviders?.indexOf(p.Name) !== -1);
    }

    try {
        if (entity.PostLoginAction === PostLoginAction.RedirectToPage) {
            const postLoginRedirectPage = await RestClientForContext.getItem<PageItem>(entity.PostLoginRedirectPage!, { type: RestSdkTypes.Pages, culture: props.requestContext.culture, traceContext: ctx });
            if (postLoginRedirectPage) {
                viewProps.redirectUrl = postLoginRedirectPage.ViewUrl;
            }
        }
    } catch { /* empty */ };

    try {
        const registrationPage = await RestClientForContext.getItem<PageItem>(entity.RegistrationPage!, { type: RestSdkTypes.Pages, culture: props.requestContext.culture, traceContext: ctx });
        if (registrationPage) {
            viewProps.registrationLink = registrationPage.ViewUrl;
        }
    } catch { /* empty */ };

    try {
        const resetPasswordPage = await RestClientForContext.getItem<PageItem>(entity.ResetPasswordPage!, { type: RestSdkTypes.Pages, culture: props.requestContext.culture, traceContext: ctx });
        if (resetPasswordPage) {
            viewProps.forgottenPasswordLink = resetPasswordPage.ViewUrl;
        }
    } catch { /* empty */ };

    return (
      <RenderView
        viewName={entity.SfViewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <LoginFormDefaultView {...viewProps}/>
      </RenderView>
    );
}

// TODO: figure out login handler path generation
function populateviewProps(entity: LoginFormEntity, widgetContext: WidgetContext<LoginFormEntity>): LoginFormViewProps<LoginFormEntity> {
    const dataAttributes = htmlAttributes(widgetContext);
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);
    dataAttributes['className'] = classNames(entity.CssClass, marginClass);
    const customAttributes = getCustomAttributes(entity.Attributes, 'LoginForm');

    return {
        loginHandlerPath: '/sitefinity/login-handler',
        rememberMe: entity.RememberMe,
        membershipProviderName: entity.MembershipProviderName,
        visibilityClasses: StylingConfig.VisibilityClasses,
        invalidClass: StylingConfig.InvalidClass,
        labels: {
            emailLabel: entity.EmailLabel,
            errorMessage: entity.ErrorMessage,
            externalProvidersHeader: entity.ExternalProvidersHeader,
            forgottenPasswordLinkLabel: entity.ForgottenPasswordLinkLabel,
            header: entity.Header,
            notRegisteredLabel: entity.NotRegisteredLabel,
            passwordLabel: entity.PasswordLabel,
            registerLinkText: entity.RegisterLinkText,
            rememberMeLabel: entity.RememberMeLabel,
            submitButtonLabel: entity.SubmitButtonLabel,
            validationInvalidEmailMessage: entity.ValidationInvalidEmailMessage,
            validationRequiredMessage: entity.ValidationRequiredMessage
        },
        attributes: {...dataAttributes, ...customAttributes},
        widgetContext: getMinimumWidgetContext(widgetContext)
    };

}

