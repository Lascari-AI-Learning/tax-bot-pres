---
layout: default
clicks: {{clicks}}
---

# {{title}}

<div class="space-y-12 pt-4">
  {{#each sections}}
  <div v-if="$clicks >= {{@index}}" class="flex flex-col space-y-2">
    <div class="flex flex-row items-center space-x-4">
      <div class="w-12 h-12 rounded-lg {{#if gradient}}bg-gradient-to-br from-{{gradient.from}} to-{{gradient.to}}{{else}}bg-{{color}}{{/if}} flex items-center justify-center">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{{icon_path}}"></path>
        </svg>
      </div>
      <h2 class="text-2xl font-bold">{{heading}}</h2>
    </div>
    <div class="flex flex-col space-y-2">
      <ul class="list-disc list-inside text-lg ml-16">
        {{#each points}}
        <li>{{{this}}}</li>
        {{/each}}
      </ul>
    </div>
  </div>
  {{/each}}
</div>

<!--
{{speaker_notes}}
-->

<style>
  .text-slate-steel { color: #4C5A61; }
  .text-fog-grey { color: #B0B3B8; }
  {{#each custom_colors}}
  .text-{{name}} { color: {{value}}; }
  {{/each}}
</style>