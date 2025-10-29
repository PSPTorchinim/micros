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
            Title: `Config ${i + 1}`,
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
            title: `Contact ${i + 1}`,
            content: `contact${i + 1}@example.com`,
            detail: `Detail for contact ${i + 1}`,
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
            introText: `Intro ${i + 1}`,
            heading: `Heading ${i + 1}`,
            description: `Description ${i + 1}`,
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
        featureTabs.push(
          await create(strapi, UIDS.FEATURE_TAB, {
            imgAlt: `Feature ${i + 1}`,
            imgSrc: `https://placehold.co/100x100?text=F${i + 1}`,
            title: `Feature Tab ${i + 1}`,
            description: `Description for feature tab ${i + 1}`,
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
            Label: `CTA ${i + 1}`,
            url: `/cta${i + 1}`,
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
            heading: `Hero Heading ${i + 1}`,
            content: `Hero content ${i + 1}`,
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
        const article = await create(strapi, UIDS.ARTICLE, {
          Title: `Article ${i + 1}`,
          Slug: `article-${i + 1}`,
          Summary: `Summary for article ${i + 1}`,
          coverUrl: `https://placehold.co/600x400?text=A${i + 1}`,
          Body: `<p>Body for article ${i + 1}</p>`,
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
            heading: `Steps Heading ${i + 1}`,
            content: `Steps content ${i + 1}`,
            action: [],
            steps: [],
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
    const imageSliders: any[] = [];
    for (let i = 0; i < 5; ++i) {
      try {
        const slider = await create(strapi, UIDS.IMAGE_SLIDER, {
          Title: `Slider ${i + 1}`,
          reversed: i % 2 === 0,
          AutoPlay: i % 2 === 1,
          IntervalMs: 3000 + i * 500,
          Slides: [],
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

    // === RELATIONS FILL (dynamic zones/components) ===================
    // StepsContainer: action/steps
    for (let i = 0; i < 5; ++i) {
      try {
        await update(strapi, UIDS.STEPS_CONTAINER, stepsContainers[i]?.id, {
          action: [
            { __component: "cta-ref.cta-ref", cta: ref(ctas[i]) },
            {
              __component: "feature-section-ref.feature-section-ref",
              feature_section: ref(featureSections[i]),
            },
          ],
          steps: [
            {
              __component: "article-block-ref.article-block-ref",
              block: ref(articleBlocks[i]),
            },
            {
              __component: "feature-tab-ref.feature-tab-ref",
              feature_tab: ref(featureTabs[i]),
            },
          ],
        });
      } catch (err: any) {
        strapi.log.error(
          `[SEED][STEPS_CONTAINER][REL] ${i}: ${err?.message ?? err}`
        );
      }
    }

    // ImageSlider: Slides
    for (let i = 0; i < 5; ++i) {
      try {
        await update(strapi, UIDS.IMAGE_SLIDER, imageSliders[i]?.id, {
          Slides: [
            {
              __component: "article-block-ref.article-block-ref",
              block: ref(articleBlocks[i]),
            },
            {
              __component: "feature-tab-ref.feature-tab-ref",
              feature_tab: ref(featureTabs[i]),
            },
            { __component: "cta-ref.cta-ref", cta: ref(ctas[i]) },
          ],
        });
      } catch (err: any) {
        strapi.log.error(
          `[SEED][IMAGE_SLIDER][REL] ${i}: ${err?.message ?? err}`
        );
      }
    }

    // ArticleBlock: items (IMPORTANT: use documentId + connect)
    for (let i = 0; i < 5; ++i) {
      try {
        const items: any[] = [];
        if (imageSliders[i]) {
          items.push({
            __component: "image-slider-ref.image-slider-ref",
            slider: ref(imageSliders[i]),
          });
        }
        if (stepsContainers[i]) {
          items.push({
            __component: "steps-container-ref.steps-container-ref",
            container: ref(stepsContainers[i]),
          });
        }
        if (ctas[i])
          items.push({ __component: "cta-ref.cta-ref", cta: ref(ctas[i]) });
        if (featureSections[i])
          items.push({
            __component: "feature-section-ref.feature-section-ref",
            feature_section: ref(featureSections[i]),
          });
        if (featureTabs[i])
          items.push({
            __component: "feature-tab-ref.feature-tab-ref",
            feature_tab: ref(featureTabs[i]),
          });
        if (contactInfos[i])
          items.push({
            __component: "contact-info-ref.contact-info-ref",
            contact_info: ref(contactInfos[i]),
          });
        if (contactSections[i])
          items.push({
            __component: "contact-section-ref.contact-section-ref",
            contact_section: ref(contactSections[i]),
          });
        if (heroBlocks[i])
          items.push({
            __component: "hero-block-ref.hero-block-ref",
            hero_block: ref(heroBlocks[i]),
          });

        strapi.log.info(
          `[SEED][ARTICLE_BLOCK][REL] i=${i} items=${JSON.stringify(items)}`
        );
        await update(strapi, UIDS.ARTICLE_BLOCK, articleBlocks[i]?.id, {
          items,
        });
      } catch (err: any) {
        strapi.log.error(
          `[SEED][ARTICLE_BLOCK][REL] ${i}: ${err?.message ?? err}`
        );
        if (err?.stack) strapi.log.error(err.stack);
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
