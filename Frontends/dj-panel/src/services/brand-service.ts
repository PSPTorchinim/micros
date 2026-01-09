import { microservicesClient } from '../models/api';

// Company data interface - can be extended as the API evolves
export interface CompanyData {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  [key: string]: string | undefined;
}

// Brand data interface - can be extended as needed
export interface BrandData {
  id?: string;
  name?: string;
  [key: string]: string | undefined;
}

export class BrandService {
  public static async getCompany(): Promise<CompanyData | null> {
    return microservicesClient.brand.company
      .v1CompanyList()
      .then((response) => {
        return response.data as CompanyData;
      })
      .catch((error) => {
        console.error('Error fetching company data:', error);
        return null;
      });
  }

  public static async getBrands(): Promise<BrandData[] | null> {
    return microservicesClient.brand.brands
      .v1BrandsList()
      .then((response) => {
        return response.data as BrandData[];
      })
      .catch((error) => {
        console.error('Error fetching brands data:', error);
        return null;
      });
  }

  /**
   * Transform technical field names to user-friendly labels
   */
  public static formatFieldName(fieldName: string): string {
    // Convert camelCase or snake_case to Title Case with spaces
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
