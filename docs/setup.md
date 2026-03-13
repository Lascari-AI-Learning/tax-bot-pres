# Setup Guide

This guide walks you through setting up your own presentation using this Slidev template.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [pnpm](https://pnpm.io/) package manager
- A GitHub account

## Step 1: Create Your Repository

You have two options:

### Option A: Use as a Template (Recommended)

1. Go to the [SlidevTemplate repository](https://github.com/lascari-ai-learning/SlidevTemplate)
2. Click the **"Use this template"** button
3. Select **"Create a new repository"**
4. Name your repository and choose visibility settings
5. Click **"Create repository"**

### Option B: Fork the Repository

1. Go to the [SlidevTemplate repository](https://github.com/lascari-ai-learning/SlidevTemplate)
2. Click the **"Fork"** button
3. Choose your account and repository name

### Option C: Clone and Push to New Repo

```bash
# Clone the template
git clone https://github.com/lascari-ai-learning/SlidevTemplate.git my-presentation

# Navigate into the directory
cd my-presentation

# Remove the original remote
git remote remove origin

# Add your own remote
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Push to your new repository
git push -u origin main
```

## Step 2: Install Dependencies

```bash
# Navigate to your project directory
cd my-presentation

# Install dependencies
npm install
# or
pnpm install
```

## Step 3: Update the Title Slide Link

The title slide contains a QR code that links to your repository. You need to update this URL.

1. Open `slides/00-title.md`
2. Find the `link` property in the frontmatter:

```yaml
---
theme: ../
layout: title
link: https://github.com/your-username/SlidevTemplate  # <-- Update this!
---
```

3. Replace `your-username/SlidevTemplate` with your actual GitHub username and repository name:

```yaml
link: https://github.com/YOUR-USERNAME/YOUR-REPO-NAME
```

> **Note:** This link is used to generate the QR code on the title slide, allowing your audience to easily access your presentation source.

## Step 4: Enable GitHub Pages

The repository includes a GitHub Actions workflow that automatically builds and deploys your presentation. You just need to enable GitHub Pages:

1. Go to your repository on GitHub
2. Click **Settings** (gear icon)
3. In the left sidebar, click **Pages**
4. Under **"Build and deployment"**:
   - **Source:** Select **"GitHub Actions"**
5. That's it! No need to select a branch.

### How the Deployment Works

- The workflow (`.github/workflows/deploy.yml`) triggers on every push to `main` or `master`
- It automatically builds your slides and deploys them to GitHub Pages
- Your presentation will be available at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

### Troubleshooting Deployment

If your deployment isn't working:

1. **Check Actions tab:** Go to your repo's "Actions" tab to see workflow runs
2. **Verify Pages settings:** Ensure GitHub Pages source is set to "GitHub Actions"
3. **Manual trigger:** You can manually trigger a deploy from the Actions tab by selecting the "Deploy pages" workflow and clicking "Run workflow"

## Step 5: Start Developing

```bash
# Start the development server
npm run dev
```

This opens your presentation at `http://localhost:3030`. Changes to slides will hot-reload automatically.

## Next Steps

- **Create slides:** Use `npm run generate:slide` to create slides from templates
- **View templates:** Use `npm run list:templates` to see available templates
- **Build for production:** Use `npm run build` to generate static files
- **Export to PDF:** Use `npm run export` to create a PDF version

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:slides` | Regenerate index.md from slides |
| `npm run generate:slide -- --template=<name> --name=<slide-name>` | Generate a new slide |
| `npm run list:templates` | List available templates |
| `npm run export` | Export to PDF |
