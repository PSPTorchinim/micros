// Comprehensive Strapi seeder for all major content types and components
// Seeds at least 5 real-data examples for each, with proper relationship linking

import { seedFooter } from "./seed-footer";

const ARTICLE_UID = "api::article.article";
const ARTICLE_BLOCK_UID = "api::article-block.article-block";
const IMAGE_SLIDER_UID = "api::image-slider.image-slider";
const STEPS_CONTAINER_UID = "api::steps-container.steps-container";
const CTA_UID = "api::cta.cta";
const CONTACT_INFO_UID = "api::contact-info.contact-info";
// --- SEEDER: FULL DATASET FOR ALL CONTENT TYPES & COMPONENTS (Strapi v5-ready)
// Uses documentId + connect() for ALL relations, including inside components / dynamic zones.

/* eslint-disable @typescript-eslint/no-explicit-any */
type UID = string;
const UIDS = {
  PAGE: "api::page.page" as UID,
  TEMPLATE: "api::template.template" as UID,
  CONFIG: "api::configuration.configuration" as UID,
  ARTICLE: "api::article.article" as UID,
  ARTICLE_BLOCK: "api::article-block.article-block" as UID,
  STEPS_CONTAINER: "api::steps-container.steps-container" as UID,
  IMAGE_SLIDER: "api::image-slider.image-slider" as UID,
  HERO_BLOCK: "api::hero-block.hero-block" as UID,
  CONTACT_SECTION: "api::contact-section.contact-section" as UID,
  FEATURE_TAB: "api::feature-tab.feature-tab" as UID,
  FEATURE_SECTION: "api::feature-section.feature-section" as UID,
  CONTACT_INFO: "api::contact-info.contact-info" as UID,
  CTA: "api::cta.cta" as UID,
} as const;

function now() {
  return new Date().toISOString();
}

// Helpers -------------------------------------------------------------
function ref(entry: any) {
  return entry?.documentId ? { connect: [entry.documentId] } : undefined;
}
function refMany(entries: any[]) {
  const ids = entries.filter(Boolean).map((e) => e.documentId);
  return ids.length ? { connect: ids } : undefined;
}

async function create(strapi: any, uid: UID, data: Record<string, any>) {
  return await strapi.entityService.create(uid, { data });
}
async function update(
  strapi: any,
  uid: UID,
  id: number | string,
  data: Record<string, any>
) {
  return await strapi.entityService.update(uid, id, { data });
}

export default async function seedDev({ strapi }: { strapi: any }) {
  // Clean -------------------------------------------------------------
  const allUIDs = [
    UIDS.PAGE,
    UIDS.TEMPLATE,
    UIDS.CONFIG,
    UIDS.ARTICLE,
    UIDS.ARTICLE_BLOCK,
    UIDS.STEPS_CONTAINER,
    UIDS.IMAGE_SLIDER,
    UIDS.HERO_BLOCK,
    UIDS.CONTACT_SECTION,
    UIDS.FEATURE_TAB,
    UIDS.FEATURE_SECTION,
    UIDS.CONTACT_INFO,
    UIDS.CTA,
  ];
  for (const uid of allUIDs) {
    try {
      const entries = await strapi.entityService.findMany(uid, {
        fields: ["id"],
      });
      if (Array.isArray(entries)) {
        for (const entry of entries) {
          if (entry?.id) await strapi.entityService.delete(uid, entry.id);
        }
      }
    } catch (err: any) {
      strapi.log.error(`[SEED][CLEAN] ${uid}: ${err?.message ?? err}`);
    }
  }

  const env = process.env.NODE_ENV || "development";
  const wantSeed = (process.env.SEED_DEV ?? "true").toLowerCase() === "true";
  if (env !== "development" || !wantSeed) {
    strapi.log.info(`[SEED] Skipped (NODE_ENV=${env}, SEED_DEV=${wantSeed})`);
    return;
  }
  strapi.log.info("[SEED] Seeding full dataset for all content types...");

  try {
    // 1. Configuration ------------------------------------------------
    const configurations: any[] = [];
    for (let i = 0; i < 5; ++i) {
      try {
        configurations.push(
          await create(strapi, UIDS.CONFIG, {
            Title: `Platform Configuration ${i + 1}: Advanced DJ business settings for environment #${i + 1}`,
            description: `This configuration set includes all environment variables, feature toggles, and integration endpoints required for DJPanel instance #${i + 1}. Use this to manage advanced system behavior, API keys, and deployment-specific options.`,
            publishedAt: now(),
          })
        );
      } catch (err: any) {
        strapi.log.error(`[SEED][CONFIG] ${i}: ${err?.message ?? err}`);
      }
    }

    // 2. Contact Info -------------------------------------------------
    const contactInfos: any[] = [];
    for (let i = 0; i < 5; ++i) {
      try {
        contactInfos.push(
          await create(strapi, UIDS.CONTACT_INFO, {
            title: [
              "Email Contact",
              "Phone Support",
              "General Information",
              "Billing & Payments",
              "Promotions & Newsletters",
            ][i % 5],
            content: [
              "For all inquiries, please email us at contact@djbeatblaster.com. Our team responds within 24 hours on business days.",
              "Call us at +48 726 240 836 for immediate assistance. Our support line is open Monday to Friday, 9:00–17:00.",
              "Find answers to frequently asked questions and learn more about our DJ management platform.",
              "For billing questions, payment issues, or invoice requests, contact our finance department.",
              "Subscribe to our newsletter for the latest updates, special offers, and DJ industry news.",
            ][i % 5],
            detail: [
              "contact@djbeatblaster.com",
              "+48 726 240 836",
              "info@djbeatblaster.com",
              "billing@djbeatblaster.com",
              "newsletter@djbeatblaster.com",
            ][i % 5],
            iconName: ["mail", "phone", "info", "credit-card", "megaphone"][
              i % 5
            ],
            publishedAt: now(),
          })
        );
      } catch (err: any) {
        strapi.log.error(`[SEED][CONTACT_INFO] ${i}: ${err?.message ?? err}`);
      }
    }

    // 3. Contact Section ----------------------------------------------
    const contactSections: any[] = [];
    for (let i = 0; i < 5; ++i) {
      try {
        contactSections.push(
          await create(strapi, UIDS.CONTACT_SECTION, {
            introText: `Need help or have questions? Our team is here to support you at every step of your DJ business journey.`,
            heading: `Contact Our DJPanel Support Team`,
            description: `Whether you need technical assistance, have questions about features, or want to discuss partnership opportunities, our experts are ready to help. Reach out via email, phone, or our online form and we’ll get back to you as soon as possible.`,
            contactInfo: ref(contactInfos[i]),
            publishedAt: now(),
          })
        );
      } catch (err: any) {
        strapi.log.error(
          `[SEED][CONTACT_SECTION] ${i}: ${err?.message ?? err}`
        );
      }
    }

    // 4. Feature Tab --------------------------------------------------
    const featureTabs: any[] = [];
    for (let i = 0; i < 5; ++i) {
      try {
        // Use Unsplash images and alt texts from frontend for feature tabs
        const featureTabSeed = [
          {
            imgAlt: "DJ Company Management",
            imgSrc:
              "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3MXw&ixlib=rb-4.0.3&q=80&w=1080",
            title: "DJ Company Management",
            description: "Manage your DJ business with ease",
          },
          {
            imgAlt: "DJ Documents Management",
            imgSrc:
              "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3MXw&ixlib=rb-4.0.3&q=80&w=1080",
            title: "Documents Management",
            description:
              "Effortlessly create, send, and track DJ contracts, invoices, and other documents",
          },
          {
            imgAlt: "Music Library Management",
            imgSrc:
              "https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3Mnw&ixlib=rb-4.0.3&q=80&w=1080",
            title: "Music Management",
            description: "Easily manage and organize your music library",
          },
          {
            imgAlt: "Party Management",
            imgSrc:
              "https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3Mnw&ixlib=rb-4.0.3&q=80&w=1080",
            title: "Party Management",
            description: "Easily manage and organize your parties and events",
          },
          {
            imgAlt: "DJ Equipment Management",
            imgSrc:
              "https://images.unsplash.com/photo-1526566762798-8fac9c07aa98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU6M3w&ixlib=rb-4.0.3&q=80&w=1080",
            title: "Equipment Management",
            description: "Manage all your DJ equipment in one place",
          },
        ];
        featureTabs.push(
          await create(strapi, UIDS.FEATURE_TAB, {
            ...featureTabSeed[i % featureTabSeed.length],
            description: [
              "Manage your DJ company, staff, and business operations with a unified dashboard. Track performance, assign roles, and monitor KPIs for growth.",
              "Create, send, and track contracts, invoices, and essential documents. Automate paperwork and ensure compliance with industry standards.",
              "Organize your entire music library, create playlists, and manage song requests from clients. Integrate with DJ pools and streaming services.",
              "Plan, schedule, and manage parties or events. Coordinate logistics, guest lists, and setlists for seamless event execution.",
              "Keep a detailed inventory of all DJ equipment, schedule maintenance, and track usage to maximize reliability and performance.",
            ][i % 5],
            publishedAt: now(),
          })
        );
      } catch (err: any) {
        strapi.log.error(`[SEED][FEATURE_TAB] ${i}: ${err?.message ?? err}`);
      }
    }

    // 5. Feature Section ----------------------------------------------
    const featureSections: any[] = [];
    for (let i = 0; i < 5; ++i) {
      try {
        featureSections.push(
          await create(strapi, UIDS.FEATURE_SECTION, {
            reversed: i % 2 === 0,
            tabs: ref(featureTabs[i]),
            sectionTitle: `Feature Section: Discover Powerful Tools for DJs`,
            sectionDescription: `Explore a comprehensive suite of features designed to streamline every aspect of your DJ business. From contract management to music library organization, DJPanel empowers you to work smarter and grow your brand.`,
            publishedAt: now(),
          })
        );
      } catch (err: any) {
        strapi.log.error(
          `[SEED][FEATURE_SECTION] ${i}: ${err?.message ?? err}`
        );
      }
    }

    // 6. CTA ----------------------------------------------------------
    const ctas: any[] = [];
    for (let i = 0; i < 5; ++i) {
      try {
        ctas.push(
          await create(strapi, UIDS.CTA, {
            Label: [
              "Start Managing Your DJ Business",
              "See All Features",
              "Request a Demo",
              "Download the App",
              "Contact Sales",
            ][i % 5],
            url: ["/signup", "/features", "/demo", "/download", "/contact"][
              i % 5
            ],
            OpenInNewTab: i % 2 === 0,
            article: refMany([]),
            publishedAt: now(),
          })
        );
      } catch (err: any) {
        strapi.log.error(`[SEED][CTA] ${i}: ${err?.message ?? err}`);
      }
    }

    // 7. Hero Block ---------------------------------------------------
    const heroBlocks: any[] = [];
    for (let i = 0; i < 5; ++i) {
      try {
        heroBlocks.push(
          await create(strapi, UIDS.HERO_BLOCK, {
            heading: `Manage Your DJ Business with Ease – Platform ${i + 1}`,
            content: `Streamline your DJ business operations with our all-in-one platform. From managing contracts and invoices to organizing your equipment and song library, we've got you covered. Discover how DJPanel can help you save time, reduce stress, and focus on what matters most: your music and your clients.`,
            actions: refMany([ctas[i]]),
            publishedAt: now(),
          })
        );
      } catch (err: any) {
        strapi.log.error(`[SEED][HERO_BLOCK] ${i}: ${err?.message ?? err}`);
      }
    }

    // 8. Article ------------------------------------------------------
    const articles: any[] = [];
    for (let i = 0; i < 5; ++i) {
      try {
        // Use Unsplash images for article coverUrl
        const articleCovers = [
          "https://images.unsplash.com/photo-1471897488648-5eae4ac6686b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3NXw&ixlib=rb-4.0.3&q=80&w=1080",
          "https://images.unsplash.com/photo-1481277542470-605612bd2d61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3MHw&ixlib=rb-4.0.3&q=80&w=1080",
          "https://images.unsplash.com/photo-1444312645910-ffa973656eba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU2OHw&ixlib=rb-4.0.3&q=80&w=1080",
          "https://images.unsplash.com/photo-1494059980473-813e73ee784b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3NHw&ixlib=rb-4.0.3&q=80&w=1080",
          "https://images.unsplash.com/photo-1484627147104-f5197bcd6651?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3NHw&ixlib=rb-4.0.3&q=80&w=1080",
        ];
        const article = await create(strapi, UIDS.ARTICLE, {
          Title: `How to Succeed as a Modern DJ: Pro Tips & Tools #${i + 1}`,
          Slug: `how-to-succeed-modern-dj-${i + 1}`,
          Summary: `Explore proven strategies, digital tools, and business insights to elevate your DJ career. This article covers everything from contract management to building your brand and maximizing event bookings.`,
          coverUrl: articleCovers[i % articleCovers.length],
          Body: `<p>In today's fast-paced music industry, DJs need more than just talent—they need the right tools and business acumen. Learn how to automate your workflow, manage your music library, and deliver unforgettable experiences for your clients. Discover how DJPanel can transform your daily operations and help you stand out in a competitive market.</p>`,
          publishedAt: now(),
        });
        articles.push(article);
      } catch (err: any) {
        strapi.log.error(`[SEED][ARTICLE] ${i}: ${err?.message ?? err}`);
        if (err?.stack) strapi.log.error(err.stack);
      }
    }

    // 9. Steps Container ----------------------------------------------
    const stepsContainers: any[] = [];
    for (let i = 0; i < 5; ++i) {
      try {
        stepsContainers.push(
          await create(strapi, UIDS.STEPS_CONTAINER, {
            heading: `Discover the Power of Our Products`,
            content: `Unlock the full potential of your DJ business with DJPanel. Our platform guides you step by step—from creating your account and managing contracts to organizing your music library and tracking payments. Experience a seamless workflow designed for professional DJs.`,
            action: [],
            steps: [
              {
                title: "Create an Account",
                description:
                  "Sign up to access all the features of our DJ management platform and start your journey to success.",
              },
              {
                title: "Manage DJ Contracts",
                description:
                  "Easily create, send, and track DJ contracts for your events with our intuitive contract management system.",
              },
              {
                title: "Manage Orders",
                description:
                  "Effortlessly manage your event requests and client communications in one place.",
              },
              {
                title: "Organize Songs and Requests",
                description:
                  "Effortlessly manage your music library, accept song requests from clients, and create playlists for your events.",
              },
              {
                title: "Track Invoices and Payments",
                description:
                  "Keep track of invoices, payments, and financial transactions seamlessly to ensure smooth business operations.",
              },
            ],
            publishedAt: now(),
          })
        );
      } catch (err: any) {
        strapi.log.error(
          `[SEED][STEPS_CONTAINER] ${i}: ${err?.message ?? err}`
        );
      }
    }

    // 10. Image Slider -----------------------------------------------
    // Realistic image slider data
    const imageSliderSeedData = [
      {
        Title: "DJ Event Highlights",
        reversed: false,
        AutoPlay: true,
        IntervalMs: 3500,
        images: [
          {
            src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1080&q=80",
            alt: "DJ performing at a crowded club",
          },
          {
            src: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1080&q=80",
            alt: "Professional DJ equipment on stage",
          },
          {
            src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1080&q=80",
            alt: "Dancing crowd at music festival",
          },
        ],
      },
      {
        Title: "Sprzęt DJ-ski",
        reversed: true,
        AutoPlay: false,
        IntervalMs: 4000,
        images: [
          {
            src: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1080&q=80",
            alt: "DJ mixer close-up",
          },
          {
            src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1080&q=80",
            alt: "Turntable and vinyl records",
          },
          {
            src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1080&q=80",
            alt: "DJ headphones on console",
          },
        ],
      },
      {
        Title: "Imprezy i wydarzenia",
        reversed: false,
        AutoPlay: true,
        IntervalMs: 3000,
        images: [
          {
            src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=1080&q=80",
            alt: "People enjoying a party",
          },
          {
            src: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=1080&q=80",
            alt: "DJ lighting effects at night",
          },
          {
            src: "https://images.unsplash.com/photo-1462547631549-697aa3f9b8c3?auto=format&fit=crop&w=1080&q=80",
            alt: "DJ booth with colorful lights",
          },
        ],
      },
      {
        Title: "DJ Nightlife",
        reversed: true,
        AutoPlay: false,
        IntervalMs: 4500,
        images: [
          {
            src: "https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?auto=format&fit=crop&w=1080&q=80",
            alt: "DJ Controller Setup",
          },
          {
            src: "https://images.unsplash.com/photo-1499728603263-13726abce5fd?auto=format&fit=crop&w=1080&q=80",
            alt: "DJ Mixer Setup",
          },
          {
            src: "https://images.unsplash.com/uploads/141103282695035fa1380/95cdfeef?auto=format&fit=crop&w=1080&q=80",
            alt: "DJ Speakers Setup",
          },
        ],
      },
      {
        Title: "DJ Studio",
        reversed: false,
        AutoPlay: true,
        IntervalMs: 5000,
        images: [
          {
            src: "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=1080&q=80",
            alt: "DJ Laptop Setup",
          },
          {
            src: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1080&q=80",
            alt: "DJ Headphones Setup",
          },
          {
            src: "https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=1080&q=80",
            alt: "DJ Contracts",
          },
        ],
      },
    ];
    const imageSliders: any[] = [];
    for (let i = 0; i < imageSliderSeedData.length; ++i) {
      try {
        const slider = await create(strapi, UIDS.IMAGE_SLIDER, {
          ...imageSliderSeedData[i],
          publishedAt: now(),
        });
        imageSliders.push(slider);
      } catch (err: any) {
        strapi.log.error(`[SEED][IMAGE_SLIDER] ${i}: ${err?.message ?? err}`);
      }
    }
    strapi.log.info(
      `[SEED][IMAGE_SLIDER][ALL] ${JSON.stringify(imageSliders)}`
    );

    // 11. Article Block -----------------------------------------------
    const articleBlocks: any[] = [];
    for (let i = 0; i < 5; ++i) {
      try {
        articleBlocks.push(
          await create(strapi, UIDS.ARTICLE_BLOCK, {
            Title: `Block ${i + 1}`,
            items: [],
            publishedAt: now(),
          })
        );
      } catch (err: any) {
        strapi.log.error(`[SEED][ARTICLE_BLOCK] ${i}: ${err?.message ?? err}`);
      }
    }

    // 12. Template ----------------------------------------------------
    const templates: any[] = [];
    for (let i = 0; i < 5; ++i) {
      try {
        const Content: any[] = [];
        if (articleBlocks[i])
          Content.push({
            __component: "article-block-ref.article-block-ref",
            block: ref(articleBlocks[i]),
          });
        if (heroBlocks[i])
          Content.push({
            __component: "hero-block-ref.hero-block-ref",
            hero_block: ref(heroBlocks[i]),
          });
        if (imageSliders[i])
          Content.push({
            __component: "image-slider-ref.image-slider-ref",
            slider: ref(imageSliders[i]),
          });
        if (stepsContainers[i])
          Content.push({
            __component: "steps-container-ref.steps-container-ref",
            container: ref(stepsContainers[i]),
          });
        if (ctas[i])
          Content.push({ __component: "cta-ref.cta-ref", cta: ref(ctas[i]) });
        if (featureSections[i])
          Content.push({
            __component: "feature-section-ref.feature-section-ref",
            feature_section: ref(featureSections[i]),
          });
        if (featureTabs[i])
          Content.push({
            __component: "feature-tab-ref.feature-tab-ref",
            feature_tab: ref(featureTabs[i]),
          });
        if (contactInfos[i])
          Content.push({
            __component: "contact-info-ref.contact-info-ref",
            contact_info: ref(contactInfos[i]),
          });
        if (contactSections[i])
          Content.push({
            __component: "contact-section-ref.contact-section-ref",
            contact_section: ref(contactSections[i]),
          });

        strapi.log.info(
          `[SEED][TEMPLATE][REL] i=${i} Content=${JSON.stringify(Content)}`
        );
        templates.push(
          await create(strapi, UIDS.TEMPLATE, {
            Name: `Template ${i + 1}`,
            TemplateType: "Standard",
            Content,
            publishedAt: now(),
          })
        );
      } catch (err: any) {
        strapi.log.error(`[SEED][TEMPLATE] ${i}: ${err?.message ?? err}`);
        if (err?.stack) strapi.log.error(err.stack);
      }
    }

    // 13. Page --------------------------------------------------------
    for (let i = 0; i < 5; ++i) {
      try {
        await create(strapi, UIDS.PAGE, {
          Title: `Page ${i + 1}`,
          Slug: `/page-${i + 1}`,
          Visible: true,
          Menu: i % 2 === 0 ? "Main" : "Login",
          NavigationOrder: i + 1,
          NavigationAction: i % 2 === 0 ? "Link" : "Action",
          configuration: ref(configurations[i]),
          template: ref(templates[i]),
          publishedAt: now(),
        });
      } catch (err: any) {
        strapi.log.error(`[SEED][PAGE] ${i}: ${err?.message ?? err}`);
      }
    }

    strapi.log.info(
      `[SEED] Done. Seeded 5x for every content type and component.`
    );
  } catch (err: any) {
    strapi.log.error(`[SEED][FATAL] ${err?.message ?? err}`);
    if (err?.stack) strapi.log.error(err.stack);
    throw err;
  }
}
