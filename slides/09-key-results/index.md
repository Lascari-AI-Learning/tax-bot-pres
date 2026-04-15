---
theme: ../
layout: default
clicks: 3
---

<div class="text-4xl text-center mb-8 text-gray-900 font-bold">Why This Is Different</div>

<div class="grid grid-cols-3 gap-6">
<div v-if="$clicks >= 1" class="bg-white border-green-600 border-1 rounded-lg p-5">
  <div class="flex items-center gap-2 mb-3">
    <div class="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
      </svg>
    </div>
    <div>
      <p class="text-xl font-bold text-gray-900">Grows With You</p>
    </div>
  </div>
  <ul class="text-sm text-gray-900 space-y-2">
    <li>Adapts To Your Changing Situation Year-Over-Year</li>
    <li>Add New Document Types With One Command</li>
    <li><span class="font-bold">YOUR</span> System, <span class="font-bold">YOUR</span> Rules</li>
  </ul>
</div>
<div v-if="$clicks >= 2" class="bg-white border-blue-600 border-1 rounded-lg p-5">
  <div class="flex items-center gap-2 mb-3">
    <div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </div>
    <div>
      <p class="text-xl font-bold text-gray-900">Uses What You Have</p>
    </div>
  </div>
  <ul class="text-sm text-gray-900 space-y-2">
    <li>Runs On Your Existing Claude Subscription</li>
    <li>No Monthly SaaS Fees</li>
    <li><span class="font-bold">YOU OWN</span> The Code</li>
  </ul>
</div>
<div v-if="$clicks >= 3" class="bg-white border-orange-600 border-1 rounded-lg p-5">
  <div class="flex items-center gap-2 mb-3">
    <div class="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </div>
    <div>
      <p class="text-xl font-bold text-gray-900">30 Minutes, Not Weeks</p>
    </div>
  </div>
  <ul class="text-sm text-gray-900 space-y-2">
    <li>Replaces Hours Of Manual Organizing</li>
    <li>Eliminates Weeks Of CPA Back-And-Forth</li>
    <li>~30 Minutes Of <span class="font-bold">YOUR</span> Involvement</li>
  </ul>
</div>
</div>