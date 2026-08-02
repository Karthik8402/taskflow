import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    // Use vmThreads instead of forks to avoid the undici/CacheStorage
    // incompatibility with some Node.js minor versions in CI.
    pool: 'vmThreads',
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/lib/**', 'src/components/ui/**', 'src/pages/**'],
      exclude: ['src/**/*.{test,spec}.{ts,tsx}', 'src/test/**'],
      // Minimum thresholds — tighten these as coverage grows
      thresholds: {
        statements: 15,
        branches: 15,
        functions: 9,
        lines: 15,
      },
    },
  },
})
