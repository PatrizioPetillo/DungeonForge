import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    manifest: true,
    minify: true,
    rollupOptions: {
      onwarn(warning, warn) {
      console.warn(warning); // stampa tutti i warning di Rollup
    },
      external: ['uuid'],
      treeshake: false, // Disabilita il tree-shaking per evitare problemi con le dipendenze
    }
  }
})
