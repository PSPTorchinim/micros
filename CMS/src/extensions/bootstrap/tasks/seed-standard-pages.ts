// Automatic seeder for standard pages (Login, Forgot Password, Home, About, Profile)
// This seeder creates essential pages that should exist in all environments

const LOGIN_BLOCK_UID = 'api::login-block.login-block';
const FORGOT_PASSWORD_BLOCK_UID =
  'api::forgot-password-block.forgot-password-block';
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

function now() {
  return new Date().toISOString();
}

function ref(entry: any) {
  return entry?.documentId ? { connect: [entry.documentId] } : undefined;
}

export default async function seedStandardPages({ strapi }: { strapi: any }) {
  strapi.log.info('[SEED][STANDARD_PAGES] Starting to seed standard pages...');

  // Get the first configuration or create one if none exists
  let configuration;
  try {
    const configurations = await strapi.entityService.findMany(CONFIG_UID, {
      limit: 1,
    });
    if (configurations && configurations.length > 0) {
      configuration = configurations[0];
    } else {
      // Create a default configuration if none exists
      configuration = await strapi.entityService.create(CONFIG_UID, {
        data: {
          Title: 'Default Configuration',
          description: 'Default configuration for standard pages',
          publishedAt: now(),
        },
      });
    }
  } catch (err: any) {
    strapi.log.warn(
      `[SEED][STANDARD_PAGES] Could not get/create configuration: ${err?.message ?? err}`,
    );
  }

  try {
    // 1. Create or update Login Block (single type)
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Login Block...');
    const loginBlockData = {
      title: 'Login',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      submitButtonText: 'Login',
      forgotPasswordText: 'Forgot your password?',
      resetPasswordLinkText: 'Reset Password',
      emailPlaceholder: 'Enter your email',
      passwordPlaceholder: 'Enter your password',
      customStyles: {},
      redirectPath: '/dashboard',
      forgotPasswordUrl: '/users/forgot-password',
    };

    let loginBlock;
    const existingLoginBlock = await strapi.db
      .query(LOGIN_BLOCK_UID)
      .findOne({});
    if (existingLoginBlock && existingLoginBlock.id) {
      loginBlock = await strapi.entityService.update(
        LOGIN_BLOCK_UID,
        existingLoginBlock.id,
        {
          data: loginBlockData,
        },
      );
      strapi.log.info('[SEED][STANDARD_PAGES] Login Block updated');
    } else {
      loginBlock = await strapi.entityService.create(LOGIN_BLOCK_UID, {
        data: loginBlockData,
      });
      strapi.log.info('[SEED][STANDARD_PAGES] Login Block created');
    }

    // 2. Create or update Forgot Password Block (single type)
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Forgot Password Block...');
    const forgotPasswordBlockData = {
      title: 'Forgot Password',
      description: 'Enter your email address to reset your password.',
      emailLabel: 'Email',
      submitButtonText: 'Send Reset Link',
      backToLoginText: 'Remembered your password?',
      loginLinkText: 'Login',
      emailPlaceholder: 'Enter your email',
      successRedirectPath: '/users/login',
      loginUrl: '/users/login',
      customStyles: {},
    };

    let forgotPasswordBlock;
    const existingForgotPasswordBlock = await strapi.db
      .query(FORGOT_PASSWORD_BLOCK_UID)
      .findOne({});
    if (existingForgotPasswordBlock && existingForgotPasswordBlock.id) {
      forgotPasswordBlock = await strapi.entityService.update(
        FORGOT_PASSWORD_BLOCK_UID,
        existingForgotPasswordBlock.id,
        {
          data: forgotPasswordBlockData,
        },
      );
      strapi.log.info('[SEED][STANDARD_PAGES] Forgot Password Block updated');
    } else {
      forgotPasswordBlock = await strapi.entityService.create(
        FORGOT_PASSWORD_BLOCK_UID,
        {
          data: forgotPasswordBlockData,
        },
      );
      strapi.log.info('[SEED][STANDARD_PAGES] Forgot Password Block created');
    }

    // 3. Create Login Template
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Login Template...');
    const loginTemplateData = {
      Name: 'Login Page Template',
      TemplateType: 'Login',
      Content: [],
      publishedAt: now(),
    };

    let loginTemplate;
    const existingLoginTemplate = await strapi.db.query(TEMPLATE_UID).findOne({
      where: { Name: 'Login Page Template' },
    });
    if (existingLoginTemplate && existingLoginTemplate.id) {
      loginTemplate = await strapi.entityService.update(
        TEMPLATE_UID,
        existingLoginTemplate.id,
        {
          data: loginTemplateData,
        },
      );
      strapi.log.info('[SEED][STANDARD_PAGES] Login Template updated');
    } else {
      loginTemplate = await strapi.entityService.create(TEMPLATE_UID, {
        data: loginTemplateData,
      });
      strapi.log.info('[SEED][STANDARD_PAGES] Login Template created');
    }

    // 4. Create Forgot Password Template
    strapi.log.info(
      '[SEED][STANDARD_PAGES] Creating Forgot Password Template...',
    );
    const forgotPasswordTemplateData = {
      Name: 'Forgot Password Page Template',
      TemplateType: 'ForgotPassword',
      Content: [],
      publishedAt: now(),
    };

    let forgotPasswordTemplate;
    const existingForgotPasswordTemplate = await strapi.db
      .query(TEMPLATE_UID)
      .findOne({
        where: { Name: 'Forgot Password Page Template' },
      });
    if (existingForgotPasswordTemplate && existingForgotPasswordTemplate.id) {
      forgotPasswordTemplate = await strapi.entityService.update(
        TEMPLATE_UID,
        existingForgotPasswordTemplate.id,
        {
          data: forgotPasswordTemplateData,
        },
      );
      strapi.log.info(
        '[SEED][STANDARD_PAGES] Forgot Password Template updated',
      );
    } else {
      forgotPasswordTemplate = await strapi.entityService.create(TEMPLATE_UID, {
        data: forgotPasswordTemplateData,
      });
      strapi.log.info(
        '[SEED][STANDARD_PAGES] Forgot Password Template created',
      );
    }

    // 5. Create Login Page
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Login Page...');
    const loginPageData = {
      Title: 'Login',
      Slug: '/users/login',
      Visible: true,
      Menu: 'Login',
      NavigationOrder: 1,
      NavigationAction: 'Link',
      configuration:
        configuration?.documentId || configuration?.id
          ? { connect: [configuration.documentId || configuration.id] }
          : undefined,
      template: loginTemplate?.documentId
        ? { connect: [loginTemplate.documentId] }
        : undefined,
      publishedAt: now(),
    };

    const existingLoginPage = await strapi.db.query(PAGE_UID).findOne({
      where: { Slug: '/users/login' },
    });
    if (existingLoginPage && existingLoginPage.id) {
      await strapi.entityService.update(PAGE_UID, existingLoginPage.id, {
        data: loginPageData,
      });
      strapi.log.info('[SEED][STANDARD_PAGES] Login Page updated');
    } else {
      await strapi.entityService.create(PAGE_UID, {
        data: loginPageData,
      });
      strapi.log.info('[SEED][STANDARD_PAGES] Login Page created');
    }

    // 6. Create Forgot Password Page
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Forgot Password Page...');
    const forgotPasswordPageData = {
      Title: 'Forgot Password',
      Slug: '/users/forgot-password',
      Visible: true,
      Menu: 'Login',
      NavigationOrder: 2,
      NavigationAction: 'Link',
      configuration:
        configuration?.documentId || configuration?.id
          ? { connect: [configuration.documentId || configuration.id] }
          : undefined,
      template: forgotPasswordTemplate?.documentId
        ? { connect: [forgotPasswordTemplate.documentId] }
        : undefined,
      publishedAt: now(),
    };

    const existingForgotPasswordPage = await strapi.db.query(PAGE_UID).findOne({
      where: { Slug: '/users/forgot-password' },
    });
    if (existingForgotPasswordPage && existingForgotPasswordPage.id) {
      await strapi.entityService.update(
        PAGE_UID,
        existingForgotPasswordPage.id,
        {
          data: forgotPasswordPageData,
        },
      );
      strapi.log.info('[SEED][STANDARD_PAGES] Forgot Password Page updated');
    } else {
      await strapi.entityService.create(PAGE_UID, {
        data: forgotPasswordPageData,
      });
      strapi.log.info('[SEED][STANDARD_PAGES] Forgot Password Page created');
    }

    // 7. Create Home Page content blocks
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Home Page content...');

    // Create CTA for Home Page
    let homeCTA;
    const existingHomeCTA = await strapi.db.query(CTA_UID).findOne({
      where: { Label: 'Get Started' },
    });
    if (existingHomeCTA && existingHomeCTA.id) {
      homeCTA = await strapi.entityService.update(CTA_UID, existingHomeCTA.id, {
        data: {
          Label: 'Get Started',
          url: '/users/login',
          OpenInNewTab: false,
          publishedAt: now(),
        },
      });
    } else {
      homeCTA = await strapi.entityService.create(CTA_UID, {
        data: {
          Label: 'Get Started',
          url: '/users/login',
          OpenInNewTab: false,
          publishedAt: now(),
        },
      });
    }

    // Create Hero Block for Home Page
    let homeHeroBlock;
    const existingHomeHero = await strapi.db.query(HERO_BLOCK_UID).findOne({
      where: { heading: 'Welcome to DJ Beat Blaster' },
    });
    if (existingHomeHero && existingHomeHero.id) {
      homeHeroBlock = await strapi.entityService.update(
        HERO_BLOCK_UID,
        existingHomeHero.id,
        {
          data: {
            heading: 'Welcome to DJ Beat Blaster',
            content:
              'Your all-in-one platform for managing your DJ business. Streamline contracts, track events, organize your music library, and grow your brand with our comprehensive suite of tools.',
            actions: ref(homeCTA),
            publishedAt: now(),
          },
        },
      );
    } else {
      homeHeroBlock = await strapi.entityService.create(HERO_BLOCK_UID, {
        data: {
          heading: 'Welcome to DJ Beat Blaster',
          content:
            'Your all-in-one platform for managing your DJ business. Streamline contracts, track events, organize your music library, and grow your brand with our comprehensive suite of tools.',
          actions: ref(homeCTA),
          publishedAt: now(),
        },
      });
    }

    // Create Feature Tab for Home Page
    let homeFeatureTab;
    const existingHomeFeatureTab = await strapi.db
      .query(FEATURE_TAB_UID)
      .findOne({
        where: { title: 'DJ Business Management' },
      });
    if (existingHomeFeatureTab && existingHomeFeatureTab.id) {
      homeFeatureTab = await strapi.entityService.update(
        FEATURE_TAB_UID,
        existingHomeFeatureTab.id,
        {
          data: {
            title: 'DJ Business Management',
            description:
              'Manage your entire DJ business from one place. Handle contracts, invoices, equipment, and events with ease.',
            imgSrc:
              'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTc0MTcxMTU3MXw&ixlib=rb-4.0.3&q=80&w=1080',
            imgAlt: 'DJ Business Management Dashboard',
            publishedAt: now(),
          },
        },
      );
    } else {
      homeFeatureTab = await strapi.entityService.create(FEATURE_TAB_UID, {
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
    }

    // Create Feature Section for Home Page
    let homeFeatureSection;
    const existingHomeFeatureSection = await strapi.db
      .query(FEATURE_SECTION_UID)
      .findOne({
        where: { sectionTitle: 'Why Choose DJ Beat Blaster' },
      });
    if (existingHomeFeatureSection && existingHomeFeatureSection.id) {
      homeFeatureSection = await strapi.entityService.update(
        FEATURE_SECTION_UID,
        existingHomeFeatureSection.id,
        {
          data: {
            sectionTitle: 'Why Choose DJ Beat Blaster',
            sectionDescription:
              'Discover powerful features designed to help you manage and grow your DJ business efficiently.',
            reversed: false,
            tabs: ref(homeFeatureTab),
            publishedAt: now(),
          },
        },
      );
    } else {
      homeFeatureSection = await strapi.entityService.create(
        FEATURE_SECTION_UID,
        {
          data: {
            sectionTitle: 'Why Choose DJ Beat Blaster',
            sectionDescription:
              'Discover powerful features designed to help you manage and grow your DJ business efficiently.',
            reversed: false,
            tabs: ref(homeFeatureTab),
            publishedAt: now(),
          },
        },
      );
    }

    // Create Steps Container for Home Page
    let homeStepsContainer;
    const existingHomeSteps = await strapi.db
      .query(STEPS_CONTAINER_UID)
      .findOne({
        where: { heading: 'Get Started in Minutes' },
      });
    if (existingHomeSteps && existingHomeSteps.id) {
      homeStepsContainer = await strapi.entityService.update(
        STEPS_CONTAINER_UID,
        existingHomeSteps.id,
        {
          data: {
            heading: 'Get Started in Minutes',
            content:
              'Join DJ Beat Blaster today and take control of your DJ business with our easy-to-use platform.',
            steps: [
              {
                title: 'Create Your Account',
                description:
                  'Sign up for free and get instant access to all features.',
              },
              {
                title: 'Set Up Your Profile',
                description:
                  'Add your business information, equipment, and services.',
              },
              {
                title: 'Start Managing Events',
                description:
                  'Create contracts, track bookings, and manage your calendar.',
              },
            ],
            action: [],
            publishedAt: now(),
          },
        },
      );
    } else {
      homeStepsContainer = await strapi.entityService.create(
        STEPS_CONTAINER_UID,
        {
          data: {
            heading: 'Get Started in Minutes',
            content:
              'Join DJ Beat Blaster today and take control of your DJ business with our easy-to-use platform.',
            steps: [
              {
                title: 'Create Your Account',
                description:
                  'Sign up for free and get instant access to all features.',
              },
              {
                title: 'Set Up Your Profile',
                description:
                  'Add your business information, equipment, and services.',
              },
              {
                title: 'Start Managing Events',
                description:
                  'Create contracts, track bookings, and manage your calendar.',
              },
            ],
            action: [],
            publishedAt: now(),
          },
        },
      );
    }

    // Create Home Template
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Home Template...');
    const homeTemplateData = {
      Name: 'Home Page Template',
      TemplateType: 'Standard',
      Content: [
        {
          __component: 'hero-block-ref.hero-block-ref',
          hero_block: ref(homeHeroBlock),
        },
        {
          __component: 'feature-section-ref.feature-section-ref',
          feature_section: ref(homeFeatureSection),
        },
        {
          __component: 'steps-container-ref.steps-container-ref',
          container: ref(homeStepsContainer),
        },
      ],
      publishedAt: now(),
    };

    let homeTemplate;
    const existingHomeTemplate = await strapi.db.query(TEMPLATE_UID).findOne({
      where: { Name: 'Home Page Template' },
    });
    if (existingHomeTemplate && existingHomeTemplate.id) {
      homeTemplate = await strapi.entityService.update(
        TEMPLATE_UID,
        existingHomeTemplate.id,
        {
          data: homeTemplateData,
        },
      );
      strapi.log.info('[SEED][STANDARD_PAGES] Home Template updated');
    } else {
      homeTemplate = await strapi.entityService.create(TEMPLATE_UID, {
        data: homeTemplateData,
      });
      strapi.log.info('[SEED][STANDARD_PAGES] Home Template created');
    }

    // Create Home Page
    strapi.log.info('[SEED][STANDARD_PAGES] Creating Home Page...');
    const homePageData = {
      Title: 'Home',
      Slug: '/',
      Visible: true,
      Menu: 'Main',
      NavigationOrder: 1,
      NavigationAction: 'Link',
      configuration:
        configuration?.documentId || configuration?.id
          ? { connect: [configuration.documentId || configuration.id] }
          : undefined,
      template: homeTemplate?.documentId
        ? { connect: [homeTemplate.documentId] }
        : undefined,
      publishedAt: now(),
    };

    const existingHomePage = await strapi.db.query(PAGE_UID).findOne({
      where: { Slug: '/' },
    });
    if (existingHomePage && existingHomePage.id) {
      await strapi.entityService.update(PAGE_UID, existingHomePage.id, {
        data: homePageData,
      });
      strapi.log.info('[SEED][STANDARD_PAGES] Home Page updated');
    } else {
      await strapi.entityService.create(PAGE_UID, {
        data: homePageData,
      });
      strapi.log.info('[SEED][STANDARD_PAGES] Home Page created');
    }

    // 8. Create About Page content blocks
    strapi.log.info('[SEED][STANDARD_PAGES] Creating About Page content...');

    // Create Contact Info for About Page
    let aboutContactInfo;
    const existingAboutContactInfo = await strapi.db
      .query(CONTACT_INFO_UID)
      .findOne({
        where: { title: 'Get in Touch' },
      });
    if (existingAboutContactInfo && existingAboutContactInfo.id) {
      aboutContactInfo = await strapi.entityService.update(
        CONTACT_INFO_UID,
        existingAboutContactInfo.id,
        {
          data: {
            title: 'Get in Touch',
            content:
              'Have questions or want to learn more? Contact us and discover how DJ Beat Blaster can help grow your DJ business.',
            detail: 'contact@djbeatblaster.com',
            iconName: 'mail',
            publishedAt: now(),
          },
        },
      );
    } else {
      aboutContactInfo = await strapi.entityService.create(CONTACT_INFO_UID, {
        data: {
          title: 'Get in Touch',
          content:
            'Have questions or want to learn more? Contact us and discover how DJ Beat Blaster can help grow your DJ business.',
          detail: 'contact@djbeatblaster.com',
          iconName: 'mail',
          publishedAt: now(),
        },
      });
    }

    // Create Contact Section for About Page
    let aboutContactSection;
    const existingAboutContact = await strapi.db
      .query(CONTACT_SECTION_UID)
      .findOne({
        where: { heading: 'About DJ Beat Blaster' },
      });
    if (existingAboutContact && existingAboutContact.id) {
      aboutContactSection = await strapi.entityService.update(
        CONTACT_SECTION_UID,
        existingAboutContact.id,
        {
          data: {
            heading: 'About DJ Beat Blaster',
            introText: 'Your Partner in DJ Business Success',
            description:
              'DJ Beat Blaster is a comprehensive platform designed by DJs, for DJs. We understand the unique challenges of running a DJ business and have created tools to help you manage contracts, events, equipment, and music libraries all in one place. Our mission is to empower DJs to focus on what they do best: creating unforgettable experiences for their clients.',
            contactInfo: ref(aboutContactInfo),
            publishedAt: now(),
          },
        },
      );
    } else {
      aboutContactSection = await strapi.entityService.create(
        CONTACT_SECTION_UID,
        {
          data: {
            heading: 'About DJ Beat Blaster',
            introText: 'Your Partner in DJ Business Success',
            description:
              'DJ Beat Blaster is a comprehensive platform designed by DJs, for DJs. We understand the unique challenges of running a DJ business and have created tools to help you manage contracts, events, equipment, and music libraries all in one place. Our mission is to empower DJs to focus on what they do best: creating unforgettable experiences for their clients.',
            contactInfo: ref(aboutContactInfo),
            publishedAt: now(),
          },
        },
      );
    }

    // Create About Template
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

    let aboutTemplate;
    const existingAboutTemplate = await strapi.db.query(TEMPLATE_UID).findOne({
      where: { Name: 'About Page Template' },
    });
    if (existingAboutTemplate && existingAboutTemplate.id) {
      aboutTemplate = await strapi.entityService.update(
        TEMPLATE_UID,
        existingAboutTemplate.id,
        {
          data: aboutTemplateData,
        },
      );
      strapi.log.info('[SEED][STANDARD_PAGES] About Template updated');
    } else {
      aboutTemplate = await strapi.entityService.create(TEMPLATE_UID, {
        data: aboutTemplateData,
      });
      strapi.log.info('[SEED][STANDARD_PAGES] About Template created');
    }

    // Create About Page
    strapi.log.info('[SEED][STANDARD_PAGES] Creating About Page...');
    const aboutPageData = {
      Title: 'About',
      Slug: '/about',
      Visible: true,
      Menu: 'Main',
      NavigationOrder: 2,
      NavigationAction: 'Link',
      configuration:
        configuration?.documentId || configuration?.id
          ? { connect: [configuration.documentId || configuration.id] }
          : undefined,
      template: aboutTemplate?.documentId
        ? { connect: [aboutTemplate.documentId] }
        : undefined,
      publishedAt: now(),
    };

    const existingAboutPage = await strapi.db.query(PAGE_UID).findOne({
      where: { Slug: '/about' },
    });
    if (existingAboutPage && existingAboutPage.id) {
      await strapi.entityService.update(PAGE_UID, existingAboutPage.id, {
        data: aboutPageData,
      });
      strapi.log.info('[SEED][STANDARD_PAGES] About Page updated');
    } else {
      await strapi.entityService.create(PAGE_UID, {
        data: aboutPageData,
      });
      strapi.log.info('[SEED][STANDARD_PAGES] About Page created');
    }

    // 9. Create User Profile Page
    strapi.log.info('[SEED][STANDARD_PAGES] Creating User Profile Page...');

    // Create Profile Template (empty - data will be fetched from IdentityAPI)
    const profileTemplateData = {
      Name: 'User Profile Page Template',
      TemplateType: 'Standard',
      Content: [],
      publishedAt: now(),
    };

    let profileTemplate;
    const existingProfileTemplate = await strapi.db
      .query(TEMPLATE_UID)
      .findOne({
        where: { Name: 'User Profile Page Template' },
      });
    if (existingProfileTemplate && existingProfileTemplate.id) {
      profileTemplate = await strapi.entityService.update(
        TEMPLATE_UID,
        existingProfileTemplate.id,
        {
          data: profileTemplateData,
        },
      );
      strapi.log.info('[SEED][STANDARD_PAGES] Profile Template updated');
    } else {
      profileTemplate = await strapi.entityService.create(TEMPLATE_UID, {
        data: profileTemplateData,
      });
      strapi.log.info('[SEED][STANDARD_PAGES] Profile Template created');
    }

    // Create Profile Page
    const profilePageData = {
      Title: 'Profile',
      Slug: '/profile',
      Visible: true,
      Menu: 'Main',
      NavigationOrder: 3,
      NavigationAction: 'Link',
      configuration:
        configuration?.documentId || configuration?.id
          ? { connect: [configuration.documentId || configuration.id] }
          : undefined,
      template: profileTemplate?.documentId
        ? { connect: [profileTemplate.documentId] }
        : undefined,
      publishedAt: now(),
    };

    const existingProfilePage = await strapi.db.query(PAGE_UID).findOne({
      where: { Slug: '/profile' },
    });
    if (existingProfilePage && existingProfilePage.id) {
      await strapi.entityService.update(PAGE_UID, existingProfilePage.id, {
        data: profilePageData,
      });
      strapi.log.info('[SEED][STANDARD_PAGES] Profile Page updated');
    } else {
      await strapi.entityService.create(PAGE_UID, {
        data: profilePageData,
      });
      strapi.log.info('[SEED][STANDARD_PAGES] Profile Page created');
    }

    strapi.log.info(
      '[SEED][STANDARD_PAGES] Successfully seeded all standard pages',
    );
  } catch (error: any) {
    strapi.log.error(
      `[SEED][STANDARD_PAGES] Error: ${error?.message ?? error}`,
    );
    if (error?.stack) {
      strapi.log.error(error.stack);
    }
    throw error;
  }
}
