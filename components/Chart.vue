<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  RadialLinearScale
} from 'chart.js'
import { Bar, Line, Doughnut, Pie, PolarArea, Radar, Scatter, Bubble } from 'vue-chartjs'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  Filler
)

// Modern default colors
const colors = {
  primary: '#3B82F6',   // Blue
  secondary: '#10B981', // Emerald
  accent: '#8B5CF6',    // Violet
  gray: '#9CA3AF',      // Gray-400
  grid: 'rgba(128, 128, 128, 0.1)',
  text: '#9CA3AF'
}

const props = defineProps<{
  type: 'bar' | 'line' | 'doughnut' | 'pie' | 'polarArea' | 'radar' | 'scatter' | 'bubble'
  labels: string[]
  datasets: any[]
  title?: string
  height?: number
  compact?: boolean
}>()

// Inject modern defaults into datasets if missing
const enhancedDatasets = computed(() => {
  return props.datasets.map((ds, i) => {
    const colorKeys = ['primary', 'secondary', 'accent']
    const defaultColor = colors[colorKeys[i % colorKeys.length]]
    
    return {
      ...ds,
      backgroundColor: ds.backgroundColor || (props.type === 'line' ? `${defaultColor}20` : defaultColor),
      borderColor: ds.borderColor || defaultColor,
      borderWidth: ds.borderWidth || 2,
      tension: ds.tension || 0, // Sharper lines (0 instead of 0.4)
      pointBackgroundColor: ds.pointBackgroundColor || defaultColor,
      fill: props.type === 'line' && ds.fill !== false ? true : ds.fill,
      borderRadius: props.type === 'bar' ? 0 : 0, // Removed border radius on bars
      hoverBackgroundColor: ds.hoverBackgroundColor || (props.type === 'bar' ? `${defaultColor}dd` : undefined)
    }
  })
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: enhancedDatasets.value
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: props.compact ? { display: false } : {
      position: 'bottom' as const,
      labels: {
        color: colors.text,
        padding: 20,
        font: { family: "'Inter', sans-serif", size: 12 },
        usePointStyle: true,
        pointStyle: 'rect' // Square points instead of circle
      }
    },
    title: props.compact ? { display: false } : {
      display: !!props.title,
      text: props.title,
      color: colors.text,
      font: { family: "'Inter', sans-serif", size: 18 },
      padding: { bottom: 20 }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { family: "'Inter', sans-serif", size: 13 },
      bodyFont: { family: "'Inter', sans-serif", size: 12 },
      padding: 12,
      cornerRadius: 4, // Reduced radius on tooltips
      displayColors: true,
      boxPadding: 6
    }
  },
  scales: ['doughnut', 'pie', 'polarArea', 'radar'].includes(props.type) ? {} : {
    y: { 
      grid: { color: colors.grid, tickLength: 0 }, 
      ticks: { 
        color: colors.text,
        font: { family: "'Inter', sans-serif", size: 11 },
        padding: 8
      },
      border: { display: false }
    },
    x: { 
      grid: { display: false }, 
      ticks: { 
        color: colors.text,
        font: { family: "'Inter', sans-serif", size: 11 },
        padding: 8
      },
      border: { display: false }
    }
  },
  interaction: {
    mode: 'index' as const,
    intersect: false,
  }
}))

const containerStyle = computed(() => ({
  height: props.height ? `${props.height}px` : '400px'
}))
</script>

<template>
  <div 
    :class="['w-full bg-white dark:bg-[#1e1e1e] rounded-md shadow-sm border border-gray-200 dark:border-gray-800', compact ? 'p-3' : 'p-6']"
    :style="containerStyle"
  >
    <Bar v-if="type === 'bar'" :data="chartData" :options="chartOptions" />
    <Line v-else-if="type === 'line'" :data="chartData" :options="chartOptions" />
    <Doughnut v-else-if="type === 'doughnut'" :data="chartData" :options="chartOptions" />
    <Pie v-else-if="type === 'pie'" :data="chartData" :options="chartOptions" />
    <PolarArea v-else-if="type === 'polarArea'" :data="chartData" :options="chartOptions" />
    <Radar v-else-if="type === 'radar'" :data="chartData" :options="chartOptions" />
    <Scatter v-else-if="type === 'scatter'" :data="chartData" :options="chartOptions" />
    <Bubble v-else-if="type === 'bubble'" :data="chartData" :options="chartOptions" />
  </div>
</template>
