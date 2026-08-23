// The framework's GitHub star count, for the header.
//
// The browser never talks to api.github.com directly. Unauthenticated GitHub
// requests are limited to 60 an hour *per IP*, so calling it from the client
// would spend a visitor's own budget and start returning 403 to whoever is
// behind a shared address. Fetching once here and caching the answer means the
// whole site costs one request an hour instead.
//
// A failure is not an error worth showing: the header renders the icon without
// a number, which is also what happens before the repository is public.

const REPO = 'muzak-dev/framework'

interface Repo {
  stargazers_count?: number
}

export default defineCachedEventHandler(
  async (): Promise<{ stars: number | null }> => {
    try {
      const repo = await $fetch<Repo>(`https://api.github.com/repos/${REPO}`, {
        headers: {
          accept: 'application/vnd.github+json',
          // GitHub refuses requests with no user agent.
          'user-agent': 'muzak.dev',
        },
        timeout: 4000,
      })
      const stars = repo?.stargazers_count
      return { stars: typeof stars === 'number' ? stars : null }
    } catch {
      return { stars: null }
    }
  },
  {
    name: 'github-stars',
    getKey: () => REPO,
    maxAge: 60 * 60,
    // Serve the last known value while a new one is fetched, so a slow or
    // rate-limited GitHub never delays the page.
    staleMaxAge: 60 * 60 * 24,
    swr: true,
  },
)
