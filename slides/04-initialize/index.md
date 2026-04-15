---
theme: ../
layout: default
clicks: 2
---

<div class="flex flex-col h-full p-2">
  <div class="text-3xl text-center mb-4 text-gray-900 font-bold">Phase 0 — Initialize</div>

  <div class="flex-1 min-h-0">
    <div
      class="max-w-2xl mx-auto transition-all duration-500"
      :class="$clicks < 2 ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'"
    >
      <Terminal
        :lines="[
          { command: '/cpa-tax-prep:initialize 2025', output: 'Creating scaffold...\n✓ source-documents/ created\n✓ write-up/ created\n✓ intake.md template created\n\nDrop your documents into source-documents/ and run intake.' }
        ]"
        title="claude — bash"
        shell="bash"
        :height="260"
        :clicks="$clicks"
      />
    </div>
    <div
      class="h-full transition-all duration-500"
      :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'"
    >
      <FileExplorer dir="04-initialize/filetree/tax-2025" :expandDepth="1" />
    </div>
  </div>
</div>
