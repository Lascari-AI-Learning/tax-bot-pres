---
theme: ../
layout: default
---

<div class="text-4xl text-center mb-8 text-gray-900 font-bold">{{title}}</div>

<div class="flex justify-center">
  <div class="w-3/4">
    <Terminal
      :lines="{{{lines}}}"
      {{#if terminal_title}}title="{{terminal_title}}"{{/if}}
      {{#if shell}}shell="{{shell}}"{{/if}}
      {{#if prompt}}prompt="{{prompt}}"{{/if}}
      {{#if height}}:height="{{height}}"{{/if}}
      {{#if animated}}:animated="true"{{/if}}
    />
  </div>
</div>

<!--
{{speaker_notes}}
-->
