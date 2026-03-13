---
theme: ../
layout: default
clicks: {{clicks}}
---

<div class="text-4xl text-center mb-8">{{title}}</div>

<div class="relative mt-10 p-8 py-10 rounded-lg border-1 border-gray-500" style="background-color: {{background_color}};">
  <!-- Container for labels and line -->
  <div class="flex items-center gap-6">
    <!-- Left Label -->
    <span class="text-sm font-semibold text-{{left_color}} whitespace-nowrap">
      {{{left_label}}}
    </span>
    <!-- Continuum Line -->
    <div class="relative h-3 bg-gradient-to-r from-{{gradient_from}} via-{{gradient_via}} to-{{gradient_to}} rounded-full shadow-lg flex-1">
    <!-- Tool Markers -->
    {{#each markers}}
    <div class="absolute {{position}} left-[{{percentage}}%] transform -translate-x-1/2">
      {{#if above}}
      <div class="bg-white px-2 py-1 rounded shadow-md text-xs font-medium">{{label}}</div>
      <div class="w-{{#if featured}}4{{else}}3{{/if}} h-{{#if featured}}4{{else}}3{{/if}} bg-{{color}} rounded-full mx-auto mt-1{{#if featured}} ring-4 ring-{{ring_color}}{{/if}}"></div>
      {{else}}
      <div class="w-{{#if featured}}4{{else}}3{{/if}} h-{{#if featured}}4{{else}}3{{/if}} bg-{{color}} rounded-full mx-auto mb-1{{#if featured}} ring-4 ring-{{ring_color}}{{/if}}"></div>
      <div class="{{#if featured}}bg-{{highlight_bg}} px-3 py-1 rounded shadow-lg text-sm font-bold border-1 border-{{highlight_border}}{{else}}bg-white px-2 py-1 rounded shadow-md text-xs font-medium{{/if}}">{{label}}</div>
      {{/if}}
    </div>
    {{/each}}
    </div>
    <!-- Right Label -->
    <span class="text-sm font-semibold text-{{right_color}} whitespace-nowrap">
      {{{right_label}}}
    </span>
  </div>
</div>

{{#if characteristics}}
  <!-- Characteristics -->
  <div class="grid grid-cols-9 gap-4 mt-8 text-xs">
    {{#each characteristics}}
    <div {{#if v_click}}:class="$clicks >= {{v_click_at}} ? 'opacity-100' : 'opacity-0 pointer-events-none'" {{/if}}class="{{#if span}}col-span-{{span}}{{else}}col-span-2{{/if}} {{#if center}}items-center text-center{{#if center_margin}} mt-2.5{{/if}}{{else}}text-center bg-gray-100 border-1 border-gray-500 p-2 px-4 rounded-lg{{/if}} transition-opacity duration-300">
      {{#if special_content}}
      <div class="p-0.5 rounded-lg shadow-lg" style="background: linear-gradient(to right, {{special_gradient}});">
        <div class="bg-white rounded-md py-4 px-2">
          <p class="text-lg mb-2 text-center">{{special_title}}</p>
          <p class="text-2xl font-semibold">
            {{{special_text}}}
          </p>
        </div>
      </div>
      {{else}}
      {{#each lines}}
      <p>{{{this}}}</p>
      {{/each}}
      {{/if}}
    </div>
    {{/each}}
  </div>
{{/if}}

{{#if footer}}
<div v-if="$clicks >= {{footer_v_click_at}}" class="text-center mt-8">
  <p class="text-xl font-semibold">{{footer}}</p>
</div>
{{/if}}

<!--
{{speaker_notes}}
-->