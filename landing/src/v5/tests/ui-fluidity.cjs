// Servir landing/ o landing-dist/ antes de ejecutar. Requiere Playwright y Chromium.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const url = process.env.LANDING_TEST_URL || 'http://127.0.0.1:8766/v5.html';

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    args: ['--no-sandbox'],
  });
  for (const width of [320, 390, 768, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: width < 700 ? 844 : 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.status() >= 400) errors.push(response.status() + ' ' + response.url());
    });
    await page.route('https://aprovecho-app-demo.vercel.app/', route => route.fulfill({contentType:'text/html',body:'<h1>App</h1>'}));
    await page.goto(url);
    await page.waitForTimeout(600);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    const boxes = await page.evaluate(() => ['.nav__logo', '.nav__download', '.nav__cta']
      .map(selector => document.querySelector(selector).getBoundingClientRect().toJSON()));
    assert(boxes[0].right < boxes[1].left, 'El logo no pisa el botón de app');
    assert(boxes[1].right < boxes[2].left, 'Los dos botones no se superponen');
    assert(boxes[2].right <= width, 'Los botones caben en la pantalla');
    assert(await page.locator('.nav__download').isVisible());
    assert(await page.locator('.nav__cta').isVisible());

    if (width === 1440) {
      await page.evaluate(() => {
        let count = 0;
        window.progressMutations = () => count;
        new MutationObserver(records => count += records.length)
          .observe(document.querySelector('.pg'), {
            subtree: true, attributes: true, childList: true, characterData: true,
          });
      });
      await page.waitForTimeout(1500);
      assert.equal(await page.evaluate(() => window.progressMutations()), 0,
        'El indicador no reescribe HTML en reposo');
    }
    await page.locator('.nav__download').click();
    await page.waitForURL('https://aprovecho-app-demo.vercel.app/');
    assert.deepEqual(errors, []);
    await page.close();
  }

  // La accesibilidad no debe desactivar la reproducción interactiva.
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await page.goto(url);
  assert.equal(await page.locator('.ob__video').getAttribute('src'), null);
  await page.locator('.ob__play').click();
  await page.waitForFunction(() => document.querySelector('.ob__video').readyState >= 1);
  assert((await page.locator('.ob__video').getAttribute('src')).includes('onboarding-1080.mp4'));
  assert(await page.locator('.ob__video').isVisible());
  await page.locator('.nv-bar a[href="#inicio"]').click();
  await page.waitForTimeout(300);
  assert(await page.locator('.ob__video').evaluate(video => video.paused));
  await page.close();

  // El giro completo conserva sus frames; solo se descargan al interactuar.
  const station = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const frames = new Set();
  station.on('request', request => {
    if (request.url().includes('/estacion/giro/')) frames.add(request.url());
  });
  await station.goto(url);
  await station.locator('#tab-smart').click();
  await station.waitForTimeout(500);
  assert(frames.size <= 1, 'El giro no descarga 48 imágenes antes de usarse');
  await station.locator('#plan-smart .st-gw').focus();
  await station.waitForFunction(() => document.querySelector('#plan-smart .st-stage').classList.contains('is-giro'));
  await station.waitForTimeout(800);
  assert(frames.size > 1, 'El giro completo sigue disponible con teclado');
  await station.close();
  await browser.close();
  console.log('PASS: botones, enlace a la app, reposo, video accesible y carga progresiva del giro.');
})().catch(error => { console.error(error); process.exit(1); });
