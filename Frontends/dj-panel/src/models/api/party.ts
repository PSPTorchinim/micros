/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## PARTY SERVICE TYPE EXPORTS     ##
 * ---------------------------------------------------------------
 */

// Import all types from the service
import * as PartyTypes from './party/apiMap';

// Export the Api class with a specific name to avoid conflicts
export { Api as PartyApi } from './party/apiMap';

// Try to export other types safely (without re-exporting to avoid conflicts)
export type PartyQueryParamsType = PartyTypes.QueryParamsType;
export type PartyRequestParams = PartyTypes.RequestParams;
export type PartyFullRequestParams = PartyTypes.FullRequestParams;
export type PartyApiConfig = PartyTypes.ApiConfig<any>;

// Create a namespace export for clean access to all types
export namespace Party {
  // Re-export all types within the namespace
  export type Api<T = any> = PartyTypes.Api<T>;
  export const ContentType = PartyTypes.ContentType;
  export type HttpClient<T = any> = PartyTypes.HttpClient<T>;
  export type QueryParamsType = PartyTypes.QueryParamsType;
  export type RequestParams = PartyTypes.RequestParams;
  export type FullRequestParams = PartyTypes.FullRequestParams;
  export type ApiConfig<T = any> = PartyTypes.ApiConfig<T>;
}
