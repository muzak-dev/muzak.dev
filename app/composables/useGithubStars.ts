/**
 * The framework's star count, fetched once per page load and shared by every
 * component that asks for it.
 *
 * The shared `key` is what makes the header and any other caller reuse a single
 * request rather than issuing one each. It resolves during SSR, so the number
 * is in the HTML rather than appearing after hydration.
 */
export function useGithubStars() {
  return useFetch('/api/stars', {
    key: 'github-stars',
    default: () => ({ stars: null as number | null }),
    // A missing count is a fine outcome; never let it fail a page.
    server: true,
  })
}

/**
 * Renders a count the way GitHub does: exact below a thousand, then one decimal
 * place of thousands, dropping to whole thousands once the decimal stops
 * carrying information.
 *
 *   999 -> "999"      1000 -> "1k"       1100 -> "1.1k"     4321 -> "4.3k"
 *   12500 -> "13k"    1200000 -> "1.2M"
 *
 * The tenth is truncated rather than rounded, so a count never reads as higher
 * than it is, and a trailing ".0" is dropped because "1k" is what GitHub shows.
 */
export function formatCount(n: number): string {
  if (!Number.isFinite(n) || n < 0) return '0'
  if (n < 1000) return String(Math.floor(n))
  if (n < 10_000) return `${trim(Math.floor(n / 100) / 10)}k`
  if (n < 1_000_000) return `${Math.round(n / 1000)}k`
  return `${trim(Math.floor(n / 100_000) / 10)}M`
}

/** One decimal place, with a whole number left whole. */
function trim(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}
