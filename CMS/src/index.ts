export default {
  register() {
    console.log("Strapi register phase started");
  },

  async bootstrap({ strapi }) {
    try {
      const setPublicFindPermissions = await import(
        "./extensions/bootstrap/set-public-find-permissions"
      );
      if (setPublicFindPermissions?.default) {
        await setPublicFindPermissions.default({ strapi });
      } else {
        strapi.log.warn("set-public-find-permissions not found/exported.");
      }
    } catch (e: any) {
      strapi.log.warn(
        "Failed to set public find/findOne permissions: " + (e?.message ?? e)
      );
    }
    console.log("Strapi bootstrap phase completed - application ready");
  },
};
