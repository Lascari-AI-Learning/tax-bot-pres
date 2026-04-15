---
theme: ../
layout: default
clicks: 4
---

<div class="flex flex-col h-full p-2">
  <div class="flex-1 min-h-0 relative">
    <div
      class="h-full flex items-center justify-center transition-all duration-500"
      :class="$clicks < 1 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'"
    >
      <div class="w-full max-w-5xl">
        <MotionCanvas src="/animations/05-intake.js" />
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
