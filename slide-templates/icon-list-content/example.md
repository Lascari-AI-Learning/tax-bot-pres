---
theme: ../
layout: default
clicks: 2
---

# Icon List Content Template

<div class="space-y-12 pt-4">
  <div class="flex flex-col space-y-2">
    <div class="flex flex-row items-center space-x-4">
      <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      </div>
      <h2 class="text-2xl font-bold">First Section</h2>
    </div>
    <div class="flex flex-col space-y-2">
      <ul class="list-disc list-inside text-lg ml-16">
        <li>First bullet point with <span class="text-blue-600 font-semibold">highlighted text</span></li>
        <li>Second bullet point explaining the concept</li>
      </ul>
    </div>
  </div>
  <div v-if="$clicks >= 1" class="flex flex-col space-y-2">
    <div class="flex flex-row items-center space-x-4">
      <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h2 class="text-2xl font-bold">Second Section</h2>
    </div>
    <div class="flex flex-col space-y-2">
      <ul class="list-disc list-inside text-lg ml-16">
        <li>Another point with <span class="text-emerald-600 font-semibold">emphasis</span></li>
        <li>Supporting details go here</li>
      </ul>
    </div>
  </div>
  <div v-if="$clicks >= 2" class="flex flex-col space-y-2">
    <div class="flex flex-row items-center space-x-4">
      <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
        </svg>
      </div>
      <h2 class="text-2xl font-bold">Third Section</h2>
    </div>
    <div class="flex flex-col space-y-2">
      <ul class="list-disc list-inside text-lg ml-16">
        <li>Final point with <span class="text-purple-600 font-semibold">key term</span></li>
        <li>Concluding thought</li>
      </ul>
    </div>
  </div>
</div>
