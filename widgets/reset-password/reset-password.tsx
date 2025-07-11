import { StylingConfig } from '../styling/styling-config';
import { WidgetContext, getMinimumWidgetContext } from '../../editor/widget-framework/widget-context';
import { RestSdkTypes, RestClient } from '../../rest-sdk/rest-client';
import { RootUrlService } from '../../rest-sdk/root-url.service';
import { ResetPasswordEntity } from './reset-password.entity';
import { ResetPasswordViewProps } from './interfaces/reset-password.view-props';
import { RestClientForContext } from '../../services/rest-client-for-context';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { getHostServerContext } from '../../services/server-context';
import { RenderView } from '../common/render-view';
import { ResetPasswordDefaultTemplate } from './reset-password.view';
import { getCustomAttributes, htmlAttributes, setWarning } from '../../editor/widget-framework/attributes';
import { StyleGenerator } from '../styling/style-generator.service';
import { classNames } from '../../editor/utils/classNames';

export async function ResetPassword(props: WidgetContext<ResetPasswordEntity>) {
  const { span, ctx } = Tracer.traceWidget(props, true);
  const entity = props.model.Properties;
  const context = props.requestContext;

  const viewProps: ResetPasswordViewProps<ResetPasswordEntity> = populateViewProps(entity, props);

  try {
    const loginPage = await RestClientForContext.getItem<PageItem>(entity.LoginPage!, { type: RestSdkTypes.Pages, culture: props.requestContext.culture, traceContext: ctx });
    if (loginPage) {
      viewProps.loginPageUrl = loginPage.ViewUrl;
    }
  } catch (error) { /* empty */ }

  try {
    const registrationPage = await RestClientForContext.getItem<PageItem>(entity.RegistrationPage!, { type: RestSdkTypes.Pages, culture: props.requestContext.culture, traceContext: ctx });
    if (registrationPage) {
      viewProps.registrationPageUrl = registrationPage.ViewUrl;
    }
  } catch (error) { /* empty */ }

  if (context.isLive) {
    const host = getHostServerContext() || RootUrlService.getServerCmsUrl();
    viewProps.resetPasswordUrl = host + '/' + context.url;
  }

  const regSettings = await RestClient.getRegistrationSettings({ traceContext: ctx });
  if (!regSettings.SmtpConfigured) {
      const warning = 'Confirmation email cannot be sent because the system has not been configured to send emails. Configure SMTP settings or contact your administrator for assistance.';
      setWarning(viewProps.attributes, warning);
    }

  return (
    <RenderView
      viewName={entity.SfViewName}
      widgetKey={props.model.Name}
      traceSpan={span}
      viewProps={viewProps}>
      <ResetPasswordDefaultTemplate {...viewProps} />
    </RenderView>
  );
}

function populateViewProps(entity: ResetPasswordEntity, widgetContext: WidgetContext<ResetPasswordEntity>): ResetPasswordViewProps<ResetPasswordEntity> {
  const dataAttributes = htmlAttributes(widgetContext);
  const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);
  dataAttributes['className'] = classNames(entity.CssClass, marginClass);
  const customAttributes = getCustomAttributes(entity.Attributes, 'ResetPassword');

  return {
    resetUserPasswordHandlerPath: `/${RootUrlService.getWebServicePath()}/ResetUserPassword`,
    sendResetPasswordEmailHandlerPath: `/${RootUrlService.getWebServicePath()}/SendResetPasswordEmail`,
    visibilityClasses: StylingConfig.VisibilityClasses,
    invalidClass: StylingConfig.InvalidClass,
    membershipProviderName: entity.MembershipProviderName,
    labels: {
      resetPasswordHeader: entity.ResetPasswordHeader,
      newPasswordLabel: entity.NewPasswordLabel,
      repeatNewPasswordLabel: entity.RepeatNewPasswordLabel,
      securityQuestionLabel: entity.SecurityQuestionLabel,
      saveButtonLabel: entity.SaveButtonLabel,
      backLinkLabel: entity.BackLinkLabel,
      successMessage: entity.SuccessMessage,
      errorMessage: entity.ErrorMessage,
      allFieldsAreRequiredErrorMessage: entity.AllFieldsAreRequiredErrorMessage,
      passwordsMismatchErrorMessage: entity.PasswordsMismatchErrorMessage,
      forgottenPasswordHeader: entity.ForgottenPasswordHeader,
      emailLabel: entity.EmailLabel,
      forgottenPasswordLinkMessage: entity.ForgottenPasswordLinkMessage,
      forgottenPasswordSubmitMessage: entity.ForgottenPasswordSubmitMessage,
      sendButtonLabel: entity.SendButtonLabel,
      forgottenPasswordLabel: entity.ForgottenPasswordLabel,
      invalidEmailFormatMessage: entity.InvalidEmailFormatMessage,
      fieldIsRequiredMessage: entity.FieldIsRequiredMessage
    },
    webserviceApiKey: widgetContext.requestContext.webserviceApiKey,
    attributes: { ...dataAttributes, ...customAttributes },
    widgetContext: getMinimumWidgetContext(widgetContext)
  };
}
