// cPanel / LiteSpeed startup file.
// lsnode loads this via require() — so it MUST be pure CJS:
// no top-level import statements, no top-level await.
'use strict';

const fs      = require('fs');
const path    = require('path');
const { existsSync, mkdirSync, createWriteStream } = fs;
const { resolve } = path;

// ── Logger ────────────────────────────────────────────────────────────────────
// Derive log path from __dirname: /home/USER/DOMAIN/nodeapp → /home/USER/etc/logs/DOMAIN.log
const dirParts = __dirname.split('/');
const logUser   = dirParts[2] || '';
const logDomain = dirParts[3] || 'backend';
const logDir    = logUser ? `/home/${logUser}/etc/logs` : resolve(__dirname, 'logs');
const logFile   = path.join(logDir, `${logDomain}.log`);

let logStream = null;
try {
  mkdirSync(logDir, { recursive: true });
  logStream = createWriteStream(logFile, { flags: 'a' });
} catch (e) {
  process.stderr.write(`[logger] Could not open log file ${logFile}: ${e.message}\n`);
}

function log(level, ...args) {
  const ts   = new Date().toISOString();
  const msg  = args.map(a => a instanceof Error ? `${a.message}\n${a.stack}` : String(a)).join(' ');
  const line = `[${ts}] [${level}] ${msg}\n`;
  process.stdout.write(line);
  if (logStream) logStream.write(line);
}

// Intercept console so all Strapi output also goes to the log file
const _log   = console.log.bind(console);
const _warn  = console.warn.bind(console);
const _error = console.error.bind(console);
console.log   = (...a) => { if (logStream) logStream.write(`[${new Date().toISOString()}] [INFO]  ${a.join(' ')}\n`); _log(...a); };
console.warn  = (...a) => { if (logStream) logStream.write(`[${new Date().toISOString()}] [WARN]  ${a.join(' ')}\n`); _warn(...a); };
console.error = (...a) => { if (logStream) logStream.write(`[${new Date().toISOString()}] [ERROR] ${a.join(' ')}\n`); _error(...a); };

process.on('uncaughtException',  err => log('ERROR', 'Uncaught exception:', err));
process.on('unhandledRejection', err => log('ERROR', 'Unhandled rejection:', err));

log('INFO', `Starting backend — logFile=${logFile}`);
// ─────────────────────────────────────────────────────────────────────────────

// Patch all CJS packages that Strapi's .mjs files import named exports from.
const patchScript = resolve(__dirname, 'scripts/patch-cjs-esm.cjs');
if (existsSync(patchScript)) {
  try {
    require(patchScript);
    log('INFO', 'CJS/ESM patch applied');
  } catch (e) {
    log('WARN', 'CJS/ESM patch failed:', e.message);
  }
} else {
  log('WARN', 'patch-cjs-esm.cjs not found, skipping');
}

// Dynamic import() inside an async IIFE — the only way to load ESM
// (Strapi uses ESM) from a CJS entry point.
(async () => {
  const { createStrapi, compileStrapi } = await import('@strapi/strapi');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  await app.start();
  log('INFO', 'Strapi started successfully');
})().catch(err => {
  log('ERROR', 'Strapi failed to start:', err);
  process.exit(1);
});
