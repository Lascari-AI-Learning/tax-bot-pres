---
theme: ../
layout: default
clicks: 2
---

<div class="flex flex-col h-full p-6">
  <div class="text-4xl text-center mb-8 text-gray-900 font-bold">Phase 1 — Initialize & Intake</div>

  <div class="max-w-4xl mx-auto grid grid-cols-2 gap-6 w-full mt-4">
    <div :class="$clicks >= 1 ? 'opacity-100' : 'opacity-0'" class="bg-white border-purple-600 border-1 rounded-lg p-6 transition-opacity duration-300">
      <p class="text-xl font-bold text-gray-900 mb-4">Collect All Your Documents</p>
      <ul class="text-sm text-gray-900 space-y-3 list-disc list-inside">
        <li>Bank Statements</li>
        <li>Income (1099s, W-2s, K-1s)</li>
        <li>Health Insurance</li>
        <li>Quarterly Estimates</li>
      </ul>
    </div>
    <div :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0'" class="bg-white border-purple-600 border-1 rounded-lg p-6 transition-opacity duration-300">
      <p class="text-xl font-bold text-gray-900 mb-4">Interview The User</p>
      <ul class="text-sm text-gray-900 space-y-3 list-disc list-inside">
        <li>Who They Are</li>
        <li>What Each Document Is</li>
        <li>Where The Clarity Gaps Are</li>
      </ul>
    </div>
  </div>
</div>
