import { GetPermissionsDTO } from './get-permission-dto';

export interface GetRoleDTO {
  name: string;
  description: string;
  permissions: GetPermissionsDTO[];
}
