import { microservicesClient } from '../models/api';

export interface CompanyDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  postCode: string;
  addressLine1: string;
  addressLine2?: string;
  logo?: string;
  createdDate: string;
}

export interface UpdateCompanyDTO {
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  postCode: string;
  addressLine1: string;
  addressLine2?: string;
  logo?: string;
}

export interface CompanyUserDTO {
  id: string;
  userId: string;
  username: string;
  email: string;
  role: string;
}

export interface AddCompanyUserDTO {
  userId: string;
  role: string;
}

export interface CompanyStructureNodeDTO {
  id: string;
  name: string;
  type: string;
  parentId?: string;
  children?: CompanyStructureNodeDTO[];
}

export class CompanyService {
  public static async getCompany(): Promise<CompanyDTO | null> {
    try {
      const response = await microservicesClient.brand.company.v1CompanyList();
      if ((response.data as any)?.success && (response.data as any)?.data) {
        return (response.data as any).data as unknown as CompanyDTO;
      }
      return null;
    } catch {
      return null;
    }
  }

  public static async isUserCompanyMember(): Promise<boolean> {
    try {
      const response =
        await microservicesClient.brand.company.v1CompanyMembershipList();
      return (
        (response.data as any)?.success && (response.data as any)?.data === true
      );
    } catch {
      return false;
    }
  }

  public static async createCompany(
    createDto: UpdateCompanyDTO,
  ): Promise<boolean> {
    try {
      const response =
        await microservicesClient.brand.company.v1CompanyCreate(createDto);
      return (response.data as any)?.success && (response.data as any)?.data;
    } catch {
      return false;
    }
  }

  public static async updateCompany(
    updateDto: UpdateCompanyDTO,
  ): Promise<boolean> {
    try {
      const response =
        await microservicesClient.brand.company.v1CompanyUpdate(updateDto);
      return (response.data as any)?.success && (response.data as any)?.data;
    } catch {
      return false;
    }
  }

  public static async getCompanyUsers(): Promise<CompanyUserDTO[]> {
    try {
      const response =
        await microservicesClient.brand.company.v1CompanyUsersList();
      if (
        (response.data as any)?.success &&
        Array.isArray((response.data as any)?.data)
      ) {
        return (response.data as any).data as unknown as CompanyUserDTO[];
      }
      return [];
    } catch {
      return [];
    }
  }

  public static async addCompanyUser(
    addUserDto: AddCompanyUserDTO,
  ): Promise<boolean> {
    try {
      const response =
        await microservicesClient.brand.company.v1CompanyUsersCreate(
          addUserDto,
        );
      return (response.data as any)?.success && (response.data as any)?.data;
    } catch {
      return false;
    }
  }

  public static async removeCompanyUser(userId: string): Promise<boolean> {
    try {
      const response =
        await microservicesClient.brand.company.v1CompanyUsersDelete(userId);
      return (response.data as any)?.success && (response.data as any)?.data;
    } catch {
      return false;
    }
  }

  public static async getCompanyStructure(): Promise<
    CompanyStructureNodeDTO[]
  > {
    try {
      const response =
        await microservicesClient.brand.company.v1CompanyStructureList();
      if (
        (response.data as any)?.success &&
        Array.isArray((response.data as any)?.data)
      ) {
        return (response.data as any)
          .data as unknown as CompanyStructureNodeDTO[];
      }
      return [];
    } catch {
      return [];
    }
  }

  public static async updateCompanyStructure(
    nodes: CompanyStructureNodeDTO[],
  ): Promise<boolean> {
    try {
      const response =
        await microservicesClient.brand.company.v1CompanyStructureUpdate({
          nodes,
        });
      return (response.data as any)?.success && (response.data as any)?.data;
    } catch {
      return false;
    }
  }
}
