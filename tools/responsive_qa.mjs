// Responsive QA pass (local only). Needs playwright-core and Chrome: npm i --no-save playwright-core
// Usage: node serve.mjs & node tools/responsive_qa.mjs http://localhost:4321/foothills-demo out.json
import fs from 'node:fs';
const INJ = process.env.INJECT ? fs.readFileSync(process.env.INJECT, 'utf8') : '';
import { chromium } from 'playwright-core';
const BASE = process.argv[2] || 'http://localhost:4400/foothills-demo';
const OUT = process.argv[3] || 'qa-after.json';
const PAGES = ['/', '/collections', '/collections/amish-dining-room-furniture', '/collections/dining-benches', '/collections/poly-outdoor-chairs',
 '/products/brooklyn-deluxe-bed', '/products/build-your-own-live-edge-table', '/pages/amish-furniture-showroom-landrum-sc', '/pages/amish-furniture-greenville-sc',
 '/pages/cabinetry-page', '/pages/21st-anniversary-sale', '/pages/our-story', '/pages/our-team', '/pages/customize', '/pages/faq', '/pages/contact-us', '/pages/book',
 '/pages/live-edge-furniture', '/pages/furniture-care', '/sitemap'];
const WIDTHS = [[360,780],[390,844],[430,932],[768,1024],[820,1180],[1024,1366],[1180,820],[1366,1024],[1280,800],[1440,900],[1920,1080]];
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const results = [];
for (const [w,h] of WIDTHS) {
  const touch = w <= 1024 || (w===1180) || (w===1366);
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: w < 1024, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const p of (process.env.ONLY ? PAGES.filter(x=>x===process.env.ONLY) : PAGES)) {
    await page.goto(BASE + p, { waitUntil: 'load' });
    await page.evaluate(async () => { for (let y=0; y<document.body.scrollHeight; y+=600) { window.scrollTo(0,y); await new Promise(r=>setTimeout(r,20)); } window.scrollTo(0,0); });
    if (INJ) await page.addStyleTag({ content: INJ });
    await page.addStyleTag({ content: '[data-reveal]{opacity:1 !important;transform:none !important}' });
    await page.waitForTimeout(150);
    const r = await page.evaluate(({touch, w}) => {
      const issues = [];
      const vw = document.documentElement.clientWidth;
      const de = document.documentElement;
      if (de.scrollWidth > vw + 1) issues.push({t:'overflow', msg:`doc scrollWidth ${de.scrollWidth} > ${vw}`});
      const vis = (el) => { const cs = getComputedStyle(el); if (cs.display==='none'||cs.visibility==='hidden') return false; const r=el.getBoundingClientRect(); return r.width>0&&r.height>0; };
      const sel = (el) => { let s=el.tagName.toLowerCase(); if (el.id) s+='#'+el.id; if (el.classList.length) s+='.'+[...el.classList].slice(0,2).join('.'); const par=el.parentElement; return (par? (par.classList[0]? '.'+par.classList[0]+' > ':'') : '')+s; };
      const clippedByAncestor = (el) => { for (let a=el.parentElement; a && a!==document.body; a=a.parentElement) { const cs=getComputedStyle(a); if (/(hidden|auto|scroll|clip)/.test(cs.overflowX)) return true; if (cs.position==='fixed') return true; } return false; };
      const all = [...document.querySelectorAll('body *')];
      for (const el of all) {
        if (el.closest('.sheet[hidden], .mega, .sr-only, .skip, [hidden], script, style, noscript, .toast')) continue;
        const r = el.getBoundingClientRect(); if (!r.width) continue;
        if ((r.right > vw + 1 || r.left < -1) && !clippedByAncestor(el) && vis(el)) issues.push({t:'wide', msg:`${sel(el)} [${Math.round(r.left)},${Math.round(r.right)}]`});
      }
      // text clipping
      for (const el of document.querySelectorAll('h1,h2,h3,h4,p,a,button,label,summary,li,span,dt,dd')) {
        if (!vis(el) || el.closest('.sr-only,.skip,.mega,[hidden]')) continue;
        const cs = getComputedStyle(el);
        if (cs.textOverflow==='ellipsis') continue;
        if (/(hidden|clip)/.test(cs.overflowX+cs.overflowY) && (el.scrollWidth > el.clientWidth+2 || el.scrollHeight > el.clientHeight+2) && el.clientWidth>0) issues.push({t:'clip', msg:`${sel(el)} "${el.textContent.trim().slice(0,30)}" ${el.scrollWidth}x${el.scrollHeight} in ${el.clientWidth}x${el.clientHeight}`});
      }
      // long words breaking out of containers
      for (const el of document.querySelectorAll('h1,h2,h3,h4,p,li,dd,td')) {
        if (!vis(el)) continue; if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflowX==='visible' && el.clientWidth>0) issues.push({t:'textspill', msg:`${sel(el)} "${el.textContent.trim().slice(0,30)}" ${el.scrollWidth}>${el.clientWidth}`});
      }
      if (touch) {
        for (const el of document.querySelectorAll('a,button,input,select,textarea,summary,[role=button],label.chip')) {
          if (!vis(el) || el.closest('.sr-only,.skip,.mega,[hidden],.sheet')) continue;
          const r = el.getBoundingClientRect();
          // inline text links inside running text are exempt (WCAG 2.5.8)
          const cs = getComputedStyle(el);
          if (el.tagName==='A' && cs.display==='inline' && el.closest('p,li,dd,address,td') && el.closest('p,li,dd,address,td').textContent.trim().length > el.textContent.trim().length + 3) continue;
          if (el.type==='checkbox'||el.type==='radio') { const lab = el.closest('label') || document.querySelector(`label[for="${el.id}"]`); if (lab && lab.getBoundingClientRect().height>=44) continue; }
          if (r.height < 43.5 || r.width < 43.5) issues.push({t:'tap', msg:`${sel(el)} "${(el.textContent||el.getAttribute('aria-label')||'').trim().slice(0,24)}" ${Math.round(r.width)}x${Math.round(r.height)}`});
        }
      }
      if (w < 768) {
        for (const el of document.querySelectorAll('main p, main li, main dd, main td, main address')) {
          if (!vis(el) || el.textContent.trim().length < 40) continue;
          if (el.closest('.pcard,.breadcrumbs,.crumbs,figcaption,.eyebrow,small,.muted,.fineprint,footer,.chip,.u-caps')) continue;
          const fs = parseFloat(getComputedStyle(el).fontSize); if (fs < 15.9) issues.push({t:'font', msg:`${sel(el)} ${fs}px "${el.textContent.trim().slice(0,30)}"`});
        }
      }
      for (const img of document.querySelectorAll('img')) {
        if (!vis(img) || !img.naturalWidth) continue;
        const cs = getComputedStyle(img); if (cs.objectFit !== 'fill') continue;
        const r = img.getBoundingClientRect(); const a1 = img.naturalWidth/img.naturalHeight, a2 = r.width/r.height;
        if (Math.abs(a1/a2-1) > 0.04) issues.push({t:'distort', msg:`${sel(img)} natural ${a1.toFixed(2)} vs box ${a2.toFixed(2)} ${img.currentSrc.split('/').pop().slice(0,40)}`});
      }
      // grids: detect real rows from layout (handles spans)
      for (const el of document.querySelectorAll('main *')) {
        const cs = getComputedStyle(el); if (cs.display !== 'grid' && !(cs.display==='flex' && cs.flexWrap==='wrap')) continue; if (!vis(el)) continue;
        const kids = [...el.children].filter(vis); if (kids.length < 2) continue;
        const rows = new Map(); kids.forEach(k => { const t = Math.round(k.getBoundingClientRect().top); rows.set(t, (rows.get(t)||[]).concat(k)); });
        const rs = [...rows.values()];
        if (rs.length > 1 && rs[0].length >= 3 && rs[rs.length-1].length === 1) {
          const last = rs[rs.length-1][0].getBoundingClientRect(), first = rs[0][0].getBoundingClientRect();
          const centred = Math.abs((last.left+last.right)/2 - (el.getBoundingClientRect().left+el.getBoundingClientRect().right)/2) < 4;
          if (!centred && last.width < first.width*1.5) issues.push({t:'orphan', msg:`${sel(el)} ${kids.length} items, ${rs[0].length} per row`});
        }
        if (cs.display==='grid' && rs[0].length >= 2 && !el.closest('.footer') && kids.some(k=>k.querySelector('img,h3,h4,.pct'))) { const minw = Math.min(...rs[0].map(k=>k.getBoundingClientRect().width)); if (minw < 140) issues.push({t:'cramped', msg:`${sel(el)} item ${Math.round(minw)}px x${rs[0].length}`}); }
      }
      // nav state
      const nav = document.querySelector('.header .nav'), burger = document.querySelector('.header__menu');
      const navV = nav && vis(nav), burgerV = burger && vis(burger);
      if (navV === burgerV) issues.push({t:'nav', msg:`nav visible=${navV} burger visible=${burgerV}`});
      if (navV) { const ul = nav.querySelector('ul'); if (ul.scrollWidth > nav.clientWidth + 2) issues.push({t:'nav', msg:`nav items overflow ${ul.scrollWidth}>${nav.clientWidth}`}); const hi = document.querySelector('.header__inner'); if (hi.scrollWidth > hi.clientWidth+2) issues.push({t:'nav', msg:`header overflow ${hi.scrollWidth}>${hi.clientWidth}`}); }
      // header items overlap
      const hb = [...document.querySelectorAll('.header__inner > *')].filter(vis).map(e=>[e,e.getBoundingClientRect()]);
      for (let i=0;i<hb.length;i++) for (let j=i+1;j<hb.length;j++){ const a=hb[i][1],b=hb[j][1]; if (a.left<b.right-1&&b.left<a.right-1&&a.top<b.bottom-1&&b.top<a.bottom-1) issues.push({t:'overlap',msg:`header ${sel(hb[i][0])} x ${sel(hb[j][0])}`}); }
      // fixed bars covering the end of the page
      const fixed = [...document.querySelectorAll('body *')].filter(e => { const cs=getComputedStyle(e); return cs.position==='fixed' && vis(e) && e.getBoundingClientRect().bottom >= innerHeight-2 && e.getBoundingClientRect().height < innerHeight/2; });
      const fbH = Math.max(0, ...fixed.map(e => innerHeight - e.getBoundingClientRect().top));
      const padB = parseFloat(getComputedStyle(document.body).paddingBottom) + parseFloat(getComputedStyle(document.documentElement).paddingBottom||0);
      if (fbH > padB + 2) issues.push({t:'cover', msg:`bottom fixed ${fixed.map(sel).join('|')} ${Math.round(fbH)}px > body pad ${padB}px`});
      return { issues, fixed: fixed.map(sel) };
    }, { touch, w });
    results.push({ page: p, w, h, ...r });
    const counts = {}; r.issues.forEach(i => counts[i.t] = (counts[i.t]||0)+1);
    console.log(w, p, JSON.stringify(counts));
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync(OUT, JSON.stringify(results, null, 1));
