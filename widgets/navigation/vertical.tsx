import { getClass } from './utils';
import { classNames } from '../../editor/utils/classNames';
import { NavigationViewProps } from './navigation.view-props';
import { NavigationEntity } from './navigation.entity';
import { NavigationItem } from '../../rest-sdk/dto/navigation-item';

export function Vertical({ navCustomAttributes, items, attributes }: NavigationViewProps<NavigationEntity>) {
    const renderSubLevelsRecursive: any = (node: NavigationItem) => {

        return (<li key={node.Key} className="nav-item">
          <a className={classNames('nav-link',  getClass(node))} href={node.Url} target={node.LinkTarget}>{node.Title}</a>

          { node.ChildNodes.length > 0 &&
          <ul className="nav flex-column ms-3">
            {node.ChildNodes.map((node: NavigationItem, idx: number)=> {
                            return renderSubLevelsRecursive(node);
                            })
                        }
          </ul>}
        </li>);
    };
    return (
      <div {...attributes}>
        <nav
          {...navCustomAttributes}
        >

          <ul className="nav flex-column">
            {
                items.map((node: NavigationItem, idx: number)=> {
                    return renderSubLevelsRecursive(node);
                })
            }
          </ul>
        </nav>
      </div>
    );
}
