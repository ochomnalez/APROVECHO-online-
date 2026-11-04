// Video 1 · Onboarding para comercios (guion: video/01-onboarding/guion.md)
// 1920×1080 · 30 fps · 85 s. Sin voz todavía: la voz en off va como subtítulo.
// Regla D-031: no mostrar el 75% ni el 25% (las capturas se encuadran para ocultarlos).
import React from 'react';
import {
  AbsoluteFill, Easing, Img, Sequence, continueRender, delayRender, interpolate,
  spring, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';

const BOSQUE = '#0F3326';
const VERDE = '#1A4D3A';
const PAPEL = '#FBF3E4';
const MENTA = '#DFFFD6';
const CORTEZA = '#E07A2E';
const TINTA = '#14281F';
const LINEA = '#D9CBB4';
const TITULO = '"Bricolage Grotesque", Georgia, serif';
const CUERPO = '"Atkinson Hyperlegible", "Trebuchet MS", sans-serif';
export const FPS = 30;
export const DURACION_ONB = 85;

// ---- Fuentes locales (paquetes @fontsource, sin red) ----
const fuentes = [
  ['Bricolage Grotesque', 800, 'fuentes/bricolage-800.woff2'],
  ['Bricolage Grotesque', 700, 'fuentes/bricolage-700.woff2'],
  ['Atkinson Hyperlegible', 400, 'fuentes/atkinson-400.woff2'],
  ['Atkinson Hyperlegible', 700, 'fuentes/atkinson-700.woff2'],
];
if (typeof document !== 'undefined') {
  const h = delayRender('fuentes');
  Promise.all(fuentes.map(([f, w, src]) => {
    const ff = new FontFace(f, `url(${staticFile(src)})`, { weight: String(w) });
    return ff.load().then((x) => document.fonts.add(x));
  })).then(() => continueRender(h)).catch(() => continueRender(h));
}

const s = (seg) => Math.round(seg * FPS);
const ease = (f, a, b) => interpolate(f, [a, b], [0, 1], {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
});

// ---- Piezas ----
function Entra({ desde = 0, children, dy = 24 }) {
  const f = useCurrentFrame();
  const v = ease(f, desde, desde + 16);
  return <div style={{ opacity: v, transform: `translateY(${(1 - v) * dy}px)` }}>{children}</div>;
}

function Paso({ n, texto, claro = false }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 14, fontFamily: CUERPO, fontWeight: 700,
      fontSize: 24, letterSpacing: 2.4, textTransform: 'uppercase', color: claro ? MENTA : VERDE,
    }}>
      {n != null && (
        <span style={{
          width: 44, height: 44, borderRadius: 22, background: CORTEZA, color: BOSQUE,
          display: 'grid', placeItems: 'center', fontSize: 22, letterSpacing: 0,
        }}>{n}</span>
      )}
      {texto}
    </div>
  );
}

function Titular({ children, claro = false, tam = 84 }) {
  return (
    <h1 style={{
      fontFamily: TITULO, fontWeight: 800, fontSize: tam, lineHeight: 1.02, letterSpacing: -1.5,
      margin: '26px 0 0', color: claro ? PAPEL : BOSQUE, textWrap: 'balance',
    }}>{children}</h1>
  );
}

function Etiqueta({ children, tono = 'estimado' }) {
  const c = tono === 'estimado' ? { bg: '#F6E3CF', fg: '#7A3D10' } : { bg: MENTA, fg: VERDE };
  return (
    <span style={{
      display: 'inline-block', padding: '8px 16px', borderRadius: 999, background: c.bg, color: c.fg,
      fontFamily: CUERPO, fontWeight: 700, fontSize: 22,
    }}>{children}</span>
  );
}

// Subtítulo = voz en off (hasta grabar la voz)
function Subtitulo({ texto, claro = false }) {
  const f = useCurrentFrame();
  const v = ease(f, 6, 20);
  return (
    <div style={{
      position: 'absolute', left: 140, width: 960, bottom: 64, display: 'flex', justifyContent: 'flex-start',
      opacity: v,
    }}>
      <div style={{
        maxWidth: 960, padding: '14px 24px', borderRadius: 10, textAlign: 'left',
        background: claro ? 'rgba(15,51,38,.86)' : 'rgba(20,40,31,.9)', color: PAPEL,
        fontFamily: CUERPO, fontSize: 30, lineHeight: 1.3,
      }}>{texto}</div>
    </div>
  );
}

// Celular con capturas que se suceden. Cada toma: {src, desde (seg relativos), zoom, ancla}
function Celular({ tomas, x = 1250, y = 120 }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrada = spring({ frame: f, fps, config: { damping: 18, mass: 0.8 } });
  const W = 400, H = 838, R = 50, B = 13;
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: W, height: H, borderRadius: R, background: TINTA,
      padding: B, boxShadow: '0 40px 80px rgba(15,51,38,.25), 0 8px 18px rgba(15,51,38,.18)',
      transform: `translateY(${(1 - entrada) * 60}px)`, opacity: entrada,
    }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: R - B, overflow: 'hidden', background: PAPEL }}>
        {tomas.map((t, i) => {
          const d = s(t.desde || 0);
          const sig = tomas[i + 1] ? s(tomas[i + 1].desde) : 1e9;
          const op = Math.min(ease(f, d, d + 10), 1 - ease(f, sig, sig + 10));
          if (op <= 0) return null;
          const z = t.zoom || 1;
          const pan = t.panA != null ? interpolate(f, [d, sig === 1e9 ? d + s(8) : sig], [t.panA, t.panB], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : null;
          return (
            <Img key={i} src={staticFile(`onboarding/${t.src}`)} style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
              objectPosition: pan != null ? `50% ${pan}%` : (t.ancla || '50% 0%'),
              transform: `scale(${z})`, transformOrigin: pan != null ? `50% ${pan}%` : (t.ancla || '50% 0%'), opacity: op,
            }} />
          );
        })}
      </div>
    </div>
  );
}

function Escena({ children, fondo = PAPEL }) {
  return <AbsoluteFill style={{ background: fondo, overflow: 'hidden' }}>{children}</AbsoluteFill>;
}

function Columna({ children, ancho = 860 }) {
  return <div style={{ position: 'absolute', left: 140, top: 190, width: ancho }}>{children}</div>;
}

function Check({ color = VERDE }) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" style={{ flex: 'none' }}>
      <circle cx="13" cy="13" r="12" fill={color} />
      <path d="M7.5 13.5l3.6 3.4 7.4-8" stroke={PAPEL} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---- Escenas ----
function E1() {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, s(8)], [1.08, 1.0]);
  return (
    <Escena fondo={BOSQUE}>
      <Img src={staticFile('foto-caja.jpg')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})` }} />
      <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(15,51,38,.92) 0%, rgba(15,51,38,.72) 38%, rgba(15,51,38,0) 70%)' }} />
      <Columna ancho={820}>
        <Entra><Paso texto="Para comercios de comida" claro /></Entra>
        <Entra desde={6}><Titular claro tam={96}>Al cierre, siempre sobra algo.</Titular></Entra>
        <Entra desde={s(2.5)}>
          <div style={{ marginTop: 56, display: 'flex', alignItems: 'baseline', gap: 22, color: PAPEL }}>
            <span style={{ fontFamily: TITULO, fontWeight: 800, fontSize: 120, color: CORTEZA, letterSpacing: -2 }}>35,7%</span>
            <span style={{ fontFamily: CUERPO, fontSize: 30, lineHeight: 1.3, maxWidth: 400 }}>tuvo excedente todos los días de la última semana</span>
          </div>
          <div style={{ fontFamily: CUERPO, fontSize: 20, color: '#B9D3C4', marginTop: 10 }}>Fuente: encuesta propia a comercios · APROVECHO 2026</div>
        </Entra>
      </Columna>
      <Subtitulo claro texto="Al cierre, siempre sobra algo. Y lo que sobra, hoy se tira o se regala." />
    </Escena>
  );
}

function Campo({ label, valor, desde, ok }) {
  const f = useCurrentFrame();
  const n = Math.floor(interpolate(f, [desde, desde + s(0.9)], [0, valor.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: CUERPO, fontSize: 19, color: '#5E6F66', marginBottom: 6 }}>{label}</div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62, padding: '0 20px',
        borderRadius: 12, border: `2px solid ${f > desde ? VERDE : LINEA}`, background: '#fff',
        fontFamily: CUERPO, fontSize: 25, color: TINTA,
      }}>
        <span>{ok ? (f > desde ? valor : '') : valor.slice(0, n)}</span>
        {ok && f > desde + 8 && <Check />}
      </div>
    </div>
  );
}

function E2() {
  const f = useCurrentFrame();
  const plan = f > s(3.6) ? 'Smart' : 'Base';
  return (
    <Escena>
      <Columna ancho={760}>
        <Entra><Paso n="1" texto="Alta · 2 Verificación" /></Entra>
        <Entra desde={6}><Titular>Sumarte es simple.</Titular></Entra>
        <Entra desde={14}>
          <p style={{ fontFamily: CUERPO, fontSize: 32, lineHeight: 1.35, color: TINTA, marginTop: 30 }}>
            Cargás los datos de tu local, elegís tu plan y subís tu habilitación y tu carnet de manipulador.
          </p>
        </Entra>
      </Columna>
      <div style={{
        position: 'absolute', left: 1040, top: 110, width: 700, padding: '40px 44px', borderRadius: 28,
        background: '#FFFDF8', border: `1px solid ${LINEA}`, boxShadow: '0 30px 70px rgba(15,51,38,.14)',
        opacity: ease(f, 4, 18), transform: `translateY(${(1 - ease(f, 4, 18)) * 40}px)`,
      }}>
        <div style={{ fontFamily: TITULO, fontWeight: 800, fontSize: 40, color: BOSQUE, marginBottom: 26 }}>Sumá tu comercio</div>
        <Campo label="Nombre del local" valor="Panadería La Espiga" desde={s(0.8)} />
        <Campo label="Dirección" valor="Av. Olivos 1450, Olivos" desde={s(1.9)} />
        <div style={{ fontFamily: CUERPO, fontSize: 19, color: '#5E6F66', marginBottom: 8 }}>Plan</div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 22 }}>
          {['Base', 'Smart', 'Intelligence'].map((p) => (
            <div key={p} style={{
              flex: 1, height: 58, borderRadius: 12, display: 'grid', placeItems: 'center',
              fontFamily: CUERPO, fontWeight: 700, fontSize: 23,
              background: p === plan && f > s(3) ? VERDE : '#fff', color: p === plan && f > s(3) ? PAPEL : TINTA,
              border: `2px solid ${p === plan && f > s(3) ? VERDE : LINEA}`,
            }}>{p}</div>
          ))}
        </div>
        <Campo label="Habilitación municipal" valor="habilitacion.pdf" desde={s(4.6)} ok />
        <Campo label="Carnet de manipulador" valor="carnet.jpg" desde={s(5.4)} ok />
      </div>
      <Subtitulo texto="Sumarte es simple: cargás los datos de tu local, elegís tu plan y subís tu habilitación y tu carnet de manipulador." />
    </Escena>
  );
}

function E3() {
  return (
    <Escena>
      <Columna>
        <Entra><Paso n="3" texto="Tu carta · 4 Arranque" /></Entra>
        <Entra desde={6}><Titular>Una foto a tu lista de precios. La carta se carga sola.</Titular></Entra>
        <Entra desde={s(4)}>
          <p style={{ fontFamily: CUERPO, fontSize: 30, lineHeight: 1.4, color: TINTA, marginTop: 34, maxWidth: 760 }}>
            Sirve la pizarra, el menú impreso o una captura. Después te damos las bolsas, el sticker y el cartel con QR.
          </p>
        </Entra>
      </Columna>
      <Celular tomas={[{ src: '05-carta-cargada.jpg', desde: 0 }, { src: '04-carta.jpg', desde: 2.6 }]} />
      <Subtitulo texto="Le sacás una foto a tu lista de precios y la carta se carga sola. Te damos el primer lote de bolsas, el sticker y el cartel con QR." />
    </Escena>
  );
}

function E4() {
  const f = useCurrentFrame();
  return (
    <Escena>
      <Columna>
        <Entra><Paso texto="Todos los días, al cierre" /></Entra>
        <Entra desde={6}><Titular>Sacás una foto. La app reconoce y cuenta lo que sobró.</Titular></Entra>
        <Entra desde={s(6)}>
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[['Medialuna de manteca', '5 u'], ['Factura surtida', '2 u']].map(([p, c], i) => (
              <div key={p} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 600,
                padding: '18px 24px', borderRadius: 14, background: '#fff', border: `1px solid ${LINEA}`,
                fontFamily: CUERPO, fontSize: 28, color: TINTA, opacity: ease(f, s(6.4 + i * 0.5), s(6.4 + i * 0.5) + 12),
              }}><span>{p}</span><strong style={{ fontFamily: TITULO, fontSize: 32 }}>{c}</strong></div>
            ))}
            <div style={{ marginTop: 6 }}><Etiqueta>Estimado por IA</Etiqueta></div>
          </div>
        </Entra>
      </Columna>
      <Celular tomas={[
        { src: '08-camara.jpg', desde: 0 },
        { src: '09-analizando.jpg', desde: 3 },
        { src: '10-analizando-b.jpg', desde: 6.5 },
        { src: '11-tras-analisis.jpg', desde: 9.5 },
      ]} />
      <Subtitulo texto="Cuando sobra, sacás una foto. La app reconoce cada producto y cuenta cuántos hay." />
    </Escena>
  );
}

function E5() {
  return (
    <Escena>
      <Columna>
        <Entra><Paso texto="Revisás y publicás" /></Entra>
        <Entra desde={6}><Titular tam={96}>La IA propone. Vos confirmás.</Titular></Entra>
        <Entra desde={s(2)}>
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 18, fontFamily: CUERPO, fontSize: 30, color: TINTA }}>
            {['La comida es del día', 'Respetaste la cadena de frío', 'Alérgenos revisados (vienen precargados)'].map((t) => (
              <div key={t} style={{ display: 'flex', gap: 16, alignItems: 'center' }}><Check />{t}</div>
            ))}
          </div>
        </Entra>
      </Columna>
      {/* La línea de comisión se borró de la captura (D-031) */}
      <Celular tomas={[
        { src: '12-revisar-checklist.jpg', desde: 0 },
        { src: '13-publicado.jpg', desde: 6.5 },
      ]} />
      <Subtitulo texto="La app arma los packs, el precio y el horario. Vos revisás, confirmás y publicás. La decisión siempre es tuya." />
    </Escena>
  );
}

function E6() {
  return (
    <Escena>
      <Columna>
        <Entra><Paso texto="Venta y retiro" /></Entra>
        <Entra desde={6}><Titular>Un vecino reserva, paga y lo retira con un QR.</Titular></Entra>
        <Entra desde={s(6)}>
          <div style={{
            marginTop: 44, display: 'inline-block', padding: '22px 30px', borderRadius: 16, background: BOSQUE, color: PAPEL,
            fontFamily: TITULO, fontWeight: 800, fontSize: 46,
          }}>Pagás solo cuando vendés.</div>
        </Entra>
      </Columna>
      <Celular tomas={[
        { src: '14-cliente-ve-pack.jpg', desde: 0 },
        { src: '16-reserva-qr.jpg', desde: 3.6 },
        { src: '17-retiros.jpg', desde: 7 },
        { src: '18-retiro-validado.jpg', desde: 9 },
      ]} />
      <Subtitulo texto="Un vecino reserva y paga desde la app, y lo retira con un QR. Vos cobrás cada venta, sin abono fijo." />
    </Escena>
  );
}

function E7() {
  return (
    <Escena>
      <Columna>
        <Entra><Paso texto="Tu panel" /></Entra>
        <Entra desde={6}><Titular>Plata recuperada, kilos rescatados y tu Score.</Titular></Entra>
        <Entra desde={s(2.5)}>
          <div style={{ marginTop: 40, display: 'flex', gap: 14 }}>
            <Etiqueta tono="medido">Medido</Etiqueta><Etiqueta>Estimado</Etiqueta>
          </div>
          <p style={{ fontFamily: CUERPO, fontSize: 26, color: '#5E6F66', marginTop: 18, maxWidth: 640 }}>
            Siempre separamos lo que se midió de lo que se estimó.
          </p>
        </Entra>
      </Columna>
      {/* La línea de comisión se borró de la captura (D-031) */}
      <Celular tomas={[{ src: '20-impacto.jpg', desde: 0 }]} />
      <div style={{ position: 'absolute', right: 120, top: 40, fontFamily: CUERPO, fontSize: 18, color: '#7C8A82' }}>Datos de ejemplo</div>
      <Subtitulo texto="Cada venta suma a tu panel: plata recuperada, kilos rescatados y tu Score." />
    </Escena>
  );
}

function Pantalla({ src, x, y, w, desde = 0, marco = 'tablet' }) {
  const f = useCurrentFrame();
  const v = ease(f, desde, desde + 18);
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: w, padding: marco === 'tablet' ? 16 : 10,
      borderRadius: marco === 'tablet' ? 30 : 14, background: TINTA,
      boxShadow: '0 30px 70px rgba(15,51,38,.22)', opacity: v, transform: `translateY(${(1 - v) * 40}px)`,
    }}>
      <Img src={staticFile(`onboarding/${src}`)} style={{ display: 'block', width: '100%', borderRadius: marco === 'tablet' ? 16 : 6 }} />
    </div>
  );
}

function E8() {
  const f = useCurrentFrame();
  const activo = f < s(3) ? 0 : f < s(6) ? 1 : 2;
  return (
    <Escena>
      <Columna ancho={640}>
        <Entra><Paso texto="Cuando quieras más" /></Entra>
        <Entra desde={6}><Titular tam={76}>Medí más. Anticipá cuánto producir.</Titular></Entra>
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[['Base', 'Recuperá', 'Con una foto del celular'], ['Smart', 'Medí', 'Balanza + tablet: peso real'], ['Intelligence', 'Anticipá', 'Por qué sobra y cuánto producir']].map(([p, v, d], i) => (
            <div key={p} style={{
              display: 'flex', alignItems: 'center', gap: 20, padding: '18px 24px', borderRadius: 14,
              background: i === activo ? BOSQUE : '#fff', color: i === activo ? PAPEL : TINTA,
              border: `1px solid ${i === activo ? BOSQUE : LINEA}`, fontFamily: CUERPO,
            }}>
              <strong style={{ fontFamily: TITULO, fontSize: 32, width: 210 }}>{p}</strong>
              <span style={{ fontSize: 24 }}><b>{v}.</b> {d}</span>
            </div>
          ))}
        </div>
      </Columna>
      <Pantalla src="03-smart.png" x={880} y={150} w={900} desde={s(2.6)} />
      <Pantalla src="04-intelligence.png" x={980} y={360} w={860} desde={s(5.6)} marco="web" />
      <Subtitulo texto="Y si querés medir más, sumás la estación Smart. Con Intelligence, entendés por qué sobra y cuánto conviene producir." />
    </Escena>
  );
}

function E9() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sc = spring({ frame: f, fps, config: { damping: 14 } });
  return (
    <Escena fondo={BOSQUE}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Img src={staticFile('onboarding/logo-sello.png')} style={{ width: 280, transform: `scale(${0.85 + sc * 0.15})`, opacity: sc }} />
        <div style={{ fontFamily: TITULO, fontWeight: 800, fontSize: 64, color: PAPEL, marginTop: 40, opacity: ease(f, 10, 26) }}>
          Menos desperdicio, más aprovecho.
        </div>
        <div style={{
          marginTop: 34, padding: '20px 40px', borderRadius: 999, background: CORTEZA, color: BOSQUE,
          fontFamily: CUERPO, fontWeight: 700, fontSize: 34, opacity: ease(f, 24, 40),
        }}>Sumá tu comercio</div>
      </AbsoluteFill>
    </Escena>
  );
}

const ESCENAS = [
  [E1, 0, 8], [E2, 8, 16], [E3, 16, 24], [E4, 24, 38], [E5, 38, 48],
  [E6, 48, 60], [E7, 60, 70], [E8, 70, 80], [E9, 80, 85],
];

function Progreso() {
  const f = useCurrentFrame();
  const t = f / FPS;
  if (t >= 80) return null;
  return (
    <div style={{ position: 'absolute', left: 140, right: 140, top: 70, display: 'flex', gap: 8 }}>
      {ESCENAS.slice(0, 8).map(([, a, b], i) => {
        const p = Math.max(0, Math.min(1, (t - a) / (b - a)));
        return (
          <div key={i} style={{ flex: b - a, height: 4, borderRadius: 2, background: t < 8 ? 'rgba(251,243,228,.3)' : LINEA, overflow: 'hidden' }}>
            <div style={{ width: `${p * 100}%`, height: '100%', background: CORTEZA }} />
          </div>
        );
      })}
    </div>
  );
}

export function Onboarding() {
  return (
    <AbsoluteFill style={{ background: PAPEL }}>
      {ESCENAS.map(([C, a, b], i) => (
        <Sequence key={i} from={s(a)} durationInFrames={s(b - a)}><C /></Sequence>
      ))}
      <Progreso />
    </AbsoluteFill>
  );
}
