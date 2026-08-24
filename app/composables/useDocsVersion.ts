import { LATEST_DOCS_VERSION, splitDocsPath } from '#shared/docsVersions'

/**
 * The documentation version the reader is currently in, derived from the URL.
 *
 * Every docs page lives under `/docs/<version>/`, so the route is the whole
 * answer and no state has to be carried across navigations. A path that names
 * no version is being redirected to the newest one, so that is what it reports
 * in the meantime.
 */
export function useDocsVersion() {
  const route = useRoute()
  return computed(() => splitDocsPath(route.path).version ?? LATEST_DOCS_VERSION)
}
