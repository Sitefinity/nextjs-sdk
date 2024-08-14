import { BreadcrumbEntity } from './breadcrumb.entity';
import { BreadcrumbViewProps } from './breadcrumb.view-props';

export function BreadcrumbDefaultView(props: BreadcrumbViewProps<BreadcrumbEntity>) {
    return (
      <div {...props.attributes}>
        <nav aria-label="Full path to the current page">
          <ol className="breadcrumb">
            {
              props.items.map((node: { Title: string, ViewUrl: string }, idx: number) => {
                      if (idx === props.items.length - 1) {
                      return <li key={idx} className="breadcrumb-item active" aria-current="page">{node.Title}</li>;
                      }
                      return <li key={idx} className="breadcrumb-item"><a href={node.ViewUrl}>{node.Title}</a></li>;
                  })
                  }
          </ol>
        </nav>
      </div>
    );
}
