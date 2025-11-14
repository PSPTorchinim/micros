// Seed articles about DJing

import { seedArticlesParentPage } from './seed-articles-parent-page';
import { toUrlSlug } from './utils/slugify';
const ARTICLE_UID = 'api::article.article';

interface Article {
  Title: string;
  Summary: string;
  coverUrl?: string;
  Body: string;
}

const DJING_ARTICLES: Article[] = [
  {
    Title: 'Essential DJ Equipment for Beginners',
    Summary:
      'A comprehensive guide to the essential equipment every beginner DJ needs to start their journey in the world of DJing.',
    coverUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89',
    Body: `# Essential DJ Equipment for Beginners

Starting your DJ journey can be overwhelming with all the equipment options available. This guide will help you understand the essential gear you need to get started.

## The Basics

Every DJ setup requires a few core components:

### 1. DJ Controller or Turntables
For beginners, a DJ controller is often the best choice. It combines a mixer and decks in one unit and connects directly to your laptop. Popular options include:
- Pioneer DDJ-400
- Numark Mixtrack Pro 3
- Roland DJ-202

### 2. Headphones
A good pair of DJ headphones is crucial. Look for:
- Closed-back design for noise isolation
- Rotating ear cups for one-ear monitoring
- Durable construction
- Good frequency response

Recommended models: Audio-Technica ATH-M50x, Sennheiser HD 25, V-MODA Crossfade M-100

### 3. Speakers/Monitors
Studio monitors or active speakers are essential for monitoring your mix. For home practice, 5-inch monitors are usually sufficient.

### 4. Laptop
A reliable laptop with:
- At least 8GB RAM (16GB recommended)
- SSD for faster performance
- Good processor (i5 or better)

### 5. DJ Software
Most controllers come with software like:
- Serato DJ Lite
- Rekordbox
- Virtual DJ
- Traktor

## Getting Started

Once you have your equipment:
1. Install your DJ software
2. Connect your controller
3. Organize your music library
4. Practice beatmatching
5. Learn EQ and filter techniques

## Budget Considerations

A complete beginner setup can range from $500 to $2000:
- Budget setup: $500-800
- Intermediate setup: $800-1500
- Professional setup: $1500+

Remember, you don't need everything at once. Start with the basics and upgrade as you progress.`,
  },
  {
    Title: 'Beatmatching Basics: Master the Fundamental Skill',
    Summary:
      'Learn the art of beatmatching, the cornerstone skill that every DJ must master to create seamless transitions between tracks.',
    coverUrl: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625',
    Body: `# Beatmatching Basics: Master the Fundamental Skill

Beatmatching is the fundamental skill that separates professional DJs from amateurs. It's the art of synchronizing the tempo of two tracks so they play in harmony.

## What is Beatmatching?

Beatmatching is the process of adjusting the playback speed of one track to match the tempo (BPM) of another track. This allows for smooth, seamless transitions between songs.

## Why is Beatmatching Important?

- Creates smooth transitions between tracks
- Maintains energy on the dance floor
- Enables creative mixing techniques
- Shows technical proficiency
- Essential for all DJ styles

## The Traditional Method

### Step 1: Identify the Beat
Listen to the first track playing and identify the kick drum (the steady "boom-boom-boom" sound).

### Step 2: Cue the Incoming Track
Using your headphones, find the first beat of your incoming track.

### Step 3: Match the Tempo
Adjust the pitch/tempo slider on the incoming track to roughly match the playing track's BPM.

### Step 4: Align the Beats
- Release the incoming track on the first beat
- Listen in your headphones
- If it's too fast, slow it down
- If it's too slow, speed it up

### Step 5: Make Fine Adjustments
Use the jog wheel to nudge the track forward or backward to keep the beats aligned.

## Using BPM Counters

Most modern DJ software shows BPM automatically:
1. Check the BPM of both tracks
2. Adjust the pitch slider to match
3. Fine-tune by ear

## Sync Button: Friend or Foe?

Modern controllers have a "sync" button that automatically beatmatches. While controversial, it's acceptable to use, especially when:
- You're starting out
- The music selection matters more
- You're focusing on other creative aspects

However, learning manual beatmatching is still valuable for:
- Technical understanding
- Equipment failure backup
- Creative control
- Professional credibility

## Practice Tips

1. **Start with the same BPM**: Practice with two tracks at the same tempo
2. **Use simple beats**: Begin with house or techno (consistent kick drums)
3. **Count beats**: Learn to count in 4s and 8s
4. **Practice daily**: 15-30 minutes of daily practice yields results
5. **Record yourself**: Listen back to identify mistakes

## Common Mistakes

- **Overthinking**: Trust your ears, not just your eyes
- **Rough adjustments**: Make small, gradual changes
- **Ignoring phrasing**: Match not just tempo but musical structure
- **Giving up too soon**: It takes time to develop muscle memory

## Next Steps

Once comfortable with beatmatching:
- Learn harmonic mixing
- Master EQ techniques
- Explore effects and filters
- Practice transitions
- Develop your own style

Remember: Beatmatching is a skill that improves with practice. Don't get discouraged if it feels difficult at first!`,
  },
  {
    Title: 'Creating the Perfect DJ Set: Song Selection and Flow',
    Summary:
      'Master the art of song selection and learn how to create a DJ set that keeps the dance floor moving all night long.',
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
    Body: `# Creating the Perfect DJ Set: Song Selection and Flow

A great DJ set is more than just playing good songs—it's about creating a journey that takes your audience on an emotional ride while keeping them dancing.

## Understanding Energy Levels

Every track has an energy level. Your job is to manage these levels throughout your set:

### Energy Curve
- **Opening** (Low-Medium): Build anticipation
- **Building** (Medium-High): Increase excitement
- **Peak** (High): Maximum energy
- **Breakdown** (Medium): Give dancers a breather
- **Closing** (Medium-High): End on a high note

## Song Selection Principles

### 1. Know Your Audience
- Age range
- Musical preferences
- Event type (wedding, club, festival)
- Time of day

### 2. Read the Room
Watch the dance floor:
- Are people dancing?
- What songs get the best response?
- When do people leave the floor?

Adjust your selection accordingly.

### 3. Musical Compatibility
Consider:
- **BPM range**: Stay within 10-15 BPM for smooth mixing
- **Key compatibility**: Use harmonic mixing (Camelot wheel)
- **Genre mixing**: Know when to blend and when to switch

### 4. Track Order Matters
- Don't play all your best tracks at once
- Save some bangers for later
- Create peaks and valleys

## Building a Set Structure

### Warm-Up Set (First Hour)
- Start subtle and groovy
- Gradually increase energy
- Build familiarity with crowd

### Main Set (Peak Hours)
- Higher energy tracks
- Crowd favorites
- Peak-time bangers
- Strategic breakdowns

### Closing Set (Final Hour)
- Maintain energy but prepare for ending
- Classic tracks for sing-alongs
- Memorable finish

## The Rule of Thirds

Divide your set into thirds:
1. **First Third**: Establish vibe, build rapport
2. **Second Third**: Peak energy, dance floor packed
3. **Final Third**: Memorable moments, strong finish

## Mixing Techniques for Flow

### 1. Seamless Transitions
- Blend tracks smoothly
- Use EQ to avoid frequency clashing
- Time your transitions with musical phrases

### 2. Quick Cuts
- For genre changes
- High-energy moments
- When tracks don't mix well

### 3. Extended Blends
- Keep both tracks playing together
- Build tension and release
- Create unique moments

## Preparing Your Set

### Option 1: Pre-Planned Sets
**Pros:**
- More polished
- Less stress
- Perfect for recordings

**Cons:**
- Less flexible
- Can't adapt to crowd
- Feels less spontaneous

### Option 2: Flexible Framework
**Pros:**
- Adapt to the crowd
- More authentic
- Responsive to energy

**Cons:**
- Requires more skill
- Can lose direction
- Needs extensive library knowledge

### Recommended Approach
- Plan the first 3-5 tracks
- Have go-to tracks for different scenarios
- Know your library inside out
- Stay flexible

## Creating Playlists

Organize your music into:
- **Openers**: Low-medium energy starters
- **Builders**: Gradually increase energy
- **Bangers**: Peak-time tracks
- **Classics**: Crowd pleasers
- **Closers**: Strong finishers

## Energy Management Tips

1. **Don't peak too early**: Save energy for the right moment
2. **Use breakdowns strategically**: Give dancers a breath
3. **Vary your sound**: Don't play the same style for too long
4. **Watch the clock**: Pace your energy to match the event timeline

## Common Mistakes

- Playing what you like vs. what the crowd wants
- Not preparing enough
- Ignoring the dance floor
- Poor pacing (too fast or too slow)
- Playing requests that break the flow

## Advanced Techniques

### 1. Harmonic Mixing
Match keys for musical compatibility:
- Learn the Camelot Wheel
- Use software key detection
- Train your ear

### 2. Phrase Matching
- Most tracks have 8, 16, or 32-beat phrases
- Match phrases for smoother transitions
- Create tension and release

### 3. Double Drops
- Two drops at the same time
- High-energy moments
- Requires practice and timing

## Final Tips

- **Record your sets**: Learn from your mistakes
- **Study other DJs**: See what works
- **Trust your instincts**: You know the music
- **Stay confident**: Energy is contagious
- **Have fun**: If you're enjoying it, they will too

Remember: The perfect set is different every time. What works for one crowd might not work for another. Stay flexible, read the room, and trust your musical intuition.`,
  },
  {
    Title: 'EQ Techniques Every DJ Should Master',
    Summary:
      'Unlock the power of EQ to create cleaner mixes, avoid frequency clashing, and add professional polish to your DJ sets.',
    coverUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04',
    Body: `# EQ Techniques Every DJ Should Master

Equalization (EQ) is one of the most powerful tools in a DJ's arsenal. Mastering EQ techniques will transform your mixes from amateur to professional.

## Understanding EQ Basics

### The Three-Band EQ
Most DJ mixers have a 3-band EQ for each channel:
- **High (Treble)**: 10kHz+ (cymbals, hi-hats, vocals)
- **Mid**: 200Hz-5kHz (vocals, snares, melodies)
- **Low (Bass)**: 20Hz-200Hz (kick drum, bass)

### Kill Switches
Many mixers have "kill switches" that completely remove a frequency band—useful for dramatic effects and transitions.

## Why EQ is Essential

1. **Prevent frequency clashing**: Two kick drums playing together can sound muddy
2. **Create space**: Make room for different elements
3. **Smooth transitions**: Blend tracks seamlessly
4. **Add dynamics**: Create interest and variation
5. **Fix problems**: Compensate for room acoustics or track quality

## Basic EQ Techniques

### 1. The Bass Swap
The most fundamental DJ EQ technique:

**Steps:**
1. Play Track A at normal EQ
2. Cue Track B with bass (low) reduced to zero
3. Bring Track B into the mix
4. Gradually decrease Track A's bass while increasing Track B's bass
5. Complete the transition

**Why it works:** Prevents muddy bass and maintains energy.

### 2. High-Pass Filter Intro
Build anticipation by filtering in a new track:

**Steps:**
1. Start with Track B's low and mid at zero
2. Bring in Track B with only highs
3. Gradually introduce mids
4. Finally, bring in the bass for impact

**Best for:** Building energy, creating anticipation

### 3. The Breakdown Technique
Create space during breakdowns:

**During breakdown:**
- Reduce mids to highlight vocals or melodies
- Boost highs for clarity
- Control bass levels

**When drop hits:**
- Bring everything back to full
- Maximum impact

## Advanced EQ Techniques

### 1. Frequency Complementing
Use EQ to make tracks work together:
- Cut mids in Track A, boost mids in Track B
- Cut highs in Track B, boost highs in Track A
- Both tracks play together but occupy different spaces

### 2. Creating Acapella Space
When mixing with vocals:
- Reduce mids in the instrumental track
- Creates space for vocals to shine
- Prevents vocal clash

### 3. Energy Control
Manage set energy with EQ:
- **Build energy**: Gradually boost highs and mids
- **Reduce energy**: Cut highs, focus on mids and bass
- **Peak moments**: Full frequency spectrum

### 4. Looping + EQ
Combine looping with EQ for creative effects:
1. Loop a section of Track A
2. Gradually filter out frequencies
3. Build tension
4. Drop Track B for release

## Genre-Specific EQ Tips

### House/Techno
- Focus on bass swap technique
- Keep bass clean and punchy
- Use high-pass filters for builds

### Hip-Hop/R&B
- Protect vocal frequencies (mids)
- Quick bass swaps between tracks
- Use EQ to create space for vocals

### Drum & Bass
- Careful with bass—tracks are bass-heavy
- Use high-pass filters extensively
- Quick EQ movements match the energy

### Open Format/Top 40
- More dramatic EQ movements acceptable
- Use EQ to create mashup opportunities
- Protect vocal frequencies

## Common EQ Mistakes

### 1. Over-EQing
- **Problem**: Removing too much leaves tracks thin
- **Solution**: Make subtle adjustments, trust the track's production

### 2. Forgetting to Reset
- **Problem**: Leaving EQ adjusted between tracks
- **Solution**: Develop a habit of resetting EQ after transitions

### 3. Ignoring Room Acoustics
- **Problem**: EQ sounds good in headphones but not in the room
- **Solution**: Listen to the room, adjust for the space

### 4. Cutting Mids Too Much
- **Problem**: Tracks sound hollow
- **Solution**: Mids carry melody and warmth—use carefully

### 5. Bass Clashing
- **Problem**: Two kick drums playing together
- **Solution**: Always use bass swap technique

## Practice Exercises

### Exercise 1: Bass Swap Drill
1. Pick two tracks with similar BPM
2. Practice swapping bass back and forth
3. Goal: Seamless bass transitions

### Exercise 2: Filter Mixing
1. Start Track B with all EQs at zero
2. Bring in highs first
3. Add mids, then bass
4. Reverse the process

### Exercise 3: Energy Building
1. Start with all EQs neutral
2. Gradually boost highs and mids over 16 bars
3. Drop everything back to full for impact

### Exercise 4: Acapella Creation
1. Find a track with vocals
2. Use EQ to isolate vocals as much as possible
3. Mix with an instrumental track

## EQ and Effects

Combine EQ with effects for creative results:
- **EQ + Filter**: Extreme filtering for builds
- **EQ + Echo**: Create space for echoes
- **EQ + Reverb**: Make room for reverb tails

## Tips for Better EQ Mixing

1. **Use your ears**: Don't just watch knobs, listen
2. **Make smooth movements**: Sudden EQ changes sound jarring
3. **Trust the track**: Well-produced tracks need minimal EQ
4. **Learn your mixer**: Every mixer's EQ curve is different
5. **Practice in context**: EQ sounds different in a club vs. bedroom
6. **Record and review**: Listen back to identify EQ mistakes
7. **Study professional DJs**: Watch how they use EQ

## EQ and Harmonic Mixing

When mixing in key:
- EQ becomes easier as tracks complement each other
- Can blend tracks longer
- Frequency clashing is reduced

## Developing Your EQ Style

Every DJ develops their own EQ style:
- Some prefer subtle adjustments
- Others use dramatic filtering
- Find what works for your genre and style

## Final Thoughts

EQ is a skill that improves with:
- **Practice**: Daily mixing sessions
- **Listening**: Study how frequencies interact
- **Experimentation**: Try different techniques
- **Patience**: It takes time to develop an ear for EQ

Master EQ, and you'll have one of the most powerful tools for professional-quality DJ sets.

## Quick Reference Guide

**Basic Transition:**
1. Beatmatch tracks
2. Reduce incoming track's bass
3. Bring in track with bass down
4. Swap bass between tracks
5. Complete transition

**Filter Build:**
1. Start with all EQ at zero
2. Introduce highs
3. Add mids
4. Drop bass for impact

**Energy Management:**
- More highs = more energy
- More mids = more warmth
- More bass = more power

Remember: EQ is about creating space, managing energy, and making tracks work together. Use it wisely!`,
  },
  {
    Title: 'Building Your Music Library: Organization and Discovery',
    Summary:
      'Learn how to organize, maintain, and expand your music library like a professional DJ to ensure you always have the right track at the right time.',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
    Body: `# Building Your Music Library: Organization and Discovery

A well-organized music library is the foundation of great DJing. Here's how to build, organize, and maintain a library that sets you apart.

## Why Library Organization Matters

- **Quick track access**: Find songs in seconds, not minutes
- **Better set flow**: Easily find complementary tracks
- **Professional appearance**: No awkward searching during sets
- **Confidence**: Know your library inside out
- **Creativity**: Discover new mixing opportunities

## Starting Your Library

### Quality Over Quantity
- **Don't**: Download 10,000 tracks you've never heard
- **Do**: Curate a collection of tracks you know and love

### Minimum Library Size by DJ Type
- **Beginner/Hobbyist**: 500-1000 tracks
- **Regular Club DJ**: 2000-5000 tracks
- **Open Format DJ**: 5000-10,000+ tracks
- **Specialist DJ**: 1000-3000 tracks (deep knowledge)

### Where to Get Music

#### Legal Sources
1. **Beatport**: Electronic dance music
2. **Traxsource**: House and techno
3. **Juno Download**: All electronic genres
4. **Bleep**: Independent electronic labels
5. **Bandcamp**: Independent artists
6. **iTunes/Amazon**: Commercial music
7. **DJ record pools**: Multiple genres, licensed

#### Subscription Services
- **DJcity**: Large catalog, top 40 and more
- **BPM Supreme**: Hip-hop, EDM, Latin
- **Beatsource**: Open format, streaming integration
- **SoundCloud Go+**: Indie and emerging artists

## File Format and Quality

### Recommended Formats
- **FLAC**: Lossless, highest quality
- **WAV/AIFF**: Lossless, widely compatible
- **MP3 320kbps**: Lossy but acceptable for most situations

### Avoid
- MP3s under 256kbps
- YouTube rips
- Poorly tagged files
- Heavily compressed files

## Organization Systems

### Folder Structure Method

#### By Genre
\`\`\`
Music Library/
├── House/
│   ├── Deep House/
│   ├── Tech House/
│   └── Progressive House/
├── Hip-Hop/
│   ├── Old School/
│   ├── Modern/
│   └── Trap/
├── Top 40/
└── Classics/
\`\`\`

#### By Energy Level
\`\`\`
Music Library/
├── Warm-Up (90-110 BPM)/
├── Building (110-125 BPM)/
├── Peak Time (125-130 BPM)/
└── High Energy (130+ BPM)/
\`\`\`

#### By Event Type
\`\`\`
Music Library/
├── Wedding Sets/
├── Corporate Events/
├── Club Nights/
└── Private Parties/
\`\`\`

### Playlist Organization

#### Smart Playlists by BPM
- 90-100 BPM
- 100-110 BPM
- 110-120 BPM
- 120-128 BPM
- 128-135 BPM
- 135+ BPM

#### Smart Playlists by Key
- C Major/A Minor
- G Major/E Minor
- D Major/B Minor
- (Continue through all keys)

#### Crate System
- **New Music**: Last 30 days
- **Testing**: Tracks to try out
- **Bangers**: Proven crowd pleasers
- **Go-To**: Your most reliable tracks
- **Openers**: Set starters
- **Closers**: Set finishers

## Metadata Management

### Essential ID3 Tags
- **Title**: Accurate song name
- **Artist**: Correct artist name
- **Genre**: Consistent genre classification
- **BPM**: Analyzed and accurate
- **Key**: Musical key (Camelot notation recommended)
- **Year**: Release year
- **Comments**: Personal notes (energy level, vocal/instrumental, etc.)

### Tagging Best Practices
1. **Be consistent**: Choose a naming convention and stick to it
2. **Use proper capitalization**: "Song Title" not "SONG TITLE"
3. **Remove featuring artists from title**: Put in artist field
4. **Include version info**: (Original Mix), (Extended Mix), (Radio Edit)
5. **Add custom tags**: Energy, crowd reaction, best time to play

### Tools for Tagging
- **Mp3tag** (Windows/Mac): Batch editing
- **Kid3** (Cross-platform): Advanced tagging
- **MusicBrainz Picard**: Automatic tagging
- **Your DJ software**: Built-in tagging

## Music Discovery

### Finding New Music

#### 1. Follow Charts
- Beatport Top 100
- Traxsource Top 100
- Spotify viral charts
- SoundCloud trending

#### 2. Follow DJs
- SoundCloud profiles
- Mixcloud sets
- Podcast episodes
- Radio shows

#### 3. Follow Labels
- Subscribe to label newsletters
- Follow on SoundCloud
- Check new releases weekly

#### 4. Use Music Discovery Tools
- **Spotify Discover Weekly**: Algorithm-based recommendations
- **SoundCloud Related Tracks**: Similar music
- **1001tracklists**: See what DJs are playing
- **WhoSampled**: Find samples and connections

#### 5. Shazam the World
- Shazam tracks you hear out
- Save to playlists
- Purchase later

### Testing New Music

#### The Testing Process
1. **First listen**: Full track listen, take notes
2. **BPM/Key analysis**: Verify and tag
3. **Prepare cue points**: Mark intro, outro, breakdown, drop
4. **Test mix at home**: Try with similar tracks
5. **Live test**: Play in low-pressure situations
6. **Evaluate**: Did it work? Keep or archive?

#### Rating System
- 5 stars: Absolute banger, play regularly
- 4 stars: Great track, solid choice
- 3 stars: Good for specific situations
- 2 stars: Needs more testing
- 1 star: Archive or delete

## Library Maintenance

### Weekly Tasks
- Import and tag new music
- Test new tracks
- Remove duplicates
- Back up library

### Monthly Tasks
- Review and update playlists
- Archive old/unused tracks
- Update BPM/key analysis
- Reorganize folders as needed

### Quarterly Tasks
- Deep clean duplicates and errors
- Update DJ software
- Review and update genres
- Audit and remove poor-quality files

## Backup Strategy

### The 3-2-1 Rule
- **3 copies** of your library
- **2 different media types** (external drive + cloud)
- **1 off-site backup** (cloud storage)

### Recommended Backup Solutions
- **External SSD**: Fast, portable, reliable
- **Cloud storage**: Dropbox, Google Drive, OneDrive
- **NAS**: Network attached storage for local backup
- **Secondary laptop**: Complete system backup

### What to Back Up
- Music files
- DJ software settings and cue points
- Playlists and crates
- Library database
- Custom mappings and settings

## Advanced Organization

### Using Colors/Flags
Code tracks by:
- Energy level (red = high, blue = low)
- Crowd reaction (green = always works)
- Mix points (yellow = tricky transition)
- Mood (purple = emotional)

### Custom Fields
Add custom tags for:
- Explicit lyrics (yes/no)
- Intro length (8, 16, 32 beats)
- Outro type (beat, silence, vocal)
- Breakdown position (minute mark)
- Original vs. remix
- Stem availability

### Preparation Levels
- **Level 1**: Tagged with BPM/key
- **Level 2**: Cue points set
- **Level 3**: Tested in mix
- **Level 4**: Performed live
- **Level 5**: Crowd-tested and approved

## Integration with DJ Software

### Rekordbox
- Use Collection mode for organization
- Create smart playlists
- Use color coding
- Set memory cues
- Use My Tags

### Serato
- Use Crates for organization
- Smart Crates for automatic organization
- Use color coding
- Set cue points and loops
- Use tags and comments

### Traktor
- Use playlists and smart playlists
- Collection organization
- Use color coding
- Set cue points
- Use comments field

### Engine DJ
- Use crates and smart crates
- Engine Lighting for color coding
- Set hot cues
- Use My Tags

## Common Organization Mistakes

1. **No system**: Random organization leads to chaos
2. **Too many folders**: Can't find anything
3. **Poor naming**: Inconsistent file names
4. **No backups**: Disaster waiting to happen
5. **Not testing new music**: Playing unfamiliar tracks live
6. **Never cleaning**: Library becomes cluttered
7. **Incomplete metadata**: Missing BPM, key, or genre info

## Building Genre Knowledge

### Deep Dive into Genres
- Study subgenres and their characteristics
- Learn the history and evolution
- Identify key artists and labels
- Understand BPM ranges
- Know mixing conventions

### Genre Mixing
- Learn which genres mix well
- Understand tempo relationships
- Study successful genre-blending DJs
- Practice transitioning between styles

## Final Tips

1. **Start small, grow gradually**: Quality over quantity
2. **Listen actively**: Know every track in your library
3. **Update regularly**: Fresh music keeps sets interesting
4. **Backup religiously**: Protect your investment
5. **Tag meticulously**: Future you will thank you
6. **Test everything**: Don't surprise yourself during a gig
7. **Review and refine**: Continuously improve your system
8. **Share knowledge**: Learn from other DJs' organizations

## Your Library is Your Identity

Your music library reflects:
- Your taste and style
- Your knowledge and experience
- Your professionalism
- Your ability to read crowds
- Your creative potential

Invest time in building and maintaining it, and it will serve you throughout your DJ career.

Remember: A great DJ knows their library inside and out. Organization isn't just about finding tracks—it's about understanding your music deeply enough to create magical moments on the dance floor.`,
  },
];

export default async function seedArticles({ strapi }: { strapi: any }) {
  strapi.log.info('[SEED][ARTICLES] Starting article seeding...');

  try {
    // Get the default locale
    const defaultLocale = 'en';
    const PAGE_UID = 'api::page.page';
    const TEMPLATE_UID = 'api::template.template';

    // Seed the parent Articles page
    const { getOrCreateConfiguration } = await import('./seed-configuration');
    const configId = await getOrCreateConfiguration(strapi);
    const parentPageId = await seedArticlesParentPage(strapi, configId);

    // Track created page IDs to add as subpages at the end
    const createdPageIds: number[] = [];

    for (const articleData of DJING_ARTICLES) {
      try {
        strapi.log.info(
          `[SEED][ARTICLES] Processing article: "${articleData.Title}"`,
        );

      // Check if article already exists
      const existingArticle = await strapi.db.query(ARTICLE_UID).findOne({
        where: { Title: articleData.Title },
      });

      let article;
      if (existingArticle) {
        strapi.log.info(
          `[SEED][ARTICLES] Article "${articleData.Title}" already exists (ID: ${existingArticle.id})`,
        );
        article = existingArticle;
      } else {
        // Create article using entityService
        const createData = {
          Title: articleData.Title,
          Summary: articleData.Summary,
          coverUrl: articleData.coverUrl,
          Body: articleData.Body,
          locale: defaultLocale,
          publishedAt: new Date().toISOString(),
        };
        strapi.log.debug(
          `[SEED][ARTICLES] Creating article with data: ${JSON.stringify({
            Title: createData.Title,
            Summary: createData.Summary?.substring(0, 50) + '...',
            coverUrl: createData.coverUrl,
            BodyLength: createData.Body?.length,
            locale: createData.locale,
          })}`,
        );

        article = await strapi.entityService.create(ARTICLE_UID, {
          data: createData,
        });

        strapi.log.info(`[SEED][ARTICLES] Article created (ID: ${article.id})`);
      }

      // Create or find template for this article
      const templateName = `Article: ${article.Title}`;
      let template = await strapi.db.query(TEMPLATE_UID).findOne({
        where: { Name: templateName },
      });

      if (!template) {
        template = await strapi.entityService.create(TEMPLATE_UID, {
          data: {
            Name: templateName,
            TemplateType: 'Standard',
            Content: [],
            publishedAt: new Date().toISOString(),
          },
        });
        strapi.log.info(
          `[SEED][ARTICLES] Created template for article ${article.Title} (ID: ${template.id})`,
        );
      } else {
        strapi.log.info(
          `[SEED][ARTICLES] Template for article ${article.Title} already exists (ID: ${template.id})`,
        );
      }

      // Create or update page for this article
      const slug = toUrlSlug(article.Title);
      let page = await strapi.db.query(PAGE_UID).findOne({
        where: { Title: article.Title },
      });

      if (!page) {
        // Create new page
        page = await strapi.entityService.create(PAGE_UID, {
          data: {
            Title: article.Title,
            Slug: slug,
            Visible: true,
            configuration: configId,
            template: template.id,
            publishedAt: new Date().toISOString(),
          },
        });
        strapi.log.info(
          `[SEED][ARTICLES] Created page for article ${article.Title} (ID: ${page.id}, Slug: /${slug})`,
        );
      } else {
        // Update existing page with correct slug and template
        await strapi.entityService.update(PAGE_UID, page.id, {
          data: {
            Slug: slug,
            configuration: configId,
            template: template.id,
          },
        });
        strapi.log.info(
          `[SEED][ARTICLES] Updated page for article ${article.Title} (ID: ${page.id}, Slug: /${slug})`,
        );
      }

      // Track page ID for later subpage assignment
      createdPageIds.push(page.id);
      
      } catch (articleError: any) {
        strapi.log.error(
          `[SEED][ARTICLES] Failed to process article "${articleData.Title}": ${articleError.message}`,
        );
        strapi.log.error(`[SEED][ARTICLES] Error stack: ${articleError.stack}`);
        // Continue with next article instead of failing completely
      }
    }

    // Update parent page with all article pages as subpages
    try {
      const parentPage = await strapi.entityService.findOne(
        PAGE_UID,
        parentPageId,
        {
          populate: ['subpages'],
        },
      );
      const existingSubpageIds = (parentPage.subpages || []).map(
        (sp: any) => sp.id,
      );

      // Add all created pages that aren't already subpages
      const newSubpageIds = createdPageIds.filter(
        (id) => !existingSubpageIds.includes(id),
      );

      if (newSubpageIds.length > 0) {
        const updatedSubpages = [...existingSubpageIds, ...newSubpageIds];
        await strapi.entityService.update(PAGE_UID, parentPageId, {
          data: {
            subpages: updatedSubpages,
          },
        });
        strapi.log.info(
          `[SEED][ARTICLES] Added ${newSubpageIds.length} article page(s) as subpages of parent Articles page`,
        );
      } else {
        strapi.log.info(
          `[SEED][ARTICLES] All article pages already subpages of parent Articles page`,
        );
      }
    } catch (subpageError: any) {
      strapi.log.error(
        `[SEED][ARTICLES] Failed to update parent page subpages: ${subpageError.message}`,
      );
    }

    strapi.log.info(
      `[SEED][ARTICLES] Article seeding complete! Processed ${DJING_ARTICLES.length} articles, created ${createdPageIds.length} pages.`,
    );
  } catch (error: any) {
    strapi.log.error(
      `[SEED][ARTICLES] Failed to seed articles: ${error.message}`,
    );
    strapi.log.error(`[SEED][ARTICLES] Error stack: ${error.stack}`);
    throw error;
  }
}
