import type { Schema, Struct } from '@strapi/strapi';

export interface LayoutFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_footers';
  info: {
    displayName: 'Footer';
  };
  attributes: {
    RegularText: Schema.Attribute.String;
    Sections: Schema.Attribute.Component<'shared.section', true>;
    SocialMediaLinks: Schema.Attribute.Component<
      'shared.image-navigation-item',
      true
    >;
  };
}

export interface LayoutHeader extends Struct.ComponentSchema {
  collectionName: 'components_layout_headers';
  info: {
    displayName: 'Header';
  };
  attributes: {
    Heading: Schema.Attribute.String;
    Logo: Schema.Attribute.Media<'images'>;
    SecondaryText: Schema.Attribute.Text;
  };
}

export interface SharedImageNavigationItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_image_navigation_items';
  info: {
    displayName: 'Image Navigation Item';
  };
  attributes: {
    HREF: Schema.Attribute.String;
    Image: Schema.Attribute.Media<'images'>;
    isButton: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Label: Schema.Attribute.String;
    Type: Schema.Attribute.Enumeration<['Primary', 'Secondary']>;
  };
}

export interface SharedNavigationItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_navigation_items';
  info: {
    displayName: 'Navigation Item';
  };
  attributes: {
    HREF: Schema.Attribute.String;
    isButton: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    Label: Schema.Attribute.String;
    Type: Schema.Attribute.Enumeration<['Primary', 'Secondary']>;
  };
}

export interface SharedSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_sections';
  info: {
    displayName: 'Section';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Links: Schema.Attribute.Component<'shared.navigation-item', true>;
    Title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'layout.footer': LayoutFooter;
      'layout.header': LayoutHeader;
      'shared.image-navigation-item': SharedImageNavigationItem;
      'shared.navigation-item': SharedNavigationItem;
      'shared.section': SharedSection;
    }
  }
}
