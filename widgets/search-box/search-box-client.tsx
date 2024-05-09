'use client';

import React, { FocusEvent, MouseEvent } from 'react';
import { classNames } from '../../editor/utils/classNames';
import { getCustomAttributes } from '../../editor/widget-framework/attributes';
import { SearchBoxViewModel } from './search-box-viewmodel';
import { RestClient } from '../../rest-sdk/rest-client';
import { getSearchBoxParams, getSearchUrl } from './utils';

const dataSfItemAttribute = 'data-sfitem';
const activeAttribute = 'data-sf-active';

export function SearchBoxClient(props: { searchModel: SearchBoxViewModel }) {
    const { searchModel } = props;
    const [ searchItems, setSearchItems ] = React.useState<string[]>([]);
    const [ dropDownWidth, setDropDownWidth ] = React.useState<number | undefined>(undefined);
    const [ dropDownShow, setDropDownShow ] = React.useState<boolean>(false);
    const [ suggestions, setSuggestions ] = React.useState<string[]>([]);

    const dropdownRef = React.useRef<HTMLUListElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const searchBoxCustomAttributes = getCustomAttributes(searchModel.Attributes, 'SearchBox');
    const disabled = searchModel.IsEdit;

    const activeClass = searchModel.ActiveClass;

    const handleOnSearch =(suggestions: string[])=>{
        const items = Array.isArray(suggestions) ? suggestions : [];

        setSearchItems(items);
    };

    const handleShowDropdown = () => {
        const inputWidth = inputRef.current!.clientWidth;
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
        let data = getSearchBoxParams(searchModel);
        let requestUrl = data.servicePath +
            '/Default.GetSuggestions()' +
            '?indexName=' + data.catalogue +
            '&sf_culture=' + data.culture +
            '&siteId=' + data.siteId +
            '&scoringInfo=' + data.scoringSetting +
            '&suggestionFields=' + data.suggestionFields +
            '&searchQuery=' + input.value;
        if (data.resultsForAllSites === 1) {
            requestUrl += '&resultsForAllSites=True';
        } else if (data.resultsForAllSites === 2) {
            requestUrl += '&resultsForAllSites=False';
        }

        fetch(requestUrl).then(function (res) {
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
            (window as any).DataIntelligenceSubmitScript._client.sentenceClient.writeSentence({
                predicate: 'Search for',
                object: input.value.trim(),
                objectMetadata: [{
                    'K': 'PageUrl',
                    'V': location.href
                }]
            });
        }

        const url = getSearchUrl(input.value.trim(), searchModel);
        (window as Window).location = url;
    };

    const inputKeyupHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code !== 'ArrowUp' &&
            e.code !== 'ArrowDown' &&
            e.code !== 'Escape') {

            let searchText =  (e.target as HTMLInputElement).value.trim();
            let config = getSearchBoxParams(searchModel);

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
        let target = e.target as any;
        let content = target.innerText;
        inputRef.current!.value = content;
        navigateToResults();
        handleHideDropdown();
    };

    const handleDropDownBlur = (e: FocusEvent) => {
        if (dropdownRef.current != null && !dropdownRef.current.contains(e.relatedTarget)) {
            handleHideDropdown(false);
        }
    };

    const handleDropDownKeyUp =  (e: React.KeyboardEvent) => {
        const dropdown = dropdownRef.current;

        let key = e.keyCode || e.charCode;
        let activeLinkSelector = `[${dataSfItemAttribute}][${activeAttribute}]`;

        let activeLink = dropdown!.querySelector(activeLinkSelector);
        if (!activeLink) {
            return;
        }

        let previousParent = activeLink.parentElement!.previousElementSibling;
        let nextParent = activeLink.parentElement!.nextElementSibling;
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

        let link = item.querySelector(`[${dataSfItemAttribute}]`);

        if (link && activeClass) {
            link.classList.add(...activeClass);
        }

        //set data attribute, to be used in queries instead of class
        link.setAttribute(activeAttribute, '');

        link.focus();
    };

    const resetActiveClass = () => {
        const dropdown = dropdownRef.current;
        let activeLink = dropdown!.querySelector(`[${activeAttribute}]`);

        if (activeLink && activeClass) {
            activeLink.classList.remove(...activeClass);
            activeLink.removeAttribute(activeAttribute);
        }
    };
    return (
      <>
        <div className="d-flex">
          <input type="text" className="form-control" disabled={disabled} placeholder={searchModel.SearchBoxPlaceholder || undefined} defaultValue={searchModel.SearchQuery} ref={inputRef}
            onKeyUp={inputKeyupHandler} onKeyDown={inputKeydownHandler} onBlur={handleDropDownBlur} {...searchBoxCustomAttributes} />
          <button data-sf-role="search-button" className="btn btn-primary ms-2 flex-shrink-0" disabled={disabled} onClick={navigateToResults}>
            {searchModel.SearchButtonLabel}
          </button>
        </div>
        {
           searchModel.SuggestionsTriggerCharCount != null && searchModel.SuggestionsTriggerCharCount >= 2 &&
                (
                <ul role="listbox" onClick={handleDropDownClick} onKeyUp={handleDropDownKeyUp} onBlur={handleDropDownBlur} style={{ width:dropDownWidth }}
                  ref={dropdownRef} className={classNames('border bg-body list-unstyled position-absolute', { [searchModel.VisibilityClassHidden]: !dropDownShow})}>
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
      </>
    );
}
