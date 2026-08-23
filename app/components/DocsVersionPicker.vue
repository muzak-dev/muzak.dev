<script setup lang="ts">
// Docs version picker. Default = latest, shown as "0.1.0 - Latest".
// The dropdown is a glassmorphism panel (see .version-popper in tailwind.css).
//
// `eager-mount` matters here. floating-vue only mounts the popper slot once the
// dropdown is shown, so without it the glass panel is painted a frame before
// the list inside it exists, and the background visibly arrives first.
interface DocVersion {
  v: string
  label?: string
}

const versions: DocVersion[] = [
  { v: '0.1.0', label: 'Latest' },
  { v: '0.0.3' },
  { v: '0.0.2' },
  { v: '0.0.1' },
]

const selected = ref<DocVersion>(versions[0])
const display = computed(() =>
  selected.value.label ? `${selected.value.v} - ${selected.value.label}` : selected.value.v,
)

function pick(ver: DocVersion) {
  selected.value = ver
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
        <li v-for="ver in versions" :key="ver.v">
          <button
            type="button"
            class="flex w-full cursor-pointer items-center justify-between gap-3 px-2.5 py-1.5 font-mono text-[0.6875rem] transition-colors"
            :class="
              selected.v === ver.v
                ? 'bg-white/5 text-rust'
                : 'text-ash hover:bg-white/5 hover:text-bone'
            "
            @click="pick(ver); hide()"
          >
            <span class="flex items-center gap-2">
              <span>{{ ver.v }}</span>
              <span
                v-if="ver.label"
                class="bg-rust/15 px-1.5 py-0.5 text-[0.5rem] font-semibold uppercase tracking-wider text-rust"
                >{{ ver.label }}</span
              >
            </span>
            <Icon
              v-if="selected.v === ver.v"
              name="lucide:check"
              size="13"
              aria-hidden="true"
            />
          </button>
        </li>
      </ul>
    </template>
  </VDropdown>
</template>
