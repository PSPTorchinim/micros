import { identityService } from './api-services';

export class UsersService {
  public static async login(credentials: { email: string; password: string }) {
    try {
      const response = await identityService.auth.apiV1AuthLoginPost({
        email: credentials.email,
        password: credentials.password,
      });

      return {
        user: response.data.user,
        jwt: response.data.token,
      };
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  public static async forgotPassword(data: { email: string }) {
    try {
      const response = await identityService.auth.apiV1AuthForgotPasswordPost({
        email: data.email,
      });

      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  }
}
