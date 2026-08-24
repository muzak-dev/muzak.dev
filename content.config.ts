import { defineContentConfig, defineCollection, z } from '@nuxt/content'

// Two collections.
//
// `docs` is the documentation, versioned: files live under
// `content/docs/<version>/**`, folder = group, markdown file = page, and
// numeric filename prefixes (`1.`, `2.` …) only control ordering — they are
// stripped from the URL, while the version segment survives.
//
// `changelog` is the framework's own CHANGELOG.md, which lives in the
// framework's repository rather than in this one. Nuxt Content reads it from
// there when the site is built, so the page is current as of the last deploy
// and there is nothing to copy across on release day. It goes through the same
// markdown pipeline as everything else, which is what gives its code blocks
// the same highlighting and its headings the same anchors.
export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: 'docs/**',
      schema: z.object({
        description: z.string().optional(),
        // Optional short label for the sidebar (falls back to `title`).
        navTitle: z.string().optional(),
      }),
    }),

    changelog: defineCollection({
      type: 'page',
      source: {
        repository: 'https://github.com/muzak-dev/framework',
        include: 'CHANGELOG.md',
      },
    }),
  },
})
