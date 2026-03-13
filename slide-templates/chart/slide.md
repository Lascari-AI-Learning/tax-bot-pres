---
theme: ../
layout: default
---

<div class="text-4xl text-center mb-8 text-gray-900 font-bold">{{title}}</div>

<div class="flex justify-center">
  <div class="w-3/4">
    <Chart
      type="{{type}}"
      :labels="{{{labels}}}"
      :datasets="{{{datasets}}}"
      {{#if height}}:height="{{height}}"{{/if}}
      {{#if chart_title}}title="{{chart_title}}"{{/if}}
    />
  </div>
</div>

<!--
{{speaker_notes}}
-->
