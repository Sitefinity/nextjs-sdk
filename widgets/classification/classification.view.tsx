import { TaxonDto } from '../../rest-sdk/dto/taxon-dto';
import { ClassificationEntity } from './classification-entity';
import { ClassificationViewProps } from './interfaces/classification.view-props';

export function ClassificationDefaultView(props: ClassificationViewProps<ClassificationEntity>) {
    const renderSubTaxa = (taxa: TaxonDto[], show: boolean) => {
        return (taxa && taxa.length > 0 ? <ul>
          {
                taxa.map((t: TaxonDto, idx: number) => {
                    const count = show ? `(${t.AppliedTo})` : '';
                    return (<li key={idx} className="list-unstyled">
                      <a className="text-decoration-none" href={t.UrlName}>{t.Title}</a>
                      { count }
                      { t.SubTaxa && renderSubTaxa(t.SubTaxa, show) }
                    </li>);
                })
            }
        </ul> : null
          );
    };

    return (<ul {...props.attributes}>
      {
              props.items.map((item: TaxonDto, idx: number) => {
                  const count = props.showItemCount ? `(${item.AppliedTo})` : '';
                  return (<li key={idx} className="list-unstyled">
                    <a className="text-decoration-none" href={item.UrlName}>{item.Title}</a>
                    {count}
                    {
                        item.SubTaxa && renderSubTaxa(item.SubTaxa, props.showItemCount)
                      }
                  </li>);
              }
          )
      }
    </ul>);
}
