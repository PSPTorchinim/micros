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

export interface Article {
  id?: number;
  documentId?: string;
  Title: string;
  Summary?: string;
  coverUrl?: string;
  Body?: string;
  article_block?: {
    id?: number;
    documentId?: string;
    Title?: string;
    articles?: {
      id?: number;
      documentId?: string;
      Title?: string;
      Summary?: string;
      coverUrl?: string;
      Body?: string;
      article_block?: {
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

export interface ArticleBlock {
  id?: number;
  documentId?: string;
  Title?: string;
  articles?: {
    id?: number;
    documentId?: string;
    Title?: string;
    Summary?: string;
    coverUrl?: string;
    Body?: string;
    article_block?: {
      id?: number;
      documentId?: string;
      Title?: string;
      articles?: {
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

export interface ArticleBlockRefArticleBlockRefComponent {
  id?: number;
  __component?: ArticleBlockRefArticleBlockRefComponentComponentEnum;
  block?: {
    id?: number;
    documentId?: string;
  };
}

export interface ArticleBlockRequest {
  data: {
    Title?: string;
    articles?: (number | string)[];
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface ArticleBlockResponse {
  data?: ArticleBlock;
  meta?: object;
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

export interface ArticleRefArticleRefComponent {
  id?: number;
  __component?: ArticleRefArticleRefComponentComponentEnum;
  article?: {
    id?: number;
    documentId?: string;
  };
}

export interface ArticleRequest {
  data: {
    Title: string;
    Summary?: string;
    coverUrl?: string;
    Body?: string;
    /** @example "string or id" */
    article_block?: number | string;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface ArticleResponse {
  data?: Article;
  meta?: object;
}

export interface ChangePasswordBlock {
  id?: number;
  documentId?: string;
  title?: string;
  description?: string;
  oldPasswordLabel?: string;
  newPasswordLabel?: string;
  confirmPasswordLabel?: string;
  submitButtonText?: string;
  oldPasswordPlaceholder?: string;
  newPasswordPlaceholder?: string;
  confirmPasswordPlaceholder?: string;
  successRedirectPath?: string;
  customStyles?: any;
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
    description?: string;
    oldPasswordLabel?: string;
    newPasswordLabel?: string;
    confirmPasswordLabel?: string;
    submitButtonText?: string;
    oldPasswordPlaceholder?: string;
    newPasswordPlaceholder?: string;
    confirmPasswordPlaceholder?: string;
    successRedirectPath?: string;
    customStyles?: any;
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

export interface ChangePasswordBlockListResponse {
  data?: ChangePasswordBlock[];
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

export interface ChangePasswordBlockRequest {
  data: {
    title?: string;
    description?: string;
    oldPasswordLabel?: string;
    newPasswordLabel?: string;
    confirmPasswordLabel?: string;
    submitButtonText?: string;
    oldPasswordPlaceholder?: string;
    newPasswordPlaceholder?: string;
    confirmPasswordPlaceholder?: string;
    successRedirectPath?: string;
    customStyles?: any;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface ChangePasswordBlockResponse {
  data?: ChangePasswordBlock;
  meta?: object;
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
    AuthState?: ConfigurationAuthStateEnum;
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
      Content?: BaseNull &
        (
          | BaseNullComponentMapping<
              "image-slider-ref.image-slider-ref",
              ImageSliderRefImageSliderRefComponent
            >
          | BaseNullComponentMapping<
              "article-ref.article-ref",
              ArticleRefArticleRefComponent
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

export interface ConfigurationResponse {
  data?: Configuration;
  meta?: object;
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

export interface ContactInfoRefContactInfoRefComponent {
  id?: number;
  __component?: ContactInfoRefContactInfoRefComponentComponentEnum;
  contact_info?: {
    id?: number;
    documentId?: string;
  };
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

export interface ContactInfoResponse {
  data?: ContactInfo;
  meta?: object;
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

export interface ContactSectionRefContactSectionRefComponent {
  id?: number;
  __component?: ContactSectionRefContactSectionRefComponentComponentEnum;
  contact_section?: {
    id?: number;
    documentId?: string;
  };
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

export interface ContactSectionResponse {
  data?: ContactSection;
  meta?: object;
}

export interface Cta {
  id?: number;
  documentId?: string;
  Label: string;
  url: string;
  OpenInNewTab?: boolean;
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
    Label?: string;
    url?: string;
    OpenInNewTab?: boolean;
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

export interface CtaRefCtaRefComponent {
  id?: number;
  __component?: CtaRefCtaRefComponentComponentEnum;
  cta?: {
    id?: number;
    documentId?: string;
  };
}

export interface CtaRequest {
  data: {
    Label: string;
    url: string;
    OpenInNewTab?: boolean;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface CtaResponse {
  data?: Cta;
  meta?: object;
}

export interface Error {
  data?: object | object[] | null;
  error: {
    status?: number;
    name?: string;
    message?: string;
    details?: object;
  };
}

export interface FeatureSection {
  id?: number;
  documentId?: string;
  Title?: string;
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
    Title?: string;
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

export interface FeatureSectionRefFeatureSectionRefComponent {
  id?: number;
  __component?: FeatureSectionRefFeatureSectionRefComponentComponentEnum;
  feature_section?: {
    id?: number;
    documentId?: string;
  };
}

export interface FeatureSectionRequest {
  data: {
    Title?: string;
    reversed?: boolean;
    tabs?: (number | string)[];
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface FeatureSectionResponse {
  data?: FeatureSection;
  meta?: object;
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

export interface FeatureTabRefFeatureTabRefComponent {
  id?: number;
  __component?: FeatureTabRefFeatureTabRefComponentComponentEnum;
  feature_tab?: {
    id?: number;
    documentId?: string;
  };
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

export interface FeatureTabResponse {
  data?: FeatureTab;
  meta?: object;
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
      AuthState?: FooterAuthStateEnum;
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
        Content?: AbstractNull &
          (
            | AbstractNullComponentMapping<
                "image-slider-ref.image-slider-ref",
                ImageSliderRefImageSliderRefComponent
              >
            | AbstractNullComponentMapping<
                "article-ref.article-ref",
                ArticleRefArticleRefComponent
              >
            | AbstractNullComponentMapping<
                "article-block-ref.article-block-ref",
                ArticleBlockRefArticleBlockRefComponent
              >
            | AbstractNullComponentMapping<
                "steps-container-ref.steps-container-ref",
                StepsContainerRefStepsContainerRefComponent
              >
            | AbstractNullComponentMapping<
                "cta-ref.cta-ref",
                CtaRefCtaRefComponent
              >
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

export interface FooterLinkColumnComponent {
  id?: number;
  title?: string;
  links?: FooterLinkComponent[];
}

export interface FooterLinkComponent {
  id?: number;
  label?: string;
  url?: string;
  newTab?: boolean;
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

export interface FooterResponse {
  data?: Footer;
  meta?: object;
}

export interface FooterSocialLinkComponent {
  id?: number;
  platform?: string;
  url?: string;
  icon?: string;
  detail?: string;
}

export interface ForgotPasswordBlock {
  id?: number;
  documentId?: string;
  title?: string;
  description?: string;
  emailLabel?: string;
  submitButtonText?: string;
  backToLoginText?: string;
  loginLinkText?: string;
  emailPlaceholder?: string;
  successRedirectPath?: string;
  loginUrl?: string;
  customStyles?: any;
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
    description?: string;
    emailLabel?: string;
    submitButtonText?: string;
    backToLoginText?: string;
    loginLinkText?: string;
    emailPlaceholder?: string;
    successRedirectPath?: string;
    loginUrl?: string;
    customStyles?: any;
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

export interface ForgotPasswordBlockListResponse {
  data?: ForgotPasswordBlock[];
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

export interface ForgotPasswordBlockRequest {
  data: {
    title?: string;
    description?: string;
    emailLabel?: string;
    submitButtonText?: string;
    backToLoginText?: string;
    loginLinkText?: string;
    emailPlaceholder?: string;
    successRedirectPath?: string;
    loginUrl?: string;
    customStyles?: any;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface ForgotPasswordBlockResponse {
  data?: ForgotPasswordBlock;
  meta?: object;
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
    heading?: string;
    content?: string;
    actions?: {
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

export interface HeroBlockRefHeroBlockRefComponent {
  id?: number;
  __component?: HeroBlockRefHeroBlockRefComponentComponentEnum;
  hero_block?: {
    id?: number;
    documentId?: string;
  };
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

export interface HeroBlockResponse {
  data?: HeroBlock;
  meta?: object;
}

export interface ImageSlider {
  id?: number;
  documentId?: string;
  Title?: string;
  reversed?: boolean;
  AutoPlay?: boolean;
  IntervalMs?: number;
  Slides?: DiscriminatorNull &
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

export interface ImageSliderRefImageSliderRefComponent {
  id?: number;
  __component?: ImageSliderRefImageSliderRefComponentComponentEnum;
  slider?: {
    id?: number;
    documentId?: string;
  };
}

export interface ImageSliderRequest {
  data: {
    Title?: string;
    reversed?: boolean;
    AutoPlay?: boolean;
    IntervalMs?: number;
    Slides?: InternalNull &
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

export interface ImageSliderResponse {
  data?: ImageSlider;
  meta?: object;
}

export interface LoginBlock {
  id?: number;
  documentId?: string;
  title?: string;
  emailLabel?: string;
  passwordLabel?: string;
  submitButtonText?: string;
  forgotPasswordText?: string;
  resetPasswordLinkText?: string;
  emailPlaceholder?: string;
  passwordPlaceholder?: string;
  customStyles?: any;
  redirectPath?: string;
  forgotPasswordUrl?: string;
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
    emailLabel?: string;
    passwordLabel?: string;
    submitButtonText?: string;
    forgotPasswordText?: string;
    resetPasswordLinkText?: string;
    emailPlaceholder?: string;
    passwordPlaceholder?: string;
    customStyles?: any;
    redirectPath?: string;
    forgotPasswordUrl?: string;
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

export interface LoginBlockListResponse {
  data?: LoginBlock[];
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

export interface LoginBlockRequest {
  data: {
    title?: string;
    emailLabel?: string;
    passwordLabel?: string;
    submitButtonText?: string;
    forgotPasswordText?: string;
    resetPasswordLinkText?: string;
    emailPlaceholder?: string;
    passwordPlaceholder?: string;
    customStyles?: any;
    redirectPath?: string;
    forgotPasswordUrl?: string;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface LoginBlockResponse {
  data?: LoginBlock;
  meta?: object;
}

export interface Page {
  id?: number;
  documentId?: string;
  Title?: string;
  Slug?: string;
  subpages?: {
    id?: number;
    documentId?: string;
    Title?: string;
    Slug?: string;
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
    AuthState?: PageAuthStateEnum;
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
      Content?: PolymorphNull &
        (
          | PolymorphNullComponentMapping<
              "image-slider-ref.image-slider-ref",
              ImageSliderRefImageSliderRefComponent
            >
          | PolymorphNullComponentMapping<
              "article-ref.article-ref",
              ArticleRefArticleRefComponent
            >
          | PolymorphNullComponentMapping<
              "article-block-ref.article-block-ref",
              ArticleBlockRefArticleBlockRefComponent
            >
          | PolymorphNullComponentMapping<
              "steps-container-ref.steps-container-ref",
              StepsContainerRefStepsContainerRefComponent
            >
          | PolymorphNullComponentMapping<
              "cta-ref.cta-ref",
              CtaRefCtaRefComponent
            >
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
  AuthState?: PageAuthStateEnum1;
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

export interface PageRequest {
  data: {
    Title?: string;
    Slug?: string;
    subpages?: (number | string)[];
    Parents?: (number | string)[];
    /** @example "string or id" */
    configuration?: number | string;
    Menu?: PageRequestMenuEnum;
    AuthState?: PageRequestAuthStateEnum;
    NavigationOrder?: number;
    NavigationAction?: PageRequestNavigationActionEnum;
    /** @example "string or id" */
    template?: number | string;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface PageResponse {
  data?: Page;
  meta?: object;
}

export interface ProfileBlock {
  id?: number;
  documentId?: string;
  title?: string;
  description?: string;
  emailLabel?: string;
  usernameLabel?: string;
  changePasswordButtonText?: string;
  changePasswordUrl?: string;
  customStyles?: any;
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
    description?: string;
    emailLabel?: string;
    usernameLabel?: string;
    changePasswordButtonText?: string;
    changePasswordUrl?: string;
    customStyles?: any;
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

export interface ProfileBlockListResponse {
  data?: ProfileBlock[];
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

export interface ProfileBlockRequest {
  data: {
    title?: string;
    description?: string;
    emailLabel?: string;
    usernameLabel?: string;
    changePasswordButtonText?: string;
    changePasswordUrl?: string;
    customStyles?: any;
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface ProfileBlockResponse {
  data?: ProfileBlock;
  meta?: object;
}

export interface StepsContainer {
  id?: number;
  documentId?: string;
  heading: string;
  content?: string;
  action?: {
    id?: number;
    documentId?: string;
    Label?: string;
    url?: string;
    OpenInNewTab?: boolean;
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
  steps?: StepsStepComponent[];
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
    heading?: string;
    content?: string;
    action?: {
      id?: number;
      documentId?: string;
    };
    steps?: StepsStepComponent[];
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

export interface StepsContainerRefStepsContainerRefComponent {
  id?: number;
  __component?: StepsContainerRefStepsContainerRefComponentComponentEnum;
  container?: {
    id?: number;
    documentId?: string;
  };
}

export interface StepsContainerRequest {
  data: {
    heading: string;
    content?: string;
    /** @example "string or id" */
    action?: number | string;
    steps?: StepsStepComponent[];
    locale?: string;
    localizations?: (number | string)[];
  };
}

export interface StepsContainerResponse {
  data?: StepsContainer;
  meta?: object;
}

export interface StepsStepComponent {
  id?: number;
  title?: string;
  description?: string;
  icon?: string;
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
    AuthState?: TemplateAuthStateEnum;
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
      Content?: DiscriminatorNull1 &
        (
          | DiscriminatorNull1ComponentMapping<
              "image-slider-ref.image-slider-ref",
              ImageSliderRefImageSliderRefComponent
            >
          | DiscriminatorNull1ComponentMapping<
              "article-ref.article-ref",
              ArticleRefArticleRefComponent
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
  Content?: InternalNull1 &
    (
      | InternalNull1ComponentMapping<
          "image-slider-ref.image-slider-ref",
          ImageSliderRefImageSliderRefComponent
        >
      | InternalNull1ComponentMapping<
          "article-ref.article-ref",
          ArticleRefArticleRefComponent
        >
      | InternalNull1ComponentMapping<
          "article-block-ref.article-block-ref",
          ArticleBlockRefArticleBlockRefComponent
        >
      | InternalNull1ComponentMapping<
          "steps-container-ref.steps-container-ref",
          StepsContainerRefStepsContainerRefComponent
        >
      | InternalNull1ComponentMapping<"cta-ref.cta-ref", CtaRefCtaRefComponent>
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

export interface TemplateRequest {
  data: {
    Name?: string;
    TemplateType?: TemplateRequestTemplateTypeEnum;
    /** @example "string or id" */
    page?: number | string;
    Content?: AbstractNull1 &
      (
        | AbstractNull1ComponentMapping<
            "image-slider-ref.image-slider-ref",
            ImageSliderRefImageSliderRefComponent
          >
        | AbstractNull1ComponentMapping<
            "article-ref.article-ref",
            ArticleRefArticleRefComponent
          >
        | AbstractNull1ComponentMapping<
            "article-block-ref.article-block-ref",
            ArticleBlockRefArticleBlockRefComponent
          >
        | AbstractNull1ComponentMapping<
            "steps-container-ref.steps-container-ref",
            StepsContainerRefStepsContainerRefComponent
          >
        | AbstractNull1ComponentMapping<
            "cta-ref.cta-ref",
            CtaRefCtaRefComponent
          >
        | AbstractNull1ComponentMapping<
            "contact-info-ref.contact-info-ref",
            ContactInfoRefContactInfoRefComponent
          >
        | AbstractNull1ComponentMapping<
            "contact-section-ref.contact-section-ref",
            ContactSectionRefContactSectionRefComponent
          >
        | AbstractNull1ComponentMapping<
            "feature-section-ref.feature-section-ref",
            FeatureSectionRefFeatureSectionRefComponent
          >
        | AbstractNull1ComponentMapping<
            "feature-tab-ref.feature-tab-ref",
            FeatureTabRefFeatureTabRefComponent
          >
        | AbstractNull1ComponentMapping<
            "hero-block-ref.hero-block-ref",
            HeroBlockRefHeroBlockRefComponent
          >
      );
    locale?: string;
    localizations?: (number | string)[];
  };
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

export enum ArticleBlockRefArticleBlockRefComponentComponentEnum {
  ArticleBlockRefArticleBlockRef = "article-block-ref.article-block-ref",
}

export enum ArticleRefArticleRefComponentComponentEnum {
  ArticleRefArticleRef = "article-ref.article-ref",
}

export enum ConfigurationMenuEnum {
  Main = "Main",
  Login = "Login",
  NotVisible = "NotVisible",
}

export enum ConfigurationAuthStateEnum {
  All = "All",
  OnlyAuthenticated = "OnlyAuthenticated",
  OnlyUnauthenticated = "OnlyUnauthenticated",
}

export enum ConfigurationNavigationActionEnum {
  Link = "Link",
  Action = "Action",
}

export enum ConfigurationTemplateTypeEnum {
  Standard = "Standard",
  Login = "Login",
  ForgotPassword = "ForgotPassword",
  ChangePassword = "ChangePassword",
  Profile = "Profile",
}

type BaseNull = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleRefArticleRefComponent
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

export enum ContactInfoRefContactInfoRefComponentComponentEnum {
  ContactInfoRefContactInfoRef = "contact-info-ref.contact-info-ref",
}

export enum ContactSectionRefContactSectionRefComponentComponentEnum {
  ContactSectionRefContactSectionRef = "contact-section-ref.contact-section-ref",
}

export enum CtaRefCtaRefComponentComponentEnum {
  CtaRefCtaRef = "cta-ref.cta-ref",
}

export enum FeatureSectionRefFeatureSectionRefComponentComponentEnum {
  FeatureSectionRefFeatureSectionRef = "feature-section-ref.feature-section-ref",
}

export enum FeatureTabRefFeatureTabRefComponentComponentEnum {
  FeatureTabRefFeatureTabRef = "feature-tab-ref.feature-tab-ref",
}

export enum FooterMenuEnum {
  Main = "Main",
  Login = "Login",
  NotVisible = "NotVisible",
}

export enum FooterAuthStateEnum {
  All = "All",
  OnlyAuthenticated = "OnlyAuthenticated",
  OnlyUnauthenticated = "OnlyUnauthenticated",
}

export enum FooterNavigationActionEnum {
  Link = "Link",
  Action = "Action",
}

export enum FooterTemplateTypeEnum {
  Standard = "Standard",
  Login = "Login",
  ForgotPassword = "ForgotPassword",
  ChangePassword = "ChangePassword",
  Profile = "Profile",
}

type AbstractNull = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleRefArticleRefComponent
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

export enum HeroBlockRefHeroBlockRefComponentComponentEnum {
  HeroBlockRefHeroBlockRef = "hero-block-ref.hero-block-ref",
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

export enum ImageSliderRefImageSliderRefComponentComponentEnum {
  ImageSliderRefImageSliderRef = "image-slider-ref.image-slider-ref",
}

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

export enum PageMenuEnum {
  Main = "Main",
  Login = "Login",
  NotVisible = "NotVisible",
}

export enum PageAuthStateEnum {
  All = "All",
  OnlyAuthenticated = "OnlyAuthenticated",
  OnlyUnauthenticated = "OnlyUnauthenticated",
}

export enum PageNavigationActionEnum {
  Link = "Link",
  Action = "Action",
}

export enum PageTemplateTypeEnum {
  Standard = "Standard",
  Login = "Login",
  ForgotPassword = "ForgotPassword",
  ChangePassword = "ChangePassword",
  Profile = "Profile",
}

type PolymorphNull = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleRefArticleRefComponent
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

export enum PageMenuEnum1 {
  Main = "Main",
  Login = "Login",
  NotVisible = "NotVisible",
}

export enum PageAuthStateEnum1 {
  All = "All",
  OnlyAuthenticated = "OnlyAuthenticated",
  OnlyUnauthenticated = "OnlyUnauthenticated",
}

export enum PageNavigationActionEnum1 {
  Link = "Link",
  Action = "Action",
}

export enum PageRequestMenuEnum {
  Main = "Main",
  Login = "Login",
  NotVisible = "NotVisible",
}

export enum PageRequestAuthStateEnum {
  All = "All",
  OnlyAuthenticated = "OnlyAuthenticated",
  OnlyUnauthenticated = "OnlyUnauthenticated",
}

export enum PageRequestNavigationActionEnum {
  Link = "Link",
  Action = "Action",
}

export enum StepsContainerRefStepsContainerRefComponentComponentEnum {
  StepsContainerRefStepsContainerRef = "steps-container-ref.steps-container-ref",
}

export enum TemplateTemplateTypeEnum {
  Standard = "Standard",
  Login = "Login",
  ForgotPassword = "ForgotPassword",
  ChangePassword = "ChangePassword",
  Profile = "Profile",
}

export enum TemplateMenuEnum {
  Main = "Main",
  Login = "Login",
  NotVisible = "NotVisible",
}

export enum TemplateAuthStateEnum {
  All = "All",
  OnlyAuthenticated = "OnlyAuthenticated",
  OnlyUnauthenticated = "OnlyUnauthenticated",
}

export enum TemplateNavigationActionEnum {
  Link = "Link",
  Action = "Action",
}

export enum TemplateTemplateTypeEnum1 {
  Standard = "Standard",
  Login = "Login",
  ForgotPassword = "ForgotPassword",
  ChangePassword = "ChangePassword",
  Profile = "Profile",
}

type DiscriminatorNull1 = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleRefArticleRefComponent
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

type InternalNull1 = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleRefArticleRefComponent
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

export enum TemplateRequestTemplateTypeEnum {
  Standard = "Standard",
  Login = "Login",
  ForgotPassword = "ForgotPassword",
  ChangePassword = "ChangePassword",
  Profile = "Profile",
}

type AbstractNull1 = (
  | ImageSliderRefImageSliderRefComponent
  | ArticleRefArticleRefComponent
  | ArticleBlockRefArticleBlockRefComponent
  | StepsContainerRefStepsContainerRefComponent
  | CtaRefCtaRefComponent
  | ContactInfoRefContactInfoRefComponent
  | ContactSectionRefContactSectionRefComponent
  | FeatureSectionRefFeatureSectionRefComponent
  | FeatureTabRefFeatureTabRefComponent
  | HeroBlockRefHeroBlockRefComponent
)[];

type AbstractNull1ComponentMapping<Key, Type> = {
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
 * @title Strapi
 * @version Strapi
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
     * @request GET:/strapi/articles
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
        filters?: object;
        /** Locale to apply */
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ArticleListResponse, Error>({
        path: `/strapi/articles`,
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
     * @request POST:/strapi/articles
     * @secure
     */
    postArticles: (data: ArticleRequest, params: RequestParams = {}) =>
      this.request<ArticleResponse, Error>({
        path: `/strapi/articles`,
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
     * @request GET:/strapi/articles/{id}
     * @secure
     */
    getArticlesId: (id: number, params: RequestParams = {}) =>
      this.request<ArticleResponse, Error>({
        path: `/strapi/articles/${id}`,
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
     * @request PUT:/strapi/articles/{id}
     * @secure
     */
    putArticlesId: (
      id: number,
      data: ArticleRequest,
      params: RequestParams = {},
    ) =>
      this.request<ArticleResponse, Error>({
        path: `/strapi/articles/${id}`,
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
     * @request DELETE:/strapi/articles/{id}
     * @secure
     */
    deleteArticlesId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/strapi/articles/${id}`,
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
     * @request GET:/strapi/article-blocks
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
        filters?: object;
        /** Locale to apply */
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ArticleBlockListResponse, Error>({
        path: `/strapi/article-blocks`,
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
     * @request POST:/strapi/article-blocks
     * @secure
     */
    postArticleBlocks: (
      data: ArticleBlockRequest,
      params: RequestParams = {},
    ) =>
      this.request<ArticleBlockResponse, Error>({
        path: `/strapi/article-blocks`,
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
     * @request GET:/strapi/article-blocks/{id}
     * @secure
     */
    getArticleBlocksId: (id: number, params: RequestParams = {}) =>
      this.request<ArticleBlockResponse, Error>({
        path: `/strapi/article-blocks/${id}`,
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
     * @request PUT:/strapi/article-blocks/{id}
     * @secure
     */
    putArticleBlocksId: (
      id: number,
      data: ArticleBlockRequest,
      params: RequestParams = {},
    ) =>
      this.request<ArticleBlockResponse, Error>({
        path: `/strapi/article-blocks/${id}`,
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
     * @request DELETE:/strapi/article-blocks/{id}
     * @secure
     */
    deleteArticleBlocksId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/strapi/article-blocks/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  changePasswordBlock = {
    /**
     * No description
     *
     * @tags Change-password-block
     * @name GetChangePasswordBlock
     * @request GET:/strapi/change-password-block
     * @secure
     */
    getChangePasswordBlock: (
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
        filters?: object;
        /** Locale to apply */
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ChangePasswordBlockResponse, Error>({
        path: `/strapi/change-password-block`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Change-password-block
     * @name PutChangePasswordBlock
     * @request PUT:/strapi/change-password-block
     * @secure
     */
    putChangePasswordBlock: (
      data: ChangePasswordBlockRequest,
      params: RequestParams = {},
    ) =>
      this.request<ChangePasswordBlockResponse, Error>({
        path: `/strapi/change-password-block`,
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
     * @tags Change-password-block
     * @name DeleteChangePasswordBlock
     * @request DELETE:/strapi/change-password-block
     * @secure
     */
    deleteChangePasswordBlock: (params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/strapi/change-password-block`,
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
     * @request GET:/strapi/configurations
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
        filters?: object;
        /** Locale to apply */
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ConfigurationListResponse, Error>({
        path: `/strapi/configurations`,
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
     * @request POST:/strapi/configurations
     * @secure
     */
    postConfigurations: (
      data: ConfigurationRequest,
      params: RequestParams = {},
    ) =>
      this.request<ConfigurationResponse, Error>({
        path: `/strapi/configurations`,
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
     * @request GET:/strapi/configurations/{id}
     * @secure
     */
    getConfigurationsId: (id: number, params: RequestParams = {}) =>
      this.request<ConfigurationResponse, Error>({
        path: `/strapi/configurations/${id}`,
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
     * @request PUT:/strapi/configurations/{id}
     * @secure
     */
    putConfigurationsId: (
      id: number,
      data: ConfigurationRequest,
      params: RequestParams = {},
    ) =>
      this.request<ConfigurationResponse, Error>({
        path: `/strapi/configurations/${id}`,
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
     * @request DELETE:/strapi/configurations/{id}
     * @secure
     */
    deleteConfigurationsId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/strapi/configurations/${id}`,
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
     * @request GET:/strapi/contact-infos
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
        filters?: object;
        /** Locale to apply */
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ContactInfoListResponse, Error>({
        path: `/strapi/contact-infos`,
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
     * @request POST:/strapi/contact-infos
     * @secure
     */
    postContactInfos: (data: ContactInfoRequest, params: RequestParams = {}) =>
      this.request<ContactInfoResponse, Error>({
        path: `/strapi/contact-infos`,
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
     * @request GET:/strapi/contact-infos/{id}
     * @secure
     */
    getContactInfosId: (id: number, params: RequestParams = {}) =>
      this.request<ContactInfoResponse, Error>({
        path: `/strapi/contact-infos/${id}`,
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
     * @request PUT:/strapi/contact-infos/{id}
     * @secure
     */
    putContactInfosId: (
      id: number,
      data: ContactInfoRequest,
      params: RequestParams = {},
    ) =>
      this.request<ContactInfoResponse, Error>({
        path: `/strapi/contact-infos/${id}`,
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
     * @request DELETE:/strapi/contact-infos/{id}
     * @secure
     */
    deleteContactInfosId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/strapi/contact-infos/${id}`,
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
     * @request GET:/strapi/contact-sections
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
        filters?: object;
        /** Locale to apply */
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ContactSectionListResponse, Error>({
        path: `/strapi/contact-sections`,
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
     * @request POST:/strapi/contact-sections
     * @secure
     */
    postContactSections: (
      data: ContactSectionRequest,
      params: RequestParams = {},
    ) =>
      this.request<ContactSectionResponse, Error>({
        path: `/strapi/contact-sections`,
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
     * @request GET:/strapi/contact-sections/{id}
     * @secure
     */
    getContactSectionsId: (id: number, params: RequestParams = {}) =>
      this.request<ContactSectionResponse, Error>({
        path: `/strapi/contact-sections/${id}`,
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
     * @request PUT:/strapi/contact-sections/{id}
     * @secure
     */
    putContactSectionsId: (
      id: number,
      data: ContactSectionRequest,
      params: RequestParams = {},
    ) =>
      this.request<ContactSectionResponse, Error>({
        path: `/strapi/contact-sections/${id}`,
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
     * @request DELETE:/strapi/contact-sections/{id}
     * @secure
     */
    deleteContactSectionsId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/strapi/contact-sections/${id}`,
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
     * @request GET:/strapi/ctas
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
        filters?: object;
        /** Locale to apply */
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CtaListResponse, Error>({
        path: `/strapi/ctas`,
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
     * @request POST:/strapi/ctas
     * @secure
     */
    postCtas: (data: CtaRequest, params: RequestParams = {}) =>
      this.request<CtaResponse, Error>({
        path: `/strapi/ctas`,
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
     * @request GET:/strapi/ctas/{id}
     * @secure
     */
    getCtasId: (id: number, params: RequestParams = {}) =>
      this.request<CtaResponse, Error>({
        path: `/strapi/ctas/${id}`,
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
     * @request PUT:/strapi/ctas/{id}
     * @secure
     */
    putCtasId: (id: number, data: CtaRequest, params: RequestParams = {}) =>
      this.request<CtaResponse, Error>({
        path: `/strapi/ctas/${id}`,
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
     * @request DELETE:/strapi/ctas/{id}
     * @secure
     */
    deleteCtasId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/strapi/ctas/${id}`,
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
     * @request GET:/strapi/feature-sections
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
        filters?: object;
        /** Locale to apply */
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<FeatureSectionListResponse, Error>({
        path: `/strapi/feature-sections`,
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
     * @request POST:/strapi/feature-sections
     * @secure
     */
    postFeatureSections: (
      data: FeatureSectionRequest,
      params: RequestParams = {},
    ) =>
      this.request<FeatureSectionResponse, Error>({
        path: `/strapi/feature-sections`,
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
     * @request GET:/strapi/feature-sections/{id}
     * @secure
     */
    getFeatureSectionsId: (id: number, params: RequestParams = {}) =>
      this.request<FeatureSectionResponse, Error>({
        path: `/strapi/feature-sections/${id}`,
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
     * @request PUT:/strapi/feature-sections/{id}
     * @secure
     */
    putFeatureSectionsId: (
      id: number,
      data: FeatureSectionRequest,
      params: RequestParams = {},
    ) =>
      this.request<FeatureSectionResponse, Error>({
        path: `/strapi/feature-sections/${id}`,
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
     * @request DELETE:/strapi/feature-sections/{id}
     * @secure
     */
    deleteFeatureSectionsId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/strapi/feature-sections/${id}`,
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
     * @request GET:/strapi/feature-tabs
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
        filters?: object;
        /** Locale to apply */
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<FeatureTabListResponse, Error>({
        path: `/strapi/feature-tabs`,
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
     * @request POST:/strapi/feature-tabs
     * @secure
     */
    postFeatureTabs: (data: FeatureTabRequest, params: RequestParams = {}) =>
      this.request<FeatureTabResponse, Error>({
        path: `/strapi/feature-tabs`,
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
     * @request GET:/strapi/feature-tabs/{id}
     * @secure
     */
    getFeatureTabsId: (id: number, params: RequestParams = {}) =>
      this.request<FeatureTabResponse, Error>({
        path: `/strapi/feature-tabs/${id}`,
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
     * @request PUT:/strapi/feature-tabs/{id}
     * @secure
     */
    putFeatureTabsId: (
      id: number,
      data: FeatureTabRequest,
      params: RequestParams = {},
    ) =>
      this.request<FeatureTabResponse, Error>({
        path: `/strapi/feature-tabs/${id}`,
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
     * @request DELETE:/strapi/feature-tabs/{id}
     * @secure
     */
    deleteFeatureTabsId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/strapi/feature-tabs/${id}`,
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
     * @request GET:/strapi/footer
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
        filters?: object;
        /** Locale to apply */
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<FooterResponse, Error>({
        path: `/strapi/footer`,
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
     * @request PUT:/strapi/footer
     * @secure
     */
    putFooter: (data: FooterRequest, params: RequestParams = {}) =>
      this.request<FooterResponse, Error>({
        path: `/strapi/footer`,
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
     * @request DELETE:/strapi/footer
     * @secure
     */
    deleteFooter: (params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/strapi/footer`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  forgotPasswordBlock = {
    /**
     * No description
     *
     * @tags Forgot-password-block
     * @name GetForgotPasswordBlock
     * @request GET:/strapi/forgot-password-block
     * @secure
     */
    getForgotPasswordBlock: (
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
        filters?: object;
        /** Locale to apply */
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ForgotPasswordBlockResponse, Error>({
        path: `/strapi/forgot-password-block`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Forgot-password-block
     * @name PutForgotPasswordBlock
     * @request PUT:/strapi/forgot-password-block
     * @secure
     */
    putForgotPasswordBlock: (
      data: ForgotPasswordBlockRequest,
      params: RequestParams = {},
    ) =>
      this.request<ForgotPasswordBlockResponse, Error>({
        path: `/strapi/forgot-password-block`,
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
     * @tags Forgot-password-block
     * @name DeleteForgotPasswordBlock
     * @request DELETE:/strapi/forgot-password-block
     * @secure
     */
    deleteForgotPasswordBlock: (params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/strapi/forgot-password-block`,
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
     * @request GET:/strapi/hero-blocks
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
        filters?: object;
        /** Locale to apply */
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<HeroBlockListResponse, Error>({
        path: `/strapi/hero-blocks`,
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
     * @request POST:/strapi/hero-blocks
     * @secure
     */
    postHeroBlocks: (data: HeroBlockRequest, params: RequestParams = {}) =>
      this.request<HeroBlockResponse, Error>({
        path: `/strapi/hero-blocks`,
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
     * @request GET:/strapi/hero-blocks/{id}
     * @secure
     */
    getHeroBlocksId: (id: number, params: RequestParams = {}) =>
      this.request<HeroBlockResponse, Error>({
        path: `/strapi/hero-blocks/${id}`,
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
     * @request PUT:/strapi/hero-blocks/{id}
     * @secure
     */
    putHeroBlocksId: (
      id: number,
      data: HeroBlockRequest,
      params: RequestParams = {},
    ) =>
      this.request<HeroBlockResponse, Error>({
        path: `/strapi/hero-blocks/${id}`,
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
     * @request DELETE:/strapi/hero-blocks/{id}
     * @secure
     */
    deleteHeroBlocksId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/strapi/hero-blocks/${id}`,
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
     * @request GET:/strapi/image-sliders
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
        filters?: object;
        /** Locale to apply */
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ImageSliderListResponse, Error>({
        path: `/strapi/image-sliders`,
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
     * @request POST:/strapi/image-sliders
     * @secure
     */
    postImageSliders: (data: ImageSliderRequest, params: RequestParams = {}) =>
      this.request<ImageSliderResponse, Error>({
        path: `/strapi/image-sliders`,
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
     * @request GET:/strapi/image-sliders/{id}
     * @secure
     */
    getImageSlidersId: (id: number, params: RequestParams = {}) =>
      this.request<ImageSliderResponse, Error>({
        path: `/strapi/image-sliders/${id}`,
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
     * @request PUT:/strapi/image-sliders/{id}
     * @secure
     */
    putImageSlidersId: (
      id: number,
      data: ImageSliderRequest,
      params: RequestParams = {},
    ) =>
      this.request<ImageSliderResponse, Error>({
        path: `/strapi/image-sliders/${id}`,
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
     * @request DELETE:/strapi/image-sliders/{id}
     * @secure
     */
    deleteImageSlidersId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/strapi/image-sliders/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  loginBlock = {
    /**
     * No description
     *
     * @tags Login-block
     * @name GetLoginBlock
     * @request GET:/strapi/login-block
     * @secure
     */
    getLoginBlock: (
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
        filters?: object;
        /** Locale to apply */
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<LoginBlockResponse, Error>({
        path: `/strapi/login-block`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Login-block
     * @name PutLoginBlock
     * @request PUT:/strapi/login-block
     * @secure
     */
    putLoginBlock: (data: LoginBlockRequest, params: RequestParams = {}) =>
      this.request<LoginBlockResponse, Error>({
        path: `/strapi/login-block`,
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
     * @tags Login-block
     * @name DeleteLoginBlock
     * @request DELETE:/strapi/login-block
     * @secure
     */
    deleteLoginBlock: (params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/strapi/login-block`,
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
     * @request GET:/strapi/pages
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
        filters?: object;
        /** Locale to apply */
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PageListResponse, Error>({
        path: `/strapi/pages`,
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
     * @request POST:/strapi/pages
     * @secure
     */
    postPages: (data: PageRequest, params: RequestParams = {}) =>
      this.request<PageResponse, Error>({
        path: `/strapi/pages`,
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
     * @request GET:/strapi/pages/{id}
     * @secure
     */
    getPagesId: (id: number, params: RequestParams = {}) =>
      this.request<PageResponse, Error>({
        path: `/strapi/pages/${id}`,
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
     * @request PUT:/strapi/pages/{id}
     * @secure
     */
    putPagesId: (id: number, data: PageRequest, params: RequestParams = {}) =>
      this.request<PageResponse, Error>({
        path: `/strapi/pages/${id}`,
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
     * @request DELETE:/strapi/pages/{id}
     * @secure
     */
    deletePagesId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/strapi/pages/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  profileBlock = {
    /**
     * No description
     *
     * @tags Profile-block
     * @name GetProfileBlock
     * @request GET:/strapi/profile-block
     * @secure
     */
    getProfileBlock: (
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
        filters?: object;
        /** Locale to apply */
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ProfileBlockResponse, Error>({
        path: `/strapi/profile-block`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Profile-block
     * @name PutProfileBlock
     * @request PUT:/strapi/profile-block
     * @secure
     */
    putProfileBlock: (data: ProfileBlockRequest, params: RequestParams = {}) =>
      this.request<ProfileBlockResponse, Error>({
        path: `/strapi/profile-block`,
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
     * @tags Profile-block
     * @name DeleteProfileBlock
     * @request DELETE:/strapi/profile-block
     * @secure
     */
    deleteProfileBlock: (params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/strapi/profile-block`,
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
     * @request GET:/strapi/steps-containers
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
        filters?: object;
        /** Locale to apply */
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<StepsContainerListResponse, Error>({
        path: `/strapi/steps-containers`,
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
     * @request POST:/strapi/steps-containers
     * @secure
     */
    postStepsContainers: (
      data: StepsContainerRequest,
      params: RequestParams = {},
    ) =>
      this.request<StepsContainerResponse, Error>({
        path: `/strapi/steps-containers`,
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
     * @request GET:/strapi/steps-containers/{id}
     * @secure
     */
    getStepsContainersId: (id: number, params: RequestParams = {}) =>
      this.request<StepsContainerResponse, Error>({
        path: `/strapi/steps-containers/${id}`,
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
     * @request PUT:/strapi/steps-containers/{id}
     * @secure
     */
    putStepsContainersId: (
      id: number,
      data: StepsContainerRequest,
      params: RequestParams = {},
    ) =>
      this.request<StepsContainerResponse, Error>({
        path: `/strapi/steps-containers/${id}`,
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
     * @request DELETE:/strapi/steps-containers/{id}
     * @secure
     */
    deleteStepsContainersId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/strapi/steps-containers/${id}`,
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
     * @request GET:/strapi/templates
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
        filters?: object;
        /** Locale to apply */
        locale?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<TemplateListResponse, Error>({
        path: `/strapi/templates`,
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
     * @request POST:/strapi/templates
     * @secure
     */
    postTemplates: (data: TemplateRequest, params: RequestParams = {}) =>
      this.request<TemplateResponse, Error>({
        path: `/strapi/templates`,
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
     * @request GET:/strapi/templates/{id}
     * @secure
     */
    getTemplatesId: (id: number, params: RequestParams = {}) =>
      this.request<TemplateResponse, Error>({
        path: `/strapi/templates/${id}`,
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
     * @request PUT:/strapi/templates/{id}
     * @secure
     */
    putTemplatesId: (
      id: number,
      data: TemplateRequest,
      params: RequestParams = {},
    ) =>
      this.request<TemplateResponse, Error>({
        path: `/strapi/templates/${id}`,
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
     * @request DELETE:/strapi/templates/{id}
     * @secure
     */
    deleteTemplatesId: (id: number, params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/strapi/templates/${id}`,
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
     * @request POST:/strapi/upload
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
        path: `/strapi/upload`,
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
     * @request POST:/strapi/upload?id={id}
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
        path: `/strapi/upload?id=${id}`,
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
     * @name UploadFilesList
     * @request GET:/strapi/upload/files
     * @secure
     */
    uploadFilesList: (params: RequestParams = {}) =>
      this.request<UploadFile[], any>({
        path: `/strapi/upload/files`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Upload - File
     * @name UploadFilesDetail
     * @request GET:/strapi/upload/files/{id}
     * @secure
     */
    uploadFilesDetail: (id: string, params: RequestParams = {}) =>
      this.request<UploadFile, any>({
        path: `/strapi/upload/files/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Upload - File
     * @name UploadFilesDelete
     * @request DELETE:/strapi/upload/files/{id}
     * @secure
     */
    uploadFilesDelete: (id: string, params: RequestParams = {}) =>
      this.request<UploadFile, any>({
        path: `/strapi/upload/files/${id}`,
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
     * @request GET:/strapi/connect/{provider}
     * @secure
     */
    connectDetail: (provider: string, params: RequestParams = {}) =>
      this.request<any, void | Error>({
        path: `/strapi/connect/${provider}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns a jwt token and user info
     *
     * @tags Users-Permissions - Auth
     * @name AuthLocalCreate
     * @summary Local login
     * @request POST:/strapi/auth/local
     * @secure
     */
    authLocalCreate: (
      data: {
        identifier?: string;
        password?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UsersPermissionsUserRegistration, Error>({
        path: `/strapi/auth/local`,
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
     * @name AuthLocalRegisterCreate
     * @summary Register a user
     * @request POST:/strapi/auth/local/register
     * @secure
     */
    authLocalRegisterCreate: (
      data: {
        username?: string;
        email?: string;
        password?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UsersPermissionsUserRegistration, Error>({
        path: `/strapi/auth/local/register`,
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
     * @name AuthCallbackList
     * @summary Default Callback from provider auth
     * @request GET:/strapi/auth/{provider}/callback
     * @secure
     */
    authCallbackList: (provider: string, params: RequestParams = {}) =>
      this.request<UsersPermissionsUserRegistration, Error>({
        path: `/strapi/auth/${provider}/callback`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Auth
     * @name AuthForgotPasswordCreate
     * @summary Send rest password email
     * @request POST:/strapi/auth/forgot-password
     * @secure
     */
    authForgotPasswordCreate: (
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
        path: `/strapi/auth/forgot-password`,
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
     * @name AuthResetPasswordCreate
     * @summary Rest user password
     * @request POST:/strapi/auth/reset-password
     * @secure
     */
    authResetPasswordCreate: (
      data: {
        password?: string;
        passwordConfirmation?: string;
        code?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UsersPermissionsUserRegistration, Error>({
        path: `/strapi/auth/reset-password`,
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
     * @name AuthChangePasswordCreate
     * @summary Update user's own password
     * @request POST:/strapi/auth/change-password
     * @secure
     */
    authChangePasswordCreate: (
      data: {
        password: string;
        currentPassword: string;
        passwordConfirmation: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UsersPermissionsUserRegistration, Error>({
        path: `/strapi/auth/change-password`,
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
     * @name AuthEmailConfirmationList
     * @summary Confirm user email
     * @request GET:/strapi/auth/email-confirmation
     * @secure
     */
    authEmailConfirmationList: (
      query?: {
        /** confirmation token received by email */
        confirmation?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, void | Error>({
        path: `/strapi/auth/email-confirmation`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Auth
     * @name AuthSendEmailConfirmationCreate
     * @summary Send confirmation email
     * @request POST:/strapi/auth/send-email-confirmation
     * @secure
     */
    authSendEmailConfirmationCreate: (
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
        path: `/strapi/auth/send-email-confirmation`,
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
     * @name UsersPermissionsPermissionsList
     * @summary Get default generated permissions
     * @request GET:/strapi/users-permissions/permissions
     * @secure
     */
    usersPermissionsPermissionsList: (params: RequestParams = {}) =>
      this.request<
        {
          permissions?: UsersPermissionsPermissionsTree;
        },
        Error
      >({
        path: `/strapi/users-permissions/permissions`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name UsersPermissionsRolesList
     * @summary List roles
     * @request GET:/strapi/users-permissions/roles
     * @secure
     */
    usersPermissionsRolesList: (params: RequestParams = {}) =>
      this.request<
        {
          roles?: (UsersPermissionsRole & {
            nb_users?: number;
          })[];
        },
        Error
      >({
        path: `/strapi/users-permissions/roles`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name UsersPermissionsRolesCreate
     * @summary Create a role
     * @request POST:/strapi/users-permissions/roles
     * @secure
     */
    usersPermissionsRolesCreate: (data: any, params: RequestParams = {}) =>
      this.request<
        {
          ok?: OkEnum1;
        },
        Error
      >({
        path: `/strapi/users-permissions/roles`,
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
     * @name UsersPermissionsRolesDetail
     * @summary Get a role
     * @request GET:/strapi/users-permissions/roles/{id}
     * @secure
     */
    usersPermissionsRolesDetail: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          role?: UsersPermissionsRole;
        },
        Error
      >({
        path: `/strapi/users-permissions/roles/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name UsersPermissionsRolesUpdate
     * @summary Update a role
     * @request PUT:/strapi/users-permissions/roles/{role}
     * @secure
     */
    usersPermissionsRolesUpdate: (
      role: string,
      data: any,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          ok?: OkEnum2;
        },
        Error
      >({
        path: `/strapi/users-permissions/roles/${role}`,
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
     * @name UsersPermissionsRolesDelete
     * @summary Delete a role
     * @request DELETE:/strapi/users-permissions/roles/{role}
     * @secure
     */
    usersPermissionsRolesDelete: (role: string, params: RequestParams = {}) =>
      this.request<
        {
          ok?: OkEnum3;
        },
        Error
      >({
        path: `/strapi/users-permissions/roles/${role}`,
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
     * @request GET:/strapi/users
     * @secure
     */
    usersList: (params: RequestParams = {}) =>
      this.request<UsersPermissionsUser[], Error>({
        path: `/strapi/users`,
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
     * @request POST:/strapi/users
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
        path: `/strapi/users`,
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
     * @request GET:/strapi/users/{id}
     * @secure
     */
    usersDetail: (id: string, params: RequestParams = {}) =>
      this.request<UsersPermissionsUser, Error>({
        path: `/strapi/users/${id}`,
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
     * @request PUT:/strapi/users/{id}
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
        path: `/strapi/users/${id}`,
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
     * @request DELETE:/strapi/users/{id}
     * @secure
     */
    usersDelete: (id: string, params: RequestParams = {}) =>
      this.request<UsersPermissionsUser, Error>({
        path: `/strapi/users/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name UsersMeList
     * @summary Get authenticated user info
     * @request GET:/strapi/users/me
     * @secure
     */
    usersMeList: (params: RequestParams = {}) =>
      this.request<UsersPermissionsUser, Error>({
        path: `/strapi/users/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users-Permissions - Users & Roles
     * @name UsersCountList
     * @summary Get user count
     * @request GET:/strapi/users/count
     * @secure
     */
    usersCountList: (params: RequestParams = {}) =>
      this.request<number, Error>({
        path: `/strapi/users/count`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}

// Aliased exports for unified API client
export { Api as StrapiApi, ContentType as StrapiContentType, HttpClient as StrapiHttpClient };

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
