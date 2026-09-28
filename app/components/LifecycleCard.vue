<script setup lang="ts">
import type { TermStep } from '~/utils/terminalScripts'

defineProps<{
  index: string
  title: string
  termKey: string
  steps: TermStep[]
  cascadeDelay?: number
}>()

const status = ref<'idle' | 'busy' | 'done'>('idle')
</script>

<template>
  <div class="flex h-[126px] flex-col overflow-hidden border border-line bg-ink2">
    <div
      class="flex items-center justify-between shrink-0 border-b border-line bg-ink3 px-3.5 py-2 font-mono text-[11px]"
    >
      <span class="text-ash"><span class="text-faint">{{ index }} ·</span> {{ title }}</span>
      <StatusDot :status="status" />
    </div>
    <TerminalPlayer
      :term-key="termKey"
      :steps="steps"
      :cascade-delay="cascadeDelay"
      class="text-[12px] leading-[1.7]"
      @status="status = $event"
    />
  </div>
</template>
