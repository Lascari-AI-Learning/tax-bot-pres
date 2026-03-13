---
theme: ../
layout: default
---

<div class="text-3xl text-center mb-4 text-gray-900 font-bold">Chart Types</div>

<div class="grid grid-cols-4 gap-3">
<!-- Bar Chart -->
<div class="flex flex-col items-center">
  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Bar</p>
  <Chart
    type="bar"
    :labels="['Jan', 'Feb', 'Mar', 'Apr']"
    :datasets="[{ label: 'Revenue', data: [12, 19, 8, 15] }, { label: 'Expenses', data: [8, 12, 6, 9] }]"
    :height="160"
    :compact="true"
  />
</div>

<!-- Line Chart -->
<div class="flex flex-col items-center">
  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Line</p>
  <Chart
    type="line"
    :labels="['Jan', 'Feb', 'Mar', 'Apr']"
    :datasets="[{ label: 'Users', data: [100, 150, 130, 200] }, { label: 'Sessions', data: [80, 120, 110, 170] }]"
    :height="160"
    :compact="true"
  />
</div>

<!-- Doughnut Chart -->
<div class="flex flex-col items-center">
  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Doughnut</p>
  <Chart
    type="doughnut"
    :labels="['Mobile', 'Desktop', 'Tablet']"
    :datasets="[{ data: [45, 30, 25], backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6'] }]"
    :height="160"
    :compact="true"
  />
</div>

<!-- Pie Chart -->
<div class="flex flex-col items-center">
  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Pie</p>
  <Chart
    type="pie"
    :labels="['Chrome', 'Firefox', 'Safari', 'Edge']"
    :datasets="[{ data: [60, 15, 15, 10], backgroundColor: ['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6'] }]"
    :height="160"
    :compact="true"
  />
</div>

<!-- Radar Chart -->
<div class="flex flex-col items-center">
  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Radar</p>
  <Chart
    type="radar"
    :labels="['Speed', 'Reliability', 'Comfort', 'Safety', 'Cost']"
    :datasets="[{ label: 'Model A', data: [80, 90, 70, 85, 60] }, { label: 'Model B', data: [65, 75, 90, 70, 80] }]"
    :height="160"
    :compact="true"
  />
</div>

<!-- Polar Area Chart -->
<div class="flex flex-col items-center">
  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Polar Area</p>
  <Chart
    type="polarArea"
    :labels="['Red', 'Blue', 'Yellow', 'Green']"
    :datasets="[{ data: [11, 16, 7, 14], backgroundColor: ['#EF444480', '#3B82F680', '#F59E0B80', '#10B98180'] }]"
    :height="160"
    :compact="true"
  />
</div>

<!-- Scatter Chart -->
<div class="flex flex-col items-center">
  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Scatter</p>
  <Chart
    type="scatter"
    :labels="[]"
    :datasets="[{ label: 'Points', data: [{x: 10, y: 20}, {x: 15, y: 10}, {x: 25, y: 30}, {x: 30, y: 15}, {x: 40, y: 25}, {x: 50, y: 35}] }]"
    :height="160"
    :compact="true"
  />
</div>

<!-- Bubble Chart -->
<div class="flex flex-col items-center">
  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Bubble</p>
  <Chart
    type="bubble"
    :labels="[]"
    :datasets="[{ label: 'Data', data: [{x: 20, y: 30, r: 10}, {x: 40, y: 10, r: 15}, {x: 15, y: 25, r: 8}, {x: 35, y: 20, r: 12}] }]"
    :height="160"
    :compact="true"
  />
</div>
</div>

<!--
Showcase slide displaying all 8 Chart.js chart types: bar, line, doughnut, pie, radar, polar area, scatter, and bubble.
-->
