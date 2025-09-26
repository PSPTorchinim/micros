/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ActivateAccountRequestDTO {
  email?: string | null;
  activationCode?: string | null;
}

export interface AddPermissionDTO {
  name?: string | null;
  description?: string | null;
}

export interface AddRoleRequest {
  name?: string | null;
  description?: string | null;
  permissions?: string[] | null;
}

export interface Block {
  /** @format uuid */
  id?: string;
  /** @format date-time */
  createdDate?: string;
  /** @format date-time */
  to?: string | null;
  reason?: string | null;
  deactivated?: boolean;
  pernament?: boolean;
  /** @format date-time */
  deactivationTime?: string | null;
}

export interface BlockUserDTO {
  /** @format uuid */
  userId?: string;
  /** @format date-time */
  to?: string | null;
  reason?: string | null;
  pernament?: boolean;
}

export interface BooleanResponse {
  success?: boolean;
  data?: boolean;
  message?: string | null;
  errors?: string[] | null;
}

export interface ChangePasswordRequestDTO {
  oldPassword?: string | null;
  newPassword?: string | null;
}

export interface ForgotPasswordRequestDTO {
  email?: string | null;
}

export interface GetPermissionDTO {
  name?: string | null;
  description?: string | null;
}

export interface GetPermissionDTOResponse {
  success?: boolean;
  data?: GetPermissionDTO;
  message?: string | null;
  errors?: string[] | null;
}

export interface GetPermissionsDTO {
  /** @format uuid */
  id?: string;
  name?: string | null;
  description?: string | null;
}

export interface GetPermissionsDTOIEnumerableResponse {
  success?: boolean;
  data?: GetPermissionsDTO[] | null;
  message?: string | null;
  errors?: string[] | null;
}

export interface GetRoleDTO {
  /** @format uuid */
  id?: string;
  name?: string | null;
  description?: string | null;
  permissions?: GetPermissionsDTO[] | null;
}

export interface GetUserDTO {
  /** @format uuid */
  id?: string;
  email?: string | null;
  activated?: boolean;
  roles?: GetRoleDTO[] | null;
}

export interface LoginResponseDTO {
  accessToken?: string | null;
  refreshToken?: string | null;
  user?: GetUserDTO;
}

export interface LoginResponseDTOResponse {
  success?: boolean;
  data?: LoginResponseDTO;
  message?: string | null;
  errors?: string[] | null;
}

export interface LoginUserRequestDTO {
  email?: string | null;
  password?: string | null;
}

export interface Password {
  /** @format uuid */
  id?: string;
  user?: User;
  /** @format uuid */
  userId?: string;
  value?: string | null;
  /** @format date-time */
  createdDate?: string;
}

export interface Permission {
  /** @format uuid */
  id?: string;
  name?: string | null;
  description?: string | null;
  roles?: Role[] | null;
  /** @format date-time */
  createdDate?: string;
}

export interface RegisterUserRequestDTO {
  email?: string | null;
  username?: string | null;
  password?: string | null;
}

export interface Role {
  /** @format uuid */
  id?: string;
  name?: string | null;
  description?: string | null;
  users?: User[] | null;
  permissions?: Permission[] | null;
  /** @format date-time */
  createdDate?: string;
}

export interface RoleIEnumerableResponse {
  success?: boolean;
  data?: Role[] | null;
  message?: string | null;
  errors?: string[] | null;
}

export interface RoleResponse {
  success?: boolean;
  data?: Role;
  message?: string | null;
  errors?: string[] | null;
}

export interface User {
  /** @format uuid */
  id?: string;
  email?: string | null;
  activated?: boolean;
  activationCode?: string | null;
  token?: string | null;
  refreshToken?: string | null;
  roles?: Role[] | null;
  passwords?: Password[] | null;
  blocks?: Block[] | null;
  /** @format date-time */
  createdDate?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Identity
 * @version Identity
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  permissions = {
    /**
     * No description
     *
     * @tags Permissions
     * @name ApiV1PermissionsList
     * @request GET:/identity/api/v1/Permissions
     * @secure
     */
    apiV1PermissionsList: (params: RequestParams = {}) =>
      this.request<GetPermissionsDTOIEnumerableResponse, any>({
        path: `/identity/api/v1/Permissions`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Permissions
     * @name ApiV1PermissionsCreate
     * @request POST:/identity/api/v1/Permissions
     * @secure
     */
    apiV1PermissionsCreate: (
      data: AddPermissionDTO,
      params: RequestParams = {},
    ) =>
      this.request<BooleanResponse, any>({
        path: `/identity/api/v1/Permissions`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Permissions
     * @name ApiV1PermissionsDetail
     * @request GET:/identity/api/v1/Permissions/{id}
     * @secure
     */
    apiV1PermissionsDetail: (id: string, params: RequestParams = {}) =>
      this.request<GetPermissionDTOResponse, any>({
        path: `/identity/api/v1/Permissions/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Permissions
     * @name ApiV1PermissionsHelloList
     * @request GET:/identity/api/v1/Permissions/Hello
     * @secure
     */
    apiV1PermissionsHelloList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/identity/api/v1/Permissions/Hello`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  roles = {
    /**
     * No description
     *
     * @tags Roles
     * @name ApiV1RolesList
     * @request GET:/identity/api/v1/Roles
     * @secure
     */
    apiV1RolesList: (params: RequestParams = {}) =>
      this.request<RoleIEnumerableResponse, any>({
        path: `/identity/api/v1/Roles`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Roles
     * @name ApiV1RolesCreate
     * @request POST:/identity/api/v1/Roles
     * @secure
     */
    apiV1RolesCreate: (data: AddRoleRequest, params: RequestParams = {}) =>
      this.request<BooleanResponse, any>({
        path: `/identity/api/v1/Roles`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Roles
     * @name ApiV1RolesDetail
     * @request GET:/identity/api/v1/Roles/{id}
     * @secure
     */
    apiV1RolesDetail: (id: string, params: RequestParams = {}) =>
      this.request<RoleResponse, any>({
        path: `/identity/api/v1/Roles/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Roles
     * @name ApiV1RolesUpdate
     * @request PUT:/identity/api/v1/Roles/{id}
     * @secure
     */
    apiV1RolesUpdate: (
      id: string,
      data: AddRoleRequest,
      params: RequestParams = {},
    ) =>
      this.request<BooleanResponse, any>({
        path: `/identity/api/v1/Roles/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Roles
     * @name ApiV1RolesDelete
     * @request DELETE:/identity/api/v1/Roles/{id}
     * @secure
     */
    apiV1RolesDelete: (id: string, params: RequestParams = {}) =>
      this.request<BooleanResponse, any>({
        path: `/identity/api/v1/Roles/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Roles
     * @name ApiV1RolesHelloList
     * @request GET:/identity/api/v1/Roles/Hello
     * @secure
     */
    apiV1RolesHelloList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/identity/api/v1/Roles/Hello`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags Users
     * @name ApiV1UsersLoginCreate
     * @request POST:/identity/api/v1/Users/Login
     * @secure
     */
    apiV1UsersLoginCreate: (
      data: LoginUserRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<LoginResponseDTOResponse, any>({
        path: `/identity/api/v1/Users/Login`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name ApiV1UsersRegisterCreate
     * @request POST:/identity/api/v1/Users/Register
     * @secure
     */
    apiV1UsersRegisterCreate: (
      data: RegisterUserRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<BooleanResponse, any>({
        path: `/identity/api/v1/Users/Register`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name ApiV1UsersMeList
     * @request GET:/identity/api/v1/Users/Me
     * @secure
     */
    apiV1UsersMeList: (params: RequestParams = {}) =>
      this.request<LoginResponseDTOResponse, any>({
        path: `/identity/api/v1/Users/Me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name ApiV1UsersRefreshTokenList
     * @request GET:/identity/api/v1/Users/RefreshToken
     * @secure
     */
    apiV1UsersRefreshTokenList: (params: RequestParams = {}) =>
      this.request<LoginResponseDTOResponse, any>({
        path: `/identity/api/v1/Users/RefreshToken`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name ApiV1UsersBlockUpdate
     * @request PUT:/identity/api/v1/Users/Block
     * @secure
     */
    apiV1UsersBlockUpdate: (data: BlockUserDTO, params: RequestParams = {}) =>
      this.request<BooleanResponse, any>({
        path: `/identity/api/v1/Users/Block`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name ApiV1UsersChangePasswordUpdate
     * @request PUT:/identity/api/v1/Users/ChangePassword
     * @secure
     */
    apiV1UsersChangePasswordUpdate: (
      data: ChangePasswordRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<BooleanResponse, any>({
        path: `/identity/api/v1/Users/ChangePassword`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name ApiV1UsersForgotPasswordUpdate
     * @request PUT:/identity/api/v1/Users/ForgotPassword
     * @secure
     */
    apiV1UsersForgotPasswordUpdate: (
      data: ForgotPasswordRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<BooleanResponse, any>({
        path: `/identity/api/v1/Users/ForgotPassword`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name ApiV1UsersActivateAccountUpdate
     * @request PUT:/identity/api/v1/Users/ActivateAccount
     * @secure
     */
    apiV1UsersActivateAccountUpdate: (
      data: ActivateAccountRequestDTO,
      params: RequestParams = {},
    ) =>
      this.request<BooleanResponse, any>({
        path: `/identity/api/v1/Users/ActivateAccount`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name ApiV1UsersHelloList
     * @request GET:/identity/api/v1/Users/Hello
     * @secure
     */
    apiV1UsersHelloList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/identity/api/v1/Users/Hello`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
}
