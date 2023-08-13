import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    loader: 'jsx',
    include: [
      "src/**/*.js",
      "src/**/*.jsx",
      "node_modules/**/*.js"
    ]
  },
  plugins: [react()],
})
