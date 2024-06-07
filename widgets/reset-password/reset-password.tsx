import { StyleGenerator } from '../styling/style-generator.service';
import { StylingConfig } from '../styling/styling-config';
import { ForgottenPasswordFormClient } from './forgotten-password-form.client';
import { ResetPasswardFormClient } from './reset-password-form.client';
import { classNames } from '../../editor/utils/classNames';
import { htmlAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { RestSdkTypes, RestClient } from '../../rest-sdk/rest-client';
import { RootUrlService } from '../../rest-sdk/root-url.service';
import { ResetPasswordEntity } from './reset-password.entity';
import { ResetPasswordFormViewModel } from './interfaces/reset-password-form-view-model';
import { RequestContext } from '../../editor/request-context';
import { RestClientForContext } from '../../services/rest-client-for-context';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

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
  const dataAttributes = htmlAttributes(props);
  const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);

  dataAttributes['className'] = classNames(entity.CssClass, marginClass);

  const viewModel: ResetPasswordFormViewModel = populateViewModel(entity);

  const loginPage = await RestClientForContext.getItem<PageItem>(entity.LoginPage!, { type: RestSdkTypes.Pages, traceContext: ctx });
  if (loginPage) {
      viewModel.LoginPageUrl = loginPage.ViewUrl;
  }

  const queryList = new URLSearchParams(context.searchParams);
  const queryString = '?' + queryList.toString();

  if (isResetPasswordRequest(context)) {
      viewModel.IsResetPasswordRequest = true;

      try {
          const resetPasswordModel: any = await RestClient.getResetPasswordModel(queryString, ctx);
          viewModel.RequiresQuestionAndAnswer = resetPasswordModel.RequiresQuestionAndAnswer;
          viewModel.SecurityQuestion = resetPasswordModel.SecurityQuestion;
      } catch (Exception) {
          // In terms of security, if there is some error with the user get, we display common error message to the user.
          viewModel.Error = true;
      }
  }

  const labels = viewModel.Labels!;
  return (
    <>
      <div {...dataAttributes}>
        {viewModel.IsResetPasswordRequest ?
          <div data-sf-role="sf-reset-password-container">
            {viewModel.Error || (viewModel.RequiresQuestionAndAnswer && !viewModel.SecurityQuestion) ?
              <>
                <h2>{labels.ResetPasswordHeader}</h2>
                <div data-sf-role="error-message-container" className="alert alert-danger" role="alert" aria-live="assertive">{labels.ErrorMessage}</div>
              </>
              :
              <ResetPasswardFormClient viewModel={viewModel} context={context} />
            }
          </div>
      : <div data-sf-role="sf-forgotten-password-container">
        <h2 className="mb-3">{labels.ForgottenPasswordHeader}</h2>
        <ForgottenPasswordFormClient viewModel={viewModel} context={context} />
        {viewModel.LoginPageUrl &&
          <a href={viewModel.LoginPageUrl} className="text-decoration-none">{labels.BackLinkLabel}</a>
        }
      </div>
      }
      </div>
      {Tracer.endSpan(span)}
    </>
  );
}

function populateViewModel(entity: ResetPasswordEntity): ResetPasswordFormViewModel {
    return {
        Attributes: entity.Attributes,
        ResetUserPasswordHandlerPath: `${RootUrlService.getClientServiceUrl()}}/ResetUserPassword`,
        SendResetPasswordEmailHandlerPath: `${RootUrlService.getClientServiceUrl()}/SendResetPasswordEmail`,
        VisibilityClasses: StylingConfig.VisibilityClasses,
        InvalidClass: StylingConfig.InvalidClass,
        Labels: {
            ResetPasswordHeader: entity.ResetPasswordHeader,
            NewPasswordLabel: entity.NewPasswordLabel,
            RepeatNewPasswordLabel: entity.RepeatNewPasswordLabel,
            SecurityQuestionLabel: entity.SecurityQuestionLabel,
            SaveButtonLabel: entity.SaveButtonLabel,
            BackLinkLabel: entity.BackLinkLabel,
            SuccessMessage: entity.SuccessMessage,
            ErrorMessage: entity.ErrorMessage,
            AllFieldsAreRequiredErrorMessage: entity.AllFieldsAreRequiredErrorMessage,
            PasswordsMismatchErrorMessage: entity.PasswordsMismatchErrorMessage,
            ForgottenPasswordHeader: entity.ForgottenPasswordHeader,
            EmailLabel: entity.EmailLabel,
            ForgottenPasswordLinkMessage: entity.ForgottenPasswordLinkMessage,
            ForgottenPasswordSubmitMessage: entity.ForgottenPasswordSubmitMessage,
            SendButtonLabel: entity.SendButtonLabel,
            ForgottenPasswordLabel: entity.ForgottenPasswordLabel,
            InvalidEmailFormatMessage: entity.InvalidEmailFormatMessage,
            FieldIsRequiredMessage: entity.FieldIsRequiredMessage
        }
    };
}
