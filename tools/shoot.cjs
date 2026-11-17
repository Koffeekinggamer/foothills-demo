// Screenshots of the built demo at 390 and 1440. Usage: node tools/shoot.cjs [home,collection,...]
const { chromium } = require('/workspace/design-audit/node_modules/playwright-core');
const BASE = 'http://localhost:4321';
const pages = { home: '/', collection: '/collections/dining-benches', product: '/products/west-lake-mission-amish-bench-with-back', contact: '/pages/contact-us', book: '/pages/book' };
const only = process.argv[2] ? process.argv[2].split(',') : Object.keys(pages);
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [w, h, tag] of [[390, 844, 'm390'], [1440, 900, 'd1440']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: 'reduce', isMobile: w < 500, hasTouch: w < 500, timezoneId: 'America/New_York' });
    for (const p of only) {
      const pg = await ctx.newPage();
      await pg.goto(BASE + pages[p], { waitUntil: 'load' });
      await pg.evaluate(async () => { document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager'); await document.fonts.ready;
        await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r }))); });
      await pg.waitForTimeout(300);
      const ov = await pg.evaluate(() => { const o = []; const W = document.documentElement.clientWidth; document.querySelectorAll('body *').forEach(e => { const r = e.getBoundingClientRect(); if (r.width > 0 && (r.right > W + 1 || r.left < -1) && getComputedStyle(e).position !== 'fixed' && !e.closest('.chips--scroll') && !e.closest('[hidden]') && !e.closest('template')) o.push(e.tagName + '.' + e.className + ' ' + Math.round(r.left) + '-' + Math.round(r.right)) }); return { sw: document.documentElement.scrollWidth, W, o: o.slice(0, 8) } });
      console.log(tag, p, JSON.stringify(ov));
      await pg.screenshot({ path: `screens/${p}-${tag}-fold.png` });
      await pg.addStyleTag({ content: 'body{position:relative}.actionbar{position:absolute!important}.podium-facade{display:none!important}' });
      await pg.screenshot({ path: `screens/${p}-${tag}.png`, fullPage: true });
      const H = await pg.evaluate(() => document.documentElement.scrollHeight);
      const seg = w < 500 ? 1600 : 1800;
      for (let y = 0, i = 0; y < H; y += seg, i++) await pg.screenshot({ path: `${process.env.RV || '/tmp/review2'}/${p}-${tag}-${i}.png`, fullPage: true, clip: { x: 0, y, width: w, height: Math.min(seg, H - y) } });
      await pg.close();
    }
    await ctx.close();
  }
  await b.close();
})();
