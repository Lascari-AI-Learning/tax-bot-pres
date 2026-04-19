---
theme: ../
layout: default
---

<div class="flex flex-col h-full p-6">
  <div class="text-4xl text-center mb-8 text-gray-900 font-bold">Phase 2 — Extract Every Document</div>

  <div class="grid grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
    <div class="bg-white border-blue-600 border-1 rounded-lg p-6">
      <p class="text-lg font-bold text-blue-600 mb-4">Input</p>
      <ul class="text-sm text-gray-900 space-y-3 list-disc list-inside">
        <li>PDF Statements</li>
        <li>CSV Exports</li>
        <li>Scanned Images & Receipts</li>
        <li>1099s, K-1s, Brokerage Docs</li>
      </ul>
      <p class="text-xs text-gray-900 mt-4">Agents Read <span class="font-bold">RAW TEXT</span> Best — Everything Gets Parsed To Markdown.</p>
    </div>
    <div class="bg-white border-amber-600 border-1 rounded-lg p-6">
      <p class="text-lg font-bold text-amber-600 mb-4">Spawn</p>
      <ul class="text-sm text-gray-900 space-y-3 list-disc list-inside">
        <li>One <span class="font-bold">SUBAGENT</span> Per Document</li>
        <li>Each Gets Its Own Context Window</li>
        <li>No Cross-Doc Contamination</li>
        <li>Agent Never <span class="font-bold">FORGETS</span> Mid-File</li>
      </ul>
    </div>
    <div class="bg-white border-emerald-600 border-1 rounded-lg p-6">
      <p class="text-lg font-bold text-emerald-600 mb-4">Aggregate</p>
      <ul class="text-sm text-gray-900 space-y-3 list-disc list-inside">
        <li>Group Extractions By <span class="font-bold">SECTION</span></li>
        <li>Income, Business, Personal, Credits</li>
        <li>Collapse Into Clean Category Files</li>
        <li>Ready For Review</li>
      </ul>
    </div>
  </div>
</div>

<!--
This is the extract phase. We need to take every document the user dropped in — PDFs, CSVs, scanned receipts — and parse them into markdown, because that's what agents read best, especially the coding ones. The catch is context window pollution: one statement can burn 28,000 tokens, and if you hand a hundred documents to a single agent, it'll be slow and make mistakes. So we spawn one agent per document, give each of them the PDF and CSV skills, and let them produce clean structured markdown in parallel.
-->
