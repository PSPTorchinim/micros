// Seed image sliders with DJ-themed content
const IMAGE_SLIDER_UID = 'api::image-slider.image-slider';
const HERO_BLOCK_UID = 'api::hero-block.hero-block';
const CTA_UID = 'api::cta.cta';

export default async function seedImageSliders({ strapi }: { strapi: any }) {
  console.info('[SEED][IMAGE_SLIDERS] Seeding Image Sliders...');

  try {
    // Only seed if there are no image sliders in the database
    const count = await strapi.db.query(IMAGE_SLIDER_UID).count();
    if (count > 0) {
      console.info(
        '[SEED][IMAGE_SLIDERS] Skipping: image sliders already exist.',
      );
      return;
    }

    // Get existing hero block for slide reference
    const heroBlock = await strapi.db.query(HERO_BLOCK_UID).findOne({
      where: { heading: 'Welcome to DJ Beat Blaster' },
    });

    // Create CTAs for slides
    const ctaBooking = await strapi.entityService.create(CTA_UID, {
      data: {
        Label: 'Book Your Event',
        url: '/contact',
        OpenInNewTab: false,
        publishedAt: new Date().toISOString(),
      },
    });

    const ctaLearnMore = await strapi.entityService.create(CTA_UID, {
      data: {
        Label: 'Learn More',
        url: '/about',
        OpenInNewTab: false,
        publishedAt: new Date().toISOString(),
      },
    });

    const ctaViewPackages = await strapi.entityService.create(CTA_UID, {
      data: {
        Label: 'View Packages',
        url: '/services',
        OpenInNewTab: false,
        publishedAt: new Date().toISOString(),
      },
    });

    // Create hero blocks for additional slides
    const heroWedding = await strapi.entityService.create(HERO_BLOCK_UID, {
      data: {
        heading: 'Wedding DJ Services',
        content: 'Make Your Special Day Unforgettable',
        actions: [ctaBooking.id],
        publishedAt: new Date().toISOString(),
      },
    });

    const heroCorporate = await strapi.entityService.create(HERO_BLOCK_UID, {
      data: {
        heading: 'Corporate Event Entertainment',
        content: 'Professional DJ Services for Your Business Events',
        actions: [ctaLearnMore.id],
        publishedAt: new Date().toISOString(),
      },
    });

    const heroClub = await strapi.entityService.create(HERO_BLOCK_UID, {
      data: {
        heading: 'Club & Party DJ',
        content: 'Keep the Dance Floor Packed All Night Long',
        actions: [ctaViewPackages.id],
        publishedAt: new Date().toISOString(),
      },
    });

    // Create the image slider with hero block slides
    const slides = [];

    if (heroBlock) {
      slides.push({
        __component: 'hero-block-ref.hero-block-ref',
        hero_block: heroBlock.id,
      });
    }

    slides.push(
      {
        __component: 'hero-block-ref.hero-block-ref',
        hero_block: heroWedding.id,
      },
      {
        __component: 'hero-block-ref.hero-block-ref',
        hero_block: heroCorporate.id,
      },
      {
        __component: 'hero-block-ref.hero-block-ref',
        hero_block: heroClub.id,
      },
    );

    const imageSlider = await strapi.entityService.create(IMAGE_SLIDER_UID, {
      data: {
        Title: 'DJ Services Showcase',
        reversed: false,
        AutoPlay: true,
        IntervalMs: 5000,
        Slides: slides,
        publishedAt: new Date().toISOString(),
      },
    });

    console.info(
      `[SEED][IMAGE_SLIDERS] Created Image Slider: DJ Services Showcase (ID: ${imageSlider.id})`,
    );
  } catch (error: any) {
    console.error(
      `[SEED][IMAGE_SLIDERS] Failed to seed image sliders: ${error.message}`,
    );
    throw error;
  }
}
