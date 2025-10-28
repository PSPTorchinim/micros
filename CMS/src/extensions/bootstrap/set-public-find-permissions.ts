/**
 * Strapi bootstrap script to automatically allow 'find' and 'findOne'
 * for all user-defined content-types (api::*) for the public role.
 */

type StrapiLike = {
  log: any;
  contentTypes: Record<string, any>;
  query: (uid: string) => any;
};

export default async ({ strapi }: { strapi: StrapiLike }) => {
  // 1) Get Public role
  const publicRole = await strapi
    .query("plugin::users-permissions.role")
    .findOne({
      where: { type: "public" },
      populate: ["permissions"],
    });

  if (!publicRole) {
    strapi.log.warn(
      "[PERM] Public role not found. Skipping permission update."
    );
    return;
  }

  // 2) Consider only user content types (`api::...`)
  const allUids = Object.keys(strapi.contentTypes || {});
  const targetUids = allUids.filter((uid) => uid.startsWith("api::"));

  if (targetUids.length === 0) {
    strapi.log.info("[PERM] No api::* content-types found. Nothing to do.");
    return;
  }

  strapi.log.info(
    `[PERM] Updating Public permissions for: ${targetUids.join(", ")}`
  );

  // 3) Ensure find & findOne enabled on each content type
  const actions = ["find", "findOne"] as const;

  for (const uid of targetUids) {
    // In v4, the permission action is `${uid}.${action}`, e.g. `api::page.page.find`
    for (const action of actions) {
      const actionName = `${uid}.${action}`;

      // Look for an existing permission row for this role+action
      const existing = await strapi
        .query("plugin::users-permissions.permission")
        .findOne({
          where: { role: publicRole.id, action: actionName },
        });

      if (!existing) {
        await strapi.query("plugin::users-permissions.permission").create({
          data: {
            action: actionName,
            role: publicRole.id,
            enabled: true,
            policy: "",
            // NOTE: subject can be omitted for content-type actions; Strapi derives from action
          },
        });
        strapi.log.info(`[PERM] Created & enabled ${actionName} for Public`);
      } else if (!existing.enabled) {
        await strapi.query("plugin::users-permissions.permission").update({
          where: { id: existing.id },
          data: { enabled: true },
        });
        strapi.log.info(`[PERM] Enabled ${actionName} for Public`);
      } else {
        strapi.log.debug(`[PERM] Already enabled: ${actionName}`);
      }
    }
  }

  strapi.log.info(
    "[PERM] Public 'find' & 'findOne' permissions update completed."
  );
};
