import { microservicesClient } from '../models/api';
import type { Page } from '../models/api/strapi/apiMap';

type StrapiFilters = Record<string, unknown>;

// --- Populate config for Template.Content (dynamic zone) ---
// Deeply populates all referenced blocks so they don't need to be fetched separately.
// Note: This uses deep populate which eliminates N+1 queries but may fetch more data
// than strictly needed. This is a conscious trade-off for simpler, more reliable code.
const TEMPLATE_CONTENT_POPULATE = {
  Content: {
    on: {
      'article-block-ref.article-block-ref': {
        populate: { block: { populate: '*' } },
      },
      'hero-block-ref.hero-block-ref': {
        populate: { hero_block: { populate: '*' } },
      },
      'image-slider-ref.image-slider-ref': {
        populate: { slider: { populate: '*' } },
      },
      'steps-container-ref.steps-container-ref': {
        populate: { container: { populate: '*' } },
      },
      'cta-ref.cta-ref': {
        populate: { cta: { populate: '*' } },
      },
      'feature-section-ref.feature-section-ref': {
        populate: { feature_section: { populate: '*' } },
      },
      'contact-section-ref.contact-section-ref': {
        populate: { contact_section: { populate: '*' } },
      },
      'feature-tab-ref.feature-tab-ref': {
        populate: { feature_tab: { populate: '*' } },
      },
      'contact-info-ref.contact-info-ref': {
        populate: { contact_info: { populate: '*' } },
      },
    },
  },
  // Include page with basic fields
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

export class StrapiService {
  // --------------------------------------
  // PAGES
  // --------------------------------------

  // Root pages (without parent)
  public static async getRootPages(): Promise<Page[] | undefined> {
    try {
      console.log('[StrapiService] Fetching root pages...');
      const response = await microservicesClient.strapi.page.getPages({
        filters: {
          Parents: { id: { $null: true } },
        } as StrapiFilters,
      });
      console.log('[StrapiService] Root pages response:', {
        count: response.data.data?.length,
        pages: response.data.data?.map((p: any) => ({
          id: p.id,
          Title: p.Title,
          Slug: p.Slug,
          documentId: p.documentId,
        })),
      });
      return response.data.data;
    } catch (error) {
      console.error(`[StrapiService] Error fetching root pages:`, error);
      return [];
    }
  }

  public static async getPagesByParentId(parentId: number): Promise<Page[]> {
    try {
      const response = await microservicesClient.strapi.page.getPages({
        filters: {
          Parents: { id: { $eq: parentId } },
        } as StrapiFilters,
      });
      // Depending on the generator, it might be response.data.data
      return (
        (response as any).data?.data ?? (response.data as unknown as Page[])
      );
    } catch (error) {
      console.error(`Error fetching pages by parent ID ${parentId}:`, error);
      return [];
    }
  }

  public static async fetchPageById(
    pageDocumentId: string,
  ): Promise<Page | null> {
    try {
      console.log(
        `[StrapiService] Fetching page by documentId: ${pageDocumentId}`,
      );
      const response = await microservicesClient.strapi.page.getPages({
        filters: { documentId: { $eq: pageDocumentId } } as StrapiFilters,
        populate: '*',
      });
      const page = response?.data?.data?.[0] || null;
      console.log(
        `[StrapiService] Page fetched:`,
        page
          ? {
              id: page.id,
              Title: (page as any).Title,
              Slug: (page as any).Slug,
              template: (page as any).template,
            }
          : 'null',
      );
      return page;
    } catch (error) {
      console.error(
        `[StrapiService] Error fetching page by ID ${pageDocumentId}:`,
        error,
      );
      return null;
    }
  }

  // --------------------------------------
  // TEMPLATES
  // --------------------------------------

  // DEPRECATED alias – kept for compatibility, but includes proper populate.on
  public static async getTemplateById(templateDocumentId: string) {
    try {
      console.log(
        `[StrapiService] Fetching template by ID: ${templateDocumentId}`,
      );
      const response = await microservicesClient.strapi.template.getTemplates({
        filters: { documentId: { $eq: templateDocumentId } } as StrapiFilters,
        populate: TEMPLATE_CONTENT_POPULATE as any,
      });
      const template = response?.data?.data?.[0] || null;
      console.log(
        `[StrapiService] Template fetched:`,
        template
          ? {
              Name: (template as any).Name,
              TemplateType: (template as any).TemplateType,
              documentId: (template as any).documentId,
            }
          : 'null',
      );
      return template;
    } catch (error) {
      console.error(
        `[StrapiService] Error fetching template by ID ${templateDocumentId}:`,
        error,
      );
      return null;
    }
  }

  // Recommended name – same as above, with populate.on
  public static async getTemplateByDocumentId(documentId: string) {
    try {
      const response = await microservicesClient.strapi.template.getTemplates({
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
  // BLOCKS – BY NUMERIC ID (/:id)
  // --------------------------------------

  public static async getFeatureTabBlockById(id: number) {
    try {
      const response =
        await microservicesClient.strapi.featureTab.getFeatureTabsId(id);
      return response?.data?.data || null;
    } catch (error) {
      console.error(`Error fetching feature tab block by ID ${id}:`, error);
      return null;
    }
  }

  public static async getContactInfoBlockById(id: number) {
    try {
      const response =
        await microservicesClient.strapi.contactInfo.getContactInfosId(id);
      return response?.data?.data || null;
    } catch (error) {
      console.error(`Error fetching contact info block by ID ${id}:`, error);
      return null;
    }
  }

  public static async getHeroBlockById(id: number) {
    try {
      const response =
        await microservicesClient.strapi.heroBlock.getHeroBlocksId(id);
      return response?.data?.data || null;
    } catch (error) {
      console.error(`Error fetching hero block by ID ${id}:`, error);
      return null;
    }
  }

  public static async getFeatureSectionById(id: number) {
    try {
      const response =
        await microservicesClient.strapi.featureSection.getFeatureSectionsId(
          id,
        );
      return response?.data?.data || null;
    } catch (error) {
      console.error(`Error fetching feature section by ID ${id}:`, error);
      return null;
    }
  }

  public static async getContactSectionById(id: number) {
    try {
      const response =
        await microservicesClient.strapi.contactSection.getContactSectionsId(
          id,
        );
      return response?.data?.data || null;
    } catch (error) {
      console.error(`Error fetching contact section by ID ${id}:`, error);
      return null;
    }
  }

  public static async getImageSliderBlockById(id: number) {
    try {
      const response =
        await microservicesClient.strapi.imageSlider.getImageSlidersId(id);
      return response?.data?.data || null;
    } catch (error) {
      console.error(`Error fetching image slider block by ID ${id}:`, error);
      return null;
    }
  }

  public static async getArticleBlockById(id: number) {
    try {
      const response =
        await microservicesClient.strapi.articleBlock.getArticleBlocksId(id);
      return response?.data?.data || null;
    } catch (error) {
      console.error(`Error fetching article block by ID ${id}:`, error);
      return null;
    }
  }

  public static async getStepsContainerBlockById(id: number) {
    try {
      const response =
        await microservicesClient.strapi.stepsContainer.getStepsContainersId(
          id,
        );
      return response?.data?.data || null;
    } catch (error) {
      console.error(`Error fetching steps container block by ID ${id}:`, error);
      return null;
    }
  }

  public static async getCTABlockById(id: number) {
    try {
      const response = await microservicesClient.strapi.cta.getCtasId(id);
      return response?.data?.data || null;
    } catch (error) {
      console.error(`Error fetching CTA block by ID ${id}:`, error);
      return null;
    }
  }

  // --------------------------------------
  // BLOCKS – BY documentId (string)
  // --------------------------------------

  public static async getArticleBlockByDocumentId(id: string) {
    try {
      const res =
        await microservicesClient.strapi.articleBlock.getArticleBlocks({
          filters: { documentId: { $eq: id } } as StrapiFilters,
          populate: '*',
        });
      return res?.data?.data?.[0] || null;
    } catch (e) {
      console.error(`Error fetching article-block by documentId ${id}:`, e);
      return null;
    }
  }

  public static async getHeroBlockByDocumentId(id: string) {
    try {
      const res = await microservicesClient.strapi.heroBlock.getHeroBlocks({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res?.data?.data?.[0] || null;
    } catch (e) {
      console.error(`Error fetching hero-block by documentId ${id}:`, e);
      return null;
    }
  }

  public static async getImageSliderBlockByDocumentId(id: string) {
    try {
      const res = await microservicesClient.strapi.imageSlider.getImageSliders({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res?.data?.data?.[0] || null;
    } catch (e) {
      console.error(`Error fetching image-slider by documentId ${id}:`, e);
      return null;
    }
  }

  public static async getStepsContainerBlockByDocumentId(id: string) {
    try {
      const res =
        await microservicesClient.strapi.stepsContainer.getStepsContainers({
          filters: { documentId: { $eq: id } } as StrapiFilters,
          populate: '*',
        });
      return res?.data?.data?.[0] || null;
    } catch (e) {
      console.error(`Error fetching steps-container by documentId ${id}:`, e);
      return null;
    }
  }

  public static async getCTABlockByDocumentId(id: string) {
    try {
      const res = await microservicesClient.strapi.cta.getCtas({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res?.data?.data?.[0] || null;
    } catch (e) {
      console.error(`Error fetching cta by documentId ${id}:`, e);
      return null;
    }
  }

  public static async getFeatureSectionByDocumentId(id: string) {
    try {
      const res =
        await microservicesClient.strapi.featureSection.getFeatureSections({
          filters: { documentId: { $eq: id } } as StrapiFilters,
          populate: '*',
        });
      return res?.data?.data?.[0] || null;
    } catch (e) {
      console.error(`Error fetching feature-section by documentId ${id}:`, e);
      return null;
    }
  }

  public static async getContactSectionByDocumentId(id: string) {
    try {
      const res =
        await microservicesClient.strapi.contactSection.getContactSections({
          filters: { documentId: { $eq: id } } as StrapiFilters,
          populate: '*',
        });
      return res?.data?.data?.[0] || null;
    } catch (e) {
      console.error(`Error fetching contact-section by documentId ${id}:`, e);
      return null;
    }
  }

  public static async getFeatureTabBlockByDocumentId(id: string) {
    try {
      const res = await microservicesClient.strapi.featureTab.getFeatureTabs({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res?.data?.data?.[0] || null;
    } catch (e) {
      console.error(`Error fetching feature-tab by documentId ${id}:`, e);
      return null;
    }
  }

  public static async getContactInfoBlockByDocumentId(id: string) {
    try {
      const res = await microservicesClient.strapi.contactInfo.getContactInfos({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res?.data?.data?.[0] || null;
    } catch (e) {
      console.error(`Error fetching contact-info by documentId ${id}:`, e);
      return null;
    }
  }

  public static async getLoginBlockByDocumentId(id: string) {
    try {
      const res = await microservicesClient.strapi.loginBlock.getLoginBlock({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res?.data?.data || null;
    } catch (e) {
      console.error(`Error fetching login-block by documentId ${id}:`, e);
      return null;
    }
  }

  public static async getForgotPasswordBlockByDocumentId(id: string) {
    try {
      const res =
        await microservicesClient.strapi.forgotPasswordBlock.getForgotPasswordBlock(
          {
            filters: { documentId: { $eq: id } } as StrapiFilters,
            populate: '*',
          },
        );
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
  public static async getLoginBlockSingleton() {
    try {
      const res = await microservicesClient.strapi.loginBlock.getLoginBlock();
      return res?.data?.data || null;
    } catch (e) {
      console.error('Error fetching login-block singleton:', e);
      return null;
    }
  }

  public static async getForgotPasswordBlockSingleton() {
    try {
      const res =
        await microservicesClient.strapi.forgotPasswordBlock.getForgotPasswordBlock();
      return res?.data?.data || null;
    } catch (e) {
      console.error('Error fetching forgot-password-block singleton:', e);
      return null;
    }
  }

  public static async getChangePasswordBlockSingleton() {
    try {
      // Note: Using 'as any' temporarily until API types are regenerated
      // Run 'npm run map:api' to generate proper TypeScript types for this endpoint
      const res =
        await microservicesClient.strapi.changePasswordBlock.getChangePasswordBlock();
      return res?.data?.data || null;
    } catch (e) {
      console.error('Error fetching change-password-block singleton:', e);
      return null;
    }
  }

  public static async getProfileBlockSingleton() {
    try {
      // Note: Using 'as any' temporarily until API types are regenerated
      // Run 'npm run map:api' to generate proper TypeScript types for this endpoint
      const res =
        await microservicesClient.strapi.profileBlock.getProfileBlock();
      return res?.data?.data || null;
    } catch (e) {
      console.error('Error fetching profile-block singleton:', e);
      return null;
    }
  }

  public static async getCompanyBlockSingleton() {
    try {
      // Note: Using 'as any' temporarily until API types are regenerated
      // Run 'npm run map:api' to generate proper TypeScript types for this endpoint
      const res = await (
        microservicesClient.strapi as any
      ).companyBlock.getCompanyBlock();
      return res?.data?.data || null;
    } catch (e) {
      console.error('Error fetching company-block singleton:', e);
      return null;
    }
  }

  public static async getFooterSingleton() {
    try {
      const res = await microservicesClient.strapi.footer.getFooter({
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

  public static async getArticleBySlug(slug: string) {
    try {
      const res = await microservicesClient.strapi.article.getArticles({
        filters: { Slug: { $eq: slug } } as StrapiFilters,
        populate: '*',
      });
      return res?.data?.data?.[0] || null;
    } catch (e) {
      console.error(`Error fetching article by slug ${slug}:`, e);
      return null;
    }
  }

  public static async getArticleByTitle(title: string) {
    try {
      const res = await microservicesClient.strapi.article.getArticles({
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
