// Frontends/dj-panel/src/services/strapiPages.ts

import { Api, Page, Template } from '../models/strapi/strapiMap';

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

  // Build deep populate query for Page → Template → Content (DZ)
  private buildTemplateDeepPopulateQS(): string {
    const p = new URLSearchParams();

    p.append('publicationState', 'live');

    // Page relations (only if you need them)
    p.append('populate[configuration][populate]', 'pages');

    // Template -> Content (DZ)
    p.append('populate[template][populate][Content][populate]', '*');

    // image-sliders.image-slider → Slides
    p.append(
      'populate[template][populate][Content][on][image-sliders.image-slider][populate]',
      'Slides',
    );

    // steps-containers.steps-container → Steps
    p.append(
      'populate[template][populate][Content][on][steps-containers.steps-container][populate]',
      'Steps',
    );

    // optional blocks
    p.append(
      'populate[template][populate][Content][on][articles.article-block][populate]',
      'items',
    );
    p.append(
      'populate[template][populate][Content][on][ctas.cta][populate]',
      'article',
    );

    return p.toString();
  }

  // -------- Shallow (typed) methods: DO NOT USE comma-separated populate --------

  async fetchRootPages(): Promise<Page[]> {
    const response = await this.api.page.getPages({
      filters: {
        publishedAt: { $notNull: true },
        Parents: { id: { $null: true } },
      },
      // your wrapper only allows string; use fields string
      fields: 'Title,Slug,Visible,Menu,NavigationOrder,NavigationAction',
      // ❌ was: 'template,configuration,Parents,subpages'
      // No relations needed for nav listing; omit populate entirely.
      // populate: undefined,
    });
    return response.data?.data || [];
  }

  async fetchPagesByParentId(parentId: number | string): Promise<Page[]> {
    const response = await this.api.page.getPages({
      filters: {
        Parents: { id: { $eq: parentId } },
        publishedAt: { $notNull: true },
      },
      fields: 'Title,Slug,Visible,Menu,NavigationOrder',
      // ❌ was: 'template'
      // We don't need relations for listing; omit populate.
      // populate: undefined,
    });
    return response.data?.data || [];
  }

  // -------- Deep (raw fetch) methods (bypass typed wrapper) --------

  async fetchPageByIdDeep(id: number | string): Promise<Page | undefined> {
    const qs = new URLSearchParams();
    qs.append('filters[id][$eq]', String(id));
    const deep = this.buildTemplateDeepPopulateQS();
    const url = `${this.baseURL}/pages?${qs.toString()}&${deep}`;

    const res = await fetch(url);
    if (!res.ok)
      throw new Error(`Strapi fetchPageByIdDeep failed: ${res.status}`);
    const json = await res.json();
    return (json?.data?.[0] as Page) || undefined;
  }

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

  async fetchTemplateDeep(
    templateId: number | string,
  ): Promise<Template | undefined> {
    const qs = new URLSearchParams();
    qs.append('filters[id][$eq]', String(templateId));

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

  // Convenience proxies (use deep versions by default where appropriate)
  async fetchPageById(id: number | string): Promise<Page | undefined> {
    return this.fetchPageByIdDeep(id);
  }

  async fetchTemplate(
    templateId: number | string,
  ): Promise<Template | undefined> {
    return this.fetchTemplateDeep(templateId);
  }
}

export const strapiAPI = new StrapiAPI();
