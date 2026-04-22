import type { Core } from '@strapi/strapi';
import runSeed from '../database/seeds/run-seed';
import { setupPermissions } from './utils/permissions';
import { notifySitemapRegenerate } from './utils/notify-sitemap';

// Actions that change what's visible on the public site (and therefore the sitemap).
const SITEMAP_TRIGGER_ACTIONS = new Set([
  'create',
  'update',
  'publish',
  'unpublish',
  'delete',
]);

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    (strapi as any).documents.use(async (ctx: any, next: () => Promise<unknown>) => {
      const result = await next();
      if (SITEMAP_TRIGGER_ACTIONS.has(ctx.action)) {
        // Fire-and-forget — never block the document operation
        notifySitemapRegenerate(`${ctx.uid} ${ctx.action}`).catch(() => {});
      }
      return result;
    });
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // 1. Auto-seed on startup when the database is empty
    try {
      await runSeed(strapi);
    } catch (error) {
      console.error('❌ Bootstrap seeding failed:', error);
    }

    // 2. Ensure public role has correct API permissions
    try {
      await setupPermissions(strapi);
    } catch (error) {
      console.error('❌ Permission setup failed:', error);
    }
  },
};
