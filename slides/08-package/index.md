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
        <MotionCanvas src="/animations/08-package.js" />
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
