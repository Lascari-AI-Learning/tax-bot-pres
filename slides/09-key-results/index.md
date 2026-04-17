---
theme: ../
layout: default
clicks: 3
---

<div class="text-4xl text-center mb-8 text-gray-900 font-bold">The Real Takeaways</div>

<div class="grid grid-cols-3 gap-6">
  <div :class="$clicks >= 1 ? 'opacity-100' : 'opacity-0'" class="bg-white border-purple-600 border-2 rounded-lg p-5 transition-opacity duration-300">
    <div class="flex items-center gap-2 mb-3">
      <div class="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h6"></path>
        </svg>
      </div>
      <p class="text-xl font-bold text-gray-900">Decompose The Problem</p>
    </div>
    <ul class="text-sm text-gray-900 space-y-2">
      <li><span class="font-bold">STEPS</span> — What Has To Happen, In Order</li>
      <li><span class="font-bold">AGENTS</span> — Who Does Each Step</li>
      <li><span class="font-bold">PROCESS</span> — How They Hand Off</li>
      <li><span class="font-bold">FILES</span> — Where The State Lives</li>
    </ul>
  </div>
  <div :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0'" class="bg-white border-blue-600 border-2 rounded-lg p-5 transition-opacity duration-300">
    <div class="flex items-center gap-2 mb-3">
      <div class="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
      </div>
      <p class="text-xl font-bold text-gray-900">Traceability Is The Unlock</p>
    </div>
    <ul class="text-sm text-gray-900 space-y-2">
      <li>Every Step Writes To <span class="font-bold">DISK</span></li>
      <li>The File System <span class="font-bold">IS</span> The Audit Trail</li>
      <li>Inspect, Debug, And Correct Any Stage</li>
      <li>No Black Boxes On Something This <span class="font-bold">IMPORTANT</span></li>
    </ul>
  </div>
  <div :class="$clicks >= 3 ? 'opacity-100' : 'opacity-0'" class="bg-white border-emerald-600 border-2 rounded-lg p-5 transition-opacity duration-300">
    <div class="flex items-center gap-2 mb-3">
      <div class="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
        </svg>
      </div>
      <p class="text-xl font-bold text-gray-900">Bespoke Beats Generic</p>
    </div>
    <ul class="text-sm text-gray-900 space-y-2">
      <li>Grows With <span class="font-bold">YOUR</span> Situation Year-Over-Year</li>
      <li>Runs On Your Existing Claude Subscription</li>
      <li><span class="font-bold">YOU OWN</span> The Code And The Outcome</li>
    </ul>
  </div>
</div>

<!--
Close the loop on the opening slide. We said this talk was about two things: how to decompose a real problem into an agentic system, and why taxes are a great stress test for it. You just saw the four phases — intake, extract, review, package — but the real lesson isn't the tax pipeline. It's the pattern. Any messy, high-stakes problem breaks down the same way: what are the steps, who are the agents, how does the process flow, and how do you represent that state on disk. Traceability is what turns that decomposition from a toy into something you can actually trust — because the file system is the audit trail. And because you own the decomposition, the system molds to your situation, not the average case. That's the takeaway. Own the build, own the outcome.
-->
