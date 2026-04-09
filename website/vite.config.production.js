// Minimal vite config used at runtime on the production server.
// Vike (0.4.x) loads the vite config at startup even in production to read
// its settings. This file replaces vite.config.ts on the server so only
// 'vike' (a production dep) is required — no react/tailwind build plugins needed.
import { defineConfig } from 'vite'
import vike from 'vike/plugin'

export default defineConfig({
  plugins: [vike()],
})
