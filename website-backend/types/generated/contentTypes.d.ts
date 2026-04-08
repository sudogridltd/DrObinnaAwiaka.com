import type { Schema, Struct } from '@strapi/strapi';

export interface AdminApiToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    encryptedKey: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'read-only'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminPermission extends Struct.CollectionTypeSchema {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    conditions: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<[]>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::permission'> &
      Schema.Attribute.Private;
    properties: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<'manyToOne', 'admin::role'>;
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminRole extends Struct.CollectionTypeSchema {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::role'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<'manyToMany', 'admin::user'>;
  };
}

export interface AdminSession extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_sessions';
  info: {
    description: 'Session Manager storage';
    displayName: 'Session';
    name: 'Session';
    pluralName: 'sessions';
    singularName: 'session';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
    i18n: {
      localized: false;
    };
  };
  attributes: {
    absoluteExpiresAt: Schema.Attribute.DateTime & Schema.Attribute.Private;
    childId: Schema.Attribute.String & Schema.Attribute.Private;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deviceId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    expiresAt: Schema.Attribute.DateTime &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::session'> &
      Schema.Attribute.Private;
    origin: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sessionId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique;
    status: Schema.Attribute.String & Schema.Attribute.Private;
    type: Schema.Attribute.String & Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    userId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferTokenPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::transfer-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminUser extends Struct.CollectionTypeSchema {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    blocked: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    lastname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::user'> &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registrationToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    roles: Schema.Attribute.Relation<'manyToMany', 'admin::role'> &
      Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String;
  };
}

export interface ApiAboutPageAboutPage extends Struct.SingleTypeSchema {
  collectionName: 'about_pages';
  info: {
    description: 'About Dr. Obinna Awiaka page content';
    displayName: 'About Page';
    pluralName: 'about-pages';
    singularName: 'about-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    awards: Schema.Attribute.Component<'shared.award', true>;
    awardsTitle: Schema.Attribute.String;
    bio: Schema.Attribute.Blocks;
    books: Schema.Attribute.Component<'shared.book', true>;
    booksTitle: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    credentials: Schema.Attribute.Component<'shared.text-item', true>;
    credentialsTitle: Schema.Attribute.String;
    ctaButtons: Schema.Attribute.Component<'shared.cta-button', true>;
    ctaDescription: Schema.Attribute.Text;
    ctaTitle: Schema.Attribute.String;
    hero: Schema.Attribute.Component<'sections.hero', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::about-page.about-page'
    > &
      Schema.Attribute.Private;
    mediaFeatures: Schema.Attribute.Component<'shared.media-feature', true>;
    mediaFeaturesTitle: Schema.Attribute.String;
    profilePhoto: Schema.Attribute.Media<'images'>;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    stats: Schema.Attribute.Component<'shared.stat', true>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiBlogCategoryBlogCategory
  extends Struct.CollectionTypeSchema {
  collectionName: 'blog_categories';
  info: {
    description: 'Categories for blog posts';
    displayName: 'Blog Category';
    pluralName: 'blog-categories';
    singularName: 'blog-category';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    blogPosts: Schema.Attribute.Relation<
      'oneToMany',
      'api::blog-post.blog-post'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::blog-category.blog-category'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiBlogPageBlogPage extends Struct.SingleTypeSchema {
  collectionName: 'blog_pages';
  info: {
    description: 'Blog listing page header and intro';
    displayName: 'Blog Page';
    pluralName: 'blog-pages';
    singularName: 'blog-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    hero: Schema.Attribute.Component<'sections.hero', false>;
    introText: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::blog-page.blog-page'
    > &
      Schema.Attribute.Private;
    postsPerPage: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<9>;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiBlogPostBlogPost extends Struct.CollectionTypeSchema {
  collectionName: 'blog_posts';
  info: {
    description: 'Articles and blog posts by Dr. Obinna Awiaka';
    displayName: 'Blog Post';
    pluralName: 'blog-posts';
    singularName: 'blog-post';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    authorBio: Schema.Attribute.Text;
    authorName: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Dr. Obinna Awiaka'>;
    authorPhoto: Schema.Attribute.Media<'images'>;
    category: Schema.Attribute.Relation<
      'manyToOne',
      'api::blog-category.blog-category'
    >;
    content: Schema.Attribute.Blocks & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    excerpt: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    featuredImage: Schema.Attribute.Media<'images'>;
    isFeatured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::blog-post.blog-post'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    readingTimeMinutes: Schema.Attribute.Integer &
      Schema.Attribute.SetPluginOptions<{
        'content-manager': {
          visible: false;
        };
      }>;
    relatedPosts: Schema.Attribute.Relation<
      'manyToMany',
      'api::blog-post.blog-post'
    >;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    tags: Schema.Attribute.Component<'shared.text-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiBookingPageBookingPage extends Struct.SingleTypeSchema {
  collectionName: 'booking_pages';
  info: {
    description: 'Session booking page content and configuration';
    displayName: 'Booking Page';
    pluralName: 'booking-pages';
    singularName: 'booking-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    availableTimeSlots: Schema.Attribute.Component<'shared.text-item', true>;
    confirmationMessage: Schema.Attribute.Text;
    confirmationTitle: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    disabledDays: Schema.Attribute.Component<'shared.disabled-day', true>;
    hero: Schema.Attribute.Component<'sections.hero', false>;
    introText: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::booking-page.booking-page'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiBookingSubmissionBookingSubmission
  extends Struct.CollectionTypeSchema {
  collectionName: 'booking_submissions';
  info: {
    description: 'Session booking form submissions';
    displayName: 'Booking Submission';
    pluralName: 'booking-submissions';
    singularName: 'booking-submission';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    customer: Schema.Attribute.Relation<'manyToOne', 'api::customer.customer'> &
      Schema.Attribute.SetPluginOptions<{
        'content-manager': {
          visible: false;
        };
      }>;
    email: Schema.Attribute.Email & Schema.Attribute.Required;
    goals: Schema.Attribute.Text;
    internalNotes: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::booking-submission.booking-submission'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    notes: Schema.Attribute.Text;
    phone: Schema.Attribute.String;
    preferredDate: Schema.Attribute.Date;
    preferredTime: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    reference: Schema.Attribute.Integer &
      Schema.Attribute.SetPluginOptions<{
        'content-manager': {
          visible: false;
        };
      }>;
    sessionType: Schema.Attribute.String & Schema.Attribute.Required;
    status: Schema.Attribute.Enumeration<
      [
        'pending',
        'payment_pending',
        'confirmed',
        'cancelled',
        'completed',
        'no-show',
      ]
    > &
      Schema.Attribute.DefaultTo<'pending'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiContactPageContactPage extends Struct.SingleTypeSchema {
  collectionName: 'contact_pages';
  info: {
    description: 'Contact page content and office information';
    displayName: 'Contact Page';
    pluralName: 'contact-pages';
    singularName: 'contact-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    formSubtitle: Schema.Attribute.Text;
    formTitle: Schema.Attribute.String;
    hero: Schema.Attribute.Component<'sections.hero', false>;
    inquiryTopics: Schema.Attribute.Component<'shared.text-item', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::contact-page.contact-page'
    > &
      Schema.Attribute.Private;
    mapEmbedUrl: Schema.Attribute.String;
    officeAddress: Schema.Attribute.Text;
    officeEmail: Schema.Attribute.Email;
    officeHours: Schema.Attribute.Text;
    officePhone: Schema.Attribute.String;
    officeTitle: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiContactSubmissionContactSubmission
  extends Struct.CollectionTypeSchema {
  collectionName: 'contact_submissions';
  info: {
    description: 'Contact form submissions';
    displayName: 'Contact Submission';
    pluralName: 'contact-submissions';
    singularName: 'contact-submission';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    customer: Schema.Attribute.Relation<'manyToOne', 'api::customer.customer'> &
      Schema.Attribute.SetPluginOptions<{
        'content-manager': {
          visible: false;
        };
      }>;
    email: Schema.Attribute.Email & Schema.Attribute.Required;
    firstName: Schema.Attribute.String & Schema.Attribute.Required;
    internalNotes: Schema.Attribute.Text;
    lastName: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::contact-submission.contact-submission'
    > &
      Schema.Attribute.Private;
    message: Schema.Attribute.Text & Schema.Attribute.Required;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    reference: Schema.Attribute.Integer &
      Schema.Attribute.SetPluginOptions<{
        'content-manager': {
          visible: false;
        };
      }>;
    status: Schema.Attribute.Enumeration<
      ['new', 'read', 'replied', 'archived']
    > &
      Schema.Attribute.DefaultTo<'new'>;
    topic: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCustomerCustomer extends Struct.CollectionTypeSchema {
  collectionName: 'customers';
  info: {
    description: 'People who have booked, purchased, or enquired';
    displayName: 'Customer';
    pluralName: 'customers';
    singularName: 'customer';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    bookings: Schema.Attribute.Relation<
      'oneToMany',
      'api::booking-submission.booking-submission'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    emailLogs: Schema.Attribute.Relation<
      'manyToMany',
      'api::email-log.email-log'
    >;
    firstName: Schema.Attribute.String;
    isVIP: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    lastName: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::customer.customer'
    > &
      Schema.Attribute.Private;
    notes: Schema.Attribute.Text;
    orders: Schema.Attribute.Relation<'oneToMany', 'api::order.order'>;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    smsLogs: Schema.Attribute.Relation<'manyToMany', 'api::sms-log.sms-log'>;
    tags: Schema.Attribute.Component<'shared.text-item', true>;
    totalSpent: Schema.Attribute.Decimal &
      Schema.Attribute.SetPluginOptions<{
        'content-manager': {
          visible: false;
        };
      }> &
      Schema.Attribute.DefaultTo<0>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiEmailLogEmailLog extends Struct.CollectionTypeSchema {
  collectionName: 'email_logs';
  info: {
    description: 'Log of all sent emails';
    displayName: 'Email Log';
    pluralName: 'email-logs';
    singularName: 'email-log';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    clicks: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deliveredAt: Schema.Attribute.DateTime;
    errorMessage: Schema.Attribute.Text;
    isBulkEmail: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    lastOpenedAt: Schema.Attribute.DateTime &
      Schema.Attribute.SetPluginOptions<{
        'content-manager': {
          visible: false;
        };
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::email-log.email-log'
    > &
      Schema.Attribute.Private;
    metadata: Schema.Attribute.JSON;
    notificationType: Schema.Attribute.Enumeration<
      [
        'new-post',
        'new-service',
        'welcome',
        'booking',
        'order',
        'contact',
        'custom',
      ]
    > &
      Schema.Attribute.Required;
    opens: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    publishedAt: Schema.Attribute.DateTime;
    recipient: Schema.Attribute.String & Schema.Attribute.Required;
    recipientName: Schema.Attribute.String;
    recipients: Schema.Attribute.Relation<
      'manyToMany',
      'api::customer.customer'
    >;
    recipientType: Schema.Attribute.Enumeration<
      ['all-subscribers', 'all-customers', 'individual', 'custom']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'individual'>;
    relatedEntityId: Schema.Attribute.String;
    relatedEntityType: Schema.Attribute.String;
    sentAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['pending', 'sent', 'delivered', 'failed', 'bounced']
    > &
      Schema.Attribute.DefaultTo<'pending'>;
    subject: Schema.Attribute.String & Schema.Attribute.Required;
    subscribers: Schema.Attribute.Relation<
      'manyToMany',
      'api::newsletter-subscriber.newsletter-subscriber'
    >;
    template: Schema.Attribute.Relation<
      'manyToOne',
      'api::email-template.email-template'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiEmailTemplateEmailTemplate
  extends Struct.CollectionTypeSchema {
  collectionName: 'email_templates';
  info: {
    description: 'Email templates for various notifications';
    displayName: 'Email Template';
    pluralName: 'email-templates';
    singularName: 'email-template';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    category: Schema.Attribute.Enumeration<
      ['notification', 'marketing', 'transactional', 'system']
    > &
      Schema.Attribute.DefaultTo<'notification'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    emailLogs: Schema.Attribute.Relation<
      'oneToMany',
      'api::email-log.email-log'
    >;
    fromEmail: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'noreply@example.com'>;
    fromName: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Dr Obinna Awiaka'>;
    htmlBody: Schema.Attribute.RichText & Schema.Attribute.Required;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::email-template.email-template'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    priority: Schema.Attribute.Enumeration<
      ['low', 'normal', 'high', 'urgent']
    > &
      Schema.Attribute.DefaultTo<'normal'>;
    publishedAt: Schema.Attribute.DateTime;
    replyTo: Schema.Attribute.String;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    subject: Schema.Attribute.String & Schema.Attribute.Required;
    templateType: Schema.Attribute.Enumeration<
      [
        'new-post',
        'new-service',
        'welcome',
        'booking-confirmation',
        'order-confirmation',
        'contact-response',
        'custom',
      ]
    > &
      Schema.Attribute.Required;
    textBody: Schema.Attribute.Text;
    thumbnail: Schema.Attribute.Media<'images'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    variables: Schema.Attribute.JSON;
  };
}

export interface ApiGlobalGlobal extends Struct.SingleTypeSchema {
  collectionName: 'globals';
  info: {
    description: 'Site-wide settings: navigation, footer, contact info, SEO defaults';
    displayName: 'Global Settings';
    pluralName: 'globals';
    singularName: 'global';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    address: Schema.Attribute.Text;
    announcementBar: Schema.Attribute.String;
    announcementBarEnabled: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    copyrightText: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    defaultSeo: Schema.Attribute.Component<'shared.seo', false>;
    email: Schema.Attribute.Email;
    facebookPixelId: Schema.Attribute.String;
    favicon: Schema.Attribute.Media<'images'>;
    footerNavigation: Schema.Attribute.Component<'navigation.nav-item', true>;
    footerTagline: Schema.Attribute.Text;
    googleAnalyticsId: Schema.Attribute.String;
    headerNavigation: Schema.Attribute.Component<'navigation.nav-item', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::global.global'
    > &
      Schema.Attribute.Private;
    logo: Schema.Attribute.Media<'images'>;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    siteName: Schema.Attribute.String & Schema.Attribute.Required;
    siteTagline: Schema.Attribute.String;
    socialLinks: Schema.Attribute.Component<'shared.social-link', true>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiHomepageHomepage extends Struct.SingleTypeSchema {
  collectionName: 'homepages';
  info: {
    description: 'Homepage content and sections';
    displayName: 'Homepage';
    pluralName: 'homepages';
    singularName: 'homepage';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    assuranceDescription: Schema.Attribute.Text;
    assuranceFeatures: Schema.Attribute.Component<'shared.feature', true>;
    assuranceImage: Schema.Attribute.Media<'images'>;
    assuranceSubtitle: Schema.Attribute.String;
    assuranceTitle: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    hero: Schema.Attribute.Component<'sections.hero', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::homepage.homepage'
    > &
      Schema.Attribute.Private;
    newsletterButtonText: Schema.Attribute.String;
    newsletterSubtitle: Schema.Attribute.Text;
    newsletterTitle: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    servicesShowcaseSubtitle: Schema.Attribute.Text;
    servicesShowcaseTitle: Schema.Attribute.String;
    stats: Schema.Attribute.Component<'shared.stat', true>;
    testimonialsSubtitle: Schema.Attribute.Text;
    testimonialsTitle: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    whyChooseUsFeatures: Schema.Attribute.Component<'shared.feature', true>;
    whyChooseUsSubtitle: Schema.Attribute.Text;
    whyChooseUsTitle: Schema.Attribute.String;
  };
}

export interface ApiNewsletterSubscriberNewsletterSubscriber
  extends Struct.CollectionTypeSchema {
  collectionName: 'newsletter_subscribers';
  info: {
    description: 'Email newsletter subscribers';
    displayName: 'Newsletter Subscriber';
    pluralName: 'newsletter-subscribers';
    singularName: 'newsletter-subscriber';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    emailLogs: Schema.Attribute.Relation<
      'manyToMany',
      'api::email-log.email-log'
    >;
    firstName: Schema.Attribute.String;
    lastName: Schema.Attribute.String;
    lastNotifiedAt: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::newsletter-subscriber.newsletter-subscriber'
    > &
      Schema.Attribute.Private;
    notificationCount: Schema.Attribute.Integer &
      Schema.Attribute.SetPluginOptions<{
        'content-manager': {
          visible: false;
        };
      }> &
      Schema.Attribute.DefaultTo<0>;
    notificationPreferences: Schema.Attribute.JSON &
      Schema.Attribute.DefaultTo<{
        email: true;
        newPosts: true;
        newServices: true;
        promotions: false;
        sms: false;
        updates: true;
      }>;
    notifications: Schema.Attribute.Relation<
      'oneToMany',
      'api::notification-queue.notification-queue'
    >;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    smsLogs: Schema.Attribute.Relation<'manyToMany', 'api::sms-log.sms-log'>;
    source: Schema.Attribute.Enumeration<
      ['homepage', 'blog', 'shop', 'booking', 'contact', 'popup', 'other']
    > &
      Schema.Attribute.SetPluginOptions<{
        'content-manager': {
          visible: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'homepage'>;
    status: Schema.Attribute.Enumeration<
      ['subscribed', 'unsubscribed', 'bounced']
    > &
      Schema.Attribute.DefaultTo<'subscribed'>;
    unsubscribedAt: Schema.Attribute.DateTime &
      Schema.Attribute.SetPluginOptions<{
        'content-manager': {
          visible: false;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNotificationQueueNotificationQueue
  extends Struct.CollectionTypeSchema {
  collectionName: 'notification_queues';
  info: {
    description: 'Queue for managing notification delivery';
    displayName: 'Notification Queue';
    pluralName: 'notification-queues';
    singularName: 'notification-queue';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    channel: Schema.Attribute.Enumeration<['email', 'sms', 'both']> &
      Schema.Attribute.DefaultTo<'email'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email & Schema.Attribute.Required;
    emailLog: Schema.Attribute.Relation<
      'manyToOne',
      'api::email-log.email-log'
    >;
    emailTemplate: Schema.Attribute.Relation<
      'manyToOne',
      'api::email-template.email-template'
    >;
    errorMessage: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::notification-queue.notification-queue'
    > &
      Schema.Attribute.Private;
    maxRetries: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<3>;
    metadata: Schema.Attribute.JSON;
    notificationType: Schema.Attribute.Enumeration<
      [
        'new-post',
        'new-service',
        'welcome',
        'booking',
        'order',
        'contact',
        'custom',
      ]
    > &
      Schema.Attribute.Required;
    phone: Schema.Attribute.String;
    priority: Schema.Attribute.Enumeration<
      ['low', 'normal', 'high', 'urgent']
    > &
      Schema.Attribute.DefaultTo<'normal'>;
    publishedAt: Schema.Attribute.DateTime;
    relatedEntityId: Schema.Attribute.String;
    relatedEntityType: Schema.Attribute.String;
    retryCount: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    scheduledAt: Schema.Attribute.DateTime;
    sentAt: Schema.Attribute.DateTime;
    smsLog: Schema.Attribute.Relation<'manyToOne', 'api::sms-log.sms-log'>;
    status: Schema.Attribute.Enumeration<
      ['pending', 'processing', 'sent', 'failed', 'cancelled']
    > &
      Schema.Attribute.DefaultTo<'pending'>;
    subscriber: Schema.Attribute.Relation<
      'manyToOne',
      'api::newsletter-subscriber.newsletter-subscriber'
    >;
    templateData: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiOrderOrder extends Struct.CollectionTypeSchema {
  collectionName: 'orders';
  info: {
    description: 'Product purchases and booking deposits';
    displayName: 'Order';
    pluralName: 'orders';
    singularName: 'order';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    bookingSubmission: Schema.Attribute.Relation<
      'oneToOne',
      'api::booking-submission.booking-submission'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    customer: Schema.Attribute.Relation<'manyToOne', 'api::customer.customer'>;
    customerEmail: Schema.Attribute.Email;
    customerName: Schema.Attribute.String;
    customerPhone: Schema.Attribute.String;
    items: Schema.Attribute.Component<'shared.order-item', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::order.order'> &
      Schema.Attribute.Private;
    orderNumber: Schema.Attribute.String &
      Schema.Attribute.Unique &
      Schema.Attribute.SetPluginOptions<{
        'content-manager': {
          visible: false;
        };
      }>;
    paymentType: Schema.Attribute.Enumeration<['product', 'booking-deposit']> &
      Schema.Attribute.DefaultTo<'product'>;
    paystackData: Schema.Attribute.JSON &
      Schema.Attribute.SetPluginOptions<{
        'content-manager': {
          visible: false;
        };
      }>;
    paystackReference: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        'content-manager': {
          visible: false;
        };
      }>;
    publishedAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['pending', 'paid', 'failed', 'refunded', 'cancelled']
    > &
      Schema.Attribute.DefaultTo<'pending'>;
    subtotal: Schema.Attribute.Decimal;
    total: Schema.Attribute.Decimal;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiProductProduct extends Struct.CollectionTypeSchema {
  collectionName: 'products';
  info: {
    description: 'Shop products: courses, ebooks, bundles, and resources';
    displayName: 'Product';
    pluralName: 'products';
    singularName: 'product';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    badge: Schema.Attribute.String;
    category: Schema.Attribute.Enumeration<
      ['course', 'ebook', 'bundle', 'resource']
    > &
      Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Blocks;
    features: Schema.Attribute.Component<'shared.text-item', true>;
    image: Schema.Attribute.Media<'images'>;
    isFeatured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::product.product'
    > &
      Schema.Attribute.Private;
    originalPrice: Schema.Attribute.Decimal;
    price: Schema.Attribute.Decimal & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    purchaseUrl: Schema.Attribute.String;
    rating: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 0;
        },
        number
      >;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    shortDescription: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    studentsCount: Schema.Attribute.Integer;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiServiceService extends Struct.CollectionTypeSchema {
  collectionName: 'services';
  info: {
    description: 'Coaching and consulting services offered by Dr. Obinna Awiaka';
    displayName: 'Service';
    pluralName: 'services';
    singularName: 'service';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    category: Schema.Attribute.Enumeration<
      [
        'life-coaching',
        'executive-coaching',
        'group-coaching',
        'relationship-coaching',
        'speaking',
        'workshop',
        'online-course',
      ]
    > &
      Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    depositAmount: Schema.Attribute.Decimal;
    description: Schema.Attribute.Blocks;
    duration: Schema.Attribute.String;
    features: Schema.Attribute.Component<'shared.text-item', true>;
    icon: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        'content-manager': {
          visible: false;
        };
      }>;
    image: Schema.Attribute.Media<'images'>;
    isFeatured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::service.service'
    > &
      Schema.Attribute.Private;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    price: Schema.Attribute.Decimal;
    priceLabel: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    requiresDeposit: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    sessionType: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        'content-manager': {
          visible: false;
        };
      }>;
    shortDescription: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiServicesPageServicesPage extends Struct.SingleTypeSchema {
  collectionName: 'services_pages';
  info: {
    description: 'Services listing page header and intro content';
    displayName: 'Services Page';
    pluralName: 'services-pages';
    singularName: 'services-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ctaButtons: Schema.Attribute.Component<'shared.cta-button', true>;
    ctaDescription: Schema.Attribute.Text;
    ctaTitle: Schema.Attribute.String;
    faqs: Schema.Attribute.Component<'shared.faq', true>;
    faqTitle: Schema.Attribute.String;
    hero: Schema.Attribute.Component<'sections.hero', false>;
    introText: Schema.Attribute.Text;
    introTitle: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::services-page.services-page'
    > &
      Schema.Attribute.Private;
    processSteps: Schema.Attribute.Component<'shared.feature', true>;
    processTitle: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiShopPageShopPage extends Struct.SingleTypeSchema {
  collectionName: 'shop_pages';
  info: {
    description: 'Shop page header and intro content';
    displayName: 'Shop Page';
    pluralName: 'shop-pages';
    singularName: 'shop-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    guaranteeDescription: Schema.Attribute.Text;
    guaranteeImage: Schema.Attribute.Media<'images'>;
    guaranteeTitle: Schema.Attribute.String;
    hero: Schema.Attribute.Component<'sections.hero', false>;
    introText: Schema.Attribute.Text;
    introTitle: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::shop-page.shop-page'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSmsLogSmsLog extends Struct.CollectionTypeSchema {
  collectionName: 'sms_logs';
  info: {
    description: 'Log of all sent SMS messages (backup for important communications)';
    displayName: 'SMS Log';
    pluralName: 'sms-logs';
    singularName: 'sms-log';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    cost: Schema.Attribute.Decimal;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deliveredAt: Schema.Attribute.DateTime;
    errorMessage: Schema.Attribute.Text;
    isBulkSms: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::sms-log.sms-log'
    > &
      Schema.Attribute.Private;
    message: Schema.Attribute.Text & Schema.Attribute.Required;
    notificationType: Schema.Attribute.Enumeration<
      ['urgent', 'important', 'reminder', 'verification']
    > &
      Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    recipient: Schema.Attribute.String & Schema.Attribute.Required;
    recipientName: Schema.Attribute.String;
    recipients: Schema.Attribute.Relation<
      'manyToMany',
      'api::customer.customer'
    >;
    recipientType: Schema.Attribute.Enumeration<
      ['all-subscribers', 'all-customers', 'individual', 'custom']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'individual'>;
    relatedEntityId: Schema.Attribute.String;
    relatedEntityType: Schema.Attribute.String;
    segments: Schema.Attribute.Integer &
      Schema.Attribute.SetPluginOptions<{
        'content-manager': {
          visible: false;
        };
      }> &
      Schema.Attribute.DefaultTo<1>;
    sentAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['pending', 'sent', 'delivered', 'failed']
    > &
      Schema.Attribute.DefaultTo<'pending'>;
    subscribers: Schema.Attribute.Relation<
      'manyToMany',
      'api::newsletter-subscriber.newsletter-subscriber'
    >;
    twilioSid: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTeamMemberTeamMember extends Struct.CollectionTypeSchema {
  collectionName: 'team_members';
  info: {
    description: 'Team members and staff';
    displayName: 'Team Member';
    pluralName: 'team-members';
    singularName: 'team-member';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bio: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::team-member.team-member'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    photo: Schema.Attribute.Media<'images'>;
    publishedAt: Schema.Attribute.DateTime;
    socialLinks: Schema.Attribute.Component<'shared.social-link', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTestimonialTestimonial extends Struct.CollectionTypeSchema {
  collectionName: 'testimonials';
  info: {
    description: 'Client testimonials and reviews';
    displayName: 'Testimonial';
    pluralName: 'testimonials';
    singularName: 'testimonial';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    avatar: Schema.Attribute.Media<'images'>;
    clientCompany: Schema.Attribute.String;
    clientName: Schema.Attribute.String & Schema.Attribute.Required;
    clientTitle: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    isFeatured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::testimonial.testimonial'
    > &
      Schema.Attribute.Private;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    publishedAt: Schema.Attribute.DateTime;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
    serviceType: Schema.Attribute.Enumeration<
      [
        'life-coaching',
        'executive-coaching',
        'group-coaching',
        'relationship-coaching',
        'speaking',
        'workshop',
        'online-course',
        'general',
      ]
    > &
      Schema.Attribute.DefaultTo<'general'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesRelease
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    releasedAt: Schema.Attribute.DateTime;
    scheduledAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Schema.Attribute.Required;
    timezone: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    entryDocumentId: Schema.Attribute.String;
    isEntryValid: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    release: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Schema.Attribute.Enumeration<['publish', 'unpublish']> &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginI18NLocale extends Struct.CollectionTypeSchema {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String & Schema.Attribute.Unique;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::i18n.locale'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflow
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows';
  info: {
    description: '';
    displayName: 'Workflow';
    name: 'Workflow';
    pluralName: 'workflows';
    singularName: 'workflow';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentTypes: Schema.Attribute.JSON &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'[]'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    stageRequiredToPublish: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::review-workflows.workflow-stage'
    >;
    stages: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflowStage
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows_stages';
  info: {
    description: '';
    displayName: 'Stages';
    name: 'Workflow Stage';
    pluralName: 'workflow-stages';
    singularName: 'workflow-stage';
  };
  options: {
    draftAndPublish: false;
    version: '1.1.0';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#4945FF'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    permissions: Schema.Attribute.Relation<'manyToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    workflow: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::review-workflows.workflow'
    >;
  };
}

export interface PluginUploadFile extends Struct.CollectionTypeSchema {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Schema.Attribute.Text;
    caption: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ext: Schema.Attribute.String;
    focalPoint: Schema.Attribute.JSON;
    folder: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'> &
      Schema.Attribute.Private;
    folderPath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    formats: Schema.Attribute.JSON;
    hash: Schema.Attribute.String & Schema.Attribute.Required;
    height: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.file'
    > &
      Schema.Attribute.Private;
    mime: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    previewUrl: Schema.Attribute.Text;
    provider: Schema.Attribute.String & Schema.Attribute.Required;
    provider_metadata: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    related: Schema.Attribute.Relation<'morphToMany'>;
    size: Schema.Attribute.Decimal & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.Text & Schema.Attribute.Required;
    width: Schema.Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Struct.CollectionTypeSchema {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.folder'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    files: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.file'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.folder'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    parent: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'>;
    path: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    pathId: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.role'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.String & Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    blocked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    confirmationToken: Schema.Attribute.String & Schema.Attribute.Private;
    confirmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    > &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ContentTypeSchemas {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::session': AdminSession;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::about-page.about-page': ApiAboutPageAboutPage;
      'api::blog-category.blog-category': ApiBlogCategoryBlogCategory;
      'api::blog-page.blog-page': ApiBlogPageBlogPage;
      'api::blog-post.blog-post': ApiBlogPostBlogPost;
      'api::booking-page.booking-page': ApiBookingPageBookingPage;
      'api::booking-submission.booking-submission': ApiBookingSubmissionBookingSubmission;
      'api::contact-page.contact-page': ApiContactPageContactPage;
      'api::contact-submission.contact-submission': ApiContactSubmissionContactSubmission;
      'api::customer.customer': ApiCustomerCustomer;
      'api::email-log.email-log': ApiEmailLogEmailLog;
      'api::email-template.email-template': ApiEmailTemplateEmailTemplate;
      'api::global.global': ApiGlobalGlobal;
      'api::homepage.homepage': ApiHomepageHomepage;
      'api::newsletter-subscriber.newsletter-subscriber': ApiNewsletterSubscriberNewsletterSubscriber;
      'api::notification-queue.notification-queue': ApiNotificationQueueNotificationQueue;
      'api::order.order': ApiOrderOrder;
      'api::product.product': ApiProductProduct;
      'api::service.service': ApiServiceService;
      'api::services-page.services-page': ApiServicesPageServicesPage;
      'api::shop-page.shop-page': ApiShopPageShopPage;
      'api::sms-log.sms-log': ApiSmsLogSmsLog;
      'api::team-member.team-member': ApiTeamMemberTeamMember;
      'api::testimonial.testimonial': ApiTestimonialTestimonial;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::review-workflows.workflow': PluginReviewWorkflowsWorkflow;
      'plugin::review-workflows.workflow-stage': PluginReviewWorkflowsWorkflowStage;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
