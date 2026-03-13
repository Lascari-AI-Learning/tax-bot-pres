---
theme: ../
layout: default
clicks: 8
---

<div class="flex justify-between items-start">
<h1>How Skills Work</h1>
<a href="https://agentskills.io/home" target="_blank" class="text-sm text-blue-400 hover:text-blue-300 no-underline">Agent Skill Reference →</a>
</div>

<!-- Container for all steps - same position -->
<div class="relative min-h-96">

<!-- Scene 1: The SKILL.md file with frontmatter -->
<div v-if="$clicks >= 1 && $clicks < 2" class="absolute inset-0">
<div class="bg-white border-blue-600 border-1 rounded-lg p-6">
<h3 class="text-xl font-bold text-blue-600 mb-4">Step 1: Create a SKILL.md File</h3>
<div class="grid grid-cols-3 gap-6">
<div class="col-span-2 bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm">
<div class="text-gray-500 mb-2"># pdf-processing/SKILL.md</div>
<div class="text-amber-600">---</div>
<div><span class="text-blue-600">name:</span> <span class="text-gray-900">pdf-processing</span></div>
<div><span class="text-blue-600">description:</span> <span class="text-gray-900">Extract text and tables</span></div>
<div class="ml-4 text-gray-900">from PDF files, fill forms, merge docs.</div>
<div class="text-amber-600">---</div>
</div>
<div class="col-span-1">
<div class="text-gray-700 font-medium mb-3">That's It for the Minimum Spec:</div>
<ul class="space-y-2 text-gray-900">
<li><span class="text-blue-600 font-bold">name</span> - identifier (lowercase, hyphens)</li>
<li><span class="text-blue-600 font-bold">description</span> - what it does & when to use</li>
</ul>
</div>
</div>
</div>
</div>

<!-- Scene 2: Add content/instructions -->
<div v-if="$clicks >= 2 && $clicks < 3" class="absolute inset-0">
<div class="bg-white border-blue-600 border-1 rounded-lg p-6">
<h3 class="text-xl font-bold text-blue-600 mb-4">Step 2: Add Instructions</h3>
<div class="grid grid-cols-3 gap-6">
<div class="col-span-2 bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm">
<div class="text-gray-500 mb-2"># pdf-processing/SKILL.md</div>
<div class="text-amber-600">---</div>
<div><span class="text-blue-600">name:</span> <span class="text-gray-900">pdf-processing</span></div>
<div><span class="text-blue-600">description:</span> <span class="text-gray-900">Extract text and tables...</span></div>
<div class="text-amber-600">---</div>
<div class="mt-3 text-green-600 font-bold"># PDF Processing</div>
<div class="mt-2 text-gray-700">## When to use this skill</div>
<div class="text-gray-500 text-xs">Use when the user needs to work with PDFs...</div>
<div class="mt-2 text-gray-700">## How to extract text</div>
<div class="text-gray-500 text-xs">1. Use pdfplumber for extraction...</div>
<div class="mt-2 text-gray-700">## How to fill forms</div>
<div class="text-gray-500 text-xs">Run scripts/fill_form.py...</div>
</div>
<div class="col-span-1">
<div class="text-gray-700 font-medium mb-3">The Markdown Body Contains:</div>
<ul class="space-y-2 text-gray-900">
<li>Step-by-step instructions</li>
<li>Examples of inputs/outputs</li>
<li>References to scripts & files</li>
<li>Common edge cases</li>
</ul>
</div>
</div>
</div>
</div>

<!-- Scene 3: Folder structure -->
<div v-if="$clicks >= 3 && $clicks < 4" class="absolute inset-0">
<div class="bg-white border-blue-600 border-1 rounded-lg p-6">
<h3 class="text-xl font-bold text-blue-600 mb-4">Step 3: Add Supporting Files</h3>
<div class="grid grid-cols-3 gap-6">
<div class="col-span-2 bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm">
<div class="text-gray-900">pdf-processing/</div>
<div class="ml-4 text-green-600">├── SKILL.md</div>
<div class="ml-4 text-blue-600">├── scripts/</div>
<div class="ml-8 text-gray-600">├── extract.py</div>
<div class="ml-8 text-gray-600">└── fill_form.py</div>
<div class="ml-4 text-blue-600">├── references/</div>
<div class="ml-8 text-gray-600">├── FORMS.md</div>
<div class="ml-8 text-gray-600">└── advanced-extraction.md</div>
<div class="ml-4 text-blue-600">└── assets/</div>
<div class="ml-8 text-gray-600">└── form-template.pdf</div>
</div>
<div class="col-span-1">
<div class="text-gray-700 font-medium mb-3">Optional Directories:</div>
<ul class="space-y-2 text-gray-900">
<li><span class="text-blue-600 font-bold">scripts/</span> - executable code</li>
<li><span class="text-blue-600 font-bold">references/</span> - detailed docs</li>
<li><span class="text-blue-600 font-bold">assets/</span> - templates, data files</li>
</ul>
</div>
</div>
</div>
</div>

<!-- Scene 4: The XML block agents see -->
<div v-if="$clicks >= 4 && $clicks < 5" class="absolute inset-0">
<div class="bg-white border-purple-600 border-1 rounded-lg p-6">
<h3 class="text-xl font-bold text-purple-600 mb-4">What the Agent Sees at Startup</h3>
<div class="grid grid-cols-4 gap-6">
<div class="col-span-3 bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-xs">
<div class="text-gray-500">&lt;!-- In the system prompt --&gt;</div>
<div class="text-amber-600">&lt;available_skills&gt;</div>
<div class="ml-2 text-blue-600">&lt;skill&gt;</div>
<div class="ml-4"><span class="text-green-600">&lt;name&gt;</span><span class="text-gray-900">pdf-processing</span><span class="text-green-600">&lt;/name&gt;</span></div>
<div class="ml-4"><span class="text-green-600">&lt;description&gt;</span><span class="text-gray-900">Extract text and tables from PDFs...</span><span class="text-green-600">&lt;/description&gt;</span></div>
<div class="ml-4"><span class="text-green-600">&lt;location&gt;</span><span class="text-gray-900">.claude/skills/pdf-processing/SKILL.md</span><span class="text-green-600">&lt;/location&gt;</span></div>
<div class="ml-2 text-blue-600">&lt;/skill&gt;</div>
<div class="ml-2 text-blue-600">&lt;skill&gt;</div>
<div class="ml-4"><span class="text-green-600">&lt;name&gt;</span><span class="text-gray-900">data-analysis</span><span class="text-green-600">&lt;/name&gt;</span></div>
<div class="ml-4"><span class="text-green-600">&lt;description&gt;</span><span class="text-gray-900">Analyze datasets, generate charts...</span><span class="text-green-600">&lt;/description&gt;</span></div>
<div class="ml-4"><span class="text-green-600">&lt;location&gt;</span><span class="text-gray-900">.claude/skills/data-analysis/SKILL.md</span><span class="text-green-600">&lt;/location&gt;</span></div>
<div class="ml-2 text-blue-600">&lt;/skill&gt;</div>
<div class="text-amber-600">&lt;/available_skills&gt;</div>
</div>
<div class="col-span-1">
<div class="text-gray-700 font-medium mb-3">Progressive Disclosure:</div>
<ul class="space-y-2 text-gray-900 text-sm">
<li><span class="text-green-600 font-bold">~100 tokens</span> per skill</li>
<li>Only Metadata Loaded</li>
<li>Full Content on Demand</li>
</ul>
</div>
</div>
</div>
</div>

<!-- Scene 5: Worked example - User input, agent sees skills -->
<div v-if="$clicks >= 5 && $clicks < 6" class="absolute inset-0">
<div class="bg-white border-amber-600 border-1 rounded-lg p-5">
<h3 class="text-lg font-bold text-amber-600 mb-3">Worked Example</h3>
<div class="grid grid-cols-3 gap-4 mb-3">
<div class="col-span-2">
<div class="bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono text-xs h-full">
<div class="text-gray-500 mb-1">&lt;!-- Agent's system prompt --&gt;</div>
<div class="text-amber-600">&lt;available_skills&gt;</div>
<div class="ml-2 text-blue-600">&lt;skill&gt;</div>
<div class="ml-4"><span class="text-green-600">&lt;name&gt;</span>pdf-processing<span class="text-green-600">&lt;/name&gt;</span></div>
<div class="ml-4"><span class="text-green-600">&lt;description&gt;</span>Extract text and tables from PDFs...<span class="text-green-600">&lt;/description&gt;</span></div>
<div class="ml-4"><span class="text-green-600">&lt;location&gt;</span>.claude/skills/pdf-processing/SKILL.md<span class="text-green-600">&lt;/location&gt;</span></div>
<div class="ml-2 text-blue-600">&lt;/skill&gt;</div>
<div class="ml-2 text-blue-600">&lt;skill&gt;</div>
<div class="ml-4"><span class="text-green-600">&lt;name&gt;</span>data-analysis<span class="text-green-600">&lt;/name&gt;</span></div>
<div class="ml-4"><span class="text-green-600">&lt;description&gt;</span>Analyze datasets, generate charts...<span class="text-green-600">&lt;/description&gt;</span></div>
<div class="ml-4"><span class="text-green-600">&lt;location&gt;</span>.claude/skills/data-analysis/SKILL.md<span class="text-green-600">&lt;/location&gt;</span></div>
<div class="ml-2 text-blue-600">&lt;/skill&gt;</div>
<div class="text-amber-600">&lt;/available_skills&gt;</div>
</div>
</div>
<div class="col-span-1 flex flex-col gap-2">
<div class="bg-blue-50 border-2 border-blue-600 rounded-lg p-2">
<div class="text-xs text-blue-600 font-bold mb-1">User Input</div>
<div class="text-sm text-gray-900">"Extract tables from invoice.pdf"</div>
</div>
<div class="bg-gray-50 border border-gray-200 rounded-lg p-2">
<div class="text-xs text-gray-500 font-bold mb-1">Agent Reads</div>
<div class="text-sm text-gray-700">pdf-processing skill</div>
</div>
<div class="bg-gray-50 border border-gray-200 rounded-lg p-2">
<div class="text-xs text-gray-500 font-bold mb-1">Agent Reads</div>
<div class="text-sm text-gray-700">advanced-extraction.md</div>
</div>
</div>
</div>
<div class="bg-gray-900 rounded-lg p-2 font-mono text-xs">
<span class="text-gray-500">&gt;</span> <span class="text-green-400">Read</span> <span class="text-gray-300">.claude/skills/pdf-processing/SKILL.md</span>
</div>
</div>
</div>

<!-- Scene 6: Agent reads SKILL.md -->
<div v-if="$clicks >= 6 && $clicks < 7" class="absolute inset-0">
<div class="bg-white border-amber-600 border-1 rounded-lg p-5">
<h3 class="text-lg font-bold text-amber-600 mb-3">Worked Example</h3>
<div class="grid grid-cols-3 gap-4 mb-3">
<div class="col-span-2">
<div class="bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono text-xs">
<div class="text-gray-500"># pdf-processing/SKILL.md</div>
<div class="text-amber-600">---</div>
<div><span class="text-blue-600">name:</span> pdf-processing</div>
<div><span class="text-blue-600">description:</span> Extract text and tables...</div>
<div class="text-amber-600">---</div>
<div class="mt-2 text-green-600 font-bold"># PDF Processing</div>
<div class="mt-1 text-gray-700">## How to extract tables</div>
<div class="text-gray-500">For table extraction, see</div>
<div class="text-blue-600">references/advanced-extraction.md</div>
</div>
</div>
<div class="col-span-1 flex flex-col gap-2">
<div class="bg-gray-50 border border-gray-200 rounded-lg p-2">
<div class="text-xs text-gray-500 font-bold mb-1">User Input</div>
<div class="text-sm text-gray-700">"Extract tables from invoice.pdf"</div>
</div>
<div class="bg-blue-50 border-2 border-blue-600 rounded-lg p-2">
<div class="text-xs text-blue-600 font-bold mb-1">Agent Reads</div>
<div class="text-sm text-gray-900">pdf-processing skill</div>
</div>
<div class="bg-gray-50 border border-gray-200 rounded-lg p-2">
<div class="text-xs text-gray-500 font-bold mb-1">Agent Reads</div>
<div class="text-sm text-gray-700">advanced-extraction.md</div>
</div>
</div>
</div>
<div class="bg-gray-900 rounded-lg p-2 font-mono text-xs">
<span class="text-gray-500">&gt;</span> <span class="text-green-400">Read</span> <span class="text-gray-300">.claude/skills/pdf-processing/references/advanced-extraction.md</span>
</div>
</div>
</div>

<!-- Scene 7: Agent reads reference -->
<div v-if="$clicks >= 7" class="absolute inset-0">
<div class="bg-white border-amber-600 border-1 rounded-lg p-5">
<h3 class="text-lg font-bold text-amber-600 mb-3">Worked Example</h3>
<div class="grid grid-cols-3 gap-4 mb-3">
<div class="col-span-2">
<div class="bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono text-xs">
<div class="text-gray-500"># references/advanced-extraction.md</div>
<div class="mt-2 text-green-600 font-bold"># Advanced Table Extraction</div>
<div class="mt-1 text-gray-700">## Prerequisites</div>
<div class="text-gray-500">Requires pdfplumber library</div>
<div class="mt-1 text-gray-700">## Usage</div>
<div class="text-gray-500">Run the extraction script:</div>
<div class="text-blue-600 mt-1">python scripts/extract.py &lt;input.pdf&gt;</div>
</div>
</div>
<div class="col-span-1 flex flex-col gap-2">
<div class="bg-gray-50 border border-gray-200 rounded-lg p-2">
<div class="text-xs text-gray-500 font-bold mb-1">User Input</div>
<div class="text-sm text-gray-700">"Extract tables from invoice.pdf"</div>
</div>
<div class="bg-gray-50 border border-gray-200 rounded-lg p-2">
<div class="text-xs text-gray-500 font-bold mb-1">Agent Reads</div>
<div class="text-sm text-gray-700">pdf-processing skill</div>
</div>
<div class="bg-blue-50 border-2 border-blue-600 rounded-lg p-2">
<div class="text-xs text-blue-600 font-bold mb-1">Agent Reads</div>
<div class="text-sm text-gray-900">advanced-extraction.md</div>
</div>
</div>
</div>
<div class="bg-gray-900 rounded-lg p-2 font-mono text-xs">
<span class="text-gray-500">&gt;</span> <span class="text-green-400">Bash</span> <span class="text-gray-300">python .claude/skills/pdf-processing/scripts/extract.py invoice.pdf</span>
</div>
</div>
</div>

</div>

<!-- Trust callout below the container -->
<div v-click="8">
<div class="bg-white border-red-600 border-2 rounded-lg p-3 text-center">
<span class="text-gray-900">Now you can </span><span class="text-red-600 font-bold">TRUST</span><span class="text-gray-900"> that every PDF extraction happens the same way, every time.</span>
</div>
</div>

<!--
This slide walks through how skills work step by step. First, you create a SKILL.md with just name and description in the frontmatter. Then you add instructions in the markdown body. You can add supporting files like scripts and references. The agent sees all available skills as XML at startup but only loads the full content when needed. In the worked example, when a user says "process this PDF", the agent recognizes it has a matching skill, reads the SKILL.md, follows references to find the right approach, and runs your script exactly how you designed it.
-->

