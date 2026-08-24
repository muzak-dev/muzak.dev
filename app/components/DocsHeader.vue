<script setup lang="ts">
// Shared with the sidebar so the mobile toggle controls its visibility.
const navOpen = useState<boolean>('docsNavOpen')

// Same repository link and star count as the landing header. The shared fetch
// key means both headers cost one request between them.
const repo = 'https://github.com/muzak-dev/framework'
const discord = 'https://discord.gg/z3UzJdGQD6'
const { data: github } = await useGithubStars()
const stars = computed(() => (github.value?.stars == null ? null : formatCount(github.value.stars)))
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur supports-[backdrop-filter]:bg-ink/70"
  >
    <div class="mx-auto flex h-12 max-w-[1400px] items-center gap-6 px-4 sm:px-6">
      <NuxtLink to="/" class="group flex items-center gap-2" aria-label="Muzak home">
        <img
          src="/logo.png"
          alt="Muzak logo"
          width="26"
          height="26"
          class="h-[26px] w-[26px] shrink-0 object-contain drop-shadow-[0_0_18px_rgba(226,86,42,.35)]"
        >
        <span class="font-mono text-[14px] font-semibold tracking-tight">muzak</span>
      </NuxtLink>

      <div class="ml-auto flex items-center gap-3 font-mono text-[11px]">
        <span class="flex h-7 items-center px-2 text-ash">v0.2.0</span>

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

        <button
          type="button"
          class="border border-line2 p-1.5 text-ash md:hidden"
          aria-label="Toggle navigation"
          :aria-expanded="navOpen"
          @click="navOpen = !navOpen"
        >
          <Icon name="lucide:menu" size="14" aria-hidden="true" />
        </button>
      </div>
    </div>
  </header>
</template>
