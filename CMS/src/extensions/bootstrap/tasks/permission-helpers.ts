// Shared permission helpers for Strapi bootstrap tasks
import { StrapiLike } from "../types/strapi-like";

const ROLE_UID = "plugin::users-permissions.role";
const PERMISSION_UID = "plugin::users-permissions.permission";

export async function getRoleByType(strapi: StrapiLike, type: string) {
  return strapi.query(ROLE_UID).findOne({
    where: { type },
    populate: ["permissions"],
  });
}

export async function findPermission(
  strapi: StrapiLike,
  roleId: number,
  action: string
) {
  return strapi.query(PERMISSION_UID).findOne({
    where: { role: roleId, action },
  });
}

export async function createPermission(
  strapi: StrapiLike,
  roleId: number,
  action: string
) {
  return strapi.query(PERMISSION_UID).create({
    data: { action, role: roleId, enabled: true, policy: "" },
  });
}

export async function enablePermission(
  strapi: StrapiLike,
  permissionId: number
) {
  return strapi.query(PERMISSION_UID).update({
    where: { id: permissionId },
    data: { enabled: true },
  });
}

export async function ensureActionEnabled(
  strapi: StrapiLike,
  roleId: number,
  action: string,
  logPrefix: string = "PERM"
) {
  const existing = await findPermission(strapi, roleId, action);

  if (!existing) {
    await createPermission(strapi, roleId, action);
    strapi.log.info(`[${logPrefix}] Created & enabled ${action} for Public`);
    return;
  }

  if (!existing.enabled) {
    await enablePermission(strapi, existing.id);
    strapi.log.info(`[${logPrefix}] Enabled ${action} for Public`);
    return;
  }

  strapi.log.debug(`[${logPrefix}] Already enabled: ${action}`);
}
