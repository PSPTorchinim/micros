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
};

export class StrapiService {
  // --------------------------------------
  // PAGES
  // --------------------------------------

  // Root pages (without parent)
  public static async getRootPages(): Promise<Page[] | undefined> {
    try {
      const response = await microservicesClient.strapi.page.getPages({
        filters: {
          Parents: { id: { $null: true } },
        } as StrapiFilters,
      });
      return response.data.data ?? [];
    } catch {
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
      return response.data.data ?? [];
    } catch {
      return [];
    }
  }

  public static async fetchPageById(
    pageDocumentId: string,
  ): Promise<Page | null> {
    try {
      const response = await microservicesClient.strapi.page.getPages({
        filters: { documentId: { $eq: pageDocumentId } } as StrapiFilters,
        populate: '*',
      });
      const page = response.data.data?.[0] ?? null;
      return page;
    } catch {
      return null;
    }
  }

  // --------------------------------------
  // TEMPLATES
  // --------------------------------------

  // DEPRECATED alias – kept for compatibility, but includes proper populate.on
  public static async getTemplateById(templateDocumentId: string) {
    try {
      const response = await microservicesClient.strapi.template.getTemplates({
        filters: { documentId: { $eq: templateDocumentId } } as StrapiFilters,
        // @ts-expect-error - Strapi v5 supports complex populate objects for dynamic zones, but generated types only allow strings
        populate: TEMPLATE_CONTENT_POPULATE,
      });
      const template = response.data.data?.[0] ?? null;
      return template;
    } catch {
      return null;
    }
  }

  // Recommended name – same as above, with populate.on
  public static async getTemplateByDocumentId(documentId: string) {
    try {
      const response = await microservicesClient.strapi.template.getTemplates({
        filters: { documentId: { $eq: documentId } } as StrapiFilters,
        // @ts-expect-error - Strapi v5 supports complex populate objects for dynamic zones, but generated types only allow strings
        populate: TEMPLATE_CONTENT_POPULATE,
      });
      return response.data.data?.[0] ?? null;
    } catch {
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
      return response.data.data ?? null;
    } catch {
      return null;
    }
  }

  public static async getContactInfoBlockById(id: number) {
    try {
      const response =
        await microservicesClient.strapi.contactInfo.getContactInfosId(id);
      return response.data.data ?? null;
    } catch {
      return null;
    }
  }

  public static async getHeroBlockById(id: number) {
    try {
      const response =
        await microservicesClient.strapi.heroBlock.getHeroBlocksId(id);
      return response.data.data ?? null;
    } catch {
      return null;
    }
  }

  public static async getFeatureSectionById(id: number) {
    try {
      const response =
        await microservicesClient.strapi.featureSection.getFeatureSectionsId(
          id,
        );
      return response.data.data ?? null;
    } catch {
      return null;
    }
  }

  public static async getContactSectionById(id: number) {
    try {
      const response =
        await microservicesClient.strapi.contactSection.getContactSectionsId(
          id,
        );
      return response.data.data ?? null;
    } catch {
      return null;
    }
  }

  public static async getImageSliderBlockById(id: number) {
    try {
      const response =
        await microservicesClient.strapi.imageSlider.getImageSlidersId(id);
      return response.data.data ?? null;
    } catch {
      return null;
    }
  }

  public static async getArticleBlockById(id: number) {
    try {
      const response =
        await microservicesClient.strapi.articleBlock.getArticleBlocksId(id);
      return response.data.data ?? null;
    } catch {
      return null;
    }
  }

  public static async getStepsContainerBlockById(id: number) {
    try {
      const response =
        await microservicesClient.strapi.stepsContainer.getStepsContainersId(
          id,
        );
      return response.data.data ?? null;
    } catch {
      return null;
    }
  }

  public static async getCTABlockById(id: number) {
    try {
      const response = await microservicesClient.strapi.cta.getCtasId(id);
      return response.data.data ?? null;
    } catch {
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
      return res.data.data?.[0] ?? null;
    } catch {
      return null;
    }
  }

  public static async getHeroBlockByDocumentId(id: string) {
    try {
      const res = await microservicesClient.strapi.heroBlock.getHeroBlocks({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res.data.data?.[0] ?? null;
    } catch {
      return null;
    }
  }

  public static async getImageSliderBlockByDocumentId(id: string) {
    try {
      const res = await microservicesClient.strapi.imageSlider.getImageSliders({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res.data.data?.[0] ?? null;
    } catch {
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
      return res.data.data?.[0] ?? null;
    } catch {
      return null;
    }
  }

  public static async getCTABlockByDocumentId(id: string) {
    try {
      const res = await microservicesClient.strapi.cta.getCtas({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res.data.data?.[0] ?? null;
    } catch {
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
      return res.data.data?.[0] ?? null;
    } catch {
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
      return res.data.data?.[0] ?? null;
    } catch {
      return null;
    }
  }

  public static async getFeatureTabBlockByDocumentId(id: string) {
    try {
      const res = await microservicesClient.strapi.featureTab.getFeatureTabs({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res.data.data?.[0] ?? null;
    } catch {
      return null;
    }
  }

  public static async getContactInfoBlockByDocumentId(id: string) {
    try {
      const res = await microservicesClient.strapi.contactInfo.getContactInfos({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res.data.data?.[0] ?? null;
    } catch {
      return null;
    }
  }

  public static async getLoginBlockByDocumentId(id: string) {
    try {
      const res = await microservicesClient.strapi.loginBlock.getLoginBlock({
        filters: { documentId: { $eq: id } } as StrapiFilters,
        populate: '*',
      });
      return res.data.data ?? null;
    } catch {
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
      return res.data.data ?? null;
    } catch {
      return null;
    }
  }

  // Singleton methods for Login and ForgotPassword blocks
  public static async getLoginBlockSingleton() {
    try {
      const res = await microservicesClient.strapi.loginBlock.getLoginBlock();
      return res.data.data ?? null;
    } catch {
      return null;
    }
  }

  public static async getForgotPasswordBlockSingleton() {
    try {
      const res =
        await microservicesClient.strapi.forgotPasswordBlock.getForgotPasswordBlock();
      return res.data.data ?? null;
    } catch {
      return null;
    }
  }

  public static async getChangePasswordBlockSingleton() {
    try {
      // Note: Using 'as any' temporarily until API types are regenerated
      // Run 'npm run map:api' to generate proper TypeScript types for this endpoint
      const res =
        await microservicesClient.strapi.changePasswordBlock.getChangePasswordBlock();
      return res.data.data ?? null;
    } catch {
      return null;
    }
  }

  public static async getProfileBlockSingleton() {
    try {
      // Note: Using 'as any' temporarily until API types are regenerated
      // Run 'npm run map:api' to generate proper TypeScript types for this endpoint
      const res =
        await microservicesClient.strapi.profileBlock.getProfileBlock();
      return res.data.data ?? null;
    } catch {
      return null;
    }
  }

  public static async getCompanyBlockSingleton() {
    try {
      // Note: Using 'as any' temporarily until API types are regenerated
      // Run 'npm run map:api' to generate proper TypeScript types for this endpoint
      const res =
        await microservicesClient.strapi.companyBlock.getCompanyBlock();
      return res.data.data ?? null;
    } catch {
      return null;
    }
  }

  public static async getFooterSingleton() {
    try {
      const res = await microservicesClient.strapi.footer.getFooter({
        // @ts-expect-error - Strapi v5 supports complex populate objects for nested components, but generated types only allow strings
        populate: {
          columns: {
            populate: {
              links: true,
            },
          },
          socialLinks: true,
        },
      });
      return res.data.data ?? null;
    } catch {
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
      return res.data.data?.[0] ?? null;
    } catch {
      return null;
    }
  }

  public static async getArticleByTitle(title: string) {
    try {
      const res = await microservicesClient.strapi.article.getArticles({
        filters: { Title: { $eq: title } } as StrapiFilters,
        populate: '*',
      });
      return res.data.data?.[0] ?? null;
    } catch {
      return null;
    }
  }
}
