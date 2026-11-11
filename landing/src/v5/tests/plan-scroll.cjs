// Servir landing/ antes de ejecutar. Requiere Playwright y Chromium instalados.
// LANDING_TEST_URL y CHROMIUM_PATH permiten usar otro servidor o navegador local.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(process.env.LANDING_TEST_URL || 'http://127.0.0.1:8766/v5.html');
  await page.waitForTimeout(300);
  assert.equal(await page.locator('.nav__burger').count(), 0);
  assert.equal(await page.locator('#quienes-somos #datos').count(), 1);
  assert.equal(await page.locator('#suma, a[href="#suma"]').count(), 0);
  assert(await page.evaluate(() => !!(document.getElementById('alta')
    .compareDocumentPosition(document.getElementById('preguntas')) & Node.DOCUMENT_POSITION_FOLLOWING)));

  for (const id of ['base', 'smart', 'intelligence']) {
    await page.locator('#tab-' + id).click();
    await page.waitForTimeout(150);
    const bounds = await page.evaluate(id => {
      const pin = ScrollTrigger.getAll().find(t => t.pin?.id === 'plan-' + id);
      return { start: pin.start, end: pin.end };
    }, id);

    // Antes del final se puede volver por los pasos sin completar el recorrido.
    for (const progress of [.55, .2]) {
      await page.evaluate(({ start, end, progress }) => window.scrollTo({
        top: start + (end - start) * progress, behavior: 'instant',
      }), { ...bounds, progress });
      await page.waitForTimeout(700);
      assert.equal(await page.locator('#plan-' + id).getAttribute('data-completed'), null);
      assert.equal(await page.evaluate(() => ScrollTrigger.getAll().filter(t => t.pin).length), 1);
    }

    // Al terminar se elimina el pin sin desplazar visualmente el contenido.
    await page.evaluate(end => window.scrollTo({ top: end + 80, behavior: 'instant' }), bounds.end);
    await page.waitForTimeout(250);
    assert.equal(await page.locator('#plan-' + id).getAttribute('data-completed'), 'true');
    assert.equal(await page.evaluate(() => ScrollTrigger.getAll().filter(t => t.pin).length), 0);
    assert(Math.abs((await page.locator('#plan-' + id).boundingBox()).y + 80) < 5);
    assert(!(await page.locator('.pg').evaluate(e => e.classList.contains('is-on'))));

    await page.evaluate(() => window.scrollBy({ top: -220, behavior: 'instant' }));
    await page.waitForTimeout(100);
    assert.equal(await page.evaluate(() => ScrollTrigger.getAll().filter(t => t.pin).length), 0);
    const current = await page.locator('#plan-' + id + ' .ch__steps li')
      .evaluateAll(items => items.findIndex(e => e.classList.contains('is-on')));
    assert.equal(current, id === 'base' ? 4 : 3);
  }

  // El estado final se conserva al volver a otra pestaña y al cambiar a celular.
  await page.locator('#tab-base').click();
  for (const width of [1024, 390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.waitForTimeout(200);
    assert.equal(await page.evaluate(() => ScrollTrigger.getAll().filter(t => t.pin).length), 0);
    assert.equal(await page.locator('#plan-base .rc-scr.is-cur').getAttribute('data-step'), '4');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  }
  assert.deepEqual(errors, []);
  await browser.close();
  console.log('PASS: estructura, navegación, finalización de los tres planes y vuelta sin repetir.');
})().catch(error => { console.error(error); process.exit(1); });
