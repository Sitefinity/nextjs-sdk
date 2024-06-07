import { StyleGenerator } from '../styling/style-generator.service';
import { ExternalLoginBase } from '../external-login-base';
import { StylingConfig } from '../styling/styling-config';
import { PostRegistrationAction } from './interfaces/post-registration-action';
import { RegistrationFormClient } from './registration-form.client';
import { RequestContext } from '../../editor/request-context';
import { classNames } from '../../editor/utils/classNames';
import { getCustomAttributes, htmlAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { ExternalProvider } from '../../rest-sdk/dto/external-provider';
import { RegistrationSettingsDto } from '../../rest-sdk/dto/registration-settings';
import { RestClient, RestSdkTypes } from '../../rest-sdk/rest-client';
import { RootUrlService } from '../../rest-sdk/root-url.service';
import { RegistrationEntity } from './registration.entity';
import { RegistrationViewModel } from './interfaces/registration-view-model';
import { RestClientForContext } from '../../services/rest-client-for-context';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { VisibilityStyle } from '../styling/visibility-style';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

const EncryptedParam = 'qs';

const isAccountActivationRequest = (context: RequestContext) => {
    if (context && context.isLive && context.searchParams && context.searchParams[EncryptedParam]) {
        return true;
    }

    return false;
};


export async function Registration(props: WidgetContext<RegistrationEntity>) {
    const {span, ctx} = Tracer.traceWidget(props, true);
    const entity: RegistrationEntity = props.model.Properties;

    const context = props.requestContext;
    const dataAttributes = htmlAttributes(props);
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);

    dataAttributes['className'] = classNames(entity.CssClass, marginClass);

    const viewModel: RegistrationViewModel = populateViewModel(entity);

    if (entity.ExternalProviders && entity.ExternalProviders.length){
        const externalProviders = await RestClient.getExternalProviders(ctx);
        viewModel.ExternalProviders = externalProviders.filter((p: ExternalProvider) => entity.ExternalProviders?.indexOf(p.Name) !== -1);
    }

    viewModel.VisibilityClasses = StylingConfig.VisibilityClasses;
    viewModel.InvalidClass = StylingConfig.InvalidClass;

    const loginPage = await RestClientForContext.getItem<PageItem>(entity.LoginPage!, { type: RestSdkTypes.Pages, traceContext: ctx });
    if (loginPage) {
        viewModel.LoginPageUrl = loginPage.ViewUrl;
    }

    if (isAccountActivationRequest(context)) {
        viewModel.IsAccountActivationRequest = true;
        viewModel.Labels.ActivationMessage = entity.ActivationMessage;

        try {
            await RestClient.activateAccount(context.searchParams[EncryptedParam], ctx);
        } catch (ErrorCodeException) {
            viewModel.Labels.ActivationMessage = entity.ActivationFailMessage;
        }
    } else {
        if (entity.PostRegistrationAction === PostRegistrationAction.RedirectToPage) {
            const postRegistrationRedirectPage = await RestClientForContext.getItem<PageItem>(entity.PostRegistrationRedirectPage!, { type: RestSdkTypes.Pages, traceContext: ctx });
            if (postRegistrationRedirectPage) {
                viewModel.RedirectUrl = postRegistrationRedirectPage.ViewUrl;
            }

            viewModel.PostRegistrationAction = PostRegistrationAction.RedirectToPage;
        }

        const regSettings: RegistrationSettingsDto = await RestClient.getRegistrationSettings(ctx);
        viewModel.RequiresQuestionAndAnswer = regSettings.RequiresQuestionAndAnswer;
        viewModel.ActivationMethod = regSettings.ActivationMethod;
    }

    const labels = viewModel.Labels;
    const showSuccessMessage = context?.searchParams?.showSuccessMessage?.toLowerCase() === 'true';

    const formContainerServer = (<>
      {viewModel.LoginPageUrl && <div className="mt-3">{labels.LoginLabel}</div>}
      {viewModel.LoginPageUrl && <a href={viewModel.LoginPageUrl} className="text-decoration-none">{labels.LoginLink}</a>}

      {viewModel.ExternalProviders && viewModel.ExternalProviders.length &&

                    [<h3 key={100} className="mt-3">{labels.ExternalProvidersHeader}</h3>,
                        viewModel.ExternalProviders.map((provider: ExternalProvider, idx: number) => {
                            const providerClass = ExternalLoginBase.GetExternalLoginButtonCssClass(provider.Name);
                            const providerHref = ExternalLoginBase.GetExternalLoginPath(context, provider.Name);

                            return (
                              <a key={idx}
                                className={classNames('btn border fs-5 w-100 mt-2',providerClass)}
                                href={providerHref}>{provider.Value}</a>
                            );
                        })
                    ]
                }

      <input type="hidden" name="RedirectUrl" defaultValue={viewModel.RedirectUrl} />
      <input type="hidden" name="PostRegistrationAction" defaultValue={viewModel.PostRegistrationAction} />
      <input type="hidden" name="ActivationMethod" defaultValue={viewModel.ActivationMethod} />
      <input type="hidden" name="ValidationRequiredMessage" value={labels.ValidationRequiredMessage} />
      <input type="hidden" name="ValidationMismatchMessage" value={labels.ValidationMismatchMessage} />
      <input type="hidden" name="ValidationInvalidEmailMessage" value={labels.ValidationInvalidEmailMessage} />
    </>);

    const confirmServer = (<>
      <input type="hidden" name="ResendConfirmationEmailUrl" value={viewModel.ResendConfirmationEmailHandlerPath} />
      <input type="hidden" name="ActivationLinkLabel" value={labels.ActivationLinkLabel} />
      <input type="hidden" name="SendAgainLink" value={labels.SendAgainLink} />
      <input type="hidden" name="SendAgainLabel" value={labels.SendAgainLabel} />
    </>);

    const customAttributes = getCustomAttributes(entity.Attributes, 'Registration');

    return (
      <>
        <div
          data-sf-invalid={viewModel.InvalidClass}
          data-sf-role="sf-registration-container"
          data-sf-visibility-hidden={viewModel.VisibilityClasses[VisibilityStyle.Hidden]}
          {...dataAttributes}
          {...customAttributes}
          >
          {viewModel.IsAccountActivationRequest && <h2 className="mb-3">
              {labels.ActivationMessage}
          </h2>
          }
          {showSuccessMessage && <h3>{labels.SuccessHeader}</h3>}
          {showSuccessMessage && <p>{labels.SuccessLabel}</p>}
          {
              !showSuccessMessage &&
              <>

                <RegistrationFormClient
                  action={viewModel.RegistrationHandlerPath}
                  viewModel={viewModel}
                  context={context}
                  formContainerServer={formContainerServer}
                  confirmServer={confirmServer}
                     />
              </>
          }
        </div>
        {Tracer.endSpan(span)}
      </>
    );
}

function populateViewModel(entity: RegistrationEntity): RegistrationViewModel {
    return {
        RegistrationHandlerPath: `${RootUrlService.getClientServiceUrl()}/Registration`,
        ResendConfirmationEmailHandlerPath: `${RootUrlService.getClientServiceUrl()}/ResendConfirmationEmail`,
        ExternalLoginHandlerPath: '/sitefinity/external-login-handler',
        Attributes: entity.Attributes!,
        PostRegistrationAction: entity.PostRegistrationAction,
        Labels: {
            Header: entity.Header,
            FirstNameLabel: entity.FirstNameLabel,
            LastNameLabel: entity.LastNameLabel,
            EmailLabel: entity.EmailLabel,
            PasswordLabel: entity.PasswordLabel,
            RepeatPasswordLabel: entity.RepeatPasswordLabel,
            SecretQuestionLabel: entity.SecretQuestionLabel,
            SecretAnswerLabel: entity.SecretAnswerLabel,
            RegisterButtonLabel: entity.RegisterButtonLabel,
            ActivationLinkHeader: entity.ActivationLinkHeader,
            ActivationLinkLabel: entity.ActivationLinkLabel,
            SendAgainLink: entity.SendAgainLink,
            SendAgainLabel: entity.SendAgainLabel,
            SuccessHeader: entity.SuccessHeader,
            SuccessLabel: entity.SuccessLabel,
            LoginLabel: entity.LoginLabel,
            LoginLink: entity.LoginLink,
            ExternalProvidersHeader: entity.ExternalProvidersHeader,
            ValidationRequiredMessage: entity.ValidationRequiredMessage,
            ValidationMismatchMessage: entity.ValidationMismatchMessage,
            ValidationInvalidEmailMessage: entity.ValidationInvalidEmailMessage
        }
    };
}
