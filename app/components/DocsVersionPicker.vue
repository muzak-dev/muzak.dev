<script setup lang="ts">
import { DOCS_VERSIONS, docsPath, splitDocsPath } from '#shared/docsVersions'
import type { DocsVersion } from '#shared/docsVersions'

// Docs version picker. The selection is the URL, not local state: every page
// lives under `/docs/<version>/`, so switching version is a navigation to the
// same page in another tree.
//
// A page does not have to exist in both. When the equivalent page is missing
// from the version being switched to - it was added later, renamed, or removed
// - the reader is taken to that version's first page instead, which is the only
// honest destination: pretending the page exists would 404 them.
//
// The dropdown is a glassmorphism panel (see .version-popper in tailwind.css).
//
// `eager-mount` matters here. floating-vue only mounts the popper slot once the
// dropdown is shown, so without it the glass panel is painted a frame before
// the list inside it exists, and the background visibly arrives first.
const route = useRoute()
const current = useDocsVersion()
const { data: nav } = await useDocsNav()

const versions = DOCS_VERSIONS
const display = computed(() => {
  const active = versions.find((v) => v.version === current.value)
  return active?.label ? `${active.version} - ${active.label}` : (active?.version ?? current.value)
})

// Where a given version's copy of the current page lives, falling back to that
// version's first page when it has no copy of it.
function targetFor(version: string): string {
  const { rest } = splitDocsPath(route.path)
  const equivalent = docsPath(version, rest)
  const exists = docLeaves(nav.value, version).some((leaf) => leaf.path === equivalent)
  return exists ? equivalent : (firstDocLeaf(nav.value, version) ?? docsPath(version))
}

async function pick(ver: DocsVersion) {
  if (ver.version === current.value) {
    return
  }
  await navigateTo(targetFor(ver.version))
}
</script>

<template>
  <VDropdown
    :distance="6"
    placement="bottom-start"
    popper-class="version-popper"
    class="mb-3 block"
    eager-mount
  >
    <button
      type="button"
      class="flex w-full cursor-pointer items-center justify-between gap-2 bg-ink2 px-3 py-2.5 font-mono text-[0.625rem] text-ash transition-colors hover:text-bone"
      aria-label="Select documentation version"
    >
      <span class="flex items-center gap-2">
        <span class="h-1.5 w-1.5 rounded-full bg-patina shadow-[0_0_8px_#6FB3A3]" />
        <span class="text-bone">{{ display }}</span>
      </span>
      <Icon name="lucide:chevrons-up-down" size="12" class="text-faint" aria-hidden="true" />
    </button>

    <template #popper="{ hide }">
      <ul class="flex flex-col gap-0.5">
        <li v-for="ver in versions" :key="ver.version">
          <button
            type="button"
            class="flex w-full cursor-pointer items-center justify-between gap-3 px-2.5 py-1.5 font-mono text-[0.6875rem] transition-colors"
            :class="
              current === ver.version
                ? 'bg-white/5 text-rust'
                : 'text-ash hover:bg-white/5 hover:text-bone'
            "
            @click="pick(ver); hide()"
          >
            <span class="flex items-center gap-2">
              <span>{{ ver.version }}</span>
              <span
                v-if="ver.label"
                class="bg-rust/15 px-1.5 py-0.5 text-[0.5rem] font-semibold uppercase tracking-wider text-rust"
                >{{ ver.label }}</span
              >
            </span>
            <Icon v-if="current === ver.version" name="lucide:check" size="13" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </template>
  </VDropdown>
</template>
