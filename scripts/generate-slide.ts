import fs from "node:fs/promises";
import path from "node:path";
import * as url from "node:url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

interface TemplateConfig {
  template: string;
  name: string;
  variables: Record<string, any>;
}

// Parse command line arguments
function parseArgs(): TemplateConfig {
  const args = process.argv.slice(2);
  const config: TemplateConfig = {
    template: "",
    name: "",
    variables: {}
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === "--template" && i + 1 < args.length) {
      config.template = args[++i];
    } else if (arg === "--name" && i + 1 < args.length) {
      config.name = args[++i];
    } else if (arg.startsWith("--") && i + 1 < args.length) {
      const key = arg.substring(2);
      const value = args[++i];
      
      // Try to parse JSON values
      try {
        config.variables[key] = JSON.parse(value);
      } catch {
        // If not JSON, treat as string
        config.variables[key] = value;
      }
    }
  }

  return config;
}

// Simple handlebars-like template replacement
function processTemplate(template: string, variables: Record<string, any>): string {
  let result = template;

  // Replace simple variables {{variable}}
  result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match;
  });

  // Handle {{#each}} blocks
  result = result.replace(/\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, key, block) => {
    const items = variables[key];
    if (!Array.isArray(items)) return match;

    return items.map((item, index) => {
      let itemBlock = block;
      
      // Replace {{this}}
      itemBlock = itemBlock.replace(/\{\{this\}\}/g, item);
      
      // Replace {{@index}}
      itemBlock = itemBlock.replace(/\{\{@index\}\}/g, index.toString());
      
      // Replace {{@first}}
      itemBlock = itemBlock.replace(/\{\{@first\}\}/g, (index === 0).toString());
      
      // Replace item properties {{property}}
      if (typeof item === 'object') {
        Object.keys(item).forEach(prop => {
          const regex = new RegExp(`\\{\\{${prop}\\}\\}`, 'g');
          itemBlock = itemBlock.replace(regex, item[prop]);
        });
        
        // Handle nested #if blocks for item properties
        itemBlock = itemBlock.replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (ifMatch, ifKey, ifBlock) => {
          return item[ifKey] ? ifBlock : '';
        });
      }
      
      return itemBlock;
    }).join('');
  });

  // Handle {{#if}} blocks (for top-level variables)
  result = result.replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, key, block) => {
    return variables[key] ? block : '';
  });

  // Handle triple braces for unescaped HTML {{{variable}}}
  result = result.replace(/\{\{\{(\w+)\}\}\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match;
  });

  return result;
}

async function main() {
  const config = parseArgs();

  // Validate inputs
  if (!config.template) {
    console.error("Error: --template is required");
    console.error("Usage: npm run generate:slide -- --template=<template-name> --name=<slide-name> [--variable=value ...]");
    process.exit(1);
  }

  if (!config.name) {
    console.error("Error: --name is required");
    console.error("Usage: npm run generate:slide -- --template=<template-name> --name=<slide-name> [--variable=value ...]");
    process.exit(1);
  }

  // Paths
  const repoRoot = path.join(__dirname, "..");
  const templateDir = path.join(repoRoot, "slide-templates", config.template);
  const templateFile = path.join(templateDir, "slide.md");
  const slidesDir = path.join(repoRoot, "slides");
  const outputDir = path.join(slidesDir, config.name);
  const outputFile = path.join(outputDir, 'index.md');

  // Check if template exists
  try {
    await fs.access(templateFile);
  } catch {
    console.error(`Error: Template '${config.template}' not found at ${templateDir}`);
    console.error("\nAvailable templates:");
    const templates = await fs.readdir(path.join(repoRoot, "slide-templates"));
    templates.forEach(t => console.error(`  - ${t}`));
    process.exit(1);
  }

  // Read template
  const templateContent = await fs.readFile(templateFile, 'utf-8');

  // Process template with variables
  const processedContent = processTemplate(templateContent, config.variables);

  // Create slide folder and write output file
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(outputFile, processedContent);
  console.log(`✓ Generated slide: ${outputFile}`);

  // Show description if exists
  const descriptionFile = path.join(templateDir, "description.md");
  try {
    await fs.access(descriptionFile);
    console.log(`\nℹ️  Template documentation: ${descriptionFile}`);
  } catch {
    // No description file
  }
}

// Run the script
main().catch(error => {
  console.error("Error:", error);
  process.exit(1);
});