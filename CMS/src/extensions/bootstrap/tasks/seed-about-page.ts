// Seed About page

const PAGE_UID = 'api::page.page';
const TEMPLATE_UID = 'api::template.template';
const CONTACT_SECTION_UID = 'api::contact-section.contact-section';

export async function seedAboutPage(strapi: any, configId: number) {
  strapi.log.info('[SEED][ABOUT] Seeding About page...');

  // Only seed if there are no about pages in the database
  const count = await strapi.db.query(PAGE_UID).count({ where: { Slug: 'about' } });
  if (count > 0) {
    strapi.log.info('[SEED][ABOUT] Skipping: about page already exists.');
    return;
  }

  // Get existing Contact Section
  const contactSection = await strapi.db.query(CONTACT_SECTION_UID).findOne({
    where: { heading: 'About DJ Beat Blaster' },
  });

  if (!contactSection) {
    strapi.log.warn(
      '[SEED][ABOUT] Contact Section not found. Run seed-content-types first.',
    );
    return;
  }

  // Create About Template
  const existingAboutTemplate = await strapi.db.query(TEMPLATE_UID).findOne({
    where: { Name: 'About Page Template' },
  });

  let aboutTemplate;
  if (!existingAboutTemplate) {
    aboutTemplate = await strapi.entityService.create(TEMPLATE_UID, {
      data: {
        Name: 'About Page Template',
        TemplateType: 'Standard',
        Content: [
          {
            __component: 'contact-section-ref.contact-section-ref',
            contact_section: contactSection.id,
          },
        ],
        publishedAt: new Date().toISOString(),
      },
    });
    strapi.log.info(
      `[SEED][ABOUT] Created About Template (ID: ${aboutTemplate.id})`,
    );
  } else {
    aboutTemplate = existingAboutTemplate;
    strapi.log.debug(
      `[SEED][ABOUT] About Template already exists (ID: ${aboutTemplate.id})`,
    );
  }

  // Create or update About Page
  const existingAboutPage = await strapi.db.query(PAGE_UID).findOne({
    where: { Slug: 'about' },
  });

  if (!existingAboutPage) {
    const aboutPage = await strapi.entityService.create(PAGE_UID, {
      data: {
        Title: 'About',
        Slug: 'about',
        Visible: true,
        configuration: configId,
        template: aboutTemplate.id,
        publishedAt: new Date().toISOString(),
      },
    });
    strapi.log.info(
      `[SEED][ABOUT] Created About Page (ID: ${aboutPage.id}, Slug: /about)`,
    );
  } else {
    await strapi.entityService.update(PAGE_UID, existingAboutPage.id, {
      data: {
        Title: 'About',
        template: aboutTemplate.id,
        configuration: configId,
      },
    });
    strapi.log.info(
      `[SEED][ABOUT] Updated existing About Page (ID: ${existingAboutPage.id})`,
    );
  }
}
