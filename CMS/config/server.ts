export default ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
  // Enable CORS for documentation
  cors: {
    enabled: true,
    origin: ["*"],
    headers: "*",
  },
  // Enable documentation serving
  serveAdminPanel: env.bool("SERVE_ADMIN_PANEL", true),
});
