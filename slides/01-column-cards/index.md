---
theme: ../
layout: default
clicks: 3
---

<div class="text-4xl text-center mb-12 text-gray-900 font-bold">Available Templates</div>

<div class="grid grid-cols-3 gap-6">
<!-- TITLE & ABOUT -->
<div v-if="$clicks >= 1" class="bg-gradient-to-b from-gray-50 to-gray-100 px-5 py-4 rounded-lg shadow-lg border-1 border-gray-400">
  <div class="flex items-center gap-2 mb-3">
    <div class="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
      </svg>
    </div>
    <p class="text-2xl font-bold">Title & About</p>
  </div>
  <div class="space-y-3 text-left">
    <div class="space-y-1">
      <p class="text-xs font-semibold text-purple-600 uppercase tracking-wide">Opening Slides</p>
      <ul class="text-sm space-y-1">
        <li>title</li>
        <li>about-me (speaker)</li>
        <li>column-cards</li>
      </ul>
    </div>
  </div>
</div>

<!-- CONTENT -->
<div v-if="$clicks >= 2" class="bg-gradient-to-b from-gray-50 to-gray-100 px-5 py-4 rounded-lg shadow-lg border-1 border-gray-400">
  <div class="flex items-center gap-2 mb-3 justify-center">
    <div class="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
      </svg>
    </div>
    <p class="text-2xl font-bold">Content</p>
  </div>
  <div class="space-y-3 text-left">
    <div class="space-y-1">
      <p class="text-xs font-semibold text-sky-600 uppercase tracking-wide">Main Content</p>
      <ul class="text-sm space-y-1">
        <li>icon-list-content</li>
        <li>three-to-one-takeaway</li>
      </ul>
    </div>
  </div>
</div>

<!-- DIAGRAMS -->
<div v-if="$clicks >= 3" class="bg-gradient-to-b from-gray-50 to-gray-100 px-5 py-4 rounded-lg shadow-lg border-1 border-gray-400">
  <div class="flex items-center gap-2 mb-3">
    <div class="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
      </svg>
    </div>
    <p class="text-2xl font-bold">Diagrams</p>
  </div>
  <div class="space-y-3 text-left">
    <div class="space-y-1">
      <p class="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Visual Templates</p>
      <ul class="text-sm space-y-1">
        <li>continuum-diagram</li>
        <li>continuum-middle-ground</li>
        <li>extremes-to-middle</li>
      </ul>
    </div>
  </div>
</div>
</div>
