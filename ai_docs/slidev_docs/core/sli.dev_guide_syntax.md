---
url: "https://sli.dev/guide/syntax"
title: "Syntax Guide | Slidev"
---

[Skip to content](https://sli.dev/guide/syntax#VPContent)

On this page

# Syntax Guide [​](https://sli.dev/guide/syntax\#syntax-guide)

Slidev's slides are written as Markdown files, which are called **Slidev Markdown** s. A presentation has a Slidev Markdown as its entry, which is `./slides.md` by default, but you can change it by passing the file path as an argument to [the CLI commands](https://sli.dev/builtin/cli).

In a Slidev Markdown, not only [the basic Markdown features](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) can be used as usual, Slidev also provides additional features to enhance your slides. This section covers the syntax introduced by Slidev. Please make sure you know the basic Markdown syntax before reading this guide.

## Slide Separators [​](https://sli.dev/guide/syntax\#slide-separators)

Use `---` padded with a new line to separate your slides.

md

````
# Title

Hello, **Slidev**!

---

# Slide 2

Use code blocks for highlighting:

```ts
console.log('Hello, World!')
```

---

# Slide 3

Use UnoCSS classes and Vue components to style and enrich your slides:

<div class="p-3">
  <Tweet id="..." />
</div>
````

## Frontmatter & Headmatter [​](https://sli.dev/guide/syntax\#frontmatter)

At the beginning of each slide, you can add an optional [frontmatter](https://jekyllrb.com/docs/front-matter/) to configure the slide. The first frontmatter block is called **headmatter** and can configure the whole slide deck. The rest are **frontmatters** for individual slides. Texts in the headmatter or the frontmatter should be an object in [YAML](https://www.cloudbees.com/blog/yaml-tutorial-everything-you-need-get-started/) format. For example:

md

```
---
theme: seriph
title: Welcome to Slidev
---

# Slide 1

The frontmatter of this slide is also the headmatter

---
layout: center
background: /background-1.png
class: text-white
---

# Slide 2

A page with the layout `center` and a background image

---

# Slide 3

A page without frontmatter

---
src: ./pages/4.md  # This slide only contains a frontmatter
---

---

# Slide 5
```

Configurations you can set are described in the [Slides deck configurations](https://sli.dev/custom/#headmatter) and [Per slide configurations](https://sli.dev/custom/#frontmatter) sections.

To make the headmatter more readable, you can install the VSCode extension:

✨ VS Code Extension

[✨ VS Code Extension](https://sli.dev/features/vscode-extension)

[Editor](https://sli.dev/features/#tags=editor)

Help you better organize your slides and have a quick overview of them.

Also, there is another possible frontmatter format:

✨ Block Frontmatter

[✨ Block Frontmatter](https://sli.dev/features/block-frontmatter)

[Syntax](https://sli.dev/features/#tags=syntax)

Use a YAML code block as the frontmatter.

## Notes [​](https://sli.dev/guide/syntax\#notes)

You can also create presenter notes for each slide. They will show up in 📖 User Interface

[📖 User Interface](https://sli.dev/guide/ui#presenter-mode)

for you to reference during presentations.

The comment blocks at the end of each slide are treated as the note of the slide:

md

```
---
layout: cover
---

# Slide 1

This is the cover page.

<!-- This is a **note** -->

---

# Slide 2

<!-- This is NOT a note because it is not at the end of the slide -->

The second page

<!--
This is _another_ note
-->
```

Basic Markdown and HTML are also supported in notes and will be rendered.

See also:

✨ Click Markers

[✨ Click Markers](https://sli.dev/features/click-marker)

[Presenter](https://sli.dev/features/#tags=presenter) [Animation](https://sli.dev/features/#tags=animation)

Highlighting notes and auto-scrolling to the active section of notes.

## Code Blocks [​](https://sli.dev/guide/syntax\#code-block)

One big reason that led to the creation of Slidev was the need to perfectly display code in slides. Consequently, you can use Markdown-flavored code blocks to highlight your code.

md

````
```ts
console.log('Hello, World!')
```
````

Slidev has [Shiki](https://github.com/shikijs/shiki) built in as the syntax highlighter. Refer to [Configure Shiki](https://sli.dev/custom/config-highlighter) for more details.

More about code blocks:

✨ Line Numbers

[✨ Line Numbers](https://sli.dev/features/code-block-line-numbers)

[Codeblock](https://sli.dev/features/#tags=codeblock)

Enable line numbering for all code blocks across the slides or individually.

✨ Max Height

[✨ Max Height](https://sli.dev/features/code-block-max-height)

[Codeblock](https://sli.dev/features/#tags=codeblock) [Layout](https://sli.dev/features/#tags=layout)

Set a maximum height for a code block and enable scrolling.

✨ Line Highlighting

[✨ Line Highlighting](https://sli.dev/features/line-highlighting)

[Codeblock](https://sli.dev/features/#tags=codeblock) [Animation](https://sli.dev/features/#tags=animation)

Highlight specific lines in code blocks based on clicks.

✨ Monaco Editor

[✨ Monaco Editor](https://sli.dev/features/monaco-editor)

[Codeblock](https://sli.dev/features/#tags=codeblock) [Editor](https://sli.dev/features/#tags=editor)

Turn code blocks into fully-featured editors, or generate a diff between two code blocks.

✨ Monaco Runner

[✨ Monaco Runner](https://sli.dev/features/monaco-run)

[Codeblock](https://sli.dev/features/#tags=codeblock) [Editor](https://sli.dev/features/#tags=editor)

Run code directly in the editor and see the result.

✨ Writable Monaco Editor

[✨ Writable Monaco Editor](https://sli.dev/features/monaco-write)

[Codeblock](https://sli.dev/features/#tags=codeblock) [Editor](https://sli.dev/features/#tags=editor)

A monaco editor that allows you to write code directly in the slides and save the changes back to the file.

✨ Shiki Magic Move

[✨ Shiki Magic Move](https://sli.dev/features/shiki-magic-move)

[Codeblock](https://sli.dev/features/#tags=codeblock) [Animation](https://sli.dev/features/#tags=animation)

Enable granular transition between code changes, similar to Keynote's Magic Move.

✨ TwoSlash Integration

[✨ TwoSlash Integration](https://sli.dev/features/twoslash)

[Codeblock](https://sli.dev/features/#tags=codeblock)

A powerful tool for rendering TypeScript code blocks with type information on hover or inlined.

✨ Import Code Snippets

[✨ Import Code Snippets](https://sli.dev/features/import-snippet)

[Codeblock](https://sli.dev/features/#tags=codeblock) [Syntax](https://sli.dev/features/#tags=syntax)

Import code snippets from existing files into your slides.

✨ Code Groups

[✨ Code Groups](https://sli.dev/features/code-groups)

[Codeblock](https://sli.dev/features/#tags=codeblock)

Group multiple code blocks and automatically match icon by the title name.

## LaTeX Blocks [​](https://sli.dev/guide/syntax\#latex-block)

Slidev supports LaTeX blocks for mathematical and chemical formulas:

✨ LaTeX

[✨ LaTeX](https://sli.dev/features/latex)

[Codeblock](https://sli.dev/features/#tags=codeblock) [Syntax](https://sli.dev/features/#tags=syntax)

Slidev comes with LaTeX support out-of-box, powered by KaTeX.

## Diagrams [​](https://sli.dev/guide/syntax\#diagrams)

Slidev supports [Mermaid](https://mermaid.js.org/) and [PlantUML](https://plantuml.com/) for creating diagrams from text:

✨ Mermaid Diagrams

[✨ Mermaid Diagrams](https://sli.dev/features/mermaid)

[Diagram](https://sli.dev/features/#tags=diagram)

Create diagrams/graphs from textual descriptions, powered by Mermaid.

✨ PlantUML Diagrams

[✨ PlantUML Diagrams](https://sli.dev/features/plantuml)

[Diagram](https://sli.dev/features/#tags=diagram)

Create diagrams from textual descriptions, powered by PlantUML.

## MDC Syntax [​](https://sli.dev/guide/syntax\#mdc-syntax)

MDC Syntax is the easiest way to apply styles and classes to elements:

✨ MDC Syntax

[✨ MDC Syntax](https://sli.dev/features/mdc)

[Syntax](https://sli.dev/features/#tags=syntax) [Styling](https://sli.dev/features/#tags=styling)

A powerful syntax to enhance your markdown content with components and styles.

## Scoped CSS [​](https://sli.dev/guide/syntax\#scoped-css)

You can use scoped CSS to style your slides:

✨ Slide Scope Styles

[✨ Slide Scope Styles](https://sli.dev/features/slide-scope-style)

[Styling](https://sli.dev/features/#tags=styling) [Syntax](https://sli.dev/features/#tags=syntax)

Define styles for only the current slide.

## Importing Slides [​](https://sli.dev/guide/syntax\#importing-slides)

✨ Importing Slides

[✨ Importing Slides](https://sli.dev/features/importing-slides)

[Syntax](https://sli.dev/features/#tags=syntax)

Split your \`slides.md\` into multiple files for better reusability and organization.