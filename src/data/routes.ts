import { COLLECTIONS, PRODUCTS, ROOMS } from './catalog';
import { PAGES } from './pagecfg';
import { LOCAL } from './local';
/** Every route in the demo (root-relative, no base). Used by the sitemaps. */
export const STATIC_PAGES: [string, string][] = [
  ['Home', '/'], ['Contact & visit', '/pages/contact-us'], ['Book an appointment', '/pages/book'], ['Our team', '/pages/our-team'],
  ['Custom cabinetry', '/pages/cabinetry-page'], ['November sale', '/pages/21st-anniversary-sale'], ['Shop furniture', '/collections'],
];
export const PAGE_ROUTES: [string, string, string][] = [
  ...Object.entries(PAGES).map(([h, c]) => [c.crumb, `/pages/${h}`, c.kind === 'local' ? 'Nearby' : c.group] as [string, string, string]),
  ...LOCAL.map((l) => [l.crumb, `/pages/${l.handle}`, 'Nearby'] as [string, string, string]),
];
export const ALL_ROUTES: string[] = [
  ...STATIC_PAGES.map(([, p]) => p), ...PAGE_ROUTES.map(([, p]) => p), '/sitemap',
  ...Object.keys(COLLECTIONS).map((h) => `/collections/${h}`),
  ...Object.keys(PRODUCTS).map((h) => `/products/${h}`),
];
export { ROOMS };
