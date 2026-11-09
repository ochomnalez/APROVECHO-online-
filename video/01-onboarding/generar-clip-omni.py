import base64, json, re, subprocess, sys, time
nombre, fotos, dur, res, prompt = sys.argv[1], sys.argv[2].split(','), sys.argv[3], sys.argv[4], sys.argv[5]
inp=[{"type":"image","data":base64.b64encode(open(f,'rb').read()).decode(),"mime_type":"image/jpeg"} for f in fotos]
inp.append({"type":"text","text":prompt})
body={"model":"gemini-omni-1.2-flash","input":inp,"stream":True,"response_format":{"type":"video","resolution":res,"duration":dur,"delivery":"uri"}}
json.dump(body,open(f'{nombre}.req.json','w'))
t=time.time()
r=subprocess.run(['curl','-sS','-N','-m','600','-X','POST','https://generativelanguage.googleapis.com/v1beta/interactions','-H','Content-Type: application/json','-d',f'@{nombre}.req.json','-o',f'{nombre}.sse','-w','%{http_code}'],capture_output=True,text=True)
print(nombre,'HTTP',r.stdout,r.stderr[:200],f'{time.time()-t:.0f}s')
s=open(f'{nombre}.sse',encoding='utf-8',errors='ignore').read()
m=re.search(r'"uri":\s*"([^"]+)"',s); u=m.group(1) if m else None
usage=re.search(r'"total_output_tokens":\s*(\d+)',s)
if not u: print(s[:800]); sys.exit(1)
fid=re.search(r'files/([^:/]+)',u).group(1)
for i in range(12):
    st=json.loads(subprocess.run(['curl','-sS','-m','30',f'https://generativelanguage.googleapis.com/v1beta/files/{fid}'],capture_output=True,text=True).stdout).get('state')
    if st=='ACTIVE': break
    time.sleep(5)
r=subprocess.run(['curl','-sS','-m','300','-L',u,'-o',f'{nombre}.mp4','-w','%{http_code}'],capture_output=True,text=True)
tok=int(usage.group(1)) if usage else 0
print('descarga HTTP',r.stdout,'| tokens de video:',tok,'| costo aprox USD',round(tok*12/1e6,2))
