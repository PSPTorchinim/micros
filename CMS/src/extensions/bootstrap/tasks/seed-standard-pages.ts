// seed-standard-pages.ts

// UIDs
const LOGIN_BLOCK_UID = 'api::login-block.login-block';
const FORGOT_PASSWORD_BLOCK_UID = 'api::forgot-password-block.forgot-password-block';
const TEMPLATE_UID = 'api::template.template';
const PAGE_UID = 'api::page.page';
const CONFIG_UID = 'api::configuration.configuration';
const HERO_BLOCK_UID = 'api::hero-block.hero-block';
const FEATURE_SECTION_UID = 'api::feature-section.feature-section';
const FEATURE_TAB_UID = 'api::feature-tab.feature-tab';
const STEPS_CONTAINER_UID = 'api::steps-container.steps-container';
const CTA_UID = 'api::cta.cta';
const CONTACT_SECTION_UID = 'api::contact-section.contact-section';
const CONTACT_INFO_UID = 'api::contact-info.contact-info';
const ARTICLE_UID = 'api::article.article';
const ARTICLE_BLOCK_UID = 'api::article-block.article-block';
const IMAGE_SLIDER_UID = 'api::image-slider.image-slider';

// --- utils ------------------------------------------------------------------

function now() {
  return new Date().toISOString();
}

function slugify(input?: string) {
  if (!input || typeof input !== 'string') return '';
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function sanitizeLeadingSlash(slug: string) {
  if (!slug) return slug;
  return slug.startsWith('/') ? slug : `/${slug}`;
}

function isBadSlug(slug?: string) {
  return (
    !slug ||
    typeof slug !== 'string' ||
    slug.trim() === '' ||
    slug === 'null' ||
    slug === 'undefined' ||
    slug === '/'
  );
}

// Ensure every page seed has a proper, non-null Slug
function ensurePageSlug(data: any) {
  let slug = typeof data?.Slug === 'string' ? data.Slug : '';
  if (!slug) slug = slugify(data?.Title) || slugify(data?.Name);
  if (isBadSlug(slug)) slug = `page-${Date.now()}`;
  slug = sanitizeLeadingSlash(slug);
  if (isBadSlug(slug)) slug = `/page-${Date.now()}`;
  return { ...data, Slug: slug };
}

// Make a slug unique within Page collection by suffixing -2, -3, ...
async function ensureUniquePageSlug(strapi: any, baseSlug: string) {
  let slug = baseSlug;
  let i = 2;
  // defensive cap
  while (await strapi.db.query(PAGE_UID).findOne({ where: { Slug: slug } })) {
    const suffix = `-${i++}`;
    slug = baseSlug.endsWith('/') ? `${baseSlug.slice(0, -1)}${suffix}/` : `${baseSlug}${suffix}`;
    if (i > 100) break;
  }
  return slug;
}

function ref(entry: any) {
  return entry?.documentId ? { connect: [entry.documentId] } : entry?.id ? { connect: [entry.id] } : undefined;
}

// Seed only when the collection is empty. Map/transform each input first, and log failures verbosely.
async function seedIfEmpty(
  strapi: any,
  uid: string,
  dataArr: any[],
  logLabel: string,
  uniqueField = 'Title',
  mapFn: (x: any) => any = (x) => x
) {
  const count = await strapi.db.query(uid).count();
  if (count === 0) {
    strapi.log.info(`[SEED][STANDARD_PAGES] Seeding ${logLabel}...`);
    for (const raw of dataArr) {
      const data = mapFn(raw);
      try {
        await strapi.entityService.create(uid, { data: { ...data, publishedAt: now() } });
      } catch (err: any) {
        strapi.log.error(
          `[SEED][STANDARD_PAGES] Failed creating ${logLabel} entry${
            data?.[uniqueField] ? ` (${data[uniqueField]})` : ''
          }: ${err?.message ?? err}`
        );
        strapi.log.error(`[SEED][STANDARD_PAGES] Payload: ${JSON.stringify(data, null, 2)}`);
      }
    }
    strapi.log.info(`[SEED][STANDARD_PAGES] ${logLabel} seeded (with possible skips).`);
  } else {
    strapi.log.info(`[SEED][STANDARD_PAGES] ${logLabel} already exist, skipping seeding`);
  }
}

// --- main -------------------------------------------------------------------

export default async function seedStandardPages({ strapi }: { strapi: any }) {
  strapi.log.info('[SEED][STANDARD_PAGES] Starting to seed standard pages...');

  // 0) Configuration: get or create
  let configuration: any;
  try {
    const configurations = await strapi.entityService.findMany(CONFIG_UID, { limit: 1 });
    if (configurations && configurations.length > 0) {
      configuration = configurations[0];
    } else {
      configuration = await strapi.entityService.create(CONFIG_UID, {
        data: {
          Title: 'Default Configuration',
          description: 'Default configuration for standard pages',
          publishedAt: now(),
        },
      });
    }
  } catch (err: any) {
    strapi.log.warn(`[SEED][STANDARD_PAGES] Could not get/create configuration: ${err?.message ?? err}`);
  }

  try {
    // 1) Load static data
    const fs = require('fs');
    const path = require('path');
    const seedDataDir = path.join(__dirname, '../seed-data');

    const safeReadJson = (file: string) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(seedDataDir, file), 'utf-8'));
      } catch (e: any) {
        strapi.log.warn(`[SEED][STANDARD_PAGES] Could not read ${file}: ${e?.message ?? e}`);
        return [];
      }
    };

    const blocksData = safeReadJson('blocks.json');
    const templatesData = safeReadJson('templates.json');
    const pagesData = safeReadJson('pages.json');
    const ctaData = safeReadJson('cta.json');
    const heroBlockData = safeReadJson('hero-block.json');
    const featureSectionData = safeReadJson('feature-section.json');
    const featureTabData = safeReadJson('feature-tab.json');
    const stepsContainerData = safeReadJson('steps-container.json');
    const contactSectionData = safeReadJson('contact-section.json');
    const contactInfoData = safeReadJson('contact-info.json');
    const articleBlockData = safeReadJson('article-block.json');
    const imageSliderData = safeReadJson('image-slider.json');
    const articlesData = safeReadJson('articles.json');

    // 2) Seed primitives only when empty (Pages sanitized to enforce Slug)
    await seedIfEmpty(
      strapi,
      LOGIN_BLOCK_UID,
      (blocksData || []).filter((b: any) => b.title === 'Login'),
      'Login Block'
    );

    await seedIfEmpty(
      strapi,
      FORGOT_PASSWORD_BLOCK_UID,
      (blocksData || []).filter((b: any) => b.title === 'Forgot Password'),
      'Forgot Password Block'
    );

    await seedIfEmpty(strapi, TEMPLATE_UID, templatesData || [], 'Templates', 'Name');

    await seedIfEmpty(
      strapi,
      PAGE_UID,
      (pagesData || []).map(ensurePageSlug),
      'Pages',
      'Slug'
    );

    await seedIfEmpty(strapi, CTA_UID, ctaData || [], 'CTA', 'Label');
    await seedIfEmpty(strapi, HERO_BLOCK_UID, heroBlockData || [], 'Hero Block', 'Title');
    await seedIfEmpty(strapi, FEATURE_SECTION_UID, featureSectionData || [], 'Feature Section', 'Title');
    await seedIfEmpty(strapi, FEATURE_TAB_UID, featureTabData || [], 'Feature Tab', 'Title');
    await seedIfEmpty(strapi, STEPS_CONTAINER_UID, stepsContainerData || [], 'Steps Container', 'Title');
    await seedIfEmpty(strapi, CONTACT_SECTION_UID, contactSectionData || [], 'Contact Section', 'heading');
    await seedIfEmpty(strapi, CONTACT_INFO_UID, contactInfoData || [], 'Contact Info', 'title');
    await seedIfEmpty(strapi, ARTICLE_BLOCK_UID, articleBlockData || [], 'Article Block', 'Title');
    await seedIfEmpty(strapi, IMAGE_SLIDER_UID, imageSliderData || [], 'Image Slider', 'Title');
    await seedIfEmpty(strapi, ARTICLE_UID, articlesData || [], 'Articles', 'Title');

    // 3) Login Template (upsert)
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Login Template...');
    const loginTemplateData = {
      Name: 'Login Page Template',
      TemplateType: 'Login',
      Content: [],
      publishedAt: now(),
    };

    const existingLoginTemplate = await strapi.db.query(TEMPLATE_UID).findOne({ where: { Name: 'Login Page Template' } });
    const loginTemplate = existingLoginTemplate?.id
      ? await strapi.entityService.update(TEMPLATE_UID, existingLoginTemplate.id, { data: loginTemplateData })
      : await strapi.entityService.create(TEMPLATE_UID, { data: loginTemplateData });

    // 4) Forgot Password Template (upsert)
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Forgot Password Template...');
    const forgotPasswordTemplateData = {
      Name: 'Forgot Password Page Template',
      TemplateType: 'ForgotPassword',
      Content: [],
      publishedAt: now(),
    };

    const existingForgotPasswordTemplate = await strapi.db.query(TEMPLATE_UID).findOne({ where: { Name: 'Forgot Password Page Template' } });
    const forgotPasswordTemplate = existingForgotPasswordTemplate?.id
      ? await strapi.entityService.update(TEMPLATE_UID, existingForgotPasswordTemplate.id, { data: forgotPasswordTemplateData })
      : await strapi.entityService.create(TEMPLATE_UID, { data: forgotPasswordTemplateData });

    // 5) Login Page (upsert)
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Login Page...');
    const loginPageData = {
      Title: 'Login',
      Slug: '/users/login',
      Visible: true,
      Menu: 'Login',
      NavigationOrder: 1,
      NavigationAction: 'Link',
      configuration: configuration ? ref(configuration) : undefined,
      template: loginTemplate ? ref(loginTemplate) : undefined,
      publishedAt: now(),
    };

    const existingLoginPage = await strapi.db.query(PAGE_UID).findOne({ where: { Slug: '/users/login' } });
    if (existingLoginPage?.id) {
      await strapi.entityService.update(PAGE_UID, existingLoginPage.id, { data: loginPageData });
    } else {
      await strapi.entityService.create(PAGE_UID, { data: loginPageData });
    }

    // 6) Forgot Password Page (upsert)
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Forgot Password Page...');
    const forgotPasswordPageData = {
      Title: 'Forgot Password',
      Slug: '/users/forgot-password',
      Visible: true,
      Menu: 'Login',
      NavigationOrder: 2,
      NavigationAction: 'Link',
      configuration: configuration ? ref(configuration) : undefined,
      template: forgotPasswordTemplate ? ref(forgotPasswordTemplate) : undefined,
      publishedAt: now(),
    };

    const existingForgotPasswordPage = await strapi.db.query(PAGE_UID).findOne({ where: { Slug: '/users/forgot-password' } });
    if (existingForgotPasswordPage?.id) {
      await strapi.entityService.update(PAGE_UID, existingForgotPasswordPage.id, { data: forgotPasswordPageData });
    } else {
      await strapi.entityService.create(PAGE_UID, { data: forgotPasswordPageData });
    }

    // 7) Home: CTA
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Home Page content...');
    const existingHomeCTA = await strapi.db.query(CTA_UID).findOne({ where: { Label: 'Get Started' } });
    const homeCTA = existingHomeCTA?.id
      ? await strapi.entityService.update(CTA_UID, existingHomeCTA.id, {
          data: { Label: 'Get Started', url: '/users/login', OpenInNewTab: false, publishedAt: now() },
        })
      : await strapi.entityService.create(CTA_UID, {
          data: { Label: 'Get Started', url: '/users/login', OpenInNewTab: false, publishedAt: now() },
        });

    // 7.1) Home Hero
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Home Hero Block...');
    const existingHomeHero = await strapi.db.query(HERO_BLOCK_UID).findOne({
      where: { heading: 'Welcome to DJ Beat Blaster' },
    });

    const homeHeroBlock = existingHomeHero?.id
      ? await strapi.entityService.update(HERO_BLOCK_UID, existingHomeHero.id, {
          data: {
            heading: 'Welcome to DJ Beat Blaster',
            content:
              'Your all-in-one platform for managing your DJ business. Streamline contracts, track events, organize your music library, and grow your brand with our comprehensive suite of tools.',
            actions: ref(homeCTA),
            publishedAt: now(),
          },
        })
      : await strapi.entityService.create(HERO_BLOCK_UID, {
          data: {
            heading: 'Welcome to DJ Beat Blaster',
            content:
              'Your all-in-one platform for managing your DJ business. Streamline contracts, track events, organize your music library, and grow your brand with our comprehensive suite of tools.',
            actions: ref(homeCTA),
            publishedAt: now(),
          },
        });

    // 7.2) Home Feature Tab
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Home Feature Tab...');
    const existingHomeFeatureTab = await strapi.db.query(FEATURE_TAB_UID).findOne({
      where: { title: 'DJ Business Management' },
    });

    const homeFeatureTab = existingHomeFeatureTab?.id
      ? await strapi.entityService.update(FEATURE_TAB_UID, existingHomeFeatureTab.id, {
          data: {
            title: 'DJ Business Management',
            description:
              'Manage your entire DJ business from one place. Handle contracts, invoices, equipment, and events with ease.',
            imgSrc:
              'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3MXw&ixlib=rb-4.0.3&q=80&w=1080',
            imgAlt: 'DJ Business Management Dashboard',
            publishedAt: now(),
          },
        })
      : await strapi.entityService.create(FEATURE_TAB_UID, {
          data: {
            title: 'DJ Business Management',
            description:
              'Manage your entire DJ business from one place. Handle contracts, invoices, equipment, and events with ease.',
            imgSrc:
              'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3MXw&ixlib=rb-4.0.3&q=80&w=1080',
            imgAlt: 'DJ Business Management Dashboard',
            publishedAt: now(),
          },
        });

    // 7.3) Home Feature Section (upsert: prefer a single record)
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Home Feature Section...');
    const existingHomeFeatureSection = await strapi.db.query(FEATURE_SECTION_UID).findOne({
      where: { reversed: false },
    });

    const homeFeatureSection = existingHomeFeatureSection?.id
      ? await strapi.entityService.update(FEATURE_SECTION_UID, existingHomeFeatureSection.id, {
          data: { reversed: false, tabs: ref(homeFeatureTab), publishedAt: now() },
        })
      : await strapi.entityService.create(FEATURE_SECTION_UID, {
          data: { reversed: false, tabs: ref(homeFeatureTab), publishedAt: now() },
        });

    // 7.4) Steps Container
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Home Steps Container...');
    const existingHomeSteps = await strapi.db.query(STEPS_CONTAINER_UID).findOne({
      where: { heading: 'Get Started in Minutes' },
    });

    const homeStepsContainer = existingHomeSteps?.id
      ? await strapi.entityService.update(STEPS_CONTAINER_UID, existingHomeSteps.id, {
          data: {
            heading: 'Get Started in Minutes',
            content:
              'Join DJ Beat Blaster today and take control of your DJ business with our easy-to-use platform.',
            steps: [],
            action: [],
            publishedAt: now(),
          },
        })
      : await strapi.entityService.create(STEPS_CONTAINER_UID, {
          data: {
            heading: 'Get Started in Minutes',
            content:
              'Join DJ Beat Blaster today and take control of your DJ business with our easy-to-use platform.',
            steps: [],
            action: [],
            publishedAt: now(),
          },
        });

    // 7.5) Articles (create/update, then create pages per-article)
    strapi.log.info('[SEED][STANDARD_PAGES] Creating DJ-related articles...');
    const articles: any[] = [];
    for (const data of articlesData || []) {
      const existing = await strapi.db.query(ARTICLE_UID).findOne({ where: { Title: data.Title } });
      const article = existing?.id
        ? await strapi.entityService.update(ARTICLE_UID, existing.id, { data: { ...data, publishedAt: now() } })
        : await strapi.entityService.create(ARTICLE_UID, { data: { ...data, publishedAt: now() } });

      articles.push({ ...article, ...data });
    }

    // 7.6) Article pages
    strapi.log.info('[SEED][STANDARD_PAGES] Creating pages for each article...');
    const toSlug = (s?: string) => slugify(s || '');
    for (const article of articles) {
      // Build slug
      let core = toSlug(article.Title) || toSlug(article.Summary) || (article.id ? `article-${article.id}` : '');
      if (isBadSlug(core)) core = `article-${Math.random().toString(36).slice(2, 10)}`;
      let slug = sanitizeLeadingSlash(`articles/${core}`);
      if (isBadSlug(slug) || slug === '/articles') slug = `/articles/article-${Date.now()}`;
      slug = await ensureUniquePageSlug(strapi, slug);

      // Template per article
      const articleTemplateName = `Template: ${article.Title}`;
      const articleTemplateData = {
        Name: articleTemplateName,
        TemplateType: 'Standard',
        Content: [
          {
            __component: 'article-block-ref.article-block-ref',
            article: ref(article),
          },
        ],
        publishedAt: now(),
      };

      const existingArticleTemplate = await strapi.db.query(TEMPLATE_UID).findOne({
        where: { Name: articleTemplateName },
      });

      const articleTemplate = existingArticleTemplate?.id
        ? await strapi.entityService.update(TEMPLATE_UID, existingArticleTemplate.id, { data: articleTemplateData })
        : await strapi.entityService.create(TEMPLATE_UID, { data: articleTemplateData });

      const articlePageData = {
        Title: article.Title,
        Slug: slug,
        description: article.Summary,
        Menu: 'Main',
        Visible: true, // set to false if you don't want to show in nav
        NavigationOrder: 100, // pushed back
        configuration: configuration ? ref(configuration) : undefined,
        template: articleTemplate ? ref(articleTemplate) : undefined,
        publishedAt: now(),
      };

      const existingArticlePage = await strapi.db.query(PAGE_UID).findOne({ where: { Slug: slug } });
      if (existingArticlePage?.id) {
        await strapi.entityService.update(PAGE_UID, existingArticlePage.id, { data: articlePageData });
      } else {
        await strapi.entityService.create(PAGE_UID, { data: articlePageData });
      }
    }

    // 7.7) Article Blocks only if empty (kept list for optional Home template usage)
    const articleBlockCount = await strapi.db.query(ARTICLE_BLOCK_UID).count();
    const articleBlocks: any[] = [];
    if (articleBlockCount === 0) {
      strapi.log.info('[SEED][STANDARD_PAGES] Seeding Article Blocks...');
      for (const raw of articleBlockData || []) {
        try {
          const created = await strapi.entityService.create(ARTICLE_BLOCK_UID, {
            data: { ...raw, publishedAt: now() },
          });
          articleBlocks.push(created);
        } catch (e: any) {
          strapi.log.error(`[SEED][STANDARD_PAGES] Failed creating Article Block: ${e?.message ?? e}`);
        }
      }
    } else {
      const fetched = await strapi.entityService.findMany(ARTICLE_BLOCK_UID, { limit: 3 });
      articleBlocks.push(...(fetched || []));
    }

    // 7.8) Home Template (compose blocks)
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Home Template...');
    const imageSliders = await strapi.entityService.findMany(IMAGE_SLIDER_UID, { limit: 2 });

    const homeTemplateData = {
      Name: 'Home Page Template',
      TemplateType: 'Standard',
      Content: [
        homeHeroBlock && {
          __component: 'hero-block-ref.hero-block-ref',
          hero_block: ref(homeHeroBlock),
        },
        homeFeatureSection && {
          __component: 'feature-section-ref.feature-section-ref',
          feature_section: ref(homeFeatureSection),
        },
        articleBlocks[0] && {
          __component: 'article-block-ref.article-block-ref',
          article_block: ref(articleBlocks[0]),
        },
        imageSliders[0] && {
          __component: 'image-slider-ref.image-slider-ref',
          image_slider: ref(imageSliders[0]),
        },
        articleBlocks[1] && {
          __component: 'article-block-ref.article-block-ref',
          article_block: ref(articleBlocks[1]),
        },
        homeStepsContainer && {
          __component: 'steps-container-ref.steps-container-ref',
          container: ref(homeStepsContainer),
        },
        articleBlocks[2] && {
          __component: 'article-block-ref.article-block-ref',
          article_block: ref(articleBlocks[2]),
        },
        imageSliders[1] && {
          __component: 'image-slider-ref.image-slider-ref',
          image_slider: ref(imageSliders[1]),
        },
      ].filter(Boolean),
      publishedAt: now(),
    };

    const existingHomeTemplate = await strapi.db.query(TEMPLATE_UID).findOne({
      where: { Name: 'Home Page Template' },
    });

    const homeTemplate = existingHomeTemplate?.id
      ? await strapi.entityService.update(TEMPLATE_UID, existingHomeTemplate.id, { data: homeTemplateData })
      : await strapi.entityService.create(TEMPLATE_UID, { data: homeTemplateData });

    // 7.9) Home Page
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Home Page...');
    const homePageData = {
      Title: 'Home',
      Slug: '/',
      Visible: true,
      Menu: 'Main',
      NavigationOrder: 1,
      NavigationAction: 'Link',
      configuration: configuration ? ref(configuration) : undefined,
      template: homeTemplate ? ref(homeTemplate) : undefined,
      publishedAt: now(),
    };

    const existingHomePage = await strapi.db.query(PAGE_UID).findOne({ where: { Slug: '/' } });
    if (existingHomePage?.id) {
      await strapi.entityService.update(PAGE_UID, existingHomePage.id, { data: homePageData });
    } else {
      await strapi.entityService.create(PAGE_UID, { data: homePageData });
    }

    // 8) About: Contact Info + Section + Template + Page
    strapi.log.info('[SEED][STANDARD_PAGES] Creating About Page content...');
    const existingAboutContactInfo = await strapi.db.query(CONTACT_INFO_UID).findOne({ where: { title: 'Get in Touch' } });
    const aboutContactInfo = existingAboutContactInfo?.id
      ? await strapi.entityService.update(CONTACT_INFO_UID, existingAboutContactInfo.id, {
          data: {
            title: 'Get in Touch',
            content:
              'Have questions or want to learn more? Contact us and discover how DJ Beat Blaster can help grow your DJ business.',
            detail: 'contact@djbeatblaster.com',
            iconName: 'mail',
            publishedAt: now(),
          },
        })
      : await strapi.entityService.create(CONTACT_INFO_UID, {
          data: {
            title: 'Get in Touch',
            content:
              'Have questions or want to learn more? Contact us and discover how DJ Beat Blaster can help grow your DJ business.',
            detail: 'contact@djbeatblaster.com',
            iconName: 'mail',
            publishedAt: now(),
          },
        });

    const existingAboutContact = await strapi.db.query(CONTACT_SECTION_UID).findOne({
      where: { heading: 'About DJ Beat Blaster' },
    });

    const contactSectionDataObj = {
      heading: 'About DJ Beat Blaster',
      introText: 'Your Partner in DJ Business Success',
      description:
        'DJ Beat Blaster is a comprehensive platform designed by DJs, for DJs. We understand the unique challenges of running a DJ business and have created tools to help you manage contracts, events, equipment, and music libraries all in one place. Our mission is to empower DJs to focus on what they do best: creating unforgettable experiences for their clients.',
      contactInfo: ref(aboutContactInfo),
      publishedAt: now(),
    };

    const aboutContactSection = existingAboutContact?.id
      ? await strapi.entityService.update(CONTACT_SECTION_UID, existingAboutContact.id, { data: contactSectionDataObj })
      : await strapi.entityService.create(CONTACT_SECTION_UID, { data: contactSectionDataObj });

    strapi.log.info('[SEED][STANDARD_PAGES] Creating About Template...');
    const aboutTemplateData = {
      Name: 'About Page Template',
      TemplateType: 'Standard',
      Content: [
        {
          __component: 'contact-section-ref.contact-section-ref',
          contact_section: ref(aboutContactSection),
        },
      ],
      publishedAt: now(),
    };

    const existingAboutTemplate = await strapi.db.query(TEMPLATE_UID).findOne({ where: { Name: 'About Page Template' } });
    const aboutTemplate = existingAboutTemplate?.id
      ? await strapi.entityService.update(TEMPLATE_UID, existingAboutTemplate.id, { data: aboutTemplateData })
      : await strapi.entityService.create(TEMPLATE_UID, { data: aboutTemplateData });

    strapi.log.info('[SEED][STANDARD_PAGES] Creating About Page...');
    const aboutPageData = {
      Title: 'About',
      Slug: '/about',
      Visible: true,
      Menu: 'Main',
      NavigationOrder: 2,
      NavigationAction: 'Link',
      configuration: configuration ? ref(configuration) : undefined,
      template: aboutTemplate ? ref(aboutTemplate) : undefined,
      publishedAt: now(),
    };

    const existingAboutPage = await strapi.db.query(PAGE_UID).findOne({ where: { Slug: '/about' } });
    if (existingAboutPage?.id) {
      await strapi.entityService.update(PAGE_UID, existingAboutPage.id, { data: aboutPageData });
    } else {
      await strapi.entityService.create(PAGE_UID, { data: aboutPageData });
    }

    // 9) Profile: Template + Page
    strapi.log.info('[SEED][STANDARD_PAGES] Creating User Profile Page...');
    const profileTemplateData = {
      Name: 'User Profile Page Template',
      TemplateType: 'Standard',
      Content: [],
      publishedAt: now(),
    };

    const existingProfileTemplate = await strapi.db.query(TEMPLATE_UID).findOne({
      where: { Name: 'User Profile Page Template' },
    });

    const profileTemplate = existingProfileTemplate?.id
      ? await strapi.entityService.update(TEMPLATE_UID, existingProfileTemplate.id, { data: profileTemplateData })
      : await strapi.entityService.create(TEMPLATE_UID, { data: profileTemplateData });

    const profilePageData = {
      Title: 'Profile',
      Slug: '/profile',
      Visible: true,
      Menu: 'Main',
      NavigationOrder: 3,
      NavigationAction: 'Link',
      configuration: configuration ? ref(configuration) : undefined,
      template: profileTemplate ? ref(profileTemplate) : undefined,
      publishedAt: now(),
    };

    const existingProfilePage = await strapi.db.query(PAGE_UID).findOne({ where: { Slug: '/profile' } });
    if (existingProfilePage?.id) {
      await strapi.entityService.update(PAGE_UID, existingProfilePage.id, { data: profilePageData });
    } else {
      await strapi.entityService.create(PAGE_UID, { data: profilePageData });
    }

    strapi.log.info('[SEED][STANDARD_PAGES] Successfully seeded all standard pages');
  } catch (error: any) {
    strapi.log.error(`[SEED][STANDARD_PAGES] Error: ${error?.message ?? error}`);
    if (error?.stack) strapi.log.error(error.stack);
    strapi.log.warn('[SEED][STANDARD_PAGES] Seeding completed with errors - some pages may not have been created');
  }
}
