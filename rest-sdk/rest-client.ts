import { Dictionary } from '../typings/dictionary';
import { BreadcrumbItem } from './dto/breadcrumb-item';
import { CollectionResponse } from './dto/collection-response';
import { GenericContentItem } from './dto/generic-content-item';
import { NavigationItem } from './dto/navigation-item';
import { SdkItem } from './dto/sdk-item';
import { Widget } from './dto/widget';
import { RootUrlService } from './root-url.service';
import { ServiceMetadata } from './service-metadata';
import { CreateArgs } from './args/create.args';
import { CreateWidgetArgs } from './args/create-widget.args';
import { DeleteArgs } from './args/delete.args';
import { GetAllArgs } from './args/get-all.args';
import { GetBreadcrumbArgs } from './args/get-breadcrumb.args';
import { GetPageLayoutArgs } from './args/get-page-layout.args';
import { GetNavigationArgs } from './args/get-navigation.args';
import { ItemArgs } from './args/item.args';
import { LockArgs } from './args/lock-page.args';
import { PublishArgs } from './args/publish.args';
import { RelateArgs } from './args/relate.args';
import { ScheduleArgs } from './args/schedule.args';
import { UpdateArgs } from './args/update.args';
import { UploadMediaArgs } from './args/upload.args';
import { LayoutResponse, LayoutServiceResponse } from './dto/layout-service.response';
import { ODataFilterSerializer } from './services/odata-filter-serializer';
import { GetFormLayoutArgs } from './args/get-form-layout.args';
import { UserDto } from './dto/user-item';
import { ExternalProvider } from './dto/external-provider';
import { RegistrationSettingsDto } from './dto/registration-settings';
import { FacetsViewModelDto } from './dto/facets/facets-viewmodel-dto';
import { GetFacetsArgs } from './args/get-facets.args';
import { FacetFlatResponseDto } from './dto/facets/facet-flat-dto';
import { SearchArgs } from './args/perform-search.args';
import { SearchResultDocumentDto } from './dto/search-results-document-dto';
import { GetTaxonArgs } from './args/get-taxon.args';
import { TaxonDto } from './dto/taxon-dto';
import { GetTemplatesArgs } from './args/get-templates-args';
import { PageTemplateCategoryDto } from './dto/page-template-category.dto';
import { getProxyHeaders } from '../proxy/headers';
import { WidgetModel } from '../editor/widget-framework/widget-model';
import { GetHierarchicalWidgetModelArgs } from './args/get-hierarchical-widget-model.args';
import { CommonArgs } from './args/common.args';
import { GetLazyWidgetsArgs } from './args/get-lazy-widgets.args';
import { ErrorCodeException } from './errors/error-code.exception';
import { notFound } from 'next/navigation';
import { RedirectResponse } from './dto/redirect.response';

export class RestClient {
    public static contextQueryParams: { [key: string]: string };
    public static host: string | null;

    public static getItemWithFallback<T extends SdkItem>(args: ItemArgs): Promise<T> {
        let queryParams: Dictionary = {
            sf_fallback_prop_names: '*',
            $select: '*'
        };

        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})/Default.GetItemWithFallback()${RestClient.buildQueryParams(RestClient.getQueryParams(args, queryParams))}`;
        return this.sendRequest<T>({ url: wholeUrl });
    }

    public static getTaxons(args: GetTaxonArgs): Promise<TaxonDto[]> {
        const queryParams = {
            'showEmpty': args.showEmpty.toString(),
            '$orderby': args.orderBy,
            '@param': `[${(args.taxaIds || []).map(x => `'${x}'`).toString()}]`
        };

        const taxonomy = ServiceMetadata.taxonomies.find(x => x.Id === args.taxonomyId);
        if (!taxonomy) {
            throw `The taxonomy with id ${args.taxonomyId} does not exist`;
        }

        const action = `Default.GetTaxons(taxonomyId=${args.taxonomyId},selectedTaxaIds=@param,selectionMode='${args.selectionMode}',contentType='${args.contentType}')`;
        const wholeUrl = `${RestClient.buildItemBaseUrl(taxonomy['TaxaUrl'])}/${action}${RestClient.buildQueryParams(RestClient.getQueryParams(undefined, queryParams))}`;

        return this.sendRequest<{ value: SdkItem[] }>({ url: wholeUrl }).then(x => x.value as TaxonDto[]);
    }

    public static getItemWithStatus<T extends SdkItem>(args: ItemArgs): Promise<T> {
        let queryParams = {
            $select: '*'
        };

        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})/Default.GetItemWithStatus()${RestClient.buildQueryParams(RestClient.getQueryParams(args, queryParams))}`;

        return this.sendRequest<T>({ url: wholeUrl });
    }

    public static getItem<T extends SdkItem>(args: ItemArgs): Promise<T> {
        let queryParams = {
            $select: '*'
        };

        const wholeUrl = `${this.buildItemBaseUrl(args.type)}(${args.id})${this.buildQueryParams(RestClient.getQueryParams(args, queryParams))}`;
        return this.sendRequest<T>({ url: wholeUrl });
    }

    public static getSharedContent(id: string, cultureName: string): Promise<GenericContentItem> {
        let queryParams: {[key: string]: string} = {
            sf_fallback_prop_names: 'Content'
        };

        if (cultureName) {
            queryParams['sf_culture'] = cultureName;
        }

        const wholeUrl = `${RestClient.buildItemBaseUrl(RestSdkTypes.GenericContent)}/Default.GetItemById(itemId=${id})${RestClient.buildQueryParams(RestClient.getQueryParams(undefined, queryParams))}`;
        return this.sendRequest<GenericContentItem>({ url: wholeUrl });
    }

    public static getItems<T extends SdkItem>(args: GetAllArgs): Promise<CollectionResponse<T>> {

        const filteredSimpleFields = this.getSimpleFields(args.type, args.fields || []);
        const filteredRelatedFields = this.getRelatedFields(args.type, args.fields || []);

        let queryParams: { [key: string]: any } = {
            '$count': args.count,
            '$orderby': args.orderBy ? args.orderBy.map(x => `${x.Name} ${x.Type}`) : null,
            '$select': filteredSimpleFields.join(','),
            '$expand': filteredRelatedFields.join(','),
            '$skip': args.skip,
            '$top': args.take,
            '$filter': args.filter ? new ODataFilterSerializer().serialize({ Type: args.type, Filter: args.filter }) : null
        };

        const wholeUrl = `${this.buildItemBaseUrl(args.type)}${this.buildQueryParams(RestClient.getQueryParams(undefined, queryParams))}`;
        return this.sendRequest<{ value: T[], '@odata.count'?: number }>({ url: wholeUrl }).then((x) => {
            return <CollectionResponse<T>>{ Items: x.value, TotalCount: x['@odata.count'] };
        });
    }

    public static createItem<T extends SdkItem>(args: CreateArgs): Promise<T> {
        let taxonomyPrefix = 'Taxonomy_';
        if (args.type.startsWith(taxonomyPrefix)) {
            const actualTaxonomyType = args.type.substring(taxonomyPrefix.length);
            const taxonomy = ServiceMetadata.taxonomies.find(x => x['Name'] === actualTaxonomyType) as SdkItem;
            if (!taxonomy) {
                throw `Taxonomy with the name ${taxonomy} does not exist`;
            }

            args.type = taxonomy['TaxaUrl'];
            args.data['TaxonomyId'] = taxonomy.Id;
        }

        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}${RestClient.buildQueryParams(RestClient.getQueryParams(args, undefined))}`;

        return RestClient.sendRequest({
            url: wholeUrl,
            data: args.data,
            method: 'POST',
            headers: args.additionalHeaders
        }).then((x) => {
            return x as T;
        });
    }

    public static scheduleItem(args: ScheduleArgs): Promise<void> {
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})/Default.Operation()${RestClient.buildQueryParams(RestClient.getQueryParams(args, undefined))}`;

        return RestClient.sendRequest({
            url: wholeUrl,
            data: {
                action: 'Schedule',
                actionParameters: {
                    PublicationDate: args.publicationDate.toISOString(),
                    ExpirationDate: args.expirationDate?.toISOString()
                }
            },
            method: 'POST',
            headers: args.additionalHeaders
        });
    }

    public static updateItem(args: UpdateArgs): Promise<void> {
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})${RestClient.buildQueryParams(RestClient.getQueryParams(args, undefined))}`;

        return RestClient.sendRequest({
            url: wholeUrl,
            data: args.data,
            method: 'PATCH',
            headers: args.additionalHeaders
        });
    }

    public static deleteItem<T extends SdkItem>(args: DeleteArgs): Promise<T> {
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})${RestClient.buildQueryParams(RestClient.getQueryParams(args, undefined))}`;

        return RestClient.sendRequest({
            url: wholeUrl,
            method: 'DELETE',
            headers: args.additionalHeaders
        }).then((x) => {
            return x as T;
        });
    }

    public static publishItem(args: PublishArgs): Promise<void> {
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})/Default.Operation()${RestClient.buildQueryParams(RestClient.getQueryParams(args, undefined))}`;
        return RestClient.sendRequest({
            url: wholeUrl,
            data: {
                action: 'Publish',
                actionParameters: {}
            },
            method: 'POST',
            headers: args.additionalHeaders
        });
    }

    public static syncPage(args: UpdateArgs): Promise<void> {
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})${RestClient.buildQueryParams(RestClient.getQueryParams(args, undefined))}`;
        return RestClient.sendRequest({
            url: wholeUrl,
            data: Object.assign({}, args.data, { EnableSync: true }),
            method: 'PATCH',
            headers: args.additionalHeaders
        });
    }

    public static lockItem(args: ItemArgs): Promise<void> {
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})/Default.SaveTemp()${RestClient.buildQueryParams(RestClient.getQueryParams(args, undefined))}`;
        return RestClient.sendRequest({
            url: wholeUrl,
            data: {
                model: {}
            },
            method: 'POST',
            headers: args.additionalHeaders
        });
    }

    public static relateItem(args: RelateArgs): Promise<void> {
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})/${args.relationName}/$ref${RestClient.buildQueryParams(RestClient.getQueryParams(args, undefined))}`;

        const relatedTypeName = ServiceMetadata.getRelatedType(args.type, args.relationName);
        if (!relatedTypeName) {
            throw `Cannot find the type behind the field -> ${args.relationName}`;
        }

        const relatedItemUri = `${RestClient.buildItemBaseUrl(relatedTypeName)}(${args.relatedItemId})`;
        return RestClient.sendRequest({
            url: wholeUrl,
            data: {
                '@odata.id': relatedItemUri
            },
            method: 'POST',
            headers: args.additionalHeaders
        });
    }

    public static lockPage(args: LockArgs): Promise<void> {
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})/Default.Lock()${RestClient.buildQueryParams(RestClient.getQueryParams(args, undefined))}`;
        return RestClient.sendRequest({
            url: wholeUrl,
            data: {
                state: {
                    Version: args.version
                }
            },
            method: 'POST',
            headers: args.additionalHeaders
        });
    }

    public static createWidget(args: CreateWidgetArgs): Promise<Widget> {
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})/Default.AddWidget()${RestClient.buildQueryParams(RestClient.getQueryParams(args, undefined))}`;

        const properties: Array<{ Name: string, Value: string }> = [];

        if (args.properties) {
            Object.keys(args.properties).forEach((x) => {
                properties.push({
                    Name: x,
                    Value: (args.properties as any)[x]
                });
            });
        }

        const dto = {
            widget: {
                Id: null,
                Name: args.name,
                SiblingKey: args.siblingKey,
                ParentPlaceholderKey: args.parentPlaceholderKey,
                PlaceholderName: args.placeholderName,
                Properties: properties
            }
        };

        return RestClient.sendRequest({
            url: wholeUrl,
            data: dto,
            method: 'POST',
            headers: args.additionalHeaders
        });
    }

    public static uploadItem(args: UploadMediaArgs): Promise<SdkItem> {
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}${RestClient.buildQueryParams(RestClient.getQueryParams(args, undefined))}`;
        const headers = args.additionalHeaders || {};
        const data = Object.assign({}, args.fields, { Title: args.title, ParentId: args.parentId, UrlName: args.urlName });

        headers['X-Sf-Properties'] = JSON.stringify(data);
        headers['X-File-Name'] = args.fileName;
        headers['Content-Type'] = args.contentType;
        headers['Content-Length'] = args.binaryData.length.toString();
        headers['Content-Encoding'] = 'base64';
        headers['DirectUpload'] = true.toString();

        return RestClient.sendRequest({
            url: wholeUrl,
            data: args.binaryData,
            method: 'POST',
            headers
        }).then((x) => {
            return x as SdkItem;
        });
    }

    public static performSearch(args: SearchArgs) {
        const query = {
            ['indexCatalogue']: args.indexCatalogue,
            ['searchQuery']: encodeURIComponent(args.searchQuery).toLowerCase(),
            ['wordsMode']: args.wordsMode,
            ['$orderBy']: args.orderBy,
            ['sf_culture']: args.culture,
            ['$skip']: args.skip?.toString(),
            ['$top']: args.take?.toString(),
            ['searchFields']: args.searchFields,
            ['highlightedFields']: args.highlightedFields,
            ['resultsForAllSites']: '',
            ['scoringInfo']: args.scoringInfo,
            ['filter']: args.filter
        };

        if (!!args.resultsForAllSites) {
            if (args.resultsForAllSites === true) {
                query['resultsForAllSites'] = '1';
            } else {
                query['resultsForAllSites'] = '2';
            }
        }

        const serviceUrl = RootUrlService.getServerCmsServiceUrl();
        const wholeUrl = `${serviceUrl}/Default.PerformSearch()${RestClient.buildQueryParams(RestClient.getQueryParams(undefined, query))}`;
        return RestClient.sendRequest<{ TotalCount: number, SearchResults: SearchResultDocumentDto[] }>({ url: wholeUrl }).then(x => {
            return {
                totalCount: x.TotalCount,
                searchResults: x.SearchResults
            };
        });
    }

    public static getFacatebleFields(indexCatalogue: string): Promise<FacetsViewModelDto[]> {
        const serviceUrl = RootUrlService.getServerCmsServiceUrl();
        const wholeUrl = `${serviceUrl}/Default.GetFacetableFields(indexCatalogName='${indexCatalogue}')`;

        return RestClient.sendRequest<{ value: FacetsViewModelDto[] }>({ url: wholeUrl }).then(x => x.value);
    }

    public static async getFacets(args: GetFacetsArgs): Promise<FacetFlatResponseDto[]> {
        const facetsStr = JSON.stringify(args.facets);
        const additionalQueryParams = {
            ['searchQuery']: args.searchQuery,
            ['sf_culture']: args.culture,
            ['indexCatalogName']: args.indexCatalogue,
            ['filter']: args.filter,
            ['resultsForAllSites']: args.resultsForAllSites,
            ['searchFields']: args.searchFields,
            ['facetFields']: facetsStr
        };

        const serviceUrl = RootUrlService.getServerCmsServiceUrl();
        const wholeUrl = `${serviceUrl}/Default.GetFacets()${RestClient.buildQueryParams(RestClient.getQueryParams(undefined, additionalQueryParams))}`;

        return RestClient.sendRequest<{ value: FacetFlatResponseDto[] }>({ url: wholeUrl }).then(x => x.value);
    }

    public static getResetPasswordModel(token: string): Promise<RegistrationSettingsDto> {
        const serviceUrl = RootUrlService.getServerCmsServiceUrl();
        const wholeUrl = `${serviceUrl}/Default.GetResetPasswordModel()`;

        return RestClient.sendRequest<RegistrationSettingsDto>({ url: wholeUrl, data: { securityToken: token }, method: 'POST' });
    }

    public static getRegistrationSettings(): Promise<RegistrationSettingsDto> {
        const serviceUrl = RootUrlService.getServerCmsServiceUrl();
        const wholeUrl = `${serviceUrl}/Default.RegistrationSettings()`;

        return RestClient.sendRequest<RegistrationSettingsDto>({ url: wholeUrl });
    }

    public static activateAccount(encryptedParam: string): Promise<void> {
        const serviceUrl = RootUrlService.getServerCmsServiceUrl();
        const wholeUrl = `${serviceUrl}/Default.AccountActivation()${RestClient.buildQueryParams({ qs: encodeURIComponent(encryptedParam) })}`;

        return RestClient.sendRequest({ url: wholeUrl });
    }

    public static getExternalProviders(): Promise<ExternalProvider[]> {
        const serviceUrl = RootUrlService.getServerCmsServiceUrl();
        const wholeUrl = `${serviceUrl}/Default.GetExternalProviders()`;

        return RestClient.sendRequest<{ value: ExternalProvider[] }>({ url: wholeUrl }).then((x) => x.value);
    }

    public static getCurrentUser(): Promise<UserDto> {
        const wholeUrl = `${RestClient.buildItemBaseUrl('users')}/current`;

        return RestClient.sendRequest<{ value: UserDto }>({
            url: wholeUrl,
            method: 'GET'
        }).then((x) => {
            return x.value;
        });
    }

    public static getNavigation(args: GetNavigationArgs): Promise<NavigationItem[]> {
        let queryMap: { [key: string]: any } = {
            'selectionModeString': args.selectionMode,
            'showParentPage': args.showParentPage ? args.showParentPage.toString() : undefined,
            'sf_page_node': args.currentPage,
            'selectedPages': args.selectedPages && args.selectedPages.length > 0 ? JSON.stringify(args.selectedPages) : undefined,
            'levelsToInclude': args.levelsToInclude ? args.levelsToInclude.toString() : 'all',
            'selectedPageId': args.selectedPageId
        };

        const wholeUrl = `${RestClient.buildItemBaseUrl(RestSdkTypes.Pages)}/Default.HierarhicalByLevelsResponse()${RestClient.buildQueryParams(RestClient.getQueryParams(undefined, queryMap))}`;

        return this.sendRequest<{ value: NavigationItem[], '@odata.count': number }>({ url: wholeUrl }).then((x) => {
            return x.value;
        });
    }

    public static getBreadcrumb(args: GetBreadcrumbArgs): Promise<BreadcrumbItem[]> {
        let queryMap: Dictionary = {};
        Object.keys(args).filter(x => (args as any)[x]).map((x) => {
            if (x === 'detailItemInfo') {
                queryMap[x] = JSON.stringify(args[x]);
            } else {
                queryMap[x] = (args as any)[x].toString();
            }
        });

        const wholeUrl = `${RestClient.buildItemBaseUrl(RestSdkTypes.Pages)}/Default.GetBreadcrumb()${RestClient.buildQueryParams(RestClient.getQueryParams(undefined, queryMap))}`;
        return this.sendRequest<{ value: BreadcrumbItem[], '@odata.count'?: number }>({ url: wholeUrl }).then((x) => {
            return x.value;
        });
    }

    public static async getFormLayout(args: GetFormLayoutArgs): Promise<LayoutServiceResponse> {
        const wholeUrl = `${RestClient.buildItemBaseUrl(RestSdkTypes.Form)}(${args.id})/Default.Model()${RestClient.buildQueryParams(RestClient.getQueryParams(undefined, args.additionalQueryParams))}`;
        return RestClient.sendRequest({ url: wholeUrl, headers: args.additionalHeaders });
    }

    public static async getWidgetModel(args: GetHierarchicalWidgetModelArgs): Promise<WidgetModel<any>> {
        args.additionalQueryParams = args.additionalQueryParams || {};
        args.additionalQueryParams.sfwidgetsegment = args.widgetSegmentId || '';
        args.additionalQueryParams.segment = args.segmentId || '';

        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})/Default.HierarchicalWidgetModel(componentId='${args.widgetId}')${RestClient.buildQueryParams(RestClient.getQueryParams(undefined, args.additionalQueryParams))}`;
        return RestClient.sendRequest({ url: wholeUrl, headers: args.additionalHeaders });
    }

    public static async getLazyWidgets(args: GetLazyWidgetsArgs): Promise<Array<WidgetModel<any>>> {
        let url = encodeURIComponent(args.url);
        let concatChar = '?';
        if (url.indexOf('?')) {
            concatChar = '&';
        }

        let lazyComponentsUrl = RootUrlService.getServerCmsServiceUrl() + `/Default.LazyComponents(url=@param)?@param='${url}'${concatChar}correlationId=${args.correlationId}`;

        const headers: { [key:string]: string } = { 'Cookie': args.cookie };
        const referrer = args.referrer;
        if (referrer && referrer.length > 0) {
            headers['SF_URL_REFERER'] = referrer;
        } else {
            headers['SF_NO_URL_REFERER'] = 'true';
        }

        return RestClient.sendRequest<{ Components: Array<WidgetModel<any>> }>({ url: lazyComponentsUrl, headers }).then(x => x.Components);
    }

    public static async getPageLayout(args: GetPageLayoutArgs): Promise<LayoutResponse> {
        const pagePath = args.pagePath;

        let headers: { [key: string]: string } = args.additionalHeaders || {};
        if (args.cookie) {
            headers['Cookie'] = args.cookie;
            if (typeof window === 'undefined') {
                const proxyHeaders = getProxyHeaders(RestClient.host!);
                Object.keys(proxyHeaders).forEach((header) => {
                    headers[header] = proxyHeaders[header];
                });
            }
        }

        const queryParams = args.queryParams || {};
        let sysParamsQueryString = RestClient.buildQueryParams(queryParams);
        const url = `/${pagePath}${sysParamsQueryString}`;

        let requestData: RequestData = { url: RootUrlService.getServerCmsUrl() + url, headers: headers, method: 'GET' };

        const requestInit: RequestInit = { headers, method: requestData.method, redirect: 'manual' };

        let httpLayoutResponse: Response | null = null;
        try {
            httpLayoutResponse = await fetch(requestData.url, requestInit);
        } catch (error) {
            if (error instanceof ErrorCodeException && error.code === 'NotFound') {
                throw error;
            }

            if (error instanceof ErrorCodeException && error.code === 'Unauthorized') {
                throw `Could not authorize fetching layout for url '${pagePath}'. Contact your system administator or check your access token.`;
            }
        }

        if (!httpLayoutResponse) {
            throw 'Error while fetching the page';
        }

        if (httpLayoutResponse.status === 302 && httpLayoutResponse.headers.has('urlparameters')) {
            let urlParameters = (httpLayoutResponse.headers.get('urlparameters') as string).split('/');
            args.pagePath = httpLayoutResponse.headers.get('location') as string;
            const layoutRecursive = await this.getPageLayout(args);
            layoutRecursive.layout!.UrlParameters = urlParameters;
            return layoutRecursive;
        }

        if ((httpLayoutResponse.status === 301 || httpLayoutResponse.status === 302)) {
            const location = httpLayoutResponse.headers.get('location') as string;
            if (!args.followRedirects) {
                return {
                    isRedirect: true,
                    redirect: {
                        Location: location,
                        Permenant: httpLayoutResponse.status === 301
                    }
                };
            } else {
                args.pagePath = location;
                const layoutRecursive = await this.getPageLayout(args);
                return layoutRecursive;
            }
        }

        if (httpLayoutResponse.status === 404) {
            throw new ErrorCodeException('NotFound', 'page not found');
        }

        const layoutResponse = await RestClient.handleApiResponse<LayoutServiceResponse>(httpLayoutResponse, requestData, true);
        return {
            isRedirect: false,
            layout: layoutResponse
        };
    }

    public static async getTemplates(args: GetTemplatesArgs): Promise<PageTemplateCategoryDto[]> {
        const wholeUrl = `${RootUrlService.getServerCmsUrl()}/sf/system/${args.type}/Default.GetPageTemplates(selectedPages=[${args.selectedPages.map(x => `'${x}'`).join(',')}])${RestClient.buildQueryParams(RestClient.getQueryParams(undefined, args.additionalQueryParams))}`;
        return RestClient.sendRequest<{ value: PageTemplateCategoryDto[] } >({ url: wholeUrl, headers: args.additionalHeaders }).then(x => x.value);
    }

    private static getSimpleFields(type: string, fields: string[]): string[] {
        let star = '*';
        if (fields != null && fields.length === 1 && fields[0] === star) {
            return [star];
        }

        let simpleFields = ServiceMetadata.getSimpleFields(type);
        return fields.filter(x => simpleFields.some(y => y === x));
    }

    private static getRelatedFields(type: string, fields: string[]): string[] {
        let star = '*';
        if (fields != null && fields.length === 1 && fields[0] === star) {
            return [star];
        }

        const result: string[] = [];
        const relatedFields = ServiceMetadata.getRelationFields(type);
        const pattern = /(?<fieldName>.+?)\((?<nested>.+)\)/;
        fields.forEach((field) => {
            const fieldMatch = field.match(pattern);
            if (!fieldMatch && relatedFields.some(x => x === field)) {
                result.push(field);
            } else if (fieldMatch && fieldMatch.groups) {
                const fieldName = fieldMatch.groups['fieldName'];
                if (relatedFields.some(x => x === fieldName)) {
                    const innerFields = fieldMatch.groups['nested'];
                    const relatedFieldsInput = this.parseInnerFields(innerFields);

                    const relatedTypeName = ServiceMetadata.getRelatedType(type, fieldName);
                    if (relatedTypeName) {
                        let relatedSimpleFields = ServiceMetadata.getSimpleFields(relatedTypeName);
                        relatedSimpleFields = relatedFieldsInput.filter(x => relatedSimpleFields.some(y => y === x));

                        let simpleFieldsJoined: string | null = null;
                        if (relatedSimpleFields.length > 0) {
                            simpleFieldsJoined = relatedSimpleFields.join(',');
                            simpleFieldsJoined = `$select=${simpleFieldsJoined}`;
                        }

                        const relatedRelationFields = RestClient.getRelatedFields(relatedTypeName, relatedFieldsInput);
                        let relatedRelationFieldsJoined: string | null = null;
                        if (relatedRelationFields.length > 0) {
                            relatedRelationFieldsJoined = relatedRelationFields.join(',');
                            relatedRelationFieldsJoined = `$expand=${relatedRelationFieldsJoined}`;
                        }

                        let resultString: string | null = null;
                        if (relatedRelationFieldsJoined && simpleFieldsJoined) {
                            resultString = `${fieldName}(${simpleFieldsJoined};${relatedRelationFieldsJoined})`;
                        } else if (relatedRelationFieldsJoined) {
                            resultString = `${fieldName}(${relatedRelationFieldsJoined})`;
                        } else if (simpleFieldsJoined) {
                            resultString = `${fieldName}(${simpleFieldsJoined})`;
                        }

                        if (resultString) {
                            result.push(resultString);
                        }
                    }
                }
            }
        });

        return result;
    }

    private static parseInnerFields(input: string): string[] {
        const allFields: string[] = [];

        let fieldStartIndex = 0;
        let charIterator = 0;
        let openingBraceCounter = 0;
        let closingBraceCounter = 0;

        for (let i = 0; i < input.length; i++) {
            charIterator++;
            const character = input[i];
            if (character === '(') {
                openingBraceCounter++;
            }

            if (character === ')') {
                closingBraceCounter++;
            }

            if (character === ',') {
                if (openingBraceCounter > 0 && openingBraceCounter === closingBraceCounter) {
                    let relatedField = input.substring(fieldStartIndex, charIterator - fieldStartIndex - 1).trim();
                    allFields.push(relatedField);
                    fieldStartIndex = charIterator + 1;
                    openingBraceCounter = 0;
                    closingBraceCounter = 0;
                } else if (openingBraceCounter === 0 && closingBraceCounter === 0) {
                    let basicField = input.substring(fieldStartIndex, charIterator - fieldStartIndex - 1).trim();
                    allFields.push(basicField);
                    fieldStartIndex = charIterator + 1;
                }
            }
        }

        if (fieldStartIndex < charIterator) {
            let lastField = input.substring(fieldStartIndex, charIterator - fieldStartIndex).trim();
            allFields.push(lastField);
        }

        return allFields;
    }

    public static buildQueryParams(queryParams: { [key: string]: string | undefined } | undefined) {
        if (!queryParams) {
            return '';
        }

        if (!queryParams) {
            queryParams = {};
        }

        queryParams = Object.assign({}, RestClient.contextQueryParams || {}, queryParams);

        let result = '';
        Object.keys(queryParams).forEach((key) => {
            const value = (queryParams as any)[key];
            if (value) {
                result += `${key}=${value}&`;
            }
        });

        if (result !== '') {
            result = '?' + result;
            result = result.substring(0, result.length - 1);
        }

        return result;
    }

    public static addAuthHeaders(cookie: string | undefined, headers: {[key: string]: string}) {
        if (!!cookie) {
            headers['Cookie'] = cookie;
        } else if (process.env['SF_ACCESS_KEY']) {
            headers['X-SF-Access-Key'] = process.env['SF_ACCESS_KEY'];
        }
    }

    private static getQueryParams(args?: CommonArgs, queryParams?: Dictionary) {
        let queryParamsFromArgs = {};

        if (args) {
            queryParamsFromArgs = {
                'sf_provider': args.provider,
                'sf_culture': args.culture
            };
        }

        return Object.assign({}, RestClient.contextQueryParams || {}, queryParamsFromArgs, args?.additionalQueryParams || {}, queryParams || {});
    }

    private static buildHeaders(requestData: RequestData) {
        let headers: { [key:string]: string } = { 'X-Requested-With': 'react' };

        if ((requestData.method === 'POST' || requestData.method === 'PATCH') && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        if (typeof window === 'undefined') {
            const proxyHeaders = getProxyHeaders(RestClient.host!);
            Object.keys(proxyHeaders).forEach((headerKey) => {
                headers[headerKey] = proxyHeaders[headerKey];
            });
        }

        if (!requestData.headers) {
            return headers;
        }

        return Object.assign(headers, requestData.headers);
    }

    public static sendRequest<T>(request: RequestData): Promise<T> {
        const headers = this.buildHeaders(request);

        request.method = request.method || 'GET';
        const args: RequestInit = { headers, method: request.method };
        if (request.data && headers['Content-Type'] === 'application/json') {
            args.body = JSON.stringify(request.data);
        }

        if (headers['Content-Encoding'] === 'base64') {
            args.body = request.data;
        }

        if (process.env.NODE_ENV === 'development') {
            args.cache = 'no-cache';
        }

        return fetch(request.url, args).then((x => {
            return RestClient.handleApiResponse(x, request);
        }));
    }

    public static buildItemBaseUrl(itemType: string): string {
        let serviceUrl = null;
        if (typeof window === 'undefined') {
            serviceUrl = RootUrlService.getServerCmsServiceUrl();
        } else {
            serviceUrl = RootUrlService.getClientServiceUrl();
        }

        const setName = ServiceMetadata.getSetNameFromType(itemType);

        return `${serviceUrl}/${setName}`;
    }

    private static handleApiResponse<T>(x: Response, request: RequestData, throwErrorAsJson?: boolean): Promise<T> {
        const contentTypeHeader = x.headers.get('content-type');
        if (contentTypeHeader) {
            if (x.status > 399) {
                if (contentTypeHeader.indexOf('application/json') !== -1) {
                    return x.json().then((y) => {
                        if (throwErrorAsJson && y.error && y.error.code && y.error.message) {
                            throw new ErrorCodeException(y.error.code, y.error.message);
                        }

                        const message = `${request.method} ${request.url} failed. Response -> ${y.error.code}: ${y.error.message}`;
                        throw message;
                    });
                }

                return x.text().then((html) => {
                    const message = `${request.method} ${request.url} failed. Response -> ${x.status}: ${x.statusText} ${html}`;
                    throw message;
                });
            }

            if (contentTypeHeader.indexOf('application/json') !== -1) {
                return x.json().then(x => <T>x);
            }
        }

        return Promise.resolve<any>(undefined);
    }
}

export class RestSdkTypes {
    public static readonly Video: string = 'Telerik.Sitefinity.Libraries.Model.Video';
    public static readonly Image: string = 'Telerik.Sitefinity.Libraries.Model.Image';
    public static readonly News: string = 'Telerik.Sitefinity.News.Model.NewsItem';
    public static readonly Taxonomies: string = 'Telerik.Sitefinity.Taxonomies.Model.Taxonomy';
    public static readonly Tags: string = 'Taxonomy_Tags';
    public static readonly GenericContent: string = 'Telerik.Sitefinity.GenericContent.Model.ContentItem';
    public static readonly Pages: string = 'Telerik.Sitefinity.Pages.Model.PageNode';
    public static readonly Form: string = 'Telerik.Sitefinity.Forms.Model.FormDescription';
    public static readonly Site: string = 'Telerik.Sitefinity.Multisite.Model.Site';
}

interface RequestData {
    url: string;
    method?: string;
    headers?: { [key: string]: string };
    data?: any;
}
