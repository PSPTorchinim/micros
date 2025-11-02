// Dev seeder for Footer single type

const FOOTER_UID = "api::footer.footer";

export async function seedFooter(strapi: any, configurationId: number) {
  // Example footer data
  const footerData = {
    copyright: "2025 DJ Beat Blaster. All Rights Reserved.",
    columns: [
      {
        title: "Company",
        links: [
          { label: "Home", url: "/home", newTab: false },
          { label: "Services", url: "https://example.com", newTab: false },
          { label: "About Us", url: "https://example.com", newTab: false },
          { label: "Contact Us", url: "https://example.com", newTab: false },
          {
            label: "Terms of Service",
            url: "https://example.com",
            newTab: false,
          },
        ],
      },
      {
        title: "Quick Links",
        links: [
          {
            label: "Privacy Policy",
            url: "https://example.com",
            newTab: false,
          },
          { label: "Cookie Policy", url: "https://example.com", newTab: false },
          {
            label: "Manage DJ Contracts",
            url: "https://example.com",
            newTab: false,
          },
          {
            label: "Manage Invoices",
            url: "https://example.com",
            newTab: false,
          },
          {
            label: "Manage Songs Requests",
            url: "https://example.com",
            newTab: false,
          },
        ],
      },
    ],
    socialLinks: [
      {
        platform: "Email",
        url: "mailto:contact@djbeatblaster.com",
        icon: "mail",
        detail: "contact@djbeatblaster.com",
      },
      {
        platform: "Facebook",
        url: "https://facebook.com/djbeatblaster2024",
        icon: "facebook",
        detail: "facebook.com/djbeatblaster2024",
      },
      {
        platform: "Instagram",
        url: "https://instagram.com/dj.beat.blaster",
        icon: "instagram",
        detail: "instagram.com/dj.beat.blaster",
      },
      {
        platform: "TikTok",
        url: "https://instagram.com/dj.beat.blaster",
        icon: "tiktok",
        detail: "instagram.com/dj.beat.blaster",
      },
    ],
    configuration: configurationId,
    publishedAt: new Date().toISOString(),
  };

  // Upsert Footer single type
  const existing = await strapi.db.query(FOOTER_UID).findOne({});
  if (existing && existing.id) {
    return await strapi.entityService.update(FOOTER_UID, existing.id, {
      data: footerData,
    });
  }
  return await strapi.entityService.create(FOOTER_UID, { data: footerData });
}
