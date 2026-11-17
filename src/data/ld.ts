import { SITE } from './site';
import { woodLabel, type Piece } from './catalog';
export function productLd(p: Piece) {
  return {
    '@type': 'Product', name: p.title, url: `${SITE.origin}/products/${p.handle}`,
    image: p.img_src,
    description: (p.paras[0] || p.title).slice(0, 300),
    brand: { '@type': 'Brand', name: p.vendor },
    manufacturer: { '@type': 'Organization', name: p.vendor },
    material: woodLabel(p.wood),
    category: 'Furniture > Benches',
    // Built-to-order pricing: live site shows "call for price", so no Offer price is published.
    offers: { '@type': 'Offer', availability: 'https://schema.org/MadeToOrder', seller: { '@id': `${SITE.origin}/#store` }, url: `${SITE.origin}/products/${p.handle}` },
  };
}
