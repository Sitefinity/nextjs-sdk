import React from 'react';
import { PageViewModel } from './interfaces/page-view-model';
import { getClass } from './utils';
import { NavigationItem } from '../../rest-sdk/dto/navigation-item';
import { AccordionLink } from './client/accordion-link';
import { AccordionGroupLink } from './client/accordion-group-link';
import { classNames } from '../../editor/utils/classNames';
import { getUniqueId } from '../../editor/utils/getUniqueId';

const getAccordionButtonStateClass = (node: PageViewModel) =>{
    if (!node.IsCurrentlyOpened && !node.HasChildOpen) {
        return 'collapsed';
    }

    return null;
};

const getAccordionContentStateClass = (node: PageViewModel) => {
    if (node.IsCurrentlyOpened || node.HasChildOpen) {
        return 'show';
    }

    return null;
};

const isActive = (node: PageViewModel) => {
    if (node.IsCurrentlyOpened || node.HasChildOpen) {
        return 'true';
    }

    return 'false';
};

export function renderSubLevelRecursive(node: PageViewModel, nested: boolean = false) {
    if (node.ChildNodes.length === 0) {
        return null;
    }

    return (
      <ul className={classNames('nav', 'flex-column', {'ms-3' : nested})}>
        {
            node.ChildNodes.map((childNode, idx: number) => {
                return (
                  <li key={idx} className="nav-item">
                    <a className={classNames('nav-link', 'd-inline-block', getClass(childNode))} href={childNode.Url} target={childNode.LinkTarget}>{childNode.Title}</a>
                    { renderSubLevelRecursive(childNode, true)}
                  </li>
                );
            })
        }
      </ul>)
    ;
}

export function Accordion(props: { items: NavigationItem[]; className?: string; }) {
    let accordionId = getUniqueId('accordion');
    const { items, ...customAttrs } = props;

    return (
      <nav className="accordion" id={accordionId} {...customAttrs}>
        {
            items.map((node: PageViewModel, idx: number) => {
                const headingId = getUniqueId(`heading-${node.Key}`);
                const collapseId =  getUniqueId(`collapse-${node.Key}`);
                return (<div key={node.Key} className="accordion-item">
                  {node.ChildNodes.length === 0 && <h2 className="accordion-header">
                    <span className={classNames('accordion-button', 'empty', getAccordionButtonStateClass(node))}>
                      <a
                        title={node.Title}
                        className="nav-link d-inline-block p-0 text-truncate"
                        href={node.Url} target={node.LinkTarget}>
                        {node.Title}
                      </a>
                    </span>
                    </h2>
                    }
                  {node.ChildNodes.length > 0 && [
                    <h2 key={node.Key} className="accordion-header sc-accordion-header" id={headingId}>
                      <button aria-label={`Expander for parent page ${node.Title}`}
                        className={classNames('accordion-button', getAccordionButtonStateClass(node))}
                        type="button" data-bs-toggle="collapse"
                        data-bs-target={`#${collapseId}`} aria-expanded={isActive(node)} aria-controls={collapseId}>

                        { node.PageSiteMapNode.PageType === 'Group' &&
                          <AccordionGroupLink node={node} />
                        }
                      </button>
                      { node.PageSiteMapNode.PageType !== 'Group' &&
                        <AccordionLink node={node} />
                      }
                    </h2>,
                    <div key={node.Key + idx} id={collapseId} className={classNames('accordion-collapse', 'collapse', getAccordionContentStateClass(node))}
                      aria-labelledby={headingId} data-bs-parent={`#${accordionId}`}>
                      <div className="accordion-body">
                        {renderSubLevelRecursive(node)}
                      </div>
                    </div>]
                    }
                </div>);
            })

        }
      </nav>
    );
}
