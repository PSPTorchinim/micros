// Frontends/dj-panel/src/services/strapiPages.ts

import { Api, Page, Template } from '../models/strapi/strapiMap';

/**
 * Strapi API service with:
 *  - "shallow" typed calls (limited by your wrapper: fields/populate must be string, no publicationState)
 *  - "deep" calls using raw fetch + URLSearchParams to encode nested populate for Dynamic Zones
 *
 * Deep calls hydrate:
 *   template.Content (DZ) →
 *     - image-sliders.image-slider → Slides[] → CTA → Article
 *     - steps-containers.steps-container → Steps[] → CTA → Article
 *     - articles.article-block → Items[]
 *     - ctas.cta → Article
 * plus configuration, Parents, and subpages.
 */
class StrapiAPI {
  private api: Api<unknown>;
  private baseURL: string;

  constructor() {
    const protocol = process.env.REACT_APP_CMS_PROTOCOL || 'http';
    const host = process.env.REACT_APP_CMS_HOST || 'localhost';
    const port = process.env.REACT_APP_CMS_PORT || '1337';
    const apiPath = process.env.REACT_APP_CMS_API_PATH || '/api';
    this.baseURL = `${protocol}://${host}:${port}${apiPath}`;
    this.api = new Api({ baseURL: this.baseURL });
  }

  /**
   * Build deep populate querystring for Page → template → Content (Dynamic Zone).
   * This bypasses the typed wrapper restrictions (populate must be string) by using raw fetch.
   */
  private buildTemplateDeepPopulateQS(): string {
    const p = new URLSearchParams();

    // Only published content
    p.append('publicationState', 'live');

    // Populate Page relations commonly needed
    p.append('populate[configuration]', '*');
    p.append('populate[Parents]', '*');
    p.append('populate[subpages]', '*');

    // Template -> Content (DZ)
    p.append('populate[template][populate][Content][populate]', '*');

    // On each component inside the DZ:

    // 1) image-sliders.image-slider → Slides[] → CTA → Article
    p.append(
      'populate[template][populate][Content][on][image-sliders.image-slider][populate][Slides][populate][CTA][populate]',
      'Article',
    );

    // 2) steps-containers.steps-container → Steps[] → CTA → Article
    p.append(
      'populate[template][populate][Content][on][steps-containers.steps-container][populate][Steps][populate][CTA][populate]',
      'Article',
    );

    // 3) (optional) articles.article-block → Items (relation to api::article.article)
    p.append(
      'populate[template][populate][Content][on][articles.article-block][populate]',
      'Items',
    );

    // 4) (optional) standalone CTA component inside DZ
    p.append(
      'populate[template][populate][Content][on][ctas.cta][populate]',
      'Article',
    );

    return p.toString(); // already URL-encoded
  }

  // -------------------- Shallow (typed) methods --------------------

  /**
   * Root-level pages (no Parents). Uses typed wrapper; shallow populate only.
   */
  async fetchRootPages(): Promise<Page[]> {
    const response = await this.api.page.getPages({
      filters: {
        publishedAt: { $notNull: true },
        Parents: { id: { $null: true } },
      },
      // wrapper only accepts string here
      fields: 'Title,Slug,Visible,Menu,NavigationOrder,NavigationAction',
      // wrapper only accepts string here
      populate: 'template,configuration,Parents,subpages',
      // publicationState not supported by your wrapper types
    });
    return response.data?.data || [];
  }

  /**
   * Child pages of a given parent. Uses typed wrapper; shallow populate only.
   */
  async fetchPagesByParentId(parentId: number | string): Promise<Page[]> {
    const response = await this.api.page.getPages({
      filters: {
        Parents: { id: { $eq: parentId } },
        publishedAt: { $notNull: true },
      },
      fields: 'Title,Slug,Visible,Menu,NavigationOrder',
      populate: 'template',
    });
    return response.data?.data || [];
  }

  // -------------------- Deep (raw fetch) methods --------------------

  /**
   * Get a single page by ID with deep-populated template/content.
   */
  async fetchPageByIdDeep(id: number | string): Promise<Page | undefined> {
    const qs = new URLSearchParams();
    qs.append('filters[id][$eq]', String(id));
    // also ensure it's published when not using publicationState in wrapper
    // (we're using raw fetch here, so publicationState is already in the deep QS)
    const deep = this.buildTemplateDeepPopulateQS();
    const url = `${this.baseURL}/pages?${qs.toString()}&${deep}`;

    const res = await fetch(url);
    if (!res.ok)
      throw new Error(`Strapi fetchPageByIdDeep failed: ${res.status}`);
    const json = await res.json();
    return (json?.data?.[0] as Page) || undefined;
  }

  /**
   * Get a single page by Slug with deep-populated template/content.
   */
  async fetchPageBySlugDeep(slug: string): Promise<Page | undefined> {
    const qs = new URLSearchParams();
    qs.append('filters[Slug][$eq]', slug);
    const deep = this.buildTemplateDeepPopulateQS();
    const url = `${this.baseURL}/pages?${qs.toString()}&${deep}`;

    const res = await fetch(url);
    if (!res.ok)
      throw new Error(`Strapi fetchPageBySlugDeep failed: ${res.status}`);
    const json = await res.json();
    return (json?.data?.[0] as Page) || undefined;
  }

  /**
   * Get a single page by Title (legacy) with deep-populated template/content.
   */
  async fetchPageByName(name: string): Promise<Page | undefined> {
    const qs = new URLSearchParams();
    qs.append('filters[Title][$eq]', name);
    const deep = this.buildTemplateDeepPopulateQS();
    const url = `${this.baseURL}/pages?${qs.toString()}&${deep}`;

    const res = await fetch(url);
    if (!res.ok)
      throw new Error(`Strapi fetchPageByName failed: ${res.status}`);
    const json = await res.json();
    return (json?.data?.[0] as Page) || undefined;
  }

  /**
   * Convenience: use deep version by default when fetching by ID.
   */
  async fetchPageById(id: number | string): Promise<Page | undefined> {
    return this.fetchPageByIdDeep(id);
  }

  /**
   * Fetch Template by id with deep-populated Content DZ (used rarely; usually fetched via Page).
   */
  async fetchTemplateDeep(
    templateId: number | string,
  ): Promise<Template | undefined> {
    const qs = new URLSearchParams();
    qs.append('filters[id][$eq]', String(templateId));

    // Deep populate for Template endpoint (no page-level relations here)
    const p = new URLSearchParams();
    p.append('publicationState', 'live');
    p.append('populate[Content][populate]', '*');
    p.append(
      'populate[Content][on][image-sliders.image-slider][populate][Slides][populate][CTA][populate]',
      'Article',
    );
    p.append(
      'populate[Content][on][steps-containers.steps-container][populate][Steps][populate][CTA][populate]',
      'Article',
    );
    p.append(
      'populate[Content][on][articles.article-block][populate]',
      'Items',
    );
    p.append('populate[Content][on][ctas.cta][populate]', 'Article');

    const url = `${this.baseURL}/templates?${qs.toString()}&${p.toString()}`;
    const res = await fetch(url);
    if (!res.ok)
      throw new Error(`Strapi fetchTemplateDeep failed: ${res.status}`);
    const json = await res.json();
    return (json?.data?.[0] as Template) || undefined;
  }

  /**
   * Convenience: use deep version by default when fetching a Template.
   */
  async fetchTemplate(
    templateId: number | string,
  ): Promise<Template | undefined> {
    return this.fetchTemplateDeep(templateId);
  }
}

export const strapiAPI = new StrapiAPI();
