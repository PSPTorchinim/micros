// Unified permission tasks for Strapi bootstrap
import { StrapiLike } from '../types/strapi-like';
import { getRoleByType, ensureActionEnabled } from './permission-helpers';

const PUBLIC_ROLE_TYPE = 'public';

// All actions to enable for the public role

import fs from 'fs';
import path from 'path';

// Helper to get all api content-types with their kind
function getApiContentTypes(): Array<{ uid: string; isSingleType: boolean }> {
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
    const cts = fs.readdirSync(ctDir).flatMap((ct) => {
      const ctPath = path.join(ctDir, ct);
      if (!fs.statSync(ctPath).isDirectory()) return [];
      
      const schemaJsonPath = path.join(ctPath, 'schema.json');
      const schemaTsPath = path.join(ctPath, 'schema.ts');
      
      let isSingleType = false;
      
      if (fs.existsSync(schemaJsonPath)) {
        try {
          const schema = JSON.parse(fs.readFileSync(schemaJsonPath, 'utf-8'));
          isSingleType = schema.kind === 'singleType';
          console.log(`[PERM-LOG] Found content-type: api::${apiName}.${ct} (${schema.kind || 'collectionType'})`);
          return [{ uid: `api::${apiName}.${ct}`, isSingleType }];
        } catch (e) {
          console.error(`[PERM-LOG] Error reading schema.json for ${apiName}.${ct}:`, e);
          return [];
        }
      } else if (fs.existsSync(schemaTsPath)) {
        try {
          // For .ts schemas, try to extract the kind by parsing the file content
          const schemaContent = fs.readFileSync(schemaTsPath, 'utf-8');
          // Look for kind: "singleType" or kind: 'singleType' in the file
          const kindMatch = schemaContent.match(/kind:\s*["'](\w+)["']/);
          if (kindMatch && kindMatch[1] === 'singleType') {
            isSingleType = true;
            console.log(`[PERM-LOG] Found content-type: api::${apiName}.${ct} (singleType from schema.ts)`);
          } else {
            console.log(`[PERM-LOG] Found content-type: api::${apiName}.${ct} (collectionType from schema.ts)`);
          }
          return [{ uid: `api::${apiName}.${ct}`, isSingleType }];
        } catch (e) {
          console.error(`[PERM-LOG] Error reading schema.ts for ${apiName}.${ct}:`, e);
          return [];
        }
      } else {
        console.log(
          `[PERM-LOG] Skipping ${ctPath}, no schema.json or schema.ts`,
        );
        return [];
      }
    });
    return cts;
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
  const apiFindActions = apiTypes.flatMap(({ uid, isSingleType }) => {
    // singleTypes only have .find action, not .findOne
    if (isSingleType) {
      console.log(`[PERM-LOG] Adding .find for singleType: ${uid}`);
      return [`${uid}.find`];
    } else {
      console.log(`[PERM-LOG] Adding .find and .findOne for collectionType: ${uid}`);
      return [`${uid}.find`, `${uid}.findOne`];
    }
  });
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
    console.warn('[PERM] Public role not found. Skipping.');
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
  console.info('[PERM] All public permissions updated.');
}
