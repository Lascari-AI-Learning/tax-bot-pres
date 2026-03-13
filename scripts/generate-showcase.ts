import fs from "node:fs/promises";
import path from "node:path";
import * as url from "node:url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const repoRoot = path.join(__dirname, "..");
const templatesDir = path.join(repoRoot, "slide-templates");
const slidesDir = path.join(repoRoot, "slides");
const configPath = path.join(repoRoot, "templates.json");

interface SlideConfig {
  order: string;
  template: string;
  source: string;
}

interface TemplatesConfig {
  slides: SlideConfig[];
}

async function main() {
  console.log("Generating showcase slides from templates...\n");

  // Read config
  const configContent = await fs.readFile(configPath, 'utf-8');
  const config: TemplatesConfig = JSON.parse(configContent);

  // Clear existing slides
  const existingSlides = await fs.readdir(slidesDir);
  for (const slide of existingSlides) {
    if (slide.endsWith('.md')) {
      await fs.unlink(path.join(slidesDir, slide));
      console.log(`  Removed: ${slide}`);
    }
  }
  console.log("");

  // Copy slides based on config
  for (const slideConfig of config.slides) {
    const sourceFile = path.join(templatesDir, slideConfig.template, slideConfig.source);
    const outputFilename = `${slideConfig.order}-${slideConfig.template}.md`;
    const outputPath = path.join(slidesDir, outputFilename);

    try {
      await fs.access(sourceFile);
      await fs.copyFile(sourceFile, outputPath);
      console.log(`  Copied: ${slideConfig.template}/${slideConfig.source} -> ${outputFilename}`);
    } catch {
      console.log(`  Error: Could not find ${slideConfig.template}/${slideConfig.source}`);
    }
  }

  console.log("\nShowcase generation complete!");
}

main().catch(error => {
  console.error("Error:", error);
  process.exit(1);
});
