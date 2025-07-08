import { MixedContentContext } from '../../editor/widget-framework/mixed-content-context';
import { FormSubmitAction } from './interfaces/form-submit-action';
import { OffsetStyle } from '../styling/offset-style';
import { RestSdkTypes } from '../../rest-sdk/rest-client';
import { ContentSectionTitles, KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { DefaultValue } from '@progress/sitefinity-widget-designers-sdk/decorators/default-value';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataModel, DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { ConditionalVisibility } from '@progress/sitefinity-widget-designers-sdk/decorators/conditional-visibility';
import { Choice } from '@progress/sitefinity-widget-designers-sdk/decorators/choice';
import { Category } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { Content } from '@progress/sitefinity-widget-designers-sdk/decorators/content';
import { Required } from '@progress/sitefinity-widget-designers-sdk/decorators/validations';
import { TableView } from '@progress/sitefinity-widget-designers-sdk/decorators/table-view';
import { WidgetLabel } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-label';
import { LengthDependsOn } from '@progress/sitefinity-widget-designers-sdk/decorators/length-depends-on';
import { KeysValues } from '@progress/sitefinity-widget-designers-sdk/decorators/attributes';

@WidgetEntity('SitefinityForm', 'Form')
export class FormEntity {
    @Content({ Type: RestSdkTypes.Form, AllowMultipleItemsSelection: false })
    @DisplayName('Select a form')
    @ContentSection('Form setup', 0)
    SelectedItems: MixedContentContext | null = null;

    @ContentSection('Form setup', 1)
    @DisplayName('Confirmation on submit')
    @DataType(KnownFieldTypes.RadioChoice)
    @Choice([
        { Title: 'As set in the form',  Value: 'AsSetInForm' },
        { Title: 'Custom message', Value: 'Message' },
        { Title: 'Custom redirect to a page', Value: 'Redirect' }
    ])
    FormSubmitAction: FormSubmitAction = FormSubmitAction.AsSetInForm;

    @ContentSection('Form setup', 1)
    @DisplayName('')
    @DataType(KnownFieldTypes.TextArea)
    @DefaultValue('Thank you for filling out our form.')
    @ConditionalVisibility('{\"conditions\":[{\"fieldName\":\"FormSubmitAction\",\"operator\":\"Equals\",\"value\":\"Message\"}],\"inline\":\"true\"}')
    SuccessMessage: string | null = null;

    @ContentSection('Form setup', 1)
    @DisplayName('')
    @Content({ Type: RestSdkTypes.Pages, AllowMultipleItemsSelection: false })
    @ConditionalVisibility('{\"conditions\":[{\"fieldName\":\"FormSubmitAction\",\"operator\":\"Equals\",\"value\":\"Redirect\"}],\"inline\":\"true\"}')
    @Required()
    RedirectPage: MixedContentContext | null = null;

    @ContentSection(ContentSectionTitles.DisplaySettings, 0)
    @TableView('Form')
    @DataModel(OffsetStyle)
    Margins: OffsetStyle | null = null;

    @WidgetLabel()
    SfWidgetLabel: string = 'Form';

    @DisplayName('CSS class')
    @Category('Advanced')
    CssClass?: string;

    @Category('Advanced')
    @ContentSection(ContentSectionTitles.Attributes)
    @DisplayName('Attributes for...')
    @LengthDependsOn(null, '', '', '[{"Name": "Form", "Title": "Form"}]')
    @DataType(KnownFieldTypes.Attributes)
    @DataModel(KeysValues)
    Attributes?:{ [key: string]: Array<{ Key: string, Value: string}> };
}
