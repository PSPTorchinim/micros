import { Api, ApiConfig } from '../models/strapi/apiMap';

export function createStrapiApi<SecurityDataType extends unknown>(
  config: ApiConfig<SecurityDataType> = {},
): Api<SecurityDataType> {
  return new Api<SecurityDataType>(config);
}

export const StrapiApi = createStrapiApi({
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_STRAPI_TOKEN}`,
  },
});
