// Seed Contact Sections

const CONTACT_SECTION_UID = 'api::contact-section.contact-section';

export async function seedContactSections(
  strapi: any,
  contactInfoIds: number[],
) {
  console.info('[SEED][CONTACT_SECTIONS] Seeding Contact Sections...');

  // Only seed if there are no contact sections in the database
  const count = await strapi.db.query(CONTACT_SECTION_UID).count();
  if (count > 0) {
    console.info(
      '[SEED][CONTACT_SECTIONS] Skipping: contact sections already exist.',
    );
    return;
  }

  // Main Contact Section for About Page
  const contactSection = await strapi.entityService.create(
    CONTACT_SECTION_UID,
    {
      data: {
        introText: 'Get to Know Us',
        heading: 'About DJ Beat Blaster',
        description:
          'DJ Beat Blaster is the complete business management platform built specifically for professional DJs. We understand the unique challenges of running a DJ business - from managing client relationships to tracking equipment, scheduling gigs, and growing your brand. Our platform brings all these essential tools together in one intuitive interface, helping you spend less time on admin and more time doing what you love - creating unforgettable experiences through music.',
        contactInfo: contactInfoIds,
      },
    },
  );
  console.info(
    `[SEED][CONTACT_SECTIONS] Created Contact Section (ID: ${contactSection.id})`,
  );
}
