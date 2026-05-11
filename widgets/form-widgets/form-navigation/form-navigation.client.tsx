'use client';

import { useContext } from 'react';
import { FormContext } from '../../form/form-context';

export function FormNavigationClient(props: { navigationSteps: string[] }) {
    const { currentFormPage } = useContext(FormContext);

    return (
      <ol className="list-unstyled d-inline-flex gap-3 mb-0">
        {props.navigationSteps.map((step, index) => {
                const pageNumber = index + 1;
                const stepId = `form-nav-step-${pageNumber}`;
                const isCurrent = index === currentFormPage;
                const isPast = index < currentFormPage;
                return (
                  <li key={stepId}
                    id={stepId}
                    className="d-inline-flex align-items-center gap-2"
                    data-sf-navigation-index={pageNumber}>
                    <span data-sf-progress-indicator="incomplete"
                      className="align-items-center justify-content-center"
                      style={{ display: isPast ? 'none' : 'inline-flex' }}>
                      <b className={`bg-white border border-1 ${isCurrent ? 'border-primary' : 'border-secondary'} rounded-circle d-inline-flex align-items-center justify-content-center`}
                        style={{ width: '1.6em', aspectRatio: '1' }}>
                        {pageNumber}
                      </b>
                    </span>
                    <span data-sf-progress-indicator="past"
                      className="align-items-center justify-content-center"
                      style={{ display: isPast ? 'inline-flex' : 'none' }}>
                      <b className="bg-white border border-1 border-secondary rounded-circle d-inline-flex align-items-center justify-content-center"
                        style={{ width: '1.6em', aspectRatio: '1' }}>&#x2713;</b>
                    </span>
                    <span data-sf-page-title={step} className={`${isCurrent ? 'fw-bold' : 'text-secondary'}`}>{step}</span>
                  </li>
                );
            })}
      </ol>
    );
}
