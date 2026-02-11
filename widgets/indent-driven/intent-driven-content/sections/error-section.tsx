import { RenderSectionProps } from './common';

export interface ErrorSectionData {
    errorMessage?: string;
    errorType: string;
}

export function ErrorSection({ isLoading, sectionData, cssClassName }: RenderSectionProps<ErrorSectionData>) {
    if (isLoading) {
        return (
          <div className="skeleton-loader d-flex justify-content-center mb-4">
            <svg width="808" height="150" viewBox="0 0 808 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="808" height="150" fill="#F0F0F0" />
            </svg>
          </div>
        );
    }

    if (!sectionData?.errorMessage) {
        return null;
    }

    return (
      <div className={`error-section ${cssClassName || ''}`}>
        <div className="container">
          <section className="row pt-4 pb-4">
            <div className="col-md-12">
              <div className="alert alert-warning d-flex align-items-center" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2" style={{ fontSize: '1.25rem', lineHeight: 1 }} />
                <div>{sectionData.errorMessage}</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
}
