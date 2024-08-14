import { StylingConfig } from '../styling/styling-config';
import { WidgetContext, getMinimumWidgetContext } from '../../editor/widget-framework/widget-context';
import { RestSdkTypes, RestClient } from '../../rest-sdk/rest-client';
import { RootUrlService } from '../../rest-sdk/root-url.service';
import { ResetPasswordEntity } from './reset-password.entity';
import { ResetPasswordViewProps } from './interfaces/reset-password.view-props';
import { RequestContext } from '../../editor/request-context';
import { RestClientForContext } from '../../services/rest-client-for-context';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { getHostServerContext } from '../../services/server-context';
import { RenderView } from '../common/render-view';
import { ResetPasswordDefaultTemplate } from './reset-password.view';
import { getCustomAttributes, htmlAttributes } from '../../editor/widget-framework/attributes';
import { StyleGenerator } from '../styling/style-generator.service';
import { classNames } from '../../editor/utils/classNames';

const PasswordRecoveryQueryStringKey = 'vk';

const isResetPasswordRequest = (context: RequestContext) => {
    if (context.isLive) {
        if (context.searchParams[PasswordRecoveryQueryStringKey]) {
            return true;
        }
    }

    return false;
};

export async function ResetPassword(props: WidgetContext<ResetPasswordEntity>) {
  const {span, ctx} = Tracer.traceWidget(props, true);
  const entity = props.model.Properties;
  const context = props.requestContext;

  const viewProps: ResetPasswordViewProps<ResetPasswordEntity> = populateViewProps(entity, props);

  try {
    const loginPage = await RestClientForContext.getItem<PageItem>(entity.LoginPage!, { type: RestSdkTypes.Pages, culture: props.requestContext.culture, traceContext: ctx });
    if (loginPage) {
      viewProps.loginPageUrl = loginPage.ViewUrl;
    }
  } catch (error) { /* empty */ }

  if (context.isLive) {
      const host = getHostServerContext() || RootUrlService.getServerCmsUrl();
      viewProps.resetPasswordUrl = host + '/' + context.url;
  }

  const queryList = new URLSearchParams(context.searchParams);
  const queryString = '?' + queryList.toString();
  viewProps.securityToken = queryString;

  if (isResetPasswordRequest(context)) {
      viewProps.isResetPasswordRequest = true;

      try {
          const resetPasswordModel: any = await RestClient.getResetPasswordModel(queryString, ctx);
          viewProps.requiresQuestionAndAnswer = resetPasswordModel.RequiresQuestionAndAnswer;
          viewProps.securityQuestion = resetPasswordModel.SecurityQuestion;
      } catch (Exception) {
          // In terms of security, if there is some error with the user get, we display common error message to the user.
          viewProps.error = true;
      }
  }

  return (
    <RenderView
      viewName={entity.SfViewName}
      widgetKey={props.model.Name}
      traceSpan={span}
      viewProps={viewProps}>
      <ResetPasswordDefaultTemplate {...viewProps}/>
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
        attributes: {...dataAttributes, ...customAttributes},
        widgetContext: getMinimumWidgetContext(widgetContext)
    };
}
