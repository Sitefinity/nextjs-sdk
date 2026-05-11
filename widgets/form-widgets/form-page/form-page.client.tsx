'use client';

import { useContext, useRef, useState, useEffect, useCallback } from 'react';

import { FormContext } from '../../form/form-context';
import { SubmitButtonClient } from '../submit-button/submit-button-client';

export function FormPageClient(props: { buttonLabel: string; allowStepBackward: boolean; backLinkLabel: string; fieldKeys: string[] }) {
    const { totalFormPages, currentFormPage, setCurrentFormPage, validateFields } = useContext(FormContext);
    const containerRef = useRef<HTMLDivElement>(null);
    const [pageIndex, setPageIndex] = useState(-1);

    const getFormPages = useCallback(() => {
        if (!containerRef.current) {
            return null;
        }

        const formContainer = containerRef.current.closest('[data-sf-role="form-container"]');
        if (!formContainer) {
            return null;
        }

        return formContainer.querySelectorAll('[data-sf-role="form-page-container"]');
    }, []);

    useEffect(() => {
        const allPages = getFormPages();
        if (!allPages) {
            return;
        }

        const myPage = containerRef.current!.closest('[data-sf-role="form-page-container"]');
        const index = Array.from(allPages).indexOf(myPage as Element);
        setPageIndex(index);
    }, [totalFormPages, getFormPages]);

    useEffect(() => {
        const allPages = getFormPages();
        if (!allPages || pageIndex < 0) {
            return;
        }

        allPages.forEach((page, i) => {
            (page as HTMLElement).style.display = i === currentFormPage ? 'block' : 'none';
        });
    }, [currentFormPage, pageIndex, getFormPages]);

    const isLastPage = pageIndex >= 0 && pageIndex === totalFormPages - 1;
    const isFirstPage = pageIndex === 0;

    const handleNext = () => {
        if (isLastPage) {
            return;
        }

        const allValid = validateFields(props.fieldKeys);
        if (allValid) {
            setCurrentFormPage(currentFormPage + 1);
        }
    };

    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isFirstPage) {
            setCurrentFormPage(currentFormPage - 1);
        }
    };

    return (
      <div ref={containerRef} className="mb-3 mt-3" data-sf-role="next-button-container">
        {isLastPage
                ? <SubmitButtonClient>{props.buttonLabel}</SubmitButtonClient>
                : <button type="button" className="btn btn-secondary" data-sf-role="next-button" onClick={handleNext}>{props.buttonLabel}</button>
            }
        {props.allowStepBackward && !isFirstPage &&
        <button type="button" className="btn btn-link shadow-none text-decoration-none" data-sf-role="back-link" onClick={handleBack}>{props.backLinkLabel}</button>
            }
      </div>
    );
}
