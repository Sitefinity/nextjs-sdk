import { notFound } from 'next/navigation';
import { TransferableRequestContext } from '../../editor/request-context';
import { PagerMode } from '../common/page-mode';
import { setQueryParams } from '../common/query-params';

export class PagerViewModel {
    public static readonly PageNumberDefaultTemplate: string = '-page-{{pageNumber}}-';
    public static readonly PageNumberDefaultQueryTemplate: string = 'page';

    public ProcessedUrlSegments: string[] = [];
    public CurrentPage: number;
    public StartPageIndex: number;
    public EndPageIndex: number;
    public TotalPagesCount: number;
    public DisplayPagesCount: number;
    public IsPreviousButtonVisible: boolean;
    public IsNextButtonVisible: boolean;
    public IsPageNumberValid: boolean = false;
    public PreviousPageIndex: number;
    public NextPageIndex: number;
    public PagerQueryParameterTemplate: string;
    public PagerSegmentTemplate: string;
    public PagerMode: PagerMode;
    public ViewUrl: string = '';
    public PageNumberSlot: string = '{{pageNumber}}';

    constructor(currentPage: number,
        totalItemsCount: number,
        itemsPerPage: number,
        pagerSegmentTemplate: string,
        pagerQueryParamTemplate: string,
        pagerMode: PagerMode) {
        this.ProcessedUrlSegments = [];
        this.CurrentPage = currentPage;

        const pagesCount = totalItemsCount / itemsPerPage;
        const totalPagesCount = Math.ceil(pagesCount);

        this.TotalPagesCount = totalPagesCount === 0 ? 1 : totalPagesCount;

        this.StartPageIndex = 1;
        this.EndPageIndex = 1;
        this.DisplayPagesCount = 10;

        if (this.CurrentPage > this.DisplayPagesCount) {
            this.StartPageIndex = (Math.floor((this.CurrentPage - 1) / this.DisplayPagesCount) * this.DisplayPagesCount) + 1;
        }

        this.EndPageIndex = Math.min(this.TotalPagesCount, (this.StartPageIndex + this.DisplayPagesCount) - 1);

        if (!this.isPageValid(this.CurrentPage)) {
            notFound();
        }

        // previous button
        this.IsPreviousButtonVisible = this.StartPageIndex > this.DisplayPagesCount ? true : false;
        this.PreviousPageIndex = this.StartPageIndex - 1;

        // next button
        this.IsNextButtonVisible = this.EndPageIndex < this.TotalPagesCount ? true : false;
        this.NextPageIndex = this.EndPageIndex + 1;

        this.PagerMode = pagerMode;
        this.PagerQueryParameterTemplate = pagerQueryParamTemplate;
        this.PagerSegmentTemplate = pagerSegmentTemplate;
        if (!this.PagerSegmentTemplate.startsWith('/')) {
            this.PagerSegmentTemplate = '/' + this.PagerSegmentTemplate;
        }
    }

    public isPageValid(pageNumber: number): boolean {
        return pageNumber >= 1 && pageNumber <= this.EndPageIndex;
    }

    public getPagerUrl(pageNumber: number, context: TransferableRequestContext): string {
        let path: string = context?.url || context?.layout.Fields?.ViewUrl;
        if (path[0] !== '/') {
            path = `/${path}`;
        }

        // in case we are accessing it from home page
        if (path === '/' && !this.ViewUrl) {
            path = this.ViewUrl;
        }

        let queryString = setQueryParams(context?.searchParams);

        if (this.PagerMode === PagerMode.URLSegments) {
            const desiredPage = this.PagerSegmentTemplate.replace(this.PageNumberSlot, pageNumber.toString());
            const pattern = this.PagerSegmentTemplate.replace(this.PageNumberSlot, '(\\d{1,})');

            if (queryString) {
                queryString = `?${queryString}`;
            }

            if (this.isSegmentMatch(path, pattern)) {
                return path.replace(new RegExp(pattern), desiredPage) + queryString;
            }

            return path + desiredPage + queryString;
        } else {
            const template = this.PagerQueryParameterTemplate;
            const queryPattern = new RegExp(`${encodeURIComponent(template)}=(\\d{1,})`);
            const queryDesiredPage = `${encodeURIComponent(template)}=${pageNumber}`;
            const value = context.searchParams[template];

            if (value && value.length > 0 && parseInt( value, 10)) {
                return path + '?' + queryString.replace(queryPattern, queryDesiredPage);
            }

            if (queryString){
                return path + '?' + queryString + '&' + queryDesiredPage;
            }

            return path + '?' + queryDesiredPage;
        }
    }

    private isSegmentMatch(url: string, pattern: string): boolean {
        const regex = new RegExp(pattern);
        const pagingMatch = regex.test(url);

        return pagingMatch;
    }
}

export function getPageNumber(pagerMode: PagerMode, requestContext: TransferableRequestContext, pagerQueryTemplate: string = PagerViewModel.PageNumberDefaultQueryTemplate, pagerTemplate: string = PagerViewModel.PageNumberDefaultTemplate) {
    if (pagerMode === PagerMode.QueryParameter) {
        const template = pagerQueryTemplate !== '' ? pagerQueryTemplate : PagerViewModel.PageNumberDefaultQueryTemplate;
        const queryParams = requestContext.searchParams;
        const pagerQueryParam = parseInt(queryParams[template], 10);

        return !isNaN(pagerQueryParam) ? pagerQueryParam : 1;
    } else {
        let pageNumber = 1;
        const url = requestContext.url;
        const template = pagerTemplate !== '' ? pagerTemplate : PagerViewModel.PageNumberDefaultTemplate;
        const extractorRegex = template.match(/(.*?)\{\{[A-z]+\}\}(.*)/);
        if (extractorRegex) {
            const firstPart = extractorRegex[1];
            const secondPart = extractorRegex[2];
            const pageSegmentRegex = `${firstPart}\\d{1,}${secondPart}`;

            if (url.match(new RegExp(pageSegmentRegex))) {
                const templateSegments = pageSegmentRegex.split('/');

                templateSegments.forEach(templateSegment => {
                    if (templateSegment.indexOf('\\d{1,}') > -1) {
                        let prefix = templateSegment.split('\\d{1,}')[0];
                        let suffix = templateSegment.split('\\d{1,}')[1];
                        let pattern = '^' + prefix + '(\\d{1,})' + suffix + '$';
                        const segments = url.split('/');
                        let numberSegmentMatches = segments.map(x => x.match(new RegExp(pattern))).filter(x => x);

                        if (numberSegmentMatches?.length === 1) {
                            pageNumber = parseInt(numberSegmentMatches[0]![1], 10);
                            const segmentIndex = requestContext.layout.UrlParameters?.findIndex(x => x === numberSegmentMatches[0]![0]);
                            requestContext.layout.UrlParameters?.splice(segmentIndex, 1);
                        }
                    } else {
                        const segmentIndex = requestContext.layout.UrlParameters?.findIndex(x => x === templateSegment);
                        if (segmentIndex > -1) {
                            requestContext.layout.UrlParameters?.splice(segmentIndex, 1);
                        }
                    }
                });
            }
        }

        return pageNumber;
    }
}
