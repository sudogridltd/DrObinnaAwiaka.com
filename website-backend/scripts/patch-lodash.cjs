// Patches lodash so `import { get } from 'lodash/fp'` works in Node 22 ESM.
//
// Problem: lodash has no "exports" field, so Node 22 ESM resolution for
// `lodash/fp` falls through to the `fp/` directory, which throws
// ERR_UNSUPPORTED_DIR_IMPORT. Even with an exports map pointing to fp.js,
// `import { get }` fails because fp.js uses dynamic module.exports so
// cjs-module-lexer can't detect named exports statically.
//
// Fix: generate fp.mjs that explicitly re-exports every key from fp.js,
// then add an exports field pointing `./fp` to it.
'use strict';

const fs = require('fs');
const path = require('path');

const lodashDir = path.resolve(__dirname, '../node_modules/lodash');
const pkgPath = path.join(lodashDir, 'package.json');

if (!fs.existsSync(pkgPath)) {
  console.warn('patch-lodash: lodash not found, skipping');
  process.exit(0);
}

// Load the fp build via CJS to discover all exported function names.
const fp = require(path.join(lodashDir, 'fp.js'));
const names = Object.keys(fp).filter(k => /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k));

// Generate a proper ESM wrapper that re-exports each function as a named export.
const mjs = [
  "import { createRequire } from 'module';",
  "const _require = createRequire(import.meta.url);",
  "const _fp = _require('./fp.js');",
  "export default _fp;",
  ...names.map(n => `export const ${n} = _fp[${JSON.stringify(n)}];`),
].join('\n') + '\n';

fs.writeFileSync(path.join(lodashDir, 'fp.mjs'), mjs);

// Update package.json to add an exports field.
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.exports = {
  '.': { require: './lodash.js', import: './lodash.js' },
  './fp': { import: './fp.mjs', require: './fp/index.js' },
  './*.js': { require: './*.js', default: './*.js' },
  './*': { require: './*.js', default: './*.js' },
};
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

console.log(`patch-lodash: generated fp.mjs with ${names.length} named exports`);
