/* eslint-disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## API MODELS INDEX FILE                                     ##
 * ##                                                           ##
 * ## Central export point for all API models and clients      ##
 * ---------------------------------------------------------------
 */

// Export the main API client (similar to your existing aocmsAxiosClient)
export { microservicesClient, createApi, UnifiedApi } from './api';

// Export individual service creators
export {
  createBrandApi,
  createDocumentsApi,
  createGearApi,
  createIdentityApi,
  createMailingApi,
  createMusicApi,
  createPartyApi,
} from './api';

// Export all types and interfaces
export * from './api';

// Re-export individual service modules for direct access if needed
export * as Brand from './brand/apiMap';
export * as Documents from './documents/apiMap';
export * as Gear from './gear/apiMap';
export * as Identity from './identity/apiMap';
export * as Mailing from './mailing/apiMap';
export * as Music from './music/apiMap';
export * as Party from './party/apiMap';
