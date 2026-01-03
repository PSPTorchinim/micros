import { SHA256 } from 'crypto-js';
import { microservicesClient } from '../models/api';
import {
  BooleanResponse,
  LoginResponseDTOResponse,
} from '../models/api/identity/apiMap';

export class UsersService {
  public static async forgotPassword(email: string): Promise<BooleanResponse> {
    return microservicesClient.identity.users
      .v1UsersForgotPasswordUpdate({ email: email })
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
    // Send plaintext password - it will be securely transmitted via HTTPS
    // and hashed on the backend using BCrypt for proper security
    const requestBody = {
      email: email,
      password: password,
    };
    return microservicesClient.identity.users
      .v1UsersLoginCreate(requestBody)
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

  public static async GetMe(): Promise<LoginResponseDTOResponse> {
    return microservicesClient.identity.users
      .v1UsersMeList()
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

  public static async ChangePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<BooleanResponse> {
    const hashedOldPassword = SHA256(oldPassword);
    const hashedNewPassword = SHA256(newPassword);
    const requestBody = {
      oldPassword: hashedOldPassword.toString(),
      newPassword: hashedNewPassword.toString(),
    };
    return microservicesClient.identity.users
      .v1UsersChangePasswordUpdate(requestBody)
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
