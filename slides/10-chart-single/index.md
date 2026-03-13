---
theme: ../
layout: default
---

<div class="text-4xl text-center mb-8 text-gray-900 font-bold">Monthly Revenue</div>

<div class="flex justify-center">
  <div class="w-3/4">
    <Chart
      type="bar"
      :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']"
      :datasets="[
        { label: 'Revenue', data: [42, 58, 35, 67, 49, 73] },
        { label: 'Expenses', data: [28, 35, 22, 41, 33, 45] }
      ]"
      :height="400"
    />
  </div>
</div>

<!--
Demo slide showing a single bar chart using the Chart component.
-->
