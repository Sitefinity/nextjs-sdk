import { WidgetContext, getMinimumWidgetContext } from '../../../editor/widget-framework/widget-context';
import { DynamicListEntity } from './dynamic-list.entity';
import { CheckboxesEntity } from '../checkboxes/checkboxes.entity';
import { DropdownEntity } from '../dropdown/dropdown.entity';
import { htmlAttributes, setWarning } from '../../../editor/widget-framework/attributes';
import { DynamicListViewProps, getChoiceItems } from './dynamic-list.view-props';
import { ChoiceEntityBase } from '../interfaces/choice-entity-base';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { RenderView } from '../../common/render-view';
import { CheckboxesDefaultView } from '../checkboxes/checkboxes.view';
import { DropdownDefaultView } from '../dropdown/dropdown.view';
import { DropdownViewProps } from '../dropdown/interfaces/dropdown.view-props';
import { CheckboxesViewProps } from '../checkboxes/interfaces/checkboxes-view-model';
import { classNames } from '../../../editor/utils/classNames';
import { StylingConfig } from '../../styling/styling-config';

export async function DynamicList(props: WidgetContext<DynamicListEntity>) {
    const { span, ctx } = Tracer.traceWidget(props, true);
    const entity = props.model.Properties;
    const choices = await getChoiceItems(entity, ctx);
    let defaultRender: JSX.Element;

    const baseEntity: ChoiceEntityBase = {
        Choices: choices,
        CssClass: entity.CssClass,
        Hidden: entity.Hidden,
        InstructionalText: entity.InstructionalText,
        SfFieldName: entity.SfFieldName,
        Required: entity.Required,
        RequiredErrorMessage: entity.RequiredErrorMessage || '',
        SfViewName: 'Default',
        Label: entity.Label || ''
    };

    if (entity.SfViewName === 'Dropdown') {
        if (choices.length > 0) {
            choices.unshift({ Name: 'Select', Value: '', Selected: true });
        }

        const cssClass = entity.CssClass || '';
        const viewProps: DropdownViewProps<DropdownEntity> = {
            choices: choices || [],
            cssClass: classNames(cssClass, (StylingConfig.FieldSizeClasses as { [key: string]: string })[('Width' + entity.FieldSize)]) || '',
            instructionalText: entity.InstructionalText!,
            label: entity.Label || '',
            required: entity.Required,
            requiredErrorMessage: entity.RequiredErrorMessage || '',
            fieldSize: entity.FieldSize,
            sorting: 'Manual',
            sfFieldName: entity.SfFieldName,
            attributes: {},
            widgetContext: {
                requestContext: props.requestContext,
                model: {
                    Id: props.model.Id
                }
            } as any
        };

        defaultRender = (<DropdownDefaultView {...viewProps} />);
    } else {
        const viewProps: CheckboxesViewProps<CheckboxesEntity> = {
            choices: baseEntity.Choices || [],
            cssClass: entity.CssClass || '',
            hasAdditionalChoice: false,
            instructionalText: entity.InstructionalText || '',
            label: entity.Label || '',
            required: entity.Required,
            requiredErrorMessage: entity.RequiredErrorMessage!,
            columnsNumber: entity.ColumnsNumber,
            sfFieldName: entity.SfFieldName!,
            attributes: {},
            widgetContext: {
                requestContext: props.requestContext,
                model: {
                    Id: props.model.Id
                }
            } as any
        };

        defaultRender = (<CheckboxesDefaultView {...viewProps} />);
    }

    const dataAttributes = htmlAttributes(props);
    if (props.requestContext.isEdit) {

        if (entity.SelectedContent === null || entity.SelectedContent.Content === null || !entity.SelectedContent.Content[0].Type) {
            setWarning(dataAttributes, 'No list type have been selected');
        } else if (choices.length === 0) {
            setWarning(dataAttributes, 'Selected list is empty');
        }
    }

    const viewProps: DynamicListViewProps<DynamicListEntity> = {
        label: entity.Label,
        instructionalText: entity.InstructionalText,
        choices: choices,
        columnsNumber: entity.ColumnsNumber,
        cssClass: entity.CssClass!,
        fieldName: entity.SfViewName,
        required: entity.Required,
        attributes: {...dataAttributes},
        widgetContext: getMinimumWidgetContext(props)
    };

    return (
      <RenderView
        viewName={entity.SfViewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <div {...viewProps.attributes}>
          {defaultRender}
        </div>
      </RenderView>
    );
}
