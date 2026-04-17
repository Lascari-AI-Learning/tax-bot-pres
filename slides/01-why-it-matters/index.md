---
theme: ../
layout: default
clicks: 2
---

<div class="text-4xl text-center mb-8 text-gray-900 font-bold">What We're Going To Talk About Today</div>

<div class="grid grid-cols-2 gap-10">
  <div :class="$clicks >= 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'" class="bg-white border-purple-600 border-2 rounded-lg px-8 pt-4 pb-8 transition-opacity duration-300">
    <p class="text-xl font-bold text-gray-900 mb-6">How To <span class="text-purple-600">DECOMPOSE</span> A Real Problem Into An Agentic System</p>
    <ul class="text-base text-gray-900 space-y-4 leading-relaxed">
      <li>What Are The <span class="font-bold">STEPS</span> You Need To Do?</li>
      <li>What <span class="font-bold">AGENTS</span> Do You Need To Do This?</li>
      <li>How Does The <span class="font-bold">PROCESS</span> Flow?</li>
      <li>How To Represent This In A <span class="font-bold">FILE SYSTEM</span>?</li>
    </ul>
  </div>
  <div :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'" class="bg-white border-blue-600 border-2 rounded-lg px-8 pt-4 pb-8 transition-opacity duration-300">
    <p class="text-xl font-bold text-gray-900 mb-6">Taxes Are <span class="text-blue-600">MESSY</span>, High-Stakes, And Everyone Has To Do Them</p>
    <ul class="text-base text-gray-900 space-y-4 leading-relaxed">
      <li><span class="font-bold">MULTIPLE INCOME STREAMS</span>, Accounts, And Moving Parts To Pull Together</li>
      <li>Done Right, You Can <span class="font-bold">SAVE A LOT OF MONEY</span></li>
      <li>If Audited, You Need <span class="font-bold">TRACEABILITY</span> To Justify Or Correct</li>
    </ul>
  </div>
</div>

<!--
Frame it as: the real lesson is how to decompose a messy real-world problem into an agentic system — steps, agents, processes, and how it all lives in a file system. Taxes are a great stress test because there's a lot to pull together — multiple income streams, multiple accounts, lots of moving parts — and it applies to anyone, not just entrepreneurs. Do it right and you save real money. Do it poorly and, if you get audited, you need traceability to justify what you did or correct it.
-->
