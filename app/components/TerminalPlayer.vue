<script setup lang="ts">
import type { TermStep } from '~/utils/terminalScripts'

interface Line { html: string; cls?: string }

const props = withDefaults(
  defineProps<{
    termKey: string
    steps: TermStep[]
    showFinalPrompt?: boolean
    autoplay?: boolean
    cascadeDelay?: number
    ariaLabel?: string
  }>(),
  { showFinalPrompt: false, autoplay: true, cascadeDelay: 0, ariaLabel: '' },
)

const emit = defineEmits<{ status: ['idle' | 'busy' | 'done'] }>()

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Fully-rendered representation of a step, and also the SSR / no-JS state so the
// content is present in the DOM for crawlers and AI engines.
function staticLine(s: TermStep): Line {
  if (s.cmd)
    return { html: `<span class="prompt">$</span> <span class="c-bone">${escapeHtml(s.cmd)}</span>` }
  if (s.html) return { html: s.html, cls: s.cls }
  return { html: escapeHtml(s.out ?? ''), cls: s.cls }
}

const fullLines = props.steps.map(staticLine)

// Server / pre-hydration: render everything so the text ships in the HTML.
const displayLines = ref<Line[]>([...fullLines])
const activeCmd = ref<string | null>(null)
const showPrompt = ref(props.showFinalPrompt)
const status = ref<'idle' | 'busy' | 'done'>('idle')

function setStatus(s: 'idle' | 'busy' | 'done') {
  status.value = s
  emit('status', s)
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
let generation = 0

async function play() {
  const gen = ++generation
  setStatus('busy')
  displayLines.value = []
  activeCmd.value = null
  showPrompt.value = false

  for (const s of props.steps) {
    if (gen !== generation) return
    if (s.cmd) {
      activeCmd.value = ''
      for (let i = 0; i < s.cmd.length; i++) {
        if (gen !== generation) return
        activeCmd.value = s.cmd.slice(0, i + 1)
        await sleep(26 + Math.random() * 40)
      }
      displayLines.value.push({
        html: `<span class="prompt">$</span> <span class="c-bone">${escapeHtml(s.cmd)}</span>`,
      })
      activeCmd.value = null
      await sleep(220)
    } else {
      displayLines.value.push(staticLine(s))
      await sleep(s.d ?? 140)
    }
  }
  if (gen !== generation) return
  if (props.showFinalPrompt) showPrompt.value = true
  setStatus('done')
}

function replay() {
  play()
}
defineExpose({ replay })

let observer: IntersectionObserver | null = null
const root = ref<HTMLElement | null>(null)

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    // Keep the fully-rendered static state; nothing to animate.
    setStatus('done')
    return
  }
  if (!props.autoplay) return

  // Start blank, then play once scrolled into view (cascaded if requested).
  displayLines.value = []
  showPrompt.value = false

  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          observer?.disconnect()
          setTimeout(play, props.cascadeDelay)
        }
      }
    },
    { threshold: 0.35 },
  )
  if (root.value) observer.observe(root.value)
})

onBeforeUnmount(() => {
  generation++
  observer?.disconnect()
})
</script>

<template>
  <pre
    ref="root"
    class="term-body thin min-h-0 flex-1 overflow-auto px-4 py-3.5 font-mono leading-[1.75]"
    :aria-label="ariaLabel || undefined"
  ><div
      v-for="(line, i) in displayLines"
      :key="i"
      class="tline"
      :class="line.cls"
      v-html="line.html"
    /><div v-if="activeCmd !== null" class="tline"><span class="prompt">$</span> <span class="c-bone">{{ activeCmd }}</span><span class="cursor">▍</span></div><div v-if="showPrompt" class="tline"><span class="prompt">$</span> <span class="cursor">▍</span></div></pre>
</template>
