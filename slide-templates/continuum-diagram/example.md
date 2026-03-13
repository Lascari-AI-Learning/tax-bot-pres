---
theme: ../
layout: default
clicks: 4
---

<div class="text-4xl text-center mb-8">Continuum Diagram Template</div>

<div class="relative mt-10 p-8 py-10 rounded-lg border-1 border-gray-500" style="background-color: #E3DACC;">
  <div class="flex items-center gap-6">
    <span class="text-sm font-semibold text-rose-600 whitespace-nowrap">
      Extreme<br>Left
    </span>
    <div class="relative h-3 bg-gradient-to-r from-rose-400 via-purple-400 to-sky-400 rounded-full shadow-lg flex-1">
      <div class="absolute -top-8.5 left-[15%] transform -translate-x-1/2">
        <div class="bg-white px-2 py-1 rounded shadow-md text-xs font-medium">Item A</div>
        <div class="w-3 h-3 bg-rose-500 rounded-full mx-auto mt-1"></div>
      </div>
      <div class="absolute -bottom-12 left-[50%] transform -translate-x-1/2">
        <div class="w-4 h-4 bg-purple-500 rounded-full mx-auto mb-1 ring-4 ring-purple-200"></div>
        <div class="bg-purple-100 px-3 py-1 rounded shadow-lg text-sm font-bold border-1 border-purple-500">Featured Item</div>
      </div>
      <div class="absolute -top-8.5 left-[85%] transform -translate-x-1/2">
        <div class="bg-white px-2 py-1 rounded shadow-md text-xs font-medium">Item B</div>
        <div class="w-3 h-3 bg-sky-400 rounded-full mx-auto mt-1"></div>
      </div>
    </div>
    <span class="text-sm font-semibold text-sky-600 whitespace-nowrap">
      Extreme<br>Right
    </span>
  </div>
</div>

<div class="grid grid-cols-9 gap-4 mt-8 text-xs">
  <div :class="$clicks >= 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'" class="col-span-2 text-center bg-gray-100 border-1 border-gray-500 p-2 px-4 rounded-lg transition-opacity duration-300">
    <p>Left characteristic 1</p>
    <p>Left characteristic 2</p>
  </div>
  <div :class="$clicks >= 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'" class="col-span-5 items-center text-center mt-2.5 transition-opacity duration-300">
    <div class="p-0.5 rounded-lg shadow-lg" style="background: linear-gradient(to right, #fb7185, #a78bfa, #38bdf8);">
      <div class="bg-white rounded-md py-4 px-2">
        <p class="text-lg mb-2 text-center">The Sweet Spot:</p>
        <p class="text-2xl font-semibold">
          <span class="text-red-600 font-bold">Quality A</span> with <span class="text-purple-600 font-bold">Quality B</span> and <span class="text-sky-600 font-bold">Quality C</span>
        </p>
      </div>
    </div>
  </div>
  <div :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'" class="col-span-2 text-center bg-gray-100 border-1 border-gray-500 p-2 px-4 rounded-lg transition-opacity duration-300">
    <p>Right characteristic 1</p>
    <p>Right characteristic 2</p>
  </div>
</div>

<div v-if="$clicks >= 4" class="text-center mt-8">
  <p class="text-xl font-semibold">Find Your Sweet Spot</p>
</div>
