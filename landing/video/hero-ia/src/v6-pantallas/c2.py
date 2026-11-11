from comp import *
S='/home/user/APROVECHO-online-/landing/video/hero-ia/src/'
quad=[(547,191),(733,178),(762,301),(577,326)]
for fr,scr,name in ((13,'/tmp/claude-0/ref/16-smart-estacion-tablet-vacia.png','c2_inicio'),(12,'/tmp/claude-0/out/tab17_miga.png','c2_fin')):
    b=Image.open(S+f'{fr}.jpg').convert('RGB').resize((1280,715),Image.LANCZOS); s=Image.open(scr)
    put(b,s,quad,radius=0.03,blur=0.8,bright=1.0).save(name+'.png')
