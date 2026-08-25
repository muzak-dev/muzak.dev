<script setup lang="ts">
const navbar = ref<HTMLElement | null>(null)

const nav = [
  { href: '#install', label: 'install' },
  { href: '#contract', label: 'contract' },
  { href: '#bench', label: 'benchmarks' },
  // The sponsors section is off for the first release, so the anchor that
  // pointed at it would scroll nowhere. See SHOW_SPONSORS in utils/sponsors.ts.
  { href: '#faq', label: 'faq' },
]

const repo = 'https://github.com/muzak-dev/framework'
const discord = 'https://discord.gg/z3UzJdGQD6'

// Resolved during SSR, so the count is in the HTML rather than popping in after
// hydration. A null count renders the icon alone.
const { data: github } = await useGithubStars()
const stars = computed(() => (github.value?.stars == null ? null : formatCount(github.value.stars)))

onMounted(() => {
  let ticking = false
  const sync = () => {
    navbar.value?.classList.toggle('nav-shrunk', window.scrollY > 20)
    ticking = false
  }
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(sync)
      ticking = true
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  sync()
  onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
})
</script>

<template>
  <header class="sticky top-2 z-40 mt-2 px-3 sm:px-4">
    <div
      id="navbar"
      ref="navbar"
      class="mx-auto flex items-center gap-6 px-6"
    >
      <nuxt-link to="/" class="group flex items-center gap-2" aria-label="Muzak home">
        <img
          src="/logo.png"
          alt="Muzak logo"
          width="26"
          height="26"
          class="h-[26px] w-[26px] shrink-0 object-contain drop-shadow-[0_0_18px_rgba(226,86,42,.35)]"
        >
        <span class="font-mono text-[14px] font-semibold tracking-tight">muzak</span>
      </nuxt-link>

      <nav
        class="ml-2 hidden items-center gap-1 font-mono text-[12px] text-ash md:flex"
        aria-label="Primary"
      >
        <a
          v-for="item in nav"
          :key="item.href"
          :href="item.href"
          class="px-2.5 py-1 transition-colors hover:text-bone"
          >{{ item.label }}</a
        >
        <nuxt-link to="/docs" class="px-2.5 py-1 transition-colors hover:text-bone">docs</nuxt-link>
        <nuxt-link to="/changelog" class="px-2.5 py-1 transition-colors hover:text-bone"
          >changelog</nuxt-link
        >
      </nav>

      <div class="ml-auto flex items-center gap-3 font-mono text-[11px]">
        <span class="flex h-7 items-center px-2 text-ash">v0.2.2</span>

        <a
          :href="discord"
          rel="noopener"
          target="_blank"
          aria-label="Discord"
          class="flex h-7 items-center px-2 text-ash transition-colors hover:bg-white/[0.08] hover:text-bone"
        >
          <Icon name="lineicons:discord" size="14" aria-hidden="true" />
        </a>

        <a
          :href="repo"
          rel="noopener"
          target="_blank"
          :aria-label="stars ? `GitHub, ${stars} stars` : 'GitHub'"
          class="flex h-7 items-center gap-1.5 px-2 text-ash transition-colors hover:bg-white/[0.08] hover:text-bone"
        >
          <Icon name="simple-icons:github" size="14" aria-hidden="true" />
          <span v-if="stars" class="tabular-nums">{{ stars }}</span>
        </a>

        <nuxt-link
          to="/docs"
          class="bg-rust px-3 py-1.5 font-mono text-[11px] font-semibold text-ink transition-colors hover:bg-[#f06436]"
          >get started</nuxt-link
        >
      </div>
    </div>
  </header>
</template>
