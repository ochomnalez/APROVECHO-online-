import base64, json, subprocess, sys, time
nombre, voz, estilo, texto = sys.argv[1:5]
body={"model":"gemini-3.8-flash-tts",
 "input":[{"type":"user_input","content":[{"type":"text","text":texto,"annotations":[{"type":"speech_metadata","style":estilo}]}]}],
 "response_format":{"type":"audio"},
 "generation_config":{"speech_config":[{"voice":voz}]}}
json.dump(body,open(f'{nombre}.req.json','w'))
t=time.time()
r=subprocess.run(['curl','-sS','-m','300','-X','POST','https://generativelanguage.googleapis.com/v1beta/interactions','-H','Content-Type: application/json','-d',f'@{nombre}.req.json','-o',f'{nombre}.resp.json','-w','%{http_code}'],capture_output=True,text=True)
print(nombre,'HTTP',r.stdout,f'{time.time()-t:.0f}s')
d=json.load(open(f'{nombre}.resp.json'))
if 'steps' not in d: print(json.dumps(d)[:500]); sys.exit(1)
aud=[c for st in d['steps'] if st.get('type')=='model_output' for c in st.get('content',[]) if c.get('type')=='audio']
open(f'{nombre}.wav','wb').write(base64.b64decode(aud[-1]['data'])); print('mime',aud[-1].get('mime_type'), json.dumps(d.get('usage'))[:300])
