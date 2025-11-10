// Helper to get or create the default configuration

const CONFIG_UID = 'api::configuration.configuration';

export async function getOrCreateConfiguration(strapi: any): Promise<number> {
  let config = await strapi.db.query(CONFIG_UID).findOne({});

  if (!config) {
    config = await strapi.entityService.create(CONFIG_UID, {
      data: {
        Title: 'DJ Beat Blaster Configuration',
        publishedAt: new Date().toISOString(),
      },
    });
    strapi.log.info(
      `[SEED][CONFIG] Created default configuration (ID: ${config.id})`,
    );
  }

  return config.id;
}
