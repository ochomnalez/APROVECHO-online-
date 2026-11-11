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

// Resaltado animado sobre una zona de la pantalla (coordenadas en píxeles del original `base`)
function Marco({ x, y, w, h, base, en, fin, txt }) {
  const f = useCurrentFrame(); const t = f / FPS;
  const v = ease(t, en, en + 0.3) * (1 - ease(t, fin - 0.3, fin));
  if (v <= 0.01) return null;
  const pulso = 1 + Math.sin((t - en) * 6) * 0.012;
  return (
    <div style={{ position: 'absolute', left: `${(x / base[0]) * 100}%`, top: `${(y / base[1]) * 100}%`, width: `${(w / base[0]) * 100}%`, height: `${(h / base[1]) * 100}%`,
      border: `4px solid ${VERDE}`, borderRadius: 14, boxShadow: '0 0 0 6px rgba(47,125,74,.22), 0 0 30px rgba(47,125,74,.38)', opacity: v, transform: `scale(${pulso})`, pointerEvents: 'none', zIndex: 6 }}>
      {txt && <span style={{ position: 'absolute', right: 10, top: -17, background: VERDE, color: PAPEL, fontFamily: CUERPO, fontWeight: 700, fontSize: 17, padding: '3px 14px', borderRadius: 999, whiteSpace: 'nowrap' }}>{txt}</span>}
    </div>
  );
}

// Pantallas que se empujan como navegación real.
// tomas: [{src, desde (s), clic:{caja:[x,y,w,h], en (s)}, foco:{x,y,z,en,fin}, marcos:[...] , base}]
// "clic" pone un cuadradito con la palabra Clic alrededor del botón, una ondita y un zoom suave para enfocar.
function Pantallas({ tomas, radio }) {
  const f = useCurrentFrame(); const t = f / FPS;
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: radio, overflow: 'hidden', background: PAPEL }}>
      {tomas.map((tm, i) => {
        const d = s(tm.desde || 0); const sig = tomas[i + 1] ? s(tomas[i + 1].desde) : 1e9;
        if (f < d - 1 || f > sig + 16) return null;
        const entra = i === 0 ? 1 : suave(f, d, d + 14); const sale = suave(f, sig, sig + 14);
        const base = tm.base || REV;
        const c = tm.clic ? tm.clic.caja : null;
        const fo = tm.clic ? { x: c[0] + c[2] / 2, y: c[1] + c[3] / 2, z: tm.clic.z || 1.2, en: tm.clic.en - 0.9, fin: tm.clic.en + 1.5 } : tm.foco;
        const z = fo ? 1 + (fo.z - 1) * ease(t, fo.en, fo.en + 0.6) * (1 - ease(t, fo.fin, fo.fin + 0.6)) : 1;
        return (
          <div key={i} style={{ position: 'absolute', inset: 0, transform: `translateX(${(1 - entra) * 100 - sale * 30}%)`, boxShadow: i > 0 ? '-20px 0 40px rgba(0,0,0,.12)' : 'none', background: PAPEL, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, transformOrigin: fo ? `${(fo.x / base[0]) * 100}% ${(fo.y / base[1]) * 100}%` : '50% 50%', transform: `scale(${z})` }}>
              <Img src={a(tm.src)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 0%' }} />
              {c && <Marco x={c[0] - 4} y={c[1] - 4} w={c[2] + 8} h={c[3] + 8} base={base} en={tm.clic.en - 0.3} fin={tm.clic.en + 1.3} txt="Clic" />}
              {c && <Toque x={((c[0] + c[2] / 2) / base[0]) * 100} y={((c[1] + c[3] / 2) / base[1]) * 100} en={s(tm.clic.en)} />}
              {tm.marcos && tm.marcos.map((m, k) => <Marco key={k} {...m} />)}
              {tm.capas && tm.capas.map((c2, k) => (<div key={k} style={{ position: 'absolute', left: `${c2.x / base[0] * 100}%`, top: `${c2.y / base[1] * 100}%`, width: `${c2.w / base[0] * 100}%`, height: `${c2.h / base[1] * 100}%`, background: c2.bg || 'transparent', borderRadius: c2.r || 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: c2.al || 'flex-start', fontFamily: CUERPO, fontWeight: c2.fw || 700, color: c2.col || TINTA, fontSize: c2.fs ? `${c2.fs / base[0] * 100 * 0.01 * 1}em` : undefined }}>{c2.img ? <Img src={staticFile(c2.img)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: c2.fs, whiteSpace: 'nowrap', textDecoration: c2.tach ? 'line-through' : 'none' }}>{c2.txt}</span>}</div>))}
            </div>
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
  const f = useCurrentFrame(); const e = useSp(s(desde), { damping: 16, mass: 0.9 }); const t = f / FPS;
  const H = Math.round((W - 36) * 600 / 1024) + 36; const flota = Math.sin(t * 1.1) * 6;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: W, height: H, perspective: 1800, opacity: Math.min(1, e * 2) }}>
      <div style={{ width: '100%', height: '100%', borderRadius: 34, background: TINTA, padding: 18, boxShadow: '0 40px 80px rgba(15,51,38,.26)', transform: `translate(${(1 - e) * 140}px, ${flota}px) rotateY(${-5 * (1 - e) - 3}deg)` }}>
        <Pantallas tomas={tomas} radio={18} />
      </div>
    </div>
  );
}

function Escritorio({ tomas, x = 760, y = 150, W = 1050, desde = 0 }) {
  const f = useCurrentFrame(); const e = useSp(s(desde), { damping: 16, mass: 0.9 }); const t = f / FPS;
  const H = Math.round((W - 24) * 900 / 1440) + 24; const flota = Math.sin(t * 1.0) * 5;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: W, height: H, opacity: Math.min(1, e * 2) }}>
      <div style={{ width: '100%', height: '100%', borderRadius: 18, background: TINTA, padding: 12, boxShadow: '0 40px 80px rgba(15,51,38,.26)', transform: `translate(${(1 - e) * 120}px, ${flota}px)` }}>
        <Pantallas tomas={tomas} radio={8} />
      </div>
    </div>
  );
}

// Clip de video con marco (toma con personas)
function Tarjeta({ src, x, y, w, h, desde = 0, hasta, desdeVideo = 0, cortes, rate = 1, children }) {
  const f = useCurrentFrame();
  const e = useSp(s(desde), { damping: 16, mass: 0.8 });
  const sal = hasta ? ease(f, s(hasta), s(hasta) + 12) : 0;
  const v = Math.min(1, e * 2) * (1 - sal);
  if (f < s(desde) - 2 || v <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 22, overflow: 'hidden', background: TINTA, boxShadow: '0 40px 80px rgba(15,51,38,.28)', opacity: v, transform: `translateY(${(1 - e) * 60 + sal * -30}px) scale(${0.94 + 0.06 * e - sal * 0.04})` }}>
      {cortes
        ? cortes.map(([c0, c1, vs], i) => (
          <Sequence key={i} from={s(c0)} durationInFrames={s(c1 - c0) + 1}>
            <OffthreadVideo src={staticFile(`tomas/${src}`)} startFrom={s(vs)} playbackRate={rate} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Sequence>))
        : <Sequence from={s(desde)}><OffthreadVideo src={staticFile(`tomas/${src}`)} startFrom={s(desdeVideo)} playbackRate={rate} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></Sequence>}
      {children}
    </div>
  );
}

// ---------- Escenas (todo se sincroniza con la voz real: src/voz-tiempos.json) ----------
const OFFS = { e1: 0.25 }; const OFF = 0.5; // la voz entra un poco después de que aparece cada escena (así se ve la pantalla antes)
const offDe = (k) => (OFFS[k] ?? OFF);
const segsDe = (k) => VT[k].segs.map((x) => ({ t: x.t, a: x.a + offDe(k), b: x.b + offDe(k) }));
const durDe = (k, min = 0, cola = 0.8) => Math.max(min, VT[k].dur + offDe(k) + cola);
const Voz = ({ k }) => (VT[k] && VT[k].audio === false ? null : <Sequence from={s(offDe(k))}><Audio src={staticFile(`voz2/${VT[k] ? k : 'e7'}.mp3`)} /></Sequence>);
const CLIPS = { menu: true };
const REV = [390, 844]; // tamaño de la pantalla del celular en las capturas
const BTN = { entrar: [18, 583, 354, 52], seguir: [18, 620, 354, 52], fotoLista: [18, 443, 354, 52], muestra: [139, 510, 111, 149], publicar: [18, 764, 354, 52], reservar: [108, 778, 264, 54], pagar: [18, 717, 354, 52], escanear: [18, 56, 354, 52], confirmar: [18, 640, 354, 52], descargar: [249, 6, 127, 44], bajar: [18, 580, 354, 52] };
const INT = [1440, 900]; // tamaño del panel de Intelligence
const SUG1 = [338, 292, 976, 169]; const SUG2 = [338, 475, 976, 169]; // tarjetas de sugerencias del panel

function E1() {
  const f = useCurrentFrame(); const sg = segsDe('e1');
  const m = suave(f, 0, 14); const lg = useSp(6, { damping: 13 });
  return (
    <AbsoluteFill style={{ background: BOSQUE, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, clipPath: `inset(${(1 - m) * 50}% 0 ${(1 - m) * 50}% 0)` }}>
        <OffthreadVideo src={staticFile('tomas/H-apertura.mp4')} playbackRate={1.05} muted style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${interpolate(f, [0, s(5)], [1.1, 1.02], CL)})` }} />
        <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(15,51,38,.93) 0%, rgba(15,51,38,.7) 38%, rgba(15,51,38,0) 72%)', opacity: ease(f, 6, 22) }} />
      </div>
      <div style={{ position: 'absolute', left: 140, top: 190, width: 880 }}>
        <Img src={staticFile(SELLO)} style={{ width: 190, height: 190, transform: `scale(${0.7 + lg * 0.3}) rotate(${(1 - lg) * -18}deg)`, opacity: Math.min(1, lg * 2), marginBottom: 30 }} />
        <Cinetico texto="Tu guía para empezar." desde={12} tam={104} color={PAPEL} paso={2} />
      </div>
      <Voz k="e1" /><Subs segs={sg} />
    </AbsoluteFill>
  );
}

function E2() {
  const sg = segsDe('e2'); const at = (i, o = 0) => sg[i].a + o * 0.85;
  return (
    <AbsoluteFill>
      <Fondo k={1} />
      <div style={{ position: 'absolute', left: 140, top: 150, width: 900 }}>
        <Capitulo n="1" texto="Primeros pasos" />
        <Cinetico texto="Armá tu comercio en minutos." tam={86} desde={6} />
        <Lista items={[['Entrás como comercio', at(0)], ['Elegís tu plan', at(0, 1.5)]]} />
      </div>
      <Celular tomas={[
        { src: '01-bienvenida', desde: 0, clic: { caja: BTN.entrar, en: at(0, 0.5) } },
        { src: '02-plan', desde: at(0, 1.8), clic: { caja: BTN.seguir, en: at(0, 3.2) } },
      ]} />
      <Voz k="e2" /><Subs segs={sg} />
    </AbsoluteFill>
  );
}

function ColumnaMenu({ off }) {
  const sg = segsDe('e2b'); const at = (i, o = 0) => sg[i].a + o * 0.85;
  return (
    <div style={{ position: 'absolute', left: 140, top: 150, width: 900 }}>
      <Capitulo n="1" texto="Tu carta, con una foto" />
      <Cinetico texto="Fotografiás el menú y listo." tam={86} desde={6} />
      <Lista items={[['Le sacás una foto a tu menú', Math.max(0.3, at(0) - off)], ['La app lee productos y precios', at(0, 2.8) - off], ['Vos revisás y ajustás', at(0, 4.6) - off]]} />
    </div>
  );
}
function E2b() {
  const sg = segsDe('e2b'); const at = (i, o = 0) => sg[i].a + o * 0.85; const tI = at(0, 2.6);
  return (
    <AbsoluteFill>
      <Fondo k={6} />
      <Sequence from={s(tI)}><ColumnaMenu off={tI} /></Sequence>
      <Tarjeta src="menu.mp4" x={90} y={110} w={1040} h={585} desde={0.2} hasta={tI} />
      <Celular tomas={[
        { src: '04-carta', desde: 0, clic: { caja: BTN.fotoLista, en: at(0, 1.6) } },
        { src: '05-carta-cargada', desde: at(0, 3.0) },
      ]} />
      <Voz k="e2b" /><Subs segs={sg} />
    </AbsoluteFill>
  );
}

function E3a() {
  const sg = segsDe('e3a'); const at = (i, o = 0) => sg[i].a + o * 0.85; const fin = durDe('e3a', 5.9, 0.9) - 0.4;
  return (
    <AbsoluteFill>
      <Fondo k={2} />
      <div style={{ position: 'absolute', left: 90, top: 28 }}><Capitulo n="2" texto="Base · publicar con una foto" /></div>
      <Tarjeta src="L-foto-app.mp4" x={90} y={110} w={1040} h={585} desde={0.2} hasta={fin} />
      <Celular tomas={[
        { src: '08-camara', desde: 0, clic: { caja: BTN.muestra, en: at(0, 1.4) } },
        { src: '09-analizando', desde: at(1, 0), capas: [
          { x: 18, y: 175, w: 354, h: 265, img: 'fotos/L-mesada.jpg' },
          { x: 18, y: 452, w: 354, h: 24, bg: '#fff', txt: 'Medialuna ×2 · Brownie ×1 · Sándwich ×2', fs: 14, fw: 500 }] },
        { src: '11-tras-analisis', desde: at(1, 2.2), capas: [
          { x: 33, y: 82, w: 312, h: 232, img: 'fotos/L-mesada.jpg', r: 10 },
          { x: 33, y: 368, w: 200, h: 48, bg: '#fff', txt: 'Medialuna de manteca', fs: 18 },
          { x: 270, y: 380, w: 34, h: 24, bg: '#F6EFE4', txt: '2 u', fs: 18 },
          { x: 33, y: 445, w: 200, h: 28, bg: '#fff', txt: 'Sándwich y brownie', fs: 18 },
          { x: 270, y: 445, w: 34, h: 28, bg: '#F6EFE4', txt: '3 u', fs: 18 },
          { x: 262, y: 571, w: 96, h: 26, bg: '#EEF6EB', txt: '$1.000', fs: 24, al: 'flex-end' },
          { x: 33, y: 602, w: 220, h: 22, bg: '#EEF6EB', txt: '2 u de medialuna · ≈ 90 g', fs: 15, fw: 500 },
          { x: 305, y: 602, w: 50, h: 22, bg: '#EEF6EB', txt: '$2.000', fs: 15, fw: 500, tach: 1, al: 'flex-end' },
          { x: 262, y: 719, w: 96, h: 26, bg: '#EEF6EB', txt: '$1.500', fs: 24, al: 'flex-end' },
          { x: 33, y: 751, w: 220, h: 22, bg: '#EEF6EB', txt: '3 u de sándwich y brownie · ≈ 260 g', fs: 15, fw: 500 },
          { x: 305, y: 751, w: 50, h: 22, bg: '#EEF6EB', txt: '$3.000', fs: 15, fw: 500, tach: 1, al: 'flex-end' }] },
      ]} />
      <Voz k="e3a" /><Subs segs={sg} />
    </AbsoluteFill>
  );
}

const sg3b = segsDe('e3b'); const tD3b = sg3b[2].a - 0.4;
function ColumnaE3b({ r }) {
  return (
    <div style={{ position: 'absolute', left: 140, top: 150, width: 900 }}>
      <Capitulo n="2" texto="Base · vos decidís" />
      <Cinetico texto="Cada detalle lo elegís vos." tam={80} desde={6} />
      <Lista items={[['Elegís el horario de retiro', r[0]], ['Marcás las condiciones con un clic', r[1]], ['Confirmás las alergias posibles', r[2]]]} ancho={900} />
    </div>
  );
}
function E3b() {
  const at = (i, o = 0) => sg3b[i].a + o * 0.85;
  return (
    <AbsoluteFill>
      <Fondo k={7} />
      <Sequence from={0} durationInFrames={s(tD3b)}><ColumnaE3b r={[at(0), at(1), at(1, 2.8)]} /></Sequence>
      <Tarjeta src="D-base.mp4" x={90} y={110} w={1040} h={585} desde={tD3b} hasta={tD3b + 5.6} />
      <Celular tomas={[
        { src: '12-revisar-checklist', desde: 0,
          foco: { x: 195, y: 190, z: 1.25, en: at(0) - 0.2, fin: at(1) - 0.2 },
          marcos: [
            { x: 12, y: 144, w: 366, h: 74, base: REV, en: at(0), fin: at(1) - 0.1, txt: 'Lo elegís vos' },
            { x: 12, y: 246, w: 366, h: 78, base: REV, en: at(1), fin: at(1, 2.7), txt: 'Un clic' },
            { x: 12, y: 404, w: 366, h: 352, base: REV, en: at(1, 2.8), fin: tD3b, txt: 'Los confirmás vos' },
          ],
          clic: { caja: BTN.publicar, en: tD3b + 1.2, z: 1.15 } },
        { src: '13-publicado', desde: tD3b + 2.8 },
      ]} />
      <Voz k="e3b" /><Subs segs={sg3b} />
    </AbsoluteFill>
  );
}

function E4() {
  const sg = segsDe('e4'); const at = (i, o = 0) => sg[i].a + o * 0.85;
  return (
    <AbsoluteFill>
      <Fondo k={3} />
      <div style={{ position: 'absolute', left: 720, top: 150, width: 1000 }}>
        <Capitulo n="3" texto="Base · vender y cobrar" />
        <Cinetico texto="Reserva, QR y retiro." tam={92} desde={6} />
        <Lista items={[['El vecino reserva y paga desde la app', at(0)], ['Recibe un código QR', at(1)], ['Lo escaneás en el local', at(1, 2.2)], ['Cobrás cada venta, sin abono fijo', at(2)]]} ancho={1000} />
      </div>
      <Celular x={170} giro={8} tomas={[
        { src: '14-cliente-ve-pack', desde: 0, clic: { caja: BTN.reservar, en: at(0, 1.2), z: 1.03 } },
        { src: '15-reservar', desde: at(0, 2.2), clic: { caja: BTN.pagar, en: at(0, 3.4), z: 1.03 } },
        { src: '16-reserva-qr', desde: at(1, -0.2) },
        { src: '17-retiros', desde: at(1, 2.0), clic: { caja: BTN.escanear, en: at(1, 3.0) } },
        { src: '18-retiro-validado', desde: at(1, 4.2), clic: { caja: BTN.confirmar, en: at(1, 5.4) } },
        { src: '19-hoy-final', desde: at(2, 0) },
      ]} />
      <Voz k="e4" /><Subs segs={sg} />
    </AbsoluteFill>
  );
}

function PopLogo({ en, x, y, color, letra, rot }) {
  const e = useSp(s(en), { damping: 9, mass: 0.6 });
  const f = useCurrentFrame(); const t = f / FPS;
  if (e <= 0.001) return null;
  const x0 = 1435, y0 = 380; // centro del celular
  return (
    <div style={{ position: 'absolute', left: x0 + (x - x0) * e - 49, top: y0 + (y - y0) * e - 49 + Math.sin(t * 2 + x) * 4, width: 98, height: 98, borderRadius: 22, background: color, color: '#fff', fontFamily: CUERPO, fontWeight: 800, fontSize: letra.length > 1 ? 34 : 56, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 34px rgba(0,0,0,.28)', transform: `scale(${Math.min(1.1, e)}) rotate(${rot * e}deg)`, opacity: Math.min(1, e * 3), zIndex: 5 }}>{letra}</div>
  );
}

function E5() {
  const sg = segsDe('e5'); const at = (i, o = 0) => sg[i].a + o * 0.85;
  return (
    <AbsoluteFill>
      <Fondo k={4} />
      <div style={{ position: 'absolute', left: 140, top: 150, width: 900 }}>
        <Capitulo n="4" texto="Base · tus números" />
        <Cinetico texto="Mirá lo que recuperás." tam={92} desde={6} />
        <Lista items={[['Plata y kilos recuperados', at(0)], ['Huella de carbono asociada (estimada)', at(0, 4.3)], ['Informe en Excel o PDF', at(1)]]} />
      </div>
      <Celular tomas={[
        { src: '20-impacto', desde: 0, foco: { x: 195, y: 460, z: 1.28, en: at(0, 3.9), fin: at(1) - 0.1 }, marcos: [{ x: 140, y: 406, w: 110, h: 108, base: REV, en: at(0, 4.3), fin: at(1) - 0.1, txt: 'Estimado' }] },
        { src: '21-reporte', desde: at(1, 0.6), clic: { caja: BTN.bajar, en: at(1, 1.8) } },
        { src: '24-reporte-listo', desde: at(1, 3.0) },
      ]} />
      <PopLogo en={at(1, 1.55)} x={1170} y={300} color="#1D6F42" letra="X" rot={-9} />
      <PopLogo en={at(1, 2.15)} x={1170} y={430} color="#9B1C1C" letra="PDF" rot={8} />
      <Voz k="e5" /><Subs segs={sg} />
    </AbsoluteFill>
  );
}

// Foto con zoom lento y etiquetas (la balanza con la tablet no es un clip: es una foto)
function FotoSmart({ x, y, w, h, desde, hasta }) {
  const f = useCurrentFrame(); const t = f / FPS;
  const e = useSp(s(desde), { damping: 16, mass: 0.8 }); const sal = ease(t, hasta, hasta + 0.4);
  const v = Math.min(1, e * 2) * (1 - sal);
  if (f < s(desde) - 2 || v <= 0.001) return null;
  const z = 1.0 + 0.1 * ((t - desde) / Math.max(1, hasta - desde));
  const et = (txt, left, top, en) => (
    <div style={{ position: 'absolute', left: `${left}%`, top: `${top}%`, opacity: ease(t, en, en + 0.4), transform: `translateY(${(1 - ease(t, en, en + 0.4)) * 10}px)` }}>
      <span style={{ background: VERDE, color: PAPEL, fontFamily: CUERPO, fontWeight: 700, fontSize: 24, padding: '6px 18px', borderRadius: 999, boxShadow: '0 6px 18px rgba(0,0,0,.3)' }}>{txt}</span>
    </div>
  );
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 22, overflow: 'hidden', background: TINTA, boxShadow: '0 40px 80px rgba(15,51,38,.28)', opacity: v, transform: `translateY(${(1 - e) * 60}px) scale(${0.94 + 0.06 * e})` }}>
      <Img src={staticFile('fotos/K-smart.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', transformOrigin: '50% 60%', transform: `scale(${z})` }} />
      {et('Tablet con cámara', 36, 6, desde + 0.5)}
      {et('Balanza · peso real', 25, 82, desde + 1.4)}
    </div>
  );
}

function E6() {
  const sg = segsDe('e6'); const at = (i, o = 0) => sg[i].a + o * 0.85;
  const tC = Math.min(at(0, 6.2), durDe('e6') - 3.2);
  return (
    <AbsoluteFill>
      <Fondo k={5} />
      <div style={{ position: 'absolute', left: 140, top: 100, width: 800 }}>
        <Capitulo n="5" texto="Smart · la estación" />
        <Cinetico texto="Medí con balanza y cámara." tam={78} desde={6} />
        <Lista items={[['Balanza + tablet con cámara', tC + 0.2], ['Peso real, no estimado', at(1, 1.4)], ['Vos decidís: venta o descarte', at(1, 4.4)]]} ancho={780} />
      </div>
      <Tarjeta src="G-smart.mp4" x={110} y={410} w={760} h={428} desde={0.2} hasta={3.9} rate={0.55} cortes={[[0, 3.9, 0]]} />
      <FotoSmart x={110} y={410} w={760} h={428} desde={3.4} hasta={tC} />
      <Tableta x={930} y={170} W={900} tomas={[
        { src: 't-02-estacion-vacia', desde: 0 },
        { src: 't-03-pesando', desde: at(1, 0) },
        { src: 't-04-pesado', desde: at(1, 1.8) },
        { src: 't-06-basura-motivo', desde: at(1, 4.8) },
        { src: 't-07-basura-motivo-elegido', desde: at(1, 6.6) },
        { src: 't-08-registro', desde: at(1, 7.8) },
      ]} />
      <Voz k="e6" /><Subs segs={sg} />
    </AbsoluteFill>
  );
}

// Sucursales que se conectan a un solo panel (animación hecha en código con las sucursales reales del prototipo)
const SUCS = [['San Isidro', '4,6%', 'fotos/suc-a.jpg'], ['Martínez', '5,1%', 'fotos/suc-b.jpg'], ['Olivos', '5,6%', 'fotos/suc-c.jpg']];
function Sucursales() {
  const f = useCurrentFrame(); const t = f / FPS;
  const px = 740, py = 480; const cy = [210, 440, 670];
  const bez = (p0, p1, p2, p3, u) => { const m = 1 - u; return m * m * m * p0 + 3 * m * m * u * p1 + 3 * m * u * u * p2 + u * u * u * p3; };
  return (
    <>
      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
        {SUCS.map((_, i) => {
          const ap = ease(t, 0.5 + i * 0.35, 1.3 + i * 0.35); const x0 = 585, y0 = cy[i];
          const path = `M ${x0} ${y0} C ${x0 + 90} ${y0}, ${px - 90} ${py}, ${px} ${py}`;
          const u = ((t * 0.55 + i * 0.33) % 1); const dx = bez(x0, x0 + 90, px - 90, px, u); const dy = bez(y0, y0, py, py, u);
          return (
            <g key={i} opacity={ap}>
              <path d={path} fill="none" stroke={VERDE} strokeWidth="5" strokeLinecap="round" strokeDasharray="900" strokeDashoffset={900 * (1 - ap)} />
              <circle cx={dx} cy={dy} r="9" fill={VIVO} stroke={PAPEL} strokeWidth="3" opacity={ap > 0.95 ? 1 : 0} />
            </g>
          );
        })}
        <circle cx={px} cy={py} r={12 + Math.sin(t * 5) * 2} fill={VERDE} opacity={ease(t, 1.4, 1.8)} />
      </svg>
      {SUCS.map(([nombre, pct, foto], i) => {
        const v = ease(t, 0.1 + i * 0.35, 0.6 + i * 0.35);
        return (
          <div key={nombre} style={{ position: 'absolute', left: 110, top: cy[i] - 85, width: 475, height: 170, borderRadius: 20, background: '#fff', border: `1px solid ${LINEA}`, boxShadow: '0 22px 44px rgba(15,51,38,.16)', display: 'flex', overflow: 'hidden', opacity: v, transform: `translateX(${(1 - v) * -80}px)` }}>
            <Img src={staticFile(foto)} style={{ width: 190, height: '100%', objectFit: 'cover' }} />
            <div style={{ padding: '18px 22px', fontFamily: CUERPO, color: TINTA }}>
              <div style={{ fontFamily: TITULO, fontWeight: 800, fontSize: 36, color: BOSQUE }}>{nombre}</div>
              <div style={{ fontSize: 17, color: '#5E6F66', marginTop: 4 }}>desperdicio · 30 días</div>
              <div style={{ fontFamily: TITULO, fontWeight: 800, fontSize: 44, color: VERDE, marginTop: 6 }}>{pct}</div>
            </div>
          </div>
        );
      })}
    </>
  );
}

const K7A = VT.e7a ? 'e7a' : 'e7'; // mientras no exista la voz nueva, se usa la anterior
function E7a() {
  const sg = segsDe(K7A); const at = (i, o = 0) => sg[i].a + o * 0.85; const L1 = sg[1].b - sg[1].a; const tA = at(1, -0.3);
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Fondo k={9} />
      <Sequence from={0} durationInFrames={s(tA)}>
        <div style={{ position: 'absolute', left: 1160, top: 200, width: 660 }}>
          <Capitulo n="6" texto="Intelligence" />
          <Cinetico texto="Para varias sucursales." tam={74} desde={6} />
        </div>
      </Sequence>
      <Tarjeta src="B2-intelligence.mp4" x={90} y={140} w={1000} h={562} desde={0.2} hasta={tA} />
      <Sequence from={s(tA)}><Sucursales /></Sequence>
      <Escritorio x={740} y={150} W={1090} desde={tA + 0.2} tomas={[
        { src: 'i-06-sucursales', desde: 0 },
        { src: 'i-02-resumen', base: INT, desde: at(1, L1 * 0.36),
          foco: { x: 760, y: 540, z: 1.25, en: at(1, L1 * 0.4), fin: at(1, L1 * 0.95), },
          marcos: [{ x: 300, y: 470, w: 930, h: 140, base: INT, en: at(1, L1 * 0.4), fin: at(1, L1 * 0.95), txt: 'Estimado' }] },
      ]} />
      <div style={{ position: 'absolute', right: 120, top: 112, fontFamily: CUERPO, fontSize: 18, color: '#6C7A72', opacity: ease(f / FPS, tA + 0.8, tA + 1.2) }}>Datos de ejemplo</div>
      <Voz k={K7A} /><Subs segs={sg} />
    </AbsoluteFill>
  );
}

function E7b() {
  const sg = segsDe('e7b'); const at = (i, o = 0) => sg[i].a + o * 0.85; const L1 = sg[1].b - sg[1].a;
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Fondo k={10} />
      <div style={{ position: 'absolute', left: 90, top: 28 }}><Capitulo n="6" texto="Intelligence · sugerencias" /></div>
      <Tarjeta src="N-gerente.mp4" x={90} y={110} w={1040} h={585} desde={0.2} hasta={at(0, 1.6)} />
      <Escritorio x={560} y={120} W={1260} desde={at(0, 0.4)} tomas={[
        { src: 'i-02-resumen', desde: 0 },
        { src: 'i-03-sugerencias', base: INT, desde: at(1, -0.5),
          foco: { x: 826, y: 380, z: 1.28, en: at(1, 0.8), fin: at(1, L1 * 0.97) },
          marcos: [
            { x: SUG1[0], y: SUG1[1], w: SUG1[2], h: SUG1[3], base: INT, en: at(1, 0.8), fin: at(1, L1 * 0.55), txt: 'Los martes' },
            { x: SUG2[0], y: SUG2[1], w: SUG2[2], h: SUG2[3], base: INT, en: at(1, L1 * 0.57), fin: at(1, L1 * 0.97), txt: 'Antes de las 18' },
          ] },
      ]} />
      <div style={{ position: 'absolute', right: 90, top: 70, fontFamily: CUERPO, fontSize: 18, color: '#6C7A72', opacity: ease(f / FPS, at(0, 1), at(0, 1.5)) }}>Datos de ejemplo</div>
      <Voz k="e7b" /><Subs segs={sg} />
    </AbsoluteFill>
  );
}

function E9() {
  const f = useCurrentFrame(); const sc = useSp(4, { damping: 12 }); const sg = segsDe('e9');
  return (
    <AbsoluteFill>
      <Fondo oscuro k={8} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Img src={staticFile(SELLO)} style={{ width: 360, height: 360, transform: `scale(${0.7 + sc * 0.3}) rotate(${(1 - sc) * -20}deg)`, opacity: Math.min(1, sc * 2) }} />
        <div style={{ marginTop: 36 }}><Cinetico texto="Empezar es simple." tam={76} color={PAPEL} desde={12} /></div>
        <div style={{ marginTop: 34, padding: '20px 46px', borderRadius: 999, background: MENTA, color: BOSQUE, fontFamily: CUERPO, fontWeight: 700, fontSize: 36, opacity: ease(f, 36, 50) }}>Sumá tu comercio</div>
        <div style={{ position: 'absolute', bottom: 24, fontFamily: CUERPO, fontSize: 15, color: 'rgba(251,243,228,.5)' }}>Música: “Life of Riley”, Kevin MacLeod (incompetech.com) · CC BY 4.0</div>
      </AbsoluteFill>
      <Voz k="e9" /><Subs segs={sg} />
    </AbsoluteFill>
  );
}

const ESCENAS = [
  [E1, Math.max(4.6, VT.e1.dur + offDe('e1') + 0.4)], [E2, durDe('e2', 4.0)], [E2b, durDe('e2b', 6.0)], [E3a, durDe('e3a', 6.2, 0.9)], [E3b, Math.max(durDe('e3b'), tD3b + 5.6)],
  [E4, durDe('e4', 0.0, 0.9)], [E5, durDe('e5', 0.0, 0.9)], [E6, durDe('e6', 0.0, 0.9)], [E7a, durDe(K7A, 9.0, 0.8)], [E7b, durDe('e7b', 6.4, 0.9)], [E9, durDe('e9', 4.5)],
];
const TRANS = [() => wipe({ direction: 'from-left' }), () => slide({ direction: 'from-right' }), () => fade(), () => slide({ direction: 'from-bottom' }), () => slide({ direction: 'from-right' }), () => fade(), () => slide({ direction: 'from-right' }), () => wipe({ direction: 'from-right' }), () => fade(), () => fade()];
export const DURACION_ONB2 = ESCENAS.reduce((n, [, d]) => n + d, 0) + 0.1; // las transiciones se solapan: el total es la suma de las escenas

export function Onboarding2() {
  return (
    <AbsoluteFill style={{ background: PAPEL }}>
      <Audio src={staticFile('musica/lifeofriley-largo.mp3')} volume={(f) => 0.24 * interpolate(f, [0, 20], [0, 1], CL) * interpolate(f, [s(DURACION_ONB2) - 75, s(DURACION_ONB2)], [1, 0], CL)} />
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
