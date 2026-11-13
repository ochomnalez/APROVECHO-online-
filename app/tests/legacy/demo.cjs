// Prueba histórica del prototipo sin cuentas (commit bc50bdc). No ejecutarla sobre la versión con autenticación.
// Servir la raíz en :8765. Ejecutar con Playwright instalado (ver app/README.md).
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const base = process.env.APP_URL || 'http://127.0.0.1:8765/app/';
  const shotDir = process.env.CAPTURE_DIR || 'work/app-qa';
  fs.mkdirSync(shotDir, {recursive:true});
  const shot = name => page.screenshot({path:`${shotDir}/${name}.png`});
  const click = sel => page.locator(sel).first().click();
  const state = () => page.evaluate(() => JSON.parse(localStorage.getItem('aprovecho_prototipo_plan')));
  const go = route => page.evaluate(async r => (await import('./js/nav.js')).nav.go(r, {raiz:true}), route);
  async function verifyScreen(route, name) {
    await go(route); await page.waitForTimeout(1100);
    assert(await page.locator('.pantalla.actual').innerText(), route);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth), `Overflow: ${route}`);
    await shot(name);
  }
  try {
    await page.goto(base); await page.waitForTimeout(1100);
    await click('[data-act="entrar-comercio"]');
    assert((await page.locator('body').innerText()).includes('Comisión del 25%'));
    await click('[data-act="plan-alta"][data-v="basico"]');
    await click('[data-go="b/carta"]'); await click('[data-act="leer-carta"] >> nth=1');
    await page.locator('[data-act="editar-precio"]').first().waitFor();
    // La lectura simulada deja una duda real para revisar.
    const missing = (await state()).carta.filter(p=>p.precio == null);
    for(const p of missing) {
      await click(`[data-act="editar-precio"][data-id="${p.id}"]`);
      await page.locator('#precio').fill('12200'); await click('[data-ok]');
    }
    await click('[data-go="b/local"]'); await click('[data-act="terminar-alta"]');
    await page.waitForTimeout(300);
    assert(!(await page.locator('body').innerText()).includes('Límite para publicar'));
    await shot('01-base');
    await click('[data-go="b/camara"]');
    await click('[data-act="usar-muestra"] >> nth=0');
    await page.locator('[data-act="publicar"]').waitFor({timeout:15000});
    assert.equal(await page.locator('.comercio-check input[type=checkbox]').count(),0);
    const before = (await state()).packs.length;
    await click('[data-act="publicar"]');
    await page.getByRole('button',{name:'Volver a revisar',exact:true}).click();
    assert.equal((await state()).packs.length,before);
    await shot('02-deteccion');
    await click('[data-act="publicar"]'); await shot('03-confirmacion');
    await page.getByRole('button',{name:'Confirmar y publicar',exact:true}).click();
    await page.waitForTimeout(300);
    const published = (await state()).packs.filter(p=>!p.id.startsWith('ps') && p.comercioId==='c1');
    assert(published.length>0);
    assert(published.every(p=>p.checklist && p.precio===Math.round(p.valor*.5)));
    const pack = published[0];
    // Cambiar de lado conserva el lote real creado por la interacción anterior.
    await page.evaluate(async()=>{const {S,guardar}=await import('./js/store.js');S.rol='cliente';guardar()});
    await verifyScreen('c/inicio','04-consumidor');
    await go('c/pago/'+pack.id);
    await click('[data-act="pagar"][data-falla="true"]'); await page.waitForTimeout(1000);
    assert.equal((await state()).reservas.length,0);
    assert.equal((await state()).packs.find(p=>p.id===pack.id).stock,pack.stock);
    await click('[data-act="pagar"]:not([data-falla])'); await page.waitForTimeout(1300);
    const r = (await state()).reservas[0]; assert(r && r.estado==='activa');
    assert.equal((await state()).packs.find(p=>p.id===pack.id).stock,pack.stock-1);
    await shot('05-reserva');
    await page.reload(); await page.waitForTimeout(1100);
    assert.equal((await state()).reservas[0].code,r.code);
    await page.evaluate(async()=>{const {S,guardar}=await import('./js/store.js');S.rol='comercio';guardar()});
    await go('b/retiros');
    await page.locator('[name=codigo]').fill(r.code); await page.locator('form[data-form=codigo]').evaluate(f=>f.requestSubmit());
    await click('[data-act="entregar"]'); await page.waitForTimeout(200);
    assert.equal((await state()).reservas[0].estado,'retirada');
    await page.locator('[name=codigo]').fill(r.code); await page.locator('form[data-form=codigo]').evaluate(f=>f.requestSubmit());
    assert((await page.locator('body').innerText()).includes('ya se entregó'));
    await page.keyboard.press('Escape'); await page.waitForTimeout(250);
    // Cancelación gratuita restaura una unidad; el retiro anterior no se revierte.
    await page.evaluate(async()=>{const {S,guardar}=await import('./js/store.js');S.rol='cliente';guardar()});
    const cancelPack = (await state()).packs.find(p=>p.stock>0 && p.estado==='activo');
    await go('c/pago/'+cancelPack.id); await click('[data-act="pagar"]:not([data-falla])'); await page.waitForTimeout(1300);
    const stockPaid = (await state()).packs.find(p=>p.id===cancelPack.id).stock;
    await click('[data-act="cancelar-reserva"]'); await page.locator('[data-r="1"]').click(); await page.waitForTimeout(200);
    assert.equal((await state()).reservas[0].estado,'cancelada');
    assert.equal((await state()).packs.find(p=>p.id===cancelPack.id).stock, stockPaid+1);
    await page.evaluate(async()=>{const {S,guardar}=await import('./js/store.js');S.rol='comercio';S.plan='smart';guardar()});
    await page.setViewportSize({width:1180,height:820});
    await verifyScreen('b/estacion','06-smart');
    await click('[data-act="simular-pesaje"]');
    await page.locator('[data-act="pesaje-vender"]:not([disabled])').waitFor({timeout:15000});
    await click('[data-act="pesaje-vender"]');
    await click('[data-act="publicar"]'); await page.getByRole('button',{name:'Confirmar y publicar',exact:true}).click();
    await page.waitForTimeout(200);
    assert((await state()).packs.some(p=>p.medido && p.origen==='estacion'));
    await page.evaluate(async()=>{const {S,guardar}=await import('./js/store.js');S.plan='intelligence';guardar()});
    await page.setViewportSize({width:1440,height:900});
    await verifyScreen('b/intel','07-intelligence');
    await click('[data-act="intel-sub"][data-v="inventario"]');
    await shot('08-inventario');
    const date = await page.evaluate(async()=>{const {hoy}=await import('./js/store.js');return hoy()});
    await page.locator('[data-act-change="intel-csv"]').setInputFiles({name:'inventario.csv',mimeType:'text/csv',buffer:Buffer.from(`sucursal,producto,cantidad,vencimiento,precio_unitario\nolivos,Yogur,4,${date},6100`)});
    await page.waitForTimeout(200); assert((await page.locator('body').innerText()).includes('Yogur'));
    await click('[data-act="intel-proponer"]');
    await click('[data-act="publicar"]'); await page.getByRole('button',{name:'Confirmar y publicar',exact:true}).click();
    await page.waitForTimeout(200);
    assert((await state()).packs.some(p=>p.origen==='inventario'));
    await verifyScreen('b/reporte','09-reporte');
    const download = page.waitForEvent('download'); await click('[data-act="descargar"]');
    const file = await download; assert(file.suggestedFilename().endsWith('.xlsx')); await file.saveAs(`${shotDir}/${file.suggestedFilename()}`);
    // La presentación funciona sin CDN ni conexión luego de instalar la PWA.
    await page.goto(base+'?sw', {waitUntil:'networkidle'});
    await page.evaluate(async()=>{await navigator.serviceWorker.ready; if(!navigator.serviceWorker.controller) await new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true}));});
    await page.context().setOffline(true);
    await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(1100);
    await go('b/reporte'); await click('[data-act="rep-formato"][data-v="pdf"]');
    const pdfEvent = page.waitForEvent('download'); await click('[data-act="descargar"]');
    const pdf = await pdfEvent; assert(pdf.suggestedFilename().endsWith('.pdf')); await pdf.saveAs(`${shotDir}/${pdf.suggestedFilename()}`);
    await page.evaluate(async()=>{const {S,guardar}=await import('./js/store.js');S.rol='cliente';guardar()});
    const available = (await state()).packs.find(p=>p.stock>0 && p.estado==='activo');
    await go('c/pago/'+available.id); await click('[data-act="pagar"]:not([data-falla])'); await page.waitForTimeout(1300);
    await page.locator('#qr svg').waitFor(); await shot('10-qr-offline');
    // Adjuntar y persistir una foto de reclamo.
    await go('c/reserva/'+r.id); await click('[data-act="reportar-pack"]');
    await page.locator('#foto-reporte').setInputFiles('app/img/fotos/pan.webp');
    await page.locator('#detalle-reporte').fill('Ejemplo de reclamo para la demo');
    await page.getByRole('button',{name:'Registrar reporte',exact:true}).click();
    await page.waitForTimeout(500);
    assert((await state()).reservas.find(x=>x.id===r.id).reporte.foto.startsWith('data:image/jpeg'));
    await page.context().setOffline(false);
    // Publicar a las 20:15 ya no queda bloqueado por la antigua regla de 2 horas.
    await page.clock.setFixedTime(new Date(date+'T20:15:00'));
    await page.evaluate(async()=>{const {S,guardar}=await import('./js/store.js');S.horaReal=true;S.rol='comercio';guardar()});
    await go('b/camara'); await click('[data-act="usar-muestra"]');
    await page.locator('[data-act="publicar"]').waitFor({timeout:15000});
    await click('[data-act="publicar"]'); await page.getByRole('button',{name:'Confirmar y publicar',exact:true}).click();
    await page.waitForTimeout(250);
    assert((await state()).packs.some(p=>p.retiroDesde==='20:15'));
    await page.clock.setFixedTime(new Date(date+'T21:05:00'));
    await go('b/hoy'); assert(await page.locator('[data-go="b/camara"][disabled]').count()>0);
    assert.deepEqual(errors,[]);
    console.log('OK: alta, Base, confirmación/cancelación de publicación, pago fallido, reserva, persistencia, retiro y duplicado, cancelación, Smart, CSV Intelligence, Excel y PDF, PWA/QR sin conexión, foto de reclamo y horarios; sin errores JS.');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1});
