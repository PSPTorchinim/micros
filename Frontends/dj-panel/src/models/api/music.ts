/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## MUSIC SERVICE TYPE EXPORTS     ##
 * ---------------------------------------------------------------
 */

// Import all types from the service
import * as MusicTypes from './music/apiMap';

// Export the Api class with a specific name to avoid conflicts
export { Api as MusicApi } from './music/apiMap';

// Try to export other types safely (without re-exporting to avoid conflicts)
export type MusicQueryParamsType = MusicTypes.QueryParamsType;
export type MusicRequestParams = MusicTypes.RequestParams;
export type MusicFullRequestParams = MusicTypes.FullRequestParams;
export type MusicApiConfig = MusicTypes.ApiConfig<any>;

// Create a namespace export for clean access to all types
export namespace Music {
  // Re-export all types within the namespace
  export type Api<T = any> = MusicTypes.Api<T>;
  export const ContentType = MusicTypes.ContentType;
  export type HttpClient<T = any> = MusicTypes.HttpClient<T>;
  export type QueryParamsType = MusicTypes.QueryParamsType;
  export type RequestParams = MusicTypes.RequestParams;
  export type FullRequestParams = MusicTypes.FullRequestParams;
  export type ApiConfig<T = any> = MusicTypes.ApiConfig<T>;
}
