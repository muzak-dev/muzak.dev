// The documentation is versioned: every page lives under `/docs/<version>/`,
// and `content/docs/<version>/` holds a complete tree of its own. A release is
// cut by copying the newest tree to a new version directory and adding the
// version here; from that point the two evolve independently, so a page may
// exist in one version and not the next, and the same page may say different
// things in each.
//
// This file is the single source of truth for which versions exist. It is
// imported by the pages, the sidebar, the version picker, the link rewriter,
// the llms.txt routes, the sitemap and the redirect middleware, so adding a
// version is one edit rather than nine.
//
// Nuxt Content leaves a directory whose name is a bare semver alone rather than
// treating the leading `0.` as an ordering prefix (its SEMVER_REGEX), which is
// what lets `content/docs/0.2.7/` map to `/docs/0.2.7/` untouched.

export interface DocsVersion {
  /** The version as it appears in the URL and in the picker, without a `v`. */
  version: string
  /** Shown beside the version in the picker; only the newest one carries it. */
  label?: string
}

/**
 * Every published documentation version, newest first. The first entry is the
 * one `/docs/...` resolves to.
 *
 * Only the current release is published. Older trees were removed rather than
 * kept: a version of the documentation nobody maintains drifts away from the
 * code it describes, and a reader who finds it has no way to tell.
 *
 * Listing a version whose pages do not exist is worse than not offering it, so
 * this list and the directories under content/docs are kept in step.
 */
export const DOCS_VERSIONS: DocsVersion[] = [
  { version: '0.2.7', label: 'Latest' },
]

/** The version an unversioned `/docs/...` request is sent to. */
export const LATEST_DOCS_VERSION: string = DOCS_VERSIONS[0]!.version

/** Reports whether a path segment names a version the site publishes. */
export function isDocsVersion(segment: string | undefined): boolean {
  return !!segment && DOCS_VERSIONS.some((v) => v.version === segment)
}

/**
 * Reports whether a path segment is shaped like a version, published or not.
 *
 * `/docs/9.9.9/routers` is a request for a version that does not exist, not a
 * page named `9.9.9`, and answering it with a redirect that buries the segment
 * inside the newest version would turn a clear miss into a confusing one. It
 * matches the same shape Nuxt Content leaves unprefixed, so what looks like a
 * version here is exactly what would have become one on disk.
 */
export function looksLikeDocsVersion(segment: string | undefined): boolean {
  return !!segment && /^\d+(?:\.\d+)*(?:\.x)?$/.test(segment)
}

/**
 * Splits a docs path into the version it names and the rest of the path.
 *
 * `version` is null for a path that names no version, which is what an
 * unversioned inbound link looks like: `/docs/techniques/json` yields
 * `{ version: null, rest: 'techniques/json' }`, and `/docs` yields
 * `{ version: null, rest: '' }`.
 */
export function splitDocsPath(path: string): { version: string | null; rest: string } {
  const trimmed = path.replace(/^\/docs\/?/, '').replace(/\/$/, '')
  if (!trimmed) {
    return { version: null, rest: '' }
  }
  const [first, ...others] = trimmed.split('/')
  if (isDocsVersion(first)) {
    return { version: first!, rest: others.join('/') }
  }
  return { version: null, rest: trimmed }
}

/** Builds the path of a page within a version, as `/docs/<version>/<rest>`. */
export function docsPath(version: string, rest = ''): string {
  return rest ? `/docs/${version}/${rest}` : `/docs/${version}`
}

/**
 * Rewrites a docs link so that it points inside the given version.
 *
 * Content is authored with unversioned links (`/docs/techniques/json`) so that
 * copying a tree to a new version does not mean rewriting every link in it.
 * The reader is kept inside the version they are reading: a link followed from
 * the 0.1.1 docs lands on the 0.1.1 page, not on the newest one. A link that
 * already names a version is left exactly as written, which is how a page
 * deliberately points at another version.
 */
export function withDocsVersion(href: string, version: string): string {
  if (!href.startsWith('/docs')) {
    return href
  }
  const [pathPart = '', suffix = ''] = splitOnce(href, /[?#]/)
  const { version: named, rest } = splitDocsPath(pathPart)
  if (named) {
    return href
  }
  return docsPath(version, rest) + suffix
}

/** Splits a string at the first match, returning the part before and from it. */
function splitOnce(value: string, at: RegExp): [string, string] {
  const index = value.search(at)
  if (index < 0) {
    return [value, '']
  }
  return [value.slice(0, index), value.slice(index)]
}
