// cPanel Node.js Selector startup file.
// The Application startup file field only accepts a .js path — no CLI args.
// This wrapper starts Strapi programmatically.
import { createStrapi, compileStrapi } from '@strapi/strapi';

const appContext = await compileStrapi();
const app = await createStrapi(appContext).load();
await app.start();
