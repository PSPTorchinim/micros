import { microservicesClient } from '../models/api';

export class BrandService {
  public static async getCompany(): Promise<any> {
    return microservicesClient.brand.company
      .v1CompanyList()
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error('Error fetching company data:', error);
        return null;
      });
  }

  public static async getBrands(): Promise<any> {
    return microservicesClient.brand.brands
      .v1BrandsList()
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error('Error fetching brands data:', error);
        return null;
      });
  }
}
