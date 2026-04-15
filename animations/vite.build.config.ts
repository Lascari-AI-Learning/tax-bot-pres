import {defineConfig} from 'vite';
import path from 'path';

export default defineConfig(async () => {
  const mod = await import('@motion-canvas/vite-plugin');
  const motionCanvas = mod.default?.default ?? mod.default;

  const entry = process.env.ANIM_ENTRY
    || path.resolve(__dirname, 'src/project.ts');
  const outFileName = process.env.ANIM_OUT_FILE || 'project';

  return {
    plugins: [
      motionCanvas({
        project: [entry],
      }),
    ],
    build: {
      lib: {
        entry,
        formats: ['es'],
        fileName: outFileName,
      },
      outDir: path.resolve(__dirname, '../public/animations'),
      emptyOutDir: false,
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
    },
  };
});
