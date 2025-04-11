
import { isAbsoluteUrl } from 'next/dist/shared/lib/utils';
import { TransferableRequestContext } from '../../editor/request-context';
import { htmlAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { getMinimumMetadata } from '../../editor/widget-framework/widget-metadata';
import { ItemArgs } from '../../rest-sdk/args/item.args';
import { ImageItem } from '../../rest-sdk/dto/image-item';
import { VideoItem } from '../../rest-sdk/dto/video-item';
import { RestClient, RestSdkTypes } from '../../rest-sdk/rest-client';
import { RootUrlService } from '../../rest-sdk/root-url.service';
import { RenderWidgetService } from '../../services/render-widget-service';
import { StyleGenerator } from '../styling/style-generator.service';
import { StylingConfig } from '../styling/styling-config';
import { ColumnHolder, ComponentContainer } from './column-holder';
import { SectionHolder } from './section-holder';
import { SectionEntity } from './section.entity';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { JSX } from 'react';

const ColumnNamePrefix = 'Column';
const sectionKey = 'Section';

export async function Section(props: WidgetContext<SectionEntity>) {
    const {span, ctx} = Tracer.traceWidget(props, true);
    props.model.Properties.ColumnsCount = props.model.Properties.ColumnsCount || 1;
    props.model.Properties.ColumnProportionsInfo = props.model.Properties.ColumnProportionsInfo || ['12'];
    const columns = populateColumns(props);
    const section = await populateSection(props.model.Properties, props.requestContext);

    const labels = props.model.Properties.Labels;
    if (labels && labels['Section'] && labels['Section'].Label) {
        props.model.Caption = labels['Section'].Label;
    }

    const dataAttributes = htmlAttributes(props);
    section.Attributes = Object.assign(section.Attributes, dataAttributes);

    const TagName = (props.model.Properties.TagName || 'section') as keyof JSX.IntrinsicElements;

    return (
      <>
        <TagName {...section.Attributes} style={section.Style}>
          {section.ShowVideo && section.VideoUrl &&
            <div className="sc-video__wrapper">
              <video className="sc-video__element" autoPlay={true} muted={true} loop={true}>
                <source src={section.VideoUrl} />
              </video>
            </div>
            }
          {columns.map((x, i) => {
                return (
                  <div key={i} {...x.Attributes} style={x.Style}>
                    {x.Children.map(y => {
                            return RenderWidgetService.createComponent(y.model, props.requestContext, ctx);
                        })}
                  </div>
                );
            })}
        </TagName>
        {Tracer.endSpan(span)}
      </>
    );
}

function populateColumns(context: WidgetContext<SectionEntity>): ColumnHolder[] {
    let columns: ColumnHolder[] = [];
    const properties = context.model.Properties;

    for (let i = 0; i < properties.ColumnsCount; i++) {
        let currentName = `${ColumnNamePrefix}${i + 1}`;

        const classAttribute = `col-md-${properties.ColumnProportionsInfo![i]}`;
        const classAttributes = [classAttribute];
        let children: Array<ComponentContainer> = [];
        if (context.model.Children) {
            children = context.model.Children.filter(x => x.PlaceHolder === currentName).map((x => {
                let ret: WidgetContext<any> = {
                    model: x,
                    metadata: getMinimumMetadata(RenderWidgetService.widgetRegistry.widgets[x.Name], context.requestContext.isEdit),
                    requestContext: context.requestContext
                };

                return ret;
            }));
        }

        const column: ColumnHolder = {
            Attributes: { },
            Children: children
        };

        if (context.requestContext.isEdit) {
            column.Attributes['data-sfcontainer'] = currentName;

            if (properties.Labels && properties.Labels.hasOwnProperty(currentName)) {
                const currentTitle = properties.Labels[currentName].Label;
                column.Attributes['data-sfplaceholderlabel'] = currentTitle!;
            }
        }

        if (properties.Attributes && properties.Attributes.hasOwnProperty(currentName)) {
            properties.Attributes[currentName].forEach((attribute) => {
                column.Attributes[attribute.Key] = attribute.Value;
            });
        }

        if (properties.ColumnsBackground && properties.ColumnsBackground.hasOwnProperty(currentName)) {
            const backgroundStyle = properties.ColumnsBackground[currentName];
            if (backgroundStyle.BackgroundType === 'Color') {
                column.Style = { '--sf-background-color': `${backgroundStyle.Color}` };
            }
        }

        if (properties.ColumnsPadding && properties.ColumnsPadding.hasOwnProperty(currentName)) {
            const columnPadding = properties.ColumnsPadding[currentName];
            const paddings = StyleGenerator.getPaddingClasses(columnPadding);
            if (paddings) {
                column.Attributes['className'] = paddings;
                classAttributes.push(paddings);
            }
        }

        if (properties.CustomCssClass && properties.CustomCssClass.hasOwnProperty(currentName)) {
            const columnCssClass = properties.CustomCssClass[currentName];
            if (columnCssClass && columnCssClass.Class) {
                classAttributes.push(columnCssClass.Class);
            }
        }

        if (column.Attributes['className']) {
            classAttributes.push(column.Attributes['className']);
        }

        column.Attributes['className'] = classAttributes.filter(x => x).join(' ');

        columns.push(column);
    }

    return columns;
}

function populateSection(properties: SectionEntity, requestContext: TransferableRequestContext): Promise<SectionHolder> {
    const sectionObject: SectionHolder = {
        Attributes: {}
    };

    let attributes = properties.Attributes;
    if (attributes && attributes.hasOwnProperty(sectionKey)) {
        attributes[sectionKey].forEach((attribute) => {
            sectionObject.Attributes[attribute.Key] = attribute.Value;
        });
    }

    const sectionClasses: string[] = ['row'];
    if (properties.SectionPadding) {
        const paddingClasses = StyleGenerator.getPaddingClasses(properties.SectionPadding);
        sectionClasses.push(paddingClasses);
    }

    if (properties.SectionMargin) {
        const marginClasses = StyleGenerator.getMarginClasses(properties.SectionMargin);
        sectionClasses.push(marginClasses);
    }

    if (properties.CustomCssClass && properties.CustomCssClass.hasOwnProperty(sectionKey)) {
        sectionClasses.push(properties.CustomCssClass[sectionKey].Class!);
    }

    if (!properties.SectionBackground) {
        sectionObject.Attributes['className'] = sectionClasses.filter(x => x).join(' ');
        return Promise.resolve(sectionObject);
    }

    if (properties.SectionBackground.BackgroundType === 'Video') {
        if (properties.SectionBackground.VideoItem && properties.SectionBackground.VideoItem.Id) {
            sectionClasses.push(StylingConfig.VideoBackgroundClass);
            let itemArgs: ItemArgs = {
                type: RestSdkTypes.Video,
                id: properties.SectionBackground.VideoItem.Id,
                provider: properties.SectionBackground.VideoItem.Provider,
                culture: requestContext.culture
            };

            return RestClient.getItemWithFallback<VideoItem>(itemArgs).then((video) => {
                sectionObject.ShowVideo = true;
                const videoUrl = `${RootUrlService.getClientCmsUrl()}${video.Url}`;
                sectionObject.VideoUrl = videoUrl;
                sectionObject.Attributes['className'] = sectionClasses.filter(x => x).join(' ');

                return sectionObject;
            });
        }
    } else if (properties.SectionBackground.BackgroundType === 'Image' && properties.SectionBackground.ImageItem && properties.SectionBackground.ImageItem.Id) {
        const imagePosition = properties.SectionBackground.ImagePosition || 'Fill';
        sectionClasses.push(StylingConfig.ImageBackgroundClass);

        let itemArgs: ItemArgs = {
            type: RestSdkTypes.Image,
            id: properties.SectionBackground.ImageItem.Id,
            provider: properties.SectionBackground.ImageItem.Provider,
            culture: requestContext.culture
        };

        return RestClient.getItemWithFallback<ImageItem>(itemArgs).then((image) => {
            let style: { [key: string]: string } = {};
            switch (imagePosition) {
                case 'Fill':
                    style['--sf-background-size'] = '100% auto';
                    break;
                case 'Center':
                    style['--sf-background-position'] = 'center';
                    break;
                default:
                    style['--sf-background-size'] = 'cover';
                    break;
            }

            const imageUrl = isAbsoluteUrl(image.Url) ? image.Url :  `${RootUrlService.getClientCmsUrl()}${image.Url}`;

            style['--sf-background-image'] = `url(${imageUrl})`;
            sectionObject.Style = style;
            sectionObject.Attributes['className'] = sectionClasses.filter(x => x).join(' ');
            return sectionObject;
        });
    } else if (properties.SectionBackground.BackgroundType === 'Color' && properties.SectionBackground.Color) {
        sectionObject.Style = { '--sf-background-color': `${properties.SectionBackground.Color}` };
    }

    sectionObject.Attributes['className'] = sectionClasses.filter(x => x).join(' ');
    return Promise.resolve(sectionObject);
}

