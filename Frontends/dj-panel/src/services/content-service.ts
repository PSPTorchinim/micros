import { Api, Global, Page } from '../models/strapi/apiMap';
import { StrapiApi } from '../utils/strapi';

// Create API instance
const api = new Api({
  baseURL: process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337/api',
  secure: false, // Set to true in production with proper auth
});

export class ContentService {
  // Get global data including header and footer
  static async getGlobalData(): Promise<Global | null> {
    try {
      const response = await api.global.getGlobal({
        populate: 'deep',
      });
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching global data:', error);
      return null;
    }
  }

  // Get header data from global
  static async getHeaderData(): Promise<any> {
    try {
      const globalData = await this.getGlobalData();
      const headerComponent = globalData?.Header;

      if (!headerComponent) {
        return null;
      }

      return {
        id: headerComponent.id,
        logo: {
          text: headerComponent.Heading || 'DJ Panel',
          url: '/',
          image: headerComponent.Logo
            ? {
                url: headerComponent.Logo.url,
                alternativeText: headerComponent.Logo.alternativeText,
              }
            : null,
        },
        heading: headerComponent.Heading,
        secondaryText: headerComponent.SecondaryText,
      };
    } catch (error) {
      console.error('Error fetching header data:', error);
    }
  }

  public static async getNavigationData(): Promise<any> {
    try {
      const response = await StrapiApi.page.getPages({
        filters: {
          publishedAt: {
            $notNull: true,
          },
          Parents: { $null: true },
        },
        'pagination[limit]': 100,
      });

      const pages = response.data.data || [];

      const buildNavigationTree = (
        pageList: Page[],
        depth: number = 0,
      ): any[] => {
        if (depth > 5) return [];

        return pageList
          .filter((page) => page.Title && page.Slug)
          .map((page) => {
            const navigationItem = {
              text: page.Title,
              url: page.Slug,
              children: [] as any[],
            };

            if (page.Subpages && page.Subpages.length > 0) {
              const validSubpages = page.Subpages.filter(
                (subpage: any) =>
                  subpage.Name &&
                  subpage.Slug &&
                  typeof subpage.Name === 'string' &&
                  typeof subpage.Slug === 'string',
              ).map((subpage: any) => ({
                ...subpage,
                Title: subpage.Title ?? '',
                Slug: subpage.Slug ?? '',
                IsInNavigation: subpage.IsInNavigation ?? true,
              })) as Page[];

              const subpageChildren = buildNavigationTree(
                validSubpages,
                depth + 1,
              );
              navigationItem.children.push(...subpageChildren);
            } else if (page.Subpages && page.Subpages.length > 0) {
              const validPages = page.Subpages.filter(
                (childPage: any) =>
                  childPage.Title &&
                  childPage.Slug &&
                  typeof childPage.Title === 'string' &&
                  typeof childPage.Slug === 'string',
              ).map((childPage: any) => ({
                ...childPage,
                Title: childPage.Title ?? '',
                Slug: childPage.Slug ?? '',
                IsInNavigation: childPage.IsInNavigation ?? true,
              })) as Page[];

              const pageChildren = buildNavigationTree(validPages, depth + 1);
              navigationItem.children.push(...pageChildren);
            }

            return navigationItem;
          });
      };

      const links = buildNavigationTree(
        pages.sort((a, b) => (b.id || 0) - (a.id || 0)),
      );

      return {
        links,
        logo: { text: 'DJ Panel', url: '/' },
      };
    } catch (error) {
      console.error('Failed to fetch navigation data:', error);
    }
  }

  // Get page by URL/slug
  static async getPageByUrl(url: string): Promise<Page | null> {
    try {
      const cleanUrl = url.replace(/^\/+|\/+$/g, '') || 'home';

      const response = await api.page.getPages({
        filters: {
          Slug: {
            $eq: cleanUrl,
          },
        },
        populate: 'deep',
      });

      const pages = response.data.data || [];
      return pages.length > 0 ? pages[0] : null;
    } catch (error) {
      console.error('Error fetching page by URL:', error);
      return null;
    }
  }
}
