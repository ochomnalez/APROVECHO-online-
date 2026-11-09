// Onboarding v2 · recorrido de la app (guion: video/01-onboarding/guion-v2-recorrido.md)
// 1920×1080 · 30 fps. Pantallas reales del prototipo (capturadas sin el texto de comisión, D-031),
// tomas con personas generadas con Gemini Omni, SELLO OFICIAL como único logo y sin naranja.
// Intelligence queda pendiente (ver INTELLIGENCE_PENDIENTE).
import React from 'react';
import {
  AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, continueRender, delayRender,
  interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { TransitionSeries, springTiming } from '@remotion/transitions';
import VT from './voz-tiempos.json';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';

// Paleta del sello oficial y de la app: verdes y crema. Sin naranja.
const BOSQUE = '#0F3326';
const VERDE = '#1A4D3A';
const VIVO = '#2F7D4A';
const PAPEL = '#FBF3E4';
const MENTA = '#DFFFD6';
const TINTA = '#14281F';
const LINEA = '#D9CBB4';
const TITULO = '"Bricolage Grotesque", Georgia, serif';
const CUERPO = '"Atkinson Hyperlegible", "Trebuchet MS", sans-serif';
export const FPS = 30;
const SELLO = 'onboarding/logo-sello.png'; // docs/marca/logo-oficial/aprovecho-logo-sello.png
const T = 12; // frames de cada transición

const fuentes = [
  ['Bricolage Grotesque', 800, 'fuentes/bricolage-800.woff2'],
  ['Bricolage Grotesque', 700, 'fuentes/bricolage-700.woff2'],
  ['Atkinson Hyperlegible', 400, 'fuentes/atkinson-400.woff2'],
  ['Atkinson Hyperlegible', 700, 'fuentes/atkinson-700.woff2'],
];
if (typeof document !== 'undefined') {
  const h = delayRender('fuentes2');
  Promise.all(fuentes.map(([f, w, src]) => new FontFace(f, `url(${staticFile(src)})`, { weight: String(w) })
    .load().then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h));
}

const s = (seg) => Math.round(seg * FPS);
const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };
const ease = (f, a, b) => interpolate(f, [a, b], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
const suave = (f, a, b) => interpolate(f, [a, b], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
const useSp = (desde = 0, cfg = { damping: 16, mass: 0.7 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return spring({ frame: f - desde, fps, config: cfg });
};
const a = (x) => staticFile(`app2/${x}.jpg`);

// ---------- Subtítulos grandes, palabra por palabra ----------
// Segmentos {t: texto, a: segundo de inicio, b: segundo de fin} (de la voz). Se muestra uno por vez;
// la palabra que se está diciendo "se prende". Los tiempos salen de VOZ_TIEMPOS cuando hay voz real.
const PALABRAS_X_SEG = 2.55;
function segmentar(frases, inicio = 0.4, hueco = 0.28) {
  let t = inicio;
  return frases.map((txt) => {
    const n = txt.split(' ').length; const dur = n / PALABRAS_X_SEG;
    const seg = { t: txt, a: t, b: t + dur }; t += dur + hueco; return seg;
  });
}
function Subs({ segs }) {
  const f = useCurrentFrame(); const t = f / FPS;
  const act = segs.find((x) => t >= x.a - 0.15 && t <= x.b + 0.35);
  if (!act) return null;
  const palabras = act.t.split(' ');
  const total = palabras.reduce((n, w) => n + w.length + 1, 0);
  const pr = Math.max(0, Math.min(1, (t - act.a) / Math.max(0.1, act.b - act.a)));
  const quedan = Math.min(1, ease(t, act.a - 0.15, act.a + 0.1) * (1 - ease(t, act.b + 0.1, act.b + 0.35)));
  let acum = 0;
  return (
    <>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 215, background: 'linear-gradient(0deg, rgba(10,36,26,.88) 0%, rgba(10,36,26,.55) 55%, rgba(10,36,26,0) 100%)', opacity: quedan }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 46, display: 'flex', justifyContent: 'center', opacity: quedan, transform: `translateY(${(1 - quedan) * 14}px)` }}>
        <div style={{ maxWidth: 1380, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 14, rowGap: 6, fontFamily: CUERPO, fontWeight: 700, fontSize: 50, lineHeight: 1.18, textAlign: 'center' }}>
          {palabras.map((w, i) => {
            const ini = acum / total; acum += w.length + 1; const fin = acum / total;
            const dicha = pr >= fin - 0.001; const actual = pr >= ini && pr < fin;
            return (
              <span key={i} style={{
                color: actual ? BOSQUE : '#fff', opacity: dicha || actual ? 1 : 0.42,
                background: actual ? MENTA : 'transparent', borderRadius: 10, padding: '0 10px',
                transform: actual ? 'translateY(-3px) scale(1.04)' : 'none', display: 'inline-block',
                textShadow: actual ? 'none' : '0 2px 14px rgba(0,0,0,.45)',
              }}>{w}</span>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ---------- Motion graphics base ----------
function Fondo({ oscuro = false, k = 0 }) {
  const f = useCurrentFrame(); const t = f / FPS + k * 7;
  const c1 = oscuro ? 'rgba(223,255,214,.06)' : 'rgba(26,77,58,.055)';
  return (
    <AbsoluteFill style={{ background: oscuro ? BOSQUE : PAPEL, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 980, height: 980, borderRadius: '50%', background: c1, left: 1100 + Math.sin(t * 0.3) * 60, top: -300 + Math.cos(t * 0.27) * 40 }} />
      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
        <circle cx={-60 + Math.sin(t * 0.2) * 30} cy={1010} r={360} fill="none" stroke={c1} strokeWidth="90" />
        <circle cx={1560 + Math.cos(t * 0.22) * 40} cy={900 + Math.sin(t * 0.25) * 30} r={250} fill="none" stroke={c1} strokeWidth="3" strokeDasharray="6 16" transform={`rotate(${t * 7} 1560 900)`} />
      </svg>
    </AbsoluteFill>
  );
}

function Cinetico({ texto, desde = 0, tam = 84, color = BOSQUE, paso = 3 }) {
  const f = useCurrentFrame();
  return (
    <h1 style={{ fontFamily: TITULO, fontWeight: 800, fontSize: tam, lineHeight: 1.04, letterSpacing: -1.5, margin: 0, color, display: 'flex', flexWrap: 'wrap', columnGap: tam * 0.24 }}>
      {texto.split(' ').map((p, i) => {
        const v = ease(f, desde + i * paso, desde + i * paso + 14);
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: tam * 0.08 }}>
            <span style={{ display: 'inline-block', transform: `translateY(${(1 - v) * 105}%) rotate(${(1 - v) * 4}deg)` }}>{p}</span>
          </span>
        );
      })}
    </h1>
  );
}

// Rótulo de capítulo: número en círculo verde + nombre
function Capitulo({ n, texto, claro = false }) {
  const f = useCurrentFrame(); const v = ease(f, 0, 14);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 26, opacity: v, transform: `translateX(${(1 - v) * -24}px)` }}>
      <span style={{ width: 54, height: 54, borderRadius: 27, background: claro ? MENTA : VERDE, color: claro ? BOSQUE : PAPEL, display: 'grid', placeItems: 'center', fontFamily: TITULO, fontWeight: 800, fontSize: 28 }}>{n}</span>
      <span style={{ fontFamily: CUERPO, fontWeight: 700, fontSize: 26, letterSpacing: 2.6, textTransform: 'uppercase', color: claro ? MENTA : VERDE }}>{texto}</span>
    </div>
  );
}

// Lista de "qué hacés": cada ítem aparece en su segundo
function Lista({ items, ancho = 760 }) {
  const f = useCurrentFrame();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: ancho, marginTop: 40 }}>
      {items.map(([txt, sec], i) => {
        const v = ease(f, s(sec), s(sec) + 14);
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: v, transform: `translateX(${(1 - v) * -34}px)`, fontFamily: CUERPO, fontSize: 31, color: TINTA }}>
            <svg width="34" height="34" viewBox="0 0 26 26" style={{ flex: 'none' }}>
              <circle cx="13" cy="13" r="12" fill={VERDE} />
              <path d="M7.5 13.5l3.6 3.4 7.4-8" stroke={PAPEL} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="20" strokeDashoffset={20 * (1 - ease(f, s(sec) + 4, s(sec) + 16))} />
            </svg>
            {txt}
          </div>
        );
      })}
    </div>
  );
}

function Toque({ x, y, en }) {
  const f = useCurrentFrame();
  const v = interpolate(f, [en, en + 18], [0, 1], CL);
  if (f < en - 6 || f > en + 20) return null;
  const pre = ease(f, en - 6, en);
  return (
    <div style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 5 }}>
      <div style={{ position: 'absolute', width: 120, height: 120, left: -60, top: -60, borderRadius: '50%', border: `4px solid ${VERDE}`, transform: `scale(${0.3 + v * 1.1})`, opacity: 1 - v }} />
      <div style={{ position: 'absolute', width: 44, height: 44, left: -22, top: -22, borderRadius: '50%', background: 'rgba(26,77,58,.45)', transform: `scale(${pre * (1 - v * 0.6)})`, opacity: 1 - v * 0.8 }} />
    </div>
  );
}

// Pantallas que se empujan como navegación real. tomas: [{src, desde (s), toque:{x,y,en(s)}}]
function Pantallas({ tomas, ancho, alto, radio }) {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: radio, overflow: 'hidden', background: PAPEL }}>
      {tomas.map((tm, i) => {
        const d = s(tm.desde || 0); const sig = tomas[i + 1] ? s(tomas[i + 1].desde) : 1e9;
        if (f < d - 1 || f > sig + 16) return null;
        const entra = i === 0 ? 1 : suave(f, d, d + 12); const sale = suave(f, sig, sig + 12);
        return (
          <div key={i} style={{ position: 'absolute', inset: 0, transform: `translateX(${(1 - entra) * 100 - sale * 30}%)`, boxShadow: i > 0 ? '-20px 0 40px rgba(0,0,0,.12)' : 'none', background: PAPEL }}>
            <Img src={a(tm.src)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 0%' }} />
            {tm.toque && <Toque x={tm.toque.x} y={tm.toque.y} en={s(tm.toque.en) - d} />}
          </div>
        );
      })}
    </div>
  );
}

function Celular({ tomas, x = 1240, y = 36, desde = 0, giro = -8, W = 390, H = 830 }) {
  const f = useCurrentFrame(); const e = useSp(desde, { damping: 15, mass: 0.9 }); const t = f / FPS;
  const R = 50, B = 13; const flota = Math.sin(t * 1.3) * 8;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: W, height: H, perspective: 1600 }}>
      <div style={{ width: '100%', height: '100%', borderRadius: R, background: TINTA, padding: B, boxShadow: `0 ${46 + flota}px 80px rgba(15,51,38,.28), 0 10px 20px rgba(15,51,38,.18)`, transform: `translateY(${(1 - e) * 200 + flota}px) rotateY(${giro * (1 - e) + Math.sin(t * 0.7) * 2.5}deg) rotateZ(${(1 - e) * 5}deg)`, opacity: Math.min(1, e * 2) }}>
        <Pantallas tomas={tomas} radio={R - B} />
      </div>
    </div>
  );
}

function Tableta({ tomas, x = 860, y = 250, W = 960, desde = 0 }) {
  const f = useCurrentFrame(); const e = useSp(desde, { damping: 16, mass: 0.9 }); const t = f / FPS;
  const H = Math.round((W - 36) * 600 / 1024) + 36; const flota = Math.sin(t * 1.1) * 6;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: W, height: H, perspective: 1800, opacity: Math.min(1, e * 2) }}>
      <div style={{ width: '100%', height: '100%', borderRadius: 34, background: TINTA, padding: 18, boxShadow: '0 40px 80px rgba(15,51,38,.26)', transform: `translate(${(1 - e) * 140}px, ${flota}px) rotateY(${-5 * (1 - e) - 3}deg)` }}>
        <Pantallas tomas={tomas} radio={18} />
      </div>
    </div>
  );
}

// Clip de video con marco (toma con personas)
function Tarjeta({ src, x, y, w, h, desde = 0, hasta, desdeVideo = 0, cortes, children }) {
  const f = useCurrentFrame();
  const e = useSp(desde, { damping: 16, mass: 0.8 });
  const sal = hasta ? ease(f, s(hasta), s(hasta) + 12) : 0;
  const v = Math.min(1, e * 2) * (1 - sal);
  if (f < s(desde) - 2 || v <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 22, overflow: 'hidden', background: TINTA, boxShadow: '0 40px 80px rgba(15,51,38,.28)', opacity: v, transform: `translateY(${(1 - e) * 60 + sal * -30}px) scale(${0.94 + 0.06 * e - sal * 0.04})` }}>
      {cortes
        ? cortes.map(([c0, c1, vs], i) => (
          <Sequence key={i} from={s(c0)} durationInFrames={s(c1 - c0) + 1}>
            <OffthreadVideo src={staticFile(`tomas/${src}`)} startFrom={s(vs)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Sequence>))
        : <Sequence from={s(desde)}><OffthreadVideo src={staticFile(`tomas/${src}`)} startFrom={s(desdeVideo)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></Sequence>}
      {children}
    </div>
  );
}

// ---------- Escenas (todo se sincroniza con la voz real: src/voz-tiempos.json) ----------
const OFF = 0.45; // la voz entra 0.45 s después de que empieza cada escena
const segsDe = (k) => VT[k].segs.map((x) => ({ t: x.t, a: x.a + OFF, b: x.b + OFF }));
const durDe = (k, min = 0) => Math.max(min, VT[k].dur + OFF + 0.9);
const Voz = ({ k }) => <Sequence from={s(OFF)}><Audio src={staticFile(`voz2/${k}.mp3`)} /></Sequence>;

function E1() {
  const f = useCurrentFrame(); const sg = segsDe('e1');
  const z = interpolate(f, [0, s(6.7)], [1.14, 1.02], { ...CL, easing: Easing.out(Easing.quad) });
  const m = suave(f, 0, 18); const lg = useSp(8, { damping: 13 });
  return (
    <AbsoluteFill style={{ background: BOSQUE, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, clipPath: `inset(${(1 - m) * 50}% 0 ${(1 - m) * 50}% 0)` }}>
        <OffthreadVideo src={staticFile('tomas/H-apertura.mp4')} playbackRate={0.75} muted style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})` }} />
        <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(15,51,38,.93) 0%, rgba(15,51,38,.7) 38%, rgba(15,51,38,0) 72%)', opacity: ease(f, 8, 28) }} />
      </div>
      <div style={{ position: 'absolute', left: 140, top: 190, width: 880 }}>
        <Img src={staticFile(SELLO)} style={{ width: 190, height: 190, transform: `scale(${0.7 + lg * 0.3}) rotate(${(1 - lg) * -18}deg)`, opacity: Math.min(1, lg * 2), marginBottom: 30 }} />
        <Cinetico texto="Tu guía para empezar." desde={18} tam={104} color={PAPEL} />
      </div>
      <Voz k="e1" /><Subs segs={sg} />
    </AbsoluteFill>
  );
}

function E2() {
  const sg = segsDe('e2'); const at = (i, o = 0) => sg[i].a + o;
  return (
    <AbsoluteFill>
      <Fondo k={1} />
      <div style={{ position: 'absolute', left: 140, top: 150, width: 900 }}>
        <Capitulo n="1" texto="Primeros pasos" />
        <Cinetico texto="Armá tu comercio en minutos." tam={86} desde={6} />
        <Lista items={[['Entrás como comercio', at(0)], ['Elegís tu plan', at(0, 1.4)], ['Cargás tu carta con una foto', at(1)], ['Llegás a Hoy, tu pantalla principal', at(2)]]} />
      </div>
      <Celular tomas={[
        { src: '01-bienvenida', desde: 0, toque: { x: 50, y: 75, en: at(0, 0.8) } },
        { src: '02-plan', desde: at(0, 1.5), toque: { x: 50, y: 92, en: at(0, 2.3) } },
        { src: '04-carta', desde: at(1, -0.3), toque: { x: 50, y: 66, en: at(1, 1.2) } },
        { src: '05-carta-cargada', desde: at(1, 2.6) },
        { src: '07-hoy', desde: at(2, -0.2) },
      ]} />
      <Voz k="e2" /><Subs segs={sg} />
    </AbsoluteFill>
  );
}

function ColumnaE3({ at0 }) {
  return (
    <div style={{ position: 'absolute', left: 140, top: 150, width: 900 }}>
      <Capitulo n="2" texto="Base · publicar con una foto" />
      <Cinetico texto="Una foto y la app arma tus packs." tam={78} desde={6} />
      <Lista items={[['Reconoce cada producto y cuenta cuántos hay', 0.4], ['Arma packs, precio y horario de retiro', at0[0]], ['Vos confirmás: día, frío y alérgenos', at0[1]]]} ancho={900} />
    </div>
  );
}
function E3() {
  const sg = segsDe('e3'); const at = (i, o = 0) => sg[i].a + o;
  const tI = 6.0; const tD = at(3, 3.4);
  return (
    <AbsoluteFill>
      <Fondo k={2} />
      <Sequence from={s(tI)} durationInFrames={s(tD - tI)}><ColumnaE3 at0={[at(2) - tI, at(3) - tI]} /></Sequence>
      <Tarjeta src="F-apertura.mp4" x={90} y={110} w={1040} h={585} desde={0.2} hasta={tI} />
      <Tarjeta src="D-base.mp4" x={90} y={110} w={1040} h={585} desde={tD} hasta={tD + 5.4} />
      <Celular tomas={[
        { src: '08-camara', desde: 0, toque: { x: 50, y: 22, en: at(0, 1.7) } },
        { src: '09-analizando', desde: at(1, 0) },
        { src: '11-tras-analisis', desde: at(1, 2.0) },
        { src: '12-revisar-checklist', desde: at(2, 0), toque: { x: 50, y: 93, en: tD + 1.2 } },
        { src: '13-publicado', desde: tD + 2.8 },
      ]} />
      <Voz k="e3" /><Subs segs={sg} />
    </AbsoluteFill>
  );
}

function E4() {
  const sg = segsDe('e4'); const at = (i, o = 0) => sg[i].a + o;
  return (
    <AbsoluteFill>
      <Fondo k={3} />
      <div style={{ position: 'absolute', left: 720, top: 150, width: 1000 }}>
        <Capitulo n="3" texto="Base · vender y cobrar" />
        <Cinetico texto="Reserva, QR y retiro." tam={92} desde={6} />
        <Lista items={[['El vecino ve tu pack, reserva y paga', at(0)], ['Recibe un código QR', at(1)], ['Vos lo escaneás en el local', at(2)], ['La venta queda registrada: cobrás sin abono fijo', at(3)]]} ancho={1000} />
      </div>
      <Celular x={170} giro={8} tomas={[
        { src: '14-cliente-ve-pack', desde: 0, toque: { x: 62, y: 96, en: at(0, 2.4) } },
        { src: '16-reserva-qr', desde: at(1, -0.2) },
        { src: '17-retiros', desde: at(2, -0.2), toque: { x: 50, y: 6.5, en: at(2, 0.9) } },
        { src: '18-retiro-validado', desde: at(2, 1.6), toque: { x: 50, y: 80, en: at(2, 2.4) } },
        { src: '19-hoy-final', desde: at(3, 0) },
      ]} />
      <Voz k="e4" /><Subs segs={sg} />
    </AbsoluteFill>
  );
}

function E5() {
  const sg = segsDe('e5'); const at = (i, o = 0) => sg[i].a + o;
  return (
    <AbsoluteFill>
      <Fondo k={4} />
      <div style={{ position: 'absolute', left: 140, top: 150, width: 900 }}>
        <Capitulo n="4" texto="Base · tus números" />
        <Cinetico texto="Mirá lo que recuperás." tam={92} desde={6} />
        <Lista items={[['Plata y kilos recuperados', at(0)], ['Lo medido y lo estimado, separados', at(0, 1.4)], ['Informe en Excel o PDF', at(0, 3.0)]]} />
      </div>
      <Celular tomas={[
        { src: '20-impacto', desde: 0, toque: { x: 87, y: 3.8, en: at(0, 2.6) } },
        { src: '21-reporte', desde: at(0, 3.1), toque: { x: 50, y: 71, en: at(0, 4.1) } },
        { src: '24-reporte-listo', desde: at(0, 4.8) },
      ]} />
      <Voz k="e5" /><Subs segs={sg} />
    </AbsoluteFill>
  );
}

function E6() {
  const sg = segsDe('e6'); const at = (i, o = 0) => sg[i].a + o;
  const tC = Math.min(6.4, at(0, 5.8));
  return (
    <AbsoluteFill>
      <Fondo k={5} />
      <div style={{ position: 'absolute', left: 140, top: 100, width: 800 }}>
        <Capitulo n="5" texto="Smart · la estación" />
        <Cinetico texto="Medí con balanza y cámara." tam={78} desde={6} />
        <Lista items={[['Balanza + tablet con cámara', tC + 0.2], ['Peso real, no estimado', at(1, 1.6)], ['¿Venta o basura? Con motivo', at(2)]]} ancho={780} />
      </div>
      <Tarjeta src="G-smart.mp4" x={110} y={410} w={760} h={428} desde={0.2} hasta={tC} cortes={[[0, 1.9, 0], [1.9, 6.5, 3.6]]} />
      <Tableta x={930} y={170} W={900} tomas={[
        { src: 't-02-estacion-vacia', desde: 0 },
        { src: 't-03-pesando', desde: at(1, 0) },
        { src: 't-04-pesado', desde: at(1, 1.5) },
        { src: 't-06-basura-motivo', desde: at(2, 0.6) },
        { src: 't-07-basura-motivo-elegido', desde: at(2, 2.4) },
        { src: 't-08-registro', desde: at(2, 3.5) },
      ]} />
      <Voz k="e6" /><Subs segs={sg} />
    </AbsoluteFill>
  );
}

// INTELLIGENCE_PENDIENTE: acá va el capítulo 6 (varias sucursales) cuando Octavio lo defina.

function E9() {
  const f = useCurrentFrame(); const sc = useSp(4, { damping: 12 }); const sg = segsDe('e9');
  return (
    <AbsoluteFill>
      <Fondo oscuro k={8} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Img src={staticFile(SELLO)} style={{ width: 360, height: 360, transform: `scale(${0.7 + sc * 0.3}) rotate(${(1 - sc) * -20}deg)`, opacity: Math.min(1, sc * 2) }} />
        <div style={{ marginTop: 36 }}><Cinetico texto="Menos desperdicio, más aprovecho." tam={72} color={PAPEL} desde={12} /></div>
        <div style={{ marginTop: 34, padding: '20px 46px', borderRadius: 999, background: MENTA, color: BOSQUE, fontFamily: CUERPO, fontWeight: 700, fontSize: 36, opacity: ease(f, 36, 50) }}>Sumá tu comercio</div>
        <div style={{ position: 'absolute', bottom: 24, fontFamily: CUERPO, fontSize: 15, color: 'rgba(251,243,228,.5)' }}>Música: “Inspired”, Kevin MacLeod (incompetech.com) · CC BY 4.0</div>
      </AbsoluteFill>
      <Voz k="e9" /><Subs segs={sg} />
    </AbsoluteFill>
  );
}

const ESCENAS = [[E1, durDe('e1', 6.7)], [E2, durDe('e2')], [E3, durDe('e3')], [E4, durDe('e4')], [E5, durDe('e5')], [E6, durDe('e6')], [E9, durDe('e9', 5.5)]];
const TRANS = [() => wipe({ direction: 'from-left' }), () => slide({ direction: 'from-right' }), () => slide({ direction: 'from-bottom' }), () => slide({ direction: 'from-right' }), () => fade(), () => fade()];
export const DURACION_ONB2 = ESCENAS.reduce((n, [, d]) => n + d, 0) + 0.1; // las transiciones se solapan: el total es la suma de las escenas

export function Onboarding2() {
  return (
    <AbsoluteFill style={{ background: PAPEL }}>
      <Audio src={staticFile('musica/inspired-largo.mp3')} volume={(f) => 0.13 * interpolate(f, [0, 20], [0, 1], CL) * interpolate(f, [s(DURACION_ONB2) - 75, s(DURACION_ONB2)], [1, 0], CL)} />
      <TransitionSeries>
        {ESCENAS.map(([C, seg], i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={s(seg) + (i < ESCENAS.length - 1 ? T : 0)}><C /></TransitionSeries.Sequence>
            {i < ESCENAS.length - 1 && <TransitionSeries.Transition presentation={TRANS[i]()} timing={springTiming({ config: { damping: 200 }, durationInFrames: T })} />}
          </React.Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
}
