# Sitefinity Next.js SDK

Provides OOB widgets developed using the Next.js framework, which includes an abstraction layer for Sitefinity communication. Additionally, it offers an expanded API, typings, and tools for further development and integration.

## Getting started

Install via npm:

```bash
npm i @progress/sitefinity-nextjs-sdk --save
```

Via yarn:
```bash
yarn add @progress/sitefinity-nextjs-sdk
```

You can get started using it with our starter template in the follwing [NextJS samples repo](https://github.com/Sitefinity/nextjs-samples). It provides the needed integration for communicating with a Sitefinity server, setup documentation, and the basic boiler plate for getting started.

## Contents

### Main

The root module contains mainly tooling and interfaces related to widget rendering, models, metadata, renderer contracts.

#### Custom widgets

Creating and declaring custom widgets should adhere to the following convention.
Widgets should be registered in a __WidgetRegistry__ by __WidgetMetadata__, which consists of:
- _componentType_ - reference to the component funciton
- metadata, describing the properties of the widget:
    - _entity_? - class reference, decorated using the [_@progress/sitefinity-widget-designers-sdk_](https://www.npmjs.com/package/@progress/sitefinity-widget-designers-sdk) custom decorators
    - _designerMetadata_? - JSON format for a custom designer
- _editorMetadata_? - implementing the interface _EditorMetadata_, providing information to the editor about widget category, name, and other visual and operational data
- _ssr_? - indicating whether the widget should be server-side rendered or not

For more information and samples visit our [NextJS samples repo](https://github.com/Sitefinity/nextjs-samples).

#### Required html attributes

To ensure the WYSIWYG page and form editor functions correctly, it is necessary to include certain custom HTML attributes when viewing the markup in edit mode. The __htmlAttributes__ is designed to address this requirement comprehensively. Additionally, the __classNames__ helper is provided to facilitate the accumulation of custom CSS classes.

```tsx
import { htmlAttributes, classNames } from '@progress/sitefinity-nextjs-sdk';

export function CustomWidget(props: WidgetContext<CustomWidgetEntity>) {
    const dataAttributes = htmlAttributes(props);
    const customCssClasses = classNames('someClassNames');
    dataAttributes['className'] = customCssClasses;

    return (
        <div {...dataAttributes}>
            custom widget content
        </div>
    );
}
```

#### Widget children content holder

To define an area in your custom widget template where children widgets could be added, to the HTML element that would hold them should have the _data-sfcontainer_ attribute set.

The WYSIWYG editor will diplay on that spot the option to add a widget. If you want to have the ability to add widgets to your manually designated places and hide the default empty widget "add widget" placeholder, you can use the _setHideEmptyVisual_ function to modify the dataAttributes.

```tsx
import { htmlAttributes, setHideEmptyVisual } from '@progress/sitefinity-nextjs-sdk';

function CustomWidget(props: WidgetContext<CustomWidgetEntity>) {
    const dataAttributes = htmlAttributes(props);
    setHideEmptyVisual(dataAttributes, true); // this would hide the default empty visual

    return (
        <div {...dataAttributes}>
            ...
            <div id='childrenHolder' data-sfcontainer='containerId'>
            </div>
        </div>
    )
}
```


### Rest SDK
```ts
import { RestClient } from '@progress/sitefinity-nextjs-sdk/rest-sdk';
```

Provides a way to communicate with Sitefinity's REST API for the majority of the necessary operations and data queries. The entry static class __RestClient__ is part of the _@progress/sitefinity-nextjs-sdk/rest-sdk_ module.

### Widgets
```ts
import * from '@progress/sitefinity-nextjs-sdk/widgets';
import * from '@progress/sitefinity-nextjs-sdk/widgets/forms';
```

These modules contain the following OOB basic widgets:

- Breadcrumb
- Call to action
- Classification
- Content list
- Content block
- Document list
- Forms
    - Form
    - Checkboxes
    - Content block
    - Dropdown
    - Dynamic list
    - File upload
    - Multiple choice
    - Paragraph
    - Section
    - Submit button
    - Text field
- Image
- Language selector
- Navigation
- Search
    - Search box
    - Search results
    - Search facets
- Section
- User management
    - Login form
    - Change password
    - Registration
    - Reset password
- Language selector

### Styling
```ts
import { StyleGenerator } from '@progress/sitefinity-nextjs-sdk/widgets/styling';
```

Provides styling helper methods and interfaces that we provide mainly in the __StyleGenerator__ class.

### Code reference

For the exact implementation of the widgets and tooling, plese refer to the public [NextJS sdk read-only repo](https://github.com/Sitefinity/nextjs-sdk)
