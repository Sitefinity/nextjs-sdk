/* eslint-disable default-case */
'use client';

import React, { Fragment, useEffect } from 'react';
import { HeroSection } from './sections/hero-section';
import { SectionType } from './section-type';
import { NoIntentAction, SectionDto } from './intent-driven-content.entity';
import { useSearchParams } from 'next/navigation';
import { DGEServiceConnector } from './dynamically-generated-service-connector';
import { DG_QUERY_PARAMS } from '../shared';
import { TitleAndSummarySection } from './sections/title-and-summary';
import { FaqSection } from './sections/faq';
import { ContentItemsListSection } from './sections/content-items-list';
import { RichTextSection } from './sections/rich-text';
import { ContentItemsCardsSection } from './sections/content-items-cards';
import { RenderSectionProps } from './sections/common';
import { ErrorSection, ErrorSectionData } from './sections/error-section';

function sectionTitleByType(sectionType: SectionType | undefined) {
	switch (sectionType) {
		case SectionType.TitleAndSummary:
			return 'Title and Summary';
		case SectionType.RichText:
			return 'Rich Text';
		case SectionType.FAQ:
			return 'FAQ';
		case SectionType.Hero:
			return 'Hero';
		case SectionType.ContentListCards:
			return 'Content List Cards';
		case SectionType.ContentList:
			return 'Content List';
	}
}

function renderSection(section: SectionDto, index: number, isEdit: boolean, sectionModel?: RenderSectionProps<any>) {
	if (isEdit) {
		return (
  <Fragment key={`section-edit-${index}`}>
    <h3 key={`section-title-${index}`}>{sectionTitleByType(section.sectionType)}</h3>
  </Fragment>
		);
	}

	if (!sectionModel) {
		return null;
	}

	switch (section.sectionType) {
		case SectionType.TitleAndSummary:
			return (<Fragment key={`section-${index}`}>
  {TitleAndSummarySection(sectionModel)}
			</Fragment>
			);
		case SectionType.FAQ:
			return (
  <Fragment key={`section-${index}`}>
    {FaqSection(sectionModel)}
  </Fragment>
			);
		case SectionType.Hero:
			return (
  <Fragment key={`section-${index}`}>
    {HeroSection(sectionModel)}
  </Fragment>
			);
		case SectionType.ContentListCards:
			return (
  <Fragment key={`section-${index}`}>
    {ContentItemsCardsSection(sectionModel)}
  </Fragment>
			);
		case SectionType.ContentList:
			return (
  <Fragment key={`section-${index}`}>
    {ContentItemsListSection(sectionModel)}
  </Fragment>
			);
		case SectionType.RichText:
			return (
  <Fragment key={`section-${index}`}>
    {RichTextSection(sectionModel)}
  </Fragment>
			);
	}
}

export interface DynamicallyGeneratedClientProps {
	defaultQuery: string | null;
	noIntentAction: NoIntentAction;
	language: string;
	siteId: string;
	pageId: string;
	sections: SectionDto[];
	isEdit: boolean;
}

export function IntentDrivenContentClient(props: DynamicallyGeneratedClientProps) {
	const searchParams = useSearchParams();
	const { defaultQuery, noIntentAction, language, siteId, pageId, sections, isEdit } = props;
	const skipSectionsRenderInEditMode = isEdit;
	const [serviceAnswer, setServiceAnswer] = React.useState<{ [key: string]: {isLoading: boolean, sectionData: any} }>({});
	const [errorData, setErrorData] = React.useState<ErrorSectionData | null>(null);

	const responseContainsNoData = (value: any) => {
		if (value == null) {
			return true;
		}

		if (Array.isArray(value)) {
			return value.length === 0;
		}
		
		if (typeof value === 'object' && Object.keys(value).length === 0) {
			return true;
		}
		
		if (typeof value === 'string') {
			return value.includes('Not enough data');
		}

		return false;
	};

	function getUserJourney() {
        const userJourneyData = {
            currentUserJourney: [],
            subjectKey: '',
            source: ''
        };

        if ((window as any).DataIntelligenceSubmitScript) {
            userJourneyData.currentUserJourney = (window as any).DataIntelligenceSubmitScript?._client?.recommenderClient?.getClientJourney() || [];
            userJourneyData.subjectKey = (window as any).DataIntelligenceSubmitScript?._client?.subjectKey || '';
            userJourneyData.source = (window as any).DataIntelligenceSubmitScript?._client?.source || '';
        }
        
        return userJourneyData;
    }

	const sendDataToInsight = (query: string) => {
		if ((window as any).DataIntelligenceSubmitScript) {
			(window as any).DataIntelligenceSubmitScript?._client?.sentenceClient?.writeSentence({
			predicate: 'Intent Box Prompt',
			object: query
		});
        }
	};

	const loadContent = async () => {
		const query = searchParams.get(DG_QUERY_PARAMS.query) || (noIntentAction === NoIntentAction.GenerateWithPredefinedQuery ? defaultQuery! : undefined);
		const variationId = searchParams.get(DG_QUERY_PARAMS.variationId) || undefined;
		if (Object.keys(serviceAnswer).length > 0) {
			setServiceAnswer({});
		}

		if (errorData) {
			setErrorData(null);
		}

		if (!query && !variationId) {
			return;
		}

		const sectionsToQuery = sections?.filter(x => x?.sectionType)
										.map(s => s.sectionType?.includes('_') ? s.sectionType.split('_')[0] : s.sectionType)
										.filter(x => x) as SectionType[];

		// If no sections are configured, do not send a request
		if (!sectionsToQuery?.length) {
			return;
		}

		setServiceAnswer(Object.fromEntries(sectionsToQuery.map(sectionType => [sectionType, { isLoading: true, sectionData: null }])));

		const isUserQuery = !!searchParams.get(DG_QUERY_PARAMS.query);

		if (isUserQuery) {
			sendDataToInsight(query as string);
		}

		const userJourneyData = getUserJourney();

		DGEServiceConnector.fetchDataStream({
			sections: sectionsToQuery,
			query,
			siteId,
			language,
			pageId,
			isUserQuery,
			variationId,
			userJourneyData
		}, (data) => {
			setServiceAnswer(prev => ({ ...prev, [data.sectionName]: { isLoading: false, sectionData: data.sectionData } }));
		}, (error) => {
			setErrorData(error);
			setServiceAnswer(prev => {
				const updated = { ...prev };
				Object.keys(updated).forEach(key => {
					updated[key] = { isLoading: false, sectionData: null };
				});
				return updated;
			});
		}, (collectedServiceData) => {
			const dataArray = Array.isArray(collectedServiceData) ? collectedServiceData : [];
			const hasNoData = dataArray.length === 0 || dataArray.every(item => responseContainsNoData(item?.sectionData));
			if (hasNoData) {
				setErrorData({
					errorMessage: 'No data for this query could be found. Try another one.',
					errorType: 'NoContent'
				});
				setServiceAnswer(prev => {
					const updated = { ...prev };
					Object.keys(updated).forEach(key => {
						updated[key] = { isLoading: false, sectionData: null };
					});
					return updated;
				});
				return;
			}

			setServiceAnswer(prev => {
				const updatedData = { ...prev };
				dataArray.forEach(dataItem => {
					updatedData[dataItem.sectionName] = { isLoading: false, sectionData: dataItem.sectionData };
				});

				return updatedData;
			});
		});
	};

	useEffect(() => {
		!isEdit && loadContent();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	if (errorData) {
		return [
  <Fragment key="section-error">
    {ErrorSection({ isLoading: false, sectionData: errorData, cssClassName: '' })}
  </Fragment>
		];
	}

	return sections.map((section, index) => {
		const sectionType = section.sectionType?.includes('_') ? section.sectionType.split('_')[0] : section.sectionType;
		if (!sectionType) {
			return null;
		}

		const sectionModel = {
			...serviceAnswer?.[sectionType],
			cssClassName: section.cssClassName
		};
		return renderSection(section, index, skipSectionsRenderInEditMode, sectionModel);
	});
}
