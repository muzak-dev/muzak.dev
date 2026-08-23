<template>
  <footer class="border-t border-line">
    <div
      class="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 sm:px-6 py-7 font-mono text-[11px] text-faint sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex items-center gap-2">
        <img
          src="/logo.png"
          alt="Muzak logo"
          width="20"
          height="20"
          class="h-5 w-5 shrink-0 object-contain"
        >
        <span class="text-ash">muzak</span><span class="text-line2">·</span><span>v0.1.0</span>
      </div>
      <!-- This line used to close the sponsors section, which is off for the
           first release. It belongs on every page anyway. -->
      <span>Open source under MIT / Apache-2.0 · sustained by the people who ship on it.</span>
    </div>
  </footer>
</template>
