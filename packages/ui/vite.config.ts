import { defineConfig } from 'vite'

// Library build: emits dist/index.js with Lit left as an external import.
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rolldownOptions: {
      external: [/^lit(\/|$)/],
    },
  },
})
