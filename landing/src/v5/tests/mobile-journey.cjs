// Recorrido de entrega en celular. Requiere Playwright/Chromium y un servidor estático.
// No envía formularios reales; el destino de la app se intercepta solo para comprobar navegación.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const url = process.env.LANDING_TEST_URL || 'http://127.0.0.1:8771/landing-dist/';
const app = 'https://aprovecho-app-demo.vercel.app/';

(async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
  for (const [width,height] of [[320,568],[360,740],[390,844],[430,932],[768,1024],[844,390]]) {
    const page = await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('response',r=>{if(r.status()>=400) errors.push(r.status()+' '+r.url())});
    await page.route(app,r=>r.fulfill({contentType:'text/html',body:'<h1>Destino de la app</h1>'}));
    await page.goto(url,{waitUntil:'networkidle'});
    const within = async selector => {
      const box=await page.locator(selector).boundingBox();
      assert(box && box.x>=-1 && box.x+box.width<=width+1,selector+' cabe horizontalmente');
    };
    await within('.nv-actions');
    await page.locator('.nv-bar a[href="#planes"]').tap();
    await page.locator('#tab-smart').tap();
    await page.locator('#tab-base').tap();
    assert.equal(await page.locator('#plan-base').getAttribute('data-completed'),null,'Cambiar de pestaña no completa un recorrido sin leer');
    assert.equal(await page.locator('[data-rc-count]').textContent(),'1 / 10','El recorrido comienza por la primera pantalla');
    for (const id of ['base','smart','intelligence']) {
      const tab=page.locator('#tab-'+id);await tab.tap();
      assert.equal(await tab.getAttribute('aria-selected'),'true');
      assert(await tab.locator('span').isVisible(),'Nombre del plan visible');
      assert.equal(await page.evaluate(()=>ScrollTrigger.getAll().filter(t=>t.pin).length),0,'Sin pin en teléfono');
      if (id==='base') {
        // Mantener los diez estados accesibles, incluso después de completar el recorrido con scroll.
        await page.locator('[data-rc-next]').scrollIntoViewIfNeeded();
        const current=()=>page.locator('.rc-scr.is-cur').evaluate(e=>[...e.parentNode.children].indexOf(e));
        while(await page.locator('[data-rc-prev]').isEnabled())await page.locator('[data-rc-prev]').tap();
        for(let i=0;i<10;i++) {
          assert.equal(await current(),i);
          if(i<9)await page.locator('[data-rc-next]').tap();
        }
        await page.locator('[data-preview-current]').tap();
      } else {
        const root='#plan-'+id, stage=root+' .st-stage';
        await page.locator(stage).scrollIntoViewIfNeeded();
        await within(stage);
        const photo=page.locator(stage+' .st-frame');
        assert((await photo.boundingBox()).width>width*.6,'Estación usa la anchura del teléfono');
        await page.locator(stage+' [data-st-mode="parts"]').tap();
        assert.equal(await page.locator(stage).getAttribute('data-mobile-view'),'parts');
        assert.equal(await page.locator(stage+' .st-p:visible').count(),6);
        for(const part of await page.locator(stage+' .st-p').all()) {
          const image=part.locator('img');await image.scrollIntoViewIfNeeded();
          await image.evaluate(img=>img.decode());
          assert((await image.boundingBox()).width>=100,'Pieza legible');
          assert(await part.locator('.st-tag b').isVisible());
          assert(await part.locator('.st-tag small').isVisible());
        }
        await page.locator(stage+' [data-st-mode="assembled"]').tap();
        await page.locator(stage+' [data-preview]').tap();
      }
      const dialog=page.locator('dialog.pv');assert(await dialog.isVisible());
      await dialog.locator('img').evaluate(i=>i.decode());
      await dialog.locator('[data-pv-in]').tap();await dialog.locator('[data-pv-in]').tap();
      assert.equal(await dialog.locator('output').textContent(),'200%');
      assert(await dialog.locator('.pv__viewport').evaluate(e=>e.scrollWidth>e.clientWidth),'La imagen ampliada se puede recorrer');
      await dialog.locator('[data-pv-close]').tap();
      assert(!await dialog.isVisible());
      if(id==='smart') {
        await page.locator('[data-preview="img/producto/tablet.webp"]').tap();
        assert(await page.locator('.pv img').evaluate(i=>i.getAttribute('src').includes('tablet.webp')));
        await page.locator('[data-pv-close]').tap();
      }
      if(id==='intelligence') {
        await page.locator('[data-preview="img/app/intelligence.webp"]').tap();
        await page.locator('.pv img').evaluate(i=>i.decode());
        assert.equal(await page.locator('.pv img').evaluate(i=>i.naturalWidth),1440);
        await page.locator('[data-pv-close]').tap();
        await page.locator('#plan-intelligence .ch>.btn').tap();
        assert(await page.locator('#alta').isVisible());
        assert(await page.locator('#form-alta [name="plan"][value="intelligence"]').isChecked());
        assert(!(await page.locator('[data-sticky]').isVisible()),'No hay CTA que tape los controles');
      }
    }
    await page.locator('.ob__frame').scrollIntoViewIfNeeded();
    await page.locator('.ob__play').tap();
    await page.waitForFunction(()=>document.querySelector('.ob__video').readyState>=2);
    assert(await page.locator('.ob__video').isVisible());
    assert.equal(await page.locator('.ob__video').getAttribute('playsinline'),'');
    await page.locator('.nv-bar a[href="#inversores"]').tap();
    assert(await page.locator('#inversores').isVisible());
    for(const name of ['Tesis','Mercado','Modelo','Números','Validación','Roadmap','Equipo','Contacto']) {
      const tab=page.getByRole('tab',{name,exact:true});await tab.tap();
      const panel='#'+await tab.getAttribute('aria-controls');assert(await page.locator(panel).isVisible());await within(panel);
    }
    await page.getByRole('tab',{name:'Números',exact:true}).tap();
    assert((await page.locator('#inv-numeros').innerText()).includes('USD 163.287'));
    assert.equal(await page.locator('#inv-numeros svg:visible').count(),2);
    await page.locator('.nv-bar a[href="#inicio"]').tap();
    await page.locator('#preguntas details').first().locator('summary').tap();
    await page.locator('#preguntas details').nth(1).locator('summary').tap();
    assert(await page.locator('#preguntas details').nth(1).evaluate(d=>d.open));
    await page.locator('.nav__download').tap();await page.waitForURL(app);
    assert.deepEqual(errors,[]);
    console.log(`PASS ${width}x${height}: 3 planes, 10 pantallas, 6 piezas por estación, zoom, video, alta, FAQ, 8 pestañas de inversores y acceso a la app.`);
    await page.close();
  }
  // La versión legible también funciona sin la biblioteca de animaciones y con movimiento reducido.
  for(const fallback of ['reduce','no-gsap']) {
    const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:fallback==='reduce'?'reduce':'no-preference',isMobile:true,hasTouch:true});
    if(fallback==='no-gsap')await page.route('**/js/vendor/**',route=>route.fulfill({contentType:'application/javascript',body:''}));
    await page.goto(url);
    await page.locator('#tab-smart').tap();await page.locator('#plan-smart [data-st-mode="parts"]').tap();
    assert.equal(await page.locator('#plan-smart .st-p:visible').count(),6);
    await page.locator('#tab-intelligence').tap();assert(await page.locator('.an-full').isVisible());
    await page.locator('[data-preview="img/app/intelligence.webp"]').tap();assert(await page.locator('dialog.pv').isVisible());
    await page.keyboard.press('Escape');assert(!await page.locator('dialog.pv').isVisible());
    console.log('PASS fallback '+fallback);await page.close();
  }
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
