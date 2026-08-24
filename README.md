# Muzak Site

The landing page and documentation for the Muzak framework, built with Nuxt and
`@nuxt/content`. It is one Nuxt app: the marketing page is served at `/` and the docs under
`/docs`, so `muzak.dev` and `muzak.dev/docs/...` come from the same deployment.

## Documentation layout

The documentation is versioned. `content/docs/<version>/` holds one release's pages, a
folder inside it is a menu group and a markdown file inside that is a page. Numeric
filename prefixes (`1.`, `2.`) control sidebar ordering only and are stripped from the URL;
the version is a bare semver, which Nuxt Content leaves alone. So
`content/docs/0.1.1/1.getting-started/3.routers.md` is served at
`/docs/0.1.1/getting-started/routers`.

```
content/docs/
`-- 0.1.1/
    |-- 1.getting-started/
    |-- 2.fundamentals/
    `-- ...
```

`shared/docsVersions.ts` lists the versions that exist, newest first, and everything else
reads that list: the picker, the sidebar, the link rewriter, the redirects, the sitemap and
the prerendered llms files.

**Links in markdown are written without a version** - `[JSON](/docs/techniques/json)` - and
the version is added when the page renders (`app/components/content/ProseA.vue`). A reader
inside 0.1.1 therefore stays in 0.1.1, and copying a tree to a new version does not mean
rewriting every link in it. Write a versioned link only to point deliberately at another
version.

| URL | What answers it |
|---|---|
| `/docs/0.1.1/techniques/json` | the page itself |
| `/docs/techniques/json` | 302 to the same page in the newest version |
| `/docs` | 302 to the newest version's first page |
| `/docs/0.1.1/techniques/json.md` | the raw markdown source |
| `/llms.txt`, `/llms-full.txt` | the newest version, prerendered |
| `/docs/0.1.1/llms.txt`, `/docs/0.1.1/llms-full.txt` | that version, prerendered |

A page that exists in one version and not another is expected: the sitemap lists every
version, an archived page carries a canonical link to its successor when it has one, and
the picker falls back to a version's first page when the current page has no counterpart
there.

## Cutting a documentation version

When the framework releases, say, 0.2.0:

```bash
cp -R content/docs/0.1.1 content/docs/0.2.0
```

Then add it to the front of `DOCS_VERSIONS` in `shared/docsVersions.ts` and demote the old
`label: 'Latest'`:

```ts
export const DOCS_VERSIONS: DocsVersion[] = [
  { version: '0.2.0', label: 'Latest' },
  { version: '0.1.1' },
]
```

That is the whole change. `/docs/...` starts resolving to 0.2.0, 0.1.1 keeps working and
starts showing the "you are reading an older version" notice, both versions get their own
llms files, and the sitemap covers both. Edit `content/docs/0.2.0/` from then on; the older
tree is frozen and describes the release it shipped with.

Versions before 0.1.1 are not published: the site advertised them before the documentation
was versioned, and no tree was ever kept for them.

## Setup

This project uses [pnpm](https://pnpm.io). The version is pinned in `package.json` under
`packageManager`, and `pnpm-workspace.yaml` allows the two dependencies that need to run a
build script (`better-sqlite3` and `esbuild`).

```bash
pnpm install
```

## Development server

```bash
pnpm dev
```

Serves the site on `http://localhost:3000`.

## Production

Build the application:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

Generate a fully static site:

```bash
pnpm generate
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment)
for more information.
