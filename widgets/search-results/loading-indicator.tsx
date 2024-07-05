'use-client';

export function LoadingIndicator() {

    return (
      <div id="sf-search-results-loading-indicator" style={{ display: 'none' }}>
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary my-5" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
}
