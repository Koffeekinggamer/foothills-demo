// Screenshots of the built demo at 390 and 1440. Usage: node tools/shoot.cjs [home,collection,...]
const { chromium } = require('/workspace/design-audit/node_modules/playwright-core');
const BASE = process.env.ORIGIN || 'http://localhost:4321/foothills-demo';
const pages = { home: '/', collection: '/collections/dining-benches', product: '/products/west-lake-mission-amish-bench-with-back', contact: '/pages/contact-us', book: '/pages/book',
  dining: '/collections/amish-dining-room-furniture', bedroom: '/collections/amish-bedroom-furniture', beds: '/collections/beds', living: '/collections/living-room-furniture', office: '/collections/amish-office-furniture', outdoor: '/collections/amish-outdoor-furniture',
  'product-bed': '/products/brooklyn-deluxe-bed', 'product-sofa': '/products/smith-brothers-conversation-sofa-393', cabinetry: '/pages/cabinetry-page', sale: '/pages/21st-anniversary-sale',
  landrum: '/pages/amish-furniture-showroom-landrum-sc', greenville: '/pages/amish-furniture-greenville-sc', spartanburg: '/pages/amish-furniture-spartanburg-sc', asheville: '/pages/amish-furniture-asheville-nc',
  story: '/pages/our-story', why: '/pages/why-foothills-amish-furniture', services: '/pages/our-services', faq: '/pages/faq', customize: '/pages/customize', species: '/pages/wood-species-guide',
  finishes: '/pages/wood-finishes', hardware: '/pages/hardware', fabrics: '/pages/leather-fabric-upholstery-options', poly: '/pages/poly-outdoor-furniture-colors', liveedge: '/pages/live-edge-furniture',
  shipping: '/pages/shipping-delivery', financing: '/pages/payments-financing', care: '/pages/furniture-care', policies: '/pages/our-policies', privacy: '/pages/privacy-policy', terms: '/pages/terms-of-service',
  reviews: '/pages/reviews-testimonials', careers: '/pages/careers', craftsmanship: '/pages/craftsmanship', custom: '/pages/custom-amish-furniture-landrum-sc', american: '/pages/american-made-solid-wood-furniture-landrum-sc',
  guide: '/pages/solid-hardwood-furniture-guide-landrum-sc', rustic: '/pages/rustic-wood-furniture-landrum-sc', handcrafted: '/pages/handcrafted-furniture-in-landrum-sc', all: '/collections', sitemap: '/sitemap' };
const SIZES = (process.env.SIZES || '390,1440').split(',').map(Number);
const SUF = process.env.SUF || ''; const OUT = process.env.OUT || 'screens'; const SEGS = process.env.SEGS !== '0';
const only = process.argv[2] ? process.argv[2].split(',') : Object.keys(pages);
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [w, h, tag] of SIZES.map((w) => [w, w < 500 ? 844 : w < 1200 ? 768 : 900, (w < 500 ? 'm' : 'd') + w])) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: 'reduce', isMobile: w < 500, hasTouch: w < 500, timezoneId: 'America/New_York' });
    for (const p of only) {
      const pg = await ctx.newPage();
      await pg.goto(BASE + pages[p], { waitUntil: 'load' });
      await pg.evaluate(async () => { document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager'); await document.fonts.ready;
        await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r }))); });
      await pg.addStyleTag({ content: '.cv{content-visibility:visible!important;contain-intrinsic-size:none!important}' }); await pg.waitForTimeout(300);
      const ov = await pg.evaluate(() => { const o = []; const W = document.documentElement.clientWidth; document.querySelectorAll('body *').forEach(e => { const r = e.getBoundingClientRect(); if (r.width > 0 && (r.right > W + 1 || r.left < -1) && getComputedStyle(e).position !== 'fixed' && !e.closest('.chips--scroll') && !e.closest('[hidden]') && !e.closest('template')) o.push(e.tagName + '.' + e.className + ' ' + Math.round(r.left) + '-' + Math.round(r.right)) }); return { sw: document.documentElement.scrollWidth, W, o: o.slice(0, 8) } });
      console.log(tag, p, JSON.stringify(ov));
      await pg.screenshot({ path: `${OUT}/${p}-${tag}-fold${SUF}.png` });
      await pg.addStyleTag({ content: 'body{position:relative}.actionbar{position:absolute!important}.podium-facade{display:none!important}' });
      await pg.screenshot({ path: `${OUT}/${p}-${tag}${SUF}.png`, fullPage: true });
      const H = await pg.evaluate(() => document.documentElement.scrollHeight);
      const seg = w < 500 ? 1600 : 1800;
      if (SEGS) for (let y = 0, i = 0; y < H; y += seg, i++) await pg.screenshot({ path: `${process.env.RV || '/tmp/review2'}/${p}-${tag}-${i}.png`, fullPage: true, clip: { x: 0, y, width: w, height: Math.min(seg, H - y) } });
      await pg.close();
    }
    await ctx.close();
  }
  await b.close();
})();
