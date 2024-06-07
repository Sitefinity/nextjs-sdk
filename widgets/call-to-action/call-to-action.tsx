import { StyleGenerator } from '../styling/style-generator.service';
import { CallToActionEntity } from './call-to-action.entity';
import { CallToActionLink } from './call-to-action-link';
import { htmlAttributes, generateAnchorAttrsFromLink, getCustomAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { classNames } from '../../editor/utils/classNames';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

export type CTAPart = 'Wrapper' | 'Primary' | 'Secondary';

export async function CallToAction(props: WidgetContext<CallToActionEntity>) {
    const {span} = Tracer.traceWidget(props, false);
    const properties = {
        ...props.model.Properties
    };
    const dataAttributes = htmlAttributes(props);

    const primaryAnchorAttributes = generateAnchorAttrsFromLink(properties.PrimaryActionLink);
    const secondaryAnchorAttributes = generateAnchorAttrsFromLink(properties.SecondaryActionLink);
    const wrapperCustomAttributes = getCustomAttributes(properties.Attributes, 'Wrapper');
    const primaryCustomAttributes = getCustomAttributes(properties.Attributes, 'Primary');
    const secondaryCustomAttributes = getCustomAttributes(properties.Attributes, 'Secondary');
    const primaryClass = properties.Style && properties.Style.Primary ? properties.Style.Primary.DisplayStyle : 'Primary';
    const secondaryClass = properties.Style && properties.Style.Secondary ? properties.Style.Secondary.DisplayStyle : 'Secondary';
    const primaryButtonClass = StyleGenerator.getButtonClasses(primaryClass);
    const secondaryButtonClass = StyleGenerator.getButtonClasses(secondaryClass);

    const defaultClass = classNames('d-flex align-items-center', properties.CssClass);
    const positionClass = StyleGenerator.getAlignmentClasses(properties.Position && properties.Position.CTA ? properties.Position.CTA.Alignment : 'Left');
    const marginClass = properties.Margins && StyleGenerator.getMarginClasses(properties.Margins);
    dataAttributes['className'] = classNames(defaultClass, positionClass, marginClass);

    return (
      <>
        <div
          {...dataAttributes}
          {...wrapperCustomAttributes}
          >
          {
            props.model.Properties.PrimaryActionLabel && <CallToActionLink {...primaryAnchorAttributes}
              className={classNames('me-3', primaryButtonClass)}
              data-call-to-action=""
              {...primaryCustomAttributes}>
              {props.model.Properties.PrimaryActionLabel}
            </CallToActionLink>
          }
          {
            props.model.Properties.SecondaryActionLabel && <CallToActionLink {...secondaryAnchorAttributes}
              className={secondaryButtonClass}
              data-call-to-action=""
              {...secondaryCustomAttributes}>
              {props.model.Properties.SecondaryActionLabel}
            </CallToActionLink>
          }
        </div>
        {Tracer.endSpan(span)}
      </>
    );
}

