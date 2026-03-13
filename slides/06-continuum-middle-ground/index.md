---
theme: ../
layout: default
clicks: 3
---

<script setup>
import { X, Check } from 'lucide-vue-next'
</script>

<div class="text-5xl text-center mb-8 font-bold" style="font-family: 'Styrene A', sans-serif;">Continuum Middle Ground Template</div>

<div class="relative h-[500px] px-12">
  <div class="absolute bottom-25 left-0 right-0">
    <div class="relative h-[3px]" style="background-color: #6b7280;">
      <div class="absolute left-[-15px] top-1/2 transform -translate-y-1/2">
        <div class="w-0 h-0 border-r-[20px] border-y-[12px] border-y-transparent" style="border-right-color: #6b7280;"></div>
      </div>
      <div class="absolute right-[-15px] top-1/2 transform -translate-y-1/2">
        <div class="w-0 h-0 border-l-[20px] border-y-[12px] border-y-transparent" style="border-left-color: #6b7280;"></div>
      </div>
    </div>
  </div>
    <div
      v-if="$clicks >= 1"
      class="absolute left-[0%] bottom-45 w-[250px] bg-white rounded-lg shadow-lg p-6 border border-gray-400"
      :class="{ 'opacity-40': $clicks >= 3 }"
      style="transition: opacity 0.5s;"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mb-0" style="background-color: #ef4444; position: absolute; left: 50%; transform: translateX(-50%) translateY(-105%); z-index: 1;">
          <X class="w-6 h-6 text-white" :stroke-width="3" />
        </div>
        <div class="w-full mt-2">
          <p class="text-md font-bold mb-2 text-center mt-0">Left Extreme</p>
          <p class="text-xs leading-relaxed text-center">Description of what the left extreme represents and its characteristics.</p>
        </div>
      </div>
      <div class="absolute left-1/2 bottom-0 w-[2px] bg-gray-700 transform -translate-x-1/2" style="height: 60px; top: 100%;"></div>
      <div class="absolute left-1/2" style="top: calc(100% + 60px); transform: translateX(-50%);">
        <div class="w-2 h-2 rounded-full bg-gray-700"></div>
      </div>
    </div>
    <div
      v-if="$clicks >= 2"
      class="absolute right-[0%] bottom-45 w-[250px] bg-white rounded-lg shadow-lg p-6 border border-gray-400"
      :class="{ 'opacity-40': $clicks >= 3 }"
      style="transition: opacity 0.5s;"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mb-0" style="background-color: #ef4444; position: absolute; left: 50%; transform: translateX(-50%) translateY(-105%); z-index: 1;">
          <X class="w-6 h-6 text-white" :stroke-width="3" />
        </div>
        <div class="w-full mt-2">
          <p class="text-md font-bold mb-2 text-center mt-0">Right Extreme</p>
          <p class="text-xs leading-relaxed text-center">Description of what the right extreme represents and its characteristics.</p>
        </div>
      </div>
      <div class="absolute left-1/2 bottom-0 w-[2px] bg-gray-700 transform -translate-x-1/2" style="height: 60px; top: 100%;"></div>
      <div class="absolute left-1/2" style="top: calc(100% + 60px); transform: translateX(-50%);">
        <div class="w-2 h-2 rounded-full bg-gray-700"></div>
      </div>
    </div>
    <div v-if="$clicks >= 3" class="absolute left-1/2 bottom-45 w-[250px] transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-6 border-3 z-10" style="border-color: #22c55e;">
      <div class="flex flex-col items-center gap-3">
        <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mb-0" style="background-color: #22c55e; position: absolute; left: 50%; transform: translateX(-50%) translateY(-105%); z-index: 1;">
          <Check class="w-6 h-6 text-white" :stroke-width="3" />
        </div>
        <div class="w-full mt-2">
          <p class="text-md font-bold mb-2 text-center mt-0">The Sweet Spot</p>
          <p class="text-xs leading-relaxed text-center">The balanced approach that combines the best of both extremes.</p>
        </div>
      </div>
      <div class="absolute left-1/2 bottom-0 w-[2px] bg-gray-700 transform -translate-x-1/2 mt-1" style="height: 60px; top: 100%;"></div>
      <div class="absolute left-1/2" style="top: calc(100% + 60px); transform: translateX(-50%);">
        <div class="w-2 h-2 rounded-full bg-gray-700"></div>
      </div>
    </div>
</div>
