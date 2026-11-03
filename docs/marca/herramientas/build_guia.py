import sys,json; sys.path.insert(0,'herramientas')
from icons import icon,ICONS
T=json.load(open('tokens.json',encoding='utf-8'))
rows=''.join(f'<tr><td><span class="chip" style="background:{T["color"][c["fondo"]]["value"]};color:{T["color"][c["texto"]]["value"]}">Aa</span></td><td>{c["texto"]} sobre {c["fondo"]}</td><td>{c["uso"]}</td><td class="num"><b>{str(c["ratio"]).replace(".",",")}:1</b></td><td>{"✓ AA" if c["cumple"] else "✗"}</td></tr>' for c in T['contraste-aa'])
sw=[("forest","Verde bosque","Primario"),("crust","Corteza","Acento"),("crust-strong","Corteza fuerte","Texto acento"),("cream","Crema","Fondo"),("mint","Menta","Apoyo"),("ink","Ink","Texto fuerte"),("text","Carbón","Texto"),("crust-soft","Corteza suave","Resaltado")]
def dark(h): 
    h=h.lstrip('#');r,g,b=[int(h[i:i+2],16) for i in (0,2,4)];return (r*.299+g*.587+b*.114)<150
sws=''.join(f'<div class="sw" style="background:{T["color"][k]["value"]};color:{"#fff" if dark(T["color"][k]["value"]) else "#14281F"}"><b>{n}</b><span>{T["color"][k]["value"]}</span><i>{u}</i></div>' for k,n,u in sw)
icons=''.join(f'<div>{icon(k,28)}<span>{k}</span></div>' for k in ICONS)
bad=[
 ('Deformarlo','<img src="../logo/logo-badge-color.svg" style="transform:scaleX(1.5)">'),
 ('Cambiar los colores','<img src="../logo/logo-badge-color.svg" style="filter:hue-rotate(150deg) saturate(1.4)">'),
 ('Rotarlo o inclinarlo','<img src="../logo/logo-horizontal-color.svg" style="transform:rotate(-14deg);width:150px">'),
 ('Sombras y efectos','<img src="../logo/logo-horizontal-color.svg" style="filter:drop-shadow(5px 5px 4px #000);width:170px">'),
 ('Fondo sin contraste','<div style="background:#2E7D52;padding:18px;border-radius:12px"><img src="../logo/logo-horizontal-color.svg" style="width:170px"></div>'),
 ('Sobre foto cargada','<div style="background:repeating-linear-gradient(45deg,#c2a77a 0 12px,#8b6a3e 12px 24px,#d8c3a0 24px 36px);padding:22px;border-radius:12px"><img src="../logo/logo-horizontal-color.svg" style="width:170px"></div>'),
 ('Reescribir el texto o cambiar la tipografía','<div style="font:700 30px Georgia,serif;letter-spacing:.2em;color:#1A4D3A">Aprovecho</div>'),
 ('Agregar hojas u otros símbolos','<div style="position:relative;display:inline-block"><img src="../logo/logo-isotipo-color.svg" style="width:110px"><span style="position:absolute;right:-18px;top:-10px;font-size:38px">🍃</span></div>'),
 ('Achicarlo bajo el mínimo','<img src="../logo/logo-badge-color.svg" style="width:22px"> <small>22 px: el arco ya no se lee</small>'),
 ('Usar el badge con texto como favicon','<img src="../logo/logo-badge-color.svg" style="width:16px"> <small>16 px: usar favicon.svg</small>'),
]
badh=''.join(f'<figure class="bad"><div class="bx">{h}<b class="x">✕</b></div><figcaption>{t}</figcaption></figure>' for t,h in bad)
def tile(src,label,bg='#fff',w=150):
    return f'<figure class="tile" style="background:{bg}"><img src="{src}" style="width:{w}px" alt="{label}"><figcaption>{label}</figcaption></figure>'
vers=''
for k,lab in (('color','Color'),('mono','Monocromo'),('negativo','Negativo'),('mono-negativo','Mono negativo')):
    bg='#1A4D3A' if 'negativo' in k else '#FFFFFF'; fc='#FBF3E4' if 'negativo' in k else '#14281F'
    vers+=tile(f'../logo/logo-badge-{k}.svg',f'Badge · {lab}',bg,130).replace('<figcaption>',f'<figcaption style="color:{fc}">')
    vers+=tile(f'../logo/logo-isotipo-{k}.svg',f'Isotipo · {lab}',bg,110).replace('<figcaption>',f'<figcaption style="color:{fc}">')
    vers+=tile(f'../logo/logo-horizontal-{k}.svg',f'Horizontal · {lab}',bg,220).replace('<figcaption>',f'<figcaption style="color:{fc}">')
    vers+=tile(f'../logo/logo-wordmark-{k}.svg',f'Wordmark · {lab}',bg,200).replace('<figcaption>',f'<figcaption style="color:{fc}">')
html=f'''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Guía de marca · APROVECHO</title>
<link rel="icon" href="../logo/favicon.svg"><link rel="stylesheet" href="../tokens.css"><link rel="stylesheet" href="../componentes.css">
<style>
html{{scroll-behavior:smooth}} body{{margin:0}}
.layout{{display:grid;grid-template-columns:220px 1fr;min-height:100vh}}
aside{{position:sticky;top:0;height:100vh;background:var(--palette-forest);padding:var(--space-5);box-sizing:border-box;overflow:auto}}
aside img{{width:150px;margin-bottom:var(--space-6)}} aside a{{display:block;color:var(--palette-cream);text-decoration:none;padding:8px 10px;border-radius:8px;font:600 var(--size-sm) var(--font-body)}} aside a:hover{{background:rgba(255,255,255,.12)}} aside small{{display:block;color:var(--palette-mint);margin-top:var(--space-6);opacity:.8}}
main{{padding:var(--space-7) var(--space-7) var(--space-9);max-width:1060px}} section{{padding-top:var(--space-6);margin-bottom:var(--space-8)}}
h1{{font-size:var(--size-5xl)}} h2{{font-size:var(--size-3xl);border-top:3px solid var(--palette-crust);padding-top:var(--space-4);margin:0 0 var(--space-4)}} h3{{font-size:var(--size-lg);margin:var(--space-6) 0 var(--space-3)}}
p,li{{max-width:68ch}} .lead{{font-size:var(--size-lg);color:var(--color-text-muted)}}
.g{{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:var(--space-4)}} .tile{{margin:0;border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-5) var(--space-3) var(--space-3);display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:var(--space-4);min-height:170px}} .tile figcaption{{font-size:var(--size-xs);font-weight:600}}
.sws{{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:var(--space-3)}} .sw{{border-radius:var(--radius-md);padding:var(--space-4);min-height:110px;display:flex;flex-direction:column;justify-content:flex-end;gap:2px;font-size:var(--size-sm);border:1px solid rgba(0,0,0,.08)}} .sw i{{font-size:var(--size-xs);opacity:.85}}
table{{border-collapse:collapse;width:100%;font-size:var(--size-sm);background:var(--palette-surface);border-radius:var(--radius-md);overflow:hidden}} th,td{{padding:10px 12px;text-align:left;border-bottom:1px solid var(--color-border)}} th{{background:var(--palette-mint);color:var(--palette-forest)}} .chip{{display:inline-block;padding:4px 12px;border-radius:8px;font-weight:700;border:1px solid rgba(0,0,0,.1)}}
.ok{{border-left:6px solid var(--palette-forest)}} .no{{border-left:6px solid var(--palette-error)}} .box{{background:var(--palette-surface);border-radius:var(--radius-md);padding:var(--space-4) var(--space-5);border:1px solid var(--color-border)}} .cols{{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4)}}
.clear{{position:relative;display:inline-block;padding:44px;background:repeating-linear-gradient(45deg,#fff 0 6px,#fdf2e3 6px 12px);border:2px dashed var(--palette-crust)}} .clear img{{display:block;width:200px;outline:1px solid var(--palette-forest)}} .clear span{{position:absolute;font:700 12px var(--font-body);color:var(--palette-crust-strong)}}
.scale div{{display:flex;align-items:baseline;gap:var(--space-4);border-bottom:1px solid var(--color-border);padding:8px 0}} .scale small{{width:130px;flex:none;color:var(--color-text-muted)}}
.icons{{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:var(--space-3)}} .icons div{{display:flex;flex-direction:column;align-items:center;gap:6px;padding:var(--space-3);background:var(--palette-surface);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--palette-forest);font-size:11px}}
.bads{{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:var(--space-4)}} .bad{{margin:0}} .bx{{position:relative;min-height:150px;border:2px solid var(--palette-error);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;overflow:hidden;padding:var(--space-3);background:#fff}} .bx img{{width:120px}} .x{{position:absolute;top:6px;right:8px;color:var(--palette-error);font-size:20px}} .bad figcaption{{font-size:var(--size-sm);margin-top:6px;font-weight:600}}
.photo{{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:var(--space-3)}} .ph{{aspect-ratio:4/5;border-radius:var(--radius-md);display:flex;align-items:flex-end;padding:var(--space-3);font:600 var(--size-sm) var(--font-body);color:#fff;background-size:cover}}
@media(max-width:820px){{.layout{{grid-template-columns:1fr}} aside{{position:static;height:auto}} main{{padding:var(--space-5)}} .cols{{grid-template-columns:1fr}}}}
</style></head><body><div class="layout">
<aside><img src="../logo/logo-horizontal-negativo.svg" alt="APROVECHO"><nav><a href="#logo">Logo</a><a href="#resguardo">Resguardo y tamaños</a><a href="#color">Color</a><a href="#tipografia">Tipografía</a><a href="#tono">Tono</a><a href="#iconos">Iconografía</a><a href="#fotos">Fotografía</a><a href="#ilustracion">Ilustración</a><a href="#incorrectos">Usos incorrectos</a><a href="#apps">Aplicaciones</a><a href="../componentes.html">Componentes UI ↗</a></nav><small>Guía de marca v1 · nov 2026</small></aside>
<main>
<h1>Guía de marca</h1><p class="lead">APROVECHO conecta comercios con excedentes aptos y consumidores cercanos, y ayuda a medir y reducir el desperdicio. Esta guía es la fuente para app, landing, videos y piezas físicas.</p>

<section id="logo"><h2>Logo</h2>
<p>Profesionalizamos el logo actual (D-011): se mantiene el <b>badge circular</b>, la base verde y el slogan; se redibujó en <b>vector</b> y el ícono ambiguo se reemplazó por una <b>medialuna integrada a la flecha circular</b> (D-018): se lee en un segundo, es del rubro n.º 1 de excedentes y muy argentina. Una sola marca: sin hojas ni otros símbolos.</p>
<p class="box ok"><b>Por qué se ve distinto de la categoría:</b> Too Good To Go, Cheaf y Buen Provecho usan verde + hoja. Nosotros sumamos el acento <b>corteza</b> y un símbolo propio del producto.</p>
<h3>Versiones</h3><div class="g">{vers}</div>
<p>Cuándo usar cada una: <b>Badge</b> (≥ 64 px): portadas, bolsa, sticker, avatar. <b>Horizontal</b>: barras de navegación, firmas, documentos. <b>Isotipo</b>: espacios chicos y cuadrados, sellos. <b>Wordmark</b>: cuando el símbolo ya aparece cerca. <b>Mono</b>: una tinta (sellos, fax, grabado). <b>Negativo</b>: sobre verde o fondos oscuros. Íconos: <code>app-icon-1024.svg</code> (el sistema aplica la máscara) y <code>favicon.svg</code> (isotipo simplificado de 3 gajos).</p>
<div class="g"><figure class="tile"><img src="../logo/app-icon-1024.svg" style="width:120px;border-radius:26px" alt=""><figcaption>Ícono de app (verde)</figcaption></figure><figure class="tile"><img src="../logo/app-icon-corteza-1024.svg" style="width:120px;border-radius:26px" alt=""><figcaption>Ícono alternativo (corteza)</figcaption></figure><figure class="tile"><img src="../logo/app-icon-1024.svg" style="width:48px;border-radius:11px" alt=""><figcaption>A 48 px</figcaption></figure><figure class="tile"><img src="../logo/favicon.svg" style="width:64px" alt=""><figcaption>Favicon (16/32 px y SVG)</figcaption></figure></div></section>

<section id="resguardo"><h2>Área de resguardo y tamaño mínimo</h2>
<div class="cols"><div><div class="clear"><img src="../logo/logo-horizontal-color.svg" alt=""><span style="left:12px;top:12px">x</span><span style="right:14px;bottom:12px">x</span></div><p><b>x = la altura de la medialuna.</b> Dejá al menos <b>x</b> libre en los cuatro lados. Nada de texto, bordes ni imágenes dentro de ese margen.</p></div>
<table><tr><th>Versión</th><th>Mínimo digital</th><th>Mínimo impreso</th></tr><tr><td>Badge</td><td>64 px</td><td>20 mm</td></tr><tr><td>Horizontal</td><td>96 px de ancho</td><td>30 mm</td></tr><tr><td>Isotipo</td><td>24 px</td><td>8 mm</td></tr><tr><td>Wordmark</td><td>80 px de ancho</td><td>25 mm</td></tr><tr><td>Favicon</td><td>16 px</td><td>—</td></tr></table></div></section>

<section id="color"><h2>Color</h2>
<p>Verde bosque como base y un acento cálido propio, <b>corteza</b> (D-017): sale del producto (medialuna, pan tostado, caja kraft) y es lo que nos hace reconocibles. Proporción de uso sugerida: <b>60% crema / 25% verde bosque / 10% corteza / 5% menta</b>.</p><div class="sws">{sws}</div>
<h3>Reglas</h3><ul><li><b>CTA:</b> fondo corteza + texto <b>ink</b> (nunca texto blanco sobre corteza: 3,0:1, no cumple AA).</li><li><b>Texto de acento sobre claro:</b> usar <b>corteza fuerte</b> (#A9490B), no corteza.</li><li>El crema es más cálido y menos amarillo que el del plan (#F5F5DC → #FBF3E4).</li><li><b>Medido / Estimado:</b> código que no depende solo del color (ver abajo).</li></ul>
<h3>Código de transparencia</h3><div class="box"><span class="ap-tag ap-tag--medido">{icon("medido")}Medido</span> &nbsp; <span class="ap-tag ap-tag--estimado">{icon("estimado")}Estimado</span><p><b>Medido</b>: etiqueta sólida verde con sello. <b>Estimado</b>: contorno punteado, ícono punteado y la palabra. Se distinguen en escala de grises. Es parte de la marca (pilar Honestidad) y se usa en toda cifra de impacto.</p></div>
<h3>Contraste verificado (WCAG AA)</h3><table><tr><th></th><th>Par</th><th>Uso</th><th>Ratio</th><th>Estado</th></tr>{rows}</table></section>

<section id="tipografia"><h2>Tipografía</h2>
<p><b>Bricolage Grotesque</b> (títulos y wordmark): grotesca con carácter y terminaciones amables; reemplaza a Montserrat para diferenciarnos. <b>Inter</b> (texto e interfaz): legibilidad en celular y cifras tabulares para los dashboards. Ambas en Google Fonts, gratis para web y app.</p>
<div class="scale"><div><small>Display 56 · 800</small><span style="font:800 56px var(--font-display);color:var(--palette-forest);line-height:1">Menos desperdicio</span></div><div><small>H1 48 · 800</small><span style="font:800 48px var(--font-display);color:var(--palette-forest);line-height:1">Más aprovecho</span></div><div><small>H2 36 · 800</small><span style="font:800 36px var(--font-display);color:var(--palette-forest)">Sumá tu comercio</span></div><div><small>H3 22 · 800</small><span style="font:800 22px var(--font-display);color:var(--palette-forest)">Pack sorpresa de panadería</span></div><div><small>Texto 16 · 400</small><span>Comida rica del día, a mitad de precio y a la vuelta de tu casa.</span></div><div><small>Chico 14 · 500</small><span style="font-size:14px;font-weight:500">Retiro de 19:00 a 20:30</span></div><div><small>Métrica 56 · 800 tabular</small><span class="metric" style="font:800 56px var(--font-display);color:var(--palette-forest);line-height:1">1.284,5 kg</span></div></div></section>

<section id="tono"><h2>Tono</h2><p>Personalidad: <b>pícara, práctica, honesta, de barrio, optimista</b>. Arquetipo Vecino (+ Sabio en B2B). Voz única en español rioplatense con voseo; cambia el tono por audiencia. El desperdicio se comunica como oportunidad, no desde la culpa. Detalle completo en <code>marca/plataforma-de-marca.md</code>.</p>
<div class="cols"><div class="box ok"><b>Así sí</b><ul><li>"Medialunas del día, a mitad de precio y a la vuelta de tu casa."</li><li>"Sacale una foto a lo que te sobró. Nosotros armamos los packs."</li><li>"Huella de carbono asociada estimada."</li></ul></div><div class="box no"><b>Así no</b><ul><li>"¡Salvá el planeta comprando sobras!"</li><li>"Plataforma omnicanal de gestión de mermas con IA."</li><li>"Evitaste X kg de CO₂."</li></ul></div></div>
<p>Reglas: voseo siempre · CTA con verbo al principio y máx. 3 palabras · "pack" en minúscula · "APROVECHO" en mayúsculas · números en formato argentino (1.234,5 · 50%) · slogan: <b>"Menos desperdicio, más aprovecho"</b>.</p></section>

<section id="iconos"><h2>Iconografía</h2><p>Línea, trazo 2 px, puntas y uniones redondeadas, grilla de 24 px, color de herencia (verde bosque; corteza solo para el estado activo). Estilo Lucide/Phosphor; este set mínimo ya está dibujado en <code>componentes.html</code>.</p><div class="icons">{icons}</div><p><b>Indicador de plan:</b> 1, 2 o 3 marcas (Base, Smart, Intelligence), no un color por plan.</p></section>

<section id="fotos"><h2>Fotografía</h2>
<div class="cols"><div class="box ok"><b>Sí</b><ul><li>Real, cálida, de barrio: mostradores, bandejas, cajas kraft, manos de comerciantes.</li><li>Luz de atardecer (17–21 h, la franja clave).</li><li>Comida apetitosa y <b>del día</b>.</li><li>Personas reales y diversas: comerciantes de 40–55, consumidores de 20–35.</li></ul></div><div class="box no"><b>No</b><ul><li>Tachos de basura protagonistas ni comida en mal estado.</li><li>Planetas o manos sosteniendo el mundo.</li><li>Hojas verdes decorativas.</li><li>Poses de banco de imágenes.</li></ul></div></div>
<p><b>Dónde conseguirlas (gratis, D-023):</b> Unsplash o Pexels; buscar "panadería de barrio", "medialunas", "caja kraft", "mostrador de cafetería", "atardecer en la vereda". Revisar la licencia de cada foto. Si se generan con IA: pedir validación antes y cuidar manos, texto y logos falsos.</p>
<p><b>Tratamiento:</b> color natural, ligero tinte cálido, sin filtros fuertes. Sobre foto, el logo va en negativo dentro de una banda verde bosque o con overlay de 40% de ink.</p></section>

<section id="ilustracion"><h2>Ilustración</h2><p>Personajes-alimento simples (medialuna protagonista, porción de torta, empanada) para el humor B2C: stickers, estados vacíos, redes. Trazo y formas redondeadas coherentes con el isotipo; paleta limitada (bosque, corteza, crema). En B2B, diagramas limpios de la escalera <b>Recuperá → Medí → Anticipá</b>. <i>Pendiente: dibujar el set cuando arranquen landing y video.</i></p></section>

<section id="incorrectos"><h2>Usos incorrectos</h2><div class="bads">{badh}</div></section>

<section id="apps"><h2>Aplicaciones</h2><p>Sticker de vidriera, cartel de caja, bolsa y posteo de Instagram: <a href="../aplicaciones/index.html">ver mockups</a> (PNG en <code>aplicaciones/png/</code>). Piezas UI: <a href="../componentes.html">componentes base</a>. Tokens: <code>tokens.css</code> y <code>tokens.json</code>.</p></section>
</main></div></body></html>'''
open('guia/index.html','w',encoding='utf-8').write(html); print(len(html))
