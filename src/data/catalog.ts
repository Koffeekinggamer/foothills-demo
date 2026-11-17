import raw from './benches.json';
export interface Piece { handle: string; title: string; vendor: string; rooms: string[]; wood: string; collection: string | null; dims: string | null; paras: string[]; tags: string[]; image: string; created: string; img_src: string; body_html: string; }
const all = raw as Piece[];
// The live /collections/dining-benches is a curated Shopify collection (43 items). The capture has no membership
// data, so the demo derives it: product_type/tag "Bench" AND tagged "Dining Room".
const dining: Piece[] = all.filter((p) => p.tags.includes('Dining Room'))
  .map((p) => ({ ...p, title: p.title.replace(/\s+/g, ' ').trim() }));
// "Featured" order: round-robin across builders so the first rows show the range.
function interleave(list: Piece[]) {
  const by = new Map<string, Piece[]>();
  list.forEach((p) => { if (!by.has(p.vendor)) by.set(p.vendor, []); by.get(p.vendor)!.push(p); });
  const queues = [...by.values()].sort((a, b) => b.length - a.length);
  const out: Piece[] = [];
  while (queues.some((q) => q.length)) queues.forEach((q) => { const x = q.shift(); if (x) out.push(x); });
  return out;
}
export const BENCHES: Piece[] = interleave(dining);
export const COLLECTION = {
  handle: 'dining-benches',
  title: 'Amish Dining Benches',
  lede: 'Solid hardwood dining benches built to match your table: trestle, storage and reclaimed barnwood styles, made to order by Amish workshops.',
};
export const woodLabel = (w: string) => (w === 'Your choice' ? 'Choice of wood' : w);
