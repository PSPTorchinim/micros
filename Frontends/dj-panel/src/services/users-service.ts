import { SHA256 } from 'crypto-js';
import {
  BooleanResponse,
  LoginResponseDTOResponse,
  microservicesClient,
} from '../models/api';

export class UsersService {
  public static async forgotPassword(email: string): Promise<BooleanResponse> {
    return microservicesClient.identity.users
      .apiV1UsersForgotPasswordUpdate({ email: email })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return {
          success: false,
          data: false,
          message: error.message,
          errors: [error.message],
        };
      });
  }

  public static async Login(
    email: string,
    password: string,
  ): Promise<LoginResponseDTOResponse> {
    const hashedPassword = SHA256(password);
    const requestBody = {
      email: email,
      password: hashedPassword.toString(),
    };
    return microservicesClient.identity.users
      .apiV1UsersLoginCreate(requestBody)
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
}
