import react from '@vitejs/plugin-react'
import { defaultClientConditions, defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Import workspace packages from their source so edits in packages/*
    // show up immediately, without rebuilding the package first.
    conditions: ['@design-system-poc/source', ...defaultClientConditions],
  },
})
