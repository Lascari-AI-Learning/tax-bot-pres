---
theme: ../
layout: default
clicks: 2
---

<div class="flex flex-col h-full p-2">
  <div class="text-3xl text-center mb-4 text-gray-900 font-bold">Phase 3 — Review</div>
  <div class="flex-1 min-h-0 relative">
    <div
      class="h-full flex items-center justify-center transition-all duration-500"
      :class="$clicks < 1 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'"
    >
      <div class="relative inline-block pr-20">
        <div class="flex flex-col items-center gap-2">
          <div class="bg-white border-amber-600 border-2 rounded-lg px-6 py-3 text-sm font-bold text-gray-900 text-center w-56 shadow-sm">
            Read Section
          </div>
          <svg class="w-4 h-6" viewBox="0 0 16 24"><path d="M8 0 L8 18 M3 13 L8 18 L13 13" stroke="#d97706" stroke-width="2" fill="none"/></svg>
          <div class="bg-white border-blue-600 border-2 rounded-lg px-6 py-3 text-sm font-bold text-gray-900 text-center w-56 shadow-sm">
            Present To User
          </div>
          <svg class="w-4 h-6" viewBox="0 0 16 24"><path d="M8 0 L8 18 M3 13 L8 18 L13 13" stroke="#2563eb" stroke-width="2" fill="none"/></svg>
          <div class="bg-white border-green-600 border-2 rounded-lg px-6 py-3 text-sm font-bold text-gray-900 text-center w-56 shadow-sm">
            User Confirms / Corrects
          </div>
          <svg class="w-4 h-6" viewBox="0 0 16 24"><path d="M8 0 L8 18 M3 13 L8 18 L13 13" stroke="#16a34a" stroke-width="2" fill="none"/></svg>
          <div class="bg-white border-purple-600 border-2 rounded-lg px-6 py-3 text-sm font-bold text-gray-900 text-center w-56 shadow-sm">
            Update final/
          </div>
        </div>
        <svg class="absolute" style="top: 0; right: 8px; width: 64px; height: 100%" viewBox="0 0 64 400" preserveAspectRatio="none">
          <path d="M0 380 L24 380 C 40 380, 48 372, 48 356 L 48 44 C 48 28, 40 20, 24 20 L 0 20"
            stroke="#6b7280" stroke-width="2" fill="none" stroke-dasharray="6,4" vector-effect="non-scaling-stroke"/>
          <path d="M10 13 L0 20 L10 27" stroke="#6b7280" stroke-width="2" fill="none" vector-effect="non-scaling-stroke"/>
        </svg>
        <div class="absolute text-sm font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap" style="right: -100px; top: 50%; transform: translateY(-50%)">Repeat</div>
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
