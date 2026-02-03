import { microservicesClient } from '../models/api';
import {
  GetPermissionsDTOIEnumerableResponse,
  GetPermissionDTOResponse,
  BooleanResponse,
  AddPermissionDTO,
} from '../models/api/identity/apiMap';

export class PermissionsService {
  public static getPermissions(): Promise<GetPermissionsDTOIEnumerableResponse> {
    return microservicesClient.identity.permissions
      .v1PermissionsList()
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

  public static getPermission(
    id: string,
  ): Promise<GetPermissionDTOResponse> {
    return microservicesClient.identity.permissions
      .v1PermissionsDetail(id)
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

  public static createPermission(
    permission: AddPermissionDTO,
  ): Promise<BooleanResponse> {
    return microservicesClient.identity.permissions
      .v1PermissionsCreate(permission)
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
