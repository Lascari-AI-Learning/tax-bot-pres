---
theme: ../
layout: default
clicks: 2
---

<div class="text-4xl text-center mb-6 text-gray-900 font-bold">"But Doesn't Claude Already Do This?"</div>
<div class="grid grid-cols-12 gap-4">
  <div class="col-span-5 flex items-center justify-center">
    <img
      src="./assets/turbotax-plugin-tweet.png"
      alt="Claude TurboTax plugin announcement tweet"
      class="rounded-lg shadow-lg border border-gray-300 max-h-[420px] object-contain"
    />
  </div>
  <div class="col-span-7 flex flex-col gap-4">
    <div :class="$clicks >= 1 ? 'opacity-100' : 'opacity-0'" class="bg-white border-blue-600 border-1 rounded-lg p-4 transition-opacity duration-300">
      <div class="text-sm font-bold text-blue-600 uppercase tracking-wide mb-2">Works When Simple, Breaks When Complex</div>
      <ul class="text-base text-gray-900 space-y-1 list-disc list-inside">
        <li>Fine For A Basic W-2 Return</li>
        <li>Add Multiple Accounts, A Business, A Mortgage, Kids</li>
        <li>People Said It Just <span class="font-bold">WASN'T WORKING</span></li>
      </ul>
    </div>
    <div :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0'" class="bg-white border-red-600 border-2 rounded-lg p-4 transition-opacity duration-300">
      <div class="text-sm font-bold text-red-600 uppercase tracking-wide mb-2">The Real Problem</div>
      <ul class="text-base text-gray-900 space-y-1 list-disc list-inside">
        <li>On Something This Important, You Need To Know <span class="font-bold">WHY</span> It Broke</li>
        <li>One Agent Doing Everything = <span class="font-bold">NO VISIBILITY</span></li>
        <li><span class="font-bold">NO TRACEABILITY</span> Means You Can't Debug It</li>
        <li>You Just Go Back To The <span class="font-bold">OLD WAY</span></li>
      </ul>
    </div>
  </div>
</div>

<!--
Acknowledge the elephant: Claude shipped a TurboTax plugin. For an average user, that makes the tax angle moot. The point of this talk is NOT that you can't do taxes any other way — it's that when the stakes are real (multiple income streams, business nuance, audit exposure), you want a custom system you can inspect. Traceability is the word. A plugin doesn't hand you a paper trail. A system you design does. That's the whole reason to learn how to decompose one.

Tweet: Henry Shi (@henryfthe9ths), April 11 2026 — announcing Claude's TurboTax / Aiwyn (formerly Column Tax) connector.
-->
