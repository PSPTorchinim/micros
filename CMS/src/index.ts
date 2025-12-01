export default {
  register() {
    console.log("Strapi register phase started");
  },

  async bootstrap({ strapi }) {
    try {
      const mod = await import("./extensions/bootstrap/run-bootstrap");
      if (mod?.default) {
        await mod.default({ strapi });
      } else {
        console.warn("[BOOT] run-bootstrap not exported as default.");
      }
    } catch (e: any) {
      console.warn(
        "[BOOT] Failed to run bootstrap tasks: " + (e?.message ?? e)
      );
    }

    console.log("Strapi bootstrap phase completed - application ready");
  },
};
