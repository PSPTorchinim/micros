import { microservicesClient } from '../models/api';
import { BooleanResponse, ContentType } from '../models/api/identity/apiMap';

/**
 * Represents a user with their role assignments for management purposes
 */
export interface UserWithRoleAssignments {
  userId: string;
  userEmail: string;
  isActive: boolean;
  assignedRoles: RoleAssignment[];
  accountCreationDate: string;
}

/**
 * Represents a role assignment for a user
 */
export interface RoleAssignment {
  roleId: string;
  roleName: string;
  roleDetails: string;
}

/**
 * Standard response wrapper for user collections
 */
export interface UserCollectionResponse {
  isSuccessful: boolean;
  users: UserWithRoleAssignments[] | null;
  errorMessage: string | null;
  validationErrors: string[] | null;
}

/**
 * Standard response wrapper for single user
 */
export interface SingleUserResponse {
  isSuccessful: boolean;
  user: UserWithRoleAssignments | null;
  errorMessage: string | null;
  validationErrors: string[] | null;
}

/**
 * Service for managing user role assignments
 * Provides custom business logic layer over the auto-generated API client
 */
export class UserRoleManagementService {
  /**
   * Retrieves all users in the system with their current role assignments
   */
  public static async fetchAllUsersWithRoles(): Promise<UserCollectionResponse> {
    try {
      const apiResponse = await microservicesClient.identity.request({
        path: '/identity/v1/Users',
        method: 'GET',
        secure: true,
        format: 'json',
      });

      const responseData = apiResponse.data as any;

      if (responseData.success) {
        const transformedUsers = this.convertToUserRoleFormat(
          responseData.data || [],
        );
        return {
          isSuccessful: true,
          users: transformedUsers,
          errorMessage: null,
          validationErrors: null,
        };
      }

      return {
        isSuccessful: false,
        users: null,
        errorMessage: responseData.message || 'Failed to retrieve users',
        validationErrors: responseData.errors || null,
      };
    } catch (apiError) {
      return this.buildErrorResponse(apiError);
    }
  }

  /**
   * Retrieves a specific user by their identifier with role details
   */
  public static async fetchUserWithRolesById(
    userId: string,
  ): Promise<SingleUserResponse> {
    try {
      const apiResponse = await microservicesClient.identity.request({
        path: `/identity/v1/Users/${userId}`,
        method: 'GET',
        secure: true,
        format: 'json',
      });

      const responseData = apiResponse.data as any;

      if (responseData.success && responseData.data) {
        const transformedUser = this.convertSingleUserToRoleFormat(
          responseData.data,
        );
        return {
          isSuccessful: true,
          user: transformedUser,
          errorMessage: null,
          validationErrors: null,
        };
      }

      return {
        isSuccessful: false,
        user: null,
        errorMessage: responseData.message || 'User not located',
        validationErrors: responseData.errors || null,
      };
    } catch (apiError) {
      return this.buildSingleUserErrorResponse(apiError);
    }
  }

  /**
   * Updates the role assignments for a specific user
   */
  public static async modifyUserRoleAssignments(
    userId: string,
    roleIdentifiers: string[],
  ): Promise<BooleanResponse> {
    try {
      const apiResponse = await microservicesClient.identity.request({
        path: `/identity/v1/Users/${userId}/Roles`,
        method: 'PUT',
        body: roleIdentifiers,
        secure: true,
        type: ContentType.Json,
        format: 'json',
      });

      return apiResponse.data as BooleanResponse;
    } catch (apiError: any) {
      return {
        success: false,
        data: false,
        message: apiError.message || 'Role assignment update failed',
        errors: [apiError.message || 'Unknown error occurred'],
      };
    }
  }

  /**
   * Transforms raw API user data into the management format
   */
  private static convertToUserRoleFormat(
    rawUserData: any[],
  ): UserWithRoleAssignments[] {
    return rawUserData.map((rawUser) =>
      this.convertSingleUserToRoleFormat(rawUser),
    );
  }

  /**
   * Transforms a single user from API format to management format
   */
  private static convertSingleUserToRoleFormat(
    rawUser: any,
  ): UserWithRoleAssignments {
    return {
      userId: rawUser.id || rawUser.ID || '',
      userEmail: rawUser.email || '',
      isActive: rawUser.activated || false,
      assignedRoles: this.extractRoleAssignments(rawUser.roles || []),
      accountCreationDate: rawUser.createdDate || '',
    };
  }

  /**
   * Extracts and formats role information from raw data
   */
  private static extractRoleAssignments(rawRoles: any[]): RoleAssignment[] {
    return rawRoles.map((rawRole) => ({
      roleId: rawRole.id || '',
      roleName: rawRole.name || '',
      roleDetails: rawRole.description || '',
    }));
  }

  /**
   * Builds a standardized error response for collections
   */
  private static buildErrorResponse(error: any): UserCollectionResponse {
    const errorMsg =
      error?.response?.data?.message || error.message || 'Request failed';
    const errors = error?.response?.data?.errors || [
      error.message || 'Unknown error',
    ];

    return {
      isSuccessful: false,
      users: null,
      errorMessage: errorMsg,
      validationErrors: errors,
    };
  }

  /**
   * Builds a standardized error response for single user
   */
  private static buildSingleUserErrorResponse(error: any): SingleUserResponse {
    const errorMsg =
      error?.response?.data?.message || error.message || 'Request failed';
    const errors = error?.response?.data?.errors || [
      error.message || 'Unknown error',
    ];

    return {
      isSuccessful: false,
      user: null,
      errorMessage: errorMsg,
      validationErrors: errors,
    };
  }
}
