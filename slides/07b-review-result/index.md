---
theme: ../
layout: default
---

<div class="flex flex-col h-full p-2">
  <div class="flex-1 min-h-0">
    <FileExplorer
      dir="07-review/filetree/tax-2025"
      :folderState="{ 'source-documents': false, 'write-up': true, 'extractions': false, 'raw': false, 'final': true }"
      defaultFile="Income 2025.md"
    />
  </div>
</div>
