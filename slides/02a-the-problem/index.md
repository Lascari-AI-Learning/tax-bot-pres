---
theme: ../
layout: default
clicks: 2
---

<div class="text-4xl text-center mb-8 text-gray-900 font-bold">So What Do We Actually Need To Solve?</div>

<div class="grid grid-cols-2 gap-10">
  <div :class="$clicks >= 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'" class="bg-white border-emerald-600 border-2 rounded-lg px-8 pt-4 pb-8 transition-opacity duration-300">
    <p class="text-xl font-bold text-emerald-600 mb-6">Quality</p>
    <ul class="text-base text-gray-900 space-y-4 leading-relaxed">
      <li><span class="font-bold">MULTIPLE ACCOUNTS</span>, Each With Their Own Document Formats</li>
      <li>W-2s, 1099s, K-1s, Brokerage Statements, Mortgage Interest, <span class="font-bold">ALL OF IT</span></li>
      <li>The Agent Has To <span class="font-bold">READ AND RECONCILE</span> Every Piece</li>
      <li>Miss One Number And The Whole Return Is <span class="font-bold">WRONG</span></li>
    </ul>
  </div>
  <div :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'" class="bg-white border-blue-600 border-2 rounded-lg px-8 pt-4 pb-8 transition-opacity duration-300">
    <p class="text-xl font-bold text-blue-600 mb-6">Trust</p>
    <ul class="text-base text-gray-900 space-y-4 leading-relaxed">
      <li>You Need To Know Nothing Was <span class="font-bold">MISSED OR MISHANDLED</span></li>
      <li>When Something Looks Off, You Need To <span class="font-bold">SEE WHAT IT DID</span></li>
      <li><span class="font-bold">TRACEABILITY</span> Into Every Step So You Can Correct It</li>
      <li>Without That, You're Right Back To The <span class="font-bold">OLD WAY</span></li>
    </ul>
  </div>
</div>

<!--
Two problems we have to solve for this to be worth building. First, quality — the agent has to actually understand the full picture across every account and every document format. Tax docs are messy and inconsistent; miss one number and the whole return is wrong. Second, trust — the user needs confidence that nothing was missed or mishandled, AND when something looks off they need to be able to look inside the system and see exactly what it did, so they can correct it. These two requirements — quality and traceability — are what shape the architecture we're about to walk through.
-->
