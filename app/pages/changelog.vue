<script setup lang="ts">
import { LATEST_DOCS_VERSION } from '#shared/docsVersions'

// The framework's changelog, read from its own repository when the site is
// built (see content.config.ts). It is one page rather than one per version:
// what a reader wants here is the whole history in order, and the versioned
// documentation is where a single release's behaviour is described.

const { data: page } = await useAsyncData('changelog', () =>
  queryCollection('changelog').first(),
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Changelog not found', fatal: true })
}

// Every release is a level-two heading, so the table of contents is the
// release list. "Unreleased" is dropped when it holds nothing, which is what
// it looks like the moment a version is cut.
interface Release {
  id: string
  version: string
  date: string
  unreleased: boolean
}

// The document body as MDC nodes, used to tell a heading with entries under
// it from one with nothing yet.
const nodes = computed<unknown[]>(() => {
  const body = page.value?.body as { value?: unknown[] } | undefined
  return body?.value ?? []
})

/** Whether anything is written under a heading before the next one starts. */
function hasEntries(id: string): boolean {
  const list = nodes.value
  const isHeading = (node: unknown) => Array.isArray(node) && node[0] === 'h2'
  const index = list.findIndex(
    node => isHeading(node) && (node as [string, { id?: string }])[1]?.id === id,
  )
  if (index < 0) {
    return false
  }
  const next = list[index + 1]
  return next !== undefined && !isHeading(next)
}

const releases = computed<Release[]>(() => {
  const links = page.value?.body?.toc?.links ?? []
  return links
    .map((link) => {
      const text = String(link.text ?? '')
      const [version = text, date = ''] = text.split(' - ')
      return {
        id: String(link.id ?? ''),
        version: version.replace(/[[\]]/g, '').trim(),
        date: date.trim(),
        unreleased: /unreleased/i.test(text),
      }
    })
    // An empty "Unreleased" is the normal state the moment a version is cut,
    // and a rail entry linking to a heading with nothing under it is a dead
    // end. It comes back on its own with the next entry written.
    .filter(release => release.id && (!release.unreleased || hasEntries(release.id)))
})

/** The newest actual release, which is what carries the badge. */
const latestId = computed(() => releases.value.find(release => !release.unreleased)?.id ?? '')

const site = 'https://muzak.dev'
useSeoMeta({
  title: 'Changelog · Muzak',
  description:
    'Every release of the Muzak framework, what it added, what it changed, and the migration for each breaking change.',
  ogType: 'article',
  ogTitle: 'Changelog · Muzak',
  ogDescription: 'Every release of the Muzak framework, and the migration for each breaking change.',
  ogUrl: `${site}/changelog`,
  twitterCard: 'summary_large_image',
  robots: 'index, follow',
})
useHead({
  htmlAttrs: { lang: 'en' },
  link: [{ rel: 'canonical', href: `${site}/changelog` }],
})
defineOgImageComponent('Muzak', {
  title: 'Changelog',
  description: `Every release of the framework, up to v${LATEST_DOCS_VERSION}.`,
})
</script>

<template>
  <div class="min-h-screen">
    <TheHeader />

    <main class="mx-auto max-w-[1200px] px-4 sm:px-6 py-14">
      <header class="border-b border-line pb-8">
        <p class="font-mono text-[11px] uppercase tracking-[0.22em] text-rust">Releases</p>
        <h1 class="mt-4 text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          Changelog
        </h1>
        <p class="mt-4 max-w-xl text-[14.5px] leading-relaxed text-ash">
          Every release of the framework, newest first. It is read from
          <a
            href="https://github.com/muzak-dev/framework/blob/main/CHANGELOG.md"
            rel="noopener"
            target="_blank"
            class="text-bone underline decoration-line2 underline-offset-4 hover:decoration-rust"
            >CHANGELOG.md</a
          >
          when this site is built, so it says exactly what the repository says.
        </p>
      </header>

      <div class="grid grid-cols-1 gap-10 pt-10 lg:grid-cols-[200px_1fr]">
        <!-- the release rail -->
        <nav v-if="releases.length" class="hidden lg:block" aria-label="Releases">
          <ul class="sticky top-24 flex flex-col gap-1 border-l border-line pl-4">
            <li v-for="release in releases" :key="release.id">
              <a
                :href="`#${release.id}`"
                class="flex items-baseline gap-2 py-1 font-mono text-[11.5px] text-ash transition-colors hover:text-bone"
              >
                <span>{{ release.version }}</span>
                <span
                  v-if="release.id === latestId"
                  class="bg-rust/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-rust"
                  >latest</span
                >
              </a>
            </li>
          </ul>
        </nav>

        <article id="main-doc" class="prose-muzak min-w-0">
          <ContentRenderer v-if="page" :value="page" />
        </article>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
