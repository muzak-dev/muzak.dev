<script setup lang="ts">
import { SPONSORS, SPONSOR_MARKS, SHOW_SPONSORS } from '~/utils/sponsors'

interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

const props = defineProps<{ links?: TocLink[] }>()
const route = useRoute()

// Gold (premium) sponsors first so they lead the rail.
const sortedSponsors = computed(() =>
  [...SPONSORS].sort((a, b) => Number(b.gold ?? false) - Number(a.gold ?? false)),
)

// Flatten to h2 + h3 so deep trees still produce a usable rail.
const flat = computed<TocLink[]>(() => {
  const out: TocLink[] = []
  for (const l of props.links ?? []) {
    out.push(l)
    for (const c of l.children ?? []) out.push(c)
  }
  return out
})

const activeId = ref<string | null>(null)
let headings: HTMLElement[] = []
let mutation: MutationObserver | null = null

// Re-resolve the heading elements from the DOM (content may have just swapped).
function refresh() {
  headings = flat.value
    .map((l) => document.getElementById(l.id))
    .filter((el): el is HTMLElement => !!el)
  update()
}

// Active = the last heading whose top has scrolled above the offset line.
function update() {
  if (!headings.length) {
    activeId.value = flat.value[0]?.id ?? null
    return
  }
  const offset = 120
  let current = headings[0].id
  for (const el of headings) {
    if (el.getBoundingClientRect().top - offset <= 0) current = el.id
    else break
  }
  // At the very bottom, force the last entry active.
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
    current = headings[headings.length - 1].id
  }
  activeId.value = current
}

let ticking = false
function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    update()
    ticking = false
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })

  // Refresh whenever the rendered article changes (i.e. on every navigation).
  const article = document.getElementById('main-doc')
  if (article) {
    mutation = new MutationObserver(() => refresh())
    mutation.observe(article, { childList: true, subtree: true })
  }
  nextTick(refresh)
})

watch(
  () => props.links,
  () => nextTick(refresh),
)
watch(
  () => route.path,
  () => {
    activeId.value = null
    nextTick(refresh)
  },
)

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  mutation?.disconnect()
})
</script>

<template>
  <aside class="hidden py-10 pl-8 xl:block">
    <div class="thin sticky top-16 max-h-[calc(100vh-5rem)] overflow-y-auto pr-1">
      <!-- on this page -->
      <template v-if="flat.length">
        <p class="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">On this page</p>
        <ul class="space-y-2.5 font-mono text-[12px]">
          <li
            v-for="link in flat"
            :key="link.id"
            :style="link.depth >= 3 ? 'padding-left:0.85rem' : ''"
          >
            <a
              :href="`#${link.id}`"
              :title="link.text"
              class="toc-link flex min-w-0 items-center gap-2 text-ash transition-colors hover:text-bone"
              :data-active="activeId === link.id ? 'true' : 'false'"
            >
              <span class="toc-bar h-px w-2 shrink-0 bg-line2 transition-all" />
              <span class="truncate">{{ link.text }}</span>
            </a>
          </li>
        </ul>
      </template>

      <!-- Off for the first release; see SHOW_SPONSORS in utils/sponsors.ts. -->
      <section
        v-if="SHOW_SPONSORS"
        :class="flat.length ? 'mt-8 border-t border-line pt-6' : ''"
        aria-label="Sponsors"
      >
        <p class="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">Sponsors</p>
        <div class="grid grid-cols-2 gap-2">
          <a
            v-for="s in sortedSponsors"
            :key="s.n"
            href="/#sponsors"
            :title="`${s.n} · ${s.t}`"
            class="group flex flex-col items-center gap-1.5 border p-2.5 text-center transition-colors"
            :class="
              s.gold
                ? 'border-brass/40 bg-[linear-gradient(180deg,rgba(201,162,75,.13),rgba(201,162,75,.03))]  hover:border-brass/70'
                : 'border-line bg-ink2 hover:border-rust2 hover:bg-ink3'
            "
          >
            <span
              class="w-full truncate font-mono text-[11.5px] font-medium"
              :class="s.gold ? 'text-brass' : 'text-ash group-hover:text-bone'"
              >{{ s.n }}</span
            >
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              class="transition-colors"
              :class="s.gold ? 'text-brass' : 'text-faint group-hover:text-rust'"
              aria-hidden="true"
              v-html="SPONSOR_MARKS[s.m]"
            />
            <span
              class="w-full truncate font-mono text-[8.5px] uppercase tracking-[0.12em]"
              :class="s.gold ? 'text-brass/80' : 'text-faint'"
              >{{ s.t }}</span
            >
          </a>
        </div>
        <a
          href="/#sponsors"
          class="mt-3 inline-block font-mono text-[10px] uppercase tracking-wider text-faint transition-colors hover:text-rust"
          >Become a sponsor →</a
        >
      </section>
    </div>
  </aside>
</template>
