---
theme: ../
layout: default
clicks: 2
---

<div class="flex flex-col h-full p-2">
  <div class="text-3xl text-center mb-4 text-gray-900 font-bold">Phase 4 — Package</div>
  <div class="flex-1 min-h-0 relative">
    <div
      class="h-full flex items-center justify-center transition-all duration-500"
      :class="$clicks < 1 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'"
    >
      <div class="flex flex-col items-center gap-2">
        <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Stage 1 — Parallel Subagents</div>
        <div class="flex gap-2">
          <div class="bg-white border-purple-600 border-1 rounded-lg px-3 py-2 text-xs text-center w-28 shadow-sm">
            <div class="text-purple-600 font-bold mb-1">tax-package</div>
            <div class="text-gray-700">Income</div>
          </div>
          <div class="bg-white border-purple-600 border-1 rounded-lg px-3 py-2 text-xs text-center w-28 shadow-sm">
            <div class="text-purple-600 font-bold mb-1">tax-package</div>
            <div class="text-gray-700">Bus. Expenses</div>
          </div>
          <div class="bg-white border-purple-600 border-1 rounded-lg px-3 py-2 text-xs text-center w-28 shadow-sm">
            <div class="text-purple-600 font-bold mb-1">tax-package</div>
            <div class="text-gray-700">Deductions</div>
          </div>
          <div class="bg-white border-purple-600 border-1 rounded-lg px-3 py-2 text-xs text-center w-28 shadow-sm">
            <div class="text-purple-600 font-bold mb-1">tax-package</div>
            <div class="text-gray-700">Est. Taxes</div>
          </div>
        </div>
        <svg class="w-4 h-5" viewBox="0 0 16 20"><path d="M8 0 L8 14 M3 10 L8 15 L13 10" stroke="#9333ea" stroke-width="2" fill="none"/></svg>
        <div class="bg-white border-purple-600 border-1 rounded-lg px-6 py-2 text-sm font-semibold text-gray-900 text-center w-56 shadow-sm">
          output/sections/*.json
        </div>
        <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-2">Stage 2 — Sequential Pipeline</div>
        <div class="flex items-center gap-3">
          <div class="bg-white border-blue-600 border-1 rounded-lg px-3 py-2 text-xs font-semibold text-center shadow-sm">
            <span class="text-blue-600">merge_sections.py</span>
          </div>
          <svg class="w-5 h-4" viewBox="0 0 20 16"><path d="M0 8 L14 8 M10 4 L15 8 L10 12" stroke="#2563eb" stroke-width="2" fill="none"/></svg>
          <div class="bg-white border-green-600 border-1 rounded-lg px-3 py-2 text-xs font-semibold text-center shadow-sm">
            <span class="text-green-600">build_xlsx.py</span>
          </div>
          <svg class="w-5 h-4" viewBox="0 0 20 16"><path d="M0 8 L14 8 M10 4 L15 8 L10 12" stroke="#16a34a" stroke-width="2" fill="none"/></svg>
          <div class="bg-white border-orange-600 border-1 rounded-lg px-3 py-2 text-xs font-semibold text-center shadow-sm">
            <span class="text-orange-600">validate_xlsx.py</span>
          </div>
        </div>
        <svg class="w-4 h-5" viewBox="0 0 16 20"><path d="M8 0 L8 14 M3 10 L8 15 L13 10" stroke="#d97706" stroke-width="2" fill="none"/></svg>
        <div class="bg-white border-amber-600 border-2 rounded-lg px-6 py-3 text-sm font-bold text-gray-900 text-center w-64 shadow-sm">
          <div class="text-amber-600 text-xs uppercase tracking-wide mb-1">Final Output</div>
          tax_data.json + xlsx + summary
        </div>
      </div>
    </div>
    <div
      class="max-w-2xl mx-auto transition-all duration-500"
      :class="$clicks >= 1 && $clicks < 2 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'"
    >
      <Terminal
        :lines="[
          { command: '/cpa-tax-prep:package 2025', output: 'Reading final/ reviewed files...\nFound 5 sections to package.\n\nStage 1: Spawning parallel packagers:\n  → tax-package: Income 2025.md → income.json\n  → tax-package: Expenses Business 2025.md → business_expenses.json\n  → tax-package: Personal Deductions 2025.md → personal_deductions.json\n  → tax-package: Estimated Taxes 2025.md → estimated_taxes.json\n  → tax-package: Health Insurance 2025.md → health_insurance.json\n✓ 5/5 section JSONs written\n\nStage 2: Running assembly pipeline:\n  → merge_sections.py → 2025_tax_data.json\n  → build_xlsx.py → 2025 CPA Tax Package.xlsx\n  → validate_xlsx.py → ✓ 8 tabs, all valid\n\n✓ Package complete. Output in write-up/output/' }
        ]"
        title="claude — bash"
        shell="bash"
        :height="460"
        :clicks="$clicks"
      />
    </div>
    <div
      class="h-full transition-all duration-500"
      :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'"
    >
      <FileExplorer
        v-if="$clicks >= 2"
        dir="08-package/filetree/tax-2025"
        :folderState="{ 'source-documents': false, 'write-up': true, 'extractions': false, 'raw': false, 'final': false, 'output': true, 'sections': true }"
        defaultFile="2025 CPA Summary.md"
      />
    </div>
  </div>
</div>
