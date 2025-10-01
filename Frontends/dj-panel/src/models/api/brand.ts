/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## BRAND SERVICE TYPE EXPORTS     ##
 * ---------------------------------------------------------------
 */

// Import all types from the service
import * as BrandTypes from './brand/apiMap';

// Export the Api class with a specific name to avoid conflicts
export { Api as BrandApi } from './brand/apiMap';

// Try to export other types safely (without re-exporting to avoid conflicts)
export type BrandQueryParamsType = BrandTypes.QueryParamsType;
export type BrandRequestParams = BrandTypes.RequestParams;
export type BrandFullRequestParams = BrandTypes.FullRequestParams;
export type BrandApiConfig = BrandTypes.ApiConfig<any>;

// Create a namespace export for clean access to all types
export namespace Brand {
  // Re-export all types within the namespace
  export type Api<T = any> = BrandTypes.Api<T>;
  export const ContentType = BrandTypes.ContentType;
  export type HttpClient<T = any> = BrandTypes.HttpClient<T>;
  export type QueryParamsType = BrandTypes.QueryParamsType;
  export type RequestParams = BrandTypes.RequestParams;
  export type FullRequestParams = BrandTypes.FullRequestParams;
  export type ApiConfig<T = any> = BrandTypes.ApiConfig<T>;
}
