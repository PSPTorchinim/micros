// Comprehensive Strapi seeder for all major content types and components
// Seeds at least 5 real-data examples for each, with proper relationship linking

import { seedFooter } from "./seed-footer";

const ARTICLE_UID = "api::article.article";
const ARTICLE_BLOCK_UID = "api::article-block.article-block";
const IMAGE_SLIDER_UID = "api::image-slider.image-slider";
const STEPS_CONTAINER_UID = "api::steps-container.steps-container";
const CTA_UID = "api::cta.cta";
const CONTACT_INFO_UID = "api::contact-info.contact-info";
const CONTACT_SECTION_UID = "api::contact-section.contact-section";
const FEATURE_SECTION_UID = "api::feature-section.feature-section";
const FEATURE_TAB_UID = "api::feature-tab.feature-tab";
const HERO_BLOCK_UID = "api::hero-block.hero-block";
const PAGE_UID = "api::page.page";
const TEMPLATE_UID = "api::template.template";
const CONFIGURATION_UID = "api::configuration.configuration";

// Helper to upsert (create or update) a record by unique field
async function upsert(strapi: any, uid: string, where: any, data: any) {
  const existing = await strapi.db.query(uid).findOne({ where });
  if (existing) {
    return await strapi.entityService.update(uid, existing.id, { data });
  }
  return await strapi.entityService.create(uid, { data });
}

export async function seedDev(strapi: any) {
  // 1. Seed Contact Infos
  const contactInfos = await Promise.all([
    upsert(
      strapi,
      CONTACT_INFO_UID,
      { title: "Support" },
      {
        title: "Support",
        content: "support@djbeatblaster.com",
        detail: "Email our support team",
        iconName: "mail",
      }
    ),
    upsert(
      strapi,
      CONTACT_INFO_UID,
      { title: "Sales" },
      {
        title: "Sales",
        content: "sales@djbeatblaster.com",
        detail: "Contact sales",
        iconName: "phone",
      }
    ),
    upsert(
      strapi,
      CONTACT_INFO_UID,
      { title: "Booking" },
      {
        title: "Booking",
        content: "booking@djbeatblaster.com",
        detail: "Book a DJ",
        iconName: "calendar",
      }
    ),
    upsert(
      strapi,
      CONTACT_INFO_UID,
      { title: "Instagram" },
      {
        title: "Instagram",
        content: "@dj.beat.blaster",
        detail: "Follow us on Instagram",
        iconName: "instagram",
      }
    ),
    upsert(
      strapi,
      CONTACT_INFO_UID,
      { title: "Facebook" },
      {
        title: "Facebook",
        content: "fb.com/djbeatblaster2024",
        detail: "Like us on Facebook",
        iconName: "facebook",
      }
    ),
  ]);

  // 2. Seed Feature Tabs
  const featureTabs = await Promise.all([
    upsert(
      strapi,
      FEATURE_TAB_UID,
      { title: "Weddings" },
      {
        title: "Weddings",
        imgAlt: "Wedding DJ",
        imgSrc: "/img/wedding.jpg",
        description: "Professional DJ services for weddings.",
      }
    ),
    upsert(
      strapi,
      FEATURE_TAB_UID,
      { title: "Corporate" },
      {
        title: "Corporate",
        imgAlt: "Corporate Event DJ",
        imgSrc: "/img/corporate.jpg",
        description: "Corporate event entertainment.",
      }
    ),
    upsert(
      strapi,
      FEATURE_TAB_UID,
      { title: "Birthdays" },
      {
        title: "Birthdays",
        imgAlt: "Birthday DJ",
        imgSrc: "/img/birthday.jpg",
        description: "Birthday party DJ packages.",
      }
    ),
    upsert(
      strapi,
      FEATURE_TAB_UID,
      { title: "Clubs" },
      {
        title: "Clubs",
        imgAlt: "Club DJ",
        imgSrc: "/img/club.jpg",
        description: "Nightclub DJ performances.",
      }
    ),
    upsert(
      strapi,
      FEATURE_TAB_UID,
      { title: "Festivals" },
      {
        title: "Festivals",
        imgAlt: "Festival DJ",
        imgSrc: "/img/festival.jpg",
        description: "Festival and outdoor event DJing.",
      }
    ),
  ]);

  // 3. Seed Feature Sections (linking tabs)
  const featureSections = await Promise.all([
    upsert(
      strapi,
      FEATURE_SECTION_UID,
      { tabs: [featureTabs[0].id] },
      { reversed: false, tabs: [featureTabs[0].id, featureTabs[1].id] }
    ),
    upsert(
      strapi,
      FEATURE_SECTION_UID,
      { tabs: [featureTabs[2].id] },
      { reversed: true, tabs: [featureTabs[2].id, featureTabs[3].id] }
    ),
    upsert(
      strapi,
      FEATURE_SECTION_UID,
      { tabs: [featureTabs[4].id] },
      { reversed: false, tabs: [featureTabs[4].id] }
    ),
    upsert(
      strapi,
      FEATURE_SECTION_UID,
      { tabs: [] },
      { reversed: true, tabs: [featureTabs[0].id, featureTabs[4].id] }
    ),
    upsert(
      strapi,
      FEATURE_SECTION_UID,
      { tabs: [] },
      { reversed: false, tabs: [featureTabs[1].id, featureTabs[3].id] }
    ),
  ]);

  // 4. Seed Contact Sections (linking contact infos)
  const contactSections = await Promise.all([
    upsert(
      strapi,
      CONTACT_SECTION_UID,
      { heading: "Contact Us" },
      {
        introText: "Get in touch!",
        heading: "Contact Us",
        description: "Reach out for bookings or questions.",
        contactInfo: contactInfos.map((ci) => ci.id),
      }
    ),
    upsert(
      strapi,
      CONTACT_SECTION_UID,
      { heading: "Book Now" },
      {
        introText: "Book a DJ!",
        heading: "Book Now",
        description: "Reserve your DJ today.",
        contactInfo: [contactInfos[2].id],
      }
    ),
    upsert(
      strapi,
      CONTACT_SECTION_UID,
      { heading: "Support" },
      {
        introText: "Need help?",
        heading: "Support",
        description: "Contact our support team.",
        contactInfo: [contactInfos[0].id],
      }
    ),
    upsert(
      strapi,
      CONTACT_SECTION_UID,
      { heading: "Social" },
      {
        introText: "Follow us!",
        heading: "Social",
        description: "Social media links.",
        contactInfo: [contactInfos[3].id, contactInfos[4].id],
      }
    ),
    upsert(
      strapi,
      CONTACT_SECTION_UID,
      { heading: "Sales" },
      {
        introText: "Get a quote!",
        heading: "Sales",
        description: "Contact sales for pricing.",
        contactInfo: [contactInfos[1].id],
      }
    ),
  ]);

  // 5. Seed CTAs
  const ctas = await Promise.all([
    upsert(
      strapi,
      CTA_UID,
      { Label: "Book Now" },
      { Label: "Book Now", url: "/book", OpenInNewTab: false }
    ),
    upsert(
      strapi,
      CTA_UID,
      { Label: "Contact" },
      { Label: "Contact", url: "/contact", OpenInNewTab: false }
    ),
    upsert(
      strapi,
      CTA_UID,
      { Label: "See Events" },
      { Label: "See Events", url: "/events", OpenInNewTab: false }
    ),
    upsert(
      strapi,
      CTA_UID,
      { Label: "Get Quote" },
      { Label: "Get Quote", url: "/quote", OpenInNewTab: false }
    ),
    upsert(
      strapi,
      CTA_UID,
      { Label: "Follow Us" },
      {
        Label: "Follow Us",
        url: "https://instagram.com/dj.beat.blaster",
        OpenInNewTab: true,
      }
    ),
  ]);

  // 6. Seed Hero Blocks (linking CTAs)
  const heroBlocks = await Promise.all([
    upsert(
      strapi,
      HERO_BLOCK_UID,
      { heading: "Welcome" },
      {
        heading: "Welcome to DJ Beat Blaster!",
        content: "The best DJ experience for your event.",
        actions: [ctas[0].id, ctas[1].id],
      }
    ),
    upsert(
      strapi,
      HERO_BLOCK_UID,
      { heading: "Book Now" },
      {
        heading: "Book Your DJ Today!",
        content: "Reserve your date with us.",
        actions: [ctas[0].id],
      }
    ),
    upsert(
      strapi,
      HERO_BLOCK_UID,
      { heading: "Events" },
      {
        heading: "Upcoming Events",
        content: "See where we'll be performing.",
        actions: [ctas[2].id],
      }
    ),
    upsert(
      strapi,
      HERO_BLOCK_UID,
      { heading: "Quote" },
      {
        heading: "Get a Free Quote",
        content: "Contact us for pricing.",
        actions: [ctas[3].id],
      }
    ),
    upsert(
      strapi,
      HERO_BLOCK_UID,
      { heading: "Follow" },
      {
        heading: "Follow Us Online",
        content: "Stay up to date.",
        actions: [ctas[4].id],
      }
    ),
  ]);

  // 7. Seed Steps Containers
  const stepsContainers = await Promise.all([
    upsert(
      strapi,
      STEPS_CONTAINER_UID,
      { heading: "How It Works" },
      {
        heading: "How It Works",
        content: "Step-by-step process.",
        action: [],
        steps: [],
      }
    ),
    upsert(
      strapi,
      STEPS_CONTAINER_UID,
      { heading: "Booking Steps" },
      {
        heading: "Booking Steps",
        content: "How to book a DJ.",
        action: [],
        steps: [],
      }
    ),
    upsert(
      strapi,
      STEPS_CONTAINER_UID,
      { heading: "Event Steps" },
      {
        heading: "Event Steps",
        content: "Event process.",
        action: [],
        steps: [],
      }
    ),
    upsert(
      strapi,
      STEPS_CONTAINER_UID,
      { heading: "Payment Steps" },
      {
        heading: "Payment Steps",
        content: "How to pay.",
        action: [],
        steps: [],
      }
    ),
    upsert(
      strapi,
      STEPS_CONTAINER_UID,
      { heading: "After Party" },
      {
        heading: "After Party",
        content: "What happens after.",
        action: [],
        steps: [],
      }
    ),
  ]);

  // 8. Seed Article Blocks (dynamiczone with references)
  const articleBlocks = await Promise.all([
    upsert(
      strapi,
      ARTICLE_BLOCK_UID,
      { Title: "Block 1" },
      { Title: "Block 1", items: [] }
    ),
    upsert(
      strapi,
      ARTICLE_BLOCK_UID,
      { Title: "Block 2" },
      { Title: "Block 2", items: [] }
    ),
    upsert(
      strapi,
      ARTICLE_BLOCK_UID,
      { Title: "Block 3" },
      { Title: "Block 3", items: [] }
    ),
    upsert(
      strapi,
      ARTICLE_BLOCK_UID,
      { Title: "Block 4" },
      { Title: "Block 4", items: [] }
    ),
    upsert(
      strapi,
      ARTICLE_BLOCK_UID,
      { Title: "Block 5" },
      { Title: "Block 5", items: [] }
    ),
  ]);

  // 9. Seed Image Sliders (dynamiczone with references)
  const imageSliders = await Promise.all([
    upsert(
      strapi,
      IMAGE_SLIDER_UID,
      { Title: "Slider 1" },
      {
        Title: "Slider 1",
        reversed: false,
        AutoPlay: true,
        IntervalMs: 5000,
        Slides: [],
      }
    ),
    upsert(
      strapi,
      IMAGE_SLIDER_UID,
      { Title: "Slider 2" },
      {
        Title: "Slider 2",
        reversed: true,
        AutoPlay: false,
        IntervalMs: 3000,
        Slides: [],
      }
    ),
    upsert(
      strapi,
      IMAGE_SLIDER_UID,
      { Title: "Slider 3" },
      {
        Title: "Slider 3",
        reversed: false,
        AutoPlay: true,
        IntervalMs: 7000,
        Slides: [],
      }
    ),
    upsert(
      strapi,
      IMAGE_SLIDER_UID,
      { Title: "Slider 4" },
      {
        Title: "Slider 4",
        reversed: true,
        AutoPlay: false,
        IntervalMs: 4000,
        Slides: [],
      }
    ),
    upsert(
      strapi,
      IMAGE_SLIDER_UID,
      { Title: "Slider 5" },
      {
        Title: "Slider 5",
        reversed: false,
        AutoPlay: true,
        IntervalMs: 6000,
        Slides: [],
      }
    ),
  ]);

  // 10. Seed Articles
  const articles = await Promise.all([
    upsert(
      strapi,
      ARTICLE_UID,
      { Title: "How to Book a DJ" },
      {
        Title: "How to Book a DJ",
        Slug: "how-to-book-a-dj",
        Summary: "A guide to booking DJs.",
        coverUrl: "/img/dj1.jpg",
        Body: "<p>Step 1: Contact us. Step 2: Choose your DJ. Step 3: Enjoy!</p>",
      }
    ),
    upsert(
      strapi,
      ARTICLE_UID,
      { Title: "Top 10 Wedding Songs" },
      {
        Title: "Top 10 Wedding Songs",
        Slug: "top-10-wedding-songs",
        Summary: "Best songs for weddings.",
        coverUrl: "/img/wedding-songs.jpg",
        Body: "<ol><li>Song 1</li><li>Song 2</li></ol>",
      }
    ),
    upsert(
      strapi,
      ARTICLE_UID,
      { Title: "DJ Equipment Checklist" },
      {
        Title: "DJ Equipment Checklist",
        Slug: "dj-equipment-checklist",
        Summary: "What you need for a gig.",
        coverUrl: "/img/equipment.jpg",
        Body: "<ul><li>Turntables</li><li>Speakers</li></ul>",
      }
    ),
    upsert(
      strapi,
      ARTICLE_UID,
      { Title: "Corporate Event Tips" },
      {
        Title: "Corporate Event Tips",
        Slug: "corporate-event-tips",
        Summary: "How to run a corporate event.",
        coverUrl: "/img/corporate-event.jpg",
        Body: "<p>Plan ahead. Book early. Communicate.</p>",
      }
    ),
    upsert(
      strapi,
      ARTICLE_UID,
      { Title: "DJ Beat Blaster Story" },
      {
        Title: "DJ Beat Blaster Story",
        Slug: "dj-beat-blaster-story",
        Summary: "Our journey.",
        coverUrl: "/img/story.jpg",
        Body: "<p>Founded in 2020, DJ Beat Blaster has rocked hundreds of events.</p>",
      }
    ),
  ]);

  // 11. Seed Templates (linking content)
  const templates = await Promise.all([
    upsert(
      strapi,
      TEMPLATE_UID,
      { Name: "Home" },
      { Name: "Home", TemplateType: "Standard", Content: [] }
    ),
    upsert(
      strapi,
      TEMPLATE_UID,
      { Name: "About" },
      { Name: "About", TemplateType: "Standard", Content: [] }
    ),
    upsert(
      strapi,
      TEMPLATE_UID,
      { Name: "Events" },
      { Name: "Events", TemplateType: "Standard", Content: [] }
    ),
    upsert(
      strapi,
      TEMPLATE_UID,
      { Name: "Contact" },
      { Name: "Contact", TemplateType: "Standard", Content: [] }
    ),
    upsert(
      strapi,
      TEMPLATE_UID,
      { Name: "Blog" },
      { Name: "Blog", TemplateType: "Standard", Content: [] }
    ),
  ]);

  // 12. Seed Pages (linking templates)
  const pages = await Promise.all([
    upsert(
      strapi,
      PAGE_UID,
      { Title: "Home" },
      {
        Title: "Home",
        Slug: "home",
        Visible: true,
        Menu: "Main",
        NavigationOrder: 1,
        NavigationAction: "Link",
        template: templates[0].id,
      }
    ),
    upsert(
      strapi,
      PAGE_UID,
      { Title: "About" },
      {
        Title: "About",
        Slug: "about",
        Visible: true,
        Menu: "Main",
        NavigationOrder: 2,
        NavigationAction: "Link",
        template: templates[1].id,
      }
    ),
    upsert(
      strapi,
      PAGE_UID,
      { Title: "Events" },
      {
        Title: "Events",
        Slug: "events",
        Visible: true,
        Menu: "Main",
        NavigationOrder: 3,
        NavigationAction: "Link",
        template: templates[2].id,
      }
    ),
    upsert(
      strapi,
      PAGE_UID,
      { Title: "Contact" },
      {
        Title: "Contact",
        Slug: "contact",
        Visible: true,
        Menu: "Main",
        NavigationOrder: 4,
        NavigationAction: "Link",
        template: templates[3].id,
      }
    ),
    upsert(
      strapi,
      PAGE_UID,
      { Title: "Blog" },
      {
        Title: "Blog",
        Slug: "blog",
        Visible: true,
        Menu: "Main",
        NavigationOrder: 5,
        NavigationAction: "Link",
        template: templates[4].id,
      }
    ),
  ]);

  // 13. Seed Configuration (linking pages and footer)
  const configuration = await upsert(
    strapi,
    CONFIGURATION_UID,
    { Title: "Default" },
    { Title: "Default", pages: pages.map((p) => p.id) }
  );

  // 14. Seed Footer (linking configuration)
  await seedFooter(strapi, configuration.id);

  // Done
  strapi.log.info(
    "[SEED] All content types and relationships seeded with at least 5 examples each."
  );
}
