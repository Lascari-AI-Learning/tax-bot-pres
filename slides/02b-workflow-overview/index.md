---
theme: ../
layout: default
clicks: 5
---

<div class="text-4xl text-center mb-8 text-gray-900 font-bold">How Do We Achieve Both?</div>

<!-- 5 workflow steps -->
<div class="space-y-2">
  <div :class="$clicks >= 1 ? 'opacity-100' : 'opacity-0'" class="bg-white border-gray-400 border-1 rounded px-3 py-2 flex items-center gap-3 transition-opacity duration-300">
    <div class="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">1</div>
    <p class="text-sm text-gray-900"><span class="font-bold">Intake</span> — Understand Who The Person Is And Everything They Have</p>
  </div>
  <div :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0'" class="bg-white border-gray-400 border-1 rounded px-3 py-2 flex items-center gap-3 transition-opacity duration-300">
    <div class="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">2</div>
    <p class="text-sm text-gray-900"><span class="font-bold">Extract</span> — Process All Documents With Context Of Who They Are</p>
  </div>
  <div :class="$clicks >= 3 ? 'opacity-100' : 'opacity-0'" class="bg-white border-gray-400 border-1 rounded px-3 py-2 flex items-center gap-3 transition-opacity duration-300">
    <div class="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">3</div>
    <p class="text-sm text-gray-900"><span class="font-bold">Review</span> — Clarify Unknowns And Ambiguous Items</p>
  </div>
  <div :class="$clicks >= 4 ? 'opacity-100' : 'opacity-0'" class="bg-white border-gray-400 border-1 rounded px-3 py-2 flex items-center gap-3 transition-opacity duration-300">
    <div class="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">4</div>
    <p class="text-sm text-gray-900"><span class="font-bold">Package</span> — Output A Digestible Format For Handoff</p>
  </div>
  <div :class="$clicks >= 5 ? 'opacity-100' : 'opacity-0'" class="bg-white border-amber-500 border-1 rounded px-3 py-2 flex items-center gap-3 transition-opacity duration-300">
    <div class="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm shrink-0">5</div>
    <p class="text-sm text-gray-900"><span class="font-bold">File</span> — File It Yourself <span class="text-gray-500">(Or Have Your AI Or CPA File It For You)</span></p>
  </div>
</div>

<!--
Bridge slide between the two problems (quality + trust) and the architecture walkthrough. This gives the audience a mental map of the five phases before we dive into each one. Initialize: understand the person and their full financial picture. Extract: process every document with the context of who they are. Review: surface unknowns and ambiguities for human clarification. Package: output something digestible — for us, an Excel file. Hand off (optional): either file the return yourself or send to a CPA, where the prep work is already done and there's very little left to review.
-->
