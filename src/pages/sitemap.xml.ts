import type { APIRoute } from 'astro';
import { ALL_ROUTES } from '../data/routes';
// Demo sitemap: preview URLs on GitHub Pages. Every page is also noindex,nofollow, so this is for link checking only.
export const GET: APIRoute = ({ site }) => {
  const base = (site?.origin ?? '') + import.meta.env.BASE_URL.replace(/\/$/, '');
  const urls = ALL_ROUTES.map((p) => `<url><loc>${base}${p === '/' ? '/' : p}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
};
