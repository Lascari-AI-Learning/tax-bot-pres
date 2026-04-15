---
theme: ../
layout: default
clicks: 2
---

<div class="flex flex-col h-full p-2">
  <div class="flex-1 min-h-0 relative">
    <div
      class="h-full flex items-center justify-center transition-all duration-500"
      :class="$clicks < 1 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'"
    >
      <div class="w-full max-w-5xl">
        <MotionCanvas src="/animations/06-extract.js" />
      </div>
    </div>
    <div
      class="max-w-2xl mx-auto transition-all duration-500"
      :class="$clicks >= 1 && $clicks < 2 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'"
    >
      <Terminal
        :lines="[
          { command: '/cpa-tax-prep:extract 2025', output: 'Reading intake.md for context...\nScanning source-documents/ for files...\n\nFound 8 documents. Spawning parallel extractors:\n  → tax-extract: Business Jan 2025.pdf\n  → tax-extract: Business Feb 2025.pdf\n  → tax-extract: Personal Jan 2025.pdf\n  → tax-extract: Personal Feb 2025.pdf\n  → tax-extract: Q1 2025.pdf\n  → tax-extract: Q2 2025.pdf\n  → tax-extract: 1099-NEC Acme Corp.pdf\n  → tax-extract: 1095-A 2025.pdf\n\n✓ 8/8 extractions complete\nAggregating into raw/ by category...\n✓ 5 category files written' }
        ]"
        title="claude — bash"
        shell="bash"
        :height="430"
        :clicks="$clicks"
      />
    </div>
    <div
      class="h-full transition-all duration-500"
      :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'"
    >
      <FileExplorer
        v-if="$clicks >= 2"
        dir="06-extract/filetree/tax-2025"
        :folderState="{ 'source-documents': false, 'write-up': true, 'extractions': true, 'raw': false }"
        defaultFile="business-2025-01.md"
      />
    </div>
  </div>
</div>
