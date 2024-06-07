import React from 'react';
import { StyleGenerator } from '../styling/style-generator.service';
import { RestClient } from '../../rest-sdk/rest-client';
import { BreadcrumbEntity } from './breadcrumb.entity';
import { GetBreadcrumbArgs } from '../../rest-sdk/args/get-breadcrumb.args';
import { combineClassNames } from '../../editor/utils/classNames';
import { htmlAttributes, getCustomAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

const PAGE_MISSING_MESSAGE = 'Breadcrumb is visible when you are on a particular page.';

export async function Breadcrumb(props: WidgetContext<BreadcrumbEntity>) {
    const {span, ctx} = Tracer.traceWidget(props, true);
    const dataAttributes = htmlAttributes(props);

    if (props.requestContext.isEdit && !props.requestContext.layout.Fields) {
        return (
          <div {...dataAttributes}>
            {PAGE_MISSING_MESSAGE}
          </div>
        );
    }

    const entity = props.model.Properties;

    const args: GetBreadcrumbArgs = {
        addStartingPageAtEnd: entity.AddCurrentPageLinkAtTheEnd,
        addHomePageAtBeginning: entity.AddHomePageLinkAtBeginning,
        includeGroupPages: entity.IncludeGroupPages,
        currentPageId: props.requestContext.layout.Id,
        currentPageUrl: props.requestContext.layout.Fields['ViewUrl'],
        culture: props.requestContext.culture,
        traceContext: ctx
    };

    if (entity.BreadcrumbIncludeOption === BreadcrumbIncludeOption.SpecificPagePath && entity.SelectedPage && entity.SelectedPage.ItemIdsOrdered && entity.SelectedPage.ItemIdsOrdered.length > 0) {
        args.startingPageId = entity.SelectedPage.ItemIdsOrdered[0];
    }

    if (entity.AllowVirtualNodes) {
        args.detailItemInfo = props.requestContext.detailItem;
    }

    const items = await RestClient.getBreadcrumb(args);

    const defaultClass =  entity.WrapperCssClass;
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);
    const breadcrumbCustomAttributes = getCustomAttributes(entity.Attributes, 'Breadcrumb');

    dataAttributes['className'] = combineClassNames(defaultClass, marginClass);

    return (
      <>
        <div
          {...dataAttributes}
          {...breadcrumbCustomAttributes}
          >

          <nav aria-label="Full path to the current page">
            <ol className="breadcrumb">
              {
                items.map((node: { Title: string, ViewUrl: string }, idx: number) => {
                      if (idx === items.length - 1) {
                        return <li key={idx} className="breadcrumb-item active" aria-current="page">{node.Title}</li>;
                      }
                      return <li key={idx} className="breadcrumb-item"><a href={node.ViewUrl}>{node.Title}</a></li>;
                    })
                  }
            </ol>
          </nav>
        </div>
        {Tracer.endSpan(span)}
      </>
    );
}

export enum BreadcrumbIncludeOption {
    CurrentPageFullPath = 'CurrentPageFullPath',
    SpecificPagePath = 'SpecificPagePath',
}

