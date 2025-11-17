// Unified permission tasks for Strapi bootstrap
import { StrapiLike } from '../types/strapi-like';
import { getRoleByType, ensureActionEnabled } from './permission-helpers';

const PUBLIC_ROLE_TYPE = 'public';

// All actions to enable for the public role

import fs from 'fs';
import path from 'path';

// Helper to get all api content-types
function getApiContentTypes() {
  // Always resolve from project root, not __dirname (which may be dist)
  // Try src/api first, fallback to api (for monorepo or custom setups)
  const rootDir = process.cwd();
  let apiDir = path.join(rootDir, 'src', 'api');
  if (!fs.existsSync(apiDir)) {
    apiDir = path.join(rootDir, 'api');
  }
  if (!fs.existsSync(apiDir)) {
    console.log(`[PERM-LOG] API directory not found: ${apiDir}`);
    return [];
  }
  const apis = fs
    .readdirSync(apiDir)
    .filter((d) => fs.statSync(path.join(apiDir, d)).isDirectory());
  console.log(`[PERM-LOG] Found API directories:`, apis);
  const allTypes = apis.flatMap((apiName) => {
    const ctDir = path.join(apiDir, apiName, 'content-types');
    if (!fs.existsSync(ctDir)) {
      console.log(`[PERM-LOG] No content-types dir for API: ${apiName}`);
      return [];
    }
    const cts = fs.readdirSync(ctDir).filter((ct) => {
      const ctPath = path.join(ctDir, ct);
      if (!fs.statSync(ctPath).isDirectory()) return false;
      const hasSchemaJson = fs.existsSync(path.join(ctPath, 'schema.json'));
      const hasSchemaTs = fs.existsSync(path.join(ctPath, 'schema.ts'));
      if (hasSchemaJson || hasSchemaTs) {
        console.log(`[PERM-LOG] Found content-type: api::${apiName}.${ct}`);
        return true;
      } else {
        console.log(
          `[PERM-LOG] Skipping ${ctPath}, no schema.json or schema.ts`,
        );
        return false;
      }
    });
    return cts.map((ct) => `api::${apiName}.${ct}`);
  });
  console.log(`[PERM-LOG] All detected API content-types:`, allTypes);
  return allTypes;
}

const PLUGIN_ACTIONS = [
  'plugin::upload.content-api.find',
  'plugin::upload.content-api.findOne',
  'plugin::i18n.locales.listLocales',
  'plugin::content-type-builder.components.getComponent',
  'plugin::content-type-builder.components.getComponents',
  'plugin::content-type-builder.content-types.getContentType',
  'plugin::content-type-builder.content-types.getContentTypes',
  'api::swagger.swagger.getSpec',
  'api::health.health.check',
];

function getAllPublicActions() {
  const apiTypes = getApiContentTypes();
  console.log(`[PERM-LOG] getAllPublicActions: API types:`, apiTypes);
  const apiFindActions = apiTypes.flatMap((uid) => [
    `${uid}.find`,
    `${uid}.findOne`,
  ]);
  console.log(
    `[PERM-LOG] getAllPublicActions: API find actions:`,
    apiFindActions,
  );
  const allActions = [...apiFindActions, ...PLUGIN_ACTIONS];
  console.log(`[PERM-LOG] getAllPublicActions: All actions:`, allActions);
  return allActions;
}

export default async function setAllPublicPermissions({
  strapi,
}: {
  strapi: StrapiLike;
}) {
  const publicRole = await getRoleByType(strapi, PUBLIC_ROLE_TYPE);

  if (!publicRole) {
    strapi.log.warn('[PERM] Public role not found. Skipping.');
    return;
  }

  const actions = getAllPublicActions();
  for (const action of actions) {
    // Use the action prefix for log clarity
    let logPrefix = 'PERM';
    if (action.startsWith('plugin::upload')) logPrefix = 'UPLOAD-PERM';
    else if (action.startsWith('plugin::i18n')) logPrefix = 'I18N-PERM';
    else if (action.startsWith('plugin::content-type-builder'))
      logPrefix = 'CTB-PERM';
    await ensureActionEnabled(strapi, publicRole.id, action, logPrefix);
  }
  strapi.log.info('[PERM] All public permissions updated.');
}
