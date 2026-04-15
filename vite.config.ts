import {defineConfig} from 'vite';

export default defineConfig({
  optimizeDeps: {
    // Only exclude the player — its @vite-ignore comment must be preserved.
    exclude: ['@motion-canvas/player'],
    // Force chroma-js through pre-bundling so its CJS→ESM conversion works.
    include: [
      '@motion-canvas/core > chroma-js',
    ],
  },
});
