import type { Schema, Struct } from '@strapi/strapi';

export interface NavigationNavItem extends Struct.ComponentSchema {
  collectionName: 'components_navigation_nav_items';
  info: {
    description: 'A navigation menu item';
    displayName: 'Nav Item';
    icon: 'bulletList';
  };
  attributes: {
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    description: 'Hero/banner section with title, subtitle and CTAs';
    displayName: 'Hero Section';
    icon: 'landscape';
  };
  attributes: {
    buttons: Schema.Attribute.Component<'shared.cta-button', true>;
    description: Schema.Attribute.Text;
    highlightedText: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedAward extends Struct.ComponentSchema {
  collectionName: 'components_shared_awards';
  info: {
    description: 'An award or recognition received';
    displayName: 'Award';
    icon: 'trophy';
  };
  attributes: {
    issuer: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    year: Schema.Attribute.Integer;
  };
}

export interface SharedBook extends Struct.ComponentSchema {
  collectionName: 'components_shared_books';
  info: {
    description: 'A published book by Dr. Obinna Awiaka';
    displayName: 'Book';
    icon: 'book';
  };
  attributes: {
    coverImage: Schema.Attribute.Media<'images'>;
    description: Schema.Attribute.Text;
    purchaseUrl: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedCtaButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_cta_buttons';
  info: {
    description: 'A call-to-action button';
    displayName: 'CTA Button';
    icon: 'cursor';
  };
  attributes: {
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'outline', 'ghost']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface SharedDisabledDay extends Struct.ComponentSchema {
  collectionName: 'components_shared_disabled_days';
  info: {
    description: 'A day of the week to block from booking';
    displayName: 'Disabled Day';
    icon: 'calendar';
  };
  attributes: {
    day: Schema.Attribute.Enumeration<
      [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ]
    > &
      Schema.Attribute.Required;
  };
}

export interface SharedFaq extends Struct.ComponentSchema {
  collectionName: 'components_shared_faqs';
  info: {
    description: 'A frequently asked question and its answer';
    displayName: 'FAQ';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFeature extends Struct.ComponentSchema {
  collectionName: 'components_shared_features';
  info: {
    description: 'A feature or benefit item with title and description';
    displayName: 'Feature';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMediaFeature extends Struct.ComponentSchema {
  collectionName: 'components_shared_media_features';
  info: {
    description: 'A press or media mention (podcast, article, interview, etc.)';
    displayName: 'Media Feature';
    icon: 'television';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images'>;
    outlet: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String;
  };
}

export interface SharedOrderItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_order_items';
  info: {
    description: 'A snapshot of a product at the time of purchase';
    displayName: 'Order Item';
    icon: 'shoppingCart';
  };
  attributes: {
    lineTotal: Schema.Attribute.Decimal & Schema.Attribute.Required;
    product: Schema.Attribute.Relation<'oneToOne', 'api::product.product'>;
    productSlug: Schema.Attribute.String;
    productTitle: Schema.Attribute.String & Schema.Attribute.Required;
    quantity: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<1>;
    unitPrice: Schema.Attribute.Decimal & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'SEO metadata for pages';
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaRobots: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'index, follow'>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    noIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    openGraphDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    openGraphImage: Schema.Attribute.Media<'images'>;
    openGraphTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    structuredData: Schema.Attribute.JSON;
    twitterCardType: Schema.Attribute.Enumeration<
      ['summary', 'summary_large_image', 'app', 'player']
    > &
      Schema.Attribute.DefaultTo<'summary_large_image'>;
    twitterDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    twitterTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: 'A social media platform link';
    displayName: 'Social Link';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String;
    platform: Schema.Attribute.Enumeration<
      [
        'instagram',
        'facebook',
        'twitter',
        'linkedin',
        'youtube',
        'tiktok',
        'website',
        'podcast',
      ]
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedStat extends Struct.ComponentSchema {
  collectionName: 'components_shared_stats';
  info: {
    description: 'A single statistic with value and label';
    displayName: 'Stat';
    icon: 'chartPie';
  };
  attributes: {
    description: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    suffix: Schema.Attribute.String;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTextItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_text_items';
  info: {
    description: 'A single text entry \u2014 used for features lists, tags, credentials, topics, time slots, etc.';
    displayName: 'Text Item';
    icon: 'quote';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'navigation.nav-item': NavigationNavItem;
      'sections.hero': SectionsHero;
      'shared.award': SharedAward;
      'shared.book': SharedBook;
      'shared.cta-button': SharedCtaButton;
      'shared.disabled-day': SharedDisabledDay;
      'shared.faq': SharedFaq;
      'shared.feature': SharedFeature;
      'shared.media-feature': SharedMediaFeature;
      'shared.order-item': SharedOrderItem;
      'shared.seo': SharedSeo;
      'shared.social-link': SharedSocialLink;
      'shared.stat': SharedStat;
      'shared.text-item': SharedTextItem;
    }
  }
}
