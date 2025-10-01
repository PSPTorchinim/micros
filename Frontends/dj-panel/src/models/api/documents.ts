/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## DOCUMENTS SERVICE TYPE EXPORTS     ##
 * ---------------------------------------------------------------
 */

// Import all types from the service
import * as DocumentsTypes from './documents/apiMap';

// Export the Api class with a specific name to avoid conflicts
export { Api as DocumentsApi } from './documents/apiMap';

// Try to export other types safely (without re-exporting to avoid conflicts)
export type DocumentsQueryParamsType = DocumentsTypes.QueryParamsType;
export type DocumentsRequestParams = DocumentsTypes.RequestParams;
export type DocumentsFullRequestParams = DocumentsTypes.FullRequestParams;
export type DocumentsApiConfig = DocumentsTypes.ApiConfig<any>;

// Create a namespace export for clean access to all types
export namespace Documents {
  // Re-export all types within the namespace
  export type Api<T = any> = DocumentsTypes.Api<T>;
  export const ContentType = DocumentsTypes.ContentType;
  export type HttpClient<T = any> = DocumentsTypes.HttpClient<T>;
  export type QueryParamsType = DocumentsTypes.QueryParamsType;
  export type RequestParams = DocumentsTypes.RequestParams;
  export type FullRequestParams = DocumentsTypes.FullRequestParams;
  export type ApiConfig<T = any> = DocumentsTypes.ApiConfig<T>;
}
