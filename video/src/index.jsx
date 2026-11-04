import React from 'react';
import { Onboarding, DURACION_ONB } from './Onboarding.jsx';
import {
  AbsoluteFill, Composition, Easing, Img, Sequence, interpolate, registerRoot,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';

const VERDE = '#1A4D3A';
const BOSQUE = '#0F3326';
const PAPEL = '#FBF3E4';
const MENTA = '#DFFFD6';
const CORTEZA = '#E07A2E';
const TINTA = '#14281F';
const TITULO = '"Bricolage Grotesque", "Trebuchet MS", system-ui, sans-serif';
const CUERPO = '"Atkinson Hyperlegible", "Trebuchet MS", system-ui, sans-serif';
const FPS = 30;
const DURACION = 24;

function revelar(frame, desde = 0, duracion = 14) {
  return interpolate(frame, [desde, desde + duracion], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
}

function Placa({ paso, oscuro = false, children }) {
  const fondo = oscuro ? BOSQUE : PAPEL;
  const texto = oscuro ? PAPEL : TINTA;
  const linea = oscuro ? '#608573' : '#B9A992';
  return (
    <AbsoluteFill style={{ backgroundColor: fondo, color: texto, fontFamily: CUERPO }}>
      <div style={{
        position: 'absolute', left: 74, right: 138, top: 150, paddingBottom: 28,
        borderBottom: `2px solid ${linea}`, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', fontSize: 28, letterSpacing: 2.5, fontWeight: 800,
      }}>
        <span>APROVECHO</span>
        <span style={{ fontSize: 25, fontWeight: 600, letterSpacing: 1.8 }}>PARA COMERCIOS</span>
      </div>
      {children}
      <div style={{ position: 'absolute', left: 74, right: 138, top: 1496, display: 'flex', gap: 10 }}>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} style={{
            flex: 1, height: 5, backgroundColor: i === paso ? CORTEZA : linea,
            opacity: i <= paso ? 1 : 0.42,
          }} />
        ))}
      </div>
    </AbsoluteFill>
  );
}

function Titular({ lineas, bajada, oscuro = false, tam = 100 }) {
  const frame = useCurrentFrame();
  const entrada = revelar(frame, 0, 12);
  return (
    <div style={{
      position: 'absolute', top: 256, left: 74, right: 125,
      opacity: 0.55 + entrada * 0.45, transform: `translateY(${(1 - entrada) * 18}px)`,
    }}>
      <div style={{
        marginBottom: 16, fontSize: 29, fontWeight: 800, letterSpacing: 2.6,
        color: oscuro ? MENTA : VERDE, textTransform: 'uppercase',
      }}>{bajada}</div>
      <h1 style={{
        margin: 0, fontFamily: TITULO, fontSize: tam, lineHeight: 0.99,
        letterSpacing: -4.8, fontWeight: 800,
      }}>
        {lineas.map(linea => <span style={{ display: 'block' }} key={linea}>{linea}</span>)}
      </h1>
    </div>
  );
}

function Toma({ archivo, alt, top, height, imagen, children }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames - 1], [1, 1.045], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{
      position: 'absolute', left: 74, right: 138, top, height,
      overflow: 'hidden', background: BOSQUE, borderRadius: 6,
    }}>
      <Img src={staticFile(archivo)} alt={alt} style={{
        width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${zoom})`, ...imagen,
      }} />
      {children}
    </div>
  );
}

function Gancho() {
  return (
    <Placa paso={0}>
      <Titular bajada="Al cierre" lineas={['¿Qué hacés con', 'lo que te sobra?']} tam={104} />
      <Toma
        archivo="foto-caja.jpg"
        alt="Una caja con facturas y sándwiches sobre el mostrador"
        top={585}
        height={800}
        imagen={{ objectPosition: '32% 100%' }}
      />
      <div style={{ position: 'absolute', left: 74, top: 1411, fontSize: 28, fontWeight: 700 }}>
        Imagen ilustrativa
      </div>
    </Placa>
  );
}

function SacarFoto() {
  const frame = useCurrentFrame();
  const foco = revelar(frame, 19, 18);
  const esquinas = [
    { top: 36, left: 36, borderTop: '5px solid', borderLeft: '5px solid' },
    { top: 36, right: 36, borderTop: '5px solid', borderRight: '5px solid' },
    { bottom: 36, left: 36, borderBottom: '5px solid', borderLeft: '5px solid' },
    { bottom: 36, right: 36, borderBottom: '5px solid', borderRight: '5px solid' },
  ];
  return (
    <Placa paso={1} oscuro>
      <Titular bajada="Usá el celular del local" lineas={['Sacale una foto', 'a lo que sobró.']} oscuro />
      <Toma
        archivo="foto-caja.jpg"
        alt="Una persona encuadra los excedentes con el celular"
        top={585}
        height={750}
        imagen={{ objectPosition: '58% 50%' }}
      >
        <div style={{
          position: 'absolute', inset: (1 - foco) * 18, color: MENTA, opacity: foco,
        }}>
          {esquinas.map((estilo, i) => (
            <span key={i} style={{ position: 'absolute', width: 64, height: 64, ...estilo }} />
          ))}
        </div>
      </Toma>
      <div style={{ position: 'absolute', left: 74, top: 1370, fontSize: 32, fontWeight: 700 }}>
        Imagen ilustrativa
      </div>
    </Placa>
  );
}

function Revisar() {
  const frame = useCurrentFrame();
  const entrada = revelar(frame, 5, 18);
  return (
    <Placa paso={2}>
      <Titular bajada="Revisá antes de publicar" lineas={['La app propone.', 'Vos confirmás.']} tam={96} />
      <div style={{
        position: 'absolute', top: 579, left: 74, right: 138, height: 846,
        background: MENTA, border: '2px solid #A9C4A7', borderRadius: 6,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 43, left: 39, width: 256, height: 716,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        }}>
          <span style={{ fontSize: 30, lineHeight: 1.18, fontWeight: 800, color: VERDE, marginBottom: 22 }}>
            PROTOTIPO
            <br />
            Detección simulada
          </span>
          <span style={{ fontSize: 31, lineHeight: 1.2, fontWeight: 600 }}>
            Identifica productos y propone cantidades.
          </span>
        </div>
        <div style={{
          position: 'absolute', left: 317, top: 43, width: 507, height: 777,
          background: '#FFF', borderRadius: 18, overflow: 'hidden',
          border: `4px solid ${VERDE}`,
          transform: `translateY(${(1 - entrada) * 28}px)`,
        }}>
          <Img
            src={staticFile('deteccion.png')}
            alt="Pantalla del prototipo que detecta medialunas y facturas"
            style={{ width: '100%', display: 'block' }}
          />
        </div>
      </div>
    </Placa>
  );
}

function Retiro() {
  const frame = useCurrentFrame();
  if (frame >= 4 * FPS) return <Ingreso />;
  return (
    <Placa paso={3} oscuro>
      <Titular bajada="Entregá en tu comercio" lineas={['Reservan en la app.', 'Retiran con QR.']} tam={91} oscuro />
      <Toma
        archivo="retiro.jpg"
        alt="Un cliente muestra su QR al retirar la bolsa en el mostrador"
        top={565}
        height={620}
        imagen={{
          position: 'absolute', width: 1960, height: 1094, left: -751, top: -465,
          transform: 'none',
        }}
      >
        <span style={{
          position: 'absolute', left: 0, top: 0, padding: '18px 26px',
          width: 454, height: 69, background: BOSQUE, color: PAPEL,
          fontWeight: 800, fontSize: 27, boxSizing: 'border-box',
        }}>Imagen ilustrativa</span>
      </Toma>
      <div style={{
        position: 'absolute', left: 74, top: 1230, fontSize: 36, fontWeight: 700,
      }}>
        El cliente pasa a buscar su pack.
      </div>
    </Placa>
  );
}

function Ingreso() {
  const frame = useCurrentFrame();
  const entrada = revelar(frame, 4 * FPS, 12);
  return (
    <Placa paso={3} oscuro>
      <div style={{
        position: 'absolute', top: 325, left: 74, right: 138,
        padding: '80px 60px', background: PAPEL, color: BOSQUE, borderRadius: 6,
        opacity: 0.6 + entrada * 0.4, transform: `translateY(${(1 - entrada) * 18}px)`,
      }}>
        <div style={{ fontSize: 33, fontWeight: 800, letterSpacing: 2.5 }}>
          TE QUEDÁS CON EL
        </div>
        <div style={{
          fontFamily: TITULO, fontSize: 267, fontWeight: 800, letterSpacing: -20,
          lineHeight: 1, margin: '20px 0 32px',
        }}>75%</div>
        <div style={{ fontSize: 61, fontWeight: 800, lineHeight: 1.06 }}>
          del precio del pack.
        </div>
        <div style={{
          marginTop: 58, paddingTop: 25, borderTop: '2px solid #B9A992',
          fontSize: 36, fontWeight: 700,
        }}>25% de comisión por pack vendido</div>
      </div>
    </Placa>
  );
}

function Cierre() {
  const frame = useCurrentFrame();
  const entrada = revelar(frame, 0, 17);
  return (
    <Placa paso={4}>
      <div style={{
        position: 'absolute', top: 270, left: 74, right: 138, height: 1129,
        background: VERDE, borderRadius: 6, color: PAPEL, display: 'flex',
        flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        padding: '54px 42px', boxSizing: 'border-box',
      }}>
        <Img src={staticFile('sello.webp')} alt="Sello oficial APROVECHO" style={{
          width: 448, height: 448, clipPath: 'circle(43% at 50% 50%)',
          transform: `scale(${0.97 + 0.03 * entrada})`,
        }} />
        <span style={{
          marginTop: 18, color: MENTA, fontSize: 29, fontWeight: 800,
          letterSpacing: 3.8, textTransform: 'uppercase',
        }}>Plan Base</span>
        <h1 style={{
          margin: '23px 0 31px', fontFamily: TITULO, fontSize: 122, letterSpacing: -6,
          fontWeight: 800, lineHeight: 0.95,
        }}>Sumá tu<br />comercio.</h1>
        <span style={{
          display: 'block', fontSize: 40, lineHeight: 1.16, fontWeight: 700,
          paddingTop: 27, borderTop: '2px solid #8BA998',
        }}>Sin abono.<br />Pagás solo cuando vendés.</span>
      </div>
    </Placa>
  );
}

const ESCENAS = [
  { inicio: 0, fin: 3, nombre: 'Al cierre', Escena: Gancho },
  { inicio: 3, fin: 7, nombre: 'Una foto', Escena: SacarFoto },
  { inicio: 7, fin: 12, nombre: 'Propuesta', Escena: Revisar },
  { inicio: 12, fin: 19, nombre: 'Retiro', Escena: Retiro },
  { inicio: 19, fin: DURACION, nombre: 'Cierre', Escena: Cierre },
];

function UnaFoto() {
  return (
    <AbsoluteFill>
      {ESCENAS.map(({ inicio, fin, nombre, Escena }) => (
        <Sequence key={nombre} name={nombre} from={inicio * FPS} durationInFrames={(fin - inicio) * FPS}>
          <Escena />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}

function Raiz() {
  return <>
    <Composition id="Onboarding" component={Onboarding} durationInFrames={DURACION_ONB * FPS} fps={FPS} width={1920} height={1080} />
    <Composition id="UnaFoto" component={UnaFoto} durationInFrames={DURACION * FPS} fps={FPS} width={1080} height={1920} />
  </>;
}

registerRoot(Raiz);
