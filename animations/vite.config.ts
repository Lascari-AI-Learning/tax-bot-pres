import {defineConfig} from 'vite';

export default defineConfig(async () => {
  const mod = await import('@motion-canvas/vite-plugin');
  const motionCanvas = mod.default?.default ?? mod.default;

  return {
    plugins: [
      motionCanvas({
        project: ['./src/project.ts'],
      }),
    ],
  };
});
