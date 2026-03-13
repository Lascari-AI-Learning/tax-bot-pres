---
theme: ../
layout: default
clicks: 3
---

{{#if use_icons}}
<script setup>
import { X, Check{{#if extra_icons}}, {{extra_icons}}{{/if}} } from 'lucide-vue-next'
</script>
{{/if}}

<div class="text-5xl text-center mb-8 font-bold" style="font-family: 'Styrene A', sans-serif;">{{title}}</div>

<div class="relative h-[500px] px-12">
  <!-- Continuum line with arrow -->
  <div class="absolute bottom-25 left-0 right-0">
    <div class="relative h-[3px]" style="background-color: {{continuum_color}};">
      <!-- Arrow head -->
      <div class="absolute left-[-15px] top-1/2 transform -translate-y-1/2">
        <div class="w-0 h-0 border-r-[20px] border-y-[12px] border-y-transparent" style="border-right-color: {{continuum_color}};"></div>
      </div>
      <div class="absolute right-[-15px] top-1/2 transform -translate-y-1/2">
        <div class="w-0 h-0 border-l-[20px] border-y-[12px] border-y-transparent" style="border-left-color: {{continuum_color}};"></div>
      </div>
    </div>
  </div>

  <!-- Left extreme -->
    <div
      v-if="$clicks >= 1"
      class="absolute left-[0%] bottom-45 w-[250px] bg-white rounded-lg shadow-lg p-6 border border-gray-400"
      {{#if fade_extremes}}:class="{ 'opacity-40': $clicks >= {{fade_at_click}} }"{{/if}}
      style="transition: opacity 0.5s;"
    >
      <div class="flex flex-col items-center gap-3">
        {{#if left_icon}}
        <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mb-0" style="background-color: {{left_icon_bg}}; position: absolute; left: 50%; transform: translateX(-50%) translateY(-105%); z-index: 1;">
          <{{left_icon}} class="w-6 h-6 text-white" :stroke-width="3" />
        </div>
        {{/if}}
        <div class="w-full mt-2">
          <p class="text-md font-bold mb-2 text-center mt-0">{{left_title}}</p>
          <p class="text-xs leading-relaxed text-center">{{left_description}}</p>
        </div>
      </div>
      <!-- Connecting line from left box to continuum -->
      <div class="absolute left-1/2 bottom-0 w-[2px] bg-gray-700 transform -translate-x-1/2" style="height: 60px; top: 100%;"></div>
      <!-- Add a circle at the bottom of the line to indicate the connection point -->
      <div class="absolute left-1/2" style="top: calc(100% + 60px); transform: translateX(-50%);">
        <div class="w-2 h-2 rounded-full bg-gray-700"></div>
      </div>
    </div>

  <!-- Right extreme -->
    <div
      v-if="$clicks >= 2"
      class="absolute right-[0%] bottom-45 w-[250px] bg-white rounded-lg shadow-lg p-6 border border-gray-400"
      {{#if fade_extremes}}:class="{ 'opacity-40': $clicks >= {{fade_at_click}} }"{{/if}}
      style="transition: opacity 0.5s;"
    >
      <div class="flex flex-col items-center gap-3">
        {{#if right_icon}}
        <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mb-0" style="background-color: {{right_icon_bg}}; position: absolute; left: 50%; transform: translateX(-50%) translateY(-105%); z-index: 1;">
          <{{right_icon}} class="w-6 h-6 text-white" :stroke-width="3" />
        </div>
        {{/if}}
        <div class="w-full mt-2">
          <p class="text-md font-bold mb-2 text-center mt-0">{{right_title}}</p>
          <p class="text-xs leading-relaxed text-center">{{right_description}}</p>
        </div>
      </div>
      <!-- Connecting line from right box to continuum -->
       <div class="absolute left-1/2 bottom-0 w-[2px] bg-gray-700 transform -translate-x-1/2" style="height: 60px; top: 100%;"></div>
      <!-- Add a circle at the bottom of the line to indicate the connection point -->
      <div class="absolute left-1/2" style="top: calc(100% + 60px); transform: translateX(-50%);">
        <div class="w-2 h-2 rounded-full bg-gray-700"></div>
      </div>
    </div>

  <!-- Middle sweet spot -->
    <div v-if="$clicks >= 3" class="absolute left-1/2 bottom-45 w-[250px] transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-6 border-3 z-10" style="border-color: {{middle_border_color}};">
      <div class="flex flex-col items-center gap-3">
        {{#if middle_icon}}
        <!-- The check icon is visually present but does not take up vertical space above the text -->
        <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mb-0" style="background-color: {{middle_icon_bg}}; position: absolute; left: 50%; transform: translateX(-50%) translateY(-105%); z-index: 1;">
          <{{middle_icon}} class="w-6 h-6 text-white" :stroke-width="3" />
        </div>
        {{/if}}
        <div class="w-full mt-2">
          <p class="text-md font-bold mb-2 text-center mt-0">{{middle_title}}</p>
          <p class="text-xs leading-relaxed text-center">{{middle_description}}</p>
        </div>
      </div>
      <!-- Connecting line from middle box to continuum -->
      <!-- Vertical connecting line from middle box to continuum with a circle at the bottom -->
      <div class="absolute left-1/2 bottom-0 w-[2px] bg-gray-700 transform -translate-x-1/2 mt-1" style="height: 60px; top: 100%;"></div>
      <!-- Add a circle at the bottom of the line to indicate the connection point -->
      <div class="absolute left-1/2" style="top: calc(100% + 60px); transform: translateX(-50%);">
        <div class="w-2 h-2 rounded-full bg-gray-700"></div>
      </div>
    </div>
</div>

{{#if speaker_notes}}
<!--
{{{speaker_notes}}}
-->
{{/if}}