// Patches lodash so named ESM imports work in Node 22.
//
// Problem: lodash uses dynamic module.exports so cjs-module-lexer can't
// detect named exports statically. Both the main package and lodash/fp are
// affected. Strapi imports e.g.:
//   import _, { flatten } from 'lodash'
//   import { get } from 'lodash/fp'
//
// Fix: generate lodash.mjs and fp.mjs that explicitly re-export every key,
// then add an exports field pointing ESM imports to those wrappers.
'use strict';

const fs = require('fs');
const path = require('path');

const lodashDir = path.resolve(__dirname, '../node_modules/lodash');
const pkgPath = path.join(lodashDir, 'package.json');

if (!fs.existsSync(pkgPath)) {
  console.warn('patch-lodash: lodash not found, skipping');
  process.exit(0);
}

function validIdents(obj) {
  return Object.keys(obj).filter(k => /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k));
}

function writeMjs(filename, requirePath, names) {
  const lines = [
    `import _mod from ${JSON.stringify(requirePath)};`,
    'export default _mod;',
    ...names.map(n => `export const ${n} = _mod[${JSON.stringify(n)}];`),
  ];
  fs.writeFileSync(path.join(lodashDir, filename), lines.join('\n') + '\n');
}

// Generate lodash.mjs — covers `import { flatten } from 'lodash'`
const lodash = require(path.join(lodashDir, 'lodash.js'));
const lodashNames = validIdents(lodash);
writeMjs('lodash.mjs', './lodash.js', lodashNames);

// Generate fp.mjs — covers `import { get } from 'lodash/fp'`
const fp = require(path.join(lodashDir, 'fp.js'));
const fpNames = validIdents(fp);
writeMjs('fp.mjs', './fp.js', fpNames);

// Update package.json exports field.
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.exports = {
  '.':      { import: './lodash.mjs', require: './lodash.js' },
  './fp':   { import: './fp.mjs',     require: './fp.js' },
  './*.js': { require: './*.js',      default: './*.js' },
  './*':    { require: './*.js',      default: './*.js' },
};
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

console.log(`patch-lodash: lodash.mjs (${lodashNames.length} exports), fp.mjs (${fpNames.length} exports)`);
