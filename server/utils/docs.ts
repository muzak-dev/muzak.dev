// Reads the docs markdown files straight from `content/docs/**` at build time.
//
// The sitemap, llms.txt, and llms-full.txt routes are prerendered, so this runs
// during the build when the content files are on disk. It is the single source
// of truth for those three artifacts, so they never drift from the docs.

import { execFileSync } from 'node:child_process'
import { promises as fs, statSync } from 'node:fs'
import { join, relative } from 'node:path'

/** The canonical site origin, used to build absolute URLs. */
export const SITE_URL = 'https://muzak.dev'

export interface DocEntry {
  /** Absolute path to the markdown file. */
  file: string
  /** Site path, e.g. `/docs/techniques/rate-limiting`. */
  path: string
  /** Absolute URL. */
  url: string
  /** Menu group, e.g. `techniques`. */
  group: string
  /** Page slug within the group, e.g. `rate-limiting`. */
  slug: string
  title: string
  description: string
  /** Markdown body with the frontmatter block removed. */
  body: string
  /** ISO timestamp of the last change (git commit date, else file mtime). */
  lastModified: string
}

/** The last-modified time of a doc: its git commit date, or the file mtime. */
function lastModifiedOf(file: string): string {
  try {
    const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    if (iso) return new Date(iso).toISOString()
  } catch {
    // git is unavailable or the file is untracked; fall back to the mtime.
  }
  try {
    return statSync(file).mtime.toISOString()
  } catch {
    return new Date().toISOString()
  }
}

/** Strips a leading ordering prefix (`3.techniques` -> `techniques`). */
function stripPrefix(segment: string): string {
  return segment.replace(/^\d+\./, '')
}

/** The numeric ordering prefix of a segment, or a large number when absent. */
function order(segment: string): number {
  const match = segment.match(/^(\d+)\./)
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
}

interface Parsed {
  title: string
  description: string
  body: string
}

/** Minimal frontmatter parse for our controlled `key: value` blocks. */
function parse(raw: string): Parsed {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/)
  const data: Record<string, string> = {}
  let body = raw
  if (match) {
    body = raw.slice(match[0].length)
    for (const line of match[1].split('\n')) {
      const colon = line.indexOf(':')
      if (colon > 0) {
        const key = line.slice(0, colon).trim()
        const value = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '')
        data[key] = value
      }
    }
  }
  return {
    title: data.title ?? '',
    description: data.description ?? '',
    body: body.trim(),
  }
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = []
  let entries
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...(await walk(full)))
    } else if (entry.name.endsWith('.md')) {
      out.push(full)
    }
  }
  return out
}

/** Collects every doc in sidebar order. */
export async function collectDocs(): Promise<DocEntry[]> {
  const root = join(process.cwd(), 'content', 'docs')
  const files = await walk(root)

  const entries: DocEntry[] = []
  for (const file of files) {
    const rel = relative(root, file).replace(/\.md$/, '')
    const segments = rel.split('/')
    const slug = segments.map(stripPrefix)
    const path = `/docs/${slug.join('/')}`
    const raw = await fs.readFile(file, 'utf8')
    const parsed = parse(raw)
    entries.push({
      file,
      path,
      url: `${SITE_URL}${path}`,
      group: slug[0] ?? '',
      slug: slug[1] ?? '',
      lastModified: lastModifiedOf(file),
      ...parsed,
    })
  }

  // Sort by the numeric ordering prefixes, segment by segment, so `10.x` sorts
  // after `2.x` rather than lexicographically.
  entries.sort((a, b) => {
    const av = relative(root, a.file).split('/')
    const bv = relative(root, b.file).split('/')
    for (let i = 0; i < Math.max(av.length, bv.length); i += 1) {
      const diff = order(av[i] ?? '') - order(bv[i] ?? '')
      if (diff !== 0) return diff
      const lex = (av[i] ?? '').localeCompare(bv[i] ?? '')
      if (lex !== 0) return lex
    }
    return 0
  })

  return entries
}

/**
 * Human label for a menu group, used as the heading in `llms.txt`.
 *
 * The groups are the folders directly under `content/docs/`, so the labels here
 * have to match what the sidebar shows: `1.getting-started` reaches this as
 * `getting-started`.
 */
export function groupLabel(group: string): string {
  const named: Record<string, string> = {
    'getting-started': 'Getting Started',
    fundamentals: 'Fundamentals',
    techniques: 'Techniques',
    realtime: 'Real-time',
    security: 'Security',
    deployment: 'Deployment',
  }
  if (named[group]) return named[group]
  return group
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
