/**
 * health controller
 */

export default {
  async check(ctx) {
    try {
      // Basic health check - if Strapi is running and can respond, it's healthy
      ctx.body = {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
      };
      ctx.status = 200;
    } catch (error) {
      ctx.body = {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error.message,
      };
      ctx.status = 503;
    }
  },
};
