<script setup lang="ts">
import { docsPath } from '#shared/docsVersions'

const route = useRoute()
const navOpen = useState<boolean>('docsNavOpen')

const { data: nav } = await useDocsNav()

// Every menu group of the version being read, in content order. Groups are the
// folders directly under `content/docs/<version>/`, so the sidebar mirrors the
// tree with nothing in between.
const version = useDocsVersion()
const groups = computed(() => docsGroups(nav.value, version.value))

// Machine-readable docs (llmstxt.org), linked at the foot of every section.
// They are per version, like the pages they index: an agent reading the 0.2.7
// sidebar should be handed the 0.1.1 index, not the newest one.
const llmLinks = computed(() => [
  { label: 'llms.txt', href: `${docsPath(version.value)}/llms.txt` },
  { label: 'llms-full.txt', href: `${docsPath(version.value)}/llms-full.txt` },
])

function itemActive(path: string) {
  return route.path === path
}
function groupActive(group: { path: string; children?: { path: string }[] }) {
  if (route.path === group.path) return true
  return group.children?.some((c) => route.path === c.path) ?? false
}

// Track open groups explicitly so user toggles survive navigation. The active
// group is auto-opened on route change; others are never auto-closed.
const openGroups = ref(new Set<string>())
watchEffect(() => {
  for (const g of groups.value) {
    if (groupActive(g)) openGroups.value.add(g.path)
  }
})
function onToggle(path: string, e: Event) {
  if ((e.target as HTMLDetailsElement).open) openGroups.value.add(path)
  else openGroups.value.delete(path)
}

// Close the mobile drawer after navigating.
watch(
  () => route.path,
  () => {
    navOpen.value = false
  },
)
</script>

<template>
  <aside
    id="docs-sidebar"
    class="border-line py-4 md:block md:border-r md:pr-4"
    :class="
      navOpen
        ? 'fixed inset-x-0 top-12 bottom-0 z-30 block overflow-y-auto border-b bg-ink px-5'
        : 'hidden'
    "
  >
    <div class="thin md:sticky md:top-16 md:max-h-[calc(100vh-5rem)] md:overflow-y-auto md:pr-1">
      <DocsVersionPicker />
      <nav class="space-y-1.5 border-t border-dashed border-line pt-3 text-[12.5px]" aria-label="Documentation">
        <details
          v-for="group in groups"
          :key="group.path"
          class="navgroup group"
          :data-active="groupActive(group) ? '' : undefined"
          :open="openGroups.has(group.path)"
          @toggle="onToggle(group.path, $event)"
        >
          <summary
            class="font-semibold flex items-center gap-2 px-2 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/30 transition-colors hover:text-ash"
          >
            <Icon
              name="lucide:chevron-right"
              class="chev text-faint"
              size="11"
              aria-hidden="true"
            />
            <span class="grouplabel">{{ group.title }}</span>
          </summary>
          <ul v-if="group.children?.length" class="navlist mt-1 space-y-px pl-2.5 text-ash">
            <li v-for="item in group.children" :key="item.path">
              <NuxtLink
                :to="item.path"
                class="block border-l border-transparent px-3 py-1.5 transition-colors hover:bg-ink2 hover:text-bone"
                :class="itemActive(item.path) ? 'bg-ink2 text-bone' : ''"
                :aria-current="itemActive(item.path) ? 'page' : undefined"
                >{{ item.navTitle || item.title }}</NuxtLink
              >
            </li>
          </ul>
        </details>

        <!-- Shared across sections: machine-readable docs for LLMs. These are
             plain-text routes, so use real anchors that open in a new tab. -->
        <div class="mt-3 border-t border-dashed border-line pt-3">
          <div class="flex items-center gap-2 px-2 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/30">
            <Icon name="lucide:bot" size="11" class="text-faint" aria-hidden="true" />
            <span>For LLMs</span>
          </div>
          <ul class="mt-1 space-y-px pl-2.5 text-ash">
            <li v-for="link in llmLinks" :key="link.href">
              <a
                :href="link.href"
                target="_blank"
                rel="noopener"
                class="flex items-center gap-2 border-l border-transparent px-3 py-1.5 font-mono text-[12px] transition-colors hover:bg-ink2 hover:text-bone"
              >
                {{ link.label }}
                <Icon name="lucide:external-link" size="12" class="ml-auto text-faint" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </aside>
</template>
