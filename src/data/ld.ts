import { SITE } from './site';
import { woodLabel, homeOf, type Piece } from './catalog';
export function productLd(p: Piece) {
  return {
    '@type': 'Product', name: p.title, url: `${SITE.origin}/products/${p.handle}`,
    image: p.img_src,
    description: (p.paras.find((t) => t.length > 60 && !/^(call or visit|sku)/i.test(t)) || p.paras[0] || p.title).slice(0, 300),
    brand: { '@type': 'Brand', name: p.vendor },
    manufacturer: { '@type': 'Organization', name: p.vendor },
    ...(p.wood === 'Your choice' || p.wood === 'Mattress' ? {} : { material: woodLabel(p.wood) }),
    category: `Furniture > ${homeOf(p).label}`,
    // Built-to-order pricing: live site shows "call for price", so no Offer price is published.
    offers: { '@type': 'Offer', availability: 'https://schema.org/MadeToOrder', seller: { '@id': `${SITE.origin}/#store` }, url: `${SITE.origin}/products/${p.handle}` },
  };
}
