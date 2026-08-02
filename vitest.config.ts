import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/lib/**', 'src/components/ui/**', 'src/context/**', 'src/hooks/**'],
      exclude: ['src/**/*.{test,spec}.{ts,tsx}', 'src/test/**', 'src/components/ui/DatePicker.tsx', 'src/components/ui/PrioritySelect.tsx'],
      thresholds: {
        statements: 10,
        branches: 10,
        functions: 5,
        lines: 10,
      },
    },
  },
})
