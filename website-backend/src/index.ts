import type { Core } from '@strapi/strapi';
import runSeed from '../database/seeds/run-seed';
import { setupPermissions } from './utils/permissions';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

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
