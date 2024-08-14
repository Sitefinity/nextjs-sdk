import { PostPasswordChangeAction } from './interfaces/post-password-change-action';
import { StylingConfig } from '../styling/styling-config';
import { ChangePasswordViewProps } from './interfaces/change-password.view-props';
import { WidgetContext, getMinimumWidgetContext } from '../../editor/widget-framework/widget-context';
import { RestSdkTypes } from '../../rest-sdk/rest-client';
import { RootUrlService } from '../../rest-sdk/root-url.service';
import { ChangePasswordEntity } from './change-password.entity';
import { RestClientForContext } from '../../services/rest-client-for-context';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { RenderView } from '../common/render-view';
import { ChangePasswordDefaultView } from './change-password.view';
import { getCustomAttributes, htmlAttributes } from '../../editor/widget-framework/attributes';
import { StyleGenerator } from '../styling/style-generator.service';
import { classNames } from '../../editor/utils/classNames';
import { Dictionary } from '../../typings/dictionary';
import { VisibilityStyle } from '../styling/visibility-style';

export async function ChangePassword(props: WidgetContext<ChangePasswordEntity>) {
    const {span, ctx} = Tracer.traceWidget(props, true);
    const entity = props.model.Properties;

    const dataAttributes = htmlAttributes(props);
    const defaultClass =  entity.CssClass;
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);

    dataAttributes['className'] = classNames(defaultClass, marginClass);
    const widgetAttributes: Dictionary = {
      ['data-sf-role']: 'sf-change-password-container',
      ['data-sf-visibility-hidden']: StylingConfig.VisibilityClasses[VisibilityStyle.Hidden],
      ['data-sf-invalid']: StylingConfig.InvalidClass
    };

    const viewProps: ChangePasswordViewProps<ChangePasswordEntity> = {
        changePasswordHandlerPath: `/${RootUrlService.getWebServicePath()}/ChangePassword`,
        visibilityClasses: StylingConfig.VisibilityClasses,
        invalidClass: StylingConfig.InvalidClass,
        postPasswordChangeAction: entity.PostPasswordChangeAction,
        labels: {
          header: entity.Header,
          oldPassword: entity.CurrentPassword,
          newPassword: entity.NewPassword,
          repeatPassword: entity.ConfirmPassword,
          submitButtonLabel: entity.SubmitButtonLabel,
          loginFirstMessage: entity.LoginFirstMessage,
          validationRequiredMessage: entity.ValidationRequiredMessage,
          validationMismatchMessage: entity.ValidationMismatchMessage,
          externalProviderMessageFormat: entity.ExternalProviderMessageFormat
        },
        isLive: props.requestContext.isLive,
        attributes: {...dataAttributes, ...getCustomAttributes(entity.Attributes, 'ChangePassword'), ...widgetAttributes},
        widgetContext: getMinimumWidgetContext(props)
    };

    if (entity.PostPasswordChangeAction === PostPasswordChangeAction.RedirectToPage) {
      try {
        const item = await RestClientForContext.getItem<PageItem>(entity.PostPasswordChangeRedirectPage!, { type: RestSdkTypes.Pages, culture: props.requestContext.culture, traceContext: ctx });
        viewProps.redirectUrl = item.ViewUrl;
      } catch (error) { /* empty */ }
    } else {
        viewProps.postPasswordChangeMessage = entity.PostPasswordChangeMessage;
    }

    return (
      <RenderView
        viewName={entity.SfViewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <ChangePasswordDefaultView {...viewProps}/>
      </RenderView>
    );
}
