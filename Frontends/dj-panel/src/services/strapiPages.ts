import { Api, Page, Template } from '../models/strapi/strapiMap';

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
      filters: {
        publishedAt: { $notNull: true },
        Parents: { id: { $null: true } },
      },
    });
    return response.data?.data || [];
  }

  async fetchPageById(id: number | string): Promise<Page | undefined> {
    const response = await this.api.page
      .getPages({
        filters: { id: { $eq: id } },
        populate: '*',
      })
      .then((res) => res.data?.data?.at(0) || undefined);
    return response;
  }

  async fetchPageByName(name: string): Promise<Page | undefined> {
    const response = await this.api.page.getPages({
      filters: { Title: { $eq: name } },
    });
    return response.data?.data?.[0];
  }

  async fetchPagesByParentId(parentId: number | string): Promise<Page[]> {
    // Fetch pages where Parents contains the given parentId
    const response = await this.api.page.getPages({
      filters: {
        Parents: { id: { $eq: parentId } },
        publishedAt: { $notNull: true },
      },
    });
    return response.data?.data || [];
  }

  async fetchTemplate(
    templateId: number | string,
  ): Promise<Template | undefined> {
    const response = await this.api.template.getTemplates({
      filters: { id: { $eq: templateId } },
    });
    return response.data?.data?.[0];
  }
}

export const strapiAPI = new StrapiAPI();
