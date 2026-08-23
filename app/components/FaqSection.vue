<script setup lang="ts">
import { FAQ } from '~/utils/faq'
</script>

<template>
  <section id="faq" class="border-b border-line scroll-mt-16" aria-labelledby="faq-title">
    <div class="mx-auto max-w-[1200px] px-4 sm:px-6 py-16 md:py-24">
      <div class="reveal max-w-2xl">
        <p class="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-faint">FAQ</p>
        <h2 id="faq-title" class="text-[clamp(1.9rem,3.6vw,2.6rem)] font-semibold tracking-[-0.02em]">
          Questions, answered plainly
        </h2>
        <p class="mt-4 text-[14.5px] leading-relaxed text-ash">
          The short version of what Muzak is, how a route is written, and what it costs you at
          runtime.
        </p>
      </div>

      <div class="reveal mt-9 divide-y divide-line overflow-hidden border border-line bg-ink2">
        <details
          v-for="(item, i) in FAQ"
          :key="i"
          class="group"
          :open="i === 0"
        >
          <summary
            class="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[14.5px] font-medium text-bone transition-colors hover:bg-ink3"
          >
            <span>{{ item.q }}</span>
            <Icon
              name="lucide:plus"
              size="16"
              class="shrink-0 text-faint transition-transform group-open:rotate-45"
              aria-hidden="true"
            />
          </summary>
          <div class="px-5 py-5 text-[13.5px] leading-relaxed text-ash">
            {{ item.a }}
          </div>
        </details>
      </div>
    </div>
  </section>
</template>
