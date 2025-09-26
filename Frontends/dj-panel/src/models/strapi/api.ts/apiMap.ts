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

export interface ApiArticleArticleDocument {
  /**
   * The document ID, represented by a UUID
   * @format uuid
   * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
   */
  documentId: string;
  id: number;
  /** A UID field */
  NameID: string;
  /** A string field */
  Title: string;
  /** A blocks field */
  Content: any[];
  /** A datetime field */
  createdAt?: string;
  /** A datetime field */
  updatedAt?: string;
  /**
   * A datetime field
   * @default "2025-09-26T12:59:12.770Z"
   */
  publishedAt: string;
  /** A string field */
  locale?: string;
  /** A relational field */
  localizations?: ApiArticleArticleDocument[];
}

export interface PluginUploadFileDocument {
  /**
   * The document ID, represented by a UUID
   * @format uuid
   * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
   */
  documentId: string;
  id: number;
  /** A string field */
  name: string;
  /** A string field */
  alternativeText?: string;
  /** A string field */
  caption?: string;
  /**
   * An integer field
   * @min -9007199254740991
   * @max 9007199254740991
   */
  width?: number;
  /**
   * An integer field
   * @min -9007199254740991
   * @max 9007199254740991
   */
  height?: number;
  /** A JSON field */
  formats?: any;
  /** A string field */
  hash: string;
  /** A string field */
  ext?: string;
  /** A string field */
  mime: string;
  /** A decimal field */
  size: number;
  /** A string field */
  url: string;
  /** A string field */
  previewUrl?: string;
  /** A string field */
  provider: string;
  /** A JSON field */
  provider_metadata?: any;
  /** A datetime field */
  createdAt?: string;
  /** A datetime field */
  updatedAt?: string;
  /**
   * A datetime field
   * @default "2025-09-26T12:59:12.790Z"
   */
  publishedAt: string;
  related: any;
}

export interface ApiHeroImageHeroImageDocument {
  /**
   * The document ID, represented by a UUID
   * @format uuid
   * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
   */
  documentId: string;
  id: number;
  /** A string field */
  Name?: string;
  /** An enum field */
  Type?: ApiHeroImageHeroImageDocumentTypeEnum;
  /** A datetime field */
  createdAt?: string;
  /** A datetime field */
  updatedAt?: string;
  /**
   * A datetime field
   * @default "2025-09-26T12:59:12.792Z"
   */
  publishedAt: string;
  /** A string field */
  locale?: string;
  /** A media field */
  MediaSlider?: PluginUploadFileDocument[];
  /** A media field */
  MediaSingle?: PluginUploadFileDocument[];
  /** A relational field */
  localizations?: ApiHeroImageHeroImageDocument[];
}

export interface ApiPagePageDocument {
  /**
   * The document ID, represented by a UUID
   * @format uuid
   * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
   */
  documentId: string;
  id: number;
  /** A UID field */
  PageID: string;
  /** A string field */
  Name: string;
  /** A string field */
  URL: string;
  /** A datetime field */
  createdAt?: string;
  /** A datetime field */
  updatedAt?: string;
  /**
   * A datetime field
   * @default "2025-09-26T12:59:12.814Z"
   */
  publishedAt: string;
  /** A string field */
  locale?: string;
  /** A relational field */
  hero_image?: ApiHeroImageHeroImageDocument;
  /** A relational field */
  subpages?: ApiPagePageDocument[];
  /** A relational field */
  pages?: ApiPagePageDocument[];
  /** A relational field */
  localizations?: ApiPagePageDocument[];
}

/** An enum field */
export enum ApiHeroImageHeroImageDocumentTypeEnum {
  SingleImage = "Single Image",
  SliderImage = "Slider Image",
  SingleVideo = "Single Video",
}

export enum ArticleGetArticlesParamsFieldsEnum {
  NameID = "NameID",
  Title = "Title",
  Content = "Content",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum ArticleGetArticlesParamsFiltersEnum {
  NameID = "NameID",
  Title = "Title",
  Content = "Content",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum ArticleGetArticlesParamsSortEnum {
  NameID = "NameID",
  Title = "Title",
  Content = "Content",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum ArticleGetArticlesParamsSortEnum1 {
  NameID = "NameID",
  Title = "Title",
  Content = "Content",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum ArticleGetArticlesParamsSortEnum2 {
  NameID = "NameID",
  Title = "Title",
  Content = "Content",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum ArticleGetArticlesParamsSortEnum3 {
  Asc = "asc",
  Desc = "desc",
}

export enum ArticleGetArticlesParamsSortEnum4 {
  NameID = "NameID",
  Title = "Title",
  Content = "Content",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum ArticleGetArticlesParamsSortEnum5 {
  Asc = "asc",
  Desc = "desc",
}

/** Populate a single relation, component, file, or dynamic zone */
export enum ArticleGetArticlesParamsPopulateEnum {
  Localizations = "localizations",
}

export enum ArticleGetArticlesParamsPopulateEnum1 {
  Localizations = "localizations",
}

/** Fetch documents based on their status. Default to "published" if not specified. */
export enum ArticleGetArticlesParamsStatusEnum {
  Draft = "draft",
  Published = "published",
}

export enum ArticlePostArticlesParamsFieldsEnum {
  NameID = "NameID",
  Title = "Title",
  Content = "Content",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

/** Populate a single relation, component, file, or dynamic zone */
export enum ArticlePostArticlesParamsPopulateEnum {
  Localizations = "localizations",
}

export enum ArticlePostArticlesParamsPopulateEnum1 {
  Localizations = "localizations",
}

/** Fetch documents based on their status. Default to "published" if not specified. */
export enum ArticlePostArticlesParamsStatusEnum {
  Draft = "draft",
  Published = "published",
}

export enum ArticleGetArticlesByIdParamsFieldsEnum {
  NameID = "NameID",
  Title = "Title",
  Content = "Content",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

/** Populate a single relation, component, file, or dynamic zone */
export enum ArticleGetArticlesByIdParamsPopulateEnum {
  Localizations = "localizations",
}

export enum ArticleGetArticlesByIdParamsPopulateEnum1 {
  Localizations = "localizations",
}

export enum ArticleGetArticlesByIdParamsFiltersEnum {
  NameID = "NameID",
  Title = "Title",
  Content = "Content",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum ArticleGetArticlesByIdParamsSortEnum {
  NameID = "NameID",
  Title = "Title",
  Content = "Content",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum ArticleGetArticlesByIdParamsSortEnum1 {
  NameID = "NameID",
  Title = "Title",
  Content = "Content",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum ArticleGetArticlesByIdParamsSortEnum2 {
  NameID = "NameID",
  Title = "Title",
  Content = "Content",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum ArticleGetArticlesByIdParamsSortEnum3 {
  Asc = "asc",
  Desc = "desc",
}

export enum ArticleGetArticlesByIdParamsSortEnum4 {
  NameID = "NameID",
  Title = "Title",
  Content = "Content",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum ArticleGetArticlesByIdParamsSortEnum5 {
  Asc = "asc",
  Desc = "desc",
}

/** Fetch documents based on their status. Default to "published" if not specified. */
export enum ArticleGetArticlesByIdParamsStatusEnum {
  Draft = "draft",
  Published = "published",
}

export enum ArticlePutArticlesByIdParamsFieldsEnum {
  NameID = "NameID",
  Title = "Title",
  Content = "Content",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

/** Populate a single relation, component, file, or dynamic zone */
export enum ArticlePutArticlesByIdParamsPopulateEnum {
  Localizations = "localizations",
}

export enum ArticlePutArticlesByIdParamsPopulateEnum1 {
  Localizations = "localizations",
}

/** Fetch documents based on their status. Default to "published" if not specified. */
export enum ArticlePutArticlesByIdParamsStatusEnum {
  Draft = "draft",
  Published = "published",
}

export enum ArticleDeleteArticlesByIdParamsFieldsEnum {
  NameID = "NameID",
  Title = "Title",
  Content = "Content",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

/** Populate a single relation, component, file, or dynamic zone */
export enum ArticleDeleteArticlesByIdParamsPopulateEnum {
  Localizations = "localizations",
}

export enum ArticleDeleteArticlesByIdParamsPopulateEnum1 {
  Localizations = "localizations",
}

export enum ArticleDeleteArticlesByIdParamsFiltersEnum {
  NameID = "NameID",
  Title = "Title",
  Content = "Content",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

/** Fetch documents based on their status. Default to "published" if not specified. */
export enum ArticleDeleteArticlesByIdParamsStatusEnum {
  Draft = "draft",
  Published = "published",
}

/** An enum field */
export enum HeroImageGetHeroImagesTypeEnum {
  SingleImage = "Single Image",
  SliderImage = "Slider Image",
  SingleVideo = "Single Video",
}

export enum HeroImageGetHeroImagesParamsFieldsEnum {
  Name = "Name",
  Type = "Type",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum HeroImageGetHeroImagesParamsFiltersEnum {
  Name = "Name",
  Type = "Type",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum HeroImageGetHeroImagesParamsSortEnum {
  Name = "Name",
  Type = "Type",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum HeroImageGetHeroImagesParamsSortEnum1 {
  Name = "Name",
  Type = "Type",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum HeroImageGetHeroImagesParamsSortEnum2 {
  Name = "Name",
  Type = "Type",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum HeroImageGetHeroImagesParamsSortEnum3 {
  Asc = "asc",
  Desc = "desc",
}

export enum HeroImageGetHeroImagesParamsSortEnum4 {
  Name = "Name",
  Type = "Type",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum HeroImageGetHeroImagesParamsSortEnum5 {
  Asc = "asc",
  Desc = "desc",
}

/** Populate a single relation, component, file, or dynamic zone */
export enum HeroImageGetHeroImagesParamsPopulateEnum {
  MediaSlider = "MediaSlider",
  MediaSingle = "MediaSingle",
  Localizations = "localizations",
}

export enum HeroImageGetHeroImagesParamsPopulateEnum1 {
  MediaSlider = "MediaSlider",
  MediaSingle = "MediaSingle",
  Localizations = "localizations",
}

/** Fetch documents based on their status. Default to "published" if not specified. */
export enum HeroImageGetHeroImagesParamsStatusEnum {
  Draft = "draft",
  Published = "published",
}

/** An enum field */
export enum HeroImagePostHeroImagesTypeEnum {
  SingleImage = "Single Image",
  SliderImage = "Slider Image",
  SingleVideo = "Single Video",
}

/** An enum field */
export enum HeroImagePostHeroImagesTypeEnum1 {
  SingleImage = "Single Image",
  SliderImage = "Slider Image",
  SingleVideo = "Single Video",
}

export enum HeroImagePostHeroImagesParamsFieldsEnum {
  Name = "Name",
  Type = "Type",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

/** Populate a single relation, component, file, or dynamic zone */
export enum HeroImagePostHeroImagesParamsPopulateEnum {
  MediaSlider = "MediaSlider",
  MediaSingle = "MediaSingle",
  Localizations = "localizations",
}

export enum HeroImagePostHeroImagesParamsPopulateEnum1 {
  MediaSlider = "MediaSlider",
  MediaSingle = "MediaSingle",
  Localizations = "localizations",
}

/** Fetch documents based on their status. Default to "published" if not specified. */
export enum HeroImagePostHeroImagesParamsStatusEnum {
  Draft = "draft",
  Published = "published",
}

/** An enum field */
export enum HeroImageGetHeroImagesByIdTypeEnum {
  SingleImage = "Single Image",
  SliderImage = "Slider Image",
  SingleVideo = "Single Video",
}

export enum HeroImageGetHeroImagesByIdParamsFieldsEnum {
  Name = "Name",
  Type = "Type",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

/** Populate a single relation, component, file, or dynamic zone */
export enum HeroImageGetHeroImagesByIdParamsPopulateEnum {
  MediaSlider = "MediaSlider",
  MediaSingle = "MediaSingle",
  Localizations = "localizations",
}

export enum HeroImageGetHeroImagesByIdParamsPopulateEnum1 {
  MediaSlider = "MediaSlider",
  MediaSingle = "MediaSingle",
  Localizations = "localizations",
}

export enum HeroImageGetHeroImagesByIdParamsFiltersEnum {
  Name = "Name",
  Type = "Type",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum HeroImageGetHeroImagesByIdParamsSortEnum {
  Name = "Name",
  Type = "Type",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum HeroImageGetHeroImagesByIdParamsSortEnum1 {
  Name = "Name",
  Type = "Type",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum HeroImageGetHeroImagesByIdParamsSortEnum2 {
  Name = "Name",
  Type = "Type",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum HeroImageGetHeroImagesByIdParamsSortEnum3 {
  Asc = "asc",
  Desc = "desc",
}

export enum HeroImageGetHeroImagesByIdParamsSortEnum4 {
  Name = "Name",
  Type = "Type",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum HeroImageGetHeroImagesByIdParamsSortEnum5 {
  Asc = "asc",
  Desc = "desc",
}

/** Fetch documents based on their status. Default to "published" if not specified. */
export enum HeroImageGetHeroImagesByIdParamsStatusEnum {
  Draft = "draft",
  Published = "published",
}

/** An enum field */
export enum HeroImagePutHeroImagesByIdTypeEnum {
  SingleImage = "Single Image",
  SliderImage = "Slider Image",
  SingleVideo = "Single Video",
}

/** An enum field */
export enum HeroImagePutHeroImagesByIdTypeEnum1 {
  SingleImage = "Single Image",
  SliderImage = "Slider Image",
  SingleVideo = "Single Video",
}

export enum HeroImagePutHeroImagesByIdParamsFieldsEnum {
  Name = "Name",
  Type = "Type",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

/** Populate a single relation, component, file, or dynamic zone */
export enum HeroImagePutHeroImagesByIdParamsPopulateEnum {
  MediaSlider = "MediaSlider",
  MediaSingle = "MediaSingle",
  Localizations = "localizations",
}

export enum HeroImagePutHeroImagesByIdParamsPopulateEnum1 {
  MediaSlider = "MediaSlider",
  MediaSingle = "MediaSingle",
  Localizations = "localizations",
}

/** Fetch documents based on their status. Default to "published" if not specified. */
export enum HeroImagePutHeroImagesByIdParamsStatusEnum {
  Draft = "draft",
  Published = "published",
}

/** An enum field */
export enum HeroImageDeleteHeroImagesByIdTypeEnum {
  SingleImage = "Single Image",
  SliderImage = "Slider Image",
  SingleVideo = "Single Video",
}

export enum HeroImageDeleteHeroImagesByIdParamsFieldsEnum {
  Name = "Name",
  Type = "Type",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

/** Populate a single relation, component, file, or dynamic zone */
export enum HeroImageDeleteHeroImagesByIdParamsPopulateEnum {
  MediaSlider = "MediaSlider",
  MediaSingle = "MediaSingle",
  Localizations = "localizations",
}

export enum HeroImageDeleteHeroImagesByIdParamsPopulateEnum1 {
  MediaSlider = "MediaSlider",
  MediaSingle = "MediaSingle",
  Localizations = "localizations",
}

export enum HeroImageDeleteHeroImagesByIdParamsFiltersEnum {
  Name = "Name",
  Type = "Type",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

/** Fetch documents based on their status. Default to "published" if not specified. */
export enum HeroImageDeleteHeroImagesByIdParamsStatusEnum {
  Draft = "draft",
  Published = "published",
}

export enum PageGetPagesParamsFieldsEnum {
  PageID = "PageID",
  Name = "Name",
  URL = "URL",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum PageGetPagesParamsFiltersEnum {
  PageID = "PageID",
  Name = "Name",
  URL = "URL",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum PageGetPagesParamsSortEnum {
  PageID = "PageID",
  Name = "Name",
  URL = "URL",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum PageGetPagesParamsSortEnum1 {
  PageID = "PageID",
  Name = "Name",
  URL = "URL",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum PageGetPagesParamsSortEnum2 {
  PageID = "PageID",
  Name = "Name",
  URL = "URL",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum PageGetPagesParamsSortEnum3 {
  Asc = "asc",
  Desc = "desc",
}

export enum PageGetPagesParamsSortEnum4 {
  PageID = "PageID",
  Name = "Name",
  URL = "URL",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum PageGetPagesParamsSortEnum5 {
  Asc = "asc",
  Desc = "desc",
}

/** Populate a single relation, component, file, or dynamic zone */
export enum PageGetPagesParamsPopulateEnum {
  HeroImage = "hero_image",
  Subpages = "subpages",
  Pages = "pages",
  Localizations = "localizations",
}

export enum PageGetPagesParamsPopulateEnum1 {
  HeroImage = "hero_image",
  Subpages = "subpages",
  Pages = "pages",
  Localizations = "localizations",
}

/** Fetch documents based on their status. Default to "published" if not specified. */
export enum PageGetPagesParamsStatusEnum {
  Draft = "draft",
  Published = "published",
}

export enum PagePostPagesParamsFieldsEnum {
  PageID = "PageID",
  Name = "Name",
  URL = "URL",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

/** Populate a single relation, component, file, or dynamic zone */
export enum PagePostPagesParamsPopulateEnum {
  HeroImage = "hero_image",
  Subpages = "subpages",
  Pages = "pages",
  Localizations = "localizations",
}

export enum PagePostPagesParamsPopulateEnum1 {
  HeroImage = "hero_image",
  Subpages = "subpages",
  Pages = "pages",
  Localizations = "localizations",
}

/** Fetch documents based on their status. Default to "published" if not specified. */
export enum PagePostPagesParamsStatusEnum {
  Draft = "draft",
  Published = "published",
}

export enum PageGetPagesByIdParamsFieldsEnum {
  PageID = "PageID",
  Name = "Name",
  URL = "URL",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

/** Populate a single relation, component, file, or dynamic zone */
export enum PageGetPagesByIdParamsPopulateEnum {
  HeroImage = "hero_image",
  Subpages = "subpages",
  Pages = "pages",
  Localizations = "localizations",
}

export enum PageGetPagesByIdParamsPopulateEnum1 {
  HeroImage = "hero_image",
  Subpages = "subpages",
  Pages = "pages",
  Localizations = "localizations",
}

export enum PageGetPagesByIdParamsFiltersEnum {
  PageID = "PageID",
  Name = "Name",
  URL = "URL",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum PageGetPagesByIdParamsSortEnum {
  PageID = "PageID",
  Name = "Name",
  URL = "URL",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum PageGetPagesByIdParamsSortEnum1 {
  PageID = "PageID",
  Name = "Name",
  URL = "URL",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum PageGetPagesByIdParamsSortEnum2 {
  PageID = "PageID",
  Name = "Name",
  URL = "URL",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum PageGetPagesByIdParamsSortEnum3 {
  Asc = "asc",
  Desc = "desc",
}

export enum PageGetPagesByIdParamsSortEnum4 {
  PageID = "PageID",
  Name = "Name",
  URL = "URL",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

export enum PageGetPagesByIdParamsSortEnum5 {
  Asc = "asc",
  Desc = "desc",
}

/** Fetch documents based on their status. Default to "published" if not specified. */
export enum PageGetPagesByIdParamsStatusEnum {
  Draft = "draft",
  Published = "published",
}

export enum PagePutPagesByIdParamsFieldsEnum {
  PageID = "PageID",
  Name = "Name",
  URL = "URL",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

/** Populate a single relation, component, file, or dynamic zone */
export enum PagePutPagesByIdParamsPopulateEnum {
  HeroImage = "hero_image",
  Subpages = "subpages",
  Pages = "pages",
  Localizations = "localizations",
}

export enum PagePutPagesByIdParamsPopulateEnum1 {
  HeroImage = "hero_image",
  Subpages = "subpages",
  Pages = "pages",
  Localizations = "localizations",
}

/** Fetch documents based on their status. Default to "published" if not specified. */
export enum PagePutPagesByIdParamsStatusEnum {
  Draft = "draft",
  Published = "published",
}

export enum PageDeletePagesByIdParamsFieldsEnum {
  PageID = "PageID",
  Name = "Name",
  URL = "URL",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

/** Populate a single relation, component, file, or dynamic zone */
export enum PageDeletePagesByIdParamsPopulateEnum {
  HeroImage = "hero_image",
  Subpages = "subpages",
  Pages = "pages",
  Localizations = "localizations",
}

export enum PageDeletePagesByIdParamsPopulateEnum1 {
  HeroImage = "hero_image",
  Subpages = "subpages",
  Pages = "pages",
  Localizations = "localizations",
}

export enum PageDeletePagesByIdParamsFiltersEnum {
  PageID = "PageID",
  Name = "Name",
  URL = "URL",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  PublishedAt = "publishedAt",
  Locale = "locale",
}

/** Fetch documents based on their status. Default to "published" if not specified. */
export enum PageDeletePagesByIdParamsStatusEnum {
  Draft = "draft",
  Published = "published",
}

export enum ContentTypeBuilderGetContentTypesKindEnum {
  CollectionType = "collectionType",
  SingleType = "singleType",
}

export enum ContentTypeBuilderGetContentTypesParamsKindEnum {
  CollectionType = "collectionType",
  SingleType = "singleType",
}

export enum ContentTypeBuilderGetContentTypesByUidKindEnum {
  CollectionType = "collectionType",
  SingleType = "singleType",
}

export enum UploadGetFilesParamsSortEnum {
  Asc = "asc",
  Desc = "desc",
}

export enum UploadGetFilesParamsSortEnum1 {
  Asc = "asc",
  Desc = "desc",
}

export enum UsersPermissionsGetUsersParamsSortEnum {
  Asc = "asc",
  Desc = "desc",
}

export enum UsersPermissionsGetUsersParamsSortEnum1 {
  Asc = "asc",
  Desc = "desc",
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
 * @title cms
 * @version 0.1.0
 *
 * API documentation for cms v0.1.0
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  article = {
    /**
     * No description
     *
     * @tags article
     * @name ArticleGetArticles
     * @request GET:/articles
     */
    articleGetArticles: (
      query?: {
        /** The fields to return, this doesn't include populatable fields like relations, components, files, or dynamic zones */
        fields?: ArticleGetArticlesParamsFieldsEnum[];
        /** Filters to apply to the query */
        filters?: Record<ArticleGetArticlesParamsFiltersEnum, any>;
        _q?: string;
        /** Pagination parameters */
        pagination?: {
          /** Include total count in response */
          withCount?: boolean;
        } & (
          | {
              /**
               * Page number (1-based)
               * @exclusiveMin 0
               * @max 9007199254740991
               */
              page: number;
              /**
               * Number of entries per page
               * @exclusiveMin 0
               * @max 9007199254740991
               */
              pageSize: number;
            }
          | {
              /**
               * Number of entries to skip
               * @min 0
               * @max 9007199254740991
               */
              start: number;
              /**
               * Maximum number of entries to return
               * @exclusiveMin 0
               * @max 9007199254740991
               */
              limit: number;
            }
        );
        /** Sort the result */
        sort?:
          | ArticleGetArticlesParamsSortEnum
          | ArticleGetArticlesParamsSortEnum1[]
          | Record<
              ArticleGetArticlesParamsSortEnum2,
              ArticleGetArticlesParamsSortEnum3
            >
          | Record<
              ArticleGetArticlesParamsSortEnum4,
              ArticleGetArticlesParamsSortEnum5
            >[];
        /** Populate all the first level relations, components, files, and dynamic zones for the entry */
        populate?:
          | "*"
          | ArticleGetArticlesParamsPopulateEnum
          | ArticleGetArticlesParamsPopulateEnum1[];
        /** Select a locale */
        locale?: string;
        /** Fetch documents based on their status. Default to "published" if not specified. */
        status?: ArticleGetArticlesParamsStatusEnum;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: {
            /**
             * The document ID, represented by a UUID
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            documentId: string;
            id: number;
            /** A UID field */
            NameID: string;
            /** A string field */
            Title: string;
            /** A blocks field */
            Content: any[];
            /** A datetime field */
            createdAt?: string;
            /** A datetime field */
            updatedAt?: string;
            /**
             * A datetime field
             * @default "2025-09-26T12:59:12.767Z"
             */
            publishedAt: string;
            /** A string field */
            locale?: string;
            /** A relational field */
            localizations?: ApiArticleArticleDocument[];
          }[];
        },
        void
      >({
        path: `/articles`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags article
     * @name ArticlePostArticles
     * @request POST:/articles
     */
    articlePostArticles: (
      data: {
        data: {
          /** A UID field */
          NameID: string;
          /** A string field */
          Title: string;
          /** A blocks field */
          Content: any[];
          /**
           * A datetime field
           * @default "2025-09-26T12:59:12.777Z"
           */
          publishedAt: string;
          /** A string field */
          locale?: string;
        };
      },
      query?: {
        /** The fields to return, this doesn't include populatable fields like relations, components, files, or dynamic zones */
        fields?: ArticlePostArticlesParamsFieldsEnum[];
        /** Populate all the first level relations, components, files, and dynamic zones for the entry */
        populate?:
          | "*"
          | ArticlePostArticlesParamsPopulateEnum
          | ArticlePostArticlesParamsPopulateEnum1[];
        /** Select a locale */
        locale?: string;
        /** Fetch documents based on their status. Default to "published" if not specified. */
        status?: ArticlePostArticlesParamsStatusEnum;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: {
            /**
             * The document ID, represented by a UUID
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            documentId: string;
            id: number;
            /** A UID field */
            NameID: string;
            /** A string field */
            Title: string;
            /** A blocks field */
            Content: any[];
            /** A datetime field */
            createdAt?: string;
            /** A datetime field */
            updatedAt?: string;
            /**
             * A datetime field
             * @default "2025-09-26T12:59:12.778Z"
             */
            publishedAt: string;
            /** A string field */
            locale?: string;
            /** A relational field */
            localizations?: ApiArticleArticleDocument[];
          };
        },
        void
      >({
        path: `/articles`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags article
     * @name ArticleGetArticlesById
     * @request GET:/articles/{id}
     */
    articleGetArticlesById: (
      id: string,
      query?: {
        /** The fields to return, this doesn't include populatable fields like relations, components, files, or dynamic zones */
        fields?: ArticleGetArticlesByIdParamsFieldsEnum[];
        /** Populate all the first level relations, components, files, and dynamic zones for the entry */
        populate?:
          | "*"
          | ArticleGetArticlesByIdParamsPopulateEnum
          | ArticleGetArticlesByIdParamsPopulateEnum1[];
        /** Filters to apply to the query */
        filters?: Record<ArticleGetArticlesByIdParamsFiltersEnum, any>;
        /** Sort the result */
        sort?:
          | ArticleGetArticlesByIdParamsSortEnum
          | ArticleGetArticlesByIdParamsSortEnum1[]
          | Record<
              ArticleGetArticlesByIdParamsSortEnum2,
              ArticleGetArticlesByIdParamsSortEnum3
            >
          | Record<
              ArticleGetArticlesByIdParamsSortEnum4,
              ArticleGetArticlesByIdParamsSortEnum5
            >[];
        /** Select a locale */
        locale?: string;
        /** Fetch documents based on their status. Default to "published" if not specified. */
        status?: ArticleGetArticlesByIdParamsStatusEnum;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: {
            /**
             * The document ID, represented by a UUID
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            documentId: string;
            id: number;
            /** A UID field */
            NameID: string;
            /** A string field */
            Title: string;
            /** A blocks field */
            Content: any[];
            /** A datetime field */
            createdAt?: string;
            /** A datetime field */
            updatedAt?: string;
            /**
             * A datetime field
             * @default "2025-09-26T12:59:12.774Z"
             */
            publishedAt: string;
            /** A string field */
            locale?: string;
            /** A relational field */
            localizations?: ApiArticleArticleDocument[];
          };
        },
        void
      >({
        path: `/articles/${id}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags article
     * @name ArticlePutArticlesById
     * @request PUT:/articles/{id}
     */
    articlePutArticlesById: (
      id: string,
      data: {
        data: {
          /** A UID field */
          NameID?: string;
          /** A string field */
          Title?: string;
          /** A blocks field */
          Content?: any[];
          /**
           * A datetime field
           * @default "2025-09-26T12:59:12.780Z"
           */
          publishedAt?: string;
          /** A string field */
          locale?: string;
        };
      },
      query?: {
        /** The fields to return, this doesn't include populatable fields like relations, components, files, or dynamic zones */
        fields?: ArticlePutArticlesByIdParamsFieldsEnum[];
        /** Populate all the first level relations, components, files, and dynamic zones for the entry */
        populate?:
          | "*"
          | ArticlePutArticlesByIdParamsPopulateEnum
          | ArticlePutArticlesByIdParamsPopulateEnum1[];
        /** Select a locale */
        locale?: string;
        /** Fetch documents based on their status. Default to "published" if not specified. */
        status?: ArticlePutArticlesByIdParamsStatusEnum;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: {
            /**
             * The document ID, represented by a UUID
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            documentId: string;
            id: number;
            /** A UID field */
            NameID: string;
            /** A string field */
            Title: string;
            /** A blocks field */
            Content: any[];
            /** A datetime field */
            createdAt?: string;
            /** A datetime field */
            updatedAt?: string;
            /**
             * A datetime field
             * @default "2025-09-26T12:59:12.781Z"
             */
            publishedAt: string;
            /** A string field */
            locale?: string;
            /** A relational field */
            localizations?: ApiArticleArticleDocument[];
          };
        },
        void
      >({
        path: `/articles/${id}`,
        method: "PUT",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags article
     * @name ArticleDeleteArticlesById
     * @request DELETE:/articles/{id}
     */
    articleDeleteArticlesById: (
      id: string,
      query?: {
        /** The fields to return, this doesn't include populatable fields like relations, components, files, or dynamic zones */
        fields?: ArticleDeleteArticlesByIdParamsFieldsEnum[];
        /** Populate all the first level relations, components, files, and dynamic zones for the entry */
        populate?:
          | "*"
          | ArticleDeleteArticlesByIdParamsPopulateEnum
          | ArticleDeleteArticlesByIdParamsPopulateEnum1[];
        /** Filters to apply to the query */
        filters?: Record<ArticleDeleteArticlesByIdParamsFiltersEnum, any>;
        /** Select a locale */
        locale?: string;
        /** Fetch documents based on their status. Default to "published" if not specified. */
        status?: ArticleDeleteArticlesByIdParamsStatusEnum;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: {
            /**
             * The document ID, represented by a UUID
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            documentId: string;
            id: number;
            /** A UID field */
            NameID: string;
            /** A string field */
            Title: string;
            /** A blocks field */
            Content: any[];
            /** A datetime field */
            createdAt?: string;
            /** A datetime field */
            updatedAt?: string;
            /**
             * A datetime field
             * @default "2025-09-26T12:59:12.783Z"
             */
            publishedAt: string;
            /** A string field */
            locale?: string;
            /** A relational field */
            localizations?: ApiArticleArticleDocument[];
          };
        },
        void
      >({
        path: `/articles/${id}`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),
  };
  heroImage = {
    /**
     * No description
     *
     * @tags hero-image
     * @name HeroImageGetHeroImages
     * @request GET:/hero-images
     */
    heroImageGetHeroImages: (
      query?: {
        /** The fields to return, this doesn't include populatable fields like relations, components, files, or dynamic zones */
        fields?: HeroImageGetHeroImagesParamsFieldsEnum[];
        /** Filters to apply to the query */
        filters?: Record<HeroImageGetHeroImagesParamsFiltersEnum, any>;
        _q?: string;
        /** Pagination parameters */
        pagination?: {
          /** Include total count in response */
          withCount?: boolean;
        } & (
          | {
              /**
               * Page number (1-based)
               * @exclusiveMin 0
               * @max 9007199254740991
               */
              page: number;
              /**
               * Number of entries per page
               * @exclusiveMin 0
               * @max 9007199254740991
               */
              pageSize: number;
            }
          | {
              /**
               * Number of entries to skip
               * @min 0
               * @max 9007199254740991
               */
              start: number;
              /**
               * Maximum number of entries to return
               * @exclusiveMin 0
               * @max 9007199254740991
               */
              limit: number;
            }
        );
        /** Sort the result */
        sort?:
          | HeroImageGetHeroImagesParamsSortEnum
          | HeroImageGetHeroImagesParamsSortEnum1[]
          | Record<
              HeroImageGetHeroImagesParamsSortEnum2,
              HeroImageGetHeroImagesParamsSortEnum3
            >
          | Record<
              HeroImageGetHeroImagesParamsSortEnum4,
              HeroImageGetHeroImagesParamsSortEnum5
            >[];
        /** Populate all the first level relations, components, files, and dynamic zones for the entry */
        populate?:
          | "*"
          | HeroImageGetHeroImagesParamsPopulateEnum
          | HeroImageGetHeroImagesParamsPopulateEnum1[];
        /** Select a locale */
        locale?: string;
        /** Fetch documents based on their status. Default to "published" if not specified. */
        status?: HeroImageGetHeroImagesParamsStatusEnum;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: {
            /**
             * The document ID, represented by a UUID
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            documentId: string;
            id: number;
            /** A string field */
            Name?: string;
            /** An enum field */
            Type?: HeroImageGetHeroImagesTypeEnum;
            /** A datetime field */
            createdAt?: string;
            /** A datetime field */
            updatedAt?: string;
            /**
             * A datetime field
             * @default "2025-09-26T12:59:12.788Z"
             */
            publishedAt: string;
            /** A string field */
            locale?: string;
            /** A media field */
            MediaSlider?: PluginUploadFileDocument[];
            /** A media field */
            MediaSingle?: PluginUploadFileDocument[];
            /** A relational field */
            localizations?: ApiHeroImageHeroImageDocument[];
          }[];
        },
        void
      >({
        path: `/hero-images`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags hero-image
     * @name HeroImagePostHeroImages
     * @request POST:/hero-images
     */
    heroImagePostHeroImages: (
      data: {
        data: {
          /** A string field */
          Name?: string;
          /** An enum field */
          Type?: HeroImagePostHeroImagesTypeEnum1;
          /**
           * A datetime field
           * @default "2025-09-26T12:59:12.799Z"
           */
          publishedAt: string;
          /** A string field */
          locale?: string;
          /** A media field */
          MediaSlider?: any[];
          /** A media field */
          MediaSingle?: any[];
        };
      },
      query?: {
        /** The fields to return, this doesn't include populatable fields like relations, components, files, or dynamic zones */
        fields?: HeroImagePostHeroImagesParamsFieldsEnum[];
        /** Populate all the first level relations, components, files, and dynamic zones for the entry */
        populate?:
          | "*"
          | HeroImagePostHeroImagesParamsPopulateEnum
          | HeroImagePostHeroImagesParamsPopulateEnum1[];
        /** Select a locale */
        locale?: string;
        /** Fetch documents based on their status. Default to "published" if not specified. */
        status?: HeroImagePostHeroImagesParamsStatusEnum;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: {
            /**
             * The document ID, represented by a UUID
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            documentId: string;
            id: number;
            /** A string field */
            Name?: string;
            /** An enum field */
            Type?: HeroImagePostHeroImagesTypeEnum;
            /** A datetime field */
            createdAt?: string;
            /** A datetime field */
            updatedAt?: string;
            /**
             * A datetime field
             * @default "2025-09-26T12:59:12.799Z"
             */
            publishedAt: string;
            /** A string field */
            locale?: string;
            /** A media field */
            MediaSlider?: PluginUploadFileDocument[];
            /** A media field */
            MediaSingle?: PluginUploadFileDocument[];
            /** A relational field */
            localizations?: ApiHeroImageHeroImageDocument[];
          };
        },
        void
      >({
        path: `/hero-images`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags hero-image
     * @name HeroImageGetHeroImagesById
     * @request GET:/hero-images/{id}
     */
    heroImageGetHeroImagesById: (
      id: string,
      query?: {
        /** The fields to return, this doesn't include populatable fields like relations, components, files, or dynamic zones */
        fields?: HeroImageGetHeroImagesByIdParamsFieldsEnum[];
        /** Populate all the first level relations, components, files, and dynamic zones for the entry */
        populate?:
          | "*"
          | HeroImageGetHeroImagesByIdParamsPopulateEnum
          | HeroImageGetHeroImagesByIdParamsPopulateEnum1[];
        /** Filters to apply to the query */
        filters?: Record<HeroImageGetHeroImagesByIdParamsFiltersEnum, any>;
        /** Sort the result */
        sort?:
          | HeroImageGetHeroImagesByIdParamsSortEnum
          | HeroImageGetHeroImagesByIdParamsSortEnum1[]
          | Record<
              HeroImageGetHeroImagesByIdParamsSortEnum2,
              HeroImageGetHeroImagesByIdParamsSortEnum3
            >
          | Record<
              HeroImageGetHeroImagesByIdParamsSortEnum4,
              HeroImageGetHeroImagesByIdParamsSortEnum5
            >[];
        /** Select a locale */
        locale?: string;
        /** Fetch documents based on their status. Default to "published" if not specified. */
        status?: HeroImageGetHeroImagesByIdParamsStatusEnum;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: {
            /**
             * The document ID, represented by a UUID
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            documentId: string;
            id: number;
            /** A string field */
            Name?: string;
            /** An enum field */
            Type?: HeroImageGetHeroImagesByIdTypeEnum;
            /** A datetime field */
            createdAt?: string;
            /** A datetime field */
            updatedAt?: string;
            /**
             * A datetime field
             * @default "2025-09-26T12:59:12.796Z"
             */
            publishedAt: string;
            /** A string field */
            locale?: string;
            /** A media field */
            MediaSlider?: PluginUploadFileDocument[];
            /** A media field */
            MediaSingle?: PluginUploadFileDocument[];
            /** A relational field */
            localizations?: ApiHeroImageHeroImageDocument[];
          };
        },
        void
      >({
        path: `/hero-images/${id}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags hero-image
     * @name HeroImagePutHeroImagesById
     * @request PUT:/hero-images/{id}
     */
    heroImagePutHeroImagesById: (
      id: string,
      data: {
        data: {
          /** A string field */
          Name?: string;
          /** An enum field */
          Type?: HeroImagePutHeroImagesByIdTypeEnum1;
          /**
           * A datetime field
           * @default "2025-09-26T12:59:12.802Z"
           */
          publishedAt?: string;
          /** A string field */
          locale?: string;
          /** A media field */
          MediaSlider?: any[];
          /** A media field */
          MediaSingle?: any[];
        };
      },
      query?: {
        /** The fields to return, this doesn't include populatable fields like relations, components, files, or dynamic zones */
        fields?: HeroImagePutHeroImagesByIdParamsFieldsEnum[];
        /** Populate all the first level relations, components, files, and dynamic zones for the entry */
        populate?:
          | "*"
          | HeroImagePutHeroImagesByIdParamsPopulateEnum
          | HeroImagePutHeroImagesByIdParamsPopulateEnum1[];
        /** Select a locale */
        locale?: string;
        /** Fetch documents based on their status. Default to "published" if not specified. */
        status?: HeroImagePutHeroImagesByIdParamsStatusEnum;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: {
            /**
             * The document ID, represented by a UUID
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            documentId: string;
            id: number;
            /** A string field */
            Name?: string;
            /** An enum field */
            Type?: HeroImagePutHeroImagesByIdTypeEnum;
            /** A datetime field */
            createdAt?: string;
            /** A datetime field */
            updatedAt?: string;
            /**
             * A datetime field
             * @default "2025-09-26T12:59:12.803Z"
             */
            publishedAt: string;
            /** A string field */
            locale?: string;
            /** A media field */
            MediaSlider?: PluginUploadFileDocument[];
            /** A media field */
            MediaSingle?: PluginUploadFileDocument[];
            /** A relational field */
            localizations?: ApiHeroImageHeroImageDocument[];
          };
        },
        void
      >({
        path: `/hero-images/${id}`,
        method: "PUT",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags hero-image
     * @name HeroImageDeleteHeroImagesById
     * @request DELETE:/hero-images/{id}
     */
    heroImageDeleteHeroImagesById: (
      id: string,
      query?: {
        /** The fields to return, this doesn't include populatable fields like relations, components, files, or dynamic zones */
        fields?: HeroImageDeleteHeroImagesByIdParamsFieldsEnum[];
        /** Populate all the first level relations, components, files, and dynamic zones for the entry */
        populate?:
          | "*"
          | HeroImageDeleteHeroImagesByIdParamsPopulateEnum
          | HeroImageDeleteHeroImagesByIdParamsPopulateEnum1[];
        /** Filters to apply to the query */
        filters?: Record<HeroImageDeleteHeroImagesByIdParamsFiltersEnum, any>;
        /** Select a locale */
        locale?: string;
        /** Fetch documents based on their status. Default to "published" if not specified. */
        status?: HeroImageDeleteHeroImagesByIdParamsStatusEnum;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: {
            /**
             * The document ID, represented by a UUID
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            documentId: string;
            id: number;
            /** A string field */
            Name?: string;
            /** An enum field */
            Type?: HeroImageDeleteHeroImagesByIdTypeEnum;
            /** A datetime field */
            createdAt?: string;
            /** A datetime field */
            updatedAt?: string;
            /**
             * A datetime field
             * @default "2025-09-26T12:59:12.806Z"
             */
            publishedAt: string;
            /** A string field */
            locale?: string;
            /** A media field */
            MediaSlider?: PluginUploadFileDocument[];
            /** A media field */
            MediaSingle?: PluginUploadFileDocument[];
            /** A relational field */
            localizations?: ApiHeroImageHeroImageDocument[];
          };
        },
        void
      >({
        path: `/hero-images/${id}`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),
  };
  page = {
    /**
     * No description
     *
     * @tags page
     * @name PageGetPages
     * @request GET:/pages
     */
    pageGetPages: (
      query?: {
        /** The fields to return, this doesn't include populatable fields like relations, components, files, or dynamic zones */
        fields?: PageGetPagesParamsFieldsEnum[];
        /** Filters to apply to the query */
        filters?: Record<PageGetPagesParamsFiltersEnum, any>;
        _q?: string;
        /** Pagination parameters */
        pagination?: {
          /** Include total count in response */
          withCount?: boolean;
        } & (
          | {
              /**
               * Page number (1-based)
               * @exclusiveMin 0
               * @max 9007199254740991
               */
              page: number;
              /**
               * Number of entries per page
               * @exclusiveMin 0
               * @max 9007199254740991
               */
              pageSize: number;
            }
          | {
              /**
               * Number of entries to skip
               * @min 0
               * @max 9007199254740991
               */
              start: number;
              /**
               * Maximum number of entries to return
               * @exclusiveMin 0
               * @max 9007199254740991
               */
              limit: number;
            }
        );
        /** Sort the result */
        sort?:
          | PageGetPagesParamsSortEnum
          | PageGetPagesParamsSortEnum1[]
          | Record<PageGetPagesParamsSortEnum2, PageGetPagesParamsSortEnum3>
          | Record<PageGetPagesParamsSortEnum4, PageGetPagesParamsSortEnum5>[];
        /** Populate all the first level relations, components, files, and dynamic zones for the entry */
        populate?:
          | "*"
          | PageGetPagesParamsPopulateEnum
          | PageGetPagesParamsPopulateEnum1[];
        /** Select a locale */
        locale?: string;
        /** Fetch documents based on their status. Default to "published" if not specified. */
        status?: PageGetPagesParamsStatusEnum;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: {
            /**
             * The document ID, represented by a UUID
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            documentId: string;
            id: number;
            /** A UID field */
            PageID: string;
            /** A string field */
            Name: string;
            /** A string field */
            URL: string;
            /** A datetime field */
            createdAt?: string;
            /** A datetime field */
            updatedAt?: string;
            /**
             * A datetime field
             * @default "2025-09-26T12:59:12.812Z"
             */
            publishedAt: string;
            /** A string field */
            locale?: string;
            /** A relational field */
            hero_image?: ApiHeroImageHeroImageDocument;
            /** A relational field */
            subpages?: ApiPagePageDocument[];
            /** A relational field */
            pages?: ApiPagePageDocument[];
            /** A relational field */
            localizations?: ApiPagePageDocument[];
          }[];
        },
        void
      >({
        path: `/pages`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags page
     * @name PagePostPages
     * @request POST:/pages
     */
    pagePostPages: (
      data: {
        data: {
          /** A UID field */
          PageID: string;
          /** A string field */
          Name: string;
          /** A string field */
          URL: string;
          /**
           * A datetime field
           * @default "2025-09-26T12:59:12.835Z"
           */
          publishedAt: string;
          /** A string field */
          locale?: string;
          /**
           * A relational field
           * @format uuid
           * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
           */
          hero_image?: string;
          /** A relational field */
          subpages?: string[];
          /** A relational field */
          pages?: string[];
        };
      },
      query?: {
        /** The fields to return, this doesn't include populatable fields like relations, components, files, or dynamic zones */
        fields?: PagePostPagesParamsFieldsEnum[];
        /** Populate all the first level relations, components, files, and dynamic zones for the entry */
        populate?:
          | "*"
          | PagePostPagesParamsPopulateEnum
          | PagePostPagesParamsPopulateEnum1[];
        /** Select a locale */
        locale?: string;
        /** Fetch documents based on their status. Default to "published" if not specified. */
        status?: PagePostPagesParamsStatusEnum;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: {
            /**
             * The document ID, represented by a UUID
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            documentId: string;
            id: number;
            /** A UID field */
            PageID: string;
            /** A string field */
            Name: string;
            /** A string field */
            URL: string;
            /** A datetime field */
            createdAt?: string;
            /** A datetime field */
            updatedAt?: string;
            /**
             * A datetime field
             * @default "2025-09-26T12:59:12.837Z"
             */
            publishedAt: string;
            /** A string field */
            locale?: string;
            /** A relational field */
            hero_image?: ApiHeroImageHeroImageDocument;
            /** A relational field */
            subpages?: ApiPagePageDocument[];
            /** A relational field */
            pages?: ApiPagePageDocument[];
            /** A relational field */
            localizations?: ApiPagePageDocument[];
          };
        },
        void
      >({
        path: `/pages`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags page
     * @name PageGetPagesById
     * @request GET:/pages/{id}
     */
    pageGetPagesById: (
      id: string,
      query?: {
        /** The fields to return, this doesn't include populatable fields like relations, components, files, or dynamic zones */
        fields?: PageGetPagesByIdParamsFieldsEnum[];
        /** Populate all the first level relations, components, files, and dynamic zones for the entry */
        populate?:
          | "*"
          | PageGetPagesByIdParamsPopulateEnum
          | PageGetPagesByIdParamsPopulateEnum1[];
        /** Filters to apply to the query */
        filters?: Record<PageGetPagesByIdParamsFiltersEnum, any>;
        /** Sort the result */
        sort?:
          | PageGetPagesByIdParamsSortEnum
          | PageGetPagesByIdParamsSortEnum1[]
          | Record<
              PageGetPagesByIdParamsSortEnum2,
              PageGetPagesByIdParamsSortEnum3
            >
          | Record<
              PageGetPagesByIdParamsSortEnum4,
              PageGetPagesByIdParamsSortEnum5
            >[];
        /** Select a locale */
        locale?: string;
        /** Fetch documents based on their status. Default to "published" if not specified. */
        status?: PageGetPagesByIdParamsStatusEnum;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: {
            /**
             * The document ID, represented by a UUID
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            documentId: string;
            id: number;
            /** A UID field */
            PageID: string;
            /** A string field */
            Name: string;
            /** A string field */
            URL: string;
            /** A datetime field */
            createdAt?: string;
            /** A datetime field */
            updatedAt?: string;
            /**
             * A datetime field
             * @default "2025-09-26T12:59:12.831Z"
             */
            publishedAt: string;
            /** A string field */
            locale?: string;
            /** A relational field */
            hero_image?: ApiHeroImageHeroImageDocument;
            /** A relational field */
            subpages?: ApiPagePageDocument[];
            /** A relational field */
            pages?: ApiPagePageDocument[];
            /** A relational field */
            localizations?: ApiPagePageDocument[];
          };
        },
        void
      >({
        path: `/pages/${id}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags page
     * @name PagePutPagesById
     * @request PUT:/pages/{id}
     */
    pagePutPagesById: (
      id: string,
      data: {
        data: {
          /** A UID field */
          PageID?: string;
          /** A string field */
          Name?: string;
          /** A string field */
          URL?: string;
          /**
           * A datetime field
           * @default "2025-09-26T12:59:12.841Z"
           */
          publishedAt?: string;
          /** A string field */
          locale?: string;
          /**
           * A relational field
           * @format uuid
           * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
           */
          hero_image?: string;
          /** A relational field */
          subpages?: string[];
          /** A relational field */
          pages?: string[];
        };
      },
      query?: {
        /** The fields to return, this doesn't include populatable fields like relations, components, files, or dynamic zones */
        fields?: PagePutPagesByIdParamsFieldsEnum[];
        /** Populate all the first level relations, components, files, and dynamic zones for the entry */
        populate?:
          | "*"
          | PagePutPagesByIdParamsPopulateEnum
          | PagePutPagesByIdParamsPopulateEnum1[];
        /** Select a locale */
        locale?: string;
        /** Fetch documents based on their status. Default to "published" if not specified. */
        status?: PagePutPagesByIdParamsStatusEnum;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: {
            /**
             * The document ID, represented by a UUID
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            documentId: string;
            id: number;
            /** A UID field */
            PageID: string;
            /** A string field */
            Name: string;
            /** A string field */
            URL: string;
            /** A datetime field */
            createdAt?: string;
            /** A datetime field */
            updatedAt?: string;
            /**
             * A datetime field
             * @default "2025-09-26T12:59:12.843Z"
             */
            publishedAt: string;
            /** A string field */
            locale?: string;
            /** A relational field */
            hero_image?: ApiHeroImageHeroImageDocument;
            /** A relational field */
            subpages?: ApiPagePageDocument[];
            /** A relational field */
            pages?: ApiPagePageDocument[];
            /** A relational field */
            localizations?: ApiPagePageDocument[];
          };
        },
        void
      >({
        path: `/pages/${id}`,
        method: "PUT",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags page
     * @name PageDeletePagesById
     * @request DELETE:/pages/{id}
     */
    pageDeletePagesById: (
      id: string,
      query?: {
        /** The fields to return, this doesn't include populatable fields like relations, components, files, or dynamic zones */
        fields?: PageDeletePagesByIdParamsFieldsEnum[];
        /** Populate all the first level relations, components, files, and dynamic zones for the entry */
        populate?:
          | "*"
          | PageDeletePagesByIdParamsPopulateEnum
          | PageDeletePagesByIdParamsPopulateEnum1[];
        /** Filters to apply to the query */
        filters?: Record<PageDeletePagesByIdParamsFiltersEnum, any>;
        /** Select a locale */
        locale?: string;
        /** Fetch documents based on their status. Default to "published" if not specified. */
        status?: PageDeletePagesByIdParamsStatusEnum;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: {
            /**
             * The document ID, represented by a UUID
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            documentId: string;
            id: number;
            /** A UID field */
            PageID: string;
            /** A string field */
            Name: string;
            /** A string field */
            URL: string;
            /** A datetime field */
            createdAt?: string;
            /** A datetime field */
            updatedAt?: string;
            /**
             * A datetime field
             * @default "2025-09-26T12:59:12.847Z"
             */
            publishedAt: string;
            /** A string field */
            locale?: string;
            /** A relational field */
            hero_image?: ApiHeroImageHeroImageDocument;
            /** A relational field */
            subpages?: ApiPagePageDocument[];
            /** A relational field */
            pages?: ApiPagePageDocument[];
            /** A relational field */
            localizations?: ApiPagePageDocument[];
          };
        },
        void
      >({
        path: `/pages/${id}`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),
  };
  contentTypeBuilder = {
    /**
     * No description
     *
     * @tags content-type-builder
     * @name ContentTypeBuilderGetContentTypes
     * @request GET:/content-types
     */
    contentTypeBuilderGetContentTypes: (
      query: {
        kind: ContentTypeBuilderGetContentTypesParamsKindEnum;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: {
            /** @pattern ^((strapi|admin)::[\w-]+|(api|plugin)::[\w-]+\.[\w-]+)$ */
            uid: string;
            plugin?: string;
            apiID: string;
            schema: {
              displayName: string;
              singularName: string;
              pluralName: string;
              description: string;
              draftAndPublish: boolean;
              kind: ContentTypeBuilderGetContentTypesKindEnum;
              collectionName?: string;
              attributes: Record<
                string,
                | {
                    type: "media";
                    configurable?: false;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    multiple: boolean;
                    required?: boolean;
                    allowedTypes?: string[];
                  }
                | {
                    type: "relation";
                    configurable?: false;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    relation: string;
                    /** @pattern ^((strapi|admin)::[\w-]+|(api|plugin)::[\w-]+\.[\w-]+)$ */
                    target: string;
                    targetAttribute: string | null;
                    autoPopulate?: boolean;
                    mappedBy?: string;
                    inversedBy?: string;
                  }
                | {
                    type: "component";
                    configurable?: false;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    component: string;
                    repeatable: boolean;
                    required?: boolean;
                    min?: number;
                    max?: number;
                  }
                | {
                    type: "dynamiczone";
                    configurable?: false;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    components: string[];
                    required?: boolean;
                    min?: number;
                    max?: number;
                  }
                | {
                    type: "uid";
                    configurable?: false;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    targetField?: string;
                  }
                | {
                    type: string;
                    required?: boolean;
                    unique?: boolean;
                    default?: any;
                    min?: number | string;
                    max?: number | string;
                    minLength?: number;
                    maxLength?: number;
                    enum?: string[];
                    regex?: string;
                    private?: boolean;
                    configurable?: boolean;
                    pluginOptions?: Record<string, any>;
                  }
              >;
              visible: boolean;
              restrictRelationsTo: string[] | null;
              pluginOptions?: Record<string, any>;
              options?: Record<string, any>;
              reviewWorkflows?: boolean;
              populateCreatorFields?: boolean;
              comment?: string;
              version?: string;
            };
          }[];
        },
        void
      >({
        path: `/content-types`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags content-type-builder
     * @name ContentTypeBuilderGetContentTypesByUid
     * @request GET:/content-types/{uid}
     */
    contentTypeBuilderGetContentTypesByUid: (
      uid: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: {
            /** @pattern ^((strapi|admin)::[\w-]+|(api|plugin)::[\w-]+\.[\w-]+)$ */
            uid: string;
            plugin?: string;
            apiID: string;
            schema: {
              displayName: string;
              singularName: string;
              pluralName: string;
              description: string;
              draftAndPublish: boolean;
              kind: ContentTypeBuilderGetContentTypesByUidKindEnum;
              collectionName?: string;
              attributes: Record<
                string,
                | {
                    type: "media";
                    configurable?: false;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    multiple: boolean;
                    required?: boolean;
                    allowedTypes?: string[];
                  }
                | {
                    type: "relation";
                    configurable?: false;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    relation: string;
                    /** @pattern ^((strapi|admin)::[\w-]+|(api|plugin)::[\w-]+\.[\w-]+)$ */
                    target: string;
                    targetAttribute: string | null;
                    autoPopulate?: boolean;
                    mappedBy?: string;
                    inversedBy?: string;
                  }
                | {
                    type: "component";
                    configurable?: false;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    component: string;
                    repeatable: boolean;
                    required?: boolean;
                    min?: number;
                    max?: number;
                  }
                | {
                    type: "dynamiczone";
                    configurable?: false;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    components: string[];
                    required?: boolean;
                    min?: number;
                    max?: number;
                  }
                | {
                    type: "uid";
                    configurable?: false;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    targetField?: string;
                  }
                | {
                    type: string;
                    required?: boolean;
                    unique?: boolean;
                    default?: any;
                    min?: number | string;
                    max?: number | string;
                    minLength?: number;
                    maxLength?: number;
                    enum?: string[];
                    regex?: string;
                    private?: boolean;
                    configurable?: boolean;
                    pluginOptions?: Record<string, any>;
                  }
              >;
              visible: boolean;
              restrictRelationsTo: string[] | null;
              pluginOptions?: Record<string, any>;
              options?: Record<string, any>;
              reviewWorkflows?: boolean;
              populateCreatorFields?: boolean;
              comment?: string;
              version?: string;
            };
          };
        },
        void
      >({
        path: `/content-types/${uid}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags content-type-builder
     * @name ContentTypeBuilderGetComponents
     * @request GET:/components
     */
    contentTypeBuilderGetComponents: (params: RequestParams = {}) =>
      this.request<
        {
          data: {
            /** @pattern ^[\w-]+\.[\w-]+$ */
            uid: string;
            category: string;
            apiId: string;
            schema: {
              displayName: string;
              description: string;
              icon?: string;
              connection?: string;
              collectionName?: string;
              attributes: Record<
                string,
                | {
                    type: "media";
                    configurable?: false;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    multiple: boolean;
                    required?: boolean;
                    allowedTypes?: string[];
                  }
                | {
                    type: "relation";
                    configurable?: false;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    relation: string;
                    /** @pattern ^((strapi|admin)::[\w-]+|(api|plugin)::[\w-]+\.[\w-]+)$ */
                    target: string;
                    targetAttribute: string | null;
                    autoPopulate?: boolean;
                    mappedBy?: string;
                    inversedBy?: string;
                  }
                | {
                    type: "component";
                    configurable?: false;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    component: string;
                    repeatable: boolean;
                    required?: boolean;
                    min?: number;
                    max?: number;
                  }
                | {
                    type: "dynamiczone";
                    configurable?: false;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    components: string[];
                    required?: boolean;
                    min?: number;
                    max?: number;
                  }
                | {
                    type: "uid";
                    configurable?: false;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    targetField?: string;
                  }
                | {
                    type: string;
                    required?: boolean;
                    unique?: boolean;
                    default?: any;
                    min?: number | string;
                    max?: number | string;
                    minLength?: number;
                    maxLength?: number;
                    enum?: string[];
                    regex?: string;
                    private?: boolean;
                    configurable?: boolean;
                    pluginOptions?: Record<string, any>;
                  }
              >;
              pluginOptions?: Record<string, any>;
            };
          }[];
        },
        void
      >({
        path: `/components`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags content-type-builder
     * @name ContentTypeBuilderGetComponentsByUid
     * @request GET:/components/{uid}
     */
    contentTypeBuilderGetComponentsByUid: (
      uid: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: {
            /** @pattern ^[\w-]+\.[\w-]+$ */
            uid: string;
            category: string;
            apiId: string;
            schema: {
              displayName: string;
              description: string;
              icon?: string;
              connection?: string;
              collectionName?: string;
              attributes: Record<
                string,
                | {
                    type: "media";
                    configurable?: false;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    multiple: boolean;
                    required?: boolean;
                    allowedTypes?: string[];
                  }
                | {
                    type: "relation";
                    configurable?: false;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    relation: string;
                    /** @pattern ^((strapi|admin)::[\w-]+|(api|plugin)::[\w-]+\.[\w-]+)$ */
                    target: string;
                    targetAttribute: string | null;
                    autoPopulate?: boolean;
                    mappedBy?: string;
                    inversedBy?: string;
                  }
                | {
                    type: "component";
                    configurable?: false;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    component: string;
                    repeatable: boolean;
                    required?: boolean;
                    min?: number;
                    max?: number;
                  }
                | {
                    type: "dynamiczone";
                    configurable?: false;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    components: string[];
                    required?: boolean;
                    min?: number;
                    max?: number;
                  }
                | {
                    type: "uid";
                    configurable?: false;
                    private?: boolean;
                    pluginOptions?: Record<string, any>;
                    targetField?: string;
                  }
                | {
                    type: string;
                    required?: boolean;
                    unique?: boolean;
                    default?: any;
                    min?: number | string;
                    max?: number | string;
                    minLength?: number;
                    maxLength?: number;
                    enum?: string[];
                    regex?: string;
                    private?: boolean;
                    configurable?: boolean;
                    pluginOptions?: Record<string, any>;
                  }
              >;
              pluginOptions?: Record<string, any>;
            };
          };
        },
        void
      >({
        path: `/components/${uid}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  upload = {
    /**
     * No description
     *
     * @tags upload
     * @name UploadPost
     * @request POST:/
     */
    uploadPost: (
      query?: {
        /**
         * @exclusiveMin 0
         * @max 9007199254740991
         */
        id?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        | {
            /**
             * @exclusiveMin 0
             * @max 9007199254740991
             */
            id: number;
            /**
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            documentId: string;
            name: string;
            alternativeText?: string | null;
            caption?: string | null;
            /**
             * @min -9007199254740991
             * @max 9007199254740991
             */
            width?: number;
            /**
             * @min -9007199254740991
             * @max 9007199254740991
             */
            height?: number;
            formats?: Record<string, any>;
            hash: string;
            ext?: string;
            mime: string;
            size: number;
            url: string;
            previewUrl?: string | null;
            folder?: number;
            folderPath: string;
            provider: string;
            provider_metadata?: Record<string, any> | null;
            createdAt: string;
            updatedAt: string;
            createdBy?: number;
            updatedBy?: number;
          }
        | {
            /**
             * @exclusiveMin 0
             * @max 9007199254740991
             */
            id: number;
            /**
             * @format uuid
             * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
             */
            documentId: string;
            name: string;
            alternativeText?: string | null;
            caption?: string | null;
            /**
             * @min -9007199254740991
             * @max 9007199254740991
             */
            width?: number;
            /**
             * @min -9007199254740991
             * @max 9007199254740991
             */
            height?: number;
            formats?: Record<string, any>;
            hash: string;
            ext?: string;
            mime: string;
            size: number;
            url: string;
            previewUrl?: string | null;
            folder?: number;
            folderPath: string;
            provider: string;
            provider_metadata?: Record<string, any> | null;
            createdAt: string;
            updatedAt: string;
            createdBy?: number;
            updatedBy?: number;
          }[],
        void
      >({
        path: `/`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags upload
     * @name UploadGetFiles
     * @request GET:/files
     */
    uploadGetFiles: (
      query?: {
        /** Select specific fields to return in the response */
        fields?: string | string[];
        /** Specify which relations to populate in the response */
        populate?: "*" | string | string[] | Record<string, any>;
        /** Sort the results by specified fields */
        sort?:
          | string
          | string[]
          | Record<string, UploadGetFilesParamsSortEnum>
          | Record<string, UploadGetFilesParamsSortEnum1>[];
        /** Pagination parameters */
        pagination?: {
          /** Include total count in response */
          withCount?: boolean;
        } & (
          | {
              /**
               * Page number (1-based)
               * @exclusiveMin 0
               * @max 9007199254740991
               */
              page: number;
              /**
               * Number of entries per page
               * @exclusiveMin 0
               * @max 9007199254740991
               */
              pageSize: number;
            }
          | {
              /**
               * Number of entries to skip
               * @min 0
               * @max 9007199254740991
               */
              start: number;
              /**
               * Maximum number of entries to return
               * @exclusiveMin 0
               * @max 9007199254740991
               */
              limit: number;
            }
        );
        /** Apply filters to the query */
        filters?: Record<string, any>;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * @exclusiveMin 0
           * @max 9007199254740991
           */
          id: number;
          /**
           * @format uuid
           * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
           */
          documentId: string;
          name: string;
          alternativeText?: string | null;
          caption?: string | null;
          /**
           * @min -9007199254740991
           * @max 9007199254740991
           */
          width?: number;
          /**
           * @min -9007199254740991
           * @max 9007199254740991
           */
          height?: number;
          formats?: Record<string, any>;
          hash: string;
          ext?: string;
          mime: string;
          size: number;
          url: string;
          previewUrl?: string | null;
          folder?: number;
          folderPath: string;
          provider: string;
          provider_metadata?: Record<string, any> | null;
          createdAt: string;
          updatedAt: string;
          createdBy?: number;
          updatedBy?: number;
        }[],
        void
      >({
        path: `/files`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags upload
     * @name UploadGetFilesById
     * @request GET:/files/{id}
     */
    uploadGetFilesById: (
      id: number,
      query?: {
        /** Select specific fields to return in the response */
        fields?: string | string[];
        /** Specify which relations to populate in the response */
        populate?: "*" | string | string[] | Record<string, any>;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * @exclusiveMin 0
           * @max 9007199254740991
           */
          id: number;
          /**
           * @format uuid
           * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
           */
          documentId: string;
          name: string;
          alternativeText?: string | null;
          caption?: string | null;
          /**
           * @min -9007199254740991
           * @max 9007199254740991
           */
          width?: number;
          /**
           * @min -9007199254740991
           * @max 9007199254740991
           */
          height?: number;
          formats?: Record<string, any>;
          hash: string;
          ext?: string;
          mime: string;
          size: number;
          url: string;
          previewUrl?: string | null;
          folder?: number;
          folderPath: string;
          provider: string;
          provider_metadata?: Record<string, any> | null;
          createdAt: string;
          updatedAt: string;
          createdBy?: number;
          updatedBy?: number;
        },
        void
      >({
        path: `/files/${id}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags upload
     * @name UploadDeleteFilesById
     * @request DELETE:/files/{id}
     */
    uploadDeleteFilesById: (id: number, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * @exclusiveMin 0
           * @max 9007199254740991
           */
          id: number;
          /**
           * @format uuid
           * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
           */
          documentId: string;
          name: string;
          alternativeText?: string | null;
          caption?: string | null;
          /**
           * @min -9007199254740991
           * @max 9007199254740991
           */
          width?: number;
          /**
           * @min -9007199254740991
           * @max 9007199254740991
           */
          height?: number;
          formats?: Record<string, any>;
          hash: string;
          ext?: string;
          mime: string;
          size: number;
          url: string;
          previewUrl?: string | null;
          folder?: number;
          folderPath: string;
          provider: string;
          provider_metadata?: Record<string, any> | null;
          createdAt: string;
          updatedAt: string;
          createdBy?: number;
          updatedBy?: number;
        },
        void
      >({
        path: `/files/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),
  };
  i18N = {
    /**
     * No description
     *
     * @tags i18n
     * @name I18NGetLocales
     * @request GET:/locales
     */
    i18NGetLocales: (params: RequestParams = {}) =>
      this.request<
        {
          /**
           * @exclusiveMin 0
           * @max 9007199254740991
           */
          id: number;
          /**
           * @format uuid
           * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$
           */
          documentId: string;
          name: string;
          /**
           * @minLength 2
           * @maxLength 2
           */
          code: string;
          createdAt: string;
          updatedAt: string;
          publishedAt: string | null;
          isDefault: boolean;
        }[],
        void
      >({
        path: `/locales`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  usersPermissions = {
    /**
     * No description
     *
     * @tags users-permissions
     * @name UsersPermissionsGetConnect
     * @request GET:/connect/(.*)
     */
    usersPermissionsGetConnect: (params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/connect/(.*)`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users-permissions
     * @name UsersPermissionsPostAuthLocal
     * @request POST:/auth/local
     */
    usersPermissionsPostAuthLocal: (
      data: {
        identifier: string;
        password: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          jwt: string;
          user: {
            id: number;
            documentId: string;
            username: string;
            email: string;
            provider: string;
            confirmed: boolean;
            blocked: boolean;
            role?:
              | number
              | {
                  id: number;
                  name: string;
                  description: string | null;
                  type: string;
                  createdAt: string;
                  updatedAt: string;
                };
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
          };
        },
        void
      >({
        path: `/auth/local`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users-permissions
     * @name UsersPermissionsPostAuthLocalRegister
     * @request POST:/auth/local/register
     */
    usersPermissionsPostAuthLocalRegister: (
      data: {
        username: string;
        /**
         * @format email
         * @pattern ^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$
         */
        email: string;
        password: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        | {
            jwt: string;
            user: {
              id: number;
              documentId: string;
              username: string;
              email: string;
              provider: string;
              confirmed: boolean;
              blocked: boolean;
              role?:
                | number
                | {
                    id: number;
                    name: string;
                    description: string | null;
                    type: string;
                    createdAt: string;
                    updatedAt: string;
                  };
              createdAt: string;
              updatedAt: string;
              publishedAt: string;
            };
          }
        | {
            user: {
              id: number;
              documentId: string;
              username: string;
              email: string;
              provider: string;
              confirmed: boolean;
              blocked: boolean;
              role?:
                | number
                | {
                    id: number;
                    name: string;
                    description: string | null;
                    type: string;
                    createdAt: string;
                    updatedAt: string;
                  };
              createdAt: string;
              updatedAt: string;
              publishedAt: string;
            };
          },
        void
      >({
        path: `/auth/local/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users-permissions
     * @name UsersPermissionsGetAuthByProviderCallback
     * @request GET:/auth/{provider}/callback
     */
    usersPermissionsGetAuthByProviderCallback: (
      provider: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          jwt: string;
          user: {
            id: number;
            documentId: string;
            username: string;
            email: string;
            provider: string;
            confirmed: boolean;
            blocked: boolean;
            role?:
              | number
              | {
                  id: number;
                  name: string;
                  description: string | null;
                  type: string;
                  createdAt: string;
                  updatedAt: string;
                };
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
          };
        },
        void
      >({
        path: `/auth/${provider}/callback`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users-permissions
     * @name UsersPermissionsPostAuthForgotPassword
     * @request POST:/auth/forgot-password
     */
    usersPermissionsPostAuthForgotPassword: (
      data: {
        /**
         * @format email
         * @pattern ^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$
         */
        email: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          ok: boolean;
        },
        void
      >({
        path: `/auth/forgot-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users-permissions
     * @name UsersPermissionsPostAuthResetPassword
     * @request POST:/auth/reset-password
     */
    usersPermissionsPostAuthResetPassword: (
      data: {
        code: string;
        password: string;
        passwordConfirmation: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          jwt: string;
          user: {
            id: number;
            documentId: string;
            username: string;
            email: string;
            provider: string;
            confirmed: boolean;
            blocked: boolean;
            role?:
              | number
              | {
                  id: number;
                  name: string;
                  description: string | null;
                  type: string;
                  createdAt: string;
                  updatedAt: string;
                };
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
          };
        },
        void
      >({
        path: `/auth/reset-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users-permissions
     * @name UsersPermissionsGetAuthEmailConfirmation
     * @request GET:/auth/email-confirmation
     */
    usersPermissionsGetAuthEmailConfirmation: (params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/auth/email-confirmation`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users-permissions
     * @name UsersPermissionsPostAuthSendEmailConfirmation
     * @request POST:/auth/send-email-confirmation
     */
    usersPermissionsPostAuthSendEmailConfirmation: (
      data: {
        /**
         * @format email
         * @pattern ^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$
         */
        email: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          email: string;
          sent: boolean;
        },
        void
      >({
        path: `/auth/send-email-confirmation`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users-permissions
     * @name UsersPermissionsPostAuthChangePassword
     * @request POST:/auth/change-password
     */
    usersPermissionsPostAuthChangePassword: (
      data: {
        currentPassword: string;
        password: string;
        passwordConfirmation: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          jwt: string;
          user: {
            id: number;
            documentId: string;
            username: string;
            email: string;
            provider: string;
            confirmed: boolean;
            blocked: boolean;
            role?:
              | number
              | {
                  id: number;
                  name: string;
                  description: string | null;
                  type: string;
                  createdAt: string;
                  updatedAt: string;
                };
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
          };
        },
        void
      >({
        path: `/auth/change-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users-permissions
     * @name UsersPermissionsGetUsersCount
     * @request GET:/users/count
     */
    usersPermissionsGetUsersCount: (
      query?: {
        /** Apply filters to the query */
        filters?: Record<string, any>;
      },
      params: RequestParams = {},
    ) =>
      this.request<number, void>({
        path: `/users/count`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users-permissions
     * @name UsersPermissionsGetUsers
     * @request GET:/users
     */
    usersPermissionsGetUsers: (
      query?: {
        /** Select specific fields to return in the response */
        fields?: string | string[];
        /** Specify which relations to populate in the response */
        populate?: "*" | string | string[] | Record<string, any>;
        /** Sort the results by specified fields */
        sort?:
          | string
          | string[]
          | Record<string, UsersPermissionsGetUsersParamsSortEnum>
          | Record<string, UsersPermissionsGetUsersParamsSortEnum1>[];
        /** Pagination parameters */
        pagination?: {
          /** Include total count in response */
          withCount?: boolean;
        } & (
          | {
              /**
               * Page number (1-based)
               * @exclusiveMin 0
               * @max 9007199254740991
               */
              page: number;
              /**
               * Number of entries per page
               * @exclusiveMin 0
               * @max 9007199254740991
               */
              pageSize: number;
            }
          | {
              /**
               * Number of entries to skip
               * @min 0
               * @max 9007199254740991
               */
              start: number;
              /**
               * Maximum number of entries to return
               * @exclusiveMin 0
               * @max 9007199254740991
               */
              limit: number;
            }
        );
        /** Apply filters to the query */
        filters?: Record<string, any>;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          id: number;
          documentId: string;
          username: string;
          email: string;
          provider: string;
          confirmed: boolean;
          blocked: boolean;
          role?:
            | number
            | {
                id: number;
                name: string;
                description: string | null;
                type: string;
                createdAt: string;
                updatedAt: string;
              };
          createdAt: string;
          updatedAt: string;
          publishedAt: string;
        }[],
        void
      >({
        path: `/users`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users-permissions
     * @name UsersPermissionsPostUsers
     * @request POST:/users
     */
    usersPermissionsPostUsers: (
      data: {
        username: string;
        /**
         * @format email
         * @pattern ^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$
         */
        email: string;
        password: string;
        role?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          id: number;
          documentId: string;
          username: string;
          email: string;
          provider: string;
          confirmed: boolean;
          blocked: boolean;
          role?:
            | number
            | {
                id: number;
                name: string;
                description: string | null;
                type: string;
                createdAt: string;
                updatedAt: string;
              };
          createdAt: string;
          updatedAt: string;
          publishedAt: string;
        },
        void
      >({
        path: `/users`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users-permissions
     * @name UsersPermissionsGetUsersMe
     * @request GET:/users/me
     */
    usersPermissionsGetUsersMe: (
      query?: {
        /** Select specific fields to return in the response */
        fields?: string | string[];
        /** Specify which relations to populate in the response */
        populate?: "*" | string | string[] | Record<string, any>;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          id: number;
          documentId: string;
          username: string;
          email: string;
          provider: string;
          confirmed: boolean;
          blocked: boolean;
          role?:
            | number
            | {
                id: number;
                name: string;
                description: string | null;
                type: string;
                createdAt: string;
                updatedAt: string;
              };
          createdAt: string;
          updatedAt: string;
          publishedAt: string;
        },
        void
      >({
        path: `/users/me`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users-permissions
     * @name UsersPermissionsGetUsersById
     * @request GET:/users/{id}
     */
    usersPermissionsGetUsersById: (
      id: string,
      query?: {
        /** Select specific fields to return in the response */
        fields?: string | string[];
        /** Specify which relations to populate in the response */
        populate?: "*" | string | string[] | Record<string, any>;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          id: number;
          documentId: string;
          username: string;
          email: string;
          provider: string;
          confirmed: boolean;
          blocked: boolean;
          role?:
            | number
            | {
                id: number;
                name: string;
                description: string | null;
                type: string;
                createdAt: string;
                updatedAt: string;
              };
          createdAt: string;
          updatedAt: string;
          publishedAt: string;
        },
        void
      >({
        path: `/users/${id}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users-permissions
     * @name UsersPermissionsPutUsersById
     * @request PUT:/users/{id}
     */
    usersPermissionsPutUsersById: (
      id: string,
      data: {
        username?: string;
        /**
         * @format email
         * @pattern ^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$
         */
        email?: string;
        password?: string;
        role?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          id: number;
          documentId: string;
          username: string;
          email: string;
          provider: string;
          confirmed: boolean;
          blocked: boolean;
          role?:
            | number
            | {
                id: number;
                name: string;
                description: string | null;
                type: string;
                createdAt: string;
                updatedAt: string;
              };
          createdAt: string;
          updatedAt: string;
          publishedAt: string;
        },
        void
      >({
        path: `/users/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users-permissions
     * @name UsersPermissionsDeleteUsersById
     * @request DELETE:/users/{id}
     */
    usersPermissionsDeleteUsersById: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          id: number;
          documentId: string;
          username: string;
          email: string;
          provider: string;
          confirmed: boolean;
          blocked: boolean;
          role?:
            | number
            | {
                id: number;
                name: string;
                description: string | null;
                type: string;
                createdAt: string;
                updatedAt: string;
              };
          createdAt: string;
          updatedAt: string;
          publishedAt: string;
        },
        void
      >({
        path: `/users/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users-permissions
     * @name UsersPermissionsGetRolesById
     * @request GET:/roles/{id}
     */
    usersPermissionsGetRolesById: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          role: {
            id: number;
            documentId: string;
            name: string;
            description: string | null;
            type: string;
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
            nb_users?: number;
            permissions?: Record<
              string,
              {
                controllers: Record<
                  string,
                  Record<
                    string,
                    {
                      enabled: boolean;
                      policy: string;
                    }
                  >
                >;
              }
            >;
            users?: any[];
          };
        },
        void
      >({
        path: `/roles/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users-permissions
     * @name UsersPermissionsGetRoles
     * @request GET:/roles
     */
    usersPermissionsGetRoles: (params: RequestParams = {}) =>
      this.request<
        {
          roles: {
            id: number;
            documentId: string;
            name: string;
            description: string | null;
            type: string;
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
            nb_users?: number;
            permissions?: Record<
              string,
              {
                controllers: Record<
                  string,
                  Record<
                    string,
                    {
                      enabled: boolean;
                      policy: string;
                    }
                  >
                >;
              }
            >;
            users?: any[];
          }[];
        },
        void
      >({
        path: `/roles`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users-permissions
     * @name UsersPermissionsPostRoles
     * @request POST:/roles
     */
    usersPermissionsPostRoles: (
      data: {
        name: string;
        description?: string;
        type: string;
        permissions?: Record<string, any>;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          ok: boolean;
        },
        void
      >({
        path: `/roles`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users-permissions
     * @name UsersPermissionsPutRolesByRole
     * @request PUT:/roles/{role}
     */
    usersPermissionsPutRolesByRole: (
      role: string,
      data: {
        name?: string;
        description?: string;
        type?: string;
        permissions?: Record<string, any>;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          ok: boolean;
        },
        void
      >({
        path: `/roles/${role}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users-permissions
     * @name UsersPermissionsDeleteRolesByRole
     * @request DELETE:/roles/{role}
     */
    usersPermissionsDeleteRolesByRole: (
      role: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          ok: boolean;
        },
        void
      >({
        path: `/roles/${role}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users-permissions
     * @name UsersPermissionsGetPermissions
     * @request GET:/permissions
     */
    usersPermissionsGetPermissions: (params: RequestParams = {}) =>
      this.request<
        {
          permissions: Record<
            string,
            {
              controllers: Record<
                string,
                Record<
                  string,
                  {
                    enabled: boolean;
                    policy: string;
                  }
                >
              >;
            }
          >;
        },
        void
      >({
        path: `/permissions`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
