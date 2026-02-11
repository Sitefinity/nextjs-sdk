'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DG_QUERY_PARAMS } from '../shared';

export interface IntentBoxClientProps {
	placeholder: string;
	targetPageUrl: string;
	inputId: string;
	submitButtonTooltip?: string;
	suggestions?: string[];
	suggestionsLabel?: string;
}

type SubmitButtonState = 'submit' | 'clear';

export function IntentBoxClient(props: IntentBoxClientProps) {
	const router = useRouter();
	const pathname = usePathname();
	const params = useSearchParams();

	const { placeholder,
		targetPageUrl,
		inputId,
		submitButtonTooltip,
		suggestions,
		suggestionsLabel
	} = props;

	const [query, setQuery] = React.useState<string>('');
	const [submitButtonState, setSubmitButtonState] = React.useState<SubmitButtonState>('submit');

	useEffect(() => {
		const urlParams = new URLSearchParams(params.toString());
		const queryParam = urlParams.get(DG_QUERY_PARAMS.query);
		if (queryParam) {
			setQuery(queryParam);
			setSubmitButtonState('clear');
		}
	}, [params]);

	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		setQuery(inputValue);
		
		setSubmitButtonState('submit');
	};

	const onSubmit = (queryFromSuggestions?: string) => {
		if (queryFromSuggestions) {
			queryFromSuggestions = queryFromSuggestions.trim();
			setQuery(queryFromSuggestions);
			setSubmitButtonState('clear');
		} else if (submitButtonState === 'clear') {
			setQuery('');
			setSubmitButtonState('submit');
			return;
		}

		const currentQuery = queryFromSuggestions || query.trim();

		(window as any).DataIntelligenceSubmitScript?._client?.sentenceClient?.writeSentence({
			predicate: 'Intent Box Prompt',
			object: currentQuery
		});

		let url = pathname;

		if (targetPageUrl) {
			url = targetPageUrl;
		}

		
		const urlParams = new URLSearchParams(params.toString());
		urlParams.set(DG_QUERY_PARAMS.query, currentQuery);
		
		setSubmitButtonState('clear');
		router.push(url + '?' + urlParams.toString());
	};

	const inputKeydownHandler = (e: React.KeyboardEvent) => {
		const keyCode = e.keyCode || e.charCode;

		if (keyCode === 13) {
			onSubmit();
		}
	};

	return (<>
	
  <div className="input-container d-flex">
    <input
      id={inputId}
      className="input-field form-control"
      type="text"
      placeholder={placeholder}
      onKeyDown={inputKeydownHandler}
      onChange={onInputChange}
      value={query} />
    <SubmitButton submitButtonState={submitButtonState} submitButtonTooltip={submitButtonTooltip} onSubmit={() => onSubmit()} query={query} />
  </div>
  {suggestions && suggestions.length > 0 && (<Suggestions suggestions={suggestions} suggestionsLabel={suggestionsLabel} onSubmit={onSubmit} />)}
	</>);
}

function Suggestions({ suggestions, suggestionsLabel, onSubmit }: { suggestions: string[], suggestionsLabel?: string, onSubmit: (suggestion: string) => void }) {
	return (<div className="suggestions-container pt-4 pb-4">
  <h6 className="mb-3 d-flex justify-content-center">{suggestionsLabel}</h6>
  <ul className="d-flex justify-content-center list-unstyled list-inline">
    {
		suggestions.map((suggestion, index) => (
  <li key={index} role="button" className="suggestion-item list-inline-item bg-secondary bg-opacity-10 rounded-pill ps-3 pe-3 pb-1 me-1 mb-1 mw-100 position-relative overflow-hidden text-truncate text-nowrap"
    onClick={() => onSubmit(suggestion)}>{suggestion}</li>))
}
  </ul>
	</div>);
}

function SubmitButton({ submitButtonState, submitButtonTooltip, onSubmit, query }: { submitButtonState: SubmitButtonState, submitButtonTooltip?: string, onSubmit: () => void, query: string }) {
	return (
  <button type="button" title={submitButtonTooltip}
    className="btn btn-primary submit-button pt-0" onClick={() => onSubmit()} disabled={!query}>
    { submitButtonState === 'clear' ? (
      <svg className="text-white align-middle clear" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">
        <path fill="white" d="M9.76431 7.47475C9.92144 7.63187 10 7.82267 10 8.04714C10 8.2716 9.92144 8.4624 9.76431 8.61953L8.61953 9.76431C8.4624 9.92144 8.27161 10 8.04714 10C7.82267 10 7.63188 9.92144 7.47475 9.76431L5 7.28956L2.52525 9.76431C2.36813 9.92144 2.17733 10 1.95286 10C1.7284 10 1.5376 9.92144 1.38047 9.76431L0.23569 8.61953C0.0785634 8.4624 0 8.2716 0 8.04714C0 7.82267 0.0785634 7.63187 0.23569 7.47475L2.71044 5L0.23569 2.52525C0.0785634 2.36813 0 2.17733 0 1.95286C0 1.7284 0.0785634 1.5376 0.23569 1.38047L1.38047 0.23569C1.5376 0.0785634 1.7284 0 1.95286 0C2.17733 0 2.36813 0.0785634 2.52525 0.23569L5 2.71044L7.47475 0.23569C7.63188 0.0785634 7.82267 0 8.04714 0C8.27161 0 8.4624 0.0785634 8.61953 0.23569L9.76431 1.38047C9.92144 1.5376 10 1.7284 10 1.95286C10 2.17733 9.92144 2.36813 9.76431 2.52525L7.28956 5L9.76431 7.47475Z" />
      </svg>) : (
        <svg width="15" height="15" className="text-white align-middle submit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <path fill="white" d="M110.5 67L586.2 286C599.5 292.1 608 305.4 608 320C608 334.6 599.5 347.9 586.2 354L110.5 573C106.2 575 101.5 576 96.8 576C78.7 576 64 561.2 64 543C64 538.4 65 533.8 66.8 529.6L138.8 367.7C143.5 357.1 153.7 349.8 165.3 348.8L322 335.2C329.9 334.5 335.9 327.9 335.9 320C335.9 312.1 329.8 305.5 322 304.8L165.3 291.2C153.7 290.2 143.5 283 138.8 272.3L66.8 110.4C65 106.2 64 101.6 64 97C64 78.8 78.7 64 96.8 64C101.5 64 106.2 65 110.5 67z" />
        </svg>)}
  </button>
	);
}
