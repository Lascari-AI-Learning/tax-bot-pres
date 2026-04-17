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
const b = (t) => `<span class="font-bold text-gray-200">${t}</span>`

const summary = `${h('# 2025 Tax Preparation — Ford Lascari / Lascari Digital Consulting LLC')}

${h('## Filing Info')}
- Entity: Single-member LLC
- State(s): Colorado (Jan-Aug), Oregon (Sep-Dec)
- Address: 1585 Hawthorne Blvd, Unit 7, Portland, OR 97214
- Address change: Moved Sep 1, 2025 from 742 Maple Street, Apt 3B, Denver, CO 80202

${h('## Annual Totals')}

 Category                  Amount
 ────────────────────────  ──────────────
 Gross Income              ${g('$157,300.00')}
 Savings Interest          ${g('$847.23')}
 Business Expenses         ${g('$14,204.45')}
 Home Office Deduction     ${g('$3,729.57')}
 Health Insurance          ${g('$5,820.00')}
 Est. Taxes (Federal)      ${g('$16,800.00')}
 Est. Taxes (Colorado)     ${g('$3,600.00')}
 Est. Taxes (Oregon)       ${g('$4,200.00')}
 Retirement (Roth IRA)     ${g('$7,000.00')}

${h('## Attached Documents')}
- 2025 CPA Tax Package.xlsx — Full detailed breakdown (8 tabs)
- Bank statements: 12 mo business (Chase), 12 mo personal (Wells Fargo), 1 savings (Marcus)
- Quarterly estimate receipts: 4 quarters (federal + state)
- Health insurance docs: 1095-A form
- Income docs: 1099-NEC from TechStart, 1099-NEC from GreenLeaf

${h('## Questions for CPA')}

${ask('1. GreenLeaf discrepancy')} — Bank deposits total $36,500 but 1099-NEC shows $28,000.
   ${warn('Difference of $8,500 — may be a timing issue or incorrect 1099.')}

${ask('2. Headspace subscription')} — $49.99/mo × 12 = $599.88. Meditation/wellness app.
   ${warn('Unclear if deductible as business or health expense. Paid from personal checking.')}

${ask('3. Moving expenses')} — Denver to Portland move. Personal reasons, not employer-required.
   ${warn('Federal deduction suspended under TCJA for non-military. State treatment may differ.')}

${ask('4. Part-year state returns')} — Colorado part-year resident return needed in addition to Oregon?
   ${warn('Likely yes — need to confirm filing requirements for both states.')}

${h('## Notes')}
${dim('1.')} Marcus 1099-INT for savings interest ($847.23) is pending — awaiting Goldman Sachs.
${dim('2.')} Q4 federal ($4,200) and Oregon ($2,100) payments made Jan 15, 2026 — applies to 2025.
${dim('3.')} Vanguard contribution confirmation for Roth IRA ($7,000) is pending.
${dim('4.')} Roth IRA contributions are not deductible but should be tracked for basis.`
</script>

<div class="flex flex-col h-full p-2">
  <div class="flex-1 min-h-0 relative">
    <div
      class="h-full flex items-center justify-center transition-all duration-500"
      :class="$clicks < 1 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'"
    >
      <div class="w-full max-w-5xl">
        <MotionCanvas src="/animations/08-package.js" />
      </div>
    </div>
    <div
      class="h-full transition-all duration-500"
      :class="$clicks >= 1 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'"
    >
      <div class="h-full rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white text-left flex flex-col">
        <div class="flex items-center px-4 py-2 border-b border-gray-200 bg-gray-50 relative">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" style="background-color: #FF5F56;"></div>
            <div class="w-3 h-3 rounded-full" style="background-color: #FFBD2E;"></div>
            <div class="w-3 h-3 rounded-full" style="background-color: #27C93F;"></div>
          </div>
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span class="text-xs font-medium text-gray-500">output/2025 CPA Summary.md</span>
          </div>
        </div>
        <div class="flex-1 min-h-0 overflow-auto p-3 bg-[#0d1117]">
          <pre class="font-mono leading-snug text-gray-300 whitespace-pre-wrap" style="font-size: 0.5rem;" v-html="summary"></pre>
        </div>
      </div>
    </div>
  </div>
</div>

<!--
And here's the CPA summary — the one-page cover sheet that goes with your spreadsheet. Filing info, annual totals, every attached document listed, and — this is the key part — questions for your CPA. The system flagged a 1099 discrepancy, an ambiguous subscription, a moving deduction question, and a part-year state filing question. These aren't generic; they're specific to Ford's situation. Your CPA opens this, sees exactly what they need, and knows exactly what to ask about. No back-and-forth.
-->
