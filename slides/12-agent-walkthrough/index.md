---
theme: ../
layout: default
clicks: 8
---

<div class="text-4xl text-center mb-6 text-gray-900 font-bold">Agent Walkthrough: Skills in Action</div>

<div class="flex justify-center">
  <div class="w-5/6">
    <AgentView
      query="Extract tables from invoice.pdf"
      :stepByStep="true"
      :height="420"
      :events="[
        {
          type: 'thought',
          content: 'The user wants to extract tables from a PDF. I have a **pdf-processing** skill available — let me read its SKILL.md to understand how to handle this.'
        },
        {
          type: 'files-read',
          content: 'Reading the skill definition to understand available tools and instructions.',
          files: [
            { path: '.claude/skills/pdf-processing/SKILL.md', lines: 42, description: 'Skill definition with frontmatter and instructions' }
          ]
        },
        {
          type: 'tool-result',
          content: '**pdf-processing/SKILL.md**\n\n`name: pdf-processing`\n`description: Extract text and tables from PDF files`\n\n## How to extract tables\nFor table extraction, see `references/advanced-extraction.md`'
        },
        {
          type: 'files-read',
          content: 'The SKILL.md references a detailed extraction guide. Reading it now.',
          files: [
            { path: '.claude/skills/pdf-processing/references/advanced-extraction.md', lines: 28, description: 'Advanced table extraction instructions' }
          ]
        },
        {
          type: 'tool-result',
          content: '**Advanced Table Extraction**\n\nRequires `pdfplumber` library.\n\nUsage:\n```\npython scripts/extract.py <input.pdf>\n```\n\nOutputs extracted tables as CSV to stdout.'
        },
        {
          type: 'tool-call',
          title: 'Bash',
          content: 'python .claude/skills/pdf-processing/scripts/extract.py invoice.pdf'
        },
        {
          type: 'tool-result',
          content: '```\nExtracted 3 tables from invoice.pdf\n\nTable 1: Line Items (12 rows)\nTable 2: Tax Summary (4 rows)\nTable 3: Payment Terms (2 rows)\n\nOutput saved to invoice_tables.csv\n```'
        },
        {
          type: 'assistant',
          content: 'I extracted **3 tables** from `invoice.pdf`:\n\n- **Line Items** — 12 rows of product/service entries\n- **Tax Summary** — 4 rows breaking down tax categories\n- **Payment Terms** — 2 rows with due dates and methods\n\nThe results are saved to `invoice_tables.csv`.'
        }
      ]"
    />
  </div>
</div>

<!--
This slide demonstrates the AgentView component showing a skills-based workflow. Each click reveals the next step: the agent recognizes a matching skill, reads the SKILL.md, follows references to find extraction instructions, runs the script, and summarizes the results. Compare with the How Skills Work slide for a side-by-side view of the same scenario.
-->
