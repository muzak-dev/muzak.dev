<template>
  <section id="bench" class="border-b border-line scroll-mt-16" aria-labelledby="bench-title">
    <div class="mx-auto max-w-[1200px] px-4 sm:px-6 py-16 md:py-24">
      <div class="reveal max-w-3xl">
        <p class="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Benchmarks</p>
        <h2
          id="bench-title"
          class="text-[clamp(1.9rem,3.6vw,2.6rem)] font-semibold tracking-[-0.02em]"
        >
          Compiled once, not per request
        </h2>
      </div>
      <p class="reveal mt-4 max-w-xl text-[14.5px] leading-relaxed text-ash">
        Apple M1 Pro, darwin/arm64, Go 1.27, medians of three runs. Every case drives the real code
        path through <span class="font-mono text-[12.5px] text-bone">App.ServeHTTP</span>, so
        routing, binding, dependencies and encoding are all included.
      </p>

      <!-- animated counters -->
      <div
        class="reveal mt-10 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line lg:grid-cols-4"
      >
        <div class="bg-ink2 p-5 sm:p-6">
          <div class="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">Route match</div>
          <div class="mt-3 flex items-baseline gap-1">
            <CountStat
              :to="64"
              class="font-mono text-[clamp(2rem,4.4vw,2.9rem)] font-medium leading-none text-bone"
            />
            <span class="font-mono text-[15px] font-medium leading-none text-patina">ns</span>
          </div>
          <div class="mt-2.5 font-mono text-[11px] text-ash">static, 17-route tree</div>
        </div>
        <div class="bg-ink2 p-5 sm:p-6">
          <div class="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            Allocations
          </div>
          <div class="mt-3 flex items-baseline gap-1">
            <CountStat
              :to="0"
              class="font-mono text-[clamp(2rem,4.4vw,2.9rem)] font-medium leading-none text-bone"
            />
          </div>
          <div class="mt-2.5 font-mono text-[11px] text-ash">per route lookup</div>
        </div>
        <div class="bg-ink2 p-5 sm:p-6">
          <div class="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            Full request
          </div>
          <div class="mt-3 flex items-baseline gap-1">
            <CountStat
              :to="546"
              class="font-mono text-[clamp(2rem,4.4vw,2.9rem)] font-medium leading-none text-bone"
            />
            <span class="font-mono text-[15px] font-medium leading-none text-patina">ns</span>
          </div>
          <div class="mt-2.5 font-mono text-[11px] text-ash">
            vs <span class="text-bone">608</span> for ServeMux
          </div>
        </div>
        <div class="bg-ink2 p-5 sm:p-6">
          <div class="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            Dependencies
          </div>
          <div class="mt-3 flex items-baseline gap-1">
            <CountStat
              :to="0"
              class="font-mono text-[clamp(2rem,4.4vw,2.9rem)] font-medium leading-none text-bone"
            />
          </div>
          <div class="mt-2.5 font-mono text-[11px] text-ash">third party, anywhere</div>
        </div>
      </div>

      <!-- chart + datasheet -->
      <div class="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <!-- throughput chart -->
        <div class="reveal overflow-hidden border border-line bg-ink2">
          <div
            class="shrink-0 flex items-center justify-between border-b border-line bg-ink3 px-3.5 py-2 font-mono text-[11px]"
          >
            <div class="flex items-center gap-2.5">
              <span class="grid h-3.5 w-3.5 place-items-center bg-rust"
                ><span class="h-1 w-1 bg-ink"
              /></span>
              <span class="text-bone">OPERATION COST</span>
              <span class="text-faint">lower is better</span>
            </div>
            <span class="text-faint">ns / op</span>
          </div>
          <div class="px-3 pt-3 pb-1.5">
            <BenchChart />
          </div>
        </div>

        <!-- material datasheet -->
        <div class="reveal overflow-hidden border border-line bg-ink2">
          <div
            class="shrink-0 flex items-center justify-between border-b border-line bg-ink3 px-3.5 py-2 font-mono text-[11px]"
          >
            <div class="flex items-center gap-2.5">
              <span class="grid h-3.5 w-3.5 place-items-center bg-rust"
                ><span class="h-1 w-1 bg-ink"
              /></span>
              <span class="text-bone">MATERIAL DATASHEET</span>
            </div>
            <span class="text-faint">rev 0.1.0</span>
          </div>
          <div class="font-mono text-[12px]">
            <div class="flex items-center justify-between border-b border-line px-4 py-3">
              <span class="text-ash">Param lookup</span
              ><span class="text-bone">80.5 <span class="text-patina">ns</span></span>
            </div>
            <div class="flex items-center justify-between border-b border-line px-4 py-3">
              <span class="text-ash">Validation, 8 rule sets</span
              ><span class="text-bone">0.77 <span class="text-patina">µs</span></span>
            </div>
            <div class="flex items-center justify-between border-b border-line px-4 py-3">
              <span class="text-ash">WebSocket masking</span
              ><span class="text-bone">13.5 <span class="text-brass">GB/s</span></span>
            </div>
            <div class="flex items-center justify-between border-b border-line px-4 py-3">
              <span class="text-ash">Statement coverage</span
              ><span class="text-patina">98.7%</span>
            </div>
            <div class="flex items-center justify-between px-4 py-3">
              <span class="text-ash">Runtime</span><span class="text-bone">net/http · Go 1.27</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
