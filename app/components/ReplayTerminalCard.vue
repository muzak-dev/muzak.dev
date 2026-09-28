<script setup lang="ts">
import type { TermStep } from '~/utils/terminalScripts'

defineProps<{
  tag: string
  subtitle: string
  termKey: string
  steps: TermStep[]
}>()

const term = ref<{ replay: () => void } | null>(null)
</script>

<template>
  <div class="flex h-[218px] flex-col overflow-hidden border border-line bg-ink2">
    <div
      class="flex items-center justify-between shrink-0 border-b border-line bg-ink3 px-3.5 py-2 font-mono text-[11px] text-ash"
    >
      <div class="flex items-center gap-2.5">
        <span class="font-mono text-[10px] uppercase tracking-[0.16em] text-rust">{{ tag }}</span>
        <span class="text-faint">{{ subtitle }}</span>
      </div>
      <button
        type="button"
        class="replay group flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-faint transition-colors hover:text-bone"
        @click="term?.replay()"
      >
        <Icon
          name="lucide:rotate-ccw"
          size="11"
          class="transition-transform group-hover:-rotate-45"
          aria-hidden="true"
        />
        replay
      </button>
    </div>
    <TerminalPlayer ref="term" :term-key="termKey" :steps="steps" class="text-[12.5px]" />
  </div>
</template>
