---
theme: ../
---

<div class="text-4xl text-center mb-6 text-gray-900 font-bold">{{main_title}}</div>
<div class="grid grid-cols-13 gap-8 mt-12 items-center justify-center">
  {{#each connections}}
  <!-- {{label}} - {{#if featured}}Middle 5 columns{{else}}{{#if @first}}First 4 columns{{else}}Last 4 columns{{/if}}{{/if}} -->
  <div class="{{#if featured}}col-span-5{{else}}col-span-4{{/if}} text-center">
    <div class="bg-gradient-to-b from-{{color}}-50 to-{{color}}-100 {{#if featured}}p-6 rounded-xl shadow-xl border-2{{else}}p-4 rounded-lg shadow-lg border-1{{/if}} border-{{color}}-{{#if featured}}500{{else}}400{{/if}}">
      <div class="inline-block bg-white {{#if featured}}p-4{{else}}p-3{{/if}} rounded">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size={{#if featured}}140x140{{else}}120x120{{/if}}&data={{qr_data}}" alt="{{label}} QR Code" />
      </div>
      <div class="{{#if featured}}mt-4{{else}}mt-3{{/if}}">
        <a href="{{link}}" target="_blank" class="{{#if featured}}text-lg font-bold{{else}}text-base font-semibold{{/if}} text-{{color}}-600 hover:text-{{color}}-800 hover:underline">
          {{label}}
        </a>
      </div>
    </div>
  </div>
  {{/each}}
</div>

{{#if footer_text}}
<div class="text-2xl text-center mt-12 text-gray-900">{{footer_text}}</div>
{{/if}}

<!--
{{speaker_notes}}
-->

<style>
  .text-slate-steel { color: #4C5A61; }
  .text-bone-white { color: #EAE7DC; }
  .text-fog-grey { color: #B0B3B8; }
  .border-iron-ochre { border-color: #A35E35; }
  .bg-obsidian-black { background-color: #0C0C0C; }
  .bg-ash-graphite { background-color: #2B2B2B; }
</style>