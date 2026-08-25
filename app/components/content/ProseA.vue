<script setup lang="ts">
import { withDocsVersion } from '#shared/docsVersions'

// Link renderer for markdown prose.
//
// Documentation is authored with unversioned links (`/docs/techniques/json`),
// because a version is cut by copying the tree and rewriting 133 links in every
// copy is not a thing anyone should do. The version the reader is in is
// therefore added here, at render time: a link followed inside the 0.2.2 docs
// lands on the 0.2.2 page rather than dropping the reader into the newest one
// halfway through a sentence.
//
// A link that already names a version is left alone, which is how one page
// deliberately points at another version. Anything that is not a docs path,
// including every external link and every anchor, passes straight through.
const props = defineProps<{
  href?: string
  target?: string | null
}>()

const version = useDocsVersion()
const to = computed(() => withDocsVersion(props.href ?? '', version.value))
const external = computed(() => /^(https?:)?\/\//.test(props.href ?? '') || !!props.target)
</script>

<template>
  <a v-if="external" :href="href" :target="target || '_blank'" rel="noopener noreferrer">
    <slot />
  </a>
  <NuxtLink v-else :to="to">
    <slot />
  </NuxtLink>
</template>
