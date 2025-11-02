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

export interface ArticleRequest {
  data: {
    Title: string;
    Slug: string;
    Summary?: string;
    coverUrl?: string;
    Body?: string;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface ArticleListResponse {
  data?: Article[];
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

export interface Article {
  id?: number;
  documentId?: string;
  Title: string;
  Slug: string;
  Summary?: string;
  coverUrl?: string;
  Body?: string;
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
    Slug?: string;
    Summary?: string;
    coverUrl?: string;
    Body?: string;
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

export interface ArticleResponse {
  data?: Article;
  meta?: object;
}

export interface ArticleBlockRequest {
  data: {
    Title?: string;
    items?: BaseNull &
      (
        | BaseNullComponentMapping<
            "image-slider-ref.image-slider-ref",
            ImageSliderRefImageSliderRefComponent
          >
        | BaseNullComponentMapping<
            "article-block-ref.article-block-ref",
            ArticleBlockRefArticleBlockRefComponent
          >
        | BaseNullComponentMapping<
            "steps-container-ref.steps-container-ref",
            StepsContainerRefStepsContainerRefComponent
          >
        | BaseNullComponentMapping<"cta-ref.cta-ref", CtaRefCtaRefComponent>
        | BaseNullComponentMapping<
            "contact-info-ref.contact-info-ref",
            ContactInfoRefContactInfoRefComponent
          >
        | BaseNullComponentMapping<
            "contact-section-ref.contact-section-ref",
            ContactSectionRefContactSectionRefComponent
          >
        | BaseNullComponentMapping<
            "feature-section-ref.feature-section-ref",
            FeatureSectionRefFeatureSectionRefComponent
          >
        | BaseNullComponentMapping<
            "feature-tab-ref.feature-tab-ref",
            FeatureTabRefFeatureTabRefComponent
          >
        | BaseNullComponentMapping<
            "hero-block-ref.hero-block-ref",
            HeroBlockRefHeroBlockRefComponent
          >
      );
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface ArticleBlockListResponse {
  data?: ArticleBlock[];
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

export interface ArticleBlock {
  id?: number;
  documentId?: string;
  Title?: string;
  items?: AbstractNull &
    (
      | AbstractNullComponentMapping<
          "image-slider-ref.image-slider-ref",
          ImageSliderRefImageSliderRefComponent
        >
      | AbstractNullComponentMapping<
          "article-block-ref.article-block-ref",
          ArticleBlockRefArticleBlockRefComponent
        >
      | AbstractNullComponentMapping<
          "steps-container-ref.steps-container-ref",
          StepsContainerRefStepsContainerRefComponent
        >
      | AbstractNullComponentMapping<"cta-ref.cta-ref", CtaRefCtaRefComponent>
      | AbstractNullComponentMapping<
          "contact-info-ref.contact-info-ref",
          ContactInfoRefContactInfoRefComponent
        >
      | AbstractNullComponentMapping<
          "contact-section-ref.contact-section-ref",
          ContactSectionRefContactSectionRefComponent
        >
      | AbstractNullComponentMapping<
          "feature-section-ref.feature-section-ref",
          FeatureSectionRefFeatureSectionRefComponent
        >
      | AbstractNullComponentMapping<
          "feature-tab-ref.feature-tab-ref",
          FeatureTabRefFeatureTabRefComponent
        >
      | AbstractNullComponentMapping<
          "hero-block-ref.hero-block-ref",
          HeroBlockRefHeroBlockRefComponent
        >
    );
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

export interface ArticleBlockResponse {
  data?: ArticleBlock;
  meta?: object;
}

export interface ImageSliderRefImageSliderRefComponent {
  id?: number;
  __component?: ImageSliderRefImageSliderRefComponentComponentEnum;
  slider?: {
    id?: number;
    documentId?: string;
  };
}

export interface ArticleBlockRefArticleBlockRefComponent {
  id?: number;
  __component?: ArticleBlockRefArticleBlockRefComponentComponentEnum;
  block?: {
    id?: number;
    documentId?: string;
  };
}

export interface StepsContainerRefStepsContainerRefComponent {
  id?: number;
  __component?: StepsContainerRefStepsContainerRefComponentComponentEnum;
  container?: {
    id?: number;
    documentId?: string;
  };
}

export interface CtaRefCtaRefComponent {
  id?: number;
  __component?: CtaRefCtaRefComponentComponentEnum;
  cta?: {
    id?: number;
    documentId?: string;
  };
}

export interface ContactInfoRefContactInfoRefComponent {
  id?: number;
  __component?: ContactInfoRefContactInfoRefComponentComponentEnum;
  contact_info?: {
    id?: number;
    documentId?: string;
  };
}

export interface ContactSectionRefContactSectionRefComponent {
  id?: number;
  __component?: ContactSectionRefContactSectionRefComponentComponentEnum;
  contact_section?: {
    id?: number;
    documentId?: string;
  };
}

export interface FeatureSectionRefFeatureSectionRefComponent {
  id?: number;
  __component?: FeatureSectionRefFeatureSectionRefComponentComponentEnum;
  feature_section?: {
    id?: number;
    documentId?: string;
  };
}

export interface FeatureTabRefFeatureTabRefComponent {
  id?: number;
  __component?: FeatureTabRefFeatureTabRefComponentComponentEnum;
  feature_tab?: {
    id?: number;
    documentId?: string;
  };
}

export interface HeroBlockRefHeroBlockRefComponent {
  id?: number;
  __component?: HeroBlockRefHeroBlockRefComponentComponentEnum;
  hero_block?: {
    id?: number;
    documentId?: string;
  };
}

export interface ConfigurationRequest {
  data: {
    Title?: string;
    pages?: (number | string)[];
    /** @example "string or id" */
    footer?: number | string;
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
  pages?: {
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
      pages?: {
        id?: number;
        documentId?: string;
      }[];
      footer?: {
        id?: number;
        documentId?: string;
        copyright?: string;
        columns?: FooterLinkColumnComponent[];
        socialLinks?: FooterSocialLinkComponent[];
        configuration?: {
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
    Menu?: ConfigurationMenuEnum;
    NavigationOrder?: number;
    NavigationAction?: ConfigurationNavigationActionEnum;
    template?: {
      id?: number;
      documentId?: string;
      Name?: string;
      TemplateType?: ConfigurationTemplateTypeEnum;
      page?: {
        id?: number;
        documentId?: string;
      };
      Content?: DiscriminatorNull &
        (
          | DiscriminatorNullComponentMapping<
              "image-slider-ref.image-slider-ref",
              ImageSliderRefImageSliderRefComponent
            >
          | DiscriminatorNullComponentMapping<
              "article-block-ref.article-block-ref",
              ArticleBlockRefArticleBlockRefComponent
            >
          | DiscriminatorNullComponentMapping<
              "steps-container-ref.steps-container-ref",
              StepsContainerRefStepsContainerRefComponent
            >
          | DiscriminatorNullComponentMapping<
              "cta-ref.cta-ref",
              CtaRefCtaRefComponent
            >
          | DiscriminatorNullComponentMapping<
              "contact-info-ref.contact-info-ref",
              ContactInfoRefContactInfoRefComponent
            >
          | DiscriminatorNullComponentMapping<
              "contact-section-ref.contact-section-ref",
              ContactSectionRefContactSectionRefComponent
            >
          | DiscriminatorNullComponentMapping<
              "feature-section-ref.feature-section-ref",
              FeatureSectionRefFeatureSectionRefComponent
            >
          | DiscriminatorNullComponentMapping<
              "feature-tab-ref.feature-tab-ref",
              FeatureTabRefFeatureTabRefComponent
            >
          | DiscriminatorNullComponentMapping<
              "hero-block-ref.hero-block-ref",
              HeroBlockRefHeroBlockRefComponent
            >
        );
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
  footer?: {
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
}

export interface ConfigurationResponse {
  data?: Configuration;
  meta?: object;
}

export interface FooterLinkComponent {
  id?: number;
  label?: string;
  url?: string;
  newTab?: boolean;
}

export interface FooterLinkColumnComponent {
  id?: number;
  title?: string;
  links?: FooterLinkComponent[];
}

export interface FooterSocialLinkComponent {
  id?: number;
  platform?: string;
  url?: string;
  icon?: string;
  detail?: string;
}

export interface ContactInfoRequest {
  data: {
    title?: string;
    content?: string;
    detail?: string;
    iconName?: string;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface ContactInfoListResponse {
  data?: ContactInfo[];
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

export interface ContactInfo {
  id?: number;
  documentId?: string;
  title?: string;
  content?: string;
  detail?: string;
  iconName?: string;
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
    title?: string;
    content?: string;
    detail?: string;
    iconName?: string;
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

export interface ContactInfoResponse {
  data?: ContactInfo;
  meta?: object;
}

export interface ContactSectionRequest {
  data: {
    introText?: string;
    heading?: string;
    description?: string;
    contactInfo?: (number | string)[];
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface ContactSectionListResponse {
  data?: ContactSection[];
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

export interface ContactSection {
  id?: number;
  documentId?: string;
  introText?: string;
  heading?: string;
  description?: string;
  contactInfo?: {
    id?: number;
    documentId?: string;
    title?: string;
    content?: string;
    detail?: string;
    iconName?: string;
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
    introText?: string;
    heading?: string;
    description?: string;
    contactInfo?: {
      id?: number;
      documentId?: string;
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
}

export interface ContactSectionResponse {
  data?: ContactSection;
  meta?: object;
}

export interface CtaRequest {
  data: {
    Label?: string;
    url?: string;
    OpenInNewTab?: boolean;
    article?: InternalNull &
      (
        | InternalNullComponentMapping<
            "image-slider-ref.image-slider-ref",
            ImageSliderRefImageSliderRefComponent
          >
        | InternalNullComponentMapping<
            "article-block-ref.article-block-ref",
            ArticleBlockRefArticleBlockRefComponent
          >
        | InternalNullComponentMapping<
            "steps-container-ref.steps-container-ref",
            StepsContainerRefStepsContainerRefComponent
          >
        | InternalNullComponentMapping<"cta-ref.cta-ref", CtaRefCtaRefComponent>
        | InternalNullComponentMapping<
            "contact-info-ref.contact-info-ref",
            ContactInfoRefContactInfoRefComponent
          >
        | InternalNullComponentMapping<
            "contact-section-ref.contact-section-ref",
            ContactSectionRefContactSectionRefComponent
          >
        | InternalNullComponentMapping<
            "feature-section-ref.feature-section-ref",
            FeatureSectionRefFeatureSectionRefComponent
          >
        | InternalNullComponentMapping<
            "feature-tab-ref.feature-tab-ref",
            FeatureTabRefFeatureTabRefComponent
          >
        | InternalNullComponentMapping<
            "hero-block-ref.hero-block-ref",
            HeroBlockRefHeroBlockRefComponent
          >
      );
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface CtaListResponse {
  data?: Cta[];
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

export interface Cta {
  id?: number;
  documentId?: string;
  Label?: string;
  url?: string;
  OpenInNewTab?: boolean;
  article?: PolymorphNull &
    (
      | PolymorphNullComponentMapping<
          "image-slider-ref.image-slider-ref",
          ImageSliderRefImageSliderRefComponent
        >
      | PolymorphNullComponentMapping<
          "article-block-ref.article-block-ref",
          ArticleBlockRefArticleBlockRefComponent
        >
      | PolymorphNullComponentMapping<
          "steps-container-ref.steps-container-ref",
          StepsContainerRefStepsContainerRefComponent
        >
      | PolymorphNullComponentMapping<"cta-ref.cta-ref", CtaRefCtaRefComponent>
      | PolymorphNullComponentMapping<
          "contact-info-ref.contact-info-ref",
          ContactInfoRefContactInfoRefComponent
        >
      | PolymorphNullComponentMapping<
          "contact-section-ref.contact-section-ref",
          ContactSectionRefContactSectionRefComponent
        >
      | PolymorphNullComponentMapping<
          "feature-section-ref.feature-section-ref",
          FeatureSectionRefFeatureSectionRefComponent
        >
      | PolymorphNullComponentMapping<
          "feature-tab-ref.feature-tab-ref",
          FeatureTabRefFeatureTabRefComponent
        >
      | PolymorphNullComponentMapping<
          "hero-block-ref.hero-block-ref",
          HeroBlockRefHeroBlockRefComponent
        >
    );
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

export interface CtaResponse {
  data?: Cta;
  meta?: object;
}

export interface FeatureSectionRequest {
  data: {
    reversed?: boolean;
    tabs?: (number | string)[];
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface FeatureSectionListResponse {
  data?: FeatureSection[];
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

export interface FeatureSection {
  id?: number;
  documentId?: string;
  reversed?: boolean;
  tabs?: {
    id?: number;
    documentId?: string;
    imgAlt?: string;
    imgSrc?: string;
    title?: string;
    description?: string;
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
    reversed?: boolean;
    tabs?: {
      id?: number;
      documentId?: string;
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
}

export interface FeatureSectionResponse {
  data?: FeatureSection;
  meta?: object;
}

export interface FeatureTabRequest {
  data: {
    imgAlt?: string;
    imgSrc?: string;
    title?: string;
    description?: string;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface FeatureTabListResponse {
  data?: FeatureTab[];
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

export interface FeatureTab {
  id?: number;
  documentId?: string;
  imgAlt?: string;
  imgSrc?: string;
  title?: string;
  description?: string;
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
    imgAlt?: string;
    imgSrc?: string;
    title?: string;
    description?: string;
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

export interface FeatureTabResponse {
  data?: FeatureTab;
  meta?: object;
}

export interface FooterRequest {
  data: {
    copyright?: string;
    columns?: FooterLinkColumnComponent[];
    socialLinks?: FooterSocialLinkComponent[];
    /** @example "string or id" */
    configuration?: number | string;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface FooterListResponse {
  data?: Footer[];
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

export interface Footer {
  id?: number;
  documentId?: string;
  copyright?: string;
  columns?: FooterLinkColumnComponent[];
  socialLinks?: FooterSocialLinkComponent[];
  configuration?: {
    id?: number;
    documentId?: string;
    Title?: string;
    pages?: {
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
      };
      Menu?: FooterMenuEnum;
      NavigationOrder?: number;
      NavigationAction?: FooterNavigationActionEnum;
      template?: {
        id?: number;
        documentId?: string;
        Name?: string;
        TemplateType?: FooterTemplateTypeEnum;
        page?: {
          id?: number;
          documentId?: string;
        };
        Content?: InternalNull1 &
          (
            | InternalNull1ComponentMapping<
                "image-slider-ref.image-slider-ref",
                ImageSliderRefImageSliderRefComponent
              >
            | InternalNull1ComponentMapping<
                "article-block-ref.article-block-ref",
                ArticleBlockRefArticleBlockRefComponent
              >
            | InternalNull1ComponentMapping<
                "steps-container-ref.steps-container-ref",
                StepsContainerRefStepsContainerRefComponent
              >
            | InternalNull1ComponentMapping<
                "cta-ref.cta-ref",
                CtaRefCtaRefComponent
              >
            | InternalNull1ComponentMapping<
                "contact-info-ref.contact-info-ref",
                ContactInfoRefContactInfoRefComponent
              >
            | InternalNull1ComponentMapping<
                "contact-section-ref.contact-section-ref",
                ContactSectionRefContactSectionRefComponent
              >
            | InternalNull1ComponentMapping<
                "feature-section-ref.feature-section-ref",
                FeatureSectionRefFeatureSectionRefComponent
              >
            | InternalNull1ComponentMapping<
                "feature-tab-ref.feature-tab-ref",
                FeatureTabRefFeatureTabRefComponent
              >
            | InternalNull1ComponentMapping<
                "hero-block-ref.hero-block-ref",
                HeroBlockRefHeroBlockRefComponent
              >
          );
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
    footer?: {
      id?: number;
      documentId?: string;
      copyright?: string;
      columns?: FooterLinkColumnComponent[];
      socialLinks?: FooterSocialLinkComponent[];
      configuration?: {
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
}

export interface FooterResponse {
  data?: Footer;
  meta?: object;
}

export interface HeroBlockRequest {
  data: {
    heading?: string;
    content?: string;
    actions?: (number | string)[];
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface HeroBlockListResponse {
  data?: HeroBlock[];
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

export interface HeroBlock {
  id?: number;
  documentId?: string;
  heading?: string;
  content?: string;
  actions?: {
    id?: number;
    documentId?: string;
    Label?: string;
    url?: string;
    OpenInNewTab?: boolean;
    article?: DiscriminatorNull1 &
      (
        | DiscriminatorNull1ComponentMapping<
            "image-slider-ref.image-slider-ref",
            ImageSliderRefImageSliderRefComponent
          >
        | DiscriminatorNull1ComponentMapping<
            "article-block-ref.article-block-ref",
            ArticleBlockRefArticleBlockRefComponent
          >
        | DiscriminatorNull1ComponentMapping<
            "steps-container-ref.steps-container-ref",
            StepsContainerRefStepsContainerRefComponent
          >
        | DiscriminatorNull1ComponentMapping<
            "cta-ref.cta-ref",
            CtaRefCtaRefComponent
          >
        | DiscriminatorNull1ComponentMapping<
            "contact-info-ref.contact-info-ref",
            ContactInfoRefContactInfoRefComponent
          >
        | DiscriminatorNull1ComponentMapping<
            "contact-section-ref.contact-section-ref",
            ContactSectionRefContactSectionRefComponent
          >
        | DiscriminatorNull1ComponentMapping<
            "feature-section-ref.feature-section-ref",
            FeatureSectionRefFeatureSectionRefComponent
          >
        | DiscriminatorNull1ComponentMapping<
            "feature-tab-ref.feature-tab-ref",
            FeatureTabRefFeatureTabRefComponent
          >
        | DiscriminatorNull1ComponentMapping<
            "hero-block-ref.hero-block-ref",
            HeroBlockRefHeroBlockRefComponent
          >
      );
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
}

export interface HeroBlockResponse {
  data?: HeroBlock;
  meta?: object;
}

export interface ImageSliderRequest {
  data: {
    Title?: string;
    reversed?: boolean;
    AutoPlay?: boolean;
    IntervalMs?: number;
    Slides?: DiscriminatorNull2 &
      (
        | DiscriminatorNull2ComponentMapping<
            "image-slider-ref.image-slider-ref",
            ImageSliderRefImageSliderRefComponent
          >
        | DiscriminatorNull2ComponentMapping<
            "article-block-ref.article-block-ref",
            ArticleBlockRefArticleBlockRefComponent
          >
        | DiscriminatorNull2ComponentMapping<
            "steps-container-ref.steps-container-ref",
            StepsContainerRefStepsContainerRefComponent
          >
        | DiscriminatorNull2ComponentMapping<
            "cta-ref.cta-ref",
            CtaRefCtaRefComponent
          >
        | DiscriminatorNull2ComponentMapping<
            "contact-info-ref.contact-info-ref",
            ContactInfoRefContactInfoRefComponent
          >
        | DiscriminatorNull2ComponentMapping<
            "contact-section-ref.contact-section-ref",
            ContactSectionRefContactSectionRefComponent
          >
        | DiscriminatorNull2ComponentMapping<
            "feature-section-ref.feature-section-ref",
            FeatureSectionRefFeatureSectionRefComponent
          >
        | DiscriminatorNull2ComponentMapping<
            "feature-tab-ref.feature-tab-ref",
            FeatureTabRefFeatureTabRefComponent
          >
        | DiscriminatorNull2ComponentMapping<
            "hero-block-ref.hero-block-ref",
            HeroBlockRefHeroBlockRefComponent
          >
      );
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface ImageSliderListResponse {
  data?: ImageSlider[];
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

export interface ImageSlider {
  id?: number;
  documentId?: string;
  Title?: string;
  reversed?: boolean;
  AutoPlay?: boolean;
  IntervalMs?: number;
  Slides?: InternalNull2 &
    (
      | InternalNull2ComponentMapping<
          "image-slider-ref.image-slider-ref",
          ImageSliderRefImageSliderRefComponent
        >
      | InternalNull2ComponentMapping<
          "article-block-ref.article-block-ref",
          ArticleBlockRefArticleBlockRefComponent
        >
      | InternalNull2ComponentMapping<
          "steps-container-ref.steps-container-ref",
          StepsContainerRefStepsContainerRefComponent
        >
      | InternalNull2ComponentMapping<"cta-ref.cta-ref", CtaRefCtaRefComponent>
      | InternalNull2ComponentMapping<
          "contact-info-ref.contact-info-ref",
          ContactInfoRefContactInfoRefComponent
        >
      | InternalNull2ComponentMapping<
          "contact-section-ref.contact-section-ref",
          ContactSectionRefContactSectionRefComponent
        >
      | InternalNull2ComponentMapping<
          "feature-section-ref.feature-section-ref",
          FeatureSectionRefFeatureSectionRefComponent
        >
      | InternalNull2ComponentMapping<
          "feature-tab-ref.feature-tab-ref",
          FeatureTabRefFeatureTabRefComponent
        >
      | InternalNull2ComponentMapping<
          "hero-block-ref.hero-block-ref",
          HeroBlockRefHeroBlockRefComponent
        >
    );
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

export interface ImageSliderResponse {
  data?: ImageSlider;
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
    NavigationAction?: PageRequestNavigationActionEnum;
    /** @example "string or id" */
    template?: number | string;
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
      pages?: {
        id?: number;
        documentId?: string;
      }[];
      footer?: {
        id?: number;
        documentId?: string;
        copyright?: string;
        columns?: FooterLinkColumnComponent[];
        socialLinks?: FooterSocialLinkComponent[];
        configuration?: {
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
    Menu?: PageMenuEnum;
    NavigationOrder?: number;
    NavigationAction?: PageNavigationActionEnum;
    template?: {
      id?: number;
      documentId?: string;
      Name?: string;
      TemplateType?: PageTemplateTypeEnum;
      page?: {
        id?: number;
        documentId?: string;
      };
      Content?: PolymorphNull1 &
        (
          | PolymorphNull1ComponentMapping<
              "image-slider-ref.image-slider-ref",
              ImageSliderRefImageSliderRefComponent
            >
          | PolymorphNull1ComponentMapping<
              "article-block-ref.article-block-ref",
              ArticleBlockRefArticleBlockRefComponent
            >
          | PolymorphNull1ComponentMapping<
              "steps-container-ref.steps-container-ref",
              StepsContainerRefStepsContainerRefComponent
            >
          | PolymorphNull1ComponentMapping<
              "cta-ref.cta-ref",
              CtaRefCtaRefComponent
            >
          | PolymorphNull1ComponentMapping<
              "contact-info-ref.contact-info-ref",
              ContactInfoRefContactInfoRefComponent
            >
          | PolymorphNull1ComponentMapping<
              "contact-section-ref.contact-section-ref",
              ContactSectionRefContactSectionRefComponent
            >
          | PolymorphNull1ComponentMapping<
              "feature-section-ref.feature-section-ref",
              FeatureSectionRefFeatureSectionRefComponent
            >
          | PolymorphNull1ComponentMapping<
              "feature-tab-ref.feature-tab-ref",
              FeatureTabRefFeatureTabRefComponent
            >
          | PolymorphNull1ComponentMapping<
              "hero-block-ref.hero-block-ref",
              HeroBlockRefHeroBlockRefComponent
            >
        );
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
  NavigationAction?: PageNavigationActionEnum1;
  template?: {
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
}

export interface PageResponse {
  data?: Page;
  meta?: object;
}

export interface StepsContainerRequest {
  data: {
    heading?: string;
    content?: string;
    action?: DiscriminatorNull3 &
      (
        | DiscriminatorNull3ComponentMapping<
            "image-slider-ref.image-slider-ref",
            ImageSliderRefImageSliderRefComponent
          >
        | DiscriminatorNull3ComponentMapping<
            "article-block-ref.article-block-ref",
            ArticleBlockRefArticleBlockRefComponent
          >
        | DiscriminatorNull3ComponentMapping<
            "steps-container-ref.steps-container-ref",
            StepsContainerRefStepsContainerRefComponent
          >
        | DiscriminatorNull3ComponentMapping<
            "cta-ref.cta-ref",
            CtaRefCtaRefComponent
          >
        | DiscriminatorNull3ComponentMapping<
            "contact-info-ref.contact-info-ref",
            ContactInfoRefContactInfoRefComponent
          >
        | DiscriminatorNull3ComponentMapping<
            "contact-section-ref.contact-section-ref",
            ContactSectionRefContactSectionRefComponent
          >
        | DiscriminatorNull3ComponentMapping<
            "feature-section-ref.feature-section-ref",
            FeatureSectionRefFeatureSectionRefComponent
          >
        | DiscriminatorNull3ComponentMapping<
            "feature-tab-ref.feature-tab-ref",
            FeatureTabRefFeatureTabRefComponent
          >
        | DiscriminatorNull3ComponentMapping<
            "hero-block-ref.hero-block-ref",
            HeroBlockRefHeroBlockRefComponent
          >
      );
    steps?: InternalNull3 &
      (
        | InternalNull3ComponentMapping<
            "image-slider-ref.image-slider-ref",
            ImageSliderRefImageSliderRefComponent
          >
        | InternalNull3ComponentMapping<
            "article-block-ref.article-block-ref",
            ArticleBlockRefArticleBlockRefComponent
          >
        | InternalNull3ComponentMapping<
            "steps-container-ref.steps-container-ref",
            StepsContainerRefStepsContainerRefComponent
          >
        | InternalNull3ComponentMapping<
            "cta-ref.cta-ref",
            CtaRefCtaRefComponent
          >
        | InternalNull3ComponentMapping<
            "contact-info-ref.contact-info-ref",
            ContactInfoRefContactInfoRefComponent
          >
        | InternalNull3ComponentMapping<
            "contact-section-ref.contact-section-ref",
            ContactSectionRefContactSectionRefComponent
          >
        | InternalNull3ComponentMapping<
            "feature-section-ref.feature-section-ref",
            FeatureSectionRefFeatureSectionRefComponent
          >
        | InternalNull3ComponentMapping<
            "feature-tab-ref.feature-tab-ref",
            FeatureTabRefFeatureTabRefComponent
          >
        | InternalNull3ComponentMapping<
            "hero-block-ref.hero-block-ref",
            HeroBlockRefHeroBlockRefComponent
          >
      );
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface StepsContainerListResponse {
  data?: StepsContainer[];
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

export interface StepsContainer {
  id?: number;
  documentId?: string;
  heading?: string;
  content?: string;
  action?: DiscriminatorNull4 &
    (
      | DiscriminatorNull4ComponentMapping<
          "image-slider-ref.image-slider-ref",
          ImageSliderRefImageSliderRefComponent
        >
      | DiscriminatorNull4ComponentMapping<
          "article-block-ref.article-block-ref",
          ArticleBlockRefArticleBlockRefComponent
        >
      | DiscriminatorNull4ComponentMapping<
          "steps-container-ref.steps-container-ref",
          StepsContainerRefStepsContainerRefComponent
        >
      | DiscriminatorNull4ComponentMapping<
          "cta-ref.cta-ref",
          CtaRefCtaRefComponent
        >
      | DiscriminatorNull4ComponentMapping<
          "contact-info-ref.contact-info-ref",
          ContactInfoRefContactInfoRefComponent
        >
      | DiscriminatorNull4ComponentMapping<
          "contact-section-ref.contact-section-ref",
          ContactSectionRefContactSectionRefComponent
        >
      | DiscriminatorNull4ComponentMapping<
          "feature-section-ref.feature-section-ref",
          FeatureSectionRefFeatureSectionRefComponent
        >
      | DiscriminatorNull4ComponentMapping<
          "feature-tab-ref.feature-tab-ref",
          FeatureTabRefFeatureTabRefComponent
        >
      | DiscriminatorNull4ComponentMapping<
          "hero-block-ref.hero-block-ref",
          HeroBlockRefHeroBlockRefComponent
        >
    );
  steps?: DiscriminatorNull5 &
    (
      | DiscriminatorNull5ComponentMapping<
          "image-slider-ref.image-slider-ref",
          ImageSliderRefImageSliderRefComponent
        >
      | DiscriminatorNull5ComponentMapping<
          "article-block-ref.article-block-ref",
          ArticleBlockRefArticleBlockRefComponent
        >
      | DiscriminatorNull5ComponentMapping<
          "steps-container-ref.steps-container-ref",
          StepsContainerRefStepsContainerRefComponent
        >
      | DiscriminatorNull5ComponentMapping<
          "cta-ref.cta-ref",
          CtaRefCtaRefComponent
        >
      | DiscriminatorNull5ComponentMapping<
          "contact-info-ref.contact-info-ref",
          ContactInfoRefContactInfoRefComponent
        >
      | DiscriminatorNull5ComponentMapping<
          "contact-section-ref.contact-section-ref",
          ContactSectionRefContactSectionRefComponent
        >
      | DiscriminatorNull5ComponentMapping<
          "feature-section-ref.feature-section-ref",
          FeatureSectionRefFeatureSectionRefComponent
        >
      | DiscriminatorNull5ComponentMapping<
          "feature-tab-ref.feature-tab-ref",
          FeatureTabRefFeatureTabRefComponent
        >
      | DiscriminatorNull5ComponentMapping<
          "hero-block-ref.hero-block-ref",
          HeroBlockRefHeroBlockRefComponent
        >
    );
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

export interface StepsContainerResponse {
  data?: StepsContainer;
  meta?: object;
}

export interface TemplateRequest {
  data: {
    Name?: string;
    TemplateType?: TemplateRequestTemplateTypeEnum;
    /** @example "string or id" */
    page?: number | string;
    Content?: InternalNull4 &
      (
        | InternalNull4ComponentMapping<
            "image-slider-ref.image-slider-ref",
            ImageSliderRefImageSliderRefComponent
          >
        | InternalNull4ComponentMapping<
            "article-block-ref.article-block-ref",
            ArticleBlockRefArticleBlockRefComponent
          >
        | InternalNull4ComponentMapping<
            "steps-container-ref.steps-container-ref",
            StepsContainerRefStepsContainerRefComponent
          >
        | InternalNull4ComponentMapping<
            "cta-ref.cta-ref",
            CtaRefCtaRefComponent
          >
        | InternalNull4ComponentMapping<
            "contact-info-ref.contact-info-ref",
            ContactInfoRefContactInfoRefComponent
          >
        | InternalNull4ComponentMapping<
            "contact-section-ref.contact-section-ref",
            ContactSectionRefContactSectionRefComponent
          >
        | InternalNull4ComponentMapping<
            "feature-section-ref.feature-section-ref",
            FeatureSectionRefFeatureSectionRefComponent
          >
        | InternalNull4ComponentMapping<
            "feature-tab-ref.feature-tab-ref",
            FeatureTabRefFeatureTabRefComponent
          >
        | InternalNull4ComponentMapping<
            "hero-block-ref.hero-block-ref",
            HeroBlockRefHeroBlockRefComponent
          >
      );
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface TemplateListResponse {
  data?: Template[];
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

export interface Template {
  id?: number;
  documentId?: string;
  Name?: string;
  TemplateType?: TemplateTemplateTypeEnum;
  page?: {
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
      pages?: {
        id?: number;
        documentId?: string;
      }[];
      footer?: {
        id?: number;
        documentId?: string;
        copyright?: string;
        columns?: FooterLinkColumnComponent[];
        socialLinks?: FooterSocialLinkComponent[];
        configuration?: {
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
    Menu?: TemplateMenuEnum;
    NavigationOrder?: number;
    NavigationAction?: TemplateNavigationActionEnum;
    template?: {
      id?: number;
      documentId?: string;
      Name?: string;
      TemplateType?: TemplateTemplateTypeEnum1;
      page?: {
        id?: number;
        documentId?: string;
      };
      Content?: PolymorphNull2 &
        (
          | PolymorphNull2ComponentMapping<
              "image-slider-ref.image-slider-ref",
              ImageSliderRefImageSliderRefComponent
            >
          | PolymorphNull2ComponentMapping<
              "article-block-ref.article-block-ref",
              ArticleBlockRefArticleBlockRefComponent
            >
          | PolymorphNull2ComponentMapping<
              "steps-container-ref.steps-container-ref",
              StepsContainerRefStepsContainerRefComponent
            >
          | PolymorphNull2ComponentMapping<
              "cta-ref.cta-ref",
              CtaRefCtaRefComponent
            >
          | PolymorphNull2ComponentMapping<
              "contact-info-ref.contact-info-ref",
              ContactInfoRefContactInfoRefComponent
            >
          | PolymorphNull2ComponentMapping<
              "contact-section-ref.contact-section-ref",
              ContactSectionRefContactSectionRefComponent
            >
          | PolymorphNull2ComponentMapping<
              "feature-section-ref.feature-section-ref",
              FeatureSectionRefFeatureSectionRefComponent
            >
          | PolymorphNull2ComponentMapping<
              "feature-tab-ref.feature-tab-ref",
              FeatureTabRefFeatureTabRefComponent
            >
          | PolymorphNull2ComponentMapping<
              "hero-block-ref.hero-block-ref",
              HeroBlockRefHeroBlockRefComponent
            >
        );
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
  Content?: PolymorphNull3 &
    (
      | PolymorphNull3ComponentMapping<
          "image-slider-ref.image-slider-ref",
          ImageSliderRefImageSliderRefComponent
        >
      | PolymorphNull3ComponentMapping<
          "article-block-ref.article-block-ref",
          ArticleBlockRefArticleBlockRefComponent
        >
      | PolymorphNull3ComponentMapping<
          "steps-container-ref.steps-container-ref",
          StepsContainerRefStepsContainerRefComponent
        >
      | PolymorphNull3ComponentMapping<"cta-ref.cta-ref", CtaRefCtaRefComponent>
      | PolymorphNull3ComponentMapping<
          "contact-info-ref.contact-info-ref",
          ContactInfoRefContactInfoRefComponent
        >
      | PolymorphNull3ComponentMapping<
          "contact-section-ref.contact-section-ref",
          ContactSectionRefContactSectionRefComponent
        >
      | PolymorphNull3ComponentMapping<
          "feature-section-ref.feature-section-ref",
          FeatureSectionRefFeatureSectionRefComponent
        >
      | PolymorphNull3ComponentMapping<
          "feature-tab-ref.feature-tab-ref",
          FeatureTabRefFeatureTabRefComponent
        >
      | PolymorphNull3ComponentMapping<
          "hero-block-ref.hero-block-ref",
          HeroBlockRefHeroBlockRefComponent
        >
    );
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

export interface TemplateResponse {
  data?: Template;
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

type BaseNull = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleBlockRefArticleBlockRefComponent
  | StepsContainerRefStepsContainerRefComponent
  | CtaRefCtaRefComponent
  | ContactInfoRefContactInfoRefComponent
  | ContactSectionRefContactSectionRefComponent
  | FeatureSectionRefFeatureSectionRefComponent
  | FeatureTabRefFeatureTabRefComponent
  | HeroBlockRefHeroBlockRefComponent
)[];

type BaseNullComponentMapping<Key, Type> = {
  __component: Key;
} & Type;

type AbstractNull = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleBlockRefArticleBlockRefComponent
  | StepsContainerRefStepsContainerRefComponent
  | CtaRefCtaRefComponent
  | ContactInfoRefContactInfoRefComponent
  | ContactSectionRefContactSectionRefComponent
  | FeatureSectionRefFeatureSectionRefComponent
  | FeatureTabRefFeatureTabRefComponent
  | HeroBlockRefHeroBlockRefComponent
)[];

type AbstractNullComponentMapping<Key, Type> = {
  __component: Key;
} & Type;

export enum ImageSliderRefImageSliderRefComponentComponentEnum {
  ImageSliderRefImageSliderRef = "image-slider-ref.image-slider-ref",
}

export enum ArticleBlockRefArticleBlockRefComponentComponentEnum {
  ArticleBlockRefArticleBlockRef = "article-block-ref.article-block-ref",
}

export enum StepsContainerRefStepsContainerRefComponentComponentEnum {
  StepsContainerRefStepsContainerRef = "steps-container-ref.steps-container-ref",
}

export enum CtaRefCtaRefComponentComponentEnum {
  CtaRefCtaRef = "cta-ref.cta-ref",
}

export enum ContactInfoRefContactInfoRefComponentComponentEnum {
  ContactInfoRefContactInfoRef = "contact-info-ref.contact-info-ref",
}

export enum ContactSectionRefContactSectionRefComponentComponentEnum {
  ContactSectionRefContactSectionRef = "contact-section-ref.contact-section-ref",
}

export enum FeatureSectionRefFeatureSectionRefComponentComponentEnum {
  FeatureSectionRefFeatureSectionRef = "feature-section-ref.feature-section-ref",
}

export enum FeatureTabRefFeatureTabRefComponentComponentEnum {
  FeatureTabRefFeatureTabRef = "feature-tab-ref.feature-tab-ref",
}

export enum HeroBlockRefHeroBlockRefComponentComponentEnum {
  HeroBlockRefHeroBlockRef = "hero-block-ref.hero-block-ref",
}

export enum ConfigurationMenuEnum {
  Main = "Main",
  Login = "Login",
}

export enum ConfigurationNavigationActionEnum {
  Link = "Link",
  Action = "Action",
}

export enum ConfigurationTemplateTypeEnum {
  Standard = "Standard",
}

type DiscriminatorNull = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleBlockRefArticleBlockRefComponent
  | StepsContainerRefStepsContainerRefComponent
  | CtaRefCtaRefComponent
  | ContactInfoRefContactInfoRefComponent
  | ContactSectionRefContactSectionRefComponent
  | FeatureSectionRefFeatureSectionRefComponent
  | FeatureTabRefFeatureTabRefComponent
  | HeroBlockRefHeroBlockRefComponent
)[];

type DiscriminatorNullComponentMapping<Key, Type> = {
  __component: Key;
} & Type;

type InternalNull = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleBlockRefArticleBlockRefComponent
  | StepsContainerRefStepsContainerRefComponent
  | CtaRefCtaRefComponent
  | ContactInfoRefContactInfoRefComponent
  | ContactSectionRefContactSectionRefComponent
  | FeatureSectionRefFeatureSectionRefComponent
  | FeatureTabRefFeatureTabRefComponent
  | HeroBlockRefHeroBlockRefComponent
)[];

type InternalNullComponentMapping<Key, Type> = {
  __component: Key;
} & Type;

type PolymorphNull = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleBlockRefArticleBlockRefComponent
  | StepsContainerRefStepsContainerRefComponent
  | CtaRefCtaRefComponent
  | ContactInfoRefContactInfoRefComponent
  | ContactSectionRefContactSectionRefComponent
  | FeatureSectionRefFeatureSectionRefComponent
  | FeatureTabRefFeatureTabRefComponent
  | HeroBlockRefHeroBlockRefComponent
)[];

type PolymorphNullComponentMapping<Key, Type> = {
  __component: Key;
} & Type;

export enum FooterMenuEnum {
  Main = "Main",
  Login = "Login",
}

export enum FooterNavigationActionEnum {
  Link = "Link",
  Action = "Action",
}

export enum FooterTemplateTypeEnum {
  Standard = "Standard",
}

type InternalNull1 = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleBlockRefArticleBlockRefComponent
  | StepsContainerRefStepsContainerRefComponent
  | CtaRefCtaRefComponent
  | ContactInfoRefContactInfoRefComponent
  | ContactSectionRefContactSectionRefComponent
  | FeatureSectionRefFeatureSectionRefComponent
  | FeatureTabRefFeatureTabRefComponent
  | HeroBlockRefHeroBlockRefComponent
)[];

type InternalNull1ComponentMapping<Key, Type> = {
  __component: Key;
} & Type;

type DiscriminatorNull1 = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleBlockRefArticleBlockRefComponent
  | StepsContainerRefStepsContainerRefComponent
  | CtaRefCtaRefComponent
  | ContactInfoRefContactInfoRefComponent
  | ContactSectionRefContactSectionRefComponent
  | FeatureSectionRefFeatureSectionRefComponent
  | FeatureTabRefFeatureTabRefComponent
  | HeroBlockRefHeroBlockRefComponent
)[];

type DiscriminatorNull1ComponentMapping<Key, Type> = {
  __component: Key;
} & Type;

type DiscriminatorNull2 = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleBlockRefArticleBlockRefComponent
  | StepsContainerRefStepsContainerRefComponent
  | CtaRefCtaRefComponent
  | ContactInfoRefContactInfoRefComponent
  | ContactSectionRefContactSectionRefComponent
  | FeatureSectionRefFeatureSectionRefComponent
  | FeatureTabRefFeatureTabRefComponent
  | HeroBlockRefHeroBlockRefComponent
)[];

type DiscriminatorNull2ComponentMapping<Key, Type> = {
  __component: Key;
} & Type;

type InternalNull2 = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleBlockRefArticleBlockRefComponent
  | StepsContainerRefStepsContainerRefComponent
  | CtaRefCtaRefComponent
  | ContactInfoRefContactInfoRefComponent
  | ContactSectionRefContactSectionRefComponent
  | FeatureSectionRefFeatureSectionRefComponent
  | FeatureTabRefFeatureTabRefComponent
  | HeroBlockRefHeroBlockRefComponent
)[];

type InternalNull2ComponentMapping<Key, Type> = {
  __component: Key;
} & Type;

export enum PageRequestMenuEnum {
  Main = "Main",
  Login = "Login",
}

export enum PageRequestNavigationActionEnum {
  Link = "Link",
  Action = "Action",
}

export enum PageMenuEnum {
  Main = "Main",
  Login = "Login",
}

export enum PageNavigationActionEnum {
  Link = "Link",
  Action = "Action",
}

export enum PageTemplateTypeEnum {
  Standard = "Standard",
}

type PolymorphNull1 = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleBlockRefArticleBlockRefComponent
  | StepsContainerRefStepsContainerRefComponent
  | CtaRefCtaRefComponent
  | ContactInfoRefContactInfoRefComponent
  | ContactSectionRefContactSectionRefComponent
  | FeatureSectionRefFeatureSectionRefComponent
  | FeatureTabRefFeatureTabRefComponent
  | HeroBlockRefHeroBlockRefComponent
)[];

type PolymorphNull1ComponentMapping<Key, Type> = {
  __component: Key;
} & Type;

export enum PageMenuEnum1 {
  Main = "Main",
  Login = "Login",
}

export enum PageNavigationActionEnum1 {
  Link = "Link",
  Action = "Action",
}

type DiscriminatorNull3 = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleBlockRefArticleBlockRefComponent
  | StepsContainerRefStepsContainerRefComponent
  | CtaRefCtaRefComponent
  | ContactInfoRefContactInfoRefComponent
  | ContactSectionRefContactSectionRefComponent
  | FeatureSectionRefFeatureSectionRefComponent
  | FeatureTabRefFeatureTabRefComponent
  | HeroBlockRefHeroBlockRefComponent
)[];

type DiscriminatorNull3ComponentMapping<Key, Type> = {
  __component: Key;
} & Type;

type InternalNull3 = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleBlockRefArticleBlockRefComponent
  | StepsContainerRefStepsContainerRefComponent
  | CtaRefCtaRefComponent
  | ContactInfoRefContactInfoRefComponent
  | ContactSectionRefContactSectionRefComponent
  | FeatureSectionRefFeatureSectionRefComponent
  | FeatureTabRefFeatureTabRefComponent
  | HeroBlockRefHeroBlockRefComponent
)[];

type InternalNull3ComponentMapping<Key, Type> = {
  __component: Key;
} & Type;

type DiscriminatorNull4 = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleBlockRefArticleBlockRefComponent
  | StepsContainerRefStepsContainerRefComponent
  | CtaRefCtaRefComponent
  | ContactInfoRefContactInfoRefComponent
  | ContactSectionRefContactSectionRefComponent
  | FeatureSectionRefFeatureSectionRefComponent
  | FeatureTabRefFeatureTabRefComponent
  | HeroBlockRefHeroBlockRefComponent
)[];

type DiscriminatorNull4ComponentMapping<Key, Type> = {
  __component: Key;
} & Type;

type DiscriminatorNull5 = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleBlockRefArticleBlockRefComponent
  | StepsContainerRefStepsContainerRefComponent
  | CtaRefCtaRefComponent
  | ContactInfoRefContactInfoRefComponent
  | ContactSectionRefContactSectionRefComponent
  | FeatureSectionRefFeatureSectionRefComponent
  | FeatureTabRefFeatureTabRefComponent
  | HeroBlockRefHeroBlockRefComponent
)[];

type DiscriminatorNull5ComponentMapping<Key, Type> = {
  __component: Key;
} & Type;

export enum TemplateRequestTemplateTypeEnum {
  Standard = "Standard",
}

type InternalNull4 = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleBlockRefArticleBlockRefComponent
  | StepsContainerRefStepsContainerRefComponent
  | CtaRefCtaRefComponent
  | ContactInfoRefContactInfoRefComponent
  | ContactSectionRefContactSectionRefComponent
  | FeatureSectionRefFeatureSectionRefComponent
  | FeatureTabRefFeatureTabRefComponent
  | HeroBlockRefHeroBlockRefComponent
)[];

type InternalNull4ComponentMapping<Key, Type> = {
  __component: Key;
} & Type;

export enum TemplateTemplateTypeEnum {
  Standard = "Standard",
}

export enum TemplateMenuEnum {
  Main = "Main",
  Login = "Login",
}

export enum TemplateNavigationActionEnum {
  Link = "Link",
  Action = "Action",
}

export enum TemplateTemplateTypeEnum1 {
  Standard = "Standard",
}

type PolymorphNull2 = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleBlockRefArticleBlockRefComponent
  | StepsContainerRefStepsContainerRefComponent
  | CtaRefCtaRefComponent
  | ContactInfoRefContactInfoRefComponent
  | ContactSectionRefContactSectionRefComponent
  | FeatureSectionRefFeatureSectionRefComponent
  | FeatureTabRefFeatureTabRefComponent
  | HeroBlockRefHeroBlockRefComponent
)[];

type PolymorphNull2ComponentMapping<Key, Type> = {
  __component: Key;
} & Type;

type PolymorphNull3 = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleBlockRefArticleBlockRefComponent
  | StepsContainerRefStepsContainerRefComponent
  | CtaRefCtaRefComponent
  | ContactInfoRefContactInfoRefComponent
  | ContactSectionRefContactSectionRefComponent
  | FeatureSectionRefFeatureSectionRefComponent
  | FeatureTabRefFeatureTabRefComponent
  | HeroBlockRefHeroBlockRefComponent
)[];

type PolymorphNull3ComponentMapping<Key, Type> = {
  __component: Key;
} & Type;

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
  article = {
    /**
     * No description
     *
     * @tags Article
     * @name GetArticles
     * @request GET:/articles
     * @secure
     */
    getArticles: (
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
      this.request<ArticleListResponse, Error>({
        path: `/articles`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Article
     * @name PostArticles
     * @request POST:/articles
     * @secure
     */
    postArticles: (data: ArticleRequest, params: RequestParams = {}) =>
      this.request<ArticleResponse, Error>({
        path: `/articles`,
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
     * @tags Article
     * @name GetArticlesId
     * @request GET:/articles/{id}
     * @secure
     */
    getArticlesId: (id: number, params: RequestParams = {}) =>
      this.request<ArticleResponse, Error>({
        path: `/articles/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Article
     * @name PutArticlesId
     * @request PUT:/articles/{id}
     * @secure
     */
    putArticlesId: (
      id: number,
      data: ArticleRequest,
      params: RequestParams = {},
    ) =>
      this.request<ArticleResponse, Error>({
        path: `/articles/${id}`,
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
     * @tags Article
     * @name DeleteArticlesId
     * @request DELETE:/articles/{id}
     * @secure
     */
    deleteArticlesId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/articles/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  articleBlock = {
    /**
     * No description
     *
     * @tags Article-block
     * @name GetArticleBlocks
     * @request GET:/article-blocks
     * @secure
     */
    getArticleBlocks: (
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
      this.request<ArticleBlockListResponse, Error>({
        path: `/article-blocks`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Article-block
     * @name PostArticleBlocks
     * @request POST:/article-blocks
     * @secure
     */
    postArticleBlocks: (
      data: ArticleBlockRequest,
      params: RequestParams = {},
    ) =>
      this.request<ArticleBlockResponse, Error>({
        path: `/article-blocks`,
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
     * @tags Article-block
     * @name GetArticleBlocksId
     * @request GET:/article-blocks/{id}
     * @secure
     */
    getArticleBlocksId: (id: number, params: RequestParams = {}) =>
      this.request<ArticleBlockResponse, Error>({
        path: `/article-blocks/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Article-block
     * @name PutArticleBlocksId
     * @request PUT:/article-blocks/{id}
     * @secure
     */
    putArticleBlocksId: (
      id: number,
      data: ArticleBlockRequest,
      params: RequestParams = {},
    ) =>
      this.request<ArticleBlockResponse, Error>({
        path: `/article-blocks/${id}`,
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
     * @tags Article-block
     * @name DeleteArticleBlocksId
     * @request DELETE:/article-blocks/{id}
     * @secure
     */
    deleteArticleBlocksId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/article-blocks/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
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
  contactInfo = {
    /**
     * No description
     *
     * @tags Contact-info
     * @name GetContactInfos
     * @request GET:/contact-infos
     * @secure
     */
    getContactInfos: (
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
      this.request<ContactInfoListResponse, Error>({
        path: `/contact-infos`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Contact-info
     * @name PostContactInfos
     * @request POST:/contact-infos
     * @secure
     */
    postContactInfos: (data: ContactInfoRequest, params: RequestParams = {}) =>
      this.request<ContactInfoResponse, Error>({
        path: `/contact-infos`,
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
     * @tags Contact-info
     * @name GetContactInfosId
     * @request GET:/contact-infos/{id}
     * @secure
     */
    getContactInfosId: (id: number, params: RequestParams = {}) =>
      this.request<ContactInfoResponse, Error>({
        path: `/contact-infos/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Contact-info
     * @name PutContactInfosId
     * @request PUT:/contact-infos/{id}
     * @secure
     */
    putContactInfosId: (
      id: number,
      data: ContactInfoRequest,
      params: RequestParams = {},
    ) =>
      this.request<ContactInfoResponse, Error>({
        path: `/contact-infos/${id}`,
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
     * @tags Contact-info
     * @name DeleteContactInfosId
     * @request DELETE:/contact-infos/{id}
     * @secure
     */
    deleteContactInfosId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/contact-infos/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  contactSection = {
    /**
     * No description
     *
     * @tags Contact-section
     * @name GetContactSections
     * @request GET:/contact-sections
     * @secure
     */
    getContactSections: (
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
      this.request<ContactSectionListResponse, Error>({
        path: `/contact-sections`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Contact-section
     * @name PostContactSections
     * @request POST:/contact-sections
     * @secure
     */
    postContactSections: (
      data: ContactSectionRequest,
      params: RequestParams = {},
    ) =>
      this.request<ContactSectionResponse, Error>({
        path: `/contact-sections`,
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
     * @tags Contact-section
     * @name GetContactSectionsId
     * @request GET:/contact-sections/{id}
     * @secure
     */
    getContactSectionsId: (id: number, params: RequestParams = {}) =>
      this.request<ContactSectionResponse, Error>({
        path: `/contact-sections/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Contact-section
     * @name PutContactSectionsId
     * @request PUT:/contact-sections/{id}
     * @secure
     */
    putContactSectionsId: (
      id: number,
      data: ContactSectionRequest,
      params: RequestParams = {},
    ) =>
      this.request<ContactSectionResponse, Error>({
        path: `/contact-sections/${id}`,
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
     * @tags Contact-section
     * @name DeleteContactSectionsId
     * @request DELETE:/contact-sections/{id}
     * @secure
     */
    deleteContactSectionsId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/contact-sections/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  cta = {
    /**
     * No description
     *
     * @tags Cta
     * @name GetCtas
     * @request GET:/ctas
     * @secure
     */
    getCtas: (
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
      this.request<CtaListResponse, Error>({
        path: `/ctas`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Cta
     * @name PostCtas
     * @request POST:/ctas
     * @secure
     */
    postCtas: (data: CtaRequest, params: RequestParams = {}) =>
      this.request<CtaResponse, Error>({
        path: `/ctas`,
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
     * @tags Cta
     * @name GetCtasId
     * @request GET:/ctas/{id}
     * @secure
     */
    getCtasId: (id: number, params: RequestParams = {}) =>
      this.request<CtaResponse, Error>({
        path: `/ctas/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Cta
     * @name PutCtasId
     * @request PUT:/ctas/{id}
     * @secure
     */
    putCtasId: (id: number, data: CtaRequest, params: RequestParams = {}) =>
      this.request<CtaResponse, Error>({
        path: `/ctas/${id}`,
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
     * @tags Cta
     * @name DeleteCtasId
     * @request DELETE:/ctas/{id}
     * @secure
     */
    deleteCtasId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/ctas/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  featureSection = {
    /**
     * No description
     *
     * @tags Feature-section
     * @name GetFeatureSections
     * @request GET:/feature-sections
     * @secure
     */
    getFeatureSections: (
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
      this.request<FeatureSectionListResponse, Error>({
        path: `/feature-sections`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Feature-section
     * @name PostFeatureSections
     * @request POST:/feature-sections
     * @secure
     */
    postFeatureSections: (
      data: FeatureSectionRequest,
      params: RequestParams = {},
    ) =>
      this.request<FeatureSectionResponse, Error>({
        path: `/feature-sections`,
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
     * @tags Feature-section
     * @name GetFeatureSectionsId
     * @request GET:/feature-sections/{id}
     * @secure
     */
    getFeatureSectionsId: (id: number, params: RequestParams = {}) =>
      this.request<FeatureSectionResponse, Error>({
        path: `/feature-sections/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Feature-section
     * @name PutFeatureSectionsId
     * @request PUT:/feature-sections/{id}
     * @secure
     */
    putFeatureSectionsId: (
      id: number,
      data: FeatureSectionRequest,
      params: RequestParams = {},
    ) =>
      this.request<FeatureSectionResponse, Error>({
        path: `/feature-sections/${id}`,
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
     * @tags Feature-section
     * @name DeleteFeatureSectionsId
     * @request DELETE:/feature-sections/{id}
     * @secure
     */
    deleteFeatureSectionsId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/feature-sections/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  featureTab = {
    /**
     * No description
     *
     * @tags Feature-tab
     * @name GetFeatureTabs
     * @request GET:/feature-tabs
     * @secure
     */
    getFeatureTabs: (
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
      this.request<FeatureTabListResponse, Error>({
        path: `/feature-tabs`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Feature-tab
     * @name PostFeatureTabs
     * @request POST:/feature-tabs
     * @secure
     */
    postFeatureTabs: (data: FeatureTabRequest, params: RequestParams = {}) =>
      this.request<FeatureTabResponse, Error>({
        path: `/feature-tabs`,
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
     * @tags Feature-tab
     * @name GetFeatureTabsId
     * @request GET:/feature-tabs/{id}
     * @secure
     */
    getFeatureTabsId: (id: number, params: RequestParams = {}) =>
      this.request<FeatureTabResponse, Error>({
        path: `/feature-tabs/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Feature-tab
     * @name PutFeatureTabsId
     * @request PUT:/feature-tabs/{id}
     * @secure
     */
    putFeatureTabsId: (
      id: number,
      data: FeatureTabRequest,
      params: RequestParams = {},
    ) =>
      this.request<FeatureTabResponse, Error>({
        path: `/feature-tabs/${id}`,
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
     * @tags Feature-tab
     * @name DeleteFeatureTabsId
     * @request DELETE:/feature-tabs/{id}
     * @secure
     */
    deleteFeatureTabsId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/feature-tabs/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  footer = {
    /**
     * No description
     *
     * @tags Footer
     * @name GetFooter
     * @request GET:/footer
     * @secure
     */
    getFooter: (
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
      this.request<FooterResponse, Error>({
        path: `/footer`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Footer
     * @name PutFooter
     * @request PUT:/footer
     * @secure
     */
    putFooter: (data: FooterRequest, params: RequestParams = {}) =>
      this.request<FooterResponse, Error>({
        path: `/footer`,
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
     * @tags Footer
     * @name DeleteFooter
     * @request DELETE:/footer
     * @secure
     */
    deleteFooter: (params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/footer`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  heroBlock = {
    /**
     * No description
     *
     * @tags Hero-block
     * @name GetHeroBlocks
     * @request GET:/hero-blocks
     * @secure
     */
    getHeroBlocks: (
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
      this.request<HeroBlockListResponse, Error>({
        path: `/hero-blocks`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Hero-block
     * @name PostHeroBlocks
     * @request POST:/hero-blocks
     * @secure
     */
    postHeroBlocks: (data: HeroBlockRequest, params: RequestParams = {}) =>
      this.request<HeroBlockResponse, Error>({
        path: `/hero-blocks`,
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
     * @tags Hero-block
     * @name GetHeroBlocksId
     * @request GET:/hero-blocks/{id}
     * @secure
     */
    getHeroBlocksId: (id: number, params: RequestParams = {}) =>
      this.request<HeroBlockResponse, Error>({
        path: `/hero-blocks/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Hero-block
     * @name PutHeroBlocksId
     * @request PUT:/hero-blocks/{id}
     * @secure
     */
    putHeroBlocksId: (
      id: number,
      data: HeroBlockRequest,
      params: RequestParams = {},
    ) =>
      this.request<HeroBlockResponse, Error>({
        path: `/hero-blocks/${id}`,
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
     * @tags Hero-block
     * @name DeleteHeroBlocksId
     * @request DELETE:/hero-blocks/{id}
     * @secure
     */
    deleteHeroBlocksId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/hero-blocks/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  imageSlider = {
    /**
     * No description
     *
     * @tags Image-slider
     * @name GetImageSliders
     * @request GET:/image-sliders
     * @secure
     */
    getImageSliders: (
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
      this.request<ImageSliderListResponse, Error>({
        path: `/image-sliders`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Image-slider
     * @name PostImageSliders
     * @request POST:/image-sliders
     * @secure
     */
    postImageSliders: (data: ImageSliderRequest, params: RequestParams = {}) =>
      this.request<ImageSliderResponse, Error>({
        path: `/image-sliders`,
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
     * @tags Image-slider
     * @name GetImageSlidersId
     * @request GET:/image-sliders/{id}
     * @secure
     */
    getImageSlidersId: (id: number, params: RequestParams = {}) =>
      this.request<ImageSliderResponse, Error>({
        path: `/image-sliders/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Image-slider
     * @name PutImageSlidersId
     * @request PUT:/image-sliders/{id}
     * @secure
     */
    putImageSlidersId: (
      id: number,
      data: ImageSliderRequest,
      params: RequestParams = {},
    ) =>
      this.request<ImageSliderResponse, Error>({
        path: `/image-sliders/${id}`,
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
     * @tags Image-slider
     * @name DeleteImageSlidersId
     * @request DELETE:/image-sliders/{id}
     * @secure
     */
    deleteImageSlidersId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/image-sliders/${id}`,
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
  stepsContainer = {
    /**
     * No description
     *
     * @tags Steps-container
     * @name GetStepsContainers
     * @request GET:/steps-containers
     * @secure
     */
    getStepsContainers: (
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
      this.request<StepsContainerListResponse, Error>({
        path: `/steps-containers`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Steps-container
     * @name PostStepsContainers
     * @request POST:/steps-containers
     * @secure
     */
    postStepsContainers: (
      data: StepsContainerRequest,
      params: RequestParams = {},
    ) =>
      this.request<StepsContainerResponse, Error>({
        path: `/steps-containers`,
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
     * @tags Steps-container
     * @name GetStepsContainersId
     * @request GET:/steps-containers/{id}
     * @secure
     */
    getStepsContainersId: (id: number, params: RequestParams = {}) =>
      this.request<StepsContainerResponse, Error>({
        path: `/steps-containers/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Steps-container
     * @name PutStepsContainersId
     * @request PUT:/steps-containers/{id}
     * @secure
     */
    putStepsContainersId: (
      id: number,
      data: StepsContainerRequest,
      params: RequestParams = {},
    ) =>
      this.request<StepsContainerResponse, Error>({
        path: `/steps-containers/${id}`,
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
     * @tags Steps-container
     * @name DeleteStepsContainersId
     * @request DELETE:/steps-containers/{id}
     * @secure
     */
    deleteStepsContainersId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/steps-containers/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  template = {
    /**
     * No description
     *
     * @tags Template
     * @name GetTemplates
     * @request GET:/templates
     * @secure
     */
    getTemplates: (
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
      this.request<TemplateListResponse, Error>({
        path: `/templates`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Template
     * @name PostTemplates
     * @request POST:/templates
     * @secure
     */
    postTemplates: (data: TemplateRequest, params: RequestParams = {}) =>
      this.request<TemplateResponse, Error>({
        path: `/templates`,
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
     * @tags Template
     * @name GetTemplatesId
     * @request GET:/templates/{id}
     * @secure
     */
    getTemplatesId: (id: number, params: RequestParams = {}) =>
      this.request<TemplateResponse, Error>({
        path: `/templates/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Template
     * @name PutTemplatesId
     * @request PUT:/templates/{id}
     * @secure
     */
    putTemplatesId: (
      id: number,
      data: TemplateRequest,
      params: RequestParams = {},
    ) =>
      this.request<TemplateResponse, Error>({
        path: `/templates/${id}`,
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
     * @tags Template
     * @name DeleteTemplatesId
     * @request DELETE:/templates/{id}
     * @secure
     */
    deleteTemplatesId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/templates/${id}`,
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
