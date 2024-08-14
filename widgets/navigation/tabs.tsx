import { getClass } from './utils';
import { classNames } from '../../editor/utils/classNames';
import { NavigationViewProps } from './navigation.view-props';
import { NavigationEntity } from './navigation.entity';
import { NavigationItem } from '../../rest-sdk/dto/navigation-item';

export function Tabs({ navCustomAttributes, items, attributes }: NavigationViewProps<NavigationEntity>) {
    const renderSubLevelsRecursive: any = (nodes: NavigationItem[]) => {
        const selectedNode = nodes.find(node => node.IsCurrentlyOpened || node.HasChildOpen);

        if (selectedNode) {
          <ul className="nav">
            {selectedNode.ChildNodes.map((node: NavigationItem, idx: number)=> {
                   return (<li key={idx} className="nav-item">
                     <a className={classNames('nav-link', getClass(node))} href={node.Url} target={node.LinkTarget}>{node.Title}</a>
                   </li>);
                })
              }
          </ul>;
            {renderSubLevelsRecursive(selectedNode.ChildNodes);}
        }
    };
    return (
      <div {...attributes}>
        <nav
          {...navCustomAttributes}
        >
          <ul className="nav nav-tabs">
            {
                items.map((node: NavigationItem, idx: number) => {
                    return (<li key={idx} className="nav-item">
                      <a className={classNames('nav-link', getClass(node))} href={node.Url} target={node.LinkTarget}>
                        {node.Title}
                      </a>
                    </li>);
                })
            }
          </ul>
          {
                renderSubLevelsRecursive(items)
            }
        </nav>
      </div>
    );
}
