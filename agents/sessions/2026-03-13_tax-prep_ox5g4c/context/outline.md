# Tax Prep Agent — YouTube Script

## HOOK

I just did a year's worth of complicated taxes in 30 minutes with Claude Code.

As a small business owner, tax season is one of my most dreaded times of the year. And it's not even doing the taxes — I pay a CPA to do that.

It's getting everything together just to hand it to them.
- Digging through a year's worth of bank statements
- Figuring out which account I used for what
- Then sending it over just to be met with two weeks of back and forth
  - "What's this charge?"
  - "What account was this from?"
- Over and over until we're finally done

I looked for a tool that could just handle this for me — but nothing actually fit my needs.

So I built one. And in this video I'm going to show you exactly how it works and how you can use it yourself.

---

## OUTPUT FLASH — THE PAYOFF
*Execution: Screen recording, 5-10 seconds*

- Quick flash of the final output — no explanation yet, just show it
  - The 8-tab spreadsheet (scroll through a few tabs)
  - The CPA summary document
- This is what you hand to your CPA. That's it. You're done.

---

## SKIP-AHEAD NOTE
*Execution: Talking head*

- We're going to dive deep into how this system works — but if you're someone who just wants to get it and use it, skip ahead to [timestamp] for the full walkthrough. No worries. Your time is valuable, skip right ahead.

---

## INTRO — WHO I AM
*Execution: Talking head*

- Quick intro — I'm Ford, I'm an AI engineer. I build AI systems for startups and real-life use cases
- I've been working professionally in the space for about three years now
- One of the things I care most about is building systems that drive real value in my own life — and this is one of them

---

## WHY IT MATTERS
*Execution: Presentation / slides*

- Freelancers, sole props, small LLC owners — your tax situation is messier than a W-2 employee's
- Multiple accounts, mixed personal/business spending, deductions scattered across different places
- The tools that exist for this either charge high monthly fees or don't actually customize to your specific situation
  - They work fine for straightforward expenses, but the moment you have something slightly unusual, they miss it
  - Example: I pay rent through Venmo out of my personal account, but a portion of that is a home office deduction — no tool is catching that because of how it's categorized
  - These are the kinds of specific, real deductions that get missed and end up costing you money
- The current process without a tool: manually dig through everything, organize it yourself, send it to your CPA, then do weeks of back and forth clarifying things
- What this system produces: one clean package — an 8-tab spreadsheet and a summary document — that has everything your CPA needs to file, categorized and organized
- It's built around YOUR situation — your accounts, your deductions, your edge cases
- The goal: reduce your involvement to ~30 minutes and eliminate the back and forth

---

## HOW IT WORKS — ARCHITECTURE
*Execution: Presentation / slides + architecture diagrams for each phase*

- **The full picture:** you drop all your documents in, run a command in Claude Code, and the system takes it from there

- **Intake** — the system interviews you about your situation. Edge cases, what you do, how your accounts are set up. This context informs everything downstream — when it starts classifying and reviewing your documents, it already knows who you are and can see the full picture
  - [Architecture diagram: Intake]
  - File structure at this stage:
    ```
    2025 Taxes/
    ├── source-documents/
    │   ├── bank-statements/
    │   │   ├── Business Account/
    │   │   │   ├── January 2025.pdf
    │   │   │   └── ...
    │   │   └── Personal Account/
    │   │       └── ...
    │   ├── quarterly-estimates/
    │   ├── income/
    │   ├── health-insurance/
    │   └── other/
    └── 2025 taxes write up/
        └── intake.md  ← your situation, captured
    ```

- **Extract** — spins up parallel subagents, one per PDF. Each one reads through the document, extracts every transaction, categorizes them, and flags anything that needs clarification. This is where the parallel processing matters — it's not reading one statement at a time, it's processing all of them simultaneously
  - [Architecture diagram: Extract — parallel subagents]
  - File structure at this stage:
    ```
    2025 taxes write up/
    ├── intake.md
    ├── extractions/           ← one file per PDF, per subagent
    │   ├── business-2025-01.md
    │   ├── business-2025-02.md
    │   ├── personal-2025-01.md
    │   └── ...
    └── raw/                   ← aggregated by category
        ├── Income 2025.md
        ├── Expenses Business 2025.md
        ├── Personal Deductions 2025.md
        ├── Estimated Taxes 2025.md
        └── Health Insurance 2025.md
    ```

- **Review** — walks you through what it found. You confirm, correct, and it marks things that your CPA should weigh in on
  - [Architecture diagram: Review]
  - File structure at this stage:
    ```
    2025 taxes write up/
    ├── ...
    ├── raw/                   ← what was extracted
    └── final/                 ← reviewed and confirmed
        ├── Income 2025.md
        ├── Expenses Business 2025.md
        ├── Personal Deductions 2025.md
        └── ...
    ```

- **Package** — assembles everything into an 8-tab xlsx spreadsheet and a markdown summary document. This is what you send to your CPA alongside your bank statements — or if you're doing your own taxes, this is everything you need organized and ready to go
  - [Architecture diagram: Package — parallel assembly + validation pipeline]
  - File structure at this stage:
    ```
    2025 taxes write up/
    ├── ...
    ├── final/
    └── output/
        ├── sections/              ← intermediate JSON per section
        │   ├── income.json
        │   ├── business_expenses.json
        │   └── ...
        ├── 2025_tax_data.json     ← single source of truth
        ├── 2025 CPA Tax Package.xlsx  ← the spreadsheet
        └── 2025 CPA Summary.md       ← the summary doc
    ```

- **Folder structure & traceability** — the key thing here is every piece of data can be traced all the way back: final spreadsheet cell → JSON → reviewed markdown → extraction → source PDF. Nothing gets lost, nothing is a black box. This structure also enables the system to work with massive amounts of tokens by breaking the work into separate files and stages rather than trying to hold everything in one context
  - [Architecture diagram: full data lineage — source PDFs → extractions → raw → final → JSON → xlsx]

---

## SYSTEM WALKTHROUGH — HOW TO USE IT
*Execution: Screen recording / demo*

- **Initialize** — creates folder structure, tells you what documents to gather
- **Drop your documents** — put bank statement PDFs into the folders it created
- **Intake** — conversational interview about your situation. The agent pre-reads your docs and leads with findings so you confirm rather than recite
- **Extract** — this is the heavy lift. Parallel subagents fire off, one per PDF, extracting every transaction and categorizing expenses. Show the terminal with agents running simultaneously
- **Review** — walks through extracted data section by section. You confirm, correct, resolve flagged items
- **Package** — parallel assembly into JSON, then deterministic xlsx build with validation. Show the final output:
  - 8-tab spreadsheet (summary, income, business expenses, personal deductions, home office, estimated taxes, health insurance, retirement)
  - CPA summary markdown document
- Show the final spreadsheet on screen — this is what you hand to your CPA

---

## WHY THIS IS DIFFERENT / KEY RESULTS
*Execution: Screen recording with talking head*

- This isn't a chatbot summarizing a document — it's a pipeline with full traceability
- Every transaction traces from source PDF through extraction to the final spreadsheet cell
- Parallel processing means it handles months of statements without you babysitting it
- The review step keeps you in the loop — it's not blind automation, you confirm everything
- Time comparison: what used to take hours of organizing + weeks of back and forth → ~30 minutes of your actual involvement
- Honest about limitations: PDF quality matters, it's not tax advice, you still review the output

---

## CLOSE
*Execution: Talking head*

- This is one piece of what I'm building — AI systems for the parts of life that drain your time
- The whole thing is open source — link in the description, you can run it today
- If you're a freelancer or small business owner, this will save you hours every year
- Own the build, own the outcome