'use client';

import React, { FocusEvent, MouseEvent } from 'react';
import { classNames } from '../../editor/utils/classNames';
import { getCustomAttributes } from '../../editor/widget-framework/attributes';
import { SearchBoxViewProps } from './search-box.view-props';
import { getSearchBoxParams, getSearchUrl } from './utils';
import { SearchBoxEntity } from './search-box.entity';
import { useRouter, useSearchParams } from 'next/navigation';
import { SF_WEBSERVICE_API_KEY_HEADER } from '../common/utils';

const dataSfItemAttribute = 'data-sfitem';
const activeAttribute = 'data-sf-active';

export function SearchBoxClient(props: SearchBoxViewProps<SearchBoxEntity>) {
    const [ searchItems, setSearchItems ] = React.useState<string[]>([]);
    const [ dropDownWidth, setDropDownWidth ] = React.useState<number | undefined>(undefined);
    const [ dropDownShow, setDropDownShow ] = React.useState<boolean>(false);
    const [ suggestions, setSuggestions ] = React.useState<string[]>([]);
    const searchParams = useSearchParams();
    const router = useRouter();

    const dropdownRef = React.useRef<HTMLUListElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const searchBoxCustomAttributes = getCustomAttributes(props.widgetContext.model.Properties.Attributes, 'SearchBox');
    const disabled = props.isEdit;

    const activeClass = props.activeClass;

    const handleOnSearch =(suggestions: string[])=>{
        const items = Array.isArray(suggestions) ? suggestions : [];

        setSearchItems(items);
    };

    const handleShowDropdown = () => {
        const inputWidth = inputRef.current?.clientWidth;
        setDropDownWidth(inputWidth);
        setDropDownShow(true);
    };

    const handleHideDropdown = (clear: boolean = true) => {
        if (clear){
            handleOnSearch([]);
        }
        setDropDownWidth(undefined);
        setDropDownShow(false);
    };

    const getSuggestions = (input: HTMLInputElement) => {
        const data = getSearchBoxParams(props, searchParams.get('orderby') || '');
        let requestUrl = data.servicePath +
            '/Default.GetSuggestions()' +
            '?indexName=' + data.catalogue +
            '&sf_culture=' + data.culture +
            '&siteId=' + data.siteId +
            '&scoringInfo=' + data.scoringSetting +
            '&suggestionFields=' + data.suggestionFields +
            '&searchQuery=' + encodeURIComponent(input.value)?.toLowerCase();
        if (data.resultsForAllSites === 1) {
            requestUrl += '&resultsForAllSites=True';
        } else if (data.resultsForAllSites === 2) {
            requestUrl += '&resultsForAllSites=False';
        }

        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (props.webserviceApiKey) {
            headers[SF_WEBSERVICE_API_KEY_HEADER] = props.webserviceApiKey;
        }

        fetch(requestUrl, { headers }).then(function (res) {
            res.json().then((suggestions: { value: string[] }) => {
                handleOnSearch(suggestions.value);
                setSuggestions(suggestions.value);
                handleShowDropdown();
            });
        }).catch(function () {
            handleHideDropdown();
        });
    };

    const navigateToResults = () => {
        const input = inputRef.current!;
        if ((window as any).DataIntelligenceSubmitScript) {
            (window as any).DataIntelligenceSubmitScript._client.fetchClient.sendInteraction({
                P: 'Search for',
                O: input.value.trim(),
                OM: {
                    PageUrl: location.href
                }
            });
        }

        const url = getSearchUrl(input.value.trim(), props, searchParams.get('orderby') || '');
        handleHideDropdown();
        router.push(url);
    };

    const inputKeyupHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const keyCode = e.keyCode || e.charCode;

        if (e.code !== 'ArrowUp' &&
            e.code !== 'ArrowDown' &&
            e.code !== 'Escape' &&
            keyCode !== 13) {

            const searchText =  (e.target as HTMLInputElement).value.trim();
            const config = getSearchBoxParams(props, searchParams.get('orderby') || '');

            if (config.minSuggestionLength && searchText.length >= config.minSuggestionLength) {
                getSuggestions(e.target as HTMLInputElement);
            } else {
                handleHideDropdown();
            }
        }

        if (e.code === 'ArrowDown' && suggestions.length) {
            handleShowDropdown();
            firstItemFocus();
        }

        if (e.code === 'Escape') {
            handleHideDropdown();
        }
    };


    const inputKeydownHandler = (e: React.KeyboardEvent) => {
        const keyCode = e.keyCode || e.charCode;

        if (keyCode === 13) {
            navigateToResults();
        }
    };

    const handleDropDownClick = (e: MouseEvent) =>{
        const target = e.target as any;
        const content = target.innerText;
        inputRef.current!.value = content;
        handleHideDropdown();
        navigateToResults();
    };

    const handleDropDownBlur = (e: FocusEvent) => {
        if (dropdownRef.current != null && !dropdownRef.current.contains(e.relatedTarget)) {
            handleHideDropdown(false);
        }
    };

    const handleDropDownKeyUp =  (e: React.KeyboardEvent) => {
        const dropdown = dropdownRef.current;

        const key = e.keyCode || e.charCode;
        const activeLinkSelector = `[${dataSfItemAttribute}][${activeAttribute}]`;

        const activeLink = dropdown!.querySelector(activeLinkSelector);
        if (!activeLink) {
            return;
        }

        const previousParent = activeLink.parentElement!.previousElementSibling;
        const nextParent = activeLink.parentElement!.nextElementSibling;
        if (key === 38 && previousParent) {
            e.preventDefault();
            focusItem(previousParent);
        } else if (key === 40 && nextParent) {
            e.preventDefault();
            focusItem(nextParent);
        } else if (key === 13) {
            inputRef.current!.value = (activeLink as HTMLElement).innerText;
            navigateToResults();
            handleHideDropdown();
            inputRef.current!.focus();
        } else if (key === 27) {
            resetActiveClass();
            handleHideDropdown(false);
            inputRef.current!.focus();
        }
    };

    const firstItemFocus = () => {
        const dropdown = dropdownRef.current;
        if (dropdown && dropdown.children.length) {
            const item =dropdown!.children[0].querySelector(`[${dataSfItemAttribute}]`);
            focusItem(item?.parentElement);
        }
    };

    const focusItem = (item: any) => {
        resetActiveClass();

        const link = item.querySelector(`[${dataSfItemAttribute}]`);

        if (link && activeClass) {
            link.classList.add(...activeClass);
        }

        //set data attribute, to be used in queries instead of class
        link.setAttribute(activeAttribute, '');

        link.focus();
    };

    const resetActiveClass = () => {
        const dropdown = dropdownRef.current;
        const activeLink = dropdown!.querySelector(`[${activeAttribute}]`);

        if (activeLink && activeClass) {
            activeLink.classList.remove(...activeClass);
            activeLink.removeAttribute(activeAttribute);
        }
    };
    return (
      <div {...props.attributes}>
        <div className="d-flex">
          <input type="text" className="form-control" disabled={disabled} placeholder={props.searchBoxPlaceholder || undefined}
            defaultValue={searchParams.get('searchQuery') || ''} ref={inputRef}
            onKeyUp={inputKeyupHandler} onKeyDown={inputKeydownHandler} onBlur={handleDropDownBlur} {...searchBoxCustomAttributes} />
          <button data-sf-role="search-button" className="btn btn-primary ms-2 flex-shrink-0" disabled={disabled} onClick={navigateToResults}>
            {props.searchButtonLabel}
          </button>
        </div>
        {
           props.suggestionsTriggerCharCount != null && props.suggestionsTriggerCharCount >= 2 &&
                (
                <ul role="listbox" onClick={handleDropDownClick} onKeyUp={handleDropDownKeyUp} onBlur={handleDropDownBlur} style={{ width:dropDownWidth }}
                  ref={dropdownRef} className={classNames('border bg-body list-unstyled position-absolute', { [props.visibilityClassHidden]: !dropDownShow})}>
                  {
                    searchItems.map((item: string, idx: number)=>{
                        return  (item && <li key={idx} role={'option'} aria-selected={false}>
                          <button role="presentation" className="dropdown-item text-truncate" data-sfitem="" title={item} tabIndex={-1}>{item}</button>
                        </li>);
                    })
                  }

                </ul>
                )
        }
      </div>
    );
}
