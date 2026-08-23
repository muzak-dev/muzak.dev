<script setup lang="ts">
const copied = ref(false)
const cmd = 'go get muzak.dev/framework'

async function copy() {
  try {
    await navigator.clipboard.writeText(cmd)
    copied.value = true
    setTimeout(() => (copied.value = false), 1400)
  } catch {
    /* clipboard unavailable, no-op */
  }
}
</script>

<template>
  <section class="relative overflow-hidden" aria-labelledby="cta-title">
    <div class="grid-bg pointer-events-none absolute inset-0 opacity-60" />
    <div class="relative mx-auto max-w-[1200px] px-4 sm:px-6 py-20 md:py-28 text-center">
      <h2
        id="cta-title"
        class="reveal mx-auto max-w-2xl text-[clamp(1.9rem,4vw,2.8rem)] font-semibold leading-[1.04] tracking-[-0.02em]"
      >
        Stop finding contract bugs in production.<br ><span class="text-ash">Start finding them at</span>
        <span class="text-rust">compile time</span>.
      </h2>
      <div
        class="reveal mx-auto mt-9 flex max-w-md items-center justify-between gap-3 border border-line2 bg-ink2 px-4 py-3 font-mono text-[13px]"
      >
        <span
          ><span class="text-faint select-none">$ </span><span class="text-bone">{{ cmd }}</span
          ><span class="cursor">▍</span></span
        >
        <button
          type="button"
          class="px-2.5 py-1 text-[10px] uppercase tracking-wider transition-colors"
          :class="copied ? 'text-patina' : 'text-faint hover:text-bone'"
          @click="copy"
        >
          {{ copied ? 'copied' : 'copy' }}
        </button>
      </div>
      <div class="reveal mt-7 flex flex-wrap items-center justify-center gap-3">
        <a
          href="/docs"
          class="bg-rust px-5 py-2.5 font-mono text-[12px] font-semibold text-ink transition-colors hover:bg-[#f06436]"
          >Read the docs →</a
        >
        <a
          href="https://github.com/muzak-dev/framework"
          rel="noopener"
          class="border border-line2 px-5 py-2.5 font-mono text-[12px] text-ash transition-colors hover:border-rust2 hover:text-bone"
          >Star on GitHub</a
        >
      </div>
    </div>

    <AppFooter />
  </section>
</template>
