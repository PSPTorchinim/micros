import { factories } from "@strapi/strapi";

// Type assertion needed until Strapi generates types for this new content type
// Run `strapi ts:generate-types` after deployment to generate proper types
export default factories.createCoreService("api::change-password-block.change-password-block" as any);
