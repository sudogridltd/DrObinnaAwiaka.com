// cPanel / LiteSpeed startup file.
// lsnode loads this via require() — so it MUST be pure CJS:
// no top-level import statements, no top-level await.
'use strict';

const { existsSync } = require('fs');
const { resolve } = require('path');

// Patch all CJS packages that Strapi's .mjs files import named exports from.
// Node 22 ESM can't detect named exports from dynamic module.exports patterns,
// so we generate .mjs wrappers with explicit named exports before Strapi loads.
const patchScript = resolve(__dirname, 'scripts/patch-cjs-esm.cjs');
if (existsSync(patchScript)) {
  try {
    require(patchScript);
  } catch (e) {
    console.warn('[start] CJS/ESM patch failed:', e.message);
  }
} else {
  console.warn('[start] patch-cjs-esm.cjs not found, skipping');
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
