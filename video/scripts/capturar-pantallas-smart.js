const { chromium } = require('playwright');

const LIMPIAR = () => { const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 const rx=/(\+\s*)?\d+\s?%\s*por pack vendido|\s*La comisión por pack todavía no está definida\.?|Te quedás con el 75%[^.]*\.?\s*|APROVECHO cobra el 25%[^.]*\.?|\s*[·]?\s*Comisión del 25%\s*\$?[\d.,]+|\s*·\s*\$[\d.,]+ de comisión/gi;
 let n; while((n=w.nextNode())){ const v=n.nodeValue; const r=v.replace(rx,''); if(r!==v) n.nodeValue=r; } };
(async()=>{const out=process.argv[2];const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1024,height:600},deviceScaleFactor:2});const p=await ctx.newPage();
p.on('pageerror',e=>console.log('ERR',e.message));
let n=0; const shot=async(nm,w=1000)=>{await p.waitForTimeout(w);await p.evaluate(LIMPIAR); await p.screenshot({path:`${out}/${String(++n).padStart(2,'0')}-${nm}.png`});};
const click=async(re)=>{const l=p.getByText(re).first(); if(await l.count()){await l.click();return true;} console.log('no encontré',re);return false;};
await p.goto('http://127.0.0.1:8765/app/');
await click(/Entrar como local/); await p.waitForTimeout(800);
await click(/^Smart/); await p.waitForTimeout(500);
await click(/^Seguir/); await p.waitForTimeout(800);
await click(/carta de ejemplo/i); await p.waitForTimeout(800);
await p.getByText(/^Tarta de ricota/).first().click(); await p.waitForTimeout(600);
await p.fill('#precio','2500'); await p.getByRole('button',{name:'Guardar'}).click(); await p.waitForTimeout(800);
await p.locator('button').filter({hasText:/Guardar carta/}).last().click(); await p.waitForTimeout(800);
await p.locator('button').filter({hasText:/Terminar|Seguir|Listo/}).last().click(); await shot('hoy-smart',1500);
await p.goto('http://127.0.0.1:8765/app/#/b/estacion'); await shot('estacion-vacia',1200);
await click(/Simular pesaje y foto/); await shot('pesando',500); await shot('pesado',1800);
await click(/Para vender/); await shot('para-vender',1500);
await p.goto('http://127.0.0.1:8765/app/#/b/estacion'); await p.waitForTimeout(800);
await click(/Simular pesaje/); await p.waitForTimeout(2500); await click(/Descartar/); await shot('basura-motivo',1200);
const chip=p.locator('.chip').first(); if(await chip.count()){await chip.click(); await shot('basura-motivo-elegido',700); await click(/^Guardar/); await shot('registro',1200);}
await p.goto('http://127.0.0.1:8765/app/#/b/impacto'); await shot('impacto-smart',1800);
await b.close();})();
