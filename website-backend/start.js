// cPanel / LiteSpeed startup file.
// lsnode loads this via require() — so it MUST be pure CJS:
// no top-level import statements, no top-level await.
'use strict';

const { existsSync } = require('fs');
const { resolve } = require('path');

// Patch lodash for Node 22 ESM compatibility before Strapi loads.
const patchScript = resolve(__dirname, 'scripts/patch-lodash.cjs');
if (existsSync(patchScript)) {
  try {
    require(patchScript);
  } catch (e) {
    console.warn('[start] lodash patch failed:', e.message);
  }
} else {
  console.warn('[start] patch-lodash.cjs not found, skipping');
}

// Dynamic import() inside an async IIFE — the only way to load ESM
// (Strapi uses ESM) from a CJS entry point.
(async () => {
  const { createStrapi, compileStrapi } = await import('@strapi/strapi');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  await app.start();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
