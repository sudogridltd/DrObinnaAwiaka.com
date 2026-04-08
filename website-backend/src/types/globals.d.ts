import type { Core } from '@strapi/strapi';

declare global {
  // Strapi v5 sets this as a global singleton at runtime
  // eslint-disable-next-line no-var
  var strapi: Core.Strapi;
}

export {};
