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

/** @format int32 */
export enum SectionType {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
}

/** @format int32 */
export enum FieldType {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
  Value6 = 6,
  Value7 = 7,
}

/** @format int32 */
export enum DocumentType {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
}

export interface DocumentInputField {
  fieldType?: FieldType;
  pathToValue?: string | null;
  options?: InputFieldOption[] | null;
}

export interface DocumentSection {
  sectionType?: SectionType;
  inputFields?: DocumentInputField[] | null;
  documentSections?: DocumentSection[] | null;
  sectionContent?: string | null;
}

export interface DocumentTemplate {
  id?: string | null;
  name?: string | null;
  documentType?: DocumentType;
  documentSections?: DocumentSection[] | null;
}

export interface InputFieldOption {
  name?: string | null;
  value?: string | null;
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
      body != null && typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body != null && typeof body !== "string"
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
 * @title Documents
 * @version Documents
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  documents = {
    /**
     * No description
     *
     * @tags Documents
     * @name V1DocumentsList
     * @request GET:/documents/v1/Documents
     * @secure
     */
    v1DocumentsList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/documents/v1/Documents`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Documents
     * @name V1DocumentsHelloList
     * @request GET:/documents/v1/Documents/Hello
     * @secure
     */
    v1DocumentsHelloList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/documents/v1/Documents/Hello`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  documentTemplates = {
    /**
     * No description
     *
     * @tags DocumentTemplates
     * @name V1DocumentTemplatesList
     * @request GET:/documents/v1/DocumentTemplates
     * @secure
     */
    v1DocumentTemplatesList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/documents/v1/DocumentTemplates`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags DocumentTemplates
     * @name V1DocumentTemplatesCreate
     * @request POST:/documents/v1/DocumentTemplates
     * @secure
     */
    v1DocumentTemplatesCreate: (
      data: DocumentTemplate,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/documents/v1/DocumentTemplates`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags DocumentTemplates
     * @name V1DocumentTemplatesUpdate
     * @request PUT:/documents/v1/DocumentTemplates
     * @secure
     */
    v1DocumentTemplatesUpdate: (
      data: DocumentTemplate,
      query?: {
        Id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/documents/v1/DocumentTemplates`,
        method: "PUT",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags DocumentTemplates
     * @name V1DocumentTemplatesDetail
     * @request GET:/documents/v1/DocumentTemplates/{id}
     * @secure
     */
    v1DocumentTemplatesDetail: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/documents/v1/DocumentTemplates/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags DocumentTemplates
     * @name V1DocumentTemplatesHelloList
     * @request GET:/documents/v1/DocumentTemplates/Hello
     * @secure
     */
    v1DocumentTemplatesHelloList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/documents/v1/DocumentTemplates/Hello`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  invoices = {
    /**
     * No description
     *
     * @tags Invoices
     * @name V1InvoicesHelloList
     * @request GET:/documents/v1/Invoices/Hello
     * @secure
     */
    v1InvoicesHelloList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/documents/v1/Invoices/Hello`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
}

// Aliased exports for unified API client
export { Api as DocumentsApi, ContentType as DocumentsContentType, HttpClient as DocumentsHttpClient };

// Injected secure_key header interceptor
if (typeof Api === 'function' && Api.prototype && Api.prototype.instance) {
  const secureKey = process.env.REACT_APP_API_SECURE_KEY || (typeof window !== 'undefined' ? window.REACT_APP_API_SECURE_KEY : undefined);
  if (secureKey && Api.prototype.instance && Api.prototype.instance.interceptors && Api.prototype.instance.interceptors.request) {
    Api.prototype.instance.interceptors.request.use((config) => {
      if (!config.headers) config.headers = {};
      config.headers['secure_key'] = secureKey;
      return config;
    });
  }
}
