---
theme: ../
layout: default
clicks: {{columns}}
---

<div class="text-4xl text-center mb-12 text-gray-900 font-bold">{{main_title}}</div>

<div class="grid grid-cols-{{columns}} gap-6">
{{#each sections}}
<!-- {{title}} -->
<div v-if="$clicks >= {{click}}" class="bg-gradient-to-b from-gray-50 to-gray-100 px-5 py-4 rounded-lg shadow-lg border-1 border-gray-400">
  <div class="flex items-center gap-2 mb-3{{#if center_title}} justify-center{{/if}}">
    <div class="w-10 h-10 rounded-lg bg-{{color}}-500 flex items-center justify-center">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{{icon_path}}"></path>
      </svg>
    </div>
    <p class="text-2xl font-bold">{{title}}</p>
  </div>
  <div class="space-y-3 text-left{{#if extra_margin}} mt-9.75{{/if}}">
    <div class="space-y-1">
      <p class="text-xs font-semibold text-{{color}}-600 uppercase tracking-wide">{{subtitle}}</p>
      <ul class="text-sm space-y-1">
        {{#each points}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
    </div>
  </div>
</div>
{{/each}}
</div>

<!--
{{speaker_notes}}
-->