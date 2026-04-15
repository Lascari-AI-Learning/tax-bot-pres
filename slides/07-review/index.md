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
        <MotionCanvas src="/animations/07-review.js" />
      </div>
    </div>
    <div
      class="max-w-2xl mx-auto transition-all duration-500"
      :class="$clicks >= 1 && $clicks < 2 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'"
    >
      <Terminal
        :lines="[
          { command: '/cpa-tax-prep:review 2025', output: 'Loading raw/ category files...\nFound 5 sections to review.\n\nSection 1: Income 2025\nHere is what I extracted for income:\n\n  Acme Corp (1099-NEC): $145,000\n  Stripe (side project): $8,200\n  Savings interest: $342\n  Total: $153,542\n\nDoes this look correct? Any adjustments?' }
        ]"
        title="claude — bash"
        shell="bash"
        :height="340"
        :clicks="$clicks"
      />
    </div>
    <div
      class="h-full transition-all duration-500"
      :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'"
    >
      <FileExplorer
        v-if="$clicks >= 2"
        dir="07-review/filetree/tax-2025"
        :folderState="{ 'source-documents': false, 'write-up': true, 'extractions': false, 'raw': false, 'final': true }"
        defaultFile="Income 2025.md"
      />
    </div>
  </div>
</div>
