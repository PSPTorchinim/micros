// Seed About page - Two-Phase Approach
import { toUrlSlug } from './utils/slugify';

const PAGE_UID = 'api::page.page';
const TEMPLATE_UID = 'api::template.template';
const CONTACT_SECTION_UID = 'api::contact-section.contact-section';

export async function seedAboutPage(strapi: any, configId: number) {
  console.info('[SEED][ABOUT] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.info('[SEED][ABOUT] Seeding About page (Two-Phase)...');
  console.info('[SEED][ABOUT] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const aboutSlug = toUrlSlug('about');

  // ============================================================================
  // PHASE 1: Create entities without relations
  // ============================================================================
  console.info('[SEED][ABOUT] 📦 PHASE 1: Creating entities');

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
      `[SEED][ABOUT] ✓ Created About Template (ID: ${aboutTemplate.id})`,
    );
  } else {
    aboutTemplate = await strapi.entityService.update(
      TEMPLATE_UID,
      existingAboutTemplate.id,
      {
        data: {
          Name: 'About Page Template',
          TemplateType: 'Standard',
          Content: templateContent,
          publishedAt: new Date().toISOString(),
        },
      },
    );
    console.info(
      `[SEED][ABOUT] ✓ Updated About Template (ID: ${aboutTemplate.id})`,
    );
  }

  // Create or update About Page WITHOUT template relation
  const existingAboutPage = await strapi.db.query(PAGE_UID).findOne({
    where: { Slug: aboutSlug },
  });

  let aboutPageId;
  if (!existingAboutPage) {
    const aboutPage = await strapi.entityService.create(PAGE_UID, {
      data: {
        Title: 'About',
        Slug: aboutSlug,
        configuration: configId,
        publishedAt: new Date().toISOString(),
      },
    });
    aboutPageId = aboutPage.id;
    console.info(
      `[SEED][ABOUT] ✓ Created About Page (ID: ${aboutPage.id}, Slug: /${aboutSlug})`,
    );
  } else {
    aboutPageId = existingAboutPage.id;
    console.info(
      `[SEED][ABOUT] ✓ Found existing About Page (ID: ${existingAboutPage.id})`,
    );
  }

  // ============================================================================
  // PHASE 2: Establish relations
  // ============================================================================
  console.info('[SEED][ABOUT] 🔗 PHASE 2: Establishing relations');

  try {
    await strapi.db.query(PAGE_UID).update({
      where: { id: aboutPageId },
      data: {
        template: aboutTemplate.id,
      },
    });
    console.info(
      `[SEED][ABOUT] ✓ Connected Page ${aboutPageId} to Template ${aboutTemplate.id}`,
    );
  } catch (error: any) {
    console.error('[SEED][ABOUT] ❌ Failed to set relation:', error.message);
  }

  console.info('[SEED][ABOUT] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.info('[SEED][ABOUT] ✅ About page seeding complete!');
  console.info('[SEED][ABOUT] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}
