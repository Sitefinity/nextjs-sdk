import { RenderSectionProps } from './common';

export function FaqSection({isLoading, sectionData, cssClassName}: RenderSectionProps<{ question: string, answer: string }[]>) {
    if (isLoading) {
        return (<div className="skeleton-loader d-flex justify-content-center mb-4">
          <svg width="808" height="437" viewBox="0 0 808 437" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="148" width="496" height="38" fill="#F0F0F0" />
            <rect y="99" width="808" height="16" fill="#F0F0F0" />
            <rect y="128" width="738" height="16" fill="#F0F0F0" />
            <rect y="157" width="808" height="16" fill="#F0F0F0" />
            <rect y="231" width="808" height="16" fill="#F0F0F0" />
            <rect y="260" width="738" height="16" fill="#F0F0F0" />
            <rect y="289" width="808" height="16" fill="#F0F0F0" />
            <rect y="363" width="808" height="16" fill="#F0F0F0" />
            <rect y="392" width="738" height="16" fill="#F0F0F0" />
            <rect y="421" width="808" height="16" fill="#F0F0F0" />
          </svg>
        </div>);
    }

    if (!Array.isArray(sectionData) || sectionData?.length === 0) {
        return null;
    }

    return (
      <div className={`container ${cssClassName}`}>
        {sectionData.map((item, index) => (
          <div className="row pb-2" key={index}>
            <div className="col-md-12 col-lg-10">
              <h6>{item.question}</h6>
              <p>{item.answer}</p>
            </div>
          </div>))}
      </div>
    );
}
