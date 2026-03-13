<script setup lang="ts">
import { computed } from 'vue'

interface FileNode {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: FileNode[]
  content?: string
  isOpen?: boolean
}

const props = defineProps<{
  node: FileNode
  expandedFolders: Set<string>
  selectedFile: FileNode | null
  depth?: number
}>()

const emit = defineEmits<{
  (e: 'toggle', node: FileNode): void
  (e: 'select', node: FileNode): void
}>()

const depth = props.depth || 0
const isExpanded = computed(() => props.expandedFolders.has(props.node.path))
const isSelected = computed(() => props.selectedFile?.path === props.node.path)

const getFileIcon = (name: string) => {
  const lower = name.toLowerCase()
  if (lower.endsWith('.py')) return 'i-vscode-icons:file-type-python'
  if (lower.endsWith('.md')) return 'i-vscode-icons:file-type-markdown'
  if (lower.endsWith('.ts')) return 'i-vscode-icons:file-type-typescript'
  if (lower.endsWith('.tsx')) return 'i-vscode-icons:file-type-typescript'
  if (lower.endsWith('.js')) return 'i-vscode-icons:file-type-js'
  if (lower.endsWith('.jsx')) return 'i-vscode-icons:file-type-js'
  if (lower.endsWith('.json')) return 'i-vscode-icons:file-type-json'
  if (lower.endsWith('.vue')) return 'i-vscode-icons:file-type-vue'
  if (lower.endsWith('.yaml') || lower.endsWith('.yml')) return 'i-vscode-icons:file-type-yaml'
  if (lower.endsWith('.html')) return 'i-vscode-icons:file-type-html'
  if (lower.endsWith('.css')) return 'i-vscode-icons:file-type-css'
  if (lower.endsWith('.scss')) return 'i-vscode-icons:file-type-scss'
  if (lower.endsWith('.sh') || lower.endsWith('.bash') || lower.endsWith('.zsh')) return 'i-vscode-icons:file-type-shell'
  if (lower.endsWith('.toml')) return 'i-vscode-icons:file-type-toml'
  if (lower.endsWith('.txt')) return 'i-vscode-icons:file-type-text'
  if (lower.endsWith('.env')) return 'i-vscode-icons:file-type-dotenv'
  if (lower.endsWith('.gitignore')) return 'i-vscode-icons:file-type-git'
  if (lower.endsWith('.rs')) return 'i-vscode-icons:file-type-rust'
  if (lower.endsWith('.go')) return 'i-vscode-icons:file-type-go'
  if (lower === 'dockerfile') return 'i-vscode-icons:file-type-docker'
  if (lower === 'makefile') return 'i-vscode-icons:file-type-makefile'
  return 'i-vscode-icons:default-file'
}
</script>

<template>
  <div>
    <div v-if="node.type === 'directory'">
      <div
        class="flex items-center px-2 py-1.5 cursor-pointer hover:bg-[#2a2d2e] text-gray-300 select-none transition-colors duration-150"
        :style="{ paddingLeft: `${depth * 14 + 8}px` }"
        @click="emit('toggle', node)"
      >
        <span
          class="mr-1 transform transition-transform text-gray-400 flex items-center justify-center w-4 h-4"
          :class="isExpanded ? 'rotate-90' : ''"
        >
          <div class="i-carbon:chevron-right text-xs"></div>
        </span>
        <span class="i-vscode-icons:default-folder mr-2 text-sm flex-shrink-0"></span>
        <span class="truncate">{{ node.name }}/</span>
      </div>

      <Transition name="expand">
        <div v-if="isExpanded" class="expand-wrapper">
          <FileTreeItem
            v-for="child in node.children"
            :key="child.path"
            :node="child"
            :expanded-folders="expandedFolders"
            :selected-file="selectedFile"
            :depth="depth + 1"
            @toggle="(n) => emit('toggle', n)"
            @select="(n) => emit('select', n)"
          />
        </div>
      </Transition>
    </div>

    <div v-else>
      <div
        class="flex items-center px-2 py-1.5 cursor-pointer hover:bg-[#2a2d2e] select-none transition-colors duration-150"
        :class="{ 'bg-[#37373d] text-white': isSelected, 'text-gray-300': !isSelected }"
        :style="{ paddingLeft: `${depth * 14 + 28}px` }"
        @click="emit('select', node)"
      >
         <span :class="[getFileIcon(node.name), 'mr-2 text-sm flex-shrink-0']"></span>
        <span class="truncate">{{ node.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.15s ease, max-height 0.2s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
}
</style>
