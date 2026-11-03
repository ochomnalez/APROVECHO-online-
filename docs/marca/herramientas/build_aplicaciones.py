import sys; sys.path.insert(0,'herramientas')
from qr import qr_path
n,d=qr_path("https://aprovecho.example/app")
def QR(sz,cls=''): return f'<svg class="{cls}" width="{sz}" height="{sz}" viewBox="-2 -2 {n+4} {n+4}" shape-rendering="crispEdges"><rect x="-2" y="-2" width="{n+4}" height="{n+4}" fill="#fff"/><path d="{d}" fill="#14281F"/></svg>'
html=f'''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Aplicaciones · APROVECHO</title>
<link rel="icon" href="../logo/favicon.svg"><link rel="stylesheet" href="../tokens.css">
<style>
body{{margin:0;padding:var(--space-6)}} h1{{font-size:var(--size-3xl)}} h2{{font-size:var(--size-xl);margin:var(--space-7) 0 var(--space-3)}}
.n{{color:var(--color-text-muted);font-size:var(--size-sm);max-width:70ch}} .wrap{{overflow:auto;padding:var(--space-3) 0}}
.piece{{position:relative;overflow:hidden;flex:none}}
/* 1 sticker */
#sticker{{width:640px;height:640px;border-radius:50%;background:var(--palette-forest);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;border:14px solid var(--palette-cream);box-shadow:inset 0 0 0 8px var(--palette-crust);box-sizing:border-box;padding-top:10px}}
#sticker h3{{margin:0;color:var(--palette-cream);font-size:50px;text-align:center;line-height:1.05}} #sticker h3 b{{color:var(--palette-crust)}}
#sticker .qrbox{{background:#fff;padding:12px;border-radius:20px}} #sticker img{{height:26px;width:auto}} #sticker small{{color:var(--palette-mint);font:600 22px var(--font-body)}}
/* 2 cartel */
#cartel{{width:1050px;height:740px;background:var(--palette-cream);border:14px solid var(--palette-forest);box-sizing:border-box;padding:44px 56px;display:grid;grid-template-columns:1fr 330px;gap:40px;align-items:center}}
#cartel h3{{font-size:76px;margin:0 0 18px;line-height:1}} #cartel h3 em{{font-style:normal;color:var(--palette-crust-strong)}} #cartel p{{font-size:30px;margin:0 0 26px;color:var(--palette-text)}}
#cartel .qrcol{{text-align:center;background:var(--palette-forest);border-radius:28px;padding:26px 20px;color:var(--palette-cream);font:700 26px/1.2 var(--font-display)}} #cartel .qrcol .qrbox{{background:#fff;padding:10px;border-radius:16px;margin-bottom:14px}}
#cartel .logo{{position:absolute;left:56px;bottom:40px;height:46px}}
/* 3 bolsa */
#bolsa{{width:560px;height:720px;background:linear-gradient(#CDA877,#C09A68);clip-path:polygon(4% 0,96% 0,100% 100%,0 100%);display:flex;flex-direction:column;align-items:center;padding-top:60px;box-sizing:border-box;gap:20px}}
#bolsa::before{{content:"";position:absolute;top:0;left:0;right:0;height:34px;background:rgba(0,0,0,.10)}}
#bolsa img.b{{width:250px}} #bolsa h3{{color:var(--palette-forest);font-size:30px;margin:6px 0 0;text-align:center}} #bolsa p{{margin:0;color:var(--palette-forest);font:600 20px/1.3 var(--font-body);text-align:center;max-width:380px}}
#bolsa .how{{margin-top:auto;margin-bottom:46px;border:2px dashed var(--palette-forest);border-radius:14px;padding:12px 18px;font:600 17px/1.3 var(--font-body);color:var(--palette-forest);text-align:center;max-width:400px}}
/* 4 instagram 4:5 */
#ig{{width:540px;height:675px;background:var(--palette-crust);color:var(--palette-ink);box-sizing:border-box;padding:44px;display:flex;flex-direction:column}}
#ig .top{{display:flex;justify-content:space-between;align-items:center}} #ig .top img{{height:30px}} #ig .pill{{background:var(--palette-forest);color:var(--palette-cream);font:700 15px var(--font-body);padding:8px 14px;border-radius:999px}}
#ig h3{{font-size:74px;margin:54px 0 14px;color:var(--palette-ink);line-height:.95;letter-spacing:-.02em}} #ig h3 span{{color:var(--palette-cream)}}
#ig p{{font:500 23px/1.3 var(--font-body);margin:0;max-width:380px}} #ig .moon{{position:absolute;right:-60px;bottom:-40px;width:330px;opacity:1}} #ig .cta{{margin-top:auto;position:relative;z-index:1;align-self:flex-start;background:var(--palette-forest);color:var(--palette-cream);font:800 20px var(--font-display);padding:16px 26px;border-radius:999px}}
</style></head><body>
<h1>Aplicaciones de marca</h1><p class="n">Mockups en HTML/CSS con los tokens de marca. QR de ejemplo (URL ficticia). Textos de ejemplo salen de <code>marketing/</code> y del plan; "Datos de ejemplo". Fotos reales se agregan después (D-023).</p>

<h2>1 · Sticker de vidriera (círculo ⌀ 12 cm, legible a 2 m)</h2><div class="wrap"><div class="piece" id="sticker">
<h3>Escaneá y<br><b>bajate la app</b></h3><div class="qrbox">{QR(250)}</div><small>Packs sorpresa a mitad de precio</small><img src="../logo/logo-wordmark-negativo.svg" alt="APROVECHO"></div></div>

<h2>2 · Cartel de caja (A5 apaisado)</h2><div class="wrap"><div class="piece" id="cartel"><div><h3>Hoy hay <em>pack sorpresa</em></h3><p>Comida rica del día, a mitad de precio. Reservalo desde la app y retiralo acá con tu QR.</p></div>
<div class="qrcol"><div class="qrbox">{QR(270)}</div>Escaneá y probá la app</div><img class="logo" src="../logo/logo-horizontal-color.svg" alt="APROVECHO"></div></div>

<h2>3 · Bolsa biodegradable (kraft)</h2><div class="wrap"><div class="piece" id="bolsa"><img class="b" src="../logo/logo-badge-color.svg" alt="APROVECHO">
<h3>Menos desperdicio, más aprovecho</h3><p>Bolsa biodegradable y compostable</p><div class="how">Cómo desecharla: al cesto de orgánicos o a tu compost. (Texto a validar)</div></div></div>
<p class="n">El 51% de los consumidores no sabe cómo desechar este tipo de bolsa (plan 5.2): por eso la instrucción va impresa. La frase exacta de desecho es SUPUESTO: validar con el proveedor de la bolsa.</p>

<h2>4 · Posteo para Instagram (4:5, 1080×1350)</h2><div class="wrap"><div class="piece" id="ig"><div class="top"><img src="../logo/logo-horizontal-mono.svg" alt="APROVECHO"><span class="pill">Packs sorpresa</span></div>
<h3>¿Qué te <span>toca hoy?</span></h3><p>Ni idea. Pero es rico, es de tu barrio y sale la mitad.</p><img class="moon" src="../logo/logo-isotipo-mono-negativo.svg" alt=""><span class="cta">Bajate la app</span></div></div>
</body></html>'''
open('aplicaciones/index.html','w',encoding='utf-8').write(html)
