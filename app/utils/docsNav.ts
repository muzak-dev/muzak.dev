import type { ContentNavigationItem } from '@nuxt/content'

// Docs navigation. A folder directly under `content/docs/` is a menu group and
// a markdown file inside it is a page, so `1.getting-started/3.routers.md` is
// served at `/docs/getting-started/routers`. Numeric prefixes order the sidebar
// and are stripped from the URL.

// `queryCollectionNavigation('docs')` may nest everything under a single
// `/docs` wrapper, so descend it and always work with the group list.
function topLevel(
  nav: ContentNavigationItem[] | null | undefined,
): ContentNavigationItem[] {
  const items = nav ?? []
  if (items.length === 1 && items[0]?.path === '/docs' && items[0].children) {
    return items[0].children
  }
  return items
}

/** The menu groups, in sidebar order. */
export function docsGroups(
  nav: ContentNavigationItem[] | null | undefined,
): ContentNavigationItem[] {
  return topLevel(nav).filter((g) => (g.children?.length ?? 0) > 0)
}

// First actual page (a node with no children) under a list, depth first.
function firstLeaf(items: ContentNavigationItem[] | undefined): string | undefined {
  for (const it of items ?? []) {
    if (it.children?.length) {
      const found = firstLeaf(it.children)
      if (found) return found
    } else if (it.page !== false) {
      return it.path
    }
  }
  return undefined
}

/** First page in the whole docs tree, used to resolve a bare `/docs` visit. */
export function firstDocLeaf(
  nav: ContentNavigationItem[] | null | undefined,
): string | undefined {
  return firstLeaf(topLevel(nav))
}
