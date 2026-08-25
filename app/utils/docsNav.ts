import type { ContentNavigationItem } from '@nuxt/content'
import { docsPath } from '#shared/docsVersions'

// Docs navigation. The tree is versioned: `content/docs/<version>/` holds one
// version's pages, a folder inside it is a menu group and a markdown file
// inside that is a page, so `0.2.2/1.getting-started/3.routers.md` is served at
// `/docs/0.2.2/getting-started/routers`. Numeric prefixes order the sidebar and
// are stripped from the URL; the version segment is not a prefix and survives.
//
// Everything here works on one version at a time, because that is what the
// sidebar shows: a reader is inside a version, and the version picker is what
// moves them between trees.

// `queryCollectionNavigation('docs')` may nest everything under a single
// `/docs` wrapper, so descend it and always work with the version list.
function topLevel(
  nav: ContentNavigationItem[] | null | undefined,
): ContentNavigationItem[] {
  const items = nav ?? []
  if (items.length === 1 && items[0]?.path === '/docs' && items[0].children) {
    return items[0].children
  }
  return items
}

// The node holding one version's groups, or undefined when the tree carries
// nothing for that version.
function versionNode(
  nav: ContentNavigationItem[] | null | undefined,
  version: string,
): ContentNavigationItem | undefined {
  return topLevel(nav).find((item) => item.path === docsPath(version))
}

/** The menu groups of one version, in sidebar order. */
export function docsGroups(
  nav: ContentNavigationItem[] | null | undefined,
  version: string,
): ContentNavigationItem[] {
  const children = versionNode(nav, version)?.children ?? []
  return children.filter((g) => (g.children?.length ?? 0) > 0)
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

/**
 * First page of one version, used to resolve a bare `/docs` visit and to land
 * a reader somewhere sensible when the page they were on does not exist in the
 * version they switched to.
 */
export function firstDocLeaf(
  nav: ContentNavigationItem[] | null | undefined,
  version: string,
): string | undefined {
  return firstLeaf(versionNode(nav, version)?.children)
}

/**
 * Every page of one version, in sidebar order.
 *
 * This is what the version picker tests a page's existence against, and what
 * the previous/next links are computed from. Deriving them from the navigation
 * rather than from the collection's own ordering is what keeps them inside the
 * version: the collection holds every version at once, so its neighbours run
 * off the end of one tree and into the next.
 */
export function docLeaves(
  nav: ContentNavigationItem[] | null | undefined,
  version: string,
): ContentNavigationItem[] {
  const leaves: ContentNavigationItem[] = []
  const walk = (items: ContentNavigationItem[] | undefined) => {
    for (const it of items ?? []) {
      if (it.children?.length) {
        walk(it.children)
      } else if (it.page !== false) {
        leaves.push(it)
      }
    }
  }
  walk(versionNode(nav, version)?.children)
  return leaves
}
