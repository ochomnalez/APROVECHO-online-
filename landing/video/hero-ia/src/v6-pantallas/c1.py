from comp import *
S='/home/user/APROVECHO-online-/landing/video/hero-ia/src/'
P='/home/user/APROVECHO-online-/landing/img/app/pantallas/'
quad=[(551,222),(684,237),(633,529),(494,498)]
thumb=[(618,508),(640,478),(690,470),(690,570),(606,570),(604,530)]
for fr,scr,name in ((8,'09-analizando','c1_inicio'),(9,'13-publicado','c1_fin')):
    b=Image.open(S+f'{fr}.jpg').convert('RGB'); s=Image.open(P+scr+'.webp')
    put(b,s,quad,keep=thumb).save(name+'.png')
