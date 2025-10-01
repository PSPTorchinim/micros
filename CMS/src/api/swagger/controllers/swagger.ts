import fs from "fs";
import path from "path";

export default {
  async getSpec(ctx) {
    try {
      const specPath = path.join(
        __dirname,
        "../../../extensions/documentation/documentation/1.0.0/full_documentation.json"
      );

      if (fs.existsSync(specPath)) {
        const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));

        // Get the current host from the request
        const protocol = ctx.protocol;
        const host = ctx.get("host");
        const currentServerUrl = `${protocol}://${host}/api`;

        // Update server URLs to include current server
        spec.servers = [
          {
            url: currentServerUrl,
            description: "Current server",
          },
          {
            url: "http://localhost:1337/api",
            description: "Development server",
          },
          {
            url: "https://cms.djbeatblaster.com/api",
            description: "Production server",
          },
        ];

        ctx.body = spec;
        ctx.type = "application/json";
      } else {
        ctx.status = 404;
        ctx.body = { error: "Swagger specification not found" };
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: "Failed to load swagger specification" };
    }
  },
};
