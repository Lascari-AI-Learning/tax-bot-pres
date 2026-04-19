---
theme: ../
layout: default
---

<div class="flex flex-col h-full p-6">
  <div class="text-4xl text-center mb-8 text-gray-900 font-bold">Phase 4 — Package For Filing</div>
  <div class="grid grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
    <div class="bg-white border-blue-600 border-1 rounded-lg p-6">
      <p class="text-lg font-bold text-blue-600 mb-4">Package</p>
      <ul class="text-sm text-gray-900 space-y-3 list-disc list-inside">
        <li>Each Final Section → Its Own <span class="font-bold">JSON BLOCK</span></li>
        <li>Parallel Subagents Convert Markdown Into Structured Data</li>
        <li>Falls Back To <span class="font-bold">MARKDOWN</span> If XLSX Isn't Available</li>
      </ul>
    </div>
    <div class="bg-white border-amber-600 border-1 rounded-lg p-6">
      <p class="text-lg font-bold text-amber-600 mb-4">Build</p>
      <ul class="text-sm text-gray-900 space-y-3 list-disc list-inside">
        <li>Runs A <span class="font-bold">MERGE SCRIPT</span> To Combine All Section JSONs</li>
        <li>Builds Everything Into One Spreadsheet — Eight Tabs</li>
        <li>Deterministic, Reproducible, Yours To Edit</li>
      </ul>
    </div>
    <div class="bg-white border-emerald-600 border-1 rounded-lg p-6">
      <p class="text-lg font-bold text-emerald-600 mb-4">Validate</p>
      <ul class="text-sm text-gray-900 space-y-3 list-disc list-inside">
        <li>Inspects The Generated Script For <span class="font-bold">CORRECTNESS</span></li>
        <li>Confirms Every Number Matches The Source Markdown</li>
        <li>No Drift, No Silent Errors</li>
      </ul>
    </div>
  </div>
</div>

<!--
Now we have the final reviewed markdown — clean, accurate, section by section. But you can't hand a CPA a folder of markdown files; they need a spreadsheet. So we package. Each reviewed section gets converted into its own JSON block, in parallel, then merged into one structure. I set this up to emit markdown too in case a spreadsheet isn't an option — same data, different format. Then make writes a Python script that builds the actual xlsx with eight tabs. And because we're generating code that touches your numbers, there's a validation layer that cross-checks every value against the source markdown before anything gets handed off. If something drifts, the build fails loud — not silently.
-->
