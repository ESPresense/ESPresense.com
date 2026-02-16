import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    esbuild: {
      drop: mode === 'production' ? ['console'] : [],
    },
    build: {
      lib: {
        entry: 'src/index.ts',
        formats: ['es'],
      },
      rollupOptions: {
        external: mode === "production" ? "" : /^lit-element/,
      },
    },
  }
})
