import { Attributes, Category, Choice, ConditionalVisibility, Content, ContentSection, ContentSectionTitles, DataModel, DataType, DefaultValue, DisplayName, KeysValues, KnownFieldTypes, LengthDependsOn, Required, TableView, WidgetEntity, WidgetLabel } from '@progress/sitefinity-widget-designers-sdk';
import { MixedContentContext } from '../../editor/widget-framework/mixed-content-context';
import { FormSubmitAction } from './interfaces/form-submit-action';
import { OffsetStyle } from '../styling/offset-style';
import { RestSdkTypes } from '../../rest-sdk/rest-client';

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
