/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// Reuses Astro's Vite config so `@/` aliases and `astro:*` modules resolve in tests.
export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts', 'integrations/**/*.test.ts'],
    environment: 'node',
  },
});
