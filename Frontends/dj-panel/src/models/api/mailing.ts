/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## MAILING SERVICE TYPE EXPORTS     ##
 * ---------------------------------------------------------------
 */

// Import all types from the service
import * as MailingTypes from './mailing/apiMap';

// Export the Api class with a specific name to avoid conflicts
export { Api as MailingApi } from './mailing/apiMap';

// Try to export other types safely (without re-exporting to avoid conflicts)
export type MailingQueryParamsType = MailingTypes.QueryParamsType;
export type MailingRequestParams = MailingTypes.RequestParams;
export type MailingFullRequestParams = MailingTypes.FullRequestParams;
export type MailingApiConfig = MailingTypes.ApiConfig<any>;

// Create a namespace export for clean access to all types
export namespace Mailing {
  // Re-export all types within the namespace
  export type Api<T = any> = MailingTypes.Api<T>;
  export const ContentType = MailingTypes.ContentType;
  export type HttpClient<T = any> = MailingTypes.HttpClient<T>;
  export type QueryParamsType = MailingTypes.QueryParamsType;
  export type RequestParams = MailingTypes.RequestParams;
  export type FullRequestParams = MailingTypes.FullRequestParams;
  export type ApiConfig<T = any> = MailingTypes.ApiConfig<T>;
}
