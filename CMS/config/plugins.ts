export default {
  documentation: {
    enabled: true,
    config: {
      // Plugin configuration properties
      "x-strapi-config": {
        path: "/swagger",
      },
      // OpenAPI specification
      openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "DJ Beat Blaster CMS API",
        description:
          "API documentation for DJ Beat Blaster CMS with JSON schemas",
        contact: {
          name: "DJ Beat Blaster Team",
          email: "support@djbeatblaster.com",
        },
      },
      servers: [
        {
          url: "http://localhost:1337/api",
          description: "Development server",
        },
        {
          url: "https://cms.djbeatblaster.com/api",
          description: "Production server",
        },
      ],
    },
  },
  // Enable GraphQL plugin for additional API options
  graphql: {
    enabled: true,
    config: {
      endpoint: "/graphql",
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 7,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
      },
    },
  },
};
