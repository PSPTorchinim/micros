/**
 * health router
 */

export default {
  routes: [
    {
      method: "GET",
      path: "/health",
      handler: "health.check",
      config: {
        auth: false, // No authentication required for health checks
        policies: [],
        middlewares: [],
      },
    },
  ],
};
