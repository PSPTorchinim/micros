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

export interface Error {
  data?: object | object[] | null;
  error: {
    status?: number;
    name?: string;
    message?: string;
    details?: object;
  };
}

export interface ConfigurationRequest {
  data: {
    Title?: string;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface ConfigurationListResponse {
  data?: Configuration[];
  meta?: {
    pagination?: {
      page?: number;
      /** @min 25 */
      pageSize?: number;
      /** @max 1 */
      pageCount?: number;
      total?: number;
    };
  };
}

export interface Configuration {
  id?: number;
  documentId?: string;
  Title?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  /** @format date-time */
  publishedAt?: string;
  createdBy?: {
    id?: number;
    documentId?: string;
    firstname?: string;
    lastname?: string;
    username?: string;
    /** @format email */
    email?: string;
    resetPasswordToken?: string;
    registrationToken?: string;
    isActive?: boolean;
    roles?: {
      id?: number;
      documentId?: string;
      name?: string;
      code?: string;
      description?: string;
      users?: {
        id?: number;
        documentId?: string;
      }[];
      permissions?: {
        id?: number;
        documentId?: string;
        action?: string;
        actionParameters?: any;
        subject?: string;
        properties?: any;
        conditions?: any;
        role?: {
          id?: number;
          documentId?: string;
        };
        /** @format date-time */
        createdAt?: string;
        /** @format date-time */
        updatedAt?: string;
        /** @format date-time */
        publishedAt?: string;
        createdBy?: {
          id?: number;
          documentId?: string;
        };
        updatedBy?: {
          id?: number;
          documentId?: string;
        };
        locale?: string;
        localizations?: {
          id?: number;
          documentId?: string;
        }[];
      }[];
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: number;
        documentId?: string;
      };
      updatedBy?: {
        id?: number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: number;
        documentId?: string;
      }[];
    }[];
    blocked?: boolean;
    preferedLanguage?: string;
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: number;
      documentId?: string;
    };
    updatedBy?: {
      id?: number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: number;
      documentId?: string;
    }[];
  };
  updatedBy?: {
    id?: number;
    documentId?: string;
  };
  locale?: string;
  localizations?: {
    id?: number;
    documentId?: string;
    Title?: string;
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: number;
      documentId?: string;
    };
    updatedBy?: {
      id?: number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: number;
      documentId?: string;
    }[];
  }[];
}

export interface ConfigurationResponse {
  data?: Configuration;
  meta?: object;
}

export interface PageRequest {
  data: {
    Title?: string;
    Slug?: string;
    Visible?: boolean;
    subpages?: (number | string)[];
    Parents?: (number | string)[];
    /** @example "string or id" */
    configuration?: number | string;
    Menu?: PageRequestMenuEnum;
    NavigationOrder?: number;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface PageListResponse {
  data?: Page[];
  meta?: {
    pagination?: {
      page?: number;
      /** @min 25 */
      pageSize?: number;
      /** @max 1 */
      pageCount?: number;
      total?: number;
    };
  };
}

export interface Page {
  id?: number;
  documentId?: string;
  Title?: string;
  Slug?: string;
  Visible?: boolean;
  subpages?: {
    id?: number;
    documentId?: string;
    Title?: string;
    Slug?: string;
    Visible?: boolean;
    subpages?: {
      id?: number;
      documentId?: string;
    }[];
    Parents?: {
      id?: number;
      documentId?: string;
    }[];
    configuration?: {
      id?: number;
      documentId?: string;
      Title?: string;
      /** @format date-time */
      createdAt?: string;
      /** @format date-time */
      updatedAt?: string;
      /** @format date-time */
      publishedAt?: string;
      createdBy?: {
        id?: number;
        documentId?: string;
        firstname?: string;
        lastname?: string;
        username?: string;
        /** @format email */
        email?: string;
        resetPasswordToken?: string;
        registrationToken?: string;
        isActive?: boolean;
        roles?: {
          id?: number;
          documentId?: string;
          name?: string;
          code?: string;
          description?: string;
          users?: {
            id?: number;
            documentId?: string;
          }[];
          permissions?: {
            id?: number;
            documentId?: string;
            action?: string;
            actionParameters?: any;
            subject?: string;
            properties?: any;
            conditions?: any;
            role?: {
              id?: number;
              documentId?: string;
            };
            /** @format date-time */
            createdAt?: string;
            /** @format date-time */
            updatedAt?: string;
            /** @format date-time */
            publishedAt?: string;
            createdBy?: {
              id?: number;
              documentId?: string;
            };
            updatedBy?: {
              id?: number;
              documentId?: string;
            };
            locale?: string;
            localizations?: {
              id?: number;
              documentId?: string;
            }[];
          }[];
          /** @format date-time */
          createdAt?: string;
          /** @format date-time */
          updatedAt?: string;
          /** @format date-time */
          publishedAt?: string;
          createdBy?: {
            id?: number;
            documentId?: string;
          };
          updatedBy?: {
            id?: number;
            documentId?: string;
          };
          locale?: string;
          localizations?: {
            id?: number;
            documentId?: string;
          }[];
        }[];
        blocked?: boolean;
        preferedLanguage?: string;
        /** @format date-time */
        createdAt?: string;
        /** @format date-time */
        updatedAt?: string;
        /** @format date-time */
        publishedAt?: string;
        createdBy?: {
          id?: number;
          documentId?: string;
        };
        updatedBy?: {
          id?: number;
          documentId?: string;
        };
        locale?: string;
        localizations?: {
          id?: number;
          documentId?: string;
        }[];
      };
      updatedBy?: {
        id?: number;
        documentId?: string;
      };
      locale?: string;
      localizations?: {
        id?: number;
        documentId?: string;
      }[];
    };
    Menu?: PageMenuEnum;
    NavigationOrder?: number;
    /** @format date-time */
    createdAt?: string;
    /** @format date-time */
    updatedAt?: string;
    /** @format date-time */
    publishedAt?: string;
    createdBy?: {
      id?: number;
      documentId?: string;
    };
    updatedBy?: {
      id?: number;
      documentId?: string;
    };
    locale?: string;
    localizations?: {
      id?: number;
      documentId?: string;
    }[];
  }[];
  Parents?: {
    id?: number;
    documentId?: string;
  }[];
  configuration?: {
    id?: number;
    documentId?: string;
  };
  Menu?: PageMenuEnum1;
  NavigationOrder?: number;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  /** @format date-time */
  publishedAt?: string;
  createdBy?: {
    id?: number;
    documentId?: string;
  };
  updatedBy?: {
    id?: number;
    documentId?: string;
  };
  locale?: string;
  localizations?: {
    id?: number;
    documentId?: string;
  }[];
}

export interface PageResponse {
  data?: Page;
  meta?: object;
}

export interface UploadFile {
  id?: number;
  name?: string;
  alternativeText?: string;
  caption?: string;
  /** @format integer */
  width?: number;
  /** @format integer */
  height?: number;
  formats?: number;
  hash?: string;
  ext?: string;
  mime?: string;
  /** @format double */
  size?: number;
  url?: string;
  previewUrl?: string;
  provider?: string;
  provider_metadata?: object;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface UsersPermissionsRole {
  id?: number;
  name?: string;
  description?: string;
  type?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface UsersPermissionsUser {
  /** @example 1 */
  id?: number;
  /** @example "foo.bar" */
  username?: string;
  /** @example "foo.bar@strapi.io" */
  email?: string;
  /** @example "local" */
  provider?: string;
  /** @example true */
  confirmed?: boolean;
  /** @example false */
  blocked?: boolean;
  /**
   * @format date-time
   * @example "2022-06-02T08:32:06.258Z"
   */
  createdAt?: string;
  /**
   * @format date-time
   * @example "2022-06-02T08:32:06.267Z"
   */
  updatedAt?: string;
}

export interface UsersPermissionsUserRegistration {
  /** @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" */
  jwt?: string;
  user?: UsersPermissionsUser;
}

export type UsersPermissionsPermissionsTree = Record<
  string,
  {
    /** every controller of the api */
    controllers?: Record<
      string,
      Record<
        string,
        {
          enabled?: boolean;
          policy?: string;
        }
      >
    >;
  }
>;

export enum PageRequestMenuEnum {
  Main = "Main",
  Login = "Login",
}

export enum PageMenuEnum {
  Main = "Main",
  Login = "Login",
}

export enum PageMenuEnum1 {
  Main = "Main",
  Login = "Login",
}

export enum OkEnum {
  True = true,
}

export enum SentEnum {
  True = true,
}

export enum OkEnum1 {
  True = true,
}

export enum OkEnum2 {
  True = true,
}

export enum OkEnum3 {
  True = true,
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
      baseURL: axiosConfig.baseURL || "http://localhost:1337/api",
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
 * @title DJ Beat Blaster CMS API
 * @version 1.0.0
 * @license Apache 2.0 (https://www.apache.org/licenses/LICENSE-2.0.html)
 * @termsOfService YOUR_TERMS_OF_SERVICE_URL
 * @baseUrl http://localhost:1337/api
 * @externalDocs https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html
 * @contact DJ Beat Blaster Team <support@djbeatblaster.com> (mywebsite.io)
 *
 * API documentation for DJ Beat Blaster CMS with JSON schemas
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  configuration = {
    /**
     * No description
     *
     * @tags Configuration
     * @name GetConfigurations
     * @request GET:/configurations
     * @secure
     */
    getConfigurations: (
      query?: {
        /** Sort by attributes ascending (asc) or descending (desc) */
        sort?: string;
        /** Return page/pageSize (default: true) */
        "pagination[withCount]"?: boolean;
        /** Page number (default: 0) */
        "pagination[page]"?: number;
        /** Page size (default: 25) */
        "pagination[pageSize]"?: number;
        /** Offset value (default: 0) */
        "pagination[start]"?: number;
        /** Number of entities to return (default: 25) */
        "pagination[limit]"?: number;
        /** Fields to return (ex: title,author) */
        fields?: string;
        /** Relations to return */
        populate?: string;
        /** Filters to apply */
        filters?: Record<string, any>;
        /** Locale to apply */
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ConfigurationListResponse, Error>({
        path: `/configurations`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name PostConfigurations
     * @request POST:/configurations
     * @secure
     */
    postConfigurations: (
      data: ConfigurationRequest,
      params: RequestParams = {},
    ) =>
      this.request<ConfigurationResponse, Error>({
        path: `/configurations`,
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
     * @tags Configuration
     * @name GetConfigurationsId
     * @request GET:/configurations/{id}
     * @secure
     */
    getConfigurationsId: (id: number, params: RequestParams = {}) =>
      this.request<ConfigurationResponse, Error>({
        path: `/configurations/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Configuration
     * @name PutConfigurationsId
     * @request PUT:/configurations/{id}
     * @secure
     */
    putConfigurationsId: (
      id: number,
      data: ConfigurationRequest,
      params: RequestParams = {},
    ) =>
      this.request<ConfigurationResponse, Error>({
        path: `/configurations/${id}`,
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
     * @tags Configuration
     * @name DeleteConfigurationsId
     * @request DELETE:/configurations/{id}
     * @secure
     */
    deleteConfigurationsId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/configurations/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  page = {
    /**
     * No description
     *
     * @tags Page
     * @name GetPages
     * @request GET:/pages
     * @secure
     */
    getPages: (
      query?: {
        /** Sort by attributes ascending (asc) or descending (desc) */
        sort?: string;
        /** Return page/pageSize (default: true) */
        "pagination[withCount]"?: boolean;
        /** Page number (default: 0) */
        "pagination[page]"?: number;
        /** Page size (default: 25) */
        "pagination[pageSize]"?: number;
        /** Offset value (default: 0) */
        "pagination[start]"?: number;
        /** Number of entities to return (default: 25) */
        "pagination[limit]"?: number;
        /** Fields to return (ex: title,author) */
        fields?: string;
        /** Relations to return */
        populate?: string;
        /** Filters to apply */
        filters?: Record<string, any>;
        /** Locale to apply */
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PageListResponse, Error>({
        path: `/pages`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Page
     * @name PostPages
     * @request POST:/pages
     * @secure
     */
    postPages: (data: PageRequest, params: RequestParams = {}) =>
      this.request<PageResponse, Error>({
        path: `/pages`,
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
     * @tags Page
     * @name GetPagesId
     * @request GET:/pages/{id}
     * @secure
     */
    getPagesId: (id: number, params: RequestParams = {}) =>
      this.request<PageResponse, Error>({
        path: `/pages/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Page
     * @name PutPagesId
     * @request PUT:/pages/{id}
     * @secure
     */
    putPagesId: (id: number, data: PageRequest, params: RequestParams = {}) =>
      this.request<PageResponse, Error>({
        path: `/pages/${id}`,
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
     * @tags Page
     * @name DeletePagesId
     * @request DELETE:/pages/{id}
     * @secure
     */
    deletePagesId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/pages/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  uploadFile = {
    /**
     * @description Upload files
     *
     * @tags Upload - File
     * @name UploadCreate
     * @request POST:/upload
     * @secure
     */
    uploadCreate: (
      data: {
        /** The folder where the file(s) will be uploaded to (only supported on strapi-provider-upload-aws-s3). */
        path?: string;
        /** The ID of the entry which the file(s) will be linked to */
        refId?: string;
        /** The unique ID (uid) of the model which the file(s) will be linked to (api::restaurant.restaurant). */
        ref?: string;
        /** The field of the entry which the file(s) will be precisely linked to. */
        field?: string;
        files: File[];
      },
      params: RequestParams = {},
    ) =>
      this.request<UploadFile[], any>({
        path: `/upload`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Upload file information
     *
     * @tags Upload - File
     * @name UploadIdCreate
     * @request POST:/upload?id={id}
     * @secure
     */
    uploadIdCreate: (
      id: string,
      query: {
        /** File id */
        id: string;
      },
      data: {
        fileInfo?: {
          name?: string;
          alternativeText?: string;
          caption?: string;
        };
        /** @format binary */
        files?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<UploadFile[], any>({
        path: `/upload?id=${id}`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Upload - File
     * @name FilesList
     * @request GET:/upload/files
     * @secure
     */
    filesList: (params: RequestParams = {}) =>
      this.request<UploadFile[], any>({
        path: `/upload/files`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Upload - File
     * @name FilesDetail
     * @request GET:/upload/files/{id}
     * @secure
     */
    filesDetail: (id: string, params: RequestParams = {}) =>
      this.request<UploadFile, any>({
        path: `/upload/files/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Upload - File
     * @name FilesDelete
     * @request DELETE:/upload/files/{id}
     * @secure
     */
    filesDelete: (id: string, params: RequestParams = {}) =>
      this.request<UploadFile, any>({
        path: `/upload/files/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  usersPermissionsAuth = {
    /**
     * @description Redirects to provider login before being redirect to /auth/{provider}/callback
     *
     * @tags Users-Permissions - Auth
     * @name ConnectDetail
     * @summary Login with a provider
     * @request GET:/connect/{provider}
     * @secure
     */
    connectDetail: (provider: string, params: RequestParams = {}) =>
      this.request<any, void | Error>({
        path: `/connect/${provider}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns a jwt token and user info
     *
     * @tags Users-Permissions - Auth
     * @name LocalCreate
     * @summary Local login
     * @request POST:/auth/local
     * @secure
     */
    localCreate: (
      data: {
        identifier?: string;
        password?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UsersPermissionsUserRegistration, Error>({
        path: `/auth/local`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a jwt token and user info
     *
     * @tags Users-Permissions - Auth
     * @name LocalRegisterCreate
     * @summary Register a user
     * @request POST:/auth/local/register
     * @secure
     */
    localRegisterCreate: (
      data: {
        username?: string;
        email?: string;
        password?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UsersPermissionsUserRegistration, Error>({
        path: `/auth/local/register`,
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
     * @tags Users-Permissions - Auth
     * @name CallbackList
     * @summary Default Callback from provider auth
     * @request GET:/auth/{provider}/callback
     * @secure
     */
    callbackList: (provider: string, params: RequestParams = {}) =>
      this.request<UsersPermissionsUserRegistration, Error>({
        path: `/auth/${provider}/callback`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Auth
     * @name ForgotPasswordCreate
     * @summary Send rest password email
     * @request POST:/auth/forgot-password
     * @secure
     */
    forgotPasswordCreate: (
      data: {
        email?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          ok?: OkEnum;
        },
        Error
      >({
        path: `/auth/forgot-password`,
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
     * @tags Users-Permissions - Auth
     * @name ResetPasswordCreate
     * @summary Rest user password
     * @request POST:/auth/reset-password
     * @secure
     */
    resetPasswordCreate: (
      data: {
        password?: string;
        passwordConfirmation?: string;
        code?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UsersPermissionsUserRegistration, Error>({
        path: `/auth/reset-password`,
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
     * @tags Users-Permissions - Auth
     * @name ChangePasswordCreate
     * @summary Update user's own password
     * @request POST:/auth/change-password
     * @secure
     */
    changePasswordCreate: (
      data: {
        password: string;
        currentPassword: string;
        passwordConfirmation: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UsersPermissionsUserRegistration, Error>({
        path: `/auth/change-password`,
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
     * @tags Users-Permissions - Auth
     * @name EmailConfirmationList
     * @summary Confirm user email
     * @request GET:/auth/email-confirmation
     * @secure
     */
    emailConfirmationList: (
      query?: {
        /** confirmation token received by email */
        confirmation?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, void | Error>({
        path: `/auth/email-confirmation`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Auth
     * @name SendEmailConfirmationCreate
     * @summary Send confirmation email
     * @request POST:/auth/send-email-confirmation
     * @secure
     */
    sendEmailConfirmationCreate: (
      data: {
        email?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          email?: string;
          sent?: SentEnum;
        },
        Error
      >({
        path: `/auth/send-email-confirmation`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  usersPermissionsUsersRoles = {
    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name PermissionsList
     * @summary Get default generated permissions
     * @request GET:/users-permissions/permissions
     * @secure
     */
    permissionsList: (params: RequestParams = {}) =>
      this.request<
        {
          permissions?: UsersPermissionsPermissionsTree;
        },
        Error
      >({
        path: `/users-permissions/permissions`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name RolesList
     * @summary List roles
     * @request GET:/users-permissions/roles
     * @secure
     */
    rolesList: (params: RequestParams = {}) =>
      this.request<
        {
          roles?: (UsersPermissionsRole & {
            nb_users?: number;
          })[];
        },
        Error
      >({
        path: `/users-permissions/roles`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name RolesCreate
     * @summary Create a role
     * @request POST:/users-permissions/roles
     * @secure
     */
    rolesCreate: (
      data: {
        name?: string;
        description?: string;
        type?: string;
        permissions?: UsersPermissionsPermissionsTree;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          ok?: OkEnum1;
        },
        Error
      >({
        path: `/users-permissions/roles`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name RolesDetail
     * @summary Get a role
     * @request GET:/users-permissions/roles/{id}
     * @secure
     */
    rolesDetail: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          role?: UsersPermissionsRole;
        },
        Error
      >({
        path: `/users-permissions/roles/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name RolesUpdate
     * @summary Update a role
     * @request PUT:/users-permissions/roles/{role}
     * @secure
     */
    rolesUpdate: (
      role: string,
      data: {
        name?: string;
        description?: string;
        type?: string;
        permissions?: UsersPermissionsPermissionsTree;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          ok?: OkEnum2;
        },
        Error
      >({
        path: `/users-permissions/roles/${role}`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name RolesDelete
     * @summary Delete a role
     * @request DELETE:/users-permissions/roles/{role}
     * @secure
     */
    rolesDelete: (role: string, params: RequestParams = {}) =>
      this.request<
        {
          ok?: OkEnum3;
        },
        Error
      >({
        path: `/users-permissions/roles/${role}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name UsersList
     * @summary Get list of users
     * @request GET:/users
     * @secure
     */
    usersList: (params: RequestParams = {}) =>
      this.request<UsersPermissionsUser[], Error>({
        path: `/users`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name UsersCreate
     * @summary Create a user
     * @request POST:/users
     * @secure
     */
    usersCreate: (
      data: {
        email: string;
        username: string;
        password: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        UsersPermissionsUser & {
          role?: UsersPermissionsRole;
        },
        Error
      >({
        path: `/users`,
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
     * @tags Users-Permissions - Users & Roles
     * @name UsersDetail
     * @summary Get a user
     * @request GET:/users/{id}
     * @secure
     */
    usersDetail: (id: string, params: RequestParams = {}) =>
      this.request<UsersPermissionsUser, Error>({
        path: `/users/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name UsersUpdate
     * @summary Update a user
     * @request PUT:/users/{id}
     * @secure
     */
    usersUpdate: (
      id: string,
      data: {
        email: string;
        username: string;
        password: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        UsersPermissionsUser & {
          role?: UsersPermissionsRole;
        },
        Error
      >({
        path: `/users/${id}`,
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
     * @tags Users-Permissions - Users & Roles
     * @name UsersDelete
     * @summary Delete a user
     * @request DELETE:/users/{id}
     * @secure
     */
    usersDelete: (id: string, params: RequestParams = {}) =>
      this.request<UsersPermissionsUser, Error>({
        path: `/users/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name GetUsersPermissionsUsersRoles
     * @summary Get authenticated user info
     * @request GET:/users/me
     * @secure
     */
    getUsersPermissionsUsersRoles: (params: RequestParams = {}) =>
      this.request<UsersPermissionsUser, Error>({
        path: `/users/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name CountList
     * @summary Get user count
     * @request GET:/users/count
     * @secure
     */
    countList: (params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/users/count`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
