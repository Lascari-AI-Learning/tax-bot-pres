---
theme: ../
layout: default
clicks: 2
---

<div class="flex flex-col h-full p-2">
  <div class="text-3xl text-center mb-4 text-gray-900 font-bold">Phase 2 — Extract</div>
  <div class="flex-1 min-h-0 relative">
    <div
      class="h-full flex items-center justify-center transition-all duration-500"
      :class="$clicks < 1 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="bg-white border-blue-600 border-2 rounded-lg px-6 py-3 text-sm font-bold text-gray-900 text-center w-64 shadow-sm">
          <div class="text-blue-600 text-xs uppercase tracking-wide mb-1">Orchestrator</div>
          /cpa-tax-prep:extract 2025
        </div>
        <svg class="w-4 h-6" viewBox="0 0 16 24"><path d="M8 0 L8 18 M3 13 L8 18 L13 13" stroke="#2563eb" stroke-width="2" fill="none"/></svg>
        <div class="flex gap-2">
          <div class="bg-white border-green-600 border-1 rounded-lg px-3 py-2 text-xs text-center w-28 shadow-sm">
            <div class="text-green-600 font-bold mb-1">tax-extract</div>
            <div class="text-gray-700">Business<br/>Jan 2025.pdf</div>
          </div>
          <div class="bg-white border-green-600 border-1 rounded-lg px-3 py-2 text-xs text-center w-28 shadow-sm">
            <div class="text-green-600 font-bold mb-1">tax-extract</div>
            <div class="text-gray-700">Business<br/>Feb 2025.pdf</div>
          </div>
          <div class="bg-white border-green-600 border-1 rounded-lg px-3 py-2 text-xs text-center w-28 shadow-sm">
            <div class="text-green-600 font-bold mb-1">tax-extract</div>
            <div class="text-gray-700">Personal<br/>Jan 2025.pdf</div>
          </div>
          <div class="bg-white border-green-600 border-1 rounded-lg px-3 py-2 text-xs text-center w-28 shadow-sm">
            <div class="text-green-600 font-bold mb-1">tax-extract</div>
            <div class="text-gray-700">1099-NEC<br/>Acme Corp</div>
          </div>
        </div>
        <svg class="w-4 h-6" viewBox="0 0 16 24"><path d="M8 0 L8 18 M3 13 L8 18 L13 13" stroke="#16a34a" stroke-width="2" fill="none"/></svg>
        <div class="bg-white border-amber-600 border-1 rounded-lg px-6 py-2 text-sm font-semibold text-gray-900 text-center w-64 shadow-sm">
          <div class="text-amber-600 text-xs uppercase tracking-wide mb-1">Per-File Output</div>
          extractions/*.md
        </div>
        <svg class="w-4 h-6" viewBox="0 0 16 24"><path d="M8 0 L8 18 M3 13 L8 18 L13 13" stroke="#d97706" stroke-width="2" fill="none"/></svg>
        <div class="bg-white border-purple-600 border-2 rounded-lg px-6 py-2 text-sm font-bold text-gray-900 text-center w-64 shadow-sm">
          <div class="text-purple-600 text-xs uppercase tracking-wide mb-1">Aggregate</div>
          raw/*.md (By Category)
        </div>
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
