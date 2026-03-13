---
theme: ../
layout: default
---

<div class="text-3xl text-center mb-4 text-gray-900 font-bold">{{title}}</div>

<div class="grid grid-cols-{{columns}} gap-4">
{{#each charts}}
<div class="flex flex-col items-center">
  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{{label}}</p>
  <Chart
    type="{{type}}"
    :labels="{{{labels}}}"
    :datasets="{{{datasets}}}"
    :height="{{height}}"
  />
</div>
{{/each}}
</div>

<!--
{{speaker_notes}}
-->
