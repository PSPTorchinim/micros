export default {
  kind: "singleType",
  collectionName: "footers",
  info: {
    singularName: "footer",
    pluralName: "footers",
    displayName: "Footer",
    description: "Site footer content and links",
  },
  options: {
    draftAndPublish: true,
  },
  attributes: {
    copyright: {
      type: "string",
      required: false,
    },
    columns: {
      type: "component",
      repeatable: true,
      component: "footer.link-column",
    },
    socialLinks: {
      type: "component",
      repeatable: true,
      component: "footer.social-link",
    },
    configuration: {
      type: "relation",
      relation: "oneToOne",
      target: "api::configuration.configuration",
      inversedBy: "footer",
    },
  },
} as const;
