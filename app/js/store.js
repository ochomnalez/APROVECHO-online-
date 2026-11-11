// Estado de la app, persistido en el teléfono.
import { isoDia } from './util.js';
import { CARTA_EJEMPLO, ubicarComercios, packsSemilla, HISTORIAL_CONSUMIDOR, CONFIG } from './data.js';

let CLAVE = 'aprovecho_prototipo_plan'; // separada de la demo v3.2.1 publicada
export const ZONA_NORTE = { lat: -34.5087, lng: -58.4877, fuente: 'default', barrio: 'Olivos' };

// ---------- reloj de la demo ----------
// Arranca a las 17:10 cada vez que se abre la app, para que siempre haya margen
// para recorrer la publicación y el retiro durante la presentación. Se puede
// pasar a la hora real desde Cuenta.
const ARRANQUE = Date.now();
export function ahora() {
  if (S.horaReal) return new Date();
  const d = new Date(ARRANQUE);
  d.setHours(17, 10, 0, 0);
  return new Date(d.getTime() + (Date.now() - ARRANQUE));
}
export const hoy = () => isoDia(ahora());

export let S = null;

function nuevo() {
  return {
    v: 2,
    rol: null,
    plan: 'smart',
    onboarding: { plan: false, carta: false, local: false },
    ubic: null,
    comercios: [],
    carta: CARTA_EJEMPLO.map(p => ({ ...p })),
    descuento: CONFIG.descuentoDefault,
    condLocal: ['Vegetariano'],
    packs: [],
    reservas: [],
    capturas: [],
    sugerencias: {},
    estacion: { auto: true },
    sucursal: 'todas',
    perfil: { nombre: 'Valentina', forma: 'a' },
    consumidor: { ...HISTORIAL_CONSUMIDOR },
    filtros: { tam: [], cond: [], cat: [], distKm: 3 },
    eventos: [],
    horaReal: false,
    dia: null,
  };
}

export function cargar() {
  try {
    const raw = localStorage.getItem(CLAVE);
    S = raw ? { ...nuevo(), ...JSON.parse(raw) } : nuevo();
  } catch (e) {
    S = nuevo();
  }
  cerrarDia();
  return S;
}

export function guardar() {
  try { localStorage.setItem(CLAVE, JSON.stringify(S)); } catch (e) { /* modo privado o sin espacio */ }
}

export function reiniciar() {
  const ubic = S?.ubic;
  S = nuevo();
  if (ubic) { S.ubic = ubic; S.comercios = ubicarComercios(ubic); }
  cerrarDia(true);
  guardar();
}

// Al empezar un día nuevo: los packs de ayer vencen, las reservas sin retirar
// pasan a "no retirada" y se siembra la oferta de los otros locales.
function cerrarDia(forzar) {
  const d = hoy();
  if (S.dia === d && !forzar) return;
  for (const p of S.packs) if (p.dia !== d && p.estado === 'activo') p.estado = 'vencido';
  for (const r of S.reservas) if (r.dia !== d && r.estado === 'activa') r.estado = 'no_retirada';
  S.packs = S.packs.filter(p => p.dia === d || !String(p.id).startsWith('ps'));
  S.packs.push(...packsSemilla(d));
  S.dia = d;
  guardar();
}

export function ubicar(pos) {
  S.ubic = pos;
  S.comercios = ubicarComercios(pos);
  guardar();
}

export function evento(tipo, datos = {}) {
  S.eventos.push({ tipo, t: Date.now(), ...datos });
  if (S.eventos.length > 400) S.eventos.splice(0, S.eventos.length - 400);
}

export const comercio = id => S.comercios.find(c => c.id === id);
export const miComercio = () => S.comercios.find(c => c.esMio);
export const producto = id => S.carta.find(p => p.id === id);
export const packsActivos = () => S.packs.filter(p => p.dia === hoy() && p.estado === 'activo' && p.stock > 0);
export const tienePlan = min => ({ basico: 0, smart: 1, intelligence: 2 })[S.plan] >= ({ basico: 0, smart: 1, intelligence: 2 })[min];

// Cada cuenta conserva un espacio local independiente para los datos de demostración.
export function seleccionarCuenta(id) {
  CLAVE = id ? 'aprovecho_cuenta_' + id : 'aprovecho_sin_sesion';
  cargar();
}
