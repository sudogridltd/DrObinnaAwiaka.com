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

  app.get(/(.*)/, async (req, res, next) => {
    try {
      const pageContext = await renderPage({ urlOriginal: req.originalUrl })
      const { httpResponse } = pageContext
      if (!httpResponse) return next()
      const { body, statusCode, headers } = httpResponse
      headers.forEach(([name, value]) => res.setHeader(name, value))
      res.status(statusCode).send(body)
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
