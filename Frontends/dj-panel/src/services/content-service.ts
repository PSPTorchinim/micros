import { StrapiApi } from '../utils/strapi';
import { Page, BasicTemplate, Article } from '../models/strapi/apiMap';

export class ContentService {
  public static async getAllPages(): Promise<Page[]> {
    try {
      const response = await StrapiApi.page.getPages({
        filters: {
          publishedAt: {
            $notNull: true,
          },
        },
        populate: '*',
        'pagination[limit]': 100,
      });

      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch all pages:', error);
      return [];
    }
  }

  public static async getPageByUrl(url: string): Promise<Page | null> {
    try {
      const response = await StrapiApi.page.getPages({
        filters: {
          URL: {
            $eq: url,
          },
        },
        populate: '*',
      });

      const pages = response.data.data || [];
      return pages.length > 0 ? pages[0] : null;
    } catch (error) {
      console.error(`Failed to fetch page with URL ${url}:`, error);
      return null;
    }
  }

  public static async getPageByPageId(pageId: string): Promise<Page | null> {
    try {
      let response = await StrapiApi.page.getPages({
        filters: {
          Name: {
            $eqi: pageId,
          },
        },
        populate: '*',
      });

      let pages = response.data.data || [];

      return pages.length > 0 ? pages[0] : null;
    } catch (error) {
      console.error(`Failed to fetch page with PageID ${pageId}:`, error);
      return null;
    }
  }

  public static async getBasicTemplate(
    id: string | number | undefined,
  ): Promise<BasicTemplate | null> {
    if (!id) return null;

    try {
      const response = await StrapiApi.basicTemplate.getBasicTemplates({
        filters: { documentId: { $eq: id } },
        populate: '*',
      });
      return response.data.data?.at(0) || null;
    } catch (error) {
      console.error(`Failed to fetch basic template with ID ${id}:`, error);
      return null;
    }
  }

  public static async getNavigationData(): Promise<any> {
    try {
      const response = await StrapiApi.page.getPages({
        filters: {
          publishedAt: {
            $notNull: true,
          },
          IsInNavigation: {
            $eq: true,
          },
          Pages: { $null: true },
        },
        populate: '*',
        'pagination[limit]': 100,
      });

      const pages = response.data.data || [];

      const buildNavigationTree = (
        pageList: Page[],
        depth: number = 0,
      ): any[] => {
        if (depth > 5) return [];

        return pageList
          .filter((page) => page.Name && page.URL && page.IsInNavigation)
          .map((page) => {
            const navigationItem = {
              text: page.Name,
              url: page.URL,
              children: [] as any[],
            };

            if (page.Subpages && page.Subpages.length > 0) {
              const validSubpages = page.Subpages.filter(
                (subpage: any) =>
                  subpage.Name &&
                  subpage.URL &&
                  typeof subpage.Name === 'string' &&
                  typeof subpage.URL === 'string',
              ).map((subpage: any) => ({
                ...subpage,
                Name: subpage.Name ?? '',
                URL: subpage.URL ?? '',
                IsInNavigation: subpage.IsInNavigation ?? true,
              })) as Page[];

              const subpageChildren = buildNavigationTree(
                validSubpages,
                depth + 1,
              );
              navigationItem.children.push(...subpageChildren);
            } else if (page.Pages && page.Pages.length > 0) {
              const validPages = page.Pages.filter(
                (childPage: any) =>
                  childPage.Name &&
                  childPage.URL &&
                  typeof childPage.Name === 'string' &&
                  typeof childPage.URL === 'string',
              ).map((childPage: any) => ({
                ...childPage,
                Name: childPage.Name ?? '',
                URL: childPage.URL ?? '',
                IsInNavigation: childPage.IsInNavigation ?? true,
              })) as Page[];

              const pageChildren = buildNavigationTree(validPages, depth + 1);
              navigationItem.children.push(...pageChildren);
            }

            return navigationItem;
          });
      };

      const links = buildNavigationTree(pages).slice(0, 8);

      return {
        links,
        logo: { text: 'DJ Panel', url: '/' },
      };
    } catch (error) {
      console.error('Failed to fetch navigation data:', error);

      return {
        links: [{ text: 'Home', url: '/' }],
        logo: { text: 'DJ Panel', url: '/' },
      };
    }
  }

  public static async getArticle(
    id: string | number | undefined,
  ): Promise<Article | null> {
    if (!id) return null;

    try {
      const response = await StrapiApi.article.getArticles({
        filters: { id: { $eq: id } },
        populate: '*',
      });
      return response.data.data?.at(0) || null;
    } catch (error) {
      console.error(`Failed to fetch article with ID ${id}:`, error);
      return null;
    }
  }

  public static async getArticleByName(
    name: string | undefined,
  ): Promise<Article | null> {
    if (!name) return null;

    try {
      const response = await StrapiApi.article.getArticles({
        filters: { title: { $eq: name } },
        populate: '*',
      });
      return response.data.data?.at(0) || null;
    } catch (error) {
      console.error(`Failed to fetch article with Name ${name}:`, error);
      return null;
    }
  }

  public static async getAllArticles(): Promise<Article[]> {
    try {
      const response = await StrapiApi.article.getArticles({
        filters: {
          publishedAt: {
            $notNull: true,
          },
        },
        populate: '*',
        'pagination[limit]': 100,
      });

      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch all articles:', error);
      return [];
    }
  }

  public static async getFooterData(): Promise<any> {
    try {
      const response = await StrapiApi.footer.getFooter({
        populate: '*',
      });

      const footerData = response.data.data;

      if (!footerData) {
        throw new Error('No footer data found');
      }

      return footerData;
    } catch (error) {
      console.error('Failed to fetch footer data:', error);
      throw error;
    }
  }

  public static async getHeaderData(): Promise<any> {
    try {
      const response = await StrapiApi.header.getHeader({
        populate: '*',
      });

      const headerData = response.data.data;

      if (!headerData) {
        throw new Error('No header data found');
      }

      return headerData;
    } catch (error) {
      console.error('Failed to fetch header data:', error);
      throw error;
    }
  }
}
