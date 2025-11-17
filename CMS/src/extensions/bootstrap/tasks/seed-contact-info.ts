// Seed Contact Info entries

const CONTACT_INFO_UID = 'api::contact-info.contact-info';

export async function seedContactInfo(strapi: any): Promise<number[]> {
  strapi.log.info('[SEED][CONTACT_INFO] Seeding Contact Info...');

  // Only seed if there are no contact info entries in the database
  const count = await strapi.db.query(CONTACT_INFO_UID).count();
  if (count > 0) {
    strapi.log.info(
      '[SEED][CONTACT_INFO] Skipping: contact info already exists.',
    );
    // Return existing IDs for downstream logic
    const all = await strapi.db
      .query(CONTACT_INFO_UID)
      .findMany({ select: ['id'] });
    return all.map((c: any) => c.id);
  }

  const contactInfoData = [
    {
      title: 'Email',
      content: 'info@djbeatblaster.com',
      detail: "We'll respond within 24 hours",
      iconName: 'mail',
    },
    {
      title: 'Phone',
      content: '+1 (555) 123-4567',
      detail: 'Monday - Friday, 9AM - 6PM EST',
      iconName: 'phone',
    },
    {
      title: 'Location',
      content: '123 Music Street, New York, NY 10001',
      detail: 'Visit us by appointment',
      iconName: 'location',
    },
  ];

  const contactInfoIds = [];
  for (const info of contactInfoData) {
    const existing = await strapi.db.query(CONTACT_INFO_UID).findOne({
      where: { title: info.title },
    });

    if (!existing) {
      const contactInfo = await strapi.entityService.create(CONTACT_INFO_UID, {
        data: {
          ...info,
          publishedAt: new Date().toISOString(),
        },
      });
      contactInfoIds.push(contactInfo.id);
      strapi.log.info(
        `[SEED][CONTACT_INFO] Created Contact Info: ${info.title} (ID: ${contactInfo.id})`,
      );
    } else {
      contactInfoIds.push(existing.id);
      strapi.log.debug(
        `[SEED][CONTACT_INFO] Contact Info "${info.title}" already exists (ID: ${existing.id})`,
      );
    }
  }

  return contactInfoIds;
}
