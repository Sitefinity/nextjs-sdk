import { RenderSectionProps } from './common';

export function TitleAndSummarySection({ isLoading, sectionData, cssClassName }: RenderSectionProps<{ title: string, summary: string }>) {
    if (isLoading) {
        return (<div className="skeleton-loader d-flex justify-content-center mb-4">
          <svg width="808" height="199" viewBox="0 0 808 199" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="299" width="211" height="38" fill="#F0F0F0"/>
            <rect y="96" width="808" height="16" fill="#F0F0F0"/>
            <rect y="125" width="738" height="16" fill="#F0F0F0"/>
            <rect y="154" width="808" height="16" fill="#F0F0F0"/>
            <rect y="183" width="738" height="16" fill="#F0F0F0"/>
          </svg>
        </div>);
    }

    if (!sectionData) {
        return null;
    }

    return (
      <div className={`container ${cssClassName}`}>
        <div className="row pt-4 pb-4">
          <div className="col-md-12">
            <div className="pt-4 pb-4">
              <h1 className="mb-2">
                <strong>
                  {sectionData.title}
                </strong>
              </h1>
              <p>{sectionData.summary}</p>
            </div>
          </div>
        </div>
      </div>
    );
}
