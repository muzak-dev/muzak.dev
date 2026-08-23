# Muzak Site

The landing page and documentation for the Muzak framework, built with Nuxt and
`@nuxt/content`. It is one Nuxt app: the marketing page is served at `/` and the docs under
`/docs`, so `muzak.dev` and `muzak.dev/docs/...` come from the same deployment.

Documentation pages live under `content/docs/`. A folder directly under `docs/` is a menu
group and a markdown file inside it is a page. Numeric filename prefixes (`1.`, `2.`)
control sidebar ordering only and are stripped from the URL, so
`content/docs/1.getting-started/3.routers.md` is served at
`/docs/getting-started/routers`.

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
