<script setup lang="ts">
// Real numbers from the framework's own benchmark suite (BENCHMARKS.md):
// Apple M1 Pro, darwin/arm64, Go 1.27, median ns/op of three runs at
// -benchtime=500ms. The ServeMux row is the baseline: a bare net/http handler
// doing the same work by hand, which is what makes the framework row mean
// something.
interface Bar {
  label: string
  ns: number
  /** The hand-written net/http baseline, drawn in a muted colour. */
  baseline?: boolean
}

const BARS: Bar[] = [
  { label: 'lookup, static', ns: 64.4 },
  { label: 'lookup, param', ns: 80.5 },
  { label: 'route, bare', ns: 545.6 },
  { label: 'http.ServeMux', ns: 608.1, baseline: true },
  { label: 'bind path+query', ns: 1403 },
  { label: 'bind JSON body', ns: 3063 },
]

const MAX = 3063
const PAD_L = 108
const PAD_R = 56
const WIDTH = 600
const ROW_H = 30
const TOP = 14
const PLOT_W = WIDTH - PAD_L - PAD_R

/** Bar width in user units, with a floor so the fastest rows stay visible. */
function widthOf(ns: number): number {
  return Math.max(3, (ns / MAX) * PLOT_W)
}

function yOf(i: number): number {
  return TOP + i * ROW_H
}

/** `64.4` reads better than `64.400`, and `3063` better than `3063.0`. */
function format(ns: number): string {
  return ns >= 1000 ? String(Math.round(ns)) : ns.toFixed(1)
}

const svg = ref<SVGSVGElement | null>(null)

onMounted(() => {
  const el = svg.value
  if (!el) return
  const bars = [...el.querySelectorAll<SVGRectElement>('.bar')]
  if (!bars.length) return

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    for (const bar of bars) bar.style.width = bar.dataset.w ?? '0'
    return
  }

  const draw = () => {
    bars.forEach((bar, i) => {
      const target = Number(bar.dataset.w ?? 0)
      const dur = 900
      const delay = i * 90
      const t0 = performance.now() + delay
      const frame = (now: number) => {
        const p = Math.min(Math.max((now - t0) / dur, 0), 1)
        const e = 1 - Math.pow(1 - p, 3) // easeOutCubic
        bar.setAttribute('width', String(target * e))
        if (p < 1) requestAnimationFrame(frame)
      }
      requestAnimationFrame(frame)
    })
  }

  const obs = new IntersectionObserver(
    (entries) => {
      for (const ent of entries) {
        if (ent.isIntersecting) {
          obs.disconnect()
          draw()
        }
      }
    },
    { threshold: 0.4 },
  )
  obs.observe(el)
})
</script>

<template>
  <svg
    ref="svg"
    class="bench-chart w-full"
    viewBox="0 0 600 200"
    role="img"
    aria-label="Nanoseconds per operation: static route lookup 64.4, param lookup 80.5, a bare framework route 545.6, a hand-written net/http ServeMux handler doing the same work 608.1, binding path and query 1403, binding a JSON body 3063"
  >
    <!-- gridlines at a quarter of the scale -->
    <g stroke="#272320" stroke-width="1">
      <line v-for="q in 4" :key="q" :x1="PAD_L + (q / 4) * PLOT_W" y1="8" :x2="PAD_L + (q / 4) * PLOT_W" y2="186" />
    </g>

    <g font-family="'JetBrains Mono', monospace" font-size="10">
      <g v-for="(bar, i) in BARS" :key="bar.label">
        <text :x="PAD_L - 8" :y="yOf(i) + 12" text-anchor="end" :fill="bar.baseline ? '#6A645B' : '#9A9287'">
          {{ bar.label }}
        </text>
        <rect
          class="bar"
          :data-w="widthOf(bar.ns)"
          :x="PAD_L"
          :y="yOf(i) + 3"
          width="0"
          height="12"
          :fill="bar.baseline ? '#3A342E' : '#E2562A'"
        />
        <text
          :x="PAD_L + widthOf(bar.ns) + 8"
          :y="yOf(i) + 12"
          :fill="bar.baseline ? '#6A645B' : '#E9E4DA'"
        >
          {{ format(bar.ns) }}
        </text>
      </g>
      <text :x="PAD_L" y="196" fill="#6A645B">0</text>
      <text :x="PAD_L + PLOT_W" y="196" text-anchor="end" fill="#6A645B">3063 ns</text>
    </g>
  </svg>
</template>
