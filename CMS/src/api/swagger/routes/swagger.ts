export default {
  routes: [
    {
      method: "GET",
      path: "/swagger-spec.json",
      handler: "swagger.getSpec",
      config: {
        auth: false,
      },
    },
  ],
};
