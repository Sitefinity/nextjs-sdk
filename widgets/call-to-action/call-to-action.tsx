import { StyleGenerator } from '../styling/style-generator.service';
import { CallToActionEntity } from './call-to-action.entity';
import { htmlAttributes, generateAnchorAttrsFromLink, getCustomAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { classNames } from '../../editor/utils/classNames';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

export async function CallToAction(props: WidgetContext<CallToActionEntity>) {
    const {span} = Tracer.traceWidget(props, false);
    const properties = {
        ...props.model.Properties
    };
    const dataAttributes = htmlAttributes(props);
    const defaultClass = classNames('d-flex align-items-center', properties.CssClass);
    const positionClass = StyleGenerator.getAlignmentClasses(properties.Position && properties.Position.CTA ? properties.Position.CTA.Alignment : 'Left');
    const marginClass = properties.Margins && StyleGenerator.getMarginClasses(properties.Margins);
    dataAttributes['className'] = classNames(defaultClass, positionClass, marginClass);

    const primaryAnchorAttributes = generateAnchorAttrsFromLink(properties.PrimaryActionLink);
    const secondaryAnchorAttributes = generateAnchorAttrsFromLink(properties.SecondaryActionLink);
    const wrapperCustomAttributes = getCustomAttributes(properties.Attributes, 'Wrapper');
    const primaryCustomAttributes = getCustomAttributes(properties.Attributes, 'Primary');
    const secondaryCustomAttributes = getCustomAttributes(properties.Attributes, 'Secondary');
    const primaryClass = properties.Style && properties.Style.Primary ? properties.Style.Primary.DisplayStyle : 'Primary';
    const primaryButtonClass = StyleGenerator.getButtonClasses(primaryClass);
    const secondaryClass = properties.Style && properties.Style.Secondary ? properties.Style.Secondary.DisplayStyle : 'Secondary';
    const secondaryButtonClass = StyleGenerator.getButtonClasses(secondaryClass);

    return (
      <>
        <div
          {...dataAttributes}
          {...wrapperCustomAttributes}
          >
          {
            props.model.Properties.PrimaryActionLabel &&
              <a {...primaryAnchorAttributes}
                className={classNames('me-3', primaryButtonClass)}
                data-call-to-action={true}
                sfdi-trigger="click"
                sfdi-predicate="Call to action"
                sfdi-object={props.model.Properties.PrimaryActionLabel}
                {...primaryCustomAttributes}>
                {props.model.Properties.PrimaryActionLabel}
              </a>
          }
          {
            props.model.Properties.SecondaryActionLabel &&
              <a {...secondaryAnchorAttributes}
                className={secondaryButtonClass}
                data-call-to-action={true}
                sfdi-trigger="click"
                sfdi-predicate="Call to action"
                sfdi-object={props.model.Properties.SecondaryActionLabel}
                {...secondaryCustomAttributes}>
                {props.model.Properties.SecondaryActionLabel}
              </a>
          }
        </div>
        {Tracer.endSpan(span)}
      </>
    );
}
