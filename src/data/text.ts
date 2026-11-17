export const strip = (s: string) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&rsquo;|&#8217;/g, '’').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
/** First one or two sentences, capped near `max` characters. */
export function lede(html: string, max = 190) {
  const paras = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => strip(m[1])).filter((t) => t.length > 40);
  const t = paras[0] || strip(html);
  const sentences = t.match(/[^.!?]+[.!?]+/g) || [t];
  let out = '';
  for (const s of sentences) { if ((out + s).length > max && out) break; out += s; }
  return out.trim();
}
/** Keep only safe, simple tags from Shopify collection HTML: h2/h3 (demoted to h2/h3), p, ul/ol/li, strong/em, a (dropped). */
export function cleanHtml(html: string, maxBlocks = 6) {
  const blocks = [...html.matchAll(/<(h[1-6]|p|ul|ol)[^>]*>([\s\S]*?)<\/\1>/g)].slice(0, maxBlocks);
  return blocks.map(([, tag, inner]) => {
    const t = tag.toLowerCase();
    if (t === 'ul' || t === 'ol') {
      const lis = [...inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => `<li>${esc(strip(m[1]))}</li>`).join('');
      return `<${t}>${lis}</${t}>`;
    }
    const tt = t.startsWith('h') ? (t === 'h1' || t === 'h2' ? 'h2' : 'h3') : 'p';
    const txt = strip(inner);
    return txt ? `<${tt}>${esc(txt)}</${tt}>` : '';
  }).join('');
}
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
