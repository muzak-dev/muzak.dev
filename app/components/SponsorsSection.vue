<script setup lang="ts">
import { SPONSORS as sponsors, SPONSOR_MARKS as MARKS } from '~/utils/sponsors'
</script>

<template>
  <section id="sponsors" class="border-b border-line scroll-mt-16" aria-labelledby="sponsors-title">
    <div class="mx-auto max-w-[1200px] px-4 sm:px-6 py-14 md:py-20">
      <div class="flex flex-col items-center text-center">
        <p class="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Backed &amp; sponsored by</p>
        <h2 id="sponsors-title" class="mt-3 text-[clamp(1.4rem,2.6vw,1.9rem)] font-semibold tracking-[-0.02em]">
          Forged with good company
        </h2>
      </div>
    </div>

    <!-- marquee -->
    <div class="marquee-wrap relative overflow-hidden border-y border-line bg-ink2/40 py-1">
      <div class="marquee">
        <div v-for="track in 2" :key="track" class="marquee-track" aria-hidden="true">
          <a v-for="s in sponsors" :key="s.n" href="#sponsors" class="spon">
            <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" style="flex: 0 0 auto" v-html="MARKS[s.m]" />
            <span class="flex flex-col leading-tight" style="min-width: 0">
              <span class="spon-name font-mono text-[13px] font-semibold tracking-tight text-ash transition-colors">{{ s.n }}</span>
              <span class="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">{{ s.t }}</span>
            </span>
          </a>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-[1200px] px-4 sm:px-6 py-6 text-center">
      <p class="font-mono text-[11px] text-faint">
        Open source under MIT / Apache-2.0 · sustained by the people who ship on it.
      </p>
    </div>
  </section>
</template>
