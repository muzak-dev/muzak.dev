<script setup lang="ts">
import { TERMINAL_SCRIPTS, LIFECYCLE_ORDER } from '~/utils/terminalScripts'

const lifecycle = [
  { index: '01', title: 'start', key: 'm1' },
  { index: '02', title: 'answer', key: 'm2' },
  { index: '03', title: 'refuse', key: 'm3' },
  { index: '04', title: 'describe', key: 'm4' },
  { index: '05', title: 'drain', key: 'm5' },
]
</script>

<template>
  <section id="install" class="border-b border-line scroll-mt-16" aria-labelledby="install-title">
    <div class="mx-auto max-w-[1200px] px-4 sm:px-6 py-16 md:py-24">
      <div class="reveal max-w-2xl">
        <p class="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Installation</p>
        <h2
          id="install-title"
          class="text-[clamp(1.7rem,3.2vw,2.3rem)] font-semibold tracking-[-0.02em]"
        >
          One module, then a running API
        </h2>
        <p class="mt-4 text-[14.5px] leading-relaxed text-ash">
          Add the module, lay the project out so
          <span class="font-mono text-[12.5px] text-bone">cmd/main.go</span> does nothing but
          compose, and run it. Each card below plays a real command and the output Muzak actually
          prints, from the first request to a graceful shutdown.
        </p>
      </div>

      <!-- install + layout -->
      <div class="mt-9 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ReplayTerminalCard
          tag="install"
          subtitle="go get"
          term-key="get"
          :steps="TERMINAL_SCRIPTS.get"
        />
        <ReplayTerminalCard
          tag="layout"
          subtitle="cmd/main.go"
          term-key="layout"
          :steps="TERMINAL_SCRIPTS.layout"
        />
      </div>

      <!-- application lifecycle -->
      <div class="reveal mt-12 mb-5 flex items-center gap-4">
        <span class="font-mono text-[11px] uppercase tracking-[0.2em] text-faint"
          >The application lifecycle</span
        >
        <span class="h-px flex-1 bg-line" />
      </div>

      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <LifecycleCard
          v-for="step in lifecycle"
          :key="step.key"
          :index="step.index"
          :title="step.title"
          :term-key="step.key"
          :steps="TERMINAL_SCRIPTS[step.key]"
          :cascade-delay="LIFECYCLE_ORDER[step.key] * 620"
        />

        <!-- note card -->
        <div
          class="reveal flex h-[126px] flex-col justify-center border border-line2/60 bg-ink2/60 px-4 py-3"
        >
          <span class="font-mono text-[10px] uppercase tracking-[0.16em] text-patina"
            >› safe by default</span
          >
          <p class="mt-2 text-[12px] leading-relaxed text-ash">
            Timeouts are non-zero, bodies are capped, unknown JSON members are
            <span class="text-bone">rejected</span>, and CORS denies everything until a policy is
            written. Relaxing any of it is a decision you make out loud.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
