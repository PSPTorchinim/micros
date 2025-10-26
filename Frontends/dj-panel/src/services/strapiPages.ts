import { Api, Page } from '../models/strapi/apiMap';

export async function fetchAllPages(): Promise<Page[]> {
  // Use protocol, host, port, and api path from environment variables
  const protocol = process.env.REACT_APP_CMS_DATABASE_PROTOCOL || 'http';
  const host = process.env.REACT_APP_CMS_DATABASE_HOST || 'localhost';
  const port = process.env.REACT_APP_CMS_DATABASE_PORT || '1337';
  const apiPath = process.env.REACT_APP_CMS_DATABASE_API_PATH || '/api';
  const baseURL = `${protocol}://${host}:${port}${apiPath}`;
  const api = new Api({ baseURL });
  const response = await api.page.getPages({ populate: 'Subpages' });
  return response.data?.data || [];
}
