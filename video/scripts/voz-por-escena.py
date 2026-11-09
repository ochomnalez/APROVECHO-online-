import base64, json, re, subprocess, sys
VOZ='es-419-training-6'
E="Serious, calm and professional onboarding narrator. Clear Argentine Rioplatense Spanish, measured pace, no excitement, no advertising tone."
ESC={
 'e1':['Bienvenido a APROVECHO.','Te mostramos cómo empezar, paso a paso.'],
 'e2':['Entrás como comercio y elegís tu plan.','Cargás tu carta con una foto de tu lista de precios: la app lee los productos y los precios sola.','Y llegás a Hoy, tu pantalla principal.'],
 'e3':['Cuando sobra mercadería, sacás una foto.','La app reconoce cada producto y cuenta cuántos hay.','Arma los packs, el precio y el horario de retiro.','Vos revisás, confirmás que la comida es del día, la cadena de frío y los alérgenos, y publicás.','La decisión siempre es tuya.'],
 'e4':['El vecino ve tu pack en la app, reserva y paga.','Recibe un código QR para retirarlo.','Vos lo escaneás en el local y la venta queda registrada.','Cobrás cada venta, sin abono fijo.'],
 'e5':['En Impacto ves cuánto recuperaste y descargás tu informe en Excel o PDF.'],
 'e6':['Si querés medir con precisión, sumás la estación Smart: una balanza y una tablet con cámara.','La balanza pesa lo que sobra y la cámara lo reconoce.','Vos elegís si va a venta o a la basura, y registrás el motivo.'],
 'e9':['Menos desperdicio, más aprovecho.','Sumá tu comercio.'],
}
OUT='/tmp/claude-0/-home-user-APROVECHO-online-/7307efeb-ff1a-5892-b0ae-9ea3495aac20/scratchpad/vidwt/video/public/voz2/'
res={}
for k,fr in ESC.items():
    texto=' '.join(fr)
    body={"model":"gemini-3.8-flash-tts","input":[{"type":"user_input","content":[{"type":"text","text":texto,"annotations":[{"type":"speech_metadata","style":E}]}]}],"response_format":{"type":"audio"},"generation_config":{"speech_config":[{"voice":VOZ}]}}
    json.dump(body,open(f'{k}.req.json','w'))
    r=subprocess.run(['curl','-sS','-m','300','-X','POST','https://generativelanguage.googleapis.com/v1beta/interactions','-H','Content-Type: application/json','-d',f'@{k}.req.json','-o',f'{k}.resp.json','-w','%{http_code}'],capture_output=True,text=True)
    d=json.load(open(f'{k}.resp.json'))
    aud=[c for st in d['steps'] if st.get('type')=='model_output' for c in st.get('content',[]) if c.get('type')=='audio']
    open(f'{k}.wav','wb').write(base64.b64decode(aud[-1]['data']))
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',f'{k}.wav','-c:a','libmp3lame','-b:a','192k',OUT+f'{k}.mp3'])
    dur=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f'{k}.wav'],capture_output=True,text=True).stdout)
    sl=subprocess.run(['ffmpeg','-hide_banner','-i',f'{k}.wav','-af','silencedetect=noise=-35dB:d=0.16','-f','null','-'],capture_output=True,text=True).stderr
    st=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',sl)]; en=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',sl)]
    paus=list(zip(st,en+[dur]*(len(st)-len(en))))
    a0=en[0] if paus and paus[0][0]<0.05 and en else 0.0
    a1=paus[-1][0] if paus and paus[-1][1]>=dur-0.05 and paus[-1][0]>dur*0.5 else dur
    inner=[p for p in paus if p[0]>a0+0.2 and p[1]<a1-0.05]
    ch=[len(x) for x in fr]; tot=sum(ch); cum=0; bounds=[]; used=set()
    for j in range(len(fr)-1):
        cum+=ch[j]; exp=a0+(a1-a0)*cum/tot
        cand=[(abs((p[0]+p[1])/2-exp),i) for i,p in enumerate(inner) if i not in used and (not bounds or p[0]>bounds[-1][1])]
        if cand: _,i=min(cand); used.add(i); bounds.append(inner[i])
        else: bounds.append((exp-0.05,exp+0.05))
    segs=[]; ini=a0
    for j,t in enumerate(fr):
        fin=bounds[j][0] if j<len(bounds) else a1
        segs.append({'t':t,'a':round(ini,2),'b':round(fin,2)}); ini=bounds[j][1] if j<len(bounds) else a1
    res[k]={'dur':round(dur,2),'a0':round(a0,2),'a1':round(a1,2),'segs':segs}
    print(k,'HTTP',r.stdout,'dur',round(dur,2),'speech',round(a0,2),'-',round(a1,2),'pausas internas',len(inner),'frases',len(fr))
json.dump(res,open('/tmp/claude-0/-home-user-APROVECHO-online-/7307efeb-ff1a-5892-b0ae-9ea3495aac20/scratchpad/vidwt/video/src/voz-tiempos.json','w'),ensure_ascii=False,indent=1)
