import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/style/tailwind.css'],

  // SSR on (default) so all copy and structured data ships in the HTML,
  // which is what both classic crawlers and AI / generative engines read.
  ssr: true,
  plugins: ['~/plugins/floating.ts'],

  // Canonical origin, used by the OG image module and the SEO meta.
  site: {
    url: 'https://muzak.dev',
    name: 'Muzak',
  },

  // The sitemap and the llms.txt / llms-full.txt GEO artifacts are server
  // routes generated from the docs content; prerender them so they ship as
  // static files and never drift from the docs.
  nitro: {
    prerender: {
      routes: ['/sitemap.xml', '/llms.txt', '/llms-full.txt'],
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Muzak · The type-safe web framework for Go',
      titleTemplate: '%s',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'color-scheme', content: 'dark' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;1,400&display=swap',
        },
      ],
    },
  },

  modules: [
    '@nuxt/icon',
    '@nuxt/content',
    '@atoms-studio/nuxt-swiftsearch',
    // Generates a 1200x630 social banner per page from the Muzak OG template,
    // so the home page and every doc get a real Open Graph / Twitter card.
    'nuxt-og-image',
  ],

  // Syntax highlighting for markdown code fences: a dark theme that sits in
  // the iron/rust palette, plus every language the docs actually use. `go` is
  // the one that matters; leaving it out renders 345 code blocks unhighlighted.
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-dark-default',
          },
          langs: ['go', 'bash', 'shell', 'json', 'yaml', 'dockerfile', 'js', 'python', 'ts'],
        },
      },
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ]
  }
})