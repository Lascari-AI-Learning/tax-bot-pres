import fs from "node:fs/promises";
import path from "node:path";
import * as url from "node:url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

import { globbySync } from "globby";

export const repoRoot = path.join(__dirname, "..");
export const slidesDir = path.join(repoRoot, "slides");

// Get all slides and sort them
const slides = globbySync("*/index.md", { cwd: slidesDir }).sort();

// Build the new index content from scratch
// No need to read existing file or preserve frontmatter
const indexContent: string[] = [];

// Add each slide as a src reference
slides.forEach((slide) => {
  indexContent.push("---");
  indexContent.push(`src: ./slides/${slide}`);
  indexContent.push("---");
  indexContent.push("");
});

// Write the new index.md file
await fs.writeFile(path.join(repoRoot, "index.md"), indexContent.join("\n"));
