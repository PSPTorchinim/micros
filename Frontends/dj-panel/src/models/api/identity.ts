/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## IDENTITY SERVICE TYPE EXPORTS     ##
 * ---------------------------------------------------------------
 */

// Import all types from the service
import * as IdentityTypes from './identity/apiMap';

// Export the Api class with a specific name to avoid conflicts
export { Api as IdentityApi } from './identity/apiMap';

// Try to export other types safely (without re-exporting to avoid conflicts)
export type IdentityQueryParamsType = IdentityTypes.QueryParamsType;
export type IdentityRequestParams = IdentityTypes.RequestParams;
export type IdentityFullRequestParams = IdentityTypes.FullRequestParams;
export type IdentityApiConfig = IdentityTypes.ApiConfig<any>;

// Create a namespace export for clean access to all types
export namespace Identity {
  // Re-export all types within the namespace
  export type Api<T = any> = IdentityTypes.Api<T>;
  export const ContentType = IdentityTypes.ContentType;
  export type HttpClient<T = any> = IdentityTypes.HttpClient<T>;
  export type QueryParamsType = IdentityTypes.QueryParamsType;
  export type RequestParams = IdentityTypes.RequestParams;
  export type FullRequestParams = IdentityTypes.FullRequestParams;
  export type ApiConfig<T = any> = IdentityTypes.ApiConfig<T>;
}
