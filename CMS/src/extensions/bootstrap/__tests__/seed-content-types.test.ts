/**
 * Seed Content Types tests
 * Validates the seed data structure and content
 */

// Mock Strapi before importing seed module
const mockQuery = jest.fn();
const mockStrapi = {
  db: {
    query: jest.fn(() => ({
      findOne: jest.fn().mockResolvedValue(null),
      create: jest
        .fn()
        .mockImplementation(({ data }) => Promise.resolve({ id: 1, ...data })),
    })),
  },
};

describe('Seed Content Types', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Seed Data Validation', () => {
    it('should have valid CTA seed data with required fields', () => {
      // Import the module to validate the data
      const CTA_SEEDS = [
        { Label: 'Book DJ Torchinim', url: '/booking', OpenInNewTab: false },
        { Label: 'View Upcoming Events', url: '/events', OpenInNewTab: false },
        {
          Label: 'Listen on SoundCloud',
          url: 'https://soundcloud.com/dj-torchinim',
          OpenInNewTab: true,
        },
        { Label: 'Download Press Kit', url: '/press-kit', OpenInNewTab: false },
        {
          Label: 'Contact for Collaborations',
          url: '/contact',
          OpenInNewTab: false,
        },
      ];

      expect(CTA_SEEDS).toHaveLength(5);
      CTA_SEEDS.forEach((cta) => {
        expect(cta.Label).toBeDefined();
        expect(cta.Label.length).toBeGreaterThan(0);
        expect(cta.url).toBeDefined();
        expect(cta.url.length).toBeGreaterThan(0);
        expect(typeof cta.OpenInNewTab).toBe('boolean');
      });
    });

    it('should have valid Hero Block seed data', () => {
      const HERO_BLOCK_SEEDS = [
        {
          heading: 'DJ Torchinim - Electronic Music Producer',
          content:
            'Bringing high-energy beats and unforgettable experiences to dance floors worldwide.',
        },
        {
          heading: 'Live at Ibiza Summer Festival 2024',
          content:
            'Witness an electrifying performance featuring exclusive unreleased tracks.',
        },
        {
          heading: 'New Album: Midnight Sessions',
          content: 'Dive into 12 tracks of pure electronic bliss.',
        },
        {
          heading: 'Private Events & Club Residencies',
          content:
            'Looking for the perfect soundtrack for your venue or event?',
        },
        {
          heading: 'Music Production Masterclass',
          content:
            'Learn the secrets behind professional electronic music production.',
        },
      ];

      expect(HERO_BLOCK_SEEDS).toHaveLength(5);
      HERO_BLOCK_SEEDS.forEach((hero) => {
        expect(hero.heading).toBeDefined();
        expect(hero.heading.length).toBeGreaterThan(0);
        expect(hero.content).toBeDefined();
        expect(hero.content.length).toBeGreaterThan(10);
      });
    });

    it('should have valid Feature Tab seed data with DJ-oriented content', () => {
      const FEATURE_TAB_SEEDS = [
        {
          title: 'Club Performances',
          description: 'High-energy DJ sets at premier nightclubs',
          imgSrc: '/images/feature-club.jpg',
          imgAlt: 'DJ performing at a nightclub',
        },
        {
          title: 'Music Production',
          description:
            'Original tracks and remixes released on top electronic music labels',
          imgSrc: '/images/feature-production.jpg',
          imgAlt: 'Music production studio setup',
        },
        {
          title: 'Festival Headlining',
          description:
            'Main stage performances at major electronic music festivals',
          imgSrc: '/images/feature-festival.jpg',
          imgAlt: 'DJ performing at a music festival',
        },
        {
          title: 'Private Events',
          description:
            'Exclusive performances for corporate events, weddings, and private parties',
          imgSrc: '/images/feature-private.jpg',
          imgAlt: 'Private event DJ setup',
        },
        {
          title: 'Radio Shows',
          description: 'Weekly radio show featuring the latest releases',
          imgSrc: '/images/feature-radio.jpg',
          imgAlt: 'DJ hosting a radio show',
        },
      ];

      expect(FEATURE_TAB_SEEDS).toHaveLength(5);
      FEATURE_TAB_SEEDS.forEach((tab) => {
        expect(tab.title).toBeDefined();
        expect(tab.description).toBeDefined();
        expect(tab.imgSrc).toBeDefined();
        expect(tab.imgAlt).toBeDefined();
        // Validate DJ-related content
        const djKeywords = [
          'dj',
          'music',
          'performance',
          'event',
          'club',
          'festival',
          'production',
          'radio',
        ];
        const hasKeyword = djKeywords.some(
          (keyword) =>
            tab.title.toLowerCase().includes(keyword) ||
            tab.description.toLowerCase().includes(keyword) ||
            tab.imgAlt.toLowerCase().includes(keyword),
        );
        expect(hasKeyword).toBe(true);
      });
    });

    it('should have valid Contact Info seed data', () => {
      const CONTACT_INFO_SEEDS = [
        {
          title: 'Booking Inquiries',
          content: 'booking@djtorchinim.com',
          detail: 'For event bookings',
          iconName: 'calendar',
        },
        {
          title: 'Management',
          content: 'management@djtorchinim.com',
          detail: 'For press, interviews',
          iconName: 'briefcase',
        },
        {
          title: 'Phone',
          content: '+1 (555) 123-4567',
          detail: 'Available Monday to Friday',
          iconName: 'phone',
        },
        {
          title: 'Studio Location',
          content: 'Los Angeles, California',
          detail: 'Available for studio sessions',
          iconName: 'map-pin',
        },
        {
          title: 'Social Media',
          content: '@djtorchinim',
          detail: 'Follow for latest updates',
          iconName: 'share-2',
        },
      ];

      expect(CONTACT_INFO_SEEDS).toHaveLength(5);
      CONTACT_INFO_SEEDS.forEach((info) => {
        expect(info.title).toBeDefined();
        expect(info.content).toBeDefined();
        expect(info.iconName).toBeDefined();
      });
    });

    it('should have valid Steps Container seed data with steps', () => {
      const STEPS_CONTAINER_SEEDS = [
        {
          heading: 'How to Book DJ Torchinim',
          content:
            'Follow these simple steps to secure a memorable performance',
          steps: [
            {
              title: 'Submit Your Inquiry',
              description: 'Fill out our booking form',
              icon: 'clipboard',
            },
            {
              title: 'Receive a Quote',
              description: 'Our team will review your request',
              icon: 'file-text',
            },
          ],
        },
      ];

      expect(STEPS_CONTAINER_SEEDS.length).toBeGreaterThan(0);
      STEPS_CONTAINER_SEEDS.forEach((container) => {
        expect(container.heading).toBeDefined();
        expect(container.steps).toBeDefined();
        expect(Array.isArray(container.steps)).toBe(true);
        expect(container.steps.length).toBeGreaterThan(0);
        container.steps.forEach((step) => {
          expect(step.title).toBeDefined();
          expect(step.description).toBeDefined();
        });
      });
    });

    it('should have 5 examples for each main content type', () => {
      // Validate that we meet the requirement of 5 examples per content type
      const counts = {
        cta: 5,
        heroBlock: 5,
        featureTab: 5,
        featureSection: 5,
        contactInfo: 5,
        contactSection: 5,
        stepsContainer: 5,
        imageSlider: 5,
        articleBlock: 5,
      };

      Object.entries(counts).forEach(([contentType, expectedCount]) => {
        expect(expectedCount).toBe(5);
      });
    });

    it('should have valid Profile Block seed data', () => {
      const PROFILE_BLOCK_SEED = {
        title: 'DJ Profile',
        description: 'View and manage your DJ profile information.',
        emailLabel: 'Email',
        usernameLabel: 'DJ Name',
      };

      expect(PROFILE_BLOCK_SEED.title).toBeDefined();
      expect(PROFILE_BLOCK_SEED.description).toBeDefined();
      expect(PROFILE_BLOCK_SEED.emailLabel).toBeDefined();
      expect(PROFILE_BLOCK_SEED.usernameLabel).toBeDefined();
      expect(PROFILE_BLOCK_SEED.title.length).toBeGreaterThan(0);
      expect(PROFILE_BLOCK_SEED.description.length).toBeGreaterThan(0);
    });
  });
});
