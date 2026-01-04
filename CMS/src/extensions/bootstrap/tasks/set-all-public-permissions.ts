// Unified permission tasks for Strapi bootstrap
import { StrapiLike } from '../types/strapi-like';
import { getRoleByType, ensureActionEnabled } from './permission-helpers';

const PUBLIC_ROLE_TYPE = 'public';

// All actions to enable for the public role

import fs from 'fs';
import path from 'path';

// Helper to check if a content-type is a singleType
function isSingleType(apiName: string, ctName: string): boolean {
  const rootDir = process.cwd();
  let apiDir = path.join(rootDir, 'src', 'api');
  if (!fs.existsSync(apiDir)) {
    apiDir = path.join(rootDir, 'api');
  }
  
  const schemaJsonPath = path.join(apiDir, apiName, 'content-types', ctName, 'schema.json');
  const schemaTsPath = path.join(apiDir, apiName, 'content-types', ctName, 'schema.ts');
  
  // Try JSON first
  if (fs.existsSync(schemaJsonPath)) {
    try {
      const schema = JSON.parse(fs.readFileSync(schemaJsonPath, 'utf-8'));
      return schema.kind === 'singleType';
    } catch (e) {
      console.warn(`[PERM-LOG] Failed to parse schema.json for ${apiName}/${ctName}:`, e);
    }
  }
  
  // Fallback to checking TS (though we can't easily parse it, so we'll just check if 'singleType' appears in the file)
  if (fs.existsSync(schemaTsPath)) {
    try {
      const content = fs.readFileSync(schemaTsPath, 'utf-8');
      return content.includes('"singleType"') || content.includes("'singleType'");
    } catch (e) {
      console.warn(`[PERM-LOG] Failed to read schema.ts for ${apiName}/${ctName}:`, e);
    }
  }
  
  // Default to collectionType if we can't determine
  return false;
}

// Helper to get all api content-types with their type info
function getApiContentTypes(): Array<{ uid: string; isSingle: boolean }> {
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
    return cts.map((ct) => {
      const uid = `api::${apiName}.${ct}`;
      const isSingle = isSingleType(apiName, ct);
      console.log(`[PERM-LOG] Content-type ${uid} is ${isSingle ? 'singleType' : 'collectionType'}`);
      return { uid, isSingle };
    });
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
  const apiFindActions = apiTypes.flatMap(({ uid, isSingle }) => {
    // For singleTypes, only 'find' action exists (no 'findOne')
    // For collectionTypes, both 'find' and 'findOne' exist
    if (isSingle) {
      console.log(`[PERM-LOG] Adding only 'find' action for singleType: ${uid}`);
      return [`${uid}.find`];
    } else {
      console.log(`[PERM-LOG] Adding 'find' and 'findOne' actions for collectionType: ${uid}`);
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
