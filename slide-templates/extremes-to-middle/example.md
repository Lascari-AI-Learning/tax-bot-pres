---
theme: ../
clicks: 2
---

<div class="text-center text-4xl">
Extremes to Middle Template
</div>

<div class="grid grid-cols-3 mb-1 justify-center items-center mt-8">
  <div class="text-center bg-gray-100 border-1 border-blue-500 p-2 px-4 rounded-lg">
    <p class="text-lg font-semibold text-blue-600">First Extreme</p>
  </div>
  <div class="text-center text-4xl self-center">
    <span class="text-gray-800">+</span>
  </div>
  <div class="text-center bg-gray-100 border-1 border-green-500 p-2 px-4 rounded-lg">
    <p class="text-lg font-semibold text-green-600">Second Extreme</p>
  </div>
</div>

<div v-if="$clicks >= 1">
<div class="grid grid-cols-3 mb-1">
  <div class="text-center">
    <div class="text-4xl text-blue-600">↘</div>
  </div>
  <div class="text-center"></div>
  <div class="text-center">
    <div class="text-4xl text-green-600">↙</div>
  </div>
</div>

<div class="grid grid-cols-19 gap-4 items-center mb-1">
  <div class="col-span-1"></div>
  <div class="col-span-8 bg-gray-100 border-1 border-blue-500 rounded-lg p-4 shadow-sm">
    <ul class="text-sm space-y-1">
      <li>Benefit of first approach</li>
      <li>Another advantage</li>
      <li>Third benefit</li>
    </ul>
  </div>
  <div class="flex flex-col items-center">
    <h3 class="text-center text-4xl font-bold">+</h3>
  </div>
  <div class="col-span-8 bg-gray-100 border-1 border-green-500 rounded-lg p-4 shadow-sm">
    <ul class="text-sm space-y-1">
      <li>Benefit of second approach</li>
      <li>Another advantage</li>
      <li>Third benefit</li>
    </ul>
  </div>
  <div class="col-span-1"></div>
</div>
</div>

<div v-if="$clicks >= 2">
<div class="grid grid-cols-13 mb-1">
  <div class="col-span-5"></div>
  <div class="text-center">
    <div class="text-4xl text-blue-600">↘</div>
  </div>
  <div class="text-center">
    <span class="text-4xl"> = </span>
  </div>
  <div class="text-center">
    <div class="text-4xl text-green-600">↙</div>
  </div>
  <div class="col-span-5"></div>
</div>
<div class="flex flex-col gap-4 items-center justify-center">
  <div class="bg-gray-100 border-1 border-purple-500 rounded-lg p-4 shadow-sm">
    <span class="text-2xl">Best of Both Worlds</span>
  </div>
</div>
</div>
