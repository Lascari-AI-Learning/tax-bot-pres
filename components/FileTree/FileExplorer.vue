<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { codeToHtml } from 'shiki'
import FileTreeItem from './FileTreeItem.vue'

const props = defineProps<{
  dir: string
  title?: string
  showWorkingDir?: boolean
}>()

// Load all files from slides/**/assets/filetree/** using a broad glob
// We use 'as: 'raw' to get the content string
// Path is relative to this component file location (components/FileTree/)
const modules = import.meta.glob('../../slides/**/assets/filetree/**/*', { query: '?raw', import: 'default', eager: true })

interface FileNode {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: FileNode[]
  content?: string
  isOpen?: boolean
}

const selectedFile = ref<FileNode | null>(null)
const expandedFolders = ref<Set<string>>(new Set())
const highlightedContent = ref<string>('')
const isHighlighting = ref(false)

// Normalize path to remove leading slashes and ensure consistency
const normalizePath = (p: string) => p.replace(/^\//, '').replace(/\/$/, '')

const fileTree = computed(() => {
  const tree: FileNode[] = []
  // The dir prop format is '<slide-folder>/filetree/<project-name>'
  // e.g., '08-file-explorer/filetree/my-fastapi-app'
  // We need to match against glob paths like:
  // '../../slides/08-file-explorer/assets/filetree/my-fastapi-app/main.py'
  const targetDir = normalizePath(props.dir)
  // Split on '/filetree/' to get slide folder and project path
  const filetreeIndex = targetDir.indexOf('/filetree/')
  let targetDirFull: string
  if (filetreeIndex !== -1) {
    const slideFolder = targetDir.slice(0, filetreeIndex)
    const projectPath = targetDir.slice(filetreeIndex + '/filetree/'.length)
    targetDirFull = `slides/${slideFolder}/assets/filetree/${projectPath}`
  } else {
    // Fallback: treat entire dir as path under slides/
    targetDirFull = `slides/${targetDir}`
  }

  // Filter files that belong to the target directory
  const relevantFiles = Object.entries(modules).filter(([path]) => {
    // Normalize the glob path - it comes as '../../slides/...'
    return path.includes(targetDirFull)
  })

  relevantFiles.forEach(([path, content]) => {
    // Extract relative path from the glob path
    // e.g., '../../slides/08-file-explorer/assets/filetree/my-fastapi-app/src/app.py' -> 'src/app.py'
    const index = path.indexOf(targetDirFull)
    if (index === -1) return

    const relativePath = path.slice(index + targetDirFull.length + 1)
    if (!relativePath) return

    const parts = relativePath.split('/')
    let currentLevel = tree

    parts.forEach((part, i) => {
      const isFile = i === parts.length - 1
      const existingNode = currentLevel.find(n => n.name === part)

      if (existingNode) {
        if (!isFile) {
          currentLevel = existingNode.children!
        }
      } else {
        const newNode: FileNode = {
          name: part,
          path: path,
          type: isFile ? 'file' : 'directory',
          children: isFile ? undefined : [],
          content: isFile ? content : undefined
        }
        currentLevel.push(newNode)
        if (!isFile) {
          currentLevel = newNode.children!
        }
      }
    })
  })

  const sortNodes = (nodes: FileNode[]) => {
    nodes.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name)
      return a.type === 'directory' ? -1 : 1
    })
    nodes.forEach(node => {
      if (node.children) sortNodes(node.children)
    })
  }
  sortNodes(tree)

  return tree
})

onMounted(() => {
  const findFirstFile = (nodes: FileNode[]): FileNode | null => {
    for (const node of nodes) {
      if (node.type === 'file') return node
      if (node.children) {
        const found = findFirstFile(node.children)
        if (found) return found
      }
    }
    return null
  }

  if (fileTree.value.length > 0) {
    const first = findFirstFile(fileTree.value)
    if (first) handleFileClick(first)

    const expandAll = (nodes: FileNode[]) => {
      nodes.forEach(node => {
        if (node.type === 'directory') {
          expandedFolders.value.add(node.path)
          if (node.children) expandAll(node.children)
        }
      })
    }
    expandAll(fileTree.value)
  }
})

const handleFileClick = async (node: FileNode) => {
  selectedFile.value = node
  if (node.content) {
    await highlightCode(node.content, node.name)
  }
}

const toggleFolder = (node: FileNode) => {
  if (expandedFolders.value.has(node.path)) {
    expandedFolders.value.delete(node.path)
  } else {
    expandedFolders.value.add(node.path)
  }
}

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

const getLanguageFromExtension = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase()
  const languageMap: Record<string, string> = {
    'py': 'python',
    'ts': 'typescript',
    'js': 'javascript',
    'jsx': 'javascript',
    'tsx': 'typescript',
    'vue': 'vue',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'sass',
    'json': 'json',
    'md': 'markdown',
    'yaml': 'yaml',
    'yml': 'yaml',
    'sh': 'bash',
    'bash': 'bash',
    'zsh': 'bash',
    'rs': 'rust',
    'go': 'go',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp',
    'cc': 'cpp',
    'h': 'c',
    'hpp': 'cpp',
    'rb': 'ruby',
    'php': 'php',
    'sql': 'sql',
    'xml': 'xml',
    'toml': 'toml',
    'ini': 'ini',
    'conf': 'ini',
    'dockerfile': 'dockerfile',
    'makefile': 'makefile',
    'mk': 'makefile'
  }
  return languageMap[ext || ''] || 'text'
}

const highlightCode = async (content: string, filename: string) => {
  if (!content || !content.trim()) {
    highlightedContent.value = ''
    return
  }

  try {
    isHighlighting.value = true
    const lang = getLanguageFromExtension(filename)
    const html = await codeToHtml(content, {
      lang,
      theme: 'github-dark'
    })
    highlightedContent.value = html
  } catch (error) {
    console.error('Failed to highlight code:', error)
    highlightedContent.value = ''
  } finally {
    isHighlighting.value = false
  }
}

watch(() => selectedFile.value, async (newFile) => {
  if (newFile && newFile.content) {
    await highlightCode(newFile.content, newFile.name)
  } else {
    highlightedContent.value = ''
  }
})
</script>

<template>
  <div class="flex flex-col h-full">
    <div v-if="title" class="text-4xl text-center mb-6 text-gray-900 font-bold">{{ title }}</div>
    <div class="flex flex-1 border border-[#3c3c3c] rounded-xl overflow-hidden shadow-lg text-xs font-mono bg-[#1e1e1e] text-left">
    <!-- Sidebar -->
    <div class="w-64 flex-shrink-0 border-r border-[#3c3c3c] bg-[#252526] overflow-y-auto">
      <div class="p-2.5 text-xs font-bold text-gray-400 uppercase tracking-wider pl-4 border-b border-[#3c3c3c]">Explorer</div>
      <div v-if="showWorkingDir" class="px-4 py-2 text-xs text-gray-500 border-b border-[#3c3c3c]">
        <div class="flex items-center gap-1">
          <span class="i-carbon:folder text-xs"></span>
          <span class="truncate">{{ dir }}</span>
        </div>
      </div>

      <div class="flex flex-col pb-2">
        <FileTreeItem
          v-for="node in fileTree"
          :key="node.path"
          :node="node"
          :expanded-folders="expandedFolders"
          :selected-file="selectedFile"
          @toggle="toggleFolder"
          @select="handleFileClick"
        />
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
      <div v-if="selectedFile" class="flex-1 flex flex-col min-h-0">
        <!-- Tab Header -->
        <div class="flex border-b border-[#3c3c3c] bg-[#2d2d2d]">
          <div class="px-4 py-1.5 bg-[#1e1e1e] border-t-2 border-t-blue-500 text-gray-100 flex items-center gap-2 text-xs">
             <span :class="[getFileIcon(selectedFile.name), 'text-sm']"></span>
            {{ selectedFile.name }}
            <span class="ml-2 hover:bg-[#3c3c3c] rounded p-0.5 cursor-pointer" @click="selectedFile = null">
              <div class="i-carbon:close text-xs text-gray-400"></div>
            </span>
          </div>
        </div>

        <!-- Code Content -->
        <div class="flex-1 overflow-auto p-4 bg-[#0d1117] dark:bg-[#0d1117]">
          <Transition name="fade" mode="out-in">
            <div
              v-if="highlightedContent && !isHighlighting"
              :key="selectedFile?.path"
              class="shiki-wrapper"
              v-html="highlightedContent"
            ></div>
            <pre
              v-else
              :key="'fallback-' + (selectedFile?.path || '')"
              class="font-mono text-sm leading-relaxed text-gray-300 whitespace-pre-wrap"
            >{{ selectedFile.content }}</pre>
          </Transition>
        </div>
      </div>
      <div v-else class="flex-1 flex items-center justify-center text-gray-500 text-base">
        Select a file to view
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
/* Fade transition for code panel file switches */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.shiki-wrapper {
  margin: 0;
}

.shiki-wrapper :deep(pre) {
  margin: 0;
  padding: 0;
  background: transparent !important;
}

.shiki-wrapper :deep(code) {
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 0.75rem;
  line-height: 1.5;
  display: block;
  width: 100%;
}
</style>
