#!/usr/bin/env python3
"""Genera todos los SVG del logo de APROVECHO (texto convertido a curvas).
Uso: python3 build_logo.py <ruta/a/bricolage-grotesque-latin-800-normal.woff> <carpeta_salida>
Fuente: Bricolage Grotesque 800 (OFL, Google Fonts)."""
import math, sys, os
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

FOREST="#1A4D3A"; CRUST="#E07A2E"; CREAM="#FBF3E4"; MINT="#DFFFD6"; INK="#14281F"
font=TTFont(sys.argv[1]); OUT=sys.argv[2]; os.makedirs(OUT,exist_ok=True)
gs=font.getGlyphSet(); cmap=font.getBestCmap(); UPM=font['head'].unitsPerEm
hmtx=font['hmtx']
CAP=getattr(font['OS/2'],'sCapHeight',700) or 700

def glyph_path(ch,tr):
    name=cmap[ord(ch)]; pen=SVGPathPen(gs,ntos=lambda v:f"{v:.2f}".rstrip('0').rstrip('.'))
    gs[name].draw(TransformPen(pen,tr)); return pen.getCommands()
def adv(ch): return hmtx[cmap[ord(ch)]][0]

def text_width(txt,size,track=0):
    s=size/UPM; return sum(adv(c)*s for c in txt)+track*(len(txt)-1)

def flat_text(txt,x,y,size,track=0):
    """texto recto, baseline en y, empieza en x. devuelve d."""
    s=size/UPM; d=[]; cx=x
    for c in txt:
        if c!=' ': d.append(glyph_path(c,(s,0,0,-s,cx,y)))
        cx+=adv(c)*s+track
    return ' '.join(d)

def arc_text(txt,cx,cy,r,size,track=0,top=True):
    """texto sobre arco centrado. top=True: arriba, de izq a der, letras hacia afuera.
    top=False: abajo, de izq a der, letras hacia adentro (baseline en r, tope hacia el centro)."""
    s=size/UPM; w=text_width(txt,size,track); total=w/r  # rad
    d=[]; pos=0
    for c in txt:
        a=adv(c)*s
        if c!=' ':
            mid=pos+a/2; th=mid/r-total/2   # desvío respecto del centro (rad)
            if top:
                ang=-math.pi/2+th      # posición angular
                px=cx+r*math.cos(ang); py=cy+r*math.sin(ang); rot=th
            else:
                ang=math.pi/2-th
                px=cx+r*math.cos(ang); py=cy+r*math.sin(ang); rot=-th
            cr,sr=math.cos(rot),math.sin(rot)
            # glyph local: x' = (x - a/2)/UPM*size, y' = -y/UPM*size (arriba negativo)
            # transform: rotar y trasladar
            t=(s*cr, s*sr*-1*-1, 0,0,0,0)
            # matriz afín: [x,y] -> R*( (x*s - a/2), (-y*s) ) + P
            A=s*cr; B=s*sr; C=s*sr; D=-s*cr
            # x'=x*s-a/2 ; y'=-y*s ; X=cr*x'-sr*y'+px ; Y=sr*x'+cr*y'+py
            # X = cr*s*x + sr*s*y + (-cr*a/2+px) ; Y = sr*s*x - cr*s*y + (-sr*a/2+py)
            tr=(cr*s, sr*s, sr*s, -cr*s, px-cr*a/2, py-sr*a/2)
            # TransformPen espera (xx,xy,yx,yy,dx,dy) con X=xx*x+yx*y+dx ; Y=xy*x+yy*y+dy
            tr=(cr*s, sr*s, sr*s, -cr*s, px-cr*a/2, py-sr*a/2)
            d.append(glyph_path(c,tr))
        pos+=a+track
    return ' '.join(d)

def P(cx,cy,r,deg): 
    a=math.radians(deg); return cx+r*math.cos(a), cy+r*math.sin(a)
def f(v): return f"{v:.2f}".rstrip('0').rstrip('.')

def ring_arrows(cx=100,cy=100,r=80,sw=11,col=FOREST):
    out=[]
    for s,e in ((200,338),(20,158)):
        x0,y0=P(cx,cy,r,s); x1,y1=P(cx,cy,r,e)
        out.append(f'<path d="M{f(x0)} {f(y0)}A{r} {r} 0 0 1 {f(x1)} {f(y1)}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round"/>')
        # punta
        ex,ey=P(cx,cy,r,e); nx,ny=math.cos(math.radians(e)),math.sin(math.radians(e)); tx,ty=-ny,nx
        hw=13; L=18
        a=(ex+nx*hw,ey+ny*hw); b=(ex-nx*hw,ey-ny*hw); t=(ex+tx*L,ey+ty*L)
        out.append(f'<path d="M{f(a[0])} {f(a[1])}L{f(t[0])} {f(t[1])}L{f(b[0])} {f(b[1])}Z" fill="{col}" stroke="{col}" stroke-width="3" stroke-linejoin="round"/>')
    return ''.join(out)

def medialuna(cx=100,cy=126,R=38,col=CRUST,segs=5,hmax=24,hmin=4,span=(172,368),gap=7):
    """Medialuna: cuerpo en arco (cuernos hacia abajo) dividido en segmentos."""
    a0,a1=span
    # límites de segmentos más anchos al centro
    w=[0.8,1.15,1.5,1.15,0.8] if segs==5 else [1,1.5,1]
    tot=sum(w); b=[0]; 
    for x in w: b.append(b[-1]+x/tot)
    def h(t): return hmin+(hmax-hmin)*math.sin(math.pi*t)**0.75
    paths=[]
    for i in range(segs):
        t0=b[i]; t1=b[i+1]
        ga=(gap/2)/ (R*math.pi/180*(a1-a0)) 
        t0+= ga if i>0 else 0; t1-= ga if i<segs-1 else 0
        n=14; outer=[];inner=[]
        for k in range(n+1):
            t=t0+(t1-t0)*k/n; deg=a0+(a1-a0)*t; hh=h(t)
            outer.append(P(cx,cy,R+hh,deg)); inner.append(P(cx,cy,R-hh,deg))
        pts=outer+inner[::-1]
        d='M'+'L'.join(f"{f(x)} {f(y)}" for x,y in pts)+'Z'
        paths.append(f'<path d="{d}"/>')
    return f'<g fill="{col}" stroke="{col}" stroke-width="3.2" stroke-linejoin="round">'+''.join(paths)+'</g>'

def isotipo(ring=FOREST,moon=CRUST):
    return ring_arrows(col=ring)+medialuna(col=moon)

def svg(vb,body,title,w=None,h=None,extra=''):
    wh=f' width="{w}" height="{h}"' if w else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}"{wh} role="img" aria-label="{title}"{extra}>'
            f'<title>{title}</title>{body}</svg>\n')

def wr(name,s):
    open(os.path.join(OUT,name),'w',encoding='utf-8').write(s)

# ---------- variantes de color ----------
V={ 'color':dict(ring=FOREST,moon=CRUST,ink=FOREST,bg=None),
    'mono':dict(ring=FOREST,moon=FOREST,ink=FOREST,bg=None),
    'negativo':dict(ring=CREAM,moon=CRUST,ink=CREAM,bg=None),
    'mono-negativo':dict(ring=CREAM,moon=CREAM,ink=CREAM,bg=None)}

# 1) isotipo (viewBox ajustado a 200x200 con margen 8)
for k,v in V.items():
    wr(f'logo-isotipo-{k}.svg',svg('8 8 184 184',isotipo(v['ring'],v['moon']),'APROVECHO isotipo'))

# 2) wordmark solo
WM='APROVECHO'; SZ=100; TR=3
ww=text_width(WM,SZ,TR); cap=CAP/UPM*SZ
for k,v in V.items():
    d=flat_text(WM,0,cap,SZ,TR)
    wr(f'logo-wordmark-{k}.svg',svg(f'-2 -4 {f(ww+4)} {f(cap+8)}',f'<path d="{d}" fill="{v["ink"]}"/>','APROVECHO'))

# 3) horizontal: isotipo + wordmark
H=184; gapx=34; s_iso=1.0
for k,v in V.items():
    iso=f'<g transform="translate(-8 -8)">{isotipo(v["ring"],v["moon"])}</g>'
    tsz=96; tw=text_width(WM,tsz,3); capH=CAP/UPM*tsz
    ty=H/2+capH/2
    d=flat_text(WM,H+gapx,ty,tsz,3)
    W=H+gapx+tw
    wr(f'logo-horizontal-{k}.svg',svg(f'-4 -4 {f(W+8)} {H+8}',iso+f'<path d="{d}" fill="{v["ink"]}"/>','APROVECHO'))

# 4) badge completo (240x240)
SLOGAN='MENOS DESPERDICIO, MÁS APROVECHO'
def badge(kind):
    cx=cy=120
    if kind=='color':
        parts=[f'<circle cx="120" cy="120" r="118" fill="{FOREST}"/>',
               f'<circle cx="120" cy="120" r="111" fill="none" stroke="{CRUST}" stroke-width="1.6"/>',
               f'<circle cx="120" cy="120" r="56" fill="{CREAM}"/>']
        inkc=CREAM; ring=FOREST; moon=CRUST; dot=CRUST
    elif kind=='negativo':   # sobre fondo oscuro/foto: sin disco relleno
        parts=[f'<circle cx="120" cy="120" r="118" fill="none" stroke="{CREAM}" stroke-width="3"/>',
               f'<circle cx="120" cy="120" r="56" fill="none" stroke="{CREAM}" stroke-width="1.6"/>']
        inkc=CREAM; ring=CREAM; moon=CRUST; dot=CRUST
    elif kind=='mono':
        parts=[f'<circle cx="120" cy="120" r="118" fill="none" stroke="{FOREST}" stroke-width="3"/>',
               f'<circle cx="120" cy="120" r="56" fill="none" stroke="{FOREST}" stroke-width="1.6"/>']
        inkc=FOREST; ring=FOREST; moon=FOREST; dot=FOREST
    else:
        parts=[f'<circle cx="120" cy="120" r="118" fill="none" stroke="{CREAM}" stroke-width="3"/>',
               f'<circle cx="120" cy="120" r="56" fill="none" stroke="{CREAM}" stroke-width="1.6"/>']
        inkc=CREAM; ring=CREAM; moon=CREAM; dot=CREAM
    iso=f'<g transform="translate({120-100*0.5} {120-100*0.5}) scale(0.5)">{isotipo(ring,moon)}</g>'
    top=arc_text('APROVECHO',cx,cy,70,21,1.2,top=True)
    bot=arc_text(SLOGAN,cx,cy,87.5,9.4,0.9,top=False)
    # puntos separadores a 9 y 3 hs
    dots=f'<circle cx="{120-80.5}" cy="120" r="3" fill="{dot}"/><circle cx="{120+80.5}" cy="120" r="3" fill="{dot}"/>'
    return svg('0 0 240 240',''.join(parts)+iso+f'<path d="{top}" fill="{inkc}"/><path d="{bot}" fill="{inkc}"/>'+dots,'APROVECHO badge')
for k in ('color','negativo','mono','mono-negativo'):
    wr(f'logo-badge-{k}.svg',badge(k))

# 5) ícono de app 1024 (full-bleed, el SO aplica la máscara) y variante corteza
def appicon(bg,ring,moon,name):
    body=(f'<rect width="1024" height="1024" fill="{bg}"/>'
          f'<g transform="translate({512-100*4.1} {512-100*4.1}) scale(4.1)">{isotipo(ring,moon)}</g>')
    wr(name,svg('0 0 1024 1024',body,'APROVECHO ícono de app',1024,1024))
appicon(FOREST,CREAM,CRUST,'app-icon-1024.svg')
appicon(CRUST,FOREST,CREAM,'app-icon-corteza-1024.svg')

# 6) favicon: isotipo simplificado (3 segmentos, sin flechas finas) sobre círculo/cuadrado redondeado
fav=(f'<rect width="64" height="64" rx="14" fill="{FOREST}"/>'
     f'<g transform="translate(32 33) scale(0.27) translate(-100 -100)">'
     f'{ring_arrows(sw=17,col=CREAM)}{medialuna(R=38,segs=3,hmax=26,hmin=9,gap=9,col=CRUST)}</g>')
wr('favicon.svg',svg('0 0 64 64',fav,'APROVECHO favicon'))

# 7) og:image 1200x630 (fondo crema, lockup horizontal + slogan)
iso=f'<g transform="translate(120 205) scale(1.2) translate(-8 -8)">{isotipo(FOREST,CRUST)}</g>'
tsz=118; tw=text_width(WM,tsz,3); capH=CAP/UPM*tsz
d=flat_text(WM,390,205+110+capH/2-10,tsz,3)
sl=flat_text('Menos desperdicio, más aprovecho',392,470,40,0.4)
og=(f'<rect width="1200" height="630" fill="{CREAM}"/>'
    f'<rect x="0" y="590" width="1200" height="40" fill="{FOREST}"/><rect x="0" y="582" width="1200" height="8" fill="{CRUST}"/>'
    +iso+f'<path d="{d}" fill="{FOREST}"/><path d="{sl}" fill="{CRUST}" transform="translate(0 0)"/>')
wr('og-image.svg',svg('0 0 1200 630',og,'APROVECHO',1200,630))
print('ok',len(os.listdir(OUT)),'archivos')
