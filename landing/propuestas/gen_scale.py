import math
S=1.0
def P(x,y,z):
    return ((x-y)*math.cos(math.radians(30)), (x+y)*0.5 - z)
def poly(pts,fill,extra=''):
    return '<polygon points="%s" fill="%s" %s/>' % (' '.join('%.1f,%.1f'%p for p in pts),fill,extra)
def box(x,y,z,w,d,h,top,left,right,stroke='none'):
    t=[P(x,y,z+h),P(x+w,y,z+h),P(x+w,y+d,z+h),P(x,y+d,z+h)]
    l=[P(x,y+d,z+h),P(x+w,y+d,z+h),P(x+w,y+d,z),P(x,y+d,z)]   # front-left face (y=d)
    r=[P(x+w,y,z+h),P(x+w,y+d,z+h),P(x+w,y+d,z),P(x+w,y,z)]   # right face (x=w)
    return poly(l,left)+poly(r,right)+poly(t,top)
parts=[]
# base body
parts.append(box(0,0,0,300,210,34,'url(#gt)','url(#gl)','url(#gr)'))
# feet shadow handled outside
# tray / platform
parts.append(box(14,14,34,272,182,7,'url(#gp)','#aab3ae','#8f9994'))
# platform inner highlight
parts.append(poly([P(24,24,41),P(276,24,41),P(276,186,41),P(24,186,41)],'none','stroke="#fff" stroke-opacity=".5" stroke-width="1.5"'))
# display tower (back right)
parts.append(box(228,0,34,58,34,96,'#2b3a33','#1b2823','#0f1a15'))
# display screen on tower front-left face (y=34, x 228..286)
scr=[P(234,34.5,118),P(280,34.5,118),P(280,34.5,92),P(234,34.5,92)]
parts.append(poly(scr,'#0c1511'))
parts.append(poly([P(238,34.6,114),P(276,34.6,114),P(276,34.6,96),P(238,34.6,96)],'#9BE29B','opacity=".92"'))
# panel on base front face buttons
for i in range(4):
    parts.append(poly([P(40+i*26,210.5,24),P(58+i*26,210.5,24),P(58+i*26,210.5,12),P(40+i*26,210.5,12)],'#f4f7f5','opacity=".9"'))
xs=[P(0,0,0),P(300,0,0),P(300,210,0),P(0,210,0),P(228,0,130),P(0,0,0)]
minx=min(p[0] for p in xs)-20; maxx=max(p[0] for p in xs)+20
miny=min(p[1] for p in xs)-20; maxy=max(p[1] for p in xs)+20
svg='''<svg xmlns="http://www.w3.org/2000/svg" viewBox="%.0f %.0f %.0f %.0f">
<defs>
<linearGradient id="gt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3f6f4"/><stop offset="1" stop-color="#d5dcd8"/></linearGradient>
<linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9eeeb"/><stop offset="1" stop-color="#b9c2bd"/></linearGradient>
<linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfd7d3"/><stop offset="1" stop-color="#98a29d"/></linearGradient>
<linearGradient id="gp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef1ef"/><stop offset="1" stop-color="#bfc7c3"/></linearGradient>
</defs>%s</svg>''' % (minx,miny,maxx-minx,maxy-miny,''.join(parts))
open('img/balanza.svg','w').write(svg)
print(minx,miny,maxx-minx,maxy-miny)
