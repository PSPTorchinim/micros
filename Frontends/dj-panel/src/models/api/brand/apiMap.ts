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

export interface AddCompanyUserDTO {
  /** @format uuid */
  userId: string;
  /** @minLength 1 */
  role: string;
}

export interface CompanyStructureNodeDTO {
  /** @format uuid */
  id?: string;
  /** @minLength 1 */
  name: string;
  /** @minLength 1 */
  type: string;
  /** @format uuid */
  parentId?: string | null;
  children?: CompanyStructureNodeDTO[] | null;
}

export type RegisterBrandDTO = object;

export interface UpdateCompanyDTO {
  /** @minLength 1 */
  name: string;
  /**
   * @format email
   * @minLength 1
   */
  email: string;
  /** @minLength 1 */
  phone: string;
  /** @minLength 1 */
  country: string;
  /** @minLength 1 */
  city: string;
  /** @minLength 1 */
  postCode: string;
  /** @minLength 1 */
  addressLine1: string;
  addressLine2?: string | null;
  logo?: string | null;
}

export interface UpdateCompanyStructureDTO {
  nodes: CompanyStructureNodeDTO[];
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
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
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
 * @title Brand
 * @version Brand
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  brands = {
    /**
     * No description
     *
     * @tags Brands
     * @name V1BrandsList
     * @request GET:/brand/v1/Brands
     * @secure
     */
    v1BrandsList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/brand/v1/Brands`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Brands
     * @name V1BrandsCreate
     * @request POST:/brand/v1/Brands
     * @secure
     */
    v1BrandsCreate: (data: RegisterBrandDTO, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/brand/v1/Brands`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  company = {
    /**
     * No description
     *
     * @tags Company
     * @name V1CompanyList
     * @request GET:/brand/v1/Company
     * @secure
     */
    v1CompanyList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/brand/v1/Company`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Company
     * @name V1CompanyUpdate
     * @request PUT:/brand/v1/Company
     * @secure
     */
    v1CompanyUpdate: (data: UpdateCompanyDTO, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/brand/v1/Company`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Company
     * @name V1CompanyUsersList
     * @request GET:/brand/v1/Company/users
     * @secure
     */
    v1CompanyUsersList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/brand/v1/Company/users`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Company
     * @name V1CompanyUsersCreate
     * @request POST:/brand/v1/Company/users
     * @secure
     */
    v1CompanyUsersCreate: (
      data: AddCompanyUserDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/brand/v1/Company/users`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Company
     * @name V1CompanyUsersDelete
     * @request DELETE:/brand/v1/Company/users/{userId}
     * @secure
     */
    v1CompanyUsersDelete: (userId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/brand/v1/Company/users/${userId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Company
     * @name V1CompanyMembershipList
     * @request GET:/brand/v1/Company/membership
     * @secure
     */
    v1CompanyMembershipList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/brand/v1/Company/membership`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Company
     * @name V1CompanyStructureList
     * @request GET:/brand/v1/Company/structure
     * @secure
     */
    v1CompanyStructureList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/brand/v1/Company/structure`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Company
     * @name V1CompanyStructureUpdate
     * @request PUT:/brand/v1/Company/structure
     * @secure
     */
    v1CompanyStructureUpdate: (
      data: UpdateCompanyStructureDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/brand/v1/Company/structure`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
}

// Aliased exports for unified API client
export { Api as BrandApi, ContentType as BrandContentType, HttpClient as BrandHttpClient };

// Injected secure_key header interceptor
if (typeof Api === 'function' && Api.prototype && Api.prototype.instance) {
  const secureKey = process.env.REACT_APP_API_SECURE_KEY;
  if (secureKey && Api.prototype.instance && Api.prototype.instance.interceptors && Api.prototype.instance.interceptors.request) {
    Api.prototype.instance.interceptors.request.use((config) => {
      if (!config.headers) config.headers = {};
      config.headers['secure_key'] = secureKey;
      return config;
    });
  }
}
