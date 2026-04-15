---
theme: ../
layout: default
clicks: 3
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
      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">For The Average W-2 Filer</div>
      <p class="text-sm text-gray-900">The Plugin Is Fine — A Simple Return Is A Simple Return</p>
    </div>
    <div :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0'" class="bg-white border-amber-600 border-2 rounded-lg p-4 transition-opacity duration-300">
      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">But If Your Situation Is Complex</div>
      <ul class="text-sm text-gray-900 space-y-1">
        <li>Multiple Income Streams, Business Structure Nuance</li>
        <li>Out-Of-The-Box Tools Don't Model <span class="font-bold">YOU</span></li>
        <li>Audit Risk Goes Up — So Does The Cost Of A Wrong Answer</li>
      </ul>
    </div>
    <div :class="$clicks >= 3 ? 'opacity-100' : 'opacity-0'" class="bg-white border-purple-600 border-2 rounded-lg p-4 transition-opacity duration-300">
      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Why Custom Wins Here</div>
      <p class="text-sm text-gray-900"><span class="font-bold">TRACEABILITY</span> — Every Number Ties Back To A Source Doc. A Plugin Gives You An Answer; A System You Built Gives You An Answer You Can <span class="font-bold">TRUST</span> And <span class="font-bold">DEFEND</span>.</p>
    </div>
  </div>
</div>

<!--
Acknowledge the elephant: Claude shipped a TurboTax plugin. For an average user, that makes the tax angle moot. The point of this talk is NOT that you can't do taxes any other way — it's that when the stakes are real (multiple income streams, business nuance, audit exposure), you want a custom system you can inspect. Traceability is the word. A plugin doesn't hand you a paper trail. A system you design does. That's the whole reason to learn how to decompose one.

Tweet: Henry Shi (@henryfthe9ths), April 11 2026 — announcing Claude's TurboTax / Aiwyn (formerly Column Tax) connector.
-->
