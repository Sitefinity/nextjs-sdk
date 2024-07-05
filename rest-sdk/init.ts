import { setAdditionalFetchDataServerContext, setHostServerContext, setQueryParamsServerContext } from '../services/server-context';
import { ServiceMetadata } from './service-metadata';

export async function initServerSideRestSdk(restSdkInitInfo: RestSdkInitInfo) {
    await ServiceMetadata.fetch(restSdkInitInfo.metadataHash || '', restSdkInitInfo.traceContext);

    if (restSdkInitInfo.queryParams) {
        setQueryParamsServerContext(restSdkInitInfo.queryParams);
    }

    if (restSdkInitInfo.host) {
        setHostServerContext(restSdkInitInfo.host);
    }

    if (restSdkInitInfo.additionalFetchData) {
        setAdditionalFetchDataServerContext(restSdkInitInfo.additionalFetchData);
    }
}

export interface RestSdkInitInfo {
    queryParams?: { [key: string]: string };
    metadataHash?: string;
    traceContext?: any;
    host?: string;
    additionalFetchData?: any;
}
