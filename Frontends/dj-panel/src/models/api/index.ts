/* eslint-disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## API MODELS INDEX FILE                                     ##
 * ##                                                           ##
 * ## Central export point for all API models and clients      ##
 * ---------------------------------------------------------------
 */

// Export ONLY the main API client classes and functions (no types to avoid warnings)
export { 
  microservicesClient, 
  createApi, 
  UnifiedApi
} from './api';

// Export individual service creators
export { createBrandApi } from './api';
export { createDocumentsApi } from './api';
export { createGearApi } from './api';
export { createIdentityApi } from './api';
export { createMailingApi } from './api';
export { createMusicApi } from './api';
export { createPartyApi } from './api';

// Export service-specific namespaces
export { Brand } from './brand';
export { Documents } from './documents';
export { Gear } from './gear';
export { Identity } from './identity';
export { Mailing } from './mailing';
export { Music } from './music';
export { Party } from './party';

// Export service-specific API classes with unique names
export { BrandApi } from './brand';
export { DocumentsApi } from './documents';
export { GearApi } from './gear';
export { IdentityApi } from './identity';
export { MailingApi } from './mailing';
export { MusicApi } from './music';
export { PartyApi } from './party';

// Types are available via direct imports if needed:
// import type { ApiConfig, ContentType, QueryParamsType } from './api';
// or via namespaced imports:
// import type { Brand } from './brand';
// const config: Brand.ApiConfig = {};
