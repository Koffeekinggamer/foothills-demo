/** Prefix a root-relative path with the deploy base (`import.meta.env.BASE_URL`).
 *  With `trailingSlash: 'never'` the base has no trailing slash (`/foothills-demo`). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (!path || path === '/') return base || '/';
  return base + (path.startsWith('/') ? path : `/${path}`);
}
