import { Model, Placeholder, DisplayName, Required, RegularExpression } from '@progress/sitefinity-widget-designers-sdk';

export interface ChoiceOption {
    Name: string;
    Value?: string;
    Selected?: boolean;
}

@Model()
export class ChoiceOptionModel {
      @Placeholder('add label')
      @DisplayName('Label')
      @Required()
      Name: string | null = null;


      @Placeholder('add value')
      Value?: string | null = null;

      Selected?: boolean;
}
