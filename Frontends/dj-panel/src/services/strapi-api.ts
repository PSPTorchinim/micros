import { Api } from '../models/strapi/strapiMap';
import type { Page } from '../models/strapi/strapiMap';

type StrapiFilters = Record<string, unknown>;

// --- populate config dla Template.Content (dynamic zone) ---
// Zapewnia, że w każdym ref-komponencie pojawi się pole relacyjne z documentId.
const TEMPLATE_CONTENT_POPULATE = {
  Content: {
    on: {
      'article-block-ref.article-block-ref': {
        populate: { block: { fields: ['documentId'] } },
      },
      'hero-block-ref.hero-block-ref': {
        populate: { hero_block: { fields: ['documentId'] } },
      },
      'image-slider-ref.image-slider-ref': {
        populate: { slider: { fields: ['documentId'] } },
      },
      'steps-container-ref.steps-container-ref': {
        populate: { container: { fields: ['documentId'] } },
      },
      'cta-ref.cta-ref': {
        populate: { cta: { fields: ['documentId'] } },
      },
      'feature-section-ref.feature-section-ref': {
        populate: { feature_section: { fields: ['documentId'] } },
      },
      'contact-section-ref.contact-section-ref': {
        populate: { contact_section: { fields: ['documentId'] } },
      },
      'feature-tab-ref.feature-tab-ref': {
        populate: { feature_tab: { fields: ['documentId'] } },
      },
      'contact-info-ref.contact-info-ref': {
        populate: { contact_info: { fields: ['documentId'] } },
      },
    },
  },
  // przy okazji możesz mieć page z podstawowymi polami
  page: {
    fields: [
      'documentId',
      'Title',
      'Slug',
      'Menu',
      'AuthState',
      'NavigationOrder',
      'NavigationAction',
    ],
  },
} as const;

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

  // --------------------------------------
  // PAGES
  // --------------------------------------

  // Root pages (bez parenta)
  async getRootPages(): Promise<Page[] | undefined> {
    try {
      const response = await this.api.page.getPages({
        filters: {
          Parents: { id: { $null: true } },
        } as StrapiFilters,
      });
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching root pages:`, error);
      return [];
    }
  }

  async getPagesByParentId(parentId: number): Promise<Page[]> {
    try {
      const response = await this.api.page.getPages({
        filters: {
          Parents: { id: { $eq: parentId } },
        } as StrapiFilters,
      });
      // zależnie od generatora może być response.data.data
      return (
        (response as any).data?.data ?? (response.data as unknown as Page[])
      );
    } catch (error) {
      console.error(`Error fetching pages by parent ID ${parentId}:`, error);
      return [];
    }
  }

  async fetchPageById(pageDocumentId: string): Promise<Page | null> {
    try {
      const response = await this.api.page.getPages({
        filters: { documentId: { $eq: pageDocumentId } } as StrapiFilters,
        populate: '*',
      });
      return response?.data?.data?.[0] || null;
    } catch (error) {
      console.error(`Error fetching page by ID ${pageDocumentId}:`, error);
      return null;
    }
  }

  // --------------------------------------
  // TEMPLATES
  // --------------------------------------

  // DEPRECATED alias – zostawiamy dla zgodności, ale dorzucamy właściwy populate.on
  async getTemplateById(templateDocumentId: string) {
    try {
      const response = await this.api.template.getTemplates({
        filters: { documentId: { $eq: templateDocumentId } } as StrapiFilters,
        populate: TEMPLATE_CONTENT_POPULATE as any,
      });
      return response?.data?.data?.[0] || null;
    } catch (error) {
      console.error(
        `Error fetching template by ID ${templateDocumentId}:`,
        error,
      );
      return null;
    }
  }

  // Rekomendowana nazwa – to samo, z populate.on
  async getTemplateByDocumentId(documentId: string) {
    try {
      const response = await this.api.template.getTemplates({
        filters: { documentId: { $eq: documentId } } as StrapiFilters,
        populate: TEMPLATE_CONTENT_POPULATE as any,
      });
      return response?.data?.data?.[0] || null;
    } catch (e) {
      console.error(`Error fetching template by documentId ${documentId}:`, e);
      return null;
    }
  }

  // --------------------------------------
  // BLOKI – BY NUMERIC ID (/:id)
  // --------------------------------------

  async getFeatureTabBlockById(id: number) {
    try {
      const response = await this.api.featureTab.getFeatureTabsId(id);
      return response?.data?.data || null;
    } catch (error) {
      console.error(`Error fetching feature tab block by ID ${id}:`, error);
      return null;
    }
  }

  async getContactInfoBlockById(id: number) {
    try {
      const response = await this.api.contactInfo.getContactInfosId(id);
      return response?.data?.data || null;
    } catch (error) {
      console.error(`Error fetching contact info block by ID ${id}:`, error);
      return null;
    }
  }

  async getHeroBlockById(id: number) {
    try {
      const response = await this.api.heroBlock.getHeroBlocksId(id);
      return response?.data?.data || null;
    } catch (error) {
      console.error(`Error fetching hero block by ID ${id}:`, error);
      return null;
    }
  }

  async getFeatureSectionById(id: number) {
    try {
      const response = await this.api.featureSection.getFeatureSectionsId(id);
      return response?.data?.data || null;
    } catch (error) {
      console.error(`Error fetching feature section by ID ${id}:`, error);
      return null;
    }
  }

  async getContactSectionById(id: number) {
    try {
      const response = await this.api.contactSection.getContactSectionsId(id);
      return response?.data?.data || null;
    } catch (error) {
      console.error(`Error fetching contact section by ID ${id}:`, error);
      return null;
    }
  }

  async getImageSliderBlockById(id: number) {
    try {
      const response = await this.api.imageSlider.getImageSlidersId(id);
      return response?.data?.data || null;
    } catch (error) {
      console.error(`Error fetching image slider block by ID ${id}:`, error);
      return null;
    }
  }

  async getArticleBlockById(id: number) {
    try {
      const response = await this.api.articleBlock.getArticleBlocksId(id);
      return response?.data?.data || null;
    } catch (error) {
      console.error(`Error fetching article block by ID ${id}:`, error);
      return null;
    }
  }

  async getStepsContainerBlockById(id: number) {
    try {
      const response = await this.api.stepsContainer.getStepsContainersId(id);
      return response?.data?.data || null;
    } catch (error) {
      console.error(`Error fetching steps container block by ID ${id}:`, error);
      return null;
    }
  }

  async getCTABlockById(id: number) {
    try {
      const response = await this.api.cta.getCtasId(id);
      return response?.data?.data || null;
    } catch (error) {
      console.error(`Error fetching CTA block by ID ${id}:`, error);
      return null;
    }
  }

  // --------------------------------------
  // BLOKI – BY documentId (string)
  // --------------------------------------

  async getArticleBlockByDocumentId(id: string) {
    try {
      const res = await this.api.articleBlock.getArticleBlocks({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res?.data?.data?.[0] || null;
    } catch (e) {
      console.error(`Error fetching article-block by documentId ${id}:`, e);
      return null;
    }
  }

  async getHeroBlockByDocumentId(id: string) {
    try {
      const res = await this.api.heroBlock.getHeroBlocks({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res?.data?.data?.[0] || null;
    } catch (e) {
      console.error(`Error fetching hero-block by documentId ${id}:`, e);
      return null;
    }
  }

  async getImageSliderBlockByDocumentId(id: string) {
    try {
      const res = await this.api.imageSlider.getImageSliders({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res?.data?.data?.[0] || null;
    } catch (e) {
      console.error(`Error fetching image-slider by documentId ${id}:`, e);
      return null;
    }
  }

  async getStepsContainerBlockByDocumentId(id: string) {
    try {
      const res = await this.api.stepsContainer.getStepsContainers({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res?.data?.data?.[0] || null;
    } catch (e) {
      console.error(`Error fetching steps-container by documentId ${id}:`, e);
      return null;
    }
  }

  async getCTABlockByDocumentId(id: string) {
    try {
      const res = await this.api.cta.getCtas({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res?.data?.data?.[0] || null;
    } catch (e) {
      console.error(`Error fetching cta by documentId ${id}:`, e);
      return null;
    }
  }

  async getFeatureSectionByDocumentId(id: string) {
    try {
      const res = await this.api.featureSection.getFeatureSections({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res?.data?.data?.[0] || null;
    } catch (e) {
      console.error(`Error fetching feature-section by documentId ${id}:`, e);
      return null;
    }
  }

  async getContactSectionByDocumentId(id: string) {
    try {
      const res = await this.api.contactSection.getContactSections({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res?.data?.data?.[0] || null;
    } catch (e) {
      console.error(`Error fetching contact-section by documentId ${id}:`, e);
      return null;
    }
  }

  async getFeatureTabBlockByDocumentId(id: string) {
    try {
      const res = await this.api.featureTab.getFeatureTabs({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res?.data?.data?.[0] || null;
    } catch (e) {
      console.error(`Error fetching feature-tab by documentId ${id}:`, e);
      return null;
    }
  }

  async getContactInfoBlockByDocumentId(id: string) {
    try {
      const res = await this.api.contactInfo.getContactInfos({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res?.data?.data?.[0] || null;
    } catch (e) {
      console.error(`Error fetching contact-info by documentId ${id}:`, e);
      return null;
    }
  }

  async getLoginBlockByDocumentId(id: string) {
    try {
      const res = await this.api.loginBlock.getLoginBlock({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res?.data?.data || null;
    } catch (e) {
      console.error(`Error fetching login-block by documentId ${id}:`, e);
      return null;
    }
  }

  async getForgotPasswordBlockByDocumentId(id: string) {
    try {
      const res = await this.api.forgotPasswordBlock.getForgotPasswordBlock({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res?.data?.data || null;
    } catch (e) {
      console.error(
        `Error fetching forgot-password-block by documentId ${id}:`,
        e,
      );
      return null;
    }
  }

  // Singleton methods for Login and ForgotPassword blocks
  async getLoginBlockSingleton() {
    try {
      const res = await this.api.loginBlock.getLoginBlock();
      return res?.data || null;
    } catch (e) {
      console.error('Error fetching login-block singleton:', e);
      return null;
    }
  }

  async getForgotPasswordBlockSingleton() {
    try {
      const res = await this.api.forgotPasswordBlock.getForgotPasswordBlock();
      return res?.data || null;
    } catch (e) {
      console.error('Error fetching forgot-password-block singleton:', e);
      return null;
    }
  }

  async getFooterSingleton() {
    try {
      const res = await this.api.footer.getFooter({
        populate: {
          columns: {
            populate: {
              links: true,
            },
          },
          socialLinks: true,
        },
      });
      return res?.data?.data || null;
    } catch (e) {
      console.error('Error fetching footer singleton:', e);
      return null;
    }
  }

  // --------------------------------------
  // ARTICLES
  // --------------------------------------

  async getArticleBySlug(slug: string) {
    try {
      const res = await this.api.article.getArticles({
        filters: { Slug: { $eq: slug } } as StrapiFilters,
        populate: '*',
      });
      return res?.data?.data?.[0] || null;
    } catch (e) {
      console.error(`Error fetching article by slug ${slug}:`, e);
      return null;
    }
  }

  async getArticleByTitle(title: string) {
    try {
      const res = await this.api.article.getArticles({
        filters: { Title: { $eq: title } } as StrapiFilters,
        populate: '*',
      });
      return res?.data?.data?.[0] || null;
    } catch (e) {
      console.error(`Error fetching article by title ${title}:`, e);
      return null;
    }
  }
}

export const strapiAPI = new StrapiAPI();
