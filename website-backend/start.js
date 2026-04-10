// cPanel Node.js Selector startup file.
// The Application startup file field only accepts a .js path — no CLI args.
// This wrapper patches lodash for Node 22 ESM compatibility, then starts
// Strapi via dynamic import (so the patch runs before any Strapi module loads).

import { createRequire } from 'module';
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const _require = createRequire(import.meta.url);

// Patch lodash synchronously before any Strapi ESM module resolves lodash/fp.
// Without this, Node 22 ESM throws:
//   SyntaxError: 'lodash/fp' does not provide an export named 'get'
const patchScript = resolve(__dirname, 'scripts/patch-lodash.cjs');
if (existsSync(patchScript)) {
  try {
    _require(patchScript);
  } catch (e) {
    console.warn('[start] lodash patch failed:', e.message);
  }
} else {
  console.warn('[start] patch-lodash.cjs not found, skipping');
}

// Dynamic import ensures Strapi (and therefore lodash/fp) is resolved AFTER
// the patch above has written fp.mjs and updated lodash's package.json.
const { createStrapi, compileStrapi } = await import('@strapi/strapi');

const appContext = await compileStrapi();
const app = await createStrapi(appContext).load();
await app.start();
