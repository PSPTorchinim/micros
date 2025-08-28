import { GetUserDTO } from './get-user-dto';

export interface LoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: GetUserDTO;
}
