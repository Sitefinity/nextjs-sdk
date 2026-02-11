import { marked } from 'marked';
import { SanitizerService } from '../../../../services/sanitizer-service';
import { RenderSectionProps } from './common';

export function RichTextSection({sectionData, isLoading, cssClassName}: RenderSectionProps<string>) {
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

    const sanitizer = SanitizerService.getInstance();
    const sectionDataParsed = typeof sectionData === 'string' ? sectionData : '';
    const markedownToHtml = marked.parse(sectionDataParsed || '', { async: false });
    return ( <div className={`container ${cssClassName}`}>
      <section className="row pt-5 pb-5">
        <div className="col-md-12 ">
          <div dangerouslySetInnerHTML={{ __html: sanitizer.sanitizeHtml(markedownToHtml) }} />
        </div>
      </section>
    </div>);
}
