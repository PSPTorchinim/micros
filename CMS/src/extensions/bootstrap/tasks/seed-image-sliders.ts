// Seed image sliders with DJ-themed content
const IMAGE_SLIDER_UID = 'api::image-slider.image-slider';
const HERO_BLOCK_UID = 'api::hero-block.hero-block';
const CTA_UID = 'api::cta.cta';

export default async function seedImageSliders({ strapi }: { strapi: any }) {
  strapi.log.info('[SEED][IMAGE_SLIDERS] Seeding Image Sliders...');

  try {
    // Only seed if there are no image sliders in the database
    const count = await strapi.db.query(IMAGE_SLIDER_UID).count();
    if (count > 0) {
      strapi.log.info('[SEED][IMAGE_SLIDERS] Skipping: image sliders already exist.');
      return;
    }

    // Get existing hero block for slide reference
    const heroBlock = await strapi.db.query(HERO_BLOCK_UID).findOne({
      where: { Heading: 'Welcome to DJ Beat Blaster' },
    });

    // Create CTAs for slides
    const ctaBooking = await strapi.entityService.create(CTA_UID, {
      data: {
        Text: 'Book Your Event',
        URL: '/contact',
        Variant: 'primary',
        publishedAt: new Date().toISOString(),
      },
    });

    const ctaLearnMore = await strapi.entityService.create(CTA_UID, {
      data: {
        Text: 'Learn More',
        URL: '/about',
        Variant: 'secondary',
        publishedAt: new Date().toISOString(),
      },
    });

    const ctaViewPackages = await strapi.entityService.create(CTA_UID, {
      data: {
        Text: 'View Packages',
        URL: '/services',
        Variant: 'primary',
        publishedAt: new Date().toISOString(),
      },
    });

    // Create hero blocks for additional slides
    const heroWedding = await strapi.entityService.create(HERO_BLOCK_UID, {
      data: {
        Heading: 'Wedding DJ Services',
        Subheading: 'Make Your Special Day Unforgettable',
        BackgroundUrl:
          'https://images.unsplash.com/photo-1519741497674-611481863552',
        cta: [ctaBooking.id],
        publishedAt: new Date().toISOString(),
      },
    });

    const heroCorporate = await strapi.entityService.create(HERO_BLOCK_UID, {
      data: {
        Heading: 'Corporate Event Entertainment',
        Subheading: 'Professional DJ Services for Your Business Events',
        BackgroundUrl:
          'https://images.unsplash.com/photo-1511578314322-379afb476865',
        cta: [ctaLearnMore.id],
        publishedAt: new Date().toISOString(),
      },
    });

    const heroClub = await strapi.entityService.create(HERO_BLOCK_UID, {
      data: {
        Heading: 'Club & Party DJ',
        Subheading: 'Keep the Dance Floor Packed All Night Long',
        BackgroundUrl:
          'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1',
        cta: [ctaViewPackages.id],
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

    strapi.log.info(
      `[SEED][IMAGE_SLIDERS] Created Image Slider: DJ Services Showcase (ID: ${imageSlider.id})`,
    );
  } catch (error: any) {
    strapi.log.error(
      `[SEED][IMAGE_SLIDERS] Failed to seed image sliders: ${error.message}`,
    );
    throw error;
  }
}
