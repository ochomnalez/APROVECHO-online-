const { chromium } = require('playwright');

const LIMPIAR = () => { const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 const rx=/(\+\s*)?\d+\s?%\s*por pack vendido|\s*La comisión por pack todavía no está definida\.?|Te quedás con el 75%[^.]*\.?\s*|APROVECHO cobra el 25%[^.]*\.?|\s*[·]?\s*Comisión del 25%\s*\$?[\d.,]+|\s*·\s*\$[\d.,]+ de comisión/gi;
 let n; while((n=w.nextNode())){ const v=n.nodeValue; const r=v.replace(rx,''); if(r!==v) n.nodeValue=r; } };

(async()=>{const out=process.argv[2];const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});const p=await ctx.newPage();
p.on('pageerror',e=>console.log('ERR',e.message));
const BOXES={}; const MAPA={'bienvenida':/Entrar como local/,'plan':/^Seguir/,'plan-elegido':/^Seguir/,'carta':/Sacarle foto|foto a mi lista/,'carta-cargada':/Guardar carta|Seguir|Terminar/,'local':/Terminar/,'hoy':/Sacar foto/,'camara':/Medialunas|Facturas|Empanadas/,'tras-analisis':/Seguir|Continuar|Confirmar|Revisar/,'revisar-checklist':/Publicar/,'publicado':/Ver cómo lo ve/,'cliente-ve-pack':/Reservar/,'reservar':/Pagar|Confirmar/,'retiros':/Escanear el QR/,'retiro-validado':/Volver|Listo/,'hoy-final':/Sacar foto/,'impacto':/Descargar/,'reporte':/Descargar (Excel|PDF)/,'reporte-pdf':/Descargar PDF/};
const REC=async(nm)=>{ const rx=MAPA[nm]; if(!rx) return; try{ const l=p.locator('button, a').filter({hasText:rx}).last(); const bb=await l.boundingBox(); if(bb) BOXES[nm]=bb; }catch(e){} };
let n=0; const shot=async(nm,w=1200)=>{await p.waitForTimeout(w);await p.evaluate(LIMPIAR); await REC(nm); await p.screenshot({path:`${out}/${String(++n).padStart(2,'0')}-${nm}.png`});};
const click=async(re)=>{const l=p.getByText(re).first(); if(await l.count()){await l.click();return true;} console.log('no encontré',re);return false;};
await p.goto('http://127.0.0.1:8765/app/');await shot('bienvenida');
await click(/Entrar como local/);await shot('plan');
await click(/^Básico|^Base/);await shot('plan-elegido',600);
await click(/^Seguir/);await shot('carta');
await click(/carta de ejemplo/i);await shot('carta-cargada');
const bt=async(t)=>console.log('BOTONES',t,':',(await p.$$eval('button',a=>a.map(e=>e.innerText.replace(/\n/g,' ').slice(0,28)).filter(Boolean))).slice(-6).join(' | '));
await p.getByText(/^Tarta de ricota/).first().click(); await p.waitForTimeout(800);
await p.fill('#precio','2500'); await bt('hoja-precio');
await p.getByRole('button',{name:'Guardar'}).click(); await p.waitForTimeout(1000); await bt('tras-guardar');
await p.locator('button').filter({hasText:/Guardar carta/}).last().click(); await shot('local'); await bt('local');
await p.locator('button').filter({hasText:/Terminar|Seguir|Listo/}).last().click(); await shot('hoy'); await bt('hoy');
await click(/Sacar foto/); await shot('camara'); await bt('camara');
const m=p.locator('button').filter({hasText:/Medialunas|Facturas|Empanadas/}).first(); await m.click();
await shot('analizando',900); await shot('analizando-b',1500); await shot('tras-analisis',3000); await bt('tras-analisis');
for(let i=0;i<5;i++){ const c=p.locator('button').filter({hasText:/^(Seguir|Continuar|Confirmar|Listo|Revisar)/}).last(); if(await c.count()){await c.click(); await shot('paso'+i,1500); await bt('paso'+i);} }
const cbs=p.locator('input[type=checkbox]'); const nc=await cbs.count(); for(let i=0;i<nc;i++){ await cbs.nth(i).check().catch(()=>{}); }
await shot('revisar-checklist',600);
{ const r={}; const q=async(nm,loc)=>{ try{ const bb=await loc.first().boundingBox(); r[nm]=bb; }catch(e){ r[nm]=null; } };
  await q('retiro_seg', p.locator('.seg')); await q('condiciones', p.locator('.chips')); await q('alergenos_caja', p.getByText('Confirmá antes de publicar').locator('xpath=ancestor::*[self::fieldset or contains(@class,"card")][1]')); await q('publicar', p.locator('button').filter({hasText:/Publicar/}).last()); await q('retiro_label', p.getByText('Retiro').first());
  require('fs').writeFileSync(out+'/cajas-revisar.json', JSON.stringify(r,null,1)); }

const pub=p.locator('button').filter({hasText:/Publicar/}).last(); if(await pub.count()){ await pub.click(); await shot('publicado',1800); await bt('publicado'); }
const tryc=async(re,nm,w=1500)=>{const l=p.locator('button, a').filter({hasText:re}).last(); if(await l.count()){await l.click().catch(e=>console.log('clickerr',nm)); await shot(nm,w); await bt(nm); return true;} console.log('NO',nm); return false;};
await tryc(/Ver cómo lo ve el cliente/,'cliente-ve-pack');
await tryc(/^Reservar/,'reservar');
await tryc(/^Pagar|Confirmar/,'reserva-qr',2500);
const code=(await p.innerText('body')).match(/\b[A-Z0-9]{4}\b/g); console.log('CODIGOS',code&&code.slice(0,8).join(','));
await p.goto('http://127.0.0.1:8765/app/#/b/retiros'); await shot('retiros',1800); await bt('retiros');
if(code){ await p.locator('input:visible').first().fill(code[0]); await tryc(/^Validar/,'retiro-validado',1800); }
await p.goto('http://127.0.0.1:8765/app/#/b/hoy'); await shot('hoy-final',1800);
await p.goto('http://127.0.0.1:8765/app/#/b/impacto'); await shot('impacto',2000);
{ const r={}; try{ r.co2=await p.getByText('huella asociada').first().locator('xpath=ancestor::*[contains(@class,"card") or contains(@class,"kpi")][1]').boundingBox(); }catch(e){ r.co2=null; }
  try{ r.kpis=await p.getByText('recuperados').first().locator('xpath=ancestor::*[contains(@class,"card")][1]').boundingBox(); }catch(e){ r.kpis=null; }
  require('fs').writeFileSync(out+'/cajas-impacto.json', JSON.stringify(r,null,1)); }

await tryc(/Descargar/,'reporte',1500);
await tryc(/^PDF/,'reporte-pdf',800);
await p.locator('#btn-descargar').click().catch(()=>{}); await shot('reporte-descargando',700); await shot('reporte-listo',2500);
{ BOXES['confirmar-entrega']=null; } require('fs').writeFileSync(out+'/cajas-botones.json', JSON.stringify(BOXES,null,1)); await b.close();})();
