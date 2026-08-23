<script setup lang="ts">
import { articleToMarkdown } from '~/utils/docToMarkdown'

const props = defineProps<{ title?: string }>()
const route = useRoute()

const copied = ref(false)
const pageUrl = computed(() => `https://muzak.dev${route.path}`)
// The raw Markdown source of this page, served by the docs-markdown middleware.
const markdownUrl = computed(() => `${route.path}.md`)

// Prefer the real Markdown source; fall back to reconstructing it from the
// rendered article if the request fails (e.g. offline).
async function buildMarkdown(): Promise<string> {
  try {
    const res = await fetch(markdownUrl.value)
    if (res.ok) return await res.text()
  } catch {
    /* fall through to the DOM reconstruction below */
  }
  const el = document.getElementById('main-doc')
  return el ? articleToMarkdown(el) : ''
}

async function copyPage() {
  try {
    await navigator.clipboard.writeText(await buildMarkdown())
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    /* clipboard unavailable */
  }
}

function viewAsMarkdown() {
  window.open(markdownUrl.value, '_blank', 'noopener')
}

function openInAI(target: 'claude' | 'chatgpt') {
  const prompt = `Read ${pageUrl.value}, the Muzak documentation page "${props.title ?? ''}". I'd like to ask questions about it.`
  const q = encodeURIComponent(prompt)
  const url =
    target === 'claude' ? `https://claude.ai/new?q=${q}` : `https://chatgpt.com/?q=${q}`
  window.open(url, '_blank', 'noopener')
}

const menu = [
  { key: 'copy', label: 'Copy Page', icon: 'lucide:copy', run: copyPage },
  { key: 'md', label: 'View as Markdown', icon: 'lucide:file-code-2', run: viewAsMarkdown },
  { key: 'claude', label: 'Open in Claude', icon: 'simple-icons:claude', run: () => openInAI('claude') },
  { key: 'chatgpt', label: 'Open in ChatGPT', icon: 'simple-icons:openai', run: () => openInAI('chatgpt') },
]
</script>

<template>
  <div class="flex items-center">
    <!-- primary: copy page -->
    <button
      type="button"
      class="flex h-8 cursor-pointer items-center gap-2 border border-r-0 border-white/5 bg-white/[0.02] px-3 font-mono text-[12px] text-ash transition-colors hover:bg-ink3 hover:text-bone"
      :aria-label="copied ? 'Copied' : 'Copy page'"
      @click="copyPage"
    >
      <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" size="16" :class="copied ? 'text-patina' : ''" aria-hidden="true" />
      <span class="hidden sm:inline">{{ copied ? 'Copied' : 'Copy page' }}</span>
    </button>

    <!-- secondary: more actions dropdown -->
    <!-- eager-mount so the glass panel is never painted before its contents;
         see the note in DocsVersionPicker. -->
    <VDropdown
      :distance="6"
      placement="bottom-end"
      popper-class="page-actions-popper"
      class="flex"
      eager-mount
    >
      <button
        type="button"
        class="grid h-8 cursor-pointer place-items-center border border-white/5 bg-white/[0.02] px-2 text-faint transition-colors hover:bg-ink3 hover:text-bone"
        aria-label="More actions"
      >
        <Icon name="lucide:chevron-down" size="16" aria-hidden="true" />
      </button>

      <template #popper="{ hide }">
        <ul class="flex min-w-[13rem] flex-col gap-0.5">
          <li v-for="item in menu" :key="item.key">
            <button
              type="button"
              class="flex w-full cursor-pointer items-center gap-2.5 px-2.5 py-2 text-left font-mono text-[12px] text-ash transition-colors hover:bg-white/5 hover:text-bone"
              @click="item.run(); hide()"
            >
              <Icon :name="item.icon" size="15" class="shrink-0 text-faint" aria-hidden="true" />
              {{ item.label }}
            </button>
          </li>
        </ul>
      </template>
    </VDropdown>
  </div>
</template>
