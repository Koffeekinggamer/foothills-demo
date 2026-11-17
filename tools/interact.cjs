// Smoke-test the interactive bits on the built demo.
const { chromium } = require('/workspace/design-audit/node_modules/playwright-core');
const B = process.env.ORIGIN || 'http://localhost:4321/foothills-demo';
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, timezoneId: 'America/New_York' });
  const p = await ctx.newPage();
  const ext = []; p.on('request', r => { const u = r.url(); if (!u.startsWith(B) && !u.startsWith('data:')) ext.push(u); });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });

  await p.goto(B + '/collections/dining-benches', { waitUntil: 'load' });
  const vis = () => p.evaluate(() => [...document.querySelectorAll('[data-grid] > li')].filter(l => !l.hidden).length);
  console.log('all', await vis());
  await p.fill('#q', 'storage'); await p.waitForTimeout(200); console.log('q=storage', await vis(), await p.textContent('[data-count-shown]'));
  await p.fill('#q', ''); await p.waitForTimeout(200);
  await p.click('.filter-btn'); await p.waitForTimeout(100);
  console.log('sheet open', await p.evaluate(() => document.getElementById('filters').classList.contains('is-open')));
  await p.check('input[name=builder][value="RH Yoder"]'); await p.waitForTimeout(100);
  console.log('RH Yoder', await vis());
  await p.check('input[name=wood][value="Quarter-Sawn White Oak"]'); await p.waitForTimeout(100);
  console.log('RH Yoder + QSWO', await vis(), 'url', p.url());
  await p.screenshot({ path: 'screens/collection-m390-filters-open.png' });
  await p.click('.rail__done'); await p.waitForTimeout(100);
  await p.screenshot({ path: 'screens/collection-m390-filtered.png' });
  await p.fill('#q', 'zzzz'); await p.waitForTimeout(200); console.log('empty shown', await p.isVisible('[data-empty]'));
  await p.goto(B + '/collections/dining-benches?room=Living%20room', { waitUntil: 'load' }); console.log('url restore room', await vis());

  await p.goto(B + '/products/west-lake-mission-amish-bench-with-back', { waitUntil: 'load' });
  await p.click('[data-request-info]'); await p.waitForTimeout(800);
  console.log('focus after request', await p.evaluate(() => document.activeElement.id));
  await p.click('#contact_form button[type=submit]'); console.log('invalid email flagged', await p.getAttribute('#f-email', 'aria-invalid'));
  await p.fill('#f-email', 'test@example.com'); await p.click('#contact_form button[type=submit]');
  console.log('status', await p.textContent('#contact_form .form__status'));
  await p.click('.actionbar [data-podium]'); console.log('toast', await p.textContent('.toast'));
  console.log('dataLayer', JSON.stringify(await p.evaluate(() => dataLayer.map(d => d.event))));
  console.log('ld types', JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent)['@type']))));

  await p.goto(B + '/pages/book', { waitUntil: 'load' });
  await p.click('[data-choose]'); await p.waitForTimeout(300);
  await p.locator('[data-pick-person]:visible').first().click(); await p.waitForTimeout(300);
  await p.locator('[id^="cal-"] button:visible').first().click(); await p.waitForTimeout(500);
  console.log('cal iframe', await p.evaluate(() => document.querySelector('[id^="cal-"] iframe')?.getAttribute('src')));
  await p.screenshot({ path: 'screens/book-m390-calendar-loaded.png' });
  await p.goto(B + '/pages/contact-us', { waitUntil: 'load' });
  console.log('today row', await p.evaluate(() => document.querySelector('.hours-table tr.is-today th')?.textContent), await p.textContent('.announce .status__text'));
  console.log('directions text', await p.evaluate(() => [...document.querySelectorAll('a[href^="https://maps.google.com/"]')].map(a => a.innerText.trim()).filter((v, i, s) => s.indexOf(v) === i)));
  await p.goto(B + '/', { waitUntil: 'load' });
  console.log('view furniture links', await p.evaluate(() => [...document.querySelectorAll('a')].filter(a => /view furniture/i.test(a.innerText)).map(a => a.getAttribute('href'))));
  console.log('robots', await p.getAttribute('meta[name=robots]', 'content'));
  console.log('EXTERNAL REQUESTS', ext.length, ext.slice(0, 5)); console.log('ERRORS', errs);
  await b.close();
})();
