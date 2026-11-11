// Preparación reproducible de fotografías reales para servirlas desde la propia app.
const fs=require('node:fs/promises'),path=require('node:path'),sharp=require('sharp');
(async()=>{
 const root=process.env.ASSET_ROOT||'.';
 const photos=JSON.parse(await fs.readFile(path.join(root,'img/fuentes-medios.json'),'utf8'));
 for(const p of photos){
  const response=await fetch(p.url,{headers:{'User-Agent':'APROVECHO-demo/1.0 (https://aprovecho-app-demo.vercel.app)'},signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw Error(`${p.id}: HTTP ${response.status}`);
  const buffer=Buffer.from(await response.arrayBuffer());
  const image=sharp(buffer).rotate().resize(960,720,{fit:'cover',position:'attention'});
  let output=await image.webp({quality:79,effort:5}).toBuffer();
  if(output.length>150000)output=await sharp(buffer).rotate().resize(800,600,{fit:'cover',position:'attention'}).webp({quality:68,effort:5}).toBuffer();
  if(output.length>150000)throw Error(p.id+': imagen excede 150 KB');
  const dest=path.join(root,p.output);await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,output);
  console.log('FOTO_REAL_OK',p.id,output.length);
 }
 console.log('MEDIOS_OK',photos.length,'fotografías reales preparadas');
})().catch(e=>{console.error(e.message);process.exit(1)});
