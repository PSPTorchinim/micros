import { GetRoleDTO } from './get-role-dto';

export interface GetUserDTO {
  id: string;
  email: string;
  activated: boolean;
  roles: GetRoleDTO[];
}
