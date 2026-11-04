// Video 1 · Onboarding para comercios (guion: video/01-onboarding/guion.md · voz: video/01-onboarding/voz-en-off.md)
// 1920×1080 · 30 fps · 85 s. v2: transiciones suaves, motion graphics, celular siempre en movimiento.
// Sin voz todavía: el texto de la voz va como subtítulo. Regla D-031: no se muestra el 75% ni el 25%.
import React, { createContext, useContext } from 'react';
import {
  AbsoluteFill, Audio, Easing, Img, Sequence, continueRender, delayRender, interpolate,
  spring, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { TransitionSeries, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';

const BOSQUE = '#0F3326';
const VERDE = '#1A4D3A';
const PAPEL = '#FBF3E4';
const MENTA = '#DFFFD6';
const CORTEZA = '#E07A2E';
const TINTA = '#14281F';
const LINEA = '#D9CBB4';
const GRIS = '#5E6F66';
const TITULO = '"Bricolage Grotesque", Georgia, serif';
const CUERPO = '"Atkinson Hyperlegible", "Trebuchet MS", sans-serif';
export const FPS = 30;
export const DURACION_ONB = 66.4;

// ---- Fuentes locales ----
const fuentes = [
  ['Bricolage Grotesque', 800, 'fuentes/bricolage-800.woff2'],
  ['Bricolage Grotesque', 700, 'fuentes/bricolage-700.woff2'],
  ['Atkinson Hyperlegible', 400, 'fuentes/atkinson-400.woff2'],
  ['Atkinson Hyperlegible', 700, 'fuentes/atkinson-700.woff2'],
];
if (typeof document !== 'undefined') {
  const h = delayRender('fuentes');
  Promise.all(fuentes.map(([f, w, src]) => new FontFace(f, `url(${staticFile(src)})`, { weight: String(w) })
    .load().then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h));
}

const s = (seg) => Math.round(seg * FPS);
// Cada escena corre a su propia velocidad (montaje ágil): el reloj interno avanza Vel veces más rápido
const Vel = createContext(1);
const useFrameReal = useCurrentFrame;
const useF = () => useFrameReal() * useContext(Vel);
const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };
const ease = (f, a, b) => interpolate(f, [a, b], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
const suave = (f, a, b) => interpolate(f, [a, b], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
const useSpring = (desde = 0, cfg = { damping: 16, mass: 0.7 }) => {
  const f = useF(); const { fps } = useVideoConfig();
  return spring({ frame: f - desde, fps, config: cfg });
};

// ---------- Motion graphics base ----------

// Fondo vivo: formas de marca que derivan lento (no es una diapositiva quieta)
function FondoVivo({ oscuro = false, semilla = 0 }) {
  const f = useF();
  const t = f / FPS + semilla * 7;
  const c1 = oscuro ? 'rgba(223,255,214,.06)' : 'rgba(26,77,58,.06)';
  const c2 = oscuro ? 'rgba(224,122,46,.22)' : 'rgba(224,122,46,.16)';
  return (
    <AbsoluteFill style={{ background: oscuro ? BOSQUE : PAPEL, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', background: c1,
        left: 1150 + Math.sin(t * 0.35) * 60, top: -260 + Math.cos(t * 0.3) * 40 }} />
      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
        <circle cx={1500 + Math.cos(t * 0.25) * 40} cy={860 + Math.sin(t * 0.3) * 30} r={260}
          fill="none" stroke={c2} strokeWidth="3" strokeDasharray="6 14" transform={`rotate(${t * 8} 1500 860)`} />
        <circle cx={-80 + Math.sin(t * 0.2) * 30} cy={980} r={340} fill="none" stroke={c1} strokeWidth="80" />
      </svg>
    </AbsoluteFill>
  );
}

// Título cinético: palabra por palabra, desde abajo con máscara
function Cinetico({ texto, desde = 0, tam = 84, color = BOSQUE, paso = 3, peso = 800 }) {
  const f = useF();
  const palabras = texto.split(' ');
  return (
    <h1 style={{ fontFamily: TITULO, fontWeight: peso, fontSize: tam, lineHeight: 1.04, letterSpacing: -1.5,
      margin: 0, color, display: 'flex', flexWrap: 'wrap', columnGap: tam * 0.24 }}>
      {palabras.map((p, i) => {
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

function Rotulo({ texto, desde = 0, claro = false, n }) {
  const f = useF();
  const v = ease(f, desde, desde + 14);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26, opacity: v }}>
      <span style={{ width: 70 * v, height: 4, background: CORTEZA, borderRadius: 2 }} />
      {n && <span style={{ fontFamily: TITULO, fontWeight: 800, fontSize: 24, color: CORTEZA }}>{n}</span>}
      <span style={{ fontFamily: CUERPO, fontWeight: 700, fontSize: 23, letterSpacing: 2.6, textTransform: 'uppercase',
        color: claro ? MENTA : VERDE, transform: `translateX(${(1 - v) * -20}px)` }}>{texto}</span>
    </div>
  );
}

function Aparece({ desde = 0, children, dx = 0, dy = 26, style }) {
  const v = useSpring(desde);
  return <div style={{ opacity: Math.min(1, v * 1.4), transform: `translate(${(1 - v) * dx}px, ${(1 - v) * dy}px)`, ...style }}>{children}</div>;
}

// Subtítulo = voz en off (hasta grabar la voz): las palabras entran al ritmo de la locución, sin cartel
function Subtitulo({ texto, claro = false, dur = 8, voz }) {
  const f = useF();
  const palabras = texto.split(' ');
  const k = useContext(Vel);
  const ini = voz ? s(voz[0]) * k : 8, fin = voz ? s(voz[0] + voz[1]) * k - 6 : s(dur) - 20;
  const paso = (fin - ini) / palabras.length;
  const barra = ease(f, 0, 16);
  return (
    <div style={{ position: 'absolute', left: 140, width: 940, bottom: 56, display: 'flex', gap: 18 }}>
      <div style={{ width: 4, borderRadius: 2, background: CORTEZA, transform: `scaleY(${barra})`, transformOrigin: 'top' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 9, rowGap: 2, fontFamily: CUERPO, fontSize: 29, lineHeight: 1.35,
        color: claro ? PAPEL : TINTA, textShadow: claro ? '0 2px 12px rgba(0,0,0,.5)' : 'none' }}>
        {palabras.map((w, i) => {
          const a = ini + i * paso;
          const v = ease(f, a, a + 8);
          const dicha = f > a + paso * 1.5;
          return (
            <span key={i} style={{ opacity: 0.12 + v * (dicha ? 0.62 : 0.88), transform: `translateY(${(1 - v) * 10}px)`,
              display: 'inline-block', fontWeight: dicha ? 400 : 700 }}>{w}</span>
          );
        })}
      </div>
    </div>
  );
}

function Check({ desde = 0, size = 30, color = VERDE }) {
  const f = useF();
  const c = ease(f, desde, desde + 8); const d = ease(f, desde + 5, desde + 16);
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" style={{ flex: 'none' }}>
      <circle cx="13" cy="13" r="12" fill={color} transform={`scale(${c})`} style={{ transformOrigin: '13px 13px' }} />
      <path d="M7.5 13.5l3.6 3.4 7.4-8" stroke={PAPEL} strokeWidth="2.6" fill="none" strokeLinecap="round"
        strokeLinejoin="round" strokeDasharray="20" strokeDashoffset={20 * (1 - d)} />
    </svg>
  );
}

// Toque en pantalla (onda que se expande)
function Toque({ x, y, en }) {
  const f = useF();
  const v = interpolate(f, [en, en + 18], [0, 1], CL);
  if (f < en - 6 || f > en + 20) return null;
  const pre = ease(f, en - 6, en);
  return (
    <div style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 5 }}>
      <div style={{ position: 'absolute', width: 120, height: 120, left: -60, top: -60, borderRadius: '50%',
        border: `4px solid ${CORTEZA}`, transform: `scale(${0.3 + v * 1.1})`, opacity: 1 - v }} />
      <div style={{ position: 'absolute', width: 44, height: 44, left: -22, top: -22, borderRadius: '50%',
        background: 'rgba(224,122,46,.55)', transform: `scale(${pre * (1 - v * 0.6)})`, opacity: 1 - v * 0.8 }} />
    </div>
  );
}

// Celular: entra con giro, flota, y las pantallas se empujan como navegación real
// tomas: [{src | render, desde (seg), toque:{x,y,en(seg)}}]
function Celular({ tomas, x = 1200, y = 62, desde = 0, giro = -8 }) {
  const f = useF();
  const e = useSpring(desde, { damping: 15, mass: 0.9 });
  const t = f / FPS;
  const W = 450, H = 956, R = 56, B = 14;
  const flotaY = Math.sin(t * 1.3) * 10;
  const rotY = giro * (1 - e) + Math.sin(t * 0.7) * 3;
  const rotZ = (1 - e) * 6 + Math.sin(t * 0.9) * 0.8;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: W, height: H, perspective: 1600 }}>
      <div style={{ width: '100%', height: '100%', borderRadius: R, background: TINTA, padding: B,
        boxShadow: `0 ${50 + flotaY}px 90px rgba(15,51,38,.28), 0 10px 20px rgba(15,51,38,.18)`,
        transform: `translateY(${(1 - e) * 220 + flotaY}px) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`, opacity: Math.min(1, e * 2) }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: R - B, overflow: 'hidden', background: PAPEL }}>
          {tomas.map((tm, i) => {
            const d = s(tm.desde || 0);
            const sig = tomas[i + 1] ? s(tomas[i + 1].desde) : 1e9;
            if (f < d - 1 || f > sig + 16) return null;
            const entra = i === 0 ? 1 : suave(f, d, d + 14);
            const sale = suave(f, sig, sig + 14);
            const tx = (1 - entra) * 100 - sale * 30;
            return (
              <div key={i} style={{ position: 'absolute', inset: 0, transform: `translateX(${tx}%)`,
                boxShadow: i > 0 ? '-20px 0 40px rgba(0,0,0,.12)' : 'none', background: PAPEL }}>
                {tm.render ? tm.render(f - d) : (
                  <Img src={staticFile(`onboarding/${tm.src}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 0%' }} />
                )}
                {tm.toque && <Toque x={tm.toque.x} y={tm.toque.y} en={s(tm.toque.en) - d} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const Contador = ({ hasta, desde, dur = 30, dec = 0, pre = '', suf = '' }) => {
  const f = useF();
  const v = interpolate(f, [desde, desde + dur], [0, hasta], { ...CL, easing: Easing.out(Easing.cubic) });
  return <>{pre}{v.toFixed(dec).replace('.', ',')}{suf}</>;
};

// ---------- Escenas ----------

// 1 · Apertura: cámara en movimiento sobre la foto + gráfico 35,7% que se dibuja
function E1() {
  const f = useF();
  const z = interpolate(f, [0, s(8.5)], [1.32, 1.04], { ...CL, easing: Easing.out(Easing.quad) });
  const px = interpolate(f, [0, s(8.5)], [-90, 40], CL);
  const mascara = suave(f, 0, 22);
  const anillo = ease(f, s(3), s(4.6));
  const R = 118, C = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ background: BOSQUE, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, clipPath: `inset(${(1 - mascara) * 50}% 0 ${(1 - mascara) * 50}% 0)` }}>
        <Img src={staticFile('foto-caja.jpg')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${z}) translateX(${px}px)` }} />
        <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(15,51,38,.94) 0%, rgba(15,51,38,.75) 40%, rgba(15,51,38,0) 72%)',
          opacity: ease(f, 10, 30) }} />
      </div>
      <div style={{ position: 'absolute', left: 140, top: 200, width: 820 }}>
        <Rotulo texto="Para comercios de comida" desde={14} claro />
        <Cinetico texto="Al cierre, siempre sobra algo." desde={20} tam={100} color={PAPEL} />
        <div style={{ marginTop: 60, display: 'flex', alignItems: 'center', gap: 34, opacity: ease(f, s(2.8), s(3.3)) }}>
          <svg width="280" height="280" viewBox="0 0 280 280">
            <circle cx="140" cy="140" r={R} fill="none" stroke="rgba(251,243,228,.15)" strokeWidth="18" />
            <circle cx="140" cy="140" r={R} fill="none" stroke={CORTEZA} strokeWidth="18" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - 0.357 * anillo)} transform="rotate(-90 140 140)" />
            <text x="140" y="156" textAnchor="middle" fill={PAPEL} style={{ fontFamily: TITULO, fontWeight: 800, fontSize: 54 }}>
              {(35.7 * anillo).toFixed(1).replace('.', ',')}%
            </text>
          </svg>
          <div>
            <Aparece desde={s(4)} dx={-30} dy={0}>
              <div style={{ fontFamily: CUERPO, fontSize: 32, lineHeight: 1.3, color: PAPEL, maxWidth: 440 }}>
                de los comercios tuvo excedente <b style={{ color: CORTEZA }}>todos los días</b> de la última semana
              </div>
            </Aparece>
          </div>
        </div>
      </div>
      <Subtitulo voz={[0.5, 4.99]} dur={8} claro texto="Al cierre, siempre sobra algo. Y lo que sobra, hoy se tira o se regala." />
    </AbsoluteFill>
  );
}

function Campo({ label, valor, desde, archivo }) {
  const f = useF();
  const n = Math.floor(interpolate(f, [desde, desde + s(0.8)], [0, valor.length], CL));
  const activo = f > desde;
  const sube = ease(f, desde, desde + 14);
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontFamily: CUERPO, fontSize: 18, color: GRIS, marginBottom: 6 }}>{label}</div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 58, padding: '0 18px',
        borderRadius: 12, border: `2px solid ${activo ? VERDE : LINEA}`, background: '#fff', fontFamily: CUERPO, fontSize: 24, color: TINTA, overflow: 'hidden' }}>
        {archivo && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${sube * 100}%`, background: MENTA }} />}
        <span style={{ position: 'relative' }}>{archivo ? (activo ? valor : 'Subir archivo') : valor.slice(0, n)}
          {!archivo && activo && n < valor.length && <span style={{ color: CORTEZA }}>|</span>}</span>
        {archivo && f > desde + 14 && <Check desde={desde + 14} size={28} />}
      </div>
    </div>
  );
}

// 2 · Alta: formulario que se completa solo, con pasos 1 → 2
function E2() {
  const f = useF();
  const plan = f > s(3.4) ? 1 : -1;
  const e = useSpring(4, { damping: 17 });
  const ver = ease(f, s(6.2), s(6.8));
  return (
    <AbsoluteFill>
      <FondoVivo semilla={1} />
      <div style={{ position: 'absolute', left: 140, top: 200, width: 760 }}>
        <Rotulo texto="Alta en la app" n="1" />
        <Cinetico texto="Sumarte es simple." tam={96} />
        <div style={{ marginTop: 50, display: 'flex', gap: 18, alignItems: 'center', fontFamily: CUERPO, fontWeight: 700, fontSize: 26 }}>
          {['Alta', 'Verificación'].map((p, i) => {
            const on = i === 0 ? ease(f, 10, 24) : ver;
            return (
              <React.Fragment key={p}>
                {i > 0 && <div style={{ width: 90, height: 4, background: LINEA, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${ver * 100}%`, height: '100%', background: CORTEZA }} /></div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: on > 0.5 ? BOSQUE : '#9AA79F' }}>
                  <span style={{ width: 46, height: 46, borderRadius: 23, display: 'grid', placeItems: 'center',
                    background: on > 0.5 ? VERDE : 'transparent', color: PAPEL, border: `2px solid ${on > 0.5 ? VERDE : LINEA}`,
                    transform: `scale(${0.9 + on * 0.1})` }}>{i + 1}</span>{p}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 1060, top: 120, width: 660, padding: '38px 42px', borderRadius: 28, background: '#FFFDF8',
        border: `1px solid ${LINEA}`, boxShadow: '0 40px 80px rgba(15,51,38,.16)',
        transform: `perspective(1400px) translateY(${(1 - e) * 160 + Math.sin(f / 26) * 6}px) rotateY(${(1 - e) * -18 - 4}deg) rotateX(${2 + Math.sin(f / 40)}deg)`, opacity: Math.min(1, e * 2) }}>
        <div style={{ fontFamily: TITULO, fontWeight: 800, fontSize: 38, color: BOSQUE, marginBottom: 24 }}>Sumá tu comercio</div>
        <Campo label="Nombre del local" valor="Panadería La Espiga" desde={s(0.9)} />
        <Campo label="Dirección" valor="Av. Maipú 1450, Olivos" desde={s(1.9)} />
        <div style={{ fontFamily: CUERPO, fontSize: 18, color: GRIS, marginBottom: 8 }}>Plan</div>
        <div style={{ position: 'relative', display: 'flex', gap: 10, marginBottom: 20 }}>
          {['Base', 'Smart', 'Intelligence'].map((p, i) => (
            <div key={p} style={{ flex: 1, height: 56, borderRadius: 12, display: 'grid', placeItems: 'center', fontFamily: CUERPO, fontWeight: 700, fontSize: 22,
              background: i === plan ? VERDE : '#fff', color: i === plan ? PAPEL : TINTA, border: `2px solid ${i === plan ? VERDE : LINEA}`,
              transform: `scale(${i === plan ? 1 + 0.06 * (1 - ease(f, s(3.4), s(3.4) + 10)) : 1})` }}>{p}</div>
          ))}
          <Toque x={50} y={50} en={s(3.4)} />
        </div>
        <Campo label="Habilitación municipal" valor="habilitacion.pdf" desde={s(4.3)} archivo />
        <Campo label="Carnet de manipulador" valor="carnet.jpg" desde={s(5.1)} archivo />
      </div>
      <Subtitulo voz={[0.5, 6.3]} dur={8} texto="Sumarte es simple: cargás los datos de tu local, elegís tu plan y subís tu habilitación y tu carnet de manipulador." />
    </AbsoluteFill>
  );
}

// Pantalla de la carta hecha en código (sin menú falso): botón → lectura → productos que se cargan
const CARTA = [
  ['Medialuna de manteca', '$1.000'], ['Medialuna de grasa', '$900'], ['Factura surtida', '$1.000'],
  ['Bizcochitos de grasa', '$900'], ['Pan de campo', '$4.500'], ['Pan francés', '$3.200'],
  ['Sándwich de miga', '$1.200'], ['Torta de chocolate', '$4.000'],
];
function PantallaCarta(fr) {
  const lee = fr > s(1.2);
  const lista = s(3);
  const prog = interpolate(fr, [s(1.3), lista], [0, 1], CL);
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '26px 22px', fontFamily: CUERPO, color: TINTA, background: PAPEL }}>
      <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Paso 2 de 3</div>
      <div style={{ fontFamily: TITULO, fontWeight: 800, fontSize: 30, color: BOSQUE }}>Cargá tu carta</div>
      {fr < lista ? (
        <>
          <div style={{ fontSize: 16, color: GRIS, margin: '8px 0 26px' }}>Sacale una foto a tu pizarra, menú impreso o lista de precios.</div>
          <div style={{ position: 'relative', height: 300, borderRadius: 22, border: `2px dashed ${lee ? VERDE : LINEA}`, display: 'grid', placeItems: 'center', overflow: 'hidden', background: '#FFFDF8' }}>
            {/* visor de cámara: esquinas + barrido de lectura */}
            {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([a, b], i) => (
              <div key={i} style={{ position: 'absolute', width: 36, height: 36, [a ? 'right' : 'left']: 16, [b ? 'bottom' : 'top']: 16,
                borderColor: VERDE, borderStyle: 'solid', borderWidth: `${b ? 0 : 4}px ${a ? 4 : 0}px ${b ? 4 : 0}px ${a ? 0 : 4}px`, borderRadius: 6 }} />
            ))}
            {lee && <div style={{ position: 'absolute', left: 20, right: 20, height: 3, background: CORTEZA, boxShadow: `0 0 18px ${CORTEZA}`,
              top: 20 + ((fr * 7) % 260) }} />}
            <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 18, color: VERDE }}>
              {lee ? 'Leyendo tu lista de precios…' : 'Apuntá a tu lista de precios'}
              {lee && <div style={{ margin: '14px auto 0', width: 180, height: 8, borderRadius: 4, background: LINEA, overflow: 'hidden' }}>
                <div style={{ width: `${prog * 100}%`, height: '100%', background: VERDE }} /></div>}
            </div>
          </div>
          <div style={{ position: 'relative', marginTop: 26, height: 60, borderRadius: 16, background: VERDE, color: PAPEL, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 18 }}>
            Sacarle foto a mi lista de precios
            <Toque x={50} y={50} en={s(1)} />
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0 16px', fontWeight: 700, fontSize: 17, color: VERDE }}>
            <Check desde={lista} size={24} /> Leí {Math.min(CARTA.length, Math.floor((fr - lista) / 4) + 1)} productos
          </div>
          {CARTA.map(([p, pr], i) => {
            const v = ease(fr, lista + i * 4, lista + i * 4 + 12);
            return (
              <div key={p} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 14px', marginBottom: 8, borderRadius: 12, background: '#fff',
                border: `1px solid ${LINEA}`, fontSize: 17, opacity: v, transform: `translateX(${(1 - v) * 60}px)` }}>
                <span>{p}</span><b>{pr}</b>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

function Kit({ desde }) {
  const items = [
    ['Bolsas', <path key="b" d="M10 18h28l-3 24H13zM17 18v-4a7 7 0 0114 0v4" />],
    ['Sticker', <g key="s"><circle cx="24" cy="26" r="15" /><path d="M17 26l5 5 9-10" /></g>],
    ['Cartel con QR', <g key="q"><rect x="9" y="11" width="30" height="30" rx="3" /><path d="M15 17h7v7h-7zM26 17h7v7h-7zM15 28h7v7h-7zM28 30h5M30 28v7" /></g>],
  ];
  return (
    <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
      {items.map(([t, ic], i) => (
        <Aparece key={t} desde={desde + i * 6}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px 14px 16px', borderRadius: 16, background: '#fff', border: `1px solid ${LINEA}`,
            fontFamily: CUERPO, fontWeight: 700, fontSize: 24, color: BOSQUE }}>
            <svg width="44" height="44" viewBox="0 0 48 52" fill="none" stroke={VERDE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">{ic}</svg>{t}
          </div>
        </Aparece>
      ))}
    </div>
  );
}

// 3 · Carta por foto
function E3() {
  return (
    <AbsoluteFill>
      <FondoVivo semilla={2} />
      <div style={{ position: 'absolute', left: 140, top: 200, width: 860 }}>
        <Rotulo texto="Tu carta, en una foto" n="2" />
        <Cinetico texto="Una foto a tu lista de precios. La carta se carga sola." tam={80} />
        <Kit desde={s(5)} />
      </div>
      <Celular tomas={[{ render: PantallaCarta, desde: 0 }]} desde={4} />
      <Subtitulo voz={[0.3, 7.89]} dur={8} texto="Le sacás una foto a tu lista de precios y la carta se carga sola. Te damos el primer lote de bolsas, el sticker y el cartel con QR." />
    </AbsoluteFill>
  );
}

// 4 · Foto del excedente: zoom desde la foto real hacia el celular, después la app detecta
function E4() {
  const f = useF();
  const intro = s(2.4);
  const zoom = interpolate(f, [0, intro], [1, 3.1], { ...CL, easing: Easing.in(Easing.cubic) });
  const fueraFoto = suave(f, intro - 10, intro + 6);
  const items = [['Medialuna de manteca', 5], ['Factura surtida', 2]];
  return (
    <AbsoluteFill>
      <FondoVivo semilla={3} />
      <div style={{ position: 'absolute', left: 140, top: 200, width: 860, opacity: ease(f, intro, intro + 12) }}>
        <Rotulo texto="Todos los días, al cierre" n="3" desde={intro} />
        <Cinetico texto="Sacás una foto. La app reconoce y cuenta lo que sobró." tam={80} desde={intro + 4} />
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {items.map(([p, c], i) => (
            <Aparece key={p} desde={s(8.6) + i * 6} dx={-40} dy={0}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 560, padding: '16px 22px', borderRadius: 14,
                background: '#fff', border: `1px solid ${LINEA}`, fontFamily: CUERPO, fontSize: 27, color: TINTA }}>
                <span>{p}</span><b style={{ fontFamily: TITULO, fontSize: 32 }}>× <Contador hasta={c} desde={s(8.8) + i * 6} dur={16} /></b>
              </div>
            </Aparece>
          ))}
          <Aparece desde={s(9.4)}><span style={{ display: 'inline-block', padding: '8px 16px', borderRadius: 999, background: '#F6E3CF', color: '#7A3D10',
            fontFamily: CUERPO, fontWeight: 700, fontSize: 21 }}>Estimado por IA · vos lo corregís</span></Aparece>
        </div>
      </div>
      <Celular desde={intro - 4} tomas={[
        { src: '08-camara.jpg', desde: 0, toque: { x: 50, y: 15, en: 4.4 } },
        { src: '09-analizando.jpg', desde: 4.6 },
        { src: '10-analizando-b.jpg', desde: 6.6 },
        { src: '11-tras-analisis.jpg', desde: 8.4 },
      ]} />
      {f < intro + 8 && (
        <AbsoluteFill style={{ opacity: 1 - fueraFoto, overflow: 'hidden' }}>
          <Img src={staticFile('foto-caja.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover',
            transformOrigin: '44% 50%', transform: `scale(${zoom})` }} />
        </AbsoluteFill>
      )}
      <Subtitulo voz={[0.5, 5.49]} dur={12} texto="Cuando sobra, sacás una foto. La app reconoce cada producto y cuenta cuántos hay." />
    </AbsoluteFill>
  );
}

// 5 · Revisás y publicás
function E5() {
  const f = useF();
  const pub = s(6.2);
  const burst = ease(f, pub + 10, pub + 30);
  return (
    <AbsoluteFill>
      <FondoVivo semilla={4} />
      <div style={{ position: 'absolute', left: 140, top: 200, width: 860 }}>
        <Rotulo texto="Revisás y publicás" n="4" />
        <Cinetico texto="La IA propone. Vos confirmás." tam={100} />
        <div style={{ marginTop: 44, display: 'flex', flexDirection: 'column', gap: 18, fontFamily: CUERPO, fontSize: 29, color: TINTA }}>
          {['La comida es del día', 'Respetaste la cadena de frío', 'Alérgenos revisados (vienen de tu carta)'].map((t, i) => (
            <Aparece key={t} desde={s(2.2) + i * 12} dx={-30} dy={0}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}><Check desde={s(2.2) + i * 12 + 4} />{t}</div>
            </Aparece>
          ))}
        </div>
      </div>
      <Celular tomas={[
        { src: '12-revisar-checklist.jpg', desde: 0, toque: { x: 50, y: 92.5, en: 5.8 } },
        { src: '13-publicado.jpg', desde: 6.2 },
      ]} />
      {/* estallido de confirmación alrededor del celular */}
      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: f > pub + 8 ? 1 - burst : 0 }}>
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2; const r1 = 250 + burst * 120; const r2 = r1 + 40;
          return <line key={i} x1={1425 + Math.cos(a) * r1} y1={540 + Math.sin(a) * r1} x2={1425 + Math.cos(a) * r2} y2={540 + Math.sin(a) * r2}
            stroke={i % 2 ? CORTEZA : VERDE} strokeWidth="6" strokeLinecap="round" />;
        })}
      </svg>
      <Subtitulo voz={[0.5, 7.55]} dur={10} texto="La app arma los packs, el precio y el horario. Vos revisás, confirmás y publicás. La decisión siempre es tuya." />
    </AbsoluteFill>
  );
}

// 6 · Venta y retiro
function E6() {
  const f = useF();
  const sello = useSpring(s(7.4), { damping: 9, mass: 0.6 });
  return (
    <AbsoluteFill>
      <FondoVivo semilla={5} />
      <div style={{ position: 'absolute', left: 140, top: 200, width: 860 }}>
        <Rotulo texto="Venta y retiro" n="5" />
        <Cinetico texto="Un vecino reserva, paga y lo retira con un QR." tam={84} />
        <div style={{ marginTop: 50, display: 'inline-block', padding: '22px 32px', borderRadius: 18, background: BOSQUE, color: PAPEL,
          fontFamily: TITULO, fontWeight: 800, fontSize: 48, transform: `scale(${sello}) rotate(${(1 - sello) * -8 - 1.5}deg)`, opacity: Math.min(1, sello * 2),
          boxShadow: `0 0 0 ${8 * (1 - ease(f, s(7.4), s(8.4)))}px rgba(224,122,46,.5)` }}>Pagás solo cuando vendés.</div>
      </div>
      <Celular tomas={[
        { src: '14-cliente-ve-pack.jpg', desde: 0, toque: { x: 61, y: 95, en: 2.8 } },
        { src: '16-reserva-qr.jpg', desde: 3.2 },
        { src: '17-retiros.jpg', desde: 6.4, toque: { x: 50, y: 9.5, en: 8 } },
        { src: '18-retiro-validado.jpg', desde: 8.4, toque: { x: 50, y: 78.5, en: 9.8 } },
      ]} />
      <Subtitulo voz={[0.5, 6.43]} dur={11} texto="Un vecino reserva y paga desde la app, y lo retira con un QR. Vos cobrás cada venta, sin abono fijo." />
    </AbsoluteFill>
  );
}

// Documento que sale del celular al descargar el informe
function Archivo({ desde }) {
  const e = useSpring(desde, { damping: 13, mass: 0.8 });
  const f = useF();
  if (f < desde) return null;
  return (
    <div style={{ position: 'absolute', left: 1200 - e * 1000, top: 620 - e * 80, width: 320, padding: '22px 22px 20px', borderRadius: 14, background: '#fff',
      boxShadow: '0 30px 60px rgba(15,51,38,.22)', transform: `rotate(${-10 * e + 4}deg) scale(${0.4 + e * 0.6})`, opacity: Math.min(1, e * 2), fontFamily: CUERPO }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ padding: '4px 10px', borderRadius: 6, background: CORTEZA, color: '#fff', fontWeight: 700, fontSize: 16 }}>PDF</span>
        <span style={{ fontWeight: 700, fontSize: 17, color: BOSQUE }}>Informe de noviembre</span>
      </div>
      {[90, 70, 82, 55].map((w, i) => <div key={i} style={{ height: 9, width: `${w}%`, borderRadius: 5, background: i === 0 ? '#B8D8BE' : '#EEE6D8', marginBottom: 9 }} />)}
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 50, marginTop: 6 }}>
        {[0.6, 0.8, 0.5, 0.9, 0.7].map((h, i) => <div key={i} style={{ flex: 1, height: `${h * 100 * ease(f, desde + 10 + i * 3, desde + 22 + i * 3)}%`, borderRadius: 3, background: i === 3 ? VERDE : '#B8D8BE' }} />)}
      </div>
      <div style={{ fontSize: 14, color: GRIS, marginTop: 10 }}>aprovecho-la-espiga-2026-11.pdf</div>
    </div>
  );
}

// 7 · Panel: barras y contadores animados
function E7() {
  const f = useF();
  const barras = [1.7, 1.4, 1.2, 1.8, 1.3, 1.9, 0.6];
  return (
    <AbsoluteFill>
      <FondoVivo semilla={6} />
      <div style={{ position: 'absolute', left: 140, top: 200, width: 860 }}>
        <Rotulo texto="Tu panel" n="6" />
        <Cinetico texto="Plata recuperada, kilos rescatados y tu Score. Y tus informes." tam={80} />
        <div style={{ marginTop: 44, display: 'flex', gap: 40, alignItems: 'flex-end', opacity: 1 - ease(f, s(9.6), s(10.2)), transform: `translateY(${ease(f, s(9.6), s(10.2)) * 30}px)` }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 170 }}>
            {barras.map((b, i) => {
              const v = useSpring(s(1.8) + i * 4, { damping: 14 });
              return <div key={i} style={{ width: 34, height: (b / 2) * 170 * v, borderRadius: 6, background: i === 5 ? VERDE : '#B8D8BE' }} />;
            })}
          </div>
          <div style={{ fontFamily: CUERPO, color: TINTA }}>
            <div style={{ fontFamily: TITULO, fontWeight: 800, fontSize: 64, color: BOSQUE }}><Contador hasta={11.4} dec={1} desde={s(2.4)} dur={36} suf=" kg" /></div>
            <div style={{ fontSize: 22, color: GRIS }}>recuperados esta semana</div>
            <div style={{ marginTop: 14, display: 'flex', gap: 10, opacity: ease(f, s(4), s(4.6)) }}>
              <span style={{ padding: '7px 14px', borderRadius: 999, background: MENTA, color: VERDE, fontWeight: 700, fontSize: 19 }}>Medido</span>
              <span style={{ padding: '7px 14px', borderRadius: 999, background: '#F6E3CF', color: '#7A3D10', fontWeight: 700, fontSize: 19 }}>Estimado</span>
            </div>
          </div>
        </div>
      </div>
      <Celular tomas={[
        { src: '20-impacto.jpg', desde: 0, toque: { x: 88, y: 3.6, en: 5.6 } },
        { src: '21-reporte.jpg', desde: 6, toque: { x: 72, y: 53, en: 7.6 } },
        { src: '22-reporte-pdf.jpg', desde: 8, toque: { x: 50, y: 71.5, en: 9.4 } },
        { src: '24-reporte-listo.jpg', desde: 9.8 },
      ]} />
      <Archivo desde={s(10.2)} />
      <div style={{ position: 'absolute', right: 120, top: 46, fontFamily: CUERPO, fontSize: 18, color: '#7C8A82' }}>Datos de ejemplo</div>
      <Subtitulo voz={[0.5, 8.28]} dur={13} texto="Cada venta suma a tu panel: plata recuperada, kilos rescatados y tu Score. Y cuando quieras, descargás tu informe en Excel o PDF." />
    </AbsoluteFill>
  );
}

function Pantalla({ src, x, y, w, desde = 0, web = false, giro = 0 }) {
  const f = useF();
  const e = useSpring(desde, { damping: 16 });
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, padding: web ? 10 : 16, borderRadius: web ? 14 : 30, background: TINTA,
      boxShadow: '0 40px 80px rgba(15,51,38,.25)', opacity: Math.min(1, e * 2),
      transform: `perspective(1600px) translate(${(1 - e) * 160}px, ${Math.sin((f + desde) / 30) * 8}px) rotateY(${giro + (1 - e) * -20}deg)` }}>
      <Img src={staticFile(`onboarding/${src}`)} style={{ display: 'block', width: '100%', borderRadius: web ? 6 : 16 }} />
    </div>
  );
}

// 8 · Escalera de planes
function E8() {
  const f = useF();
  const activo = f < s(3) ? 0 : f < s(6) ? 1 : 2;
  return (
    <AbsoluteFill>
      <FondoVivo semilla={7} />
      <div style={{ position: 'absolute', left: 140, top: 200, width: 640 }}>
        <Rotulo texto="Cuando quieras más" n="7" />
        <Cinetico texto="Medí más. Anticipá cuánto producir." tam={76} />
        <div style={{ position: 'relative', marginTop: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ position: 'absolute', left: 0, right: 0, height: 74, top: activo * 88, borderRadius: 14, background: BOSQUE,
            transition: 'none', transform: `translateY(${0}px)` }} />
          {[['Base', 'Recuperá', 'Con una foto del celular'], ['Smart', 'Medí', 'Balanza + tablet: peso real'], ['Intelligence', 'Anticipá', 'Por qué sobra y cuánto producir']].map(([p, v, d], i) => (
            <Aparece key={p} desde={10 + i * 5} dx={-30} dy={0}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 20, height: 74, padding: '0 24px', borderRadius: 14,
                border: `1px solid ${i === activo ? BOSQUE : LINEA}`, background: i === activo ? 'transparent' : '#fff', color: i === activo ? PAPEL : TINTA, fontFamily: CUERPO }}>
                <strong style={{ fontFamily: TITULO, fontSize: 30, width: 200 }}>{p}</strong>
                <span style={{ fontSize: 22 }}><b>{v}.</b> {d}</span>
              </div>
            </Aparece>
          ))}
        </div>
      </div>
      <Pantalla src="03-smart.png" x={800} y={90} w={1020} desde={s(2.6)} giro={-6} />
      <Pantalla src="04-intelligence.png" x={880} y={330} w={990} desde={s(5.6)} web giro={-6} />
      <Subtitulo voz={[0.5, 6.9]} dur={10} texto="Y si querés medir más, sumás la estación Smart. Con Intelligence, entendés por qué sobra y cuánto conviene producir." />
    </AbsoluteFill>
  );
}

// 9 · Cierre: anillo que se dibuja alrededor del sello
function E9() {
  const f = useF();
  const sc = useSpring(4, { damping: 12 });
  const anillo = ease(f, 0, 30);
  const C = 2 * Math.PI * 190;
  return (
    <AbsoluteFill>
      <FondoVivo oscuro semilla={8} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ position: 'relative', width: 400, height: 400, display: 'grid', placeItems: 'center' }}>
          <svg width="400" height="400" style={{ position: 'absolute', inset: 0 }}>
            <circle cx="200" cy="200" r="190" fill="none" stroke={CORTEZA} strokeWidth="5" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - anillo)} transform={`rotate(${-90 + f * 1.5} 200 200)`} />
          </svg>
          <Img src={staticFile('onboarding/logo-sello.png')} style={{ width: 300, transform: `scale(${0.7 + sc * 0.3}) rotate(${(1 - sc) * -20}deg)`, opacity: Math.min(1, sc * 2) }} />
        </div>
        <div style={{ marginTop: 30 }}><Cinetico texto="Menos desperdicio, más aprovecho." tam={64} color={PAPEL} desde={14} /></div>
        <Aparece desde={34}>
          <div style={{ marginTop: 30, padding: '20px 44px', borderRadius: 999, background: CORTEZA, color: BOSQUE, fontFamily: CUERPO, fontWeight: 700, fontSize: 34 }}>Sumá tu comercio</div>
        </Aparece>
        <div style={{ position: 'absolute', bottom: 28, fontFamily: CUERPO, fontSize: 15, color: 'rgba(251,243,228,.5)' }}>Música: “Daily Beetle”, Kevin MacLeod (incompetech.com) · CC BY 4.0</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

// ---------- Montaje con transiciones ----------
function Empuje({ children }) {
  const f = useFrameReal();
  const z = 1 + Math.min(f, 300) * 0.00012;
  return <AbsoluteFill style={{ transform: `scale(${z})` }}>{children}</AbsoluteFill>;
}

const T = 12; // frames de cada transición
const ESCENAS = [
  // [escena, segundos reales] · el reloj interno se acelera para que entre todo (ORIG / real)
  [E1, 6], [E2, 7], [E3, 8.6], [E4, 7.4], [E5, 8.4], [E6, 7.4], [E7, 9.2], [E8, 7.8], [E9, 4.6],
];
const ORIG = [8, 8, 8, 12, 10, 11, 13, 10, 5];
const TRANS = [
  () => wipe({ direction: 'from-left' }),
  () => slide({ direction: 'from-right' }),
  () => fade(),
  () => slide({ direction: 'from-bottom' }),
  () => slide({ direction: 'from-right' }),
  () => wipe({ direction: 'from-right' }),
  () => slide({ direction: 'from-right' }),
  () => fade(),
];

// Voz en off (ElevenLabs, voz "Chelo"): [segundo de entrada dentro de la escena, duración]
const VOZ = [[0.4, 4.99], [0.35, 6.3], [0.25, 7.89], [1.2, 5.49], [0.35, 7.55], [0.35, 6.43], [0.35, 8.28], [0.35, 6.9], [0.35, 3.74]];
const INICIOS = ESCENAS.reduce((acc, [, seg], i) => [...acc, i ? acc[i - 1] + ESCENAS[i - 1][1] : 0], []);

export function Onboarding() {
  // cada escena se alarga lo que se come la transición, así el total sigue en 85 s
  return (
    <AbsoluteFill style={{ background: PAPEL }}>
      {/* Música: "Daily Beetle", Kevin MacLeod (incompetech.com), CC BY 4.0 — crédito en video/CREDITOS.md */}
      <Audio src={staticFile('musica/daily-beetle.mp3')} volume={(f) => {
        const total = Math.round(DURACION_ONB * FPS);
        const entra = interpolate(f, [0, 12], [0, 1], CL);
        const sale = interpolate(f, [total - 60, total], [1, 0], CL);
        const t = f / FPS;
        const hablando = VOZ.some(([ini, d], i) => t > INICIOS[i] + ini - 0.15 && t < INICIOS[i] + ini + d + 0.1);
        return entra * sale * (hablando ? 0.2 : 0.42);
      }} />
      {VOZ.map(([ini], i) => (
        <Sequence key={'v' + i} from={s(INICIOS[i] + ini)}><Audio src={staticFile(`voz/v${i + 1}.mp3`)} /></Sequence>
      ))}
      <TransitionSeries>
        {ESCENAS.map(([C, seg], i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={s(seg) + (i < ESCENAS.length - 1 ? T : 0)}>
              <Vel.Provider value={Math.max(1, ORIG[i] / seg)}><Empuje><C /></Empuje></Vel.Provider>
            </TransitionSeries.Sequence>
            {i < ESCENAS.length - 1 && (
              <TransitionSeries.Transition presentation={TRANS[i]()} timing={springTiming({ config: { damping: 200 }, durationInFrames: T })} />
            )}
          </React.Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
}
