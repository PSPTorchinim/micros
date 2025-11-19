// Dev seeder for Footer single type

const FOOTER_UID = 'api::footer.footer';

export async function seedFooter(strapi: any, configurationId: number) {
  // Only seed if there is no footer in the database
  const count = await strapi.db.query(FOOTER_UID).count();
  if (count > 0) {
    console.info('[SEED][FOOTER] Skipping: footer already exists.');
    return;
  }
  // Example footer data
  const footerData = {
    copyright: '2025 DJ Beat Blaster. All Rights Reserved.',
    columns: [
      {
        title: 'Company',
        links: [
          { label: 'Home', url: '/home', newTab: false },
          { label: 'Services', url: 'https://example.com', newTab: false },
          { label: 'About Us', url: 'https://example.com', newTab: false },
          { label: 'Contact Us', url: 'https://example.com', newTab: false },
          {
            label: 'Terms of Service',
            url: 'https://example.com',
            newTab: false,
          },
        ],
      },
      {
        title: 'Quick Links',
        links: [
          {
            label: 'Privacy Policy',
            url: 'https://example.com',
            newTab: false,
          },
          { label: 'Cookie Policy', url: 'https://example.com', newTab: false },
          {
            label: 'Manage DJ Contracts',
            url: 'https://example.com',
            newTab: false,
          },
          {
            label: 'Manage Invoices',
            url: 'https://example.com',
            newTab: false,
          },
          {
            label: 'Manage Songs Requests',
            url: 'https://example.com',
            newTab: false,
          },
        ],
      },
    ],
    socialLinks: [
      {
        platform: 'Email',
        url: 'mailto:contact@djbeatblaster.com',
        icon: 'mail',
        detail: 'contact@djbeatblaster.com',
      },
      {
        platform: 'Facebook',
        url: 'https://facebook.com/djbeatblaster2024',
        icon: 'facebook',
        detail: 'facebook.com/djbeatblaster2024',
      },
      {
        platform: 'Instagram',
        url: 'https://instagram.com/dj.beat.blaster',
        icon: 'instagram',
        detail: 'instagram.com/dj.beat.blaster',
      },
      {
        platform: 'TikTok',
        url: 'https://instagram.com/dj.beat.blaster',
        icon: 'tiktok',
        detail: 'instagram.com/dj.beat.blaster',
      },
    ],
    publishedAt: new Date().toISOString(),
  };

  // PHASE 1: Create/update footer WITHOUT configuration relation
  const footerDataWithoutConfig = {
    copyright: footerData.copyright,
    columns: footerData.columns,
    socialLinks: footerData.socialLinks,
    publishedAt: footerData.publishedAt,
  };

  // Upsert Footer single type
  const existing = await strapi.db.query(FOOTER_UID).findOne({});
  let footerId;

  if (existing && existing.id) {
    await strapi.entityService.update(FOOTER_UID, existing.id, {
      data: footerDataWithoutConfig,
    });
    footerId = existing.id;
    console.info(`[SEED][FOOTER] Updated footer (ID: ${footerId})`);
  } else {
    const footer = await strapi.entityService.create(FOOTER_UID, {
      data: footerDataWithoutConfig,
    });
    footerId = footer.id;
    console.info(`[SEED][FOOTER] Created footer (ID: ${footerId})`);
  }

  // PHASE 2: Set configuration relation
  try {
    await strapi.db.query(FOOTER_UID).update({
      where: { id: footerId },
      data: {
        configuration: configurationId,
      },
    });
    console.info(
      `[SEED][FOOTER] ✓ Connected footer to configuration ${configurationId}`,
    );
  } catch (error: any) {
    console.error(
      '[SEED][FOOTER] ❌ Failed to set configuration relation:',
      error.message,
    );
  }
}
