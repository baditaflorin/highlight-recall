import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as {
  version: string
}

function gitValue(command: string, fallback: string) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return fallback
  }
}

const commitSha = gitValue('git rev-parse --short HEAD', 'dev')

// https://vite.dev/config/
export default defineConfig({
  base: '/highlight-recall/',
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __COMMIT_SHA__: JSON.stringify(commitSha),
    __REPOSITORY_URL__: JSON.stringify('https://github.com/baditaflorin/highlight-recall'),
  },
  build: {
    outDir: 'docs',
    assetsDir: 'assets',
    emptyOutDir: false,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@huggingface/transformers')) return 'ai-embeddings'
          if (id.includes('@mlc-ai/web-llm')) return 'local-llm'
          if (id.includes('pdfjs-dist')) return 'pdf-parser'
          if (id.includes('jszip')) return 'epub-parser'
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
    },
  },
})
