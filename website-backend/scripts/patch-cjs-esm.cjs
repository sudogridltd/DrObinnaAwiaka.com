// Fixes Node 22 ESM named-export errors for all CJS packages that Strapi
// imports named exports from. Node 22 uses a stricter cjs-module-lexer that
// can't detect named exports from packages that use dynamic module.exports
// patterns (e.g. module.exports = build(), module.exports = require('...')).
//
// Strategy:
//   1. Scan all .mjs files under node_modules/@strapi (and other affected scopes)
//   2. Find every `import { name } from 'bare-pkg'` statement
//   3. For each package that is CJS (no ESM exports), generate a .mjs wrapper
//      that explicitly re-exports every key from the package
//   4. Add/update the package's exports field to point ESM imports to the wrapper
'use strict';

const fs = require('fs');
const path = require('path');

const nodeModules = path.resolve(__dirname, '../node_modules');

// ── helpers ──────────────────────────────────────────────────────────────────

function validIdent(k) {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) && k !== 'default';
}

// Walk a directory tree and collect files matching a predicate.
function walk(dir, match, results = []) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch { return results; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, match, results);
    else if (e.isFile() && match(e.name)) results.push(full);
  }
  return results;
}

// Extract bare-specifier package names that are imported with named exports.
// Matches:
//   import { foo } from 'pkg'
//   import def, { foo } from 'pkg'
//   import def, { foo } from 'pkg/sub'   → captures 'pkg/sub'
function namedImportPackages(src) {
  const re = /\bimport\s+(?:[\w$*]+\s*,\s*)?\{[^}]+\}\s+from\s+['"]([^'"]+)['"]/g;
  const pkgs = new Set();
  let m;
  while ((m = re.exec(src)) !== null) {
    const spec = m[1];
    if (spec.startsWith('.') || spec.startsWith('/')) continue; // skip relative
    pkgs.add(spec);
  }
  return pkgs;
}

// Resolve a bare specifier to the package root directory.
function pkgDir(spec) {
  // spec could be 'pkg' or '@scope/pkg' or 'pkg/sub' (e.g. 'lodash/fp')
  const parts = spec.startsWith('@') ? spec.split('/').slice(0, 2) : [spec.split('/')[0]];
  return path.join(nodeModules, ...parts);
}

// Return the subpath within the package (e.g. 'fp' for 'lodash/fp', '' for 'lodash').
function pkgSubpath(spec) {
  const parts = spec.startsWith('@') ? spec.split('/').slice(2) : spec.split('/').slice(1);
  return parts.join('/');
}

// Check if a package is CJS (no "type":"module", no ESM main export).
function isCjs(dir) {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
    if (pkg.type === 'module') return false;
    return true;
  } catch { return false; }
}

// Generate a .mjs wrapper file that explicitly re-exports all keys.
function generateMjs(requirePath, exports_) {
  const names = Object.keys(exports_).filter(validIdent);
  return [
    `import _mod from ${JSON.stringify(requirePath)};`,
    'export default _mod;',
    ...names.map(n => `export const ${n} = _mod[${JSON.stringify(n)}];`),
  ].join('\n') + '\n';
}

// Safely require a module, returning {} on failure.
function safeRequire(p) {
  try { return require(p); } catch { return {}; }
}

// ── main ─────────────────────────────────────────────────────────────────────

// Scan scopes known to ship .mjs files that import CJS packages.
const scanDirs = ['@strapi', '@strapi/core', '@strapi/utils'].map(s =>
  path.join(nodeModules, s)
).filter(fs.existsSync);
// Also scan the flat node_modules for any .mjs at top level of known-bad pkgs.
scanDirs.push(nodeModules);

const mjsFiles = [];
for (const d of scanDirs) {
  walk(d, n => n.endsWith('.mjs'), mjsFiles);
}

// Collect all CJS packages that need patching.
const toProcess = new Map(); // spec → { dir, subpath }
for (const file of mjsFiles) {
  let src;
  try { src = fs.readFileSync(file, 'utf8'); } catch { continue; }
  for (const spec of namedImportPackages(src)) {
    if (toProcess.has(spec)) continue;
    const dir = pkgDir(spec);
    if (!fs.existsSync(dir)) continue;
    if (!isCjs(dir)) continue;
    toProcess.set(spec, { dir, subpath: pkgSubpath(spec) });
  }
}

if (toProcess.size === 0) {
  console.log('patch-cjs-esm: nothing to patch');
  process.exit(0);
}

// Patch each package.
let patched = 0;
for (const [spec, { dir, subpath }] of toProcess) {
  const pkgJsonPath = path.join(dir, 'package.json');
  let pkg;
  try { pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8')); }
  catch { continue; }

  // Resolve the CJS entry file for this spec.
  let entryRel;
  if (subpath) {
    // e.g. lodash/fp → ./fp.js
    const candidate = path.join(dir, subpath + '.js');
    const candidateDir = path.join(dir, subpath, 'index.js');
    if (fs.existsSync(candidate)) entryRel = './' + subpath + '.js';
    else if (fs.existsSync(candidateDir)) entryRel = './' + subpath + '/index.js';
    else continue;
  } else {
    // Use main field or index.js
    entryRel = './' + (pkg.main || 'index.js').replace(/^\.\//, '');
    if (!fs.existsSync(path.join(dir, entryRel.replace(/^\.\//, '')))) {
      entryRel = './index.js';
    }
  }

  // Load via CJS to get actual exports.
  const absEntry = path.join(dir, entryRel.replace(/^\.\//, ''));
  const exports_ = safeRequire(absEntry);
  if (!exports_ || typeof exports_ !== 'object') continue;

  // Write the .mjs wrapper.
  const mjsName = subpath ? subpath.replace(/\//g, '_') + '.mjs' : 'index.mjs';
  const mjsPath = path.join(dir, mjsName);
  fs.writeFileSync(mjsPath, generateMjs(entryRel, exports_));

  // Update exports field.
  if (!pkg.exports) pkg.exports = {};
  const exportKey = subpath ? './' + subpath : '.';
  const wildcardKey = './*';

  pkg.exports[exportKey] = { import: './' + mjsName, require: entryRel };
  // Add wildcard fallback so other subpath imports (e.g. lodash/isString) still work.
  if (!pkg.exports[wildcardKey]) {
    pkg.exports[wildcardKey] = { require: './*.js', default: './*.js' };
  }
  if (!pkg.exports['./*.js']) {
    pkg.exports['./*.js'] = { require: './*.js', default: './*.js' };
  }
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2));

  const count = Object.keys(exports_).filter(validIdent).length;
  console.log(`  ✓ ${spec} → ${mjsName} (${count} exports)`);
  patched++;
}

console.log(`patch-cjs-esm: patched ${patched} package(s)`);
