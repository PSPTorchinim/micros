/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## GEAR SERVICE TYPE EXPORTS     ##
 * ---------------------------------------------------------------
 */

// Import all types from the service
import * as GearTypes from './gear/apiMap';

// Export the Api class with a specific name to avoid conflicts
export { Api as GearApi } from './gear/apiMap';

// Try to export other types safely (without re-exporting to avoid conflicts)
export type GearQueryParamsType = GearTypes.QueryParamsType;
export type GearRequestParams = GearTypes.RequestParams;
export type GearFullRequestParams = GearTypes.FullRequestParams;
export type GearApiConfig = GearTypes.ApiConfig<any>;

// Create a namespace export for clean access to all types
export namespace Gear {
  // Re-export all types within the namespace
  export type Api<T = any> = GearTypes.Api<T>;
  export const ContentType = GearTypes.ContentType;
  export type HttpClient<T = any> = GearTypes.HttpClient<T>;
  export type QueryParamsType = GearTypes.QueryParamsType;
  export type RequestParams = GearTypes.RequestParams;
  export type FullRequestParams = GearTypes.FullRequestParams;
  export type ApiConfig<T = any> = GearTypes.ApiConfig<T>;
}
