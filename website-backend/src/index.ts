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

    // 3. One-time USD to NGN Migration
    if (process.env.RUN_PRICE_CONVERSION === 'true') {
      try {
        console.log('🔄 Starting USD to NGN price conversion...');
        const EXCHANGE_RATE = 1650;
        const THRESHOLD = 5000;
        
        const products = (await strapi.db.query('api::product.product').findMany()) as any[];
        let updatedCount = 0;
        
        for (const product of products) {
          if (product.price && product.price < THRESHOLD) {
            console.log(`Converting ${product.title} price: $${product.price} -> ₦${product.price * EXCHANGE_RATE}`);
            const updateData: any = { price: product.price * EXCHANGE_RATE };
            if (product.originalPrice && product.originalPrice < THRESHOLD) {
              updateData.originalPrice = product.originalPrice * EXCHANGE_RATE;
            }
            await strapi.db.query('api::product.product').update({
              where: { id: product.id },
              data: updateData
            });
            updatedCount++;
          }
        }
        console.log(`✅ Successfully converted ${updatedCount} products to NGN.`);
      } catch (error) {
        console.error('❌ Failed to run price conversion:', error);
      }
    }
  },
};
