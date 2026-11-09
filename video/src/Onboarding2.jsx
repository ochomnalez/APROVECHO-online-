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
        : <OffthreadVideo src={staticFile(`tomas/${src}`)} startFrom={s(desdeVideo)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      {children}
    </div>
  );
}

// ---------- Escenas ----------
const SEG1 = segmentar(['Bienvenido a APROVECHO.', 'Te mostramos cómo empezar, paso a paso.'], 0.5);
function E1() {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, s(6)], [1.14, 1.02], { ...CL, easing: Easing.out(Easing.quad) });
  const m = suave(f, 0, 18); const lg = useSp(8, { damping: 13 });
  return (
    <AbsoluteFill style={{ background: BOSQUE, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, clipPath: `inset(${(1 - m) * 50}% 0 ${(1 - m) * 50}% 0)` }}>
        <OffthreadVideo src={staticFile('tomas/H-apertura.mp4')} muted style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})` }} />
        <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(15,51,38,.93) 0%, rgba(15,51,38,.7) 38%, rgba(15,51,38,0) 72%)', opacity: ease(f, 8, 28) }} />
      </div>
      <div style={{ position: 'absolute', left: 140, top: 190, width: 880 }}>
        <Img src={staticFile(SELLO)} style={{ width: 190, height: 190, transform: `scale(${0.7 + lg * 0.3}) rotate(${(1 - lg) * -18}deg)`, opacity: Math.min(1, lg * 2), marginBottom: 30 }} />
        <Cinetico texto="Tu guía para empezar." desde={18} tam={104} color={PAPEL} />
      </div>
      <Subs segs={SEG1} />
    </AbsoluteFill>
  );
}

const SEG2 = segmentar(['Entrás como comercio y elegís tu plan.', 'Cargás tu carta con una foto de tu lista de precios: la app lee los productos y los precios sola.', 'Y llegás a Hoy, tu pantalla principal.'], 0.3);
function E2() {
  return (
    <AbsoluteFill>
      <Fondo k={1} />
      <div style={{ position: 'absolute', left: 140, top: 150, width: 900 }}>
        <Capitulo n="1" texto="Primeros pasos" />
        <Cinetico texto="Armá tu comercio en minutos." tam={86} desde={6} />
        <Lista items={[['Entrás como comercio', 0.9], ['Elegís tu plan', 3.0], ['Cargás tu carta con una foto', 5.6], ['Llegás a Hoy, tu pantalla principal', 11.6]]} />
      </div>
      <Celular tomas={[
        { src: '01-bienvenida', desde: 0, toque: { x: 50, y: 75, en: 2.2 } },
        { src: '02-plan', desde: 2.8, toque: { x: 50, y: 92, en: 4.6 } },
        { src: '04-carta', desde: 5.2, toque: { x: 50, y: 66, en: 6.8 } },
        { src: '05-carta-cargada', desde: 7.4 },
        { src: '07-hoy', desde: 11.2 },
      ]} />
      <Subs segs={SEG2} />
    </AbsoluteFill>
  );
}

const SEG3 = segmentar(['Cuando sobra mercadería, sacás una foto.', 'La app reconoce cada producto y cuenta cuántos hay.', 'Arma los packs, el precio y el horario de retiro.', 'Vos revisás, confirmás que la comida es del día, la cadena de frío y los alérgenos, y publicás.', 'La decisión siempre es tuya.'], 0.3);
function E3() {
  return (
    <AbsoluteFill>
      <Fondo k={2} />
      <div style={{ position: 'absolute', left: 140, top: 150, width: 900, opacity: 1 }}>
        <Capitulo n="2" texto="Base · publicar con una foto" />
        <Cinetico texto="Una foto y la app arma tus packs." tam={78} desde={6} />
        <Lista items={[['Reconoce cada producto y cuenta cuántos hay', 5.8], ['Arma packs, precio y horario de retiro', 9.5], ['Vos confirmás: día, frío y alérgenos', 13.2], ['La decisión siempre es tuya', 19.8]]} ancho={900} />
      </div>
      <Tarjeta src="F-apertura.mp4" x={90} y={560} w={760} h={428} desde={0.2} hasta={5.6} />
      <Tarjeta src="D-base.mp4" x={90} y={560} w={760} h={428} desde={19.4} hasta={25.4} />
      <Celular tomas={[
        { src: '08-camara', desde: 0, toque: { x: 50, y: 22, en: 4.6 } },
        { src: '09-analizando', desde: 5.4 },
        { src: '11-tras-analisis', desde: 8.4 },
        { src: '12-revisar-checklist', desde: 13, toque: { x: 50, y: 93, en: 22.2 } },
        { src: '13-publicado', desde: 23.2 },
      ]} />
      <Subs segs={SEG3} />
    </AbsoluteFill>
  );
}

const SEG4 = segmentar(['El vecino ve tu pack en la app, reserva y paga.', 'Recibe un código QR para retirarlo.', 'Vos lo escaneás en el local y la venta queda registrada.', 'Cobrás cada venta, sin abono fijo.'], 0.3);
function E4() {
  return (
    <AbsoluteFill>
      <Fondo k={3} />
      <div style={{ position: 'absolute', left: 720, top: 150, width: 1000 }}>
        <Capitulo n="3" texto="Base · vender y cobrar" />
        <Cinetico texto="Reserva, QR y retiro." tam={92} desde={6} />
        <Lista items={[['El vecino ve tu pack, reserva y paga', 0.8], ['Recibe un código QR', 4.6], ['Vos lo escaneás en el local', 8.2], ['La venta queda registrada: cobrás sin abono fijo', 12.2]]} ancho={1000} />
      </div>
      <Celular x={170} giro={8} tomas={[
        { src: '14-cliente-ve-pack', desde: 0, toque: { x: 62, y: 96, en: 3.2 } },
        { src: '16-reserva-qr', desde: 3.8 },
        { src: '17-retiros', desde: 8, toque: { x: 50, y: 6.5, en: 10.2 } },
        { src: '18-retiro-validado', desde: 11.2, toque: { x: 50, y: 80, en: 13.4 } },
      ]} />
      <Subs segs={SEG4} />
    </AbsoluteFill>
  );
}

const SEG5 = segmentar(['En Impacto ves cuánto recuperaste y descargás tu informe en Excel o PDF.'], 0.3);
function E5() {
  return (
    <AbsoluteFill>
      <Fondo k={4} />
      <div style={{ position: 'absolute', left: 140, top: 150, width: 900 }}>
        <Capitulo n="4" texto="Base · tus números" />
        <Cinetico texto="Mirá lo que recuperás." tam={92} desde={6} />
        <Lista items={[['Plata y kilos recuperados', 0.8], ['Lo medido y lo estimado, separados', 2.4], ['Informe en Excel o PDF', 4.4]]} />
      </div>
      <Celular tomas={[
        { src: '20-impacto', desde: 0, toque: { x: 87, y: 3.8, en: 3.2 } },
        { src: '21-reporte', desde: 3.7, toque: { x: 50, y: 71, en: 5 } },
        { src: '24-reporte-listo', desde: 5.8 },
      ]} />
      <Subs segs={SEG5} />
    </AbsoluteFill>
  );
}

const SEG6 = segmentar(['Si querés medir con precisión, sumás la estación Smart: una balanza y una tablet con cámara.', 'La balanza pesa lo que sobra y la cámara lo reconoce.', 'Vos elegís si va a venta o a la basura, y registrás el motivo.'], 0.3);
function E6() {
  const f = useCurrentFrame();
  const grande = suave(f, s(6.8), s(7.8));
  return (
    <AbsoluteFill>
      <Fondo k={5} />
      <div style={{ position: 'absolute', left: 140, top: 100, width: 800, opacity: 1 - grande * 0.0 }}>
        <Capitulo n="5" texto="Smart · la estación" />
        <Cinetico texto="Medí con balanza y cámara." tam={78} desde={6} />
        <Lista items={[['Balanza + tablet con cámara', 1], ['Peso real, no estimado', 7.4], ['¿Venta o basura? Con motivo', 11.5]]} ancho={780} />
      </div>
      <Tarjeta src="G-smart.mp4" x={110} y={450} w={800} h={450} desde={0.2} hasta={6.4} cortes={[[0, 1.9, 0], [1.9, 6.5, 3.6]]} />
      <Tableta x={930} y={170} W={900} tomas={[
        { src: 't-02-estacion-vacia', desde: 0 },
        { src: 't-03-pesando', desde: 4.2 },
        { src: 't-04-pesado', desde: 6.2 },
        { src: 't-06-basura-motivo', desde: 10 },
        { src: 't-07-basura-motivo-elegido', desde: 12.6 },
        { src: 't-08-registro', desde: 14.2 },
      ]} />
      <Subs segs={SEG6} />
    </AbsoluteFill>
  );
}

// INTELLIGENCE_PENDIENTE: acá va el capítulo 6 (varias sucursales) cuando Octavio lo defina.

const SEG9 = segmentar(['Menos desperdicio, más aprovecho.', 'Sumá tu comercio.'], 0.4);
function E9() {
  const f = useCurrentFrame(); const sc = useSp(4, { damping: 12 });
  return (
    <AbsoluteFill>
      <Fondo oscuro k={8} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Img src={staticFile(SELLO)} style={{ width: 360, height: 360, transform: `scale(${0.7 + sc * 0.3}) rotate(${(1 - sc) * -20}deg)`, opacity: Math.min(1, sc * 2) }} />
        <div style={{ marginTop: 36 }}><Cinetico texto="Menos desperdicio, más aprovecho." tam={72} color={PAPEL} desde={12} /></div>
        <div style={{ marginTop: 34, padding: '20px 46px', borderRadius: 999, background: MENTA, color: BOSQUE, fontFamily: CUERPO, fontWeight: 700, fontSize: 36, opacity: ease(f, 30, 44) }}>Sumá tu comercio</div>
        <div style={{ position: 'absolute', bottom: 24, fontFamily: CUERPO, fontSize: 15, color: 'rgba(251,243,228,.5)' }}>Música: “Inspired”, Kevin MacLeod (incompetech.com) · CC BY 4.0</div>
      </AbsoluteFill>
      <Subs segs={SEG9} />
    </AbsoluteFill>
  );
}

const ESCENAS = [[E1, 6], [E2, 15], [E3, 26], [E4, 16.5], [E5, 8], [E6, 17.5], [E9, 5]];
const TRANS = [() => wipe({ direction: 'from-left' }), () => slide({ direction: 'from-right' }), () => slide({ direction: 'from-bottom' }), () => slide({ direction: 'from-right' }), () => fade(), () => fade()];
export const DURACION_ONB2 = ESCENAS.reduce((n, [, d]) => n + d, 0) - (ESCENAS.length - 1) * (T / FPS) + 0.2;

export function Onboarding2() {
  return (
    <AbsoluteFill style={{ background: PAPEL }}>
      <Audio src={staticFile('musica/inspired-largo.mp3')} volume={(f) => 0.26 * interpolate(f, [0, 12], [0, 1], CL) * interpolate(f, [s(DURACION_ONB2) - 60, s(DURACION_ONB2)], [1, 0], CL)} />
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
