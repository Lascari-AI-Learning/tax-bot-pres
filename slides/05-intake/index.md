---
theme: ../
layout: default
clicks: 4
---

<div class="flex flex-col h-full p-2">
  <div class="text-3xl text-center mb-4 text-gray-900 font-bold">Phase 1 — Intake</div>
  <div class="flex-1 min-h-0 relative">
    <div
      class="h-full flex items-center justify-center transition-all duration-500"
      :class="$clicks < 1 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'"
    >
      <div class="relative inline-block pr-20">
        <div class="flex flex-col items-center gap-2">
          <div class="bg-white border-blue-600 border-2 rounded-lg px-6 py-3 text-sm font-bold text-gray-900 text-center w-56 shadow-sm">
            Read Source Docs
          </div>
          <svg class="w-4 h-6" viewBox="0 0 16 24"><path d="M8 0 L8 18 M3 13 L8 18 L13 13" stroke="#2563eb" stroke-width="2" fill="none"/></svg>
          <div class="bg-white border-green-600 border-2 rounded-lg px-6 py-3 text-sm font-bold text-gray-900 text-center w-56 shadow-sm">
            Ask User Question
          </div>
          <svg class="w-4 h-6" viewBox="0 0 16 24"><path d="M8 0 L8 18 M3 13 L8 18 L13 13" stroke="#16a34a" stroke-width="2" fill="none"/></svg>
          <div class="bg-white border-purple-600 border-2 rounded-lg px-6 py-3 text-sm font-bold text-gray-900 text-center w-56 shadow-sm">
            User Answers
          </div>
          <svg class="w-4 h-6" viewBox="0 0 16 24"><path d="M8 0 L8 18 M3 13 L8 18 L13 13" stroke="#9333ea" stroke-width="2" fill="none"/></svg>
          <div class="bg-white border-orange-600 border-2 rounded-lg px-6 py-3 text-sm font-bold text-gray-900 text-center w-56 shadow-sm">
            Update intake.md
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
          { command: '/cpa-tax-prep:intake 2025', output: 'Pre-reading source documents...\nFound 5 documents across 4 categories.\n\nStarting 9-section interview...\n\nSection 1: Filer Info\nTo start, can you tell me your full name,\nfiling status, and business structure?' }
        ]"
        title="claude — bash"
        shell="bash"
        :height="260"
        :clicks="$clicks"
      />
    </div>
    <div
      class="h-full transition-all duration-500"
      :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'"
    >
      <FileExplorer
        v-if="$clicks >= 2 && $clicks < 3"
        key="intake-0"
        dir="05-intake/filetree/state-0"
        :expandDepth="1"
        defaultFile="intake.md"
      />
      <FileExplorer
        v-if="$clicks >= 3 && $clicks < 4"
        key="intake-1"
        dir="05-intake/filetree/state-1"
        :expandDepth="1"
        defaultFile="intake.md"
      />
      <FileExplorer
        v-if="$clicks >= 4"
        key="intake-2"
        dir="05-intake/filetree/state-2"
        :expandDepth="1"
        defaultFile="intake.md"
      />
    </div>
  </div>
</div>
