import { SHA256 } from 'crypto-js';
import { POST, PUT } from '../utils/api';
import { LoginResponseDTO } from '../models/login-response-dto';
import { Response } from '../models/response';

export class UsersService {
  public static async forgotPassword(
    email: string,
  ): Promise<Response<boolean | null>> {
    return PUT<boolean>('identity/api/v1/users/forgotpassword', {
      email: email,
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return {
          success: false,
          data: null,
          message: error.message,
          errors: [error.message],
        };
      });
  }

  public static async Login(
    email: string,
    password: string,
  ): Promise<Response<LoginResponseDTO | null>> {
    const hashedPassword = SHA256(password);
    return POST<LoginResponseDTO>('identity/api/v1/users/login', {
      email: email,
      password: hashedPassword.toString(),
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return {
          success: false,
          data: null,
          message: error.message,
          errors: [error.message],
        };
      });
  }
}
