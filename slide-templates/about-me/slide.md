---
theme: ../
layout: default
---

<div class="speaker-layout h-full flex items-center">
  <div class="grid grid-cols-3 gap-12 w-full max-w-7xl mx-auto px-12">
    <!-- Left side: Content -->
    <div class="flex flex-col col-span-2 justify-center space-y-4">

# About Me

- {{role}}

{{#each sections}}
### {{title}}
{{#each points}}
- {{{this}}}
{{/each}}

{{/each}}

</div>
    <!-- Right side: Image with name -->
    <div class="flex flex-col items-center justify-center col-span-1">
      <h2 class="text-2xl font-semibold text-obsidian-black mb-6">{{name}}</h2>
      <div class="relative">
        <div class="w-[280px] h-[280px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <img src="{{image_path}}" class="w-full h-full object-cover" alt="Speaker" />
        </div>
      </div>
    </div>
  </div>
</div>

{{#if speaker_notes}}
<!--
{{speaker_notes}}
-->
{{/if}}

<style>
.speaker-layout {
  @apply bg-gradient-to-br from-bone-white to-gray-50;
}

.speaker-layout :deep(h1) {
  @apply text-4xl font-bold text-obsidian-black mb-2;
  font-family: 'StyreneB-Bold-Trial', system-ui, sans-serif;
  letter-spacing: -0.02em;
}

.speaker-layout :deep(h3) {
  @apply text-2xl font-semibold text-slate-steel mt-8;
  font-family: 'StyreneB-Medium-Trial', system-ui, sans-serif;
}

.speaker-layout :deep(ul) {
  @apply space-y-3;
}

.speaker-layout :deep(li) {
  @apply text-lg leading-relaxed text-ash-graphite;
  font-family: 'StyreneA-Regular-Trial', system-ui, sans-serif;
}

.speaker-layout :deep(strong) {
  @apply text-iron-ochre font-semibold;
}

.speaker-layout :deep(li) {
  @apply transition-all duration-200 ease-out;
}

.speaker-layout :deep(li:hover) {
  @apply translate-x-1;
}

.speaker-layout :deep(.text-xl) {
  @apply text-2xl text-fog-grey;
  font-family: 'StyreneA-Regular-Trial', system-ui, sans-serif;
}
</style>
