import express from 'express'
import compression from 'compression'
import { renderPage } from 'vike/server'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Default to production unless explicitly in development mode.
// On cPanel, NODE_ENV may not be set at all — we never want to start
// the Vite dev server (which tries to use HMR WebSockets) on the server.
const isProduction = process.env.NODE_ENV !== 'development'
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

async function startServer() {
  const app = express()
  app.use(compression())

  if (isProduction) {
    const clientDist = path.join(__dirname, 'dist/client')
    app.use(express.static(clientDist, { index: false }))
  } else {
    // In dev, Vite middleware handles static files and HMR
    const { createServer } = await import('vite')
    const vite = await createServer({ server: { middlewareMode: true } })
    app.use(vite.middlewares)
  }

  // Inject runtime env vars into every HTML response as window.__ENV__.
  // This lets strapi.ts read STRAPI_URL/STRAPI_API_TOKEN at runtime on the
  // client, avoiding the need to bake them in at Vite build time.
  const envScript = `<script>window.__ENV__=${JSON.stringify({
    STRAPI_URL: process.env.VITE_STRAPI_URL || process.env.STRAPI_URL || '',
    STRAPI_API_TOKEN: process.env.VITE_STRAPI_API_TOKEN || process.env.STRAPI_API_TOKEN || '',
  })}</script>`

  app.get(/(.*)/, async (req, res, next) => {
    try {
      const pageContext = await renderPage({ urlOriginal: req.originalUrl })
      const { httpResponse } = pageContext
      if (!httpResponse) return next()
      const { body, statusCode, headers } = httpResponse
      headers.forEach(([name, value]) => res.setHeader(name, value))
      // Inject env script into HTML responses only
      const finalBody = headers.some(([k, v]) => k === 'content-type' && String(v).includes('text/html'))
        ? body.replace('</head>', `${envScript}</head>`)
        : body
      res.status(statusCode).send(finalBody)
    } catch (err) {
      console.error(err)
      next(err)
    }
  })

  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`)
  })
}

startServer()
