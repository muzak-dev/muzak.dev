<script setup lang="ts">
import { LATEST_DOCS_VERSION, docsPath } from '#shared/docsVersions'

definePageMeta({ layout: 'docs' })

// Bare /docs → the first page of the newest version, in menu order. The
// redirect is 302 rather than 301 because the target moves with every release,
// and a permanent redirect is one a browser never asks about again.
const { data: nav } = await useDocsNav()
const target =
  firstDocLeaf(nav.value, LATEST_DOCS_VERSION) ||
  docsPath(LATEST_DOCS_VERSION, 'getting-started/introduction')
await navigateTo(target, { replace: true, redirectCode: 302 })
</script>

<template>
  <div />
</template>
