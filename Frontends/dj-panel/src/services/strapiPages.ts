import { Api, Page } from '../models/strapi/strapiMap';

class StrapiAPI {
  private api: Api<unknown>;

  constructor() {
    const protocol = process.env.REACT_APP_CMS_DATABASE_PROTOCOL || 'http';
    const host = process.env.REACT_APP_CMS_DATABASE_HOST || 'localhost';
    const port = process.env.REACT_APP_CMS_DATABASE_PORT || '1337';
    const apiPath = process.env.REACT_APP_CMS_DATABASE_API_PATH || '/api';
    const baseURL = `${protocol}://${host}:${port}${apiPath}`;
    this.api = new Api({ baseURL });
  }

  async fetchRootPages(): Promise<Page[]> {
    // Fetch pages that are published and do not have Parents (capital P, plural)
    const response = await this.api.page.getPages({
      populate: 'subpages',
      filters: {
        publishedAt: { $notNull: true },
        Parents: { id: { $null: true } },
      },
    });
    return response.data?.data || [];
  }

  async fetchPageById(id: number | string): Promise<Page | undefined> {
    const response = await this.api.page.getPagesId(Number(id));
    return response.data?.data;
  }

  async fetchPageByName(name: string): Promise<Page | undefined> {
    const response = await this.api.page.getPages({
      filters: { Title: { $eq: name } },
      populate: 'subpages',
    });
    return response.data?.data?.[0];
  }
}

export const strapiAPI = new StrapiAPI();
