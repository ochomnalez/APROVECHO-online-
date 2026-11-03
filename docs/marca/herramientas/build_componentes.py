import sys; sys.path.insert(0,'herramientas')
from icons import icon,ICONS
from qr import qr_path
n,d=qr_path("https://aprovecho.example/app")  # URL de ejemplo (SUPUESTO: dominio sin definir)
QR=f'<svg viewBox="-1 -1 {n+2} {n+2}" role="img" aria-label="Código QR de ejemplo" shape-rendering="crispEdges"><rect x="-1" y="-1" width="{n+2}" height="{n+2}" fill="#fff"/><path d="{d}" fill="#14281F"/></svg>'
MOON='<img src="logo/logo-isotipo-mono-negativo.svg" alt="" width="96" height="96">'
html=f'''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Componentes base · APROVECHO</title><link rel="icon" href="logo/favicon.svg">
<link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="componentes.css">
<style>
.doc{{max-width:1080px;margin:0 auto;padding:var(--space-6) var(--space-5) var(--space-9)}}
.doc h1{{font-size:var(--size-4xl)}} .doc h2{{font-size:var(--size-2xl);margin:var(--space-8) 0 var(--space-4);padding-top:var(--space-4);border-top:2px solid var(--color-border)}}
.doc .lead{{color:var(--color-text-muted);max-width:60ch}}
.row{{display:flex;flex-wrap:wrap;gap:var(--space-5);align-items:flex-start}} .grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:var(--space-5)}}
.stage{{background:var(--color-surface);border:1px dashed var(--color-border);border-radius:var(--radius-lg);padding:var(--space-5)}}
.stage--dark{{background:var(--color-primary)}} .note{{font-size:var(--size-sm);color:var(--color-text-muted);margin-top:var(--space-3)}}
.icons{{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:var(--space-3)}} .icons div{{display:flex;flex-direction:column;align-items:center;gap:6px;padding:var(--space-4) var(--space-2);background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);font-size:var(--size-xs);color:var(--color-primary)}}
.phone{{max-width:340px;border:1px solid var(--color-border);border-radius:28px;overflow:hidden;background:var(--color-bg);box-shadow:var(--shadow-lg)}}
.sw{{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:var(--space-3)}} .sw div{{border-radius:var(--radius-md);padding:var(--space-4);font-size:var(--size-xs);min-height:92px;border:1px solid var(--color-border)}}
</style></head><body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><g id="moon"><path d="M30 138C30 92 64 62 100 62s70 30 70 76l-26 6c0-26-18-44-44-44s-44 18-44 44z" fill="#FBF3E4"/></g></defs></svg>
<main class="doc">
<h1>Componentes base</h1><p class="lead">Kit UI v1 de APROVECHO. Todo usa <code>tokens.css</code> y <code>componentes.css</code> (prefijo <code>.ap-</code>). Es la fuente para app y landing.</p>

<h2>Botones</h2><div class="stage"><div class="row">
<button class="ap-btn ap-btn--primary">Sumá tu comercio</button><button class="ap-btn ap-btn--secondary">Conocé más</button><button class="ap-btn ap-btn--dark">Reservar pack</button><button class="ap-btn ap-btn--primary" disabled>Agotado</button></div>
<p class="note">Primario = acento corteza con texto <b>ink</b> (5,17:1, AA). Secundario = contorno verde. Máx. 3 palabras, verbo al principio. Un solo primario por pantalla.</p></div>

<h2>Etiquetas Medido / Estimado</h2><div class="stage"><div class="row">
<span class="ap-tag ap-tag--medido">{icon("medido")}Medido</span><span class="ap-tag ap-tag--estimado">{icon("estimado")}Estimado</span></div>
<p class="note">No dependen solo del color: <b>Medido</b> = sólida, ícono sello de balanza; <b>Estimado</b> = contorno <b>punteado</b>, ícono punteado y la palabra. Se distinguen en escala de grises. Pilar de marca: Honestidad.</p></div>

<h2>Tarjeta de pack</h2><div class="grid"><article class="ap-card"><div class="ap-pack__img"><span class="ap-pack__badge">50% OFF</span>{MOON}</div>
<div class="ap-pack__body"><p class="ap-pack__shop">Panadería La Espiga · 350 m</p><h3 class="ap-pack__title">Pack sorpresa de panadería</h3>
<div class="ap-pack__meta"><span style="display:inline-flex;gap:6px;align-items:center">{icon("reloj",18)}Retiro 19:00–20:30</span><span style="display:inline-flex;gap:6px;align-items:center">{icon("pack",18)}Quedan 3</span></div>
<div class="ap-pack__price"><span class="ap-pack__now">USD 3,99</span><span class="ap-pack__was">USD 7,98</span></div><button class="ap-btn ap-btn--primary ap-btn--block">Reservar pack</button></div></article>
<div><div class="stage"><p class="note" style="margin-top:0">Datos de ejemplo (D-015): USD 3,99 ≈ ARS 6.100. La imagen es un marcador; en producción va una foto real del comercio.</p></div></div></div>

<h2>Inputs</h2><div class="stage grid">
<div class="ap-field"><label class="ap-label" for="a">Nombre del comercio</label><input id="a" class="ap-input" placeholder="Ej.: Panadería La Espiga"><span class="ap-help">Como lo ven tus vecinos.</span></div>
<div class="ap-field"><label class="ap-label" for="b">Email</label><input id="b" class="ap-input ap-input--error" value="martin@" aria-invalid="true"><span class="ap-help ap-help--error">Revisá el email: falta el dominio.</span></div></div>

<h2>Chips de filtro</h2><div class="stage"><div class="ap-chips" role="group" aria-label="Filtros"><button class="ap-chip" aria-pressed="true">Todos</button><button class="ap-chip" aria-pressed="false">Panadería</button><button class="ap-chip" aria-pressed="false">Cafetería</button><button class="ap-chip" aria-pressed="false">Rotisería</button><button class="ap-chip" aria-pressed="false">Sin TACC</button><button class="ap-chip" aria-pressed="false">Ahora</button></div></div>

<h2>Barra de navegación</h2><div class="stage" style="padding:0;overflow:hidden">
<nav class="ap-nav" aria-label="Principal"><img src="logo/logo-horizontal-color.svg" alt="APROVECHO" height="34"><ul class="ap-nav__links"><li><a href="#" aria-current="page">Comercios</a></li><li><a href="#">Cómo funciona</a></li><li><a href="#">Inversores</a></li></ul><a class="ap-btn ap-btn--primary" href="#">Sumá tu comercio</a></nav></div>
<p class="note">Web. En app: barra inferior (abajo).</p>
<div class="phone"><div style="padding:var(--space-5);min-height:90px"><b style="font-family:var(--font-display);font-size:var(--size-xl);color:var(--color-primary)">Cerca tuyo</b></div>
<nav class="ap-tabbar" aria-label="App"><a href="#" aria-current="page">{icon("inicio")}Inicio</a><a href="#">{icon("mapa")}Mapa</a><a href="#">{icon("tuimpacto")}Tu impacto</a><a href="#">{icon("perfil")}Perfil</a></nav></div>

<h2>Tarjeta de métrica</h2><div class="grid">
<div class="ap-metric"><p class="ap-metric__label">Excedente recuperado</p><p class="ap-metric__value">128<span class="ap-metric__unit">kg</span></p><div class="ap-metric__foot"><span>Últimos 30 días</span><span class="ap-tag ap-tag--medido">{icon("medido")}Medido</span></div></div>
<div class="ap-metric"><p class="ap-metric__label">Huella de carbono asociada</p><p class="ap-metric__value">324<span class="ap-metric__unit">kg CO₂e</span></p><div class="ap-metric__foot"><span>No equivale a emisiones evitadas</span><span class="ap-tag ap-tag--estimado">{icon("estimado")}Estimado</span></div></div></div>
<p class="note">Cifras de ejemplo. Cifras grandes en verde bosque, tabulares y bold; siempre con su etiqueta Medido/Estimado.</p>

<h2>QR de retiro</h2><div class="row"><div class="ap-qr">{QR}<span class="ap-qr__code">AP-4821</span><span class="ap-qr__hint">Mostrá este código en el local para retirar tu pack.</span></div>
<div class="stage" style="flex:1;min-width:240px"><p class="note" style="margin-top:0">QR de ejemplo (apunta a una URL ficticia). Siempre sobre blanco con módulos ink; código manual como respaldo.</p></div></div>

<h2>Íconos (línea, trazo 2, puntas redondeadas)</h2><div class="icons">{''.join(f'<div>{icon(k,28)}{k}</div>' for k in ICONS)}</div>
<p class="note">Estilo Lucide/Phosphor. Indicador de plan: 1, 2 o 3 marcas (Base, Smart, Intelligence), no un color por plan.</p>

<h2>Paleta</h2><div class="sw">
<div style="background:var(--palette-forest);color:#fff">Forest<br>#1A4D3A</div><div style="background:var(--palette-crust);color:var(--palette-ink)">Corteza<br>#E07A2E</div><div style="background:var(--palette-crust-strong);color:#fff">Corteza fuerte<br>#A9490B</div><div style="background:var(--palette-cream)">Crema<br>#FBF3E4</div><div style="background:var(--palette-mint)">Menta<br>#DFFFD6</div><div style="background:var(--palette-ink);color:#fff">Ink<br>#14281F</div></div>
</main></body></html>'''
open('componentes.html','w',encoding='utf-8').write(html); print('componentes.html',len(html))
