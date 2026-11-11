import numpy as np
from PIL import Image, ImageDraw, ImageFilter
def coeffs(dst, src):
    A=[];B=[]
    for (x,y),(u,v) in zip(dst,src):
        A.append([x,y,1,0,0,0,-u*x,-u*y]);B.append(u)
        A.append([0,0,0,x,y,1,-v*x,-v*y]);B.append(v)
    return np.linalg.solve(np.array(A,float),np.array(B,float)).tolist()
def put(base,screen,quad,radius=0.09,blur=0.9,keep=None,bright=0.97):
    W,H=base.size
    sw,sh=screen.size
    # supersample 2x
    S=2
    big=base.resize((W*S,H*S),Image.LANCZOS)
    q=[(x*S,y*S) for x,y in quad]
    c=coeffs(q,[(0,0),(sw,0),(sw,sh),(0,sh)])
    warped=screen.convert('RGB').transform(big.size,Image.PERSPECTIVE,c,Image.BICUBIC)
    mask=Image.new('L',(sw,sh),0)
    ImageDraw.Draw(mask).rounded_rectangle([0,0,sw-1,sh-1],radius=int(sw*radius),fill=255)
    m=mask.transform(big.size,Image.PERSPECTIVE,c,Image.BICUBIC)
    if keep is not None:  # polygon (original coords) donde se conserva el original (manos)
        k=Image.new('L',big.size,0);ImageDraw.Draw(k).polygon([(x*S,y*S) for x,y in keep],fill=255)
        k=k.filter(ImageFilter.GaussianBlur(3))
        m=Image.fromarray(np.minimum(np.array(m),255-np.array(k)))
    warped=warped.point(lambda v:int(v*bright)).filter(ImageFilter.GaussianBlur(blur*S/2))
    out=Image.composite(warped,big,m.filter(ImageFilter.GaussianBlur(S*0.6)))
    return out.resize((W,H),Image.LANCZOS)
