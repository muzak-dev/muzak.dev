<script setup lang="ts">
// The social banner (Open Graph / Twitter card), rendered to a 1200x630 PNG by
// nuxt-og-image. Satori renders a subset of CSS, so every box uses inline
// flexbox styles.
const props = withDefaults(
  defineProps<{ title?: string; description?: string }>(),
  { title: 'Muzak', description: '' },
)

// Truncation happens on a word boundary. Cutting at a fixed character count
// left cards ending mid-word ("the request an..."), which reads as a rendering
// fault rather than as an abbreviation.
const LIMIT = 150

const shortDescription = computed(() => {
  const text = (props.description ?? '').trim()
  if (text.length <= LIMIT) return text
  const clipped = text.slice(0, LIMIT)
  const lastSpace = clipped.lastIndexOf(' ')
  const kept = lastSpace > 60 ? clipped.slice(0, lastSpace) : clipped
  return `${kept.replace(/[,.;:]$/, '')}...`
})
</script>

<template>
  <div
    :style="{
      width: '1200px',
      height: '630px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: '#0E0C0A',
      color: '#EDE6DD',
      padding: '76px',
      fontFamily: 'sans-serif',
    }"
  >
    <!-- top: wordmark + accent mark -->
    <div :style="{ display: 'flex', alignItems: 'center' }">
      <div :style="{ fontSize: '44px', fontWeight: 700, letterSpacing: '-1px', color: '#EDE6DD' }">
        Muzak
      </div>
      <div
        :style="{
          marginLeft: '16px',
          width: '13px',
          height: '13px',
          borderRadius: '50%',
          background: '#CF6A3C',
        }"
      />
    </div>

    <!-- middle: page title + description -->
    <div :style="{ display: 'flex', flexDirection: 'column' }">
      <div :style="{ fontSize: '64px', fontWeight: 700, lineHeight: 1.08, color: '#F4EEE6' }">
        {{ title }}
      </div>
      <div
        v-if="shortDescription"
        :style="{ marginTop: '26px', fontSize: '28px', lineHeight: 1.4, color: '#9A9189' }"
      >
        {{ shortDescription }}
      </div>
    </div>

    <!-- bottom: tagline + domain -->
    <div :style="{ display: 'flex', alignItems: 'center', fontSize: '22px', color: '#7A726A' }">
      <div :style="{ display: 'flex', color: '#CF6A3C' }">The type-safe web framework for Go</div>
      <div :style="{ display: 'flex', marginLeft: 'auto' }">muzak.dev</div>
    </div>
  </div>
</template>
