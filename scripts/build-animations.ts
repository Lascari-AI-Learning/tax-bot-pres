// Build script for Motion Canvas animations.
//
// Finds every slides/<name>/scene.tsx, wraps it in a temporary project file,
// and builds it to public/animations/<slide-name>.js.
//
// Usage: npx tsx scripts/build-animations.ts [slide-name]
//   - No args: builds all slides that have a scene.tsx
//   - With arg: builds only the named slide (e.g., "03-token-by-token")

import {execSync} from 'child_process';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SLIDES_DIR = path.join(ROOT, 'slides');
const OUT_DIR = path.join(ROOT, 'public', 'animations');
const ANIM_DIR = path.join(ROOT, 'animations');
const TMP_PROJECT = path.join(ANIM_DIR, 'src', '_build_project.ts');

// Ensure output directory exists
fs.mkdirSync(OUT_DIR, {recursive: true});

// Find slides with scene.tsx
const filter = process.argv[2];
const slides = fs.readdirSync(SLIDES_DIR).filter((name) => {
  const scenePath = path.join(SLIDES_DIR, name, 'scene.tsx');
  if (!fs.existsSync(scenePath)) return false;
  if (filter && name !== filter) return false;
  return true;
});

if (slides.length === 0) {
  console.log(filter ? `No scene.tsx found for "${filter}"` : 'No scene.tsx files found in slides/');
  process.exit(0);
}

console.log(`Building ${slides.length} animation(s)...\n`);

for (const slide of slides) {
  const scenePath = path.resolve(SLIDES_DIR, slide, 'scene.tsx');
  const relScene = path.relative(path.join(ANIM_DIR, 'src'), scenePath);
  const outFile = `${slide}.js`;

  // Write temporary project file that imports just this one scene
  const projectContent = `
import {makeProject} from '@motion-canvas/core';
import scene from '${relScene.replace(/\\/g, '/')}?scene';

export default makeProject({
  scenes: [scene],
});
`.trim();

  fs.writeFileSync(TMP_PROJECT, projectContent);

  // Build with vite
  console.log(`  Building: ${slide}`);
  try {
    execSync(
      `npx vite build --config vite.build.config.ts`,
      {
        cwd: ANIM_DIR,
        stdio: 'pipe',
        env: {
          ...process.env,
          ANIM_ENTRY: TMP_PROJECT,
          ANIM_OUT_FILE: slide,
        },
      },
    );
    console.log(`  ✓ ${slide} → public/animations/${outFile}`);
  } catch (err: any) {
    console.error(`  ✗ ${slide} failed:`);
    console.error(err.stderr?.toString() || err.message);
  }
}

// Clean up temp file
if (fs.existsSync(TMP_PROJECT)) {
  fs.unlinkSync(TMP_PROJECT);
}

console.log(`\nDone. ${slides.length} animation(s) built.`);
