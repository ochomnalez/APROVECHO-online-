import qrcode
def qr_path(data,size=1):
    q=qrcode.QRCode(border=0,error_correction=qrcode.constants.ERROR_CORRECT_M); q.add_data(data); q.make(fit=True)
    m=q.get_matrix(); n=len(m); d=[]
    for y,row in enumerate(m):
        x=0
        while x<n:
            if row[x]:
                s=x
                while x<n and row[x]: x+=1
                d.append(f"M{s} {y}h{x-s}v1h-{x-s}z")
            else: x+=1
    return n,''.join(d)
if __name__=="__main__":
    n,d=qr_path("https://aprovecho.example/app"); print(n,len(d))
