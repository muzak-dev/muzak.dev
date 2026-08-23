<template>
  <section id="contract" class="border-b border-line scroll-mt-16" aria-labelledby="contract-title">
    <div class="mx-auto max-w-[1200px] px-4 sm:px-6 py-16 md:py-24">
      <div class="reveal max-w-2xl">
        <p class="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-faint">The contract</p>
        <h2
          id="contract-title"
          class="text-[clamp(1.9rem,3.6vw,2.6rem)] font-semibold tracking-[-0.02em]"
        >
          Types in, types out
        </h2>
        <p class="mt-4 text-[14.5px] leading-relaxed text-ash">
          Struct tags say where each field is read from. The return type is the response model, with
          no wrapper and no filtering pass at run time, so a field you did not declare
          <span class="text-bone">cannot leak</span>. The same declarations produce the OpenAPI
          document.
        </p>
      </div>

      <div
        class="reveal mt-9 overflow-hidden border border-line bg-ink2 shadow-[0_30px_80px_-50px_rgba(0,0,0,.9)]"
      >
        <div class="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr]">
          <!-- left: the route -->
          <div class="border-b border-line lg:border-b-0 lg:border-r">
            <div
              class="flex items-center justify-between shrink-0 border-b border-line bg-ink3 px-3.5 py-2 font-mono text-[11px] text-ash"
            >
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-rust2/80" />
                <span class="h-2 w-2 rounded-full bg-line2" />
                <span class="h-2 w-2 rounded-full bg-line2" />
                <span class="ml-2">routers/users.go</span>
              </div>
              <span class="font-mono text-[10px] uppercase tracking-wider text-faint">go</span>
            </div>
            <pre
              class="thin overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-[1.75]"
            ><code><span class="ln">1</span><span class="tok-kw">type</span> <span class="tok-ty">Params</span> <span class="tok-kw">struct</span> <span class="tok-pn">{</span>
<span class="ln">2</span>    Username <span class="tok-ty">string</span> <span class="tok-st">`path:"username" doc:"The user to look up"`</span>
<span class="ln">3</span><span class="tok-pn">}</span>
<span class="ln">4</span>
<span class="ln">5</span><span class="tok-kw">type</span> <span class="tok-ty">UserOut</span> <span class="tok-kw">struct</span> <span class="tok-pn">{</span>
<span class="ln">6</span>    Username <span class="tok-ty">string</span> <span class="tok-st">`json:"username"`</span>
<span class="ln">7</span>    Email    <span class="tok-ty">string</span> <span class="tok-st">`json:"email,omitzero"`</span>
<span class="ln">8</span><span class="tok-pn">}</span>
<span class="ln">9</span>
<span class="ln">10</span>r<span class="tok-pn">.</span><span class="tok-fn">Get</span><span class="tok-pn">(</span><span class="tok-st">"/users/{username}"</span><span class="tok-pn">,</span> <span class="tok-kw">func</span><span class="tok-pn">(</span>ctx <span class="tok-pn">*</span><span class="tok-ty">muzak.Context</span><span class="tok-pn">,</span> in <span class="tok-ty">Params</span><span class="tok-pn">)</span> <span class="tok-pn">(</span><span class="tok-ty">UserOut</span><span class="tok-pn">,</span> <span class="tok-ty">error</span><span class="tok-pn">)</span> <span class="tok-pn">{</span>
<span class="ln">11</span>    <span class="tok-kw">return</span> <span class="tok-ty">UserOut</span><span class="tok-pn">{</span>Username<span class="tok-pn">:</span> in<span class="tok-pn">.</span>Username<span class="tok-pn">},</span> <span class="tok-kw">nil</span>
<span class="ln">12</span><span class="tok-pn">})</span>  <span class="tok-cm">// type arguments inferred, never written</span></code></pre>
          </div>

          <!-- right: what it derives -->
          <div class="bg-ink2">
            <div
              class="flex items-center justify-between shrink-0 border-b border-line bg-ink3 px-3.5 py-2 font-mono text-[11px]"
            >
              <div class="flex items-center gap-2.5">
                <span class="grid h-3.5 w-3.5 place-items-center bg-rust"
                  ><span class="h-1 w-1 bg-ink"
                /></span>
                <span class="text-bone">DERIVED CONTRACT</span>
              </div>
              <span class="text-faint">openapi · 3.1</span>
            </div>
            <div class="font-mono text-[12px]">
              <div class="flex items-baseline justify-between gap-3 border-b border-line px-4 py-3">
                <span class="text-bone">username</span>
                <span class="flex gap-2 text-right"
                  ><span class="text-patina">in: path</span><span class="text-ash">required</span></span
                >
              </div>
              <div class="flex items-baseline justify-between gap-3 border-b border-line px-4 py-3">
                <span class="text-bone">200</span>
                <span class="flex gap-2 text-right"
                  ><span class="text-brass">UserOut</span><span class="text-ash"
                    >application/json</span
                  ></span
                >
              </div>
              <div class="flex items-baseline justify-between gap-3 border-b border-line px-4 py-3">
                <span class="text-bone">422</span>
                <span class="flex gap-2 text-right"
                  ><span class="text-brass">ErrorResponse</span><span class="text-ash"
                    >validation_error</span
                  ></span
                >
              </div>
              <div class="flex items-baseline justify-between gap-3 border-b border-line px-4 py-3">
                <span class="text-bone">operationId</span>
                <span class="text-right text-ash">get_users_by_username</span>
              </div>
              <div class="flex items-center gap-2 px-4 py-3 text-[11px] text-faint">
                <span class="text-patina">›</span> reflected once at build time ·
                <span class="text-ash">never on the request path</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- validation line -->
      <div class="reveal mt-5 overflow-hidden border border-line bg-ink2">
        <div
          class="flex items-center justify-between shrink-0 border-b border-line bg-ink3 px-3.5 py-2 font-mono text-[11px] text-ash"
        >
          <span>and the rules cannot drift from the document</span>
          <span class="font-mono text-[10px] uppercase tracking-wider text-faint">go</span>
        </div>
        <pre
          class="thin overflow-x-auto px-4 py-3.5 font-mono text-[12.5px] leading-[1.75]"
        ><code>v<span class="tok-pn">.</span><span class="tok-fn">String</span><span class="tok-pn">(&amp;</span>in<span class="tok-pn">.</span>Email<span class="tok-pn">).</span><span class="tok-fn">Trim</span><span class="tok-pn">().</span><span class="tok-fn">Lower</span><span class="tok-pn">().</span><span class="tok-fn">Required</span><span class="tok-pn">().</span><span class="tok-fn">Email</span><span class="tok-pn">()</span>
v<span class="tok-pn">.</span><span class="tok-fn">Slice</span><span class="tok-pn">(&amp;</span>in<span class="tok-pn">.</span>Tags<span class="tok-pn">).</span><span class="tok-fn">MaxItems</span><span class="tok-pn">(</span><span class="tok-nm">10</span><span class="tok-pn">).</span><span class="tok-fn">Unique</span><span class="tok-pn">().</span><span class="tok-fn">Each</span><span class="tok-pn">(</span>validate<span class="tok-pn">.</span><span class="tok-fn">String</span><span class="tok-pn">().</span><span class="tok-fn">MaxLen</span><span class="tok-pn">(</span><span class="tok-nm">20</span><span class="tok-pn">))</span>
<span class="tok-cm">// → "format": "email" · "maxItems": 10 · "uniqueItems": true · items.maxLength: 20</span>
<span class="tok-cm">// &amp;in.Email is the field, so renaming it is a change the compiler checks</span></code></pre>
      </div>
    </div>
  </section>
</template>
