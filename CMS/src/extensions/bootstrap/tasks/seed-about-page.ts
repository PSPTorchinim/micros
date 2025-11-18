// Seed About page
import { toUrlSlug } from './utils/slugify';

const PAGE_UID = 'api::page.page';
const TEMPLATE_UID = 'api::template.template';
const CONTACT_SECTION_UID = 'api::contact-section.contact-section';

export async function seedAboutPage(strapi: any, configId: number) {
  console.info('[SEED][ABOUT] Seeding About page...');

  const aboutSlug = toUrlSlug('about');

  // Get existing Contact Section
  const contactSection = await strapi.db.query(CONTACT_SECTION_UID).findOne({
    where: { heading: 'About DJ Beat Blaster' },
  });

  if (!contactSection) {
    console.warn(
      '[SEED][ABOUT] Contact Section not found. Run seed-content-types first.',
    );
    return;
  }

  // Create About Template
  const existingAboutTemplate = await strapi.db.query(TEMPLATE_UID).findOne({
    where: { Name: 'About Page Template' },
  });

  const templateContent = [
    {
      __component: 'contact-section-ref.contact-section-ref',
      contact_section: contactSection.id,
    },
  ];

  let aboutTemplate;
  if (!existingAboutTemplate) {
    aboutTemplate = await strapi.entityService.create(TEMPLATE_UID, {
      data: {
        Name: 'About Page Template',
        TemplateType: 'Standard',
        Content: templateContent,
        publishedAt: new Date().toISOString(),
      },
    });
    console.info(
      `[SEED][ABOUT] Created About Template (ID: ${aboutTemplate.id})`,
    );
  } else {
    // Update existing template to ensure Content is populated
    aboutTemplate = await strapi.entityService.update(
      TEMPLATE_UID,
      existingAboutTemplate.id,
      {
        data: {
          Name: 'About Page Template',
          TemplateType: 'Standard',
          Content: templateContent,
        },
      },
    );
    console.info(
      `[SEED][ABOUT] Updated About Template (ID: ${aboutTemplate.id}) with Content`,
    );
  }

  // Create or update About Page
  const existingAboutPage = await strapi.db.query(PAGE_UID).findOne({
    where: { Slug: aboutSlug },
  });

  if (!existingAboutPage) {
    const aboutPage = await strapi.entityService.create(PAGE_UID, {
      data: {
        Title: 'About',
        Slug: aboutSlug,
        configuration: configId,
        template: aboutTemplate.id,
        publishedAt: new Date().toISOString(),
      },
    });
    console.info(
      `[SEED][ABOUT] Created About Page (ID: ${aboutPage.id}, Slug: /${aboutSlug})`,
    );
  } else {
    await strapi.entityService.update(PAGE_UID, existingAboutPage.id, {
      data: {
        Title: 'About',
        template: aboutTemplate.id,
        configuration: configId,
      },
    });
    console.info(
      `[SEED][ABOUT] Updated existing About Page (ID: ${existingAboutPage.id})`,
    );
  }
}
