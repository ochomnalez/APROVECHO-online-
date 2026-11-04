#!/usr/bin/env python3
"""Genera tokens.json y tokens.css y verifica contraste WCAG AA de los pares de uso."""
import json,sys
C={
 "forest":("#1A4D3A","Primario. Logo, títulos, fondos de marca, botón secundario"),
 "forest-dark":("#0F3326","Hover/pressed del primario; fondos muy oscuros"),
 "crust":("#E07A2E","Acento 'corteza'. Fondos de CTA, highlights, stickers, ilustración. NO para texto sobre claro"),
 "crust-strong":("#A9490B","Texto e íconos del acento sobre fondos claros (enlaces, etiqueta Estimado)"),
 "crust-soft":("#FBE3CC","Fondo suave del acento (resaltados, estado vacío)"),
 "cream":("#FBF3E4","Fondo claro base de landing y app (crema cálido)"),
 "mint":("#DFFFD6","Apoyo: fondos de tarjetas e info positiva (uso moderado)"),
 "surface":("#FFFFFF","Tarjetas e inputs sobre crema"),
 "text":("#333333","Texto corrido"),
 "ink":("#14281F","Texto sobre acento corteza y titulares sobre claro de máximo contraste"),
 "text-muted":("#5B6B62","Texto secundario"),
 "border":("#E4D9C3","Bordes y divisores sobre crema"),
 "success":("#2E7D32","Éxito"),
 "error":("#B3261E","Error"),
 "estimado":("#A9490B","Texto/borde punteado de la etiqueta Estimado"),
 "medido":("#1A4D3A","Fondo sólido de la etiqueta Medido"),
}
SEM={"primary":"forest","primary-hover":"forest-dark","accent":"crust","accent-text":"crust-strong","accent-soft":"crust-soft",
 "bg":"cream","bg-soft":"mint","surface":"surface","text":"text","text-strong":"ink","text-muted":"text-muted","border":"border",
 "success":"success","error":"error","estimado":"estimado","medido":"medido"}
PAIRS=[ # (texto, fondo, uso, mínimo)
 ("text","cream","Texto corrido sobre fondo",4.5),("forest","cream","Títulos y enlaces primarios",4.5),
 ("cream","forest","Texto sobre bloques verdes / botón primario",4.5),("ink","crust","Texto del botón de acento (CTA)",4.5),
 ("crust-strong","cream","Texto de acento sobre crema",4.5),("crust-strong","surface","Texto de acento sobre tarjeta",4.5),
 ("forest","mint","Texto sobre tarjeta menta",4.5),("text-muted","cream","Texto secundario",4.5),
 ("surface","medido","Etiqueta Medido",4.5),("estimado","crust-soft","Etiqueta Estimado",4.5),
 ("success","surface","Éxito sobre tarjeta",4.5),("error","surface","Error sobre tarjeta",4.5),
 ("crust","forest","Acento como gráfico sobre verde (≥3:1)",3.0),("forest","surface","Títulos sobre tarjeta",4.5)]
def L(h):
    h=h.lstrip('#');c=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    c=[x/12.92 if x<=.03928 else ((x+.055)/1.055)**2.4 for x in c];return .2126*c[0]+.7152*c[1]+.0722*c[2]
def cr(a,b):
    x,y=sorted((L(C[a][0]),L(C[b][0])),reverse=True);return round((x+.05)/(y+.05),2)
contrast=[]; bad=0
for t,b,u,m in PAIRS:
    r=cr(t,b); ok=r>=m; bad+=not ok
    contrast.append({"texto":t,"fondo":b,"uso":u,"ratio":r,"minimo":m,"cumple":ok})
if bad: print("FALLAN",[c for c in contrast if not c['cumple']]); sys.exit(1)
T={
 "font":{"display":"'Bricolage Grotesque', 'Outfit', system-ui, sans-serif","body":"'DM Sans', system-ui, -apple-system, sans-serif",
   "google-fonts-url":"https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap"},
 "size":{"xs":"0.75rem","sm":"0.875rem","base":"1rem","lg":"1.125rem","xl":"1.375rem","2xl":"1.75rem","3xl":"2.25rem","4xl":"3rem","5xl":"4rem","display-metric":"3.5rem"},
 "weight":{"regular":"400","medium":"500","semibold":"600","bold":"700","display":"800"},
 "line-height":{"tight":"1.1","snug":"1.25","normal":"1.5"},
 "space":{"1":"4px","2":"8px","3":"12px","4":"16px","5":"24px","6":"32px","7":"48px","8":"64px","9":"96px"},
 "radius":{"sm":"8px","md":"14px","lg":"22px","pill":"999px"},
 "shadow":{"sm":"0 1px 2px rgba(20,40,31,.08)","md":"0 6px 18px rgba(20,40,31,.10)","lg":"0 16px 40px rgba(20,40,31,.16)"},
}
json.dump({"color":{k:{"value":v[0],"uso":v[1]} for k,v in C.items()},"color-semantico":SEM,"contraste-aa":contrast,**T},
          open("tokens.json","w",encoding="utf-8"),ensure_ascii=False,indent=2)
css=["/* APROVECHO · design tokens v1 (identidad visual). Generado por herramientas/build_tokens.py — no editar a mano. */",
 "@import url('"+T['font']['google-fonts-url']+"');",":root{","  /* Paleta base */"]
for k,v in C.items(): css.append(f"  --palette-{k}: {v[0]};")
css.append("  /* Semánticos (usar estos en app y landing) */")
for k,v in SEM.items(): css.append(f"  --color-{k}: var(--palette-{v});")
css+=["  --color-on-primary: var(--palette-cream);","  --color-on-accent: var(--palette-ink);","  --color-focus: var(--palette-crust);","  /* Tipografía */",
 f"  --font-display: {T['font']['display']};",f"  --font-body: {T['font']['body']};"]
for g in ("size","weight","line-height","space","radius","shadow"):
    for k,v in T[g].items(): css.append(f"  --{g}-{k}: {v};")
css+=["}","","/* Base */","body{background:var(--color-bg);color:var(--color-text);font:var(--weight-regular) var(--size-base)/var(--line-height-normal) var(--font-body);-webkit-font-smoothing:antialiased}",
"h1,h2,h3,h4{font-family:var(--font-display);color:var(--color-primary);font-weight:var(--weight-display);line-height:var(--line-height-tight);letter-spacing:-0.01em}",
".num,.metric{font-variant-numeric:tabular-nums;font-feature-settings:'tnum'}",
":focus-visible{outline:3px solid var(--color-focus);outline-offset:2px}",""]
open("tokens.css","w",encoding="utf-8").write("\n".join(css)+"\n")
print("tokens OK; contrastes:",len(contrast),"todos AA")
