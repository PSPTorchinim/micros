import { microservicesClient } from '../models/api';

export interface CompanyTypeDTO {
  id: string;
  code: string;
  countryCode: string;
  isActive: boolean;
  displayOrder: number;
  name: string;
  description: string;
}

export interface CreateCompanyTypeTranslationDTO {
  languageCode: string;
  name: string;
  description: string;
}

export interface CreateCompanyTypeDTO {
  code: string;
  countryCode: string;
  isActive: boolean;
  displayOrder: number;
  translations: CreateCompanyTypeTranslationDTO[];
}

export interface UpdateCompanyTypeDTO {
  isActive: boolean;
  displayOrder: number;
  translations: CreateCompanyTypeTranslationDTO[];
}

export interface CreateCompanyTypeFieldTranslationDTO {
  languageCode: string;
  label: string;
  helpText?: string;
  validationMessage?: string;
}

export interface CreateCompanyTypeFieldDTO {
  fieldKey: string;
  fieldType: string;
  isRequired: boolean;
  validationRegex?: string;
  validationMessage?: string;
  displayOrder: number;
  defaultValue?: string;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  translations: CreateCompanyTypeFieldTranslationDTO[];
}

export interface CompanyTypeSyncResultDTO {
  countryCode: string;
  created: number;
  updated: number;
  failed: number;
  errors: string[];
}

export class CompanyTypeAdminService {
  private static get instance() {
    return microservicesClient.brand.instance;
  }

  private static extractData<T>(response: { data: unknown }): T {
    const data = response.data as { success?: boolean; data?: T };
    if (data?.success && data?.data !== undefined) {
      return data.data as T;
    }
    return data as unknown as T;
  }

  public static async getAll(languageCode = 'en'): Promise<CompanyTypeDTO[]> {
    try {
      const response = await this.instance.get(
        `/brand/v1/AdminCompanyTypes?languageCode=${encodeURIComponent(languageCode)}`,
      );
      return this.extractData<CompanyTypeDTO[]>(response) ?? [];
    } catch {
      return [];
    }
  }

  public static async create(
    dto: CreateCompanyTypeDTO,
  ): Promise<CompanyTypeDTO | null> {
    try {
      const response = await this.instance.post(
        '/brand/v1/AdminCompanyTypes',
        dto,
      );
      return this.extractData<CompanyTypeDTO>(response);
    } catch {
      return null;
    }
  }

  public static async update(
    id: string,
    dto: UpdateCompanyTypeDTO,
  ): Promise<boolean> {
    try {
      const response = await this.instance.put(
        `/brand/v1/AdminCompanyTypes/${id}`,
        dto,
      );
      return (response.data as { success?: boolean })?.success ?? false;
    } catch {
      return false;
    }
  }

  public static async remove(id: string): Promise<boolean> {
    try {
      const response = await this.instance.delete(
        `/brand/v1/AdminCompanyTypes/${id}`,
      );
      return (response.data as { success?: boolean })?.success ?? false;
    } catch {
      return false;
    }
  }

  public static async addField(
    typeId: string,
    dto: CreateCompanyTypeFieldDTO,
  ): Promise<boolean> {
    try {
      const response = await this.instance.post(
        `/brand/v1/AdminCompanyTypes/${typeId}/fields`,
        dto,
      );
      return (response.data as { success?: boolean })?.success ?? false;
    } catch {
      return false;
    }
  }

  public static async syncFromGleif(
    countryCode: string,
  ): Promise<CompanyTypeSyncResultDTO | null> {
    try {
      const response = await this.instance.post(
        `/brand/v1/AdminCompanyTypes/sync?countryCode=${encodeURIComponent(countryCode)}`,
      );
      return this.extractData<CompanyTypeSyncResultDTO>(response);
    } catch {
      return null;
    }
  }

  public static async importFromFile(
    file: File,
  ): Promise<CompanyTypeSyncResultDTO | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await this.instance.post(
        '/brand/v1/AdminCompanyTypes/import',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return this.extractData<CompanyTypeSyncResultDTO>(response);
    } catch {
      return null;
    }
  }
}
