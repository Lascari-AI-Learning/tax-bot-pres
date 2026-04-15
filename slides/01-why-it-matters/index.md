---
theme: ../
layout: center
clicks: 5
---

<div class="text-4xl text-center mb-2 text-gray-900 font-bold">Why It Matters</div>
<div class="text-lg text-center mb-6 text-gray-700">Two Problems, One Playbook</div>

<div class="grid grid-cols-2 gap-6 mb-6">
  <div :class="$clicks >= 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'" class="bg-white border-blue-600 border-2 rounded-lg p-5 transition-opacity duration-300">
    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">The Surface Problem</div>
    <p class="text-xl font-bold text-gray-900 mb-3">Taxes Are <span class="text-blue-600">MESSY</span> And High-Stakes</p>
    <ul class="text-sm text-gray-900 space-y-2">
      <li :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0'" class="transition-opacity duration-300">Multiple Income Streams, Not A Simple W-2</li>
      <li :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0'" class="transition-opacity duration-300">Situational Deductions Templates <span class="font-bold">MISS</span></li>
      <li :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0'" class="transition-opacity duration-300">Audit Risk Means You Need <span class="font-bold">TRACEABILITY</span></li>
    </ul>
  </div>
  <div :class="$clicks >= 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'" class="bg-white border-purple-600 border-2 rounded-lg p-5 transition-opacity duration-300">
    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">The Real Lesson</div>
    <p class="text-xl font-bold text-gray-900 mb-3">How To <span class="text-purple-600">DECOMPOSE</span> A Real Problem Into An Agentic System</p>
    <ul class="text-sm text-gray-900 space-y-2">
      <li :class="$clicks >= 4 ? 'opacity-100' : 'opacity-0'" class="transition-opacity duration-300">Gather The Data — What Does The System Actually Need?</li>
      <li :class="$clicks >= 4 ? 'opacity-100' : 'opacity-0'" class="transition-opacity duration-300">Design The Flow — Phases, Handoffs, Checkpoints</li>
      <li :class="$clicks >= 4 ? 'opacity-100' : 'opacity-0'" class="transition-opacity duration-300">Decide Where <span class="font-bold">SUB-AGENTS</span> Belong</li>
    </ul>
  </div>
</div>
<div :class="$clicks >= 5 ? 'opacity-100' : 'opacity-0 pointer-events-none'" class="grid grid-cols-5 gap-4 transition-opacity duration-300">
  <div></div>
  <div class="col-span-3 bg-white border-orange-600 border-2 rounded-lg p-4 text-lg text-gray-900 font-bold text-center">
    <p>Taxes Are The Example — The Playbook Is <span class="text-orange-600 text-xl">YOURS TO REUSE</span></p>
  </div>
  <div></div>
</div>

<!--
Frame it as: the tax angle gets the audience's attention (everyone has taxes, high stakes, real nuance). But the transferable skill is decomposition — how to take any messy real-world workflow and stage it into an agent system with clear data gathering, phase design, and sub-agent boundaries. Taxes just happen to be a good stress test because the cost of being wrong is real.
-->
