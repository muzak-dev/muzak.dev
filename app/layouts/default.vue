<template>
  <div class="relative min-h-screen bg-ink text-bone font-sans text-[13px] leading-relaxed antialiased">
    <!-- ambient warm vignette -->
    <div
      class="pointer-events-none fixed inset-0 z-0"
      style="background: radial-gradient(120% 80% at 72% -12%, rgba(226, 86, 42, 0.07), transparent 55%)"
    />

    <TheHeader />

    <slot />
  </div>
</template>
