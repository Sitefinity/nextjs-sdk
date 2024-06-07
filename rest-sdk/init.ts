import { ServiceMetadata } from './service-metadata';

export async function initRestSdk(traceContext?: any) {
    await ServiceMetadata.fetch(traceContext);
}
