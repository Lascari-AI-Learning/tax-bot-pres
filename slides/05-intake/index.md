---
theme: ../
layout: default
clicks: 1
---

<div class="flex flex-col h-full p-2">
  <div class="text-3xl text-center mb-4 text-gray-900 font-bold">Step 1 — Input Your Documents</div>

  <div class="flex-1 min-h-0 relative">
    <div
      class="h-full transition-all duration-500"
      :class="$clicks < 1 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'"
    >
      <FileExplorer dir="05-intake/filetree/state-0" :expandDepth="2" />
    </div>
    <div
      class="h-full transition-all duration-500"
      :class="$clicks >= 1 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'"
    >
      <FileExplorer dir="05-intake/filetree/state-docs" :expandDepth="2" />
    </div>
  </div>
</div>
