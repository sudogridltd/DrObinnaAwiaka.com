import express from 'express'
import compression from 'compression'
import { renderPage } from 'vike/server'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Default to production unless explicitly in development mode.
const isProduction = process.env.NODE_ENV !== 'development'
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

// ── Logger ────────────────────────────────────────────────────────────────────
// Derive log path from __dirname: /home/USER/DOMAIN/nodeapp → /home/USER/etc/logs/DOMAIN.log
const dirParts = __dirname.split('/')
const logUser   = dirParts[2] || ''
const logDomain = dirParts[3] || 'frontend'
const logDir    = logUser ? `/home/${logUser}/etc/logs` : path.join(__dirname, 'logs')
const logFile   = path.join(logDir, `${logDomain}.log`)

let logStream: fs.WriteStream | null = null
if (isProduction) {
  try {
    fs.mkdirSync(logDir, { recursive: true })
    logStream = fs.createWriteStream(logFile, { flags: 'a' })
  } catch (e) {
    console.error('[logger] Could not open log file:', e)
  }
}

function log(level: 'INFO' | 'WARN' | 'ERROR', ...args: unknown[]) {
  const ts = new Date().toISOString()
  const line = `[${ts}] [${level}] ${args.map(a =>
    a instanceof Error ? `${a.message}\n${a.stack}` : String(a)
  ).join(' ')}\n`
  process.stdout.write(line)
  logStream?.write(line)
}

// Intercept console so all Vike/Express output goes to the log file too
const _log   = console.log.bind(console)
const _warn  = console.warn.bind(console)
const _error = console.error.bind(console)
console.log   = (...a) => { logStream?.write(`[${new Date().toISOString()}] [INFO]  ${a.join(' ')}\n`); _log(...a) }
console.warn  = (...a) => { logStream?.write(`[${new Date().toISOString()}] [WARN]  ${a.join(' ')}\n`); _warn(...a) }
console.error = (...a) => { logStream?.write(`[${new Date().toISOString()}] [ERROR] ${a.join(' ')}\n`); _error(...a) }

process.on('uncaughtException',  err => log('ERROR', 'Uncaught exception:', err))
process.on('unhandledRejection', err => log('ERROR', 'Unhandled rejection:', err))

log('INFO', `Starting frontend — logFile=${logFile} isProduction=${isProduction} port=${port}`)
// ─────────────────────────────────────────────────────────────────────────────

async function startServer() {
  const app = express()
  app.use(compression())

  if (isProduction) {
    const clientDist = path.join(__dirname, 'dist/client')
    app.use(express.static(clientDist, { index: false }))
  } else {
    const { createServer } = await import('vite')
    const vite = await createServer({ server: { middlewareMode: true } })
    app.use(vite.middlewares)
  }

  // Inject runtime env vars into every HTML response as window.__ENV__.
  const envScript = `<script>window.__ENV__=${JSON.stringify({
    STRAPI_URL: process.env.VITE_STRAPI_URL || process.env.STRAPI_URL || '',
    STRAPI_API_TOKEN: process.env.VITE_STRAPI_API_TOKEN || process.env.STRAPI_API_TOKEN || '',
  })}</script>`

  app.get(/(.*)/, async (req, res, next) => {
    const start = Date.now()
    try {
      const pageContext = await renderPage({ urlOriginal: req.originalUrl })
      const { httpResponse } = pageContext
      if (!httpResponse) return next()
      const { body, statusCode, headers } = httpResponse
      headers.forEach(([name, value]) => res.setHeader(name, value))
      const isHtml = headers.some(([k, v]) => k === 'content-type' && String(v).includes('text/html'))
      const finalBody = isHtml ? body.replace('</head>', `${envScript}</head>`) : body
      res.status(statusCode).send(finalBody)
      const ms = Date.now() - start
      if (statusCode >= 500) {
        log('ERROR', `${statusCode} ${req.method} ${req.originalUrl} (${ms}ms)`)
      } else if (statusCode >= 400) {
        log('WARN', `${statusCode} ${req.method} ${req.originalUrl} (${ms}ms)`)
      } else {
        log('INFO', `${statusCode} ${req.method} ${req.originalUrl} (${ms}ms)`)
      }
    } catch (err) {
      const ms = Date.now() - start
      log('ERROR', `500 ${req.method} ${req.originalUrl} (${ms}ms)`, err)
      next(err)
    }
  })

  app.listen(port, () => {
    log('INFO', `Server ready at http://localhost:${port}`)
  })
}

startServer()
