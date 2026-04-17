---
theme: ../
layout: default
clicks: 1
---

<script setup>
const h = (t) => `<span class="text-blue-400">${t}</span>`
const g = (t) => `<span class="text-green-400">${t}</span>`
const warn = (t) => `<span class="text-yellow-400">${t}</span>`
const ask = (t) => `<span class="text-red-400 font-bold">${t}</span>`
const dim = (t) => `<span class="text-gray-500">${t}</span>`
const hl = (t) => `<span class="text-purple-400">${t}</span>`

const extraction = `${dim('---')}
${hl('source')}: ${dim('"2025 Taxes/source-documents/bank-statements/')}
${dim('        Business Checking (Chase)/July 2025.pdf"')}
${hl('document_type')}: business-statement
${hl('period')}: 2025-07
${hl('status')}: ${g('complete')}
${hl('extracted_at')}: 2026-02-15
${dim('---')}

${h('# Business Checking (Chase) — July 2025')}

${h('## Income / Deposits')}

 Date        Description                      Amount
 ──────────  ───────────────────────────────  ──────────
 2025-07-01  GUSTO PAYROLL — TechStart Inc.   $9,500.00

${g('Total Income: $9,500.00')}

${h('## Expenses')}

${h('### Monthly Recurring')}

 Date        Description                 Category                Amount
 ──────────  ──────────────────────────  ──────────────────────  ────────
 2025-07-01  ANTHROPIC*CLAUDE.AI PRO     Software &amp; Subscriptions  $100.00
 2025-07-01  GITHUB INC.                 Software &amp; Subscriptions    $4.00
 2025-07-01  VERCEL INC.                 Software &amp; Subscriptions   $20.00
 2025-07-03  FIGMA INC.                  Software &amp; Subscriptions   $15.00
 2025-07-05  AMAZON WEB SERVICES         Software &amp; Subscriptions   $48.33
 2025-07-07  GOOGLE*WORKSPACE            Software &amp; Subscriptions   $14.40
 2025-07-07  NOTION LABS INC             Software &amp; Subscriptions   $10.00
 2025-07-09  LINEAR INC.                 Software &amp; Subscriptions    $8.00
 2025-07-09  SLACK TECHNOLOGIES          Software &amp; Subscriptions    $8.75
 2025-07-11  1PASSWORD AGILEBITS         Software &amp; Subscriptions    $7.99
 2025-07-14  OREILLY MEDIA INC           Education &amp; Courses        $39.99
 2025-07-15  TAILWIND LABS INC           Software &amp; Subscriptions   $14.00

${g('Recurring Subtotal: $290.46')}

${h('### One-Time / Notable')}

 Date        Description                 Category                Amount
 ──────────  ──────────────────────────  ──────────────────────  ────────
 2025-07-10  AMAZON.COM*1R8PQ2X          Hardware &amp; Technology    $129.99
 2025-07-18  DOMAIN.COM*RENEWAL          Software &amp; Subscriptions   $14.99

${g('One-Time Subtotal: $144.98')}

${g('Total Expenses: $435.44')}

${h('## Flagged Items')}

${dim('No flagged items this month.')}

${h('## Summary')}

 Category        Amount
 ──────────────  ──────────
 Total Income    $9,500.00
 Total Expenses  $435.44
 Net Cash Flow   ${g('$9,064.56')}`

const questions = `${ask('## Flagged Across All Extractions')}

${h('1. Personal Checking — Mar 2025')}
   VENMO*PAYMENT — RENT $2,100.00
   ${warn('? Paid from personal account — home office deduction?')}
   ${ask('ASK CPA: Deductible via simplified or regular method?')}

${h('2. Personal Checking — Jan 2025')}
   ADOBE*CREATIVE CLOUD $54.99/mo × 6
   ${warn('? Appears in personal account only.')}
   ${warn('Is this a business expense? Which months apply?')}

${h('3. Business Checking — Feb 2025')}
   UPWORK*CONTRACTOR — "Design Work" $2,400.00
   ${warn('? No 1099 issued for this contractor.')}
   ${warn('Need contractor name for records.')}

${h('4. Personal Checking — Multiple')}
   UBER RIDES (12 trips) — $342.00 total
   ${warn('? Mix of personal and business trips.')}
   ${warn('Need trip dates or purposes to separate.')}

${h('5. Business Checking — Jan 2025')}
   STANDING DESK — $849.00 via personal Venmo
   ${ask('ASK CPA: Home office equipment from personal — deductible?')}

${dim('──────────────────────────────────────')}
${warn('5 items flagged')}  |  ${ask('2 need CPA input')}
${dim('These will be resolved in the Review phase.')}`
</script>

<div class="flex gap-4 h-full p-2">
  <div class="flex-1 rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white text-left flex flex-col">
    <div class="flex items-center px-4 py-2 border-b border-gray-200 bg-gray-50 relative">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full" style="background-color: #FF5F56;"></div>
        <div class="w-3 h-3 rounded-full" style="background-color: #FFBD2E;"></div>
        <div class="w-3 h-3 rounded-full" style="background-color: #27C93F;"></div>
      </div>
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span class="text-xs font-medium text-gray-500">extractions/business-2025-07.md</span>
      </div>
    </div>
    <div class="flex-1 min-h-0 overflow-auto p-3 bg-[#0d1117]">
      <pre class="font-mono leading-snug text-gray-300 whitespace-pre-wrap" style="font-size: 0.5rem;" v-html="extraction"></pre>
    </div>
  </div>
  <div class="transition-all duration-500" :class="$clicks >= 1 ? 'flex-1 opacity-100' : 'w-0 opacity-0 overflow-hidden'">
    <div class="h-full rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white text-left flex flex-col">
      <div class="flex items-center px-4 py-2 border-b border-gray-200 bg-gray-50 relative">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full" style="background-color: #FF5F56;"></div>
          <div class="w-3 h-3 rounded-full" style="background-color: #FFBD2E;"></div>
          <div class="w-3 h-3 rounded-full" style="background-color: #27C93F;"></div>
        </div>
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span class="text-xs font-medium text-gray-500">flagged items across extractions</span>
        </div>
      </div>
      <div class="flex-1 min-h-0 overflow-auto p-3 bg-[#0d1117]">
        <pre class="font-mono leading-snug text-gray-300 whitespace-pre-wrap" style="font-size: 0.5rem;" v-html="questions"></pre>
      </div>
    </div>
  </div>
</div>

<!--
Here's what a single extraction actually looks like. YAML frontmatter traces it back to the exact source PDF. Below that, structured tables — income deposits, recurring expenses, one-time purchases — all categorized and totaled. This particular month is clean, no flags. But across all the extractions, the system surfaced 5 items that need clarification — rent paid from personal, Adobe on the wrong account, a contractor with no 1099, mixed Uber trips, and a desk bought through Venmo. Two of those need the CPA's input. All of this gets resolved in the review phase.
-->
