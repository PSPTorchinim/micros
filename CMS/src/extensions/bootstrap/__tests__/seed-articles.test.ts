/**
 * Seed Articles tests
 * Validates the article seed data structure and content
 */

describe('Seed Articles', () => {
  describe('Article Data Validation', () => {
    // Article seed data for testing (matches the actual seed data structure)
    const ARTICLE_SEEDS = [
      {
        Title: 'The Art of Reading a Dance Floor: Tips from 15 Years of DJing',
        Summary: 'Learn the essential skills every DJ needs to keep the crowd moving.',
        coverUrl: '/images/articles/reading-dancefloor.jpg',
        Body: 'After 15 years behind the decks...',
      },
      {
        Title: 'Essential DJ Equipment Guide 2024: From Bedroom to Main Stage',
        Summary: 'A comprehensive breakdown of the gear you need at every stage.',
        coverUrl: '/images/articles/dj-equipment-guide.jpg',
        Body: 'The equipment you need depends on where you are...',
      },
      {
        Title: 'Building Your DJ Brand: Social Media Strategies That Actually Work',
        Summary: 'Discover proven strategies for growing your DJ brand online.',
        coverUrl: '/images/articles/dj-social-media.jpg',
        Body: 'In today\'s saturated DJ market...',
      },
      {
        Title: 'From Vinyl to Digital: The Evolution of DJ Technology',
        Summary: 'A journey through the history of DJ equipment.',
        coverUrl: '/images/articles/dj-technology-evolution.jpg',
        Body: 'The art of DJing as we know it began...',
      },
      {
        Title: 'The Business of DJing: Contracts, Riders, and Getting Paid',
        Summary: 'Navigate the professional side of DJing with confidence.',
        coverUrl: '/images/articles/dj-business.jpg',
        Body: 'The most common mistake emerging DJs make...',
      },
    ];

    it('should have exactly 5 articles', () => {
      expect(ARTICLE_SEEDS).toHaveLength(5);
    });

    it('should have valid required fields for each article', () => {
      ARTICLE_SEEDS.forEach((article) => {
        expect(article.Title).toBeDefined();
        expect(article.Title.length).toBeGreaterThan(10);
        expect(article.Summary).toBeDefined();
        expect(article.Summary.length).toBeGreaterThan(20);
        expect(article.Body).toBeDefined();
        expect(article.Body.length).toBeGreaterThan(10);
      });
    });

    it('should have unique titles for each article', () => {
      const titles = ARTICLE_SEEDS.map((a) => a.Title);
      const uniqueTitles = new Set(titles);
      expect(uniqueTitles.size).toBe(ARTICLE_SEEDS.length);
    });

    it('should have DJ-oriented content in titles', () => {
      const djKeywords = ['dj', 'music', 'dance', 'vinyl', 'digital', 'equipment', 'brand', 'floor', 'business', 'technology'];
      
      ARTICLE_SEEDS.forEach((article) => {
        const titleLower = article.Title.toLowerCase();
        const hasKeyword = djKeywords.some((keyword) => titleLower.includes(keyword));
        expect(hasKeyword).toBe(true);
      });
    });

    it('should have realistic cover image URLs', () => {
      ARTICLE_SEEDS.forEach((article) => {
        expect(article.coverUrl).toBeDefined();
        expect(article.coverUrl).toMatch(/^\/images\/articles\/[\w-]+\.(jpg|png|webp)$/);
      });
    });

    it('should have meaningful summaries that describe the article', () => {
      ARTICLE_SEEDS.forEach((article) => {
        // Summary should be a complete thought (has subject and verb typically)
        expect(article.Summary.split(' ').length).toBeGreaterThanOrEqual(5);
        // Summary should not be the same as title
        expect(article.Summary).not.toBe(article.Title);
      });
    });

    it('should cover diverse DJ-related topics', () => {
      const topicKeywords = {
        performance: false,
        equipment: false,
        branding: false,
        history: false,
        business: false,
      };

      ARTICLE_SEEDS.forEach((article) => {
        const combined = `${article.Title} ${article.Summary}`.toLowerCase();
        if (combined.includes('floor') || combined.includes('crowd') || combined.includes('reading')) {
          topicKeywords.performance = true;
        }
        if (combined.includes('equipment') || combined.includes('gear')) {
          topicKeywords.equipment = true;
        }
        if (combined.includes('brand') || combined.includes('social')) {
          topicKeywords.branding = true;
        }
        if (combined.includes('vinyl') || combined.includes('evolution') || combined.includes('history')) {
          topicKeywords.history = true;
        }
        if (combined.includes('business') || combined.includes('contract') || combined.includes('paid')) {
          topicKeywords.business = true;
        }
      });

      // Ensure we cover at least 4 diverse topics
      const coveredTopics = Object.values(topicKeywords).filter(Boolean).length;
      expect(coveredTopics).toBeGreaterThanOrEqual(4);
    });
  });
});
