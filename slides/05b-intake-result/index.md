---
theme: ../
layout: default
clicks: 2
---

<script setup>
const h = (t) => `<span class="text-blue-400">${t}</span>`
const ok = `<span class="text-green-400">STATUS: complete</span>`
const pend = `<span class="text-yellow-400">STATUS: pending</span>`

const states = [
  `<span class="text-blue-400 font-bold"># Tax Intake — 2025</span>

${h('## 1. Filer Info')}
${ok}
Name: Ford Lascari
Filing Status: Single
Business: Sole Proprietor (LLC)
EIN: XX-XXXXXXX

${h('## 2. Accounts')}
${pend}

${h('## 3. Home Office')}
${pend}

${h('## 4. Health Insurance')}
${pend}

${h('## 5. Internet &amp; Utilities')}
${pend}

${h('## 6. Quarterly Taxes')}
${pend}

${h('## 7. Retirement')}
${pend}

${h('## 8. Income')}
${pend}

${h('## 9. Special Considerations')}
${pend}`,

  `<span class="text-blue-400 font-bold"># Tax Intake — 2025</span>

${h('## 1. Filer Info')}
${ok}
Name: Ford Lascari
Filing Status: Single
Business: Sole Proprietor (LLC)
EIN: XX-XXXXXXX

${h('## 2. Accounts')}
${ok}
- Chase Business Checking (primary business)
- Wells Fargo Personal (mixed use)
- Venmo (personal — occasional business receipts)

${h('## 3. Home Office')}
${ok}
Dedicated office room: 12x14 ft
Total home sq ft: 1,200
Rent: $2,100/mo (paid via Venmo from personal)
Office furniture purchased: Standing desk ($849)

${h('## 4. Health Insurance')}
${pend}

${h('## 5. Internet &amp; Utilities')}
${pend}

${h('## 6. Quarterly Taxes')}
${pend}

${h('## 7. Retirement')}
${pend}

${h('## 8. Income')}
${pend}

${h('## 9. Special Considerations')}
${pend}`,

  `<span class="text-blue-400 font-bold"># Tax Intake — 2025</span>

${h('## 1. Filer Info')}
${ok}
Name: Ford Lascari
Filing Status: Single
Business: Sole Proprietor (LLC)
EIN: XX-XXXXXXX

${h('## 2. Accounts')}
${ok}
- Chase Business Checking (primary business)
- Wells Fargo Personal (mixed use)
- Venmo (personal — occasional business receipts)

${h('## 3. Home Office')}
${ok}
Dedicated office room: 12x14 ft
Total home sq ft: 1,200
Rent: $2,100/mo (paid via Venmo from personal)
Office furniture purchased: Standing desk ($849)

${h('## 4. Health Insurance')}
${ok}
Marketplace plan (1095-A)
Monthly premium: $485
No employer coverage available

${h('## 5. Internet &amp; Utilities')}
${ok}
Internet: $89/mo (Spectrum, 80% business use)
Electric: $145/mo avg (proportional to office %)

${h('## 6. Quarterly Taxes')}
${ok}
Q1: $3,200 | Q2: $3,200 | Q3: $3,500 | Q4: $3,500

${h('## 7. Retirement')}
${ok}
SEP-IRA contribution: $12,500
No other retirement accounts

${h('## 8. Income')}
${ok}
- Acme Corp consulting: $145,000 (1099-NEC)
- Side project revenue: $8,200 (Stripe)
- Interest income: $342 (savings)

${h('## 9. Special Considerations')}
${ok}
- Mixed personal/business Venmo transactions
- Home office deduction (regular method)
- Vehicle: 4,200 business miles logged
- NOTE: Confirm mileage rate with CPA`
]
</script>

<div class="flex items-center justify-center h-full p-2">
  <div class="w-full max-w-4xl h-full rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white text-left flex flex-col">
    <div class="flex items-center px-4 py-2 border-b border-gray-200 bg-gray-50 relative">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full" style="background-color: #FF5F56;"></div>
        <div class="w-3 h-3 rounded-full" style="background-color: #FFBD2E;"></div>
        <div class="w-3 h-3 rounded-full" style="background-color: #27C93F;"></div>
      </div>
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span class="text-xs font-medium text-gray-500">write-up/intake.md</span>
      </div>
    </div>
    <div class="flex-1 min-h-0 overflow-auto p-4 bg-[#0d1117] relative">
      <pre class="font-mono leading-relaxed text-gray-300 whitespace-pre-wrap transition-all duration-500" style="font-size: 0.65rem;" :class="$clicks < 1 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'" v-html="states[0]"></pre>
      <pre class="font-mono leading-relaxed text-gray-300 whitespace-pre-wrap transition-all duration-500" style="font-size: 0.65rem;" :class="$clicks >= 1 && $clicks < 2 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'" v-html="states[1]"></pre>
      <pre class="font-mono leading-relaxed text-gray-300 whitespace-pre-wrap transition-all duration-500" style="font-size: 0.65rem;" :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'" v-html="states[2]"></pre>
    </div>
  </div>
</div>
