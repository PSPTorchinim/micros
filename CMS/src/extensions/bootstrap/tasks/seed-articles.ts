/**
 * Seed Articles
 * Dependencies: Article Blocks
 */

import { SeederLogger, createAndPublish } from './utils/seeder-helpers';

type StrapiInstance = any;

export default async function seedArticles({ strapi }: { strapi: StrapiInstance }) {
  const logger = new SeederLogger('Articles');
  logger.info('Starting Article seeding...');

  try {
    // Get article blocks to link articles
    logger.debug('Fetching Article Blocks...');
    const latestTipsBlock = await strapi.db.query('api::article-block.article-block').findOne({
      where: { Title: 'Latest DJ Tips & Guides' },
    });
    const featuredBlock = await strapi.db.query('api::article-block.article-block').findOne({
      where: { Title: 'Featured Articles' },
    });

    if (!latestTipsBlock) {
      logger.warn('Article Blocks not found. Please seed Article Blocks first.');
      return [];
    }

    logger.debug(`Found Article Blocks: Latest Tips (${latestTipsBlock.id}), Featured (${featuredBlock?.id || 'none'})`);

    // Create articles with rich content
    const articleData = [
      {
        Title: 'Top 10 DJ Tips for Beginners',
        Summary: 'Essential advice for aspiring DJs looking to start their journey in the music industry.',
        coverUrl: '/images/articles/dj-tips-beginners.jpg',
        Body: `
# Top 10 DJ Tips for Beginners

Starting your DJ journey can be exciting and overwhelming. Here are our top tips to help you succeed:

## 1. Know Your Equipment
Understanding your DJ equipment inside and out is crucial. Spend time with your controller, mixer, and software.

## 2. Build a Diverse Music Library
Your music selection is your signature. Collect tracks across various genres and eras.

## 3. Practice Beatmatching
Master the fundamentals before relying on sync. Beatmatching by ear is a valuable skill.

## 4. Read the Crowd
The best DJs know how to gauge the energy of their audience and adjust accordingly.

## 5. Start Small
Begin with house parties and small venues to build confidence and experience.

## 6. Network with Other DJs
Connect with fellow DJs, share knowledge, and learn from their experiences.

## 7. Record Your Sets
Listen back to your mixes to identify areas for improvement.

## 8. Stay Organized
Keep your music library well-organized with proper tagging and playlists.

## 9. Develop Your Brand
Create a unique DJ persona and maintain consistency across your social media.

## 10. Never Stop Learning
The DJ industry evolves constantly. Stay updated with new techniques and technology.
        `,
        article_block: latestTipsBlock.id,
      },
      {
        Title: 'How to Build the Perfect DJ Setup',
        Summary: 'A comprehensive guide to selecting and setting up your DJ equipment for optimal performance.',
        coverUrl: '/images/articles/perfect-dj-setup.jpg',
        Body: `
# How to Build the Perfect DJ Setup

Creating an effective DJ setup requires careful consideration of your needs, budget, and goals.

## Essential Equipment

### DJ Controller or CDJs
Choose between an all-in-one controller or separate CDJ/mixer setup based on your style and venues.

### Headphones
Invest in quality DJ headphones with good isolation and accurate sound reproduction.

### Speakers/Monitors
Studio monitors for practice or PA speakers for performances - know what you need.

### Laptop
A reliable laptop with sufficient processing power to run your DJ software smoothly.

## Software Selection
Popular options include Serato DJ, rekordbox, Traktor, and Virtual DJ. Each has unique features.

## Cable Management
Keep your setup clean and professional with proper cable organization.

## Acoustic Treatment
If practicing at home, consider basic acoustic treatment for better sound quality.

## Backup Equipment
Always have backup cables, adapters, and even a backup controller for gigs.

## Conclusion
Building the perfect setup is a journey. Start with essentials and upgrade as you grow.
        `,
        article_block: latestTipsBlock.id,
      },
      {
        Title: 'Event Management for DJs: Best Practices',
        Summary: 'Learn how to professionally manage DJ gigs from booking to execution.',
        coverUrl: '/images/articles/event-management.jpg',
        Body: `
# Event Management for DJs: Best Practices

Professional event management separates hobbyist DJs from business-minded professionals.

## Pre-Event Planning

### Client Communication
Establish clear communication channels and set expectations early.

### Contracts and Agreements
Always use written contracts outlining services, payment terms, and cancellation policies.

### Music Preparation
Create custom playlists based on client preferences and event type.

### Equipment Checklist
Maintain a comprehensive checklist to ensure nothing is forgotten.

## Day of Event

### Arrive Early
Give yourself time for setup and sound check without rushing.

### Professional Appearance
Dress appropriately for the event and maintain professional demeanor.

### Technical Setup
Test all equipment thoroughly before guests arrive.

### Backup Plans
Have contingency plans for technical failures or unexpected situations.

## Post-Event

### Follow-Up
Thank clients and request testimonials or reviews.

### Invoice Promptly
Send invoices within 24-48 hours while the event is fresh in everyone's mind.

### Equipment Maintenance
Check and maintain equipment after each gig.

## Conclusion
Great event management leads to repeat bookings and referrals.
        `,
        article_block: latestTipsBlock.id,
      },
      {
        Title: 'Music Library Organization: A DJ\'s Guide',
        Summary: 'Master the art of organizing your digital music collection for quick access during performances.',
        coverUrl: '/images/articles/music-organization.jpg',
        Body: `
# Music Library Organization: A DJ's Guide

A well-organized music library is crucial for successful DJ performances.

## Folder Structure
Create a logical hierarchy: Genre > Subgenre > Artist > Album

## Tagging Best Practices
- Consistent BPM tagging
- Accurate genre classification
- Energy level ratings
- Custom cue points

## Playlist Organization
- Event-specific playlists
- Era/decade playlists
- Energy level playlists
- Client request playlists

## Backup Strategy
Implement a robust backup system with multiple redundancies.

## Regular Maintenance
Schedule time each week to organize new tracks and update existing ones.

## Software Recommendations
Use tools like rekordbox, Serato, or Music Bee for advanced organization.

## Conclusion
Invest time in organization now to save countless hours during performances.
        `,
        article_block: featuredBlock?.id || latestTipsBlock.id,
      },
      {
        Title: 'Marketing Your DJ Business Online',
        Summary: 'Effective strategies for building your DJ brand and attracting clients through digital marketing.',
        coverUrl: '/images/articles/dj-marketing.jpg',
        Body: `
# Marketing Your DJ Business Online

In today's digital age, online presence is essential for DJ business success.

## Social Media Strategy
- Instagram: Share performance clips and behind-the-scenes content
- Facebook: Create a business page and join local event groups
- TikTok: Showcase your skills with trending audio
- LinkedIn: Network with event planners and businesses

## Website Essentials
Your website should include:
- Professional bio
- Service offerings
- Client testimonials
- Contact information
- Sample mixes

## Content Marketing
Create valuable content:
- Blog posts about DJ topics
- Tutorial videos
- Mix series or podcasts
- Industry insights

## Email Marketing
Build an email list and send:
- Monthly newsletters
- Event announcements
- Special offers
- Industry tips

## SEO for DJs
Optimize your online presence for local searches:
- Google Business Profile
- Local directory listings
- Location-specific keywords

## Paid Advertising
Consider targeted ads on:
- Facebook/Instagram
- Google Ads
- Wedding planning platforms

## Analytics and Tracking
Monitor your marketing efforts to understand what works.

## Conclusion
Consistent online marketing efforts compound over time to build a strong DJ brand.
        `,
        article_block: featuredBlock?.id || latestTipsBlock.id,
      },
    ];

    const articles = [];
    for (const data of articleData) {
      try {
        const article = await createAndPublish(
          strapi,
          'api::article.article',
          'Title',
          data,
          logger,
          'Article'
        );
        articles.push(article);
      } catch (error: any) {
        logger.error(`Failed to create article "${data.Title}"`, error);
        // Continue with other articles
      }
    }

    logger.success(`Successfully seeded ${articles.length}/${articleData.length} Articles`);
    return articles;
  } catch (error) {
    logger.error('Failed to seed Articles', error);
    throw error;
  }
}
