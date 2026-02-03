import { microservicesClient } from '../models/api';
import {
  RoleIEnumerableResponse,
  GetRoleDTOResponse,
  BooleanResponse,
  AddRoleRequest,
} from '../models/api/identity/apiMap';

export class RolesService {
  public static async getRoles(): Promise<RoleIEnumerableResponse> {
    return microservicesClient.identity.roles
      .v1RolesList()
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return (
          error.response?.data ?? {
            success: false,
            data: null,
            message: error.message,
            errors: [error.message],
          }
        );
      });
  }

  public static async getRole(id: string): Promise<GetRoleDTOResponse> {
    return microservicesClient.identity.roles
      .v1RolesDetail(id)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return (
          error.response?.data ?? {
            success: false,
            data: null,
            message: error.message,
            errors: [error.message],
          }
        );
      });
  }

  public static async createRole(
    role: AddRoleRequest,
  ): Promise<BooleanResponse> {
    return microservicesClient.identity.roles
      .v1RolesCreate(role)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return (
          error.response?.data ?? {
            success: false,
            data: false,
            message: error.message,
            errors: [error.message],
          }
        );
      });
  }

  public static async updateRole(
    id: string,
    role: AddRoleRequest,
  ): Promise<BooleanResponse> {
    return microservicesClient.identity.roles
      .v1RolesUpdate(id, role)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return (
          error.response?.data ?? {
            success: false,
            data: false,
            message: error.message,
            errors: [error.message],
          }
        );
      });
  }

  public static async deleteRole(id: string): Promise<BooleanResponse> {
    return microservicesClient.identity.roles
      .v1RolesDelete(id)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return (
          error.response?.data ?? {
            success: false,
            data: false,
            message: error.message,
            errors: [error.message],
          }
        );
      });
  }
}
