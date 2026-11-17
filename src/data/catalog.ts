import benchesRaw from './benches.json';
import cat from './catalog.json';

export interface Piece {
  handle: string; title: string; vendor: string; rooms: string[]; wood: string; collection: string | null; dims: string | null;
  paras: string[]; tags: string[]; image: string; created: string; img_src: string; body_html?: string;
  type?: string; bullets?: string[]; primary?: string;
}
export interface Coll {
  handle: string; title: string; label: string; parent: string | null; total: number; description: string;
  products: string[]; children?: string[];
}

// ---- Dining benches (unchanged from the first demo: Bench products tagged "Dining Room", builder round-robin) ----
const dining: Piece[] = (benchesRaw as Piece[]).filter((p) => p.tags.includes('Dining Room'))
  .map((p) => ({ ...p, title: p.title.replace(/\s+/g, ' ').trim(), type: 'Bench', primary: 'dining-benches' }));
function interleave(list: Piece[]) {
  const by = new Map<string, Piece[]>();
  list.forEach((p) => { if (!by.has(p.vendor)) by.set(p.vendor, []); by.get(p.vendor)!.push(p); });
  const queues = [...by.values()].sort((a, b) => b.length - a.length);
  const out: Piece[] = [];
  while (queues.some((q) => q.length)) queues.forEach((q) => { const x = q.shift(); if (x) out.push(x); });
  return out;
}
export const BENCHES: Piece[] = interleave(dining);

// ---- Everything else: tools/build_catalog.py (live storefront JSON, read-only), small sample per collection ----
export const PRODUCTS: Record<string, Piece> = { ...(cat.products as Record<string, Piece>) };
BENCHES.forEach((b) => { PRODUCTS[b.handle] = b; });
export const COLLECTIONS: Record<string, Coll> = cat.collections as Record<string, Coll>;
COLLECTIONS['dining-benches'].products = BENCHES.map((b) => b.handle);
export const TREE = cat.tree as [string, string, string[]][];
export const ROOMS = TREE.map(([h, label, subs]) => ({ handle: h, label, subs: subs.map((s) => COLLECTIONS[s]) }));

export const items = (handle: string): Piece[] => COLLECTIONS[handle].products.map((h) => PRODUCTS[h]).filter(Boolean);
export const parentOf = (c: Coll): Coll | null => (c.parent ? COLLECTIONS[c.parent] : null);
/** The collection a product page belongs to (for breadcrumbs, "more like this"). */
export const homeOf = (p: Piece): Coll => COLLECTIONS[p.primary || 'dining-benches'];

export const COLLECTION = { handle: 'dining-benches', title: 'Amish Dining Benches',
  lede: 'Solid hardwood dining benches built to match your table: trestle, storage and reclaimed barnwood styles, made to order by Amish workshops.' };

const LABELS: Record<string, string> = { 'Your choice': 'Choice of wood', 'Upholstered': 'Fabric or leather' };
export const woodLabel = (w: string) => LABELS[w] ?? w;
