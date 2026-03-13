<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick } from 'vue'
import { codeToHtml } from 'shiki'

interface TerminalLine {
  command: string
  output?: string
  prompt?: string
}

const props = withDefaults(defineProps<{
  lines?: TerminalLine[]
  command?: string
  output?: string
  prompt?: string
  shell?: 'bash' | 'zsh' | 'powershell' | 'cmd'
  title?: string
  height?: number
  copyable?: boolean
  clicks?: number
}>(), {
  prompt: '$',
  shell: 'bash',
  copyable: true,
  clicks: -1
})

// --- Core data ---

const terminalLines = computed(() => {
  if (props.lines && props.lines.length > 0) {
    return props.lines.map((line, idx) => ({
      command: line.command,
      output: line.output,
      prompt: line.prompt || props.prompt,
      index: idx
    }))
  }
  if (props.command) {
    return [{ command: props.command, output: props.output, prompt: props.prompt, index: 0 }]
  }
  return []
})

const isAnimated = computed(() => props.clicks >= 0)

// --- Syntax highlighting ---

const highlightedCommands = ref<Map<number, string>>(new Map())
const highlightedOutputs = ref<Map<number, string>>(new Map())
const copiedIndex = ref<number | null>(null)

const highlightCommand = async (command: string, index: number) => {
  if (!command.trim()) { highlightedCommands.value.set(index, ''); return }
  try {
    const html = await codeToHtml(command, {
      lang: props.shell === 'powershell' ? 'powershell' : 'bash',
      theme: 'github-dark'
    })
    highlightedCommands.value.set(index, html)
  } catch { highlightedCommands.value.set(index, '') }
}

const highlightOutput = async (output: string, index: number) => {
  if (!output?.trim()) { highlightedOutputs.value.set(index, ''); return }
  let lang = 'text'
  const trimmed = output.trim()
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    lang = 'json'
  }
  try {
    const html = await codeToHtml(output, { lang, theme: 'github-dark' })
    highlightedOutputs.value.set(index, html)
  } catch { highlightedOutputs.value.set(index, '') }
}

const highlightAll = () => {
  highlightedCommands.value.clear()
  highlightedOutputs.value.clear()
  terminalLines.value.forEach((line, idx) => {
    highlightCommand(line.command, idx)
    if (line.output) highlightOutput(line.output, idx)
  })
}

const copyToClipboard = async (text: string, index: number) => {
  try {
    await navigator.clipboard.writeText(text)
    copiedIndex.value = index
    setTimeout(() => { copiedIndex.value = null }, 2000)
  } catch { /* ignore */ }
}

// --- Animation state ---

const visibleLines = ref(0)
const currentCharIndex = ref(0)
const isTyping = ref(false)
const showOutputMap = ref<Map<number, boolean>>(new Map())
const typingInterval = ref<ReturnType<typeof setInterval> | null>(null)

const startTyping = (lineIndex: number) => {
  const line = terminalLines.value[lineIndex]
  if (!line) return
  currentCharIndex.value = 0
  isTyping.value = true
  typingInterval.value = setInterval(() => {
    currentCharIndex.value++
    if (currentCharIndex.value >= line.command.length) {
      if (typingInterval.value) clearInterval(typingInterval.value)
      typingInterval.value = null
      isTyping.value = false
      setTimeout(() => { showOutputMap.value.set(lineIndex, true) }, 300)
    }
  }, 50)
}

const activateNextLine = () => {
  const nextIndex = visibleLines.value
  if (nextIndex >= terminalLines.value.length) return
  visibleLines.value = nextIndex + 1
  nextTick(() => { startTyping(nextIndex) })
}

// --- Clicks-driven animation ---
// click 0 = empty terminal, click 1 → line 1 types, click 2 → line 2 types, etc.

watch(() => props.clicks, (newClicks) => {
  if (newClicks < 0) return
  const targetLines = newClicks

  // Going backward: reset to target state instantly
  if (targetLines < visibleLines.value) {
    if (typingInterval.value) { clearInterval(typingInterval.value); typingInterval.value = null }
    isTyping.value = false
    // Show lines up to target fully completed (no animation on rewind)
    visibleLines.value = targetLines
    showOutputMap.value.clear()
    for (let i = 0; i < targetLines; i++) {
      showOutputMap.value.set(i, true)
    }
    return
  }

  // Going forward: animate new lines
  while (visibleLines.value < targetLines && visibleLines.value < terminalLines.value.length) {
    activateNextLine()
  }
}, { immediate: true })

// --- Lifecycle ---

onMounted(() => { highlightAll() })
watch(() => props.lines, highlightAll, { deep: true })
watch(() => props.command, highlightAll)
</script>

<template>
  <div
    class="rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] text-left"
    :style="{ height: height ? `${height}px` : 'auto' }"
  >
    <!-- Terminal Header - macOS Window Chrome -->
    <div class="flex items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252526] relative">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full" style="background-color: #FF5F56;"></div>
        <div class="w-3 h-3 rounded-full" style="background-color: #FFBD2E;"></div>
        <div class="w-3 h-3 rounded-full" style="background-color: #27C93F;"></div>
      </div>
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
          {{ title || shell }}
        </span>
      </div>
    </div>

    <!-- Terminal Content -->
    <div class="p-4 font-mono text-sm bg-[#0d1117]" :style="{ height: height ? `calc(${height}px - 41px)` : 'auto', overflow: height ? 'auto' : 'visible' }">

      <!-- Static mode: no clicks prop, show everything -->
      <template v-if="!isAnimated">
        <div v-for="(line, idx) in terminalLines" :key="idx" class="mb-4 last:mb-0">
          <div class="flex items-start gap-2 mb-1">
            <span class="flex-shrink-0 text-gray-400">{{ line.prompt }}</span>
            <div class="flex-1 min-w-0">
              <div class="flex items-start gap-2 group">
                <div v-if="highlightedCommands.get(idx)" class="flex-1 shiki-wrapper" v-html="highlightedCommands.get(idx)"></div>
                <pre v-else class="flex-1 text-gray-300 whitespace-pre-wrap break-words">{{ line.command }}</pre>
                <button
                  v-if="copyable"
                  @click="copyToClipboard(line.command, idx)"
                  class="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 p-1 hover:bg-gray-800 rounded text-gray-500 hover:text-gray-300"
                  :title="copiedIndex === idx ? 'Copied!' : 'Copy command'"
                >
                  <span v-if="copiedIndex === idx" class="i-carbon:checkmark text-xs"></span>
                  <span v-else class="i-carbon:copy text-xs"></span>
                </button>
              </div>
            </div>
          </div>
          <div v-if="line.output" class="ml-6 mt-1 text-gray-400">
            <div v-if="highlightedOutputs.get(idx)" class="shiki-wrapper" v-html="highlightedOutputs.get(idx)"></div>
            <pre v-else class="whitespace-pre-wrap break-words">{{ line.output }}</pre>
          </div>
        </div>
      </template>

      <!-- Animated mode: clicks drives line reveal with typing -->
      <template v-else>
        <div v-for="(line, idx) in terminalLines" :key="idx" class="mb-4 last:mb-0">
          <template v-if="idx < visibleLines">
            <div class="flex items-start gap-2 mb-1">
              <span class="flex-shrink-0 text-gray-400">{{ line.prompt }}</span>
              <div class="flex-1 min-w-0">
                <div class="flex items-start gap-2">
                  <!-- Currently typing: partial text + cursor -->
                  <template v-if="idx === visibleLines - 1 && isTyping">
                    <pre class="flex-1 text-gray-300 whitespace-pre-wrap break-words">{{ line.command.substring(0, currentCharIndex) }}<span class="terminal-cursor"></span></pre>
                  </template>
                  <!-- Done typing: full highlighted command -->
                  <template v-else>
                    <div v-if="highlightedCommands.get(idx)" class="flex-1 shiki-wrapper" v-html="highlightedCommands.get(idx)"></div>
                    <pre v-else class="flex-1 text-gray-300 whitespace-pre-wrap break-words">{{ line.command }}</pre>
                  </template>
                </div>
              </div>
            </div>
            <div v-if="line.output && showOutputMap.get(idx)" class="ml-6 mt-1 text-gray-400">
              <div v-if="highlightedOutputs.get(idx)" class="shiki-wrapper" v-html="highlightedOutputs.get(idx)"></div>
              <pre v-else class="whitespace-pre-wrap break-words">{{ line.output }}</pre>
            </div>
          </template>
        </div>
      </template>

    </div>
  </div>
</template>

<style scoped>
.shiki-wrapper { margin: 0; }
.shiki-wrapper :deep(pre) { margin: 0; padding: 0; background: transparent !important; }
.shiki-wrapper :deep(code) {
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  display: block;
  width: 100%;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.terminal-cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: #e5e7eb;
  vertical-align: text-bottom;
  animation: blink 1s step-end infinite;
  margin-left: 1px;
}
</style>
