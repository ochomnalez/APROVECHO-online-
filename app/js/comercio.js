// Pantallas del comercio (Base y Smart) + reportes. Intelligence vive en intelui.js.
import { esc, plata, dec, num, kg, gramos, pct, hhmm, pad, vibrar, esperar, uid, isoDia, sumarDias, DIAS_CORTO, ddmm, MESES } from './util.js';
import { icon } from './icons.js';
import { S, guardar, ahora, hoy, miComercio, producto, evento, tienePlan, ZONA_NORTE, ubicar, reiniciar } from './store.js';
import { CONFIG, PLANES, CONDICIONES, TAMANOS, RECONOCIMIENTO, armarPacks, agrupar, co2, MOTIVOS_MERMA } from './data.js';
import { barra, tabsComercio, abrirHoja, cerrarHoja, toast, vacio, badgeDato, nota, demoPill, barras, confirmar, cargando, animarNumeros } from './ui.js';
import { logoLocal } from './ilus.js';
import { fotoSvg, foto, cajaPct, MUESTRAS, nombreMuestra } from './fotos.js';
import { filtrar, resumen, porDia, SUCURSALES, sugerencias } from './intel.js';
import { leerPayload, escanear, detener } from './qr.js';
import { datosReporte, armarExcel, armarPdf, entregar, nombreArchivo, seccionesDisponibles } from './export.js';
import { nav } from './nav.js';
import { sumarAlPerfil, retiroTxt } from './cliente.js';
import { instalarUI } from './pwa.js';

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
const cierre = () => miComercio()?.cierre || '21:00';
const DESTINOS = { vender: 'Para vender', donado: 'Donado', reutilizado: 'Reutilizado', basura: 'Descartado' };
// Smart usa balanza + tablet; Intelligence suma una o más estaciones por sucursal.
const nombreEquipo = () => (tienePlan('intelligence') ? 'Estación completa' : 'Balanza Smart');

const misPacksHoy = () => S.packs.filter(p => p.comercioId === 'c1' && p.dia === hoy() && !String(p.id).startsWith('ps'));
const semillaMia = () => S.packs.filter(p => p.comercioId === 'c1' && p.dia === hoy() && String(p.id).startsWith('ps'));
const reservasMias = () => S.reservas.filter(r => r.comercioId === 'c1' && r.dia === hoy());
const porRetirar = () => reservasMias().filter(r => r.estado === 'activa').length + (S.externas || []).filter(x => x.dia === hoy() && x.estado === 'activa').length;
const tabs = activa => tabsComercio(activa, porRetirar());
const nombrePlan = () => PLANES[S.plan].nombre;
const sucLocal = () => (tienePlan('intelligence') ? ' · Olivos' : '');

function asegurarComercios() {
  if (!S.ubic) ubicar({ ...ZONA_NORTE });
  if (!S.comercios.length) ubicar(S.ubic);
}

// ---------------------------------------------------------------------------
// Alta (B-01 a B-03)
// ---------------------------------------------------------------------------
function altaPlan() {
  const card = k => {
    const pl = PLANES[k], pr = CONFIG.precios[k], on = S.plan === k;
    return `<button class="card toque${on ? ' sel' : ''}" data-act="plan-alta" data-v="${k}" style="text-align:left" aria-pressed="${on}">
      <div class="fila entre"><h3 style="font-size:19px">${pl.nombre}</h3>${k === 'basico' ? '<span class="badge">Para empezar</span>' : ''}</div>
      <p class="chico">${esc(pl.lema)}</p>
      <div class="fila entre"><span class="fuerte verde" style="white-space:nowrap">${esc(pr.txt)}</span><span class="mini">${esc(pr.sub)}</span></div>
    </button>`;
  };
  return {
    clase: 'gris',
    html: `${barra({ titulo: 'Paso 1 de 3', centro: true })}
    <div class="cuerpo">
      <h1 class="gran-titulo">Elegí tu plan</h1>
      <p class="subtitulo" style="margin-top:0">Lo podés cambiar cuando quieras.</p>
      ${card('basico')}${card('smart')}${card('intelligence')}
      <p class="mini">Smart e Intelligence suman un abono fijo. En los tres planes, la comisión es del 25% por cada pack vendido: el comercio se queda con el 75%.</p>
      <button class="btn bloque" data-go="b/carta">Seguir con ${nombrePlan()}</button>
    </div>`,
  };
}

let cartaLeida = false;
function altaCarta() {
  const faltan = S.carta.filter(p => p.precio == null);
  const lista = S.carta.map(p => `<button class="item" data-act="editar-precio" data-id="${p.id}">
    <span class="col crece"><span class="fuerte trunc2">${esc(p.nombre)}</span><span class="mini">${esc(p.cat)} · ${p.u === 'kg' ? 'por kg' : gramos(p.peso) + ' por unidad'}</span></span>
    ${p.precio == null ? '<span class="badge horno">No pude leer el precio</span>' : `<span class="fuerte">${plata(p.precio)}${p.u === 'kg' ? '/kg' : ''}</span>`}
  </button>`).join('');
  return {
    clase: 'gris',
    html: `${barra({ titulo: 'Paso 2 de 3', centro: true })}
    <div class="cuerpo">
      <h1 class="gran-titulo">Cargá tu carta</h1>
      <p class="subtitulo" style="margin-top:0">Una sola vez. Con esto la IA sabe el precio y el peso de cada cosa que fotografíes.</p>
      ${cartaLeida ? `
        <div class="card suave fila" style="gap:12px">${icon('check', 22, 'verde')}<span class="crece"><b>Leí ${S.carta.length} productos.</b> Revisá los que están marcados.</span></div>
        <div class="lista">${lista}</div>
        <p class="mini">El peso por unidad es sugerido por la IA. Si lo corregís, los packs salen más exactos.</p>
        <button class="btn bloque${faltan.length ? ' off' : ''}" data-go="b/local">${faltan.length ? `Falta ${faltan.length} precio` : 'Guardar carta'}</button>
      ` : `
        <div class="foto" style="aspect-ratio:4/3">${pizarra()}</div>
        <button class="btn bloque" data-act="leer-carta">${icon('camara', 20)} Sacarle foto a mi lista de precios</button>
        <button class="btn bloque sec" data-act="leer-carta">Usar la carta de ejemplo</button>
        ${nota('También sirve la pizarra, el menú impreso o una captura de tu sistema de ventas.')}
      `}
    </div>`,
  };
}
function pizarra() {
  const lineas = S.carta.slice(0, 9).map((p, i) => `<text x="36" y="${58 + i * 26}" fill="#F2EFE6" font-family="Segoe Print, Comic Sans MS, cursive" font-size="16">${esc(p.nombre.replace(/ \(.*\)/, ''))}</text><text x="364" y="${58 + i * 26}" fill="#F2EFE6" font-family="Segoe Print, Comic Sans MS, cursive" font-size="16" text-anchor="end">${p.precio ? '$' + num(p.precio) : '$ ?'}</text>`).join('');
  return `<svg viewBox="0 0 400 300"><rect width="400" height="300" fill="#8B6A43"/><rect x="14" y="14" width="372" height="272" rx="6" fill="#2E3B32"/><text x="200" y="36" fill="#E7C27E" font-family="Segoe Print, Comic Sans MS, cursive" font-size="17" text-anchor="middle">LA ESPIGA</text>${lineas}</svg>`;
}

function altaLocal() {
  const c = miComercio();
  return {
    clase: 'gris',
    html: `${barra({ titulo: 'Paso 3 de 3', centro: true })}
    <div class="cuerpo">
      <h1 class="gran-titulo">Tu local</h1>
      <div class="campo"><label for="nom-local">Nombre</label><input class="input" id="nom-local" value="${esc(c.nombre)}" maxlength="40"></div>
      <div class="campo"><label for="cierre">Hora de cierre</label>
        <select class="input" id="cierre">${['20:00', '20:30', '21:00', '21:30', '22:00'].map(h => `<option${h === c.cierre ? ' selected' : ''}>${h}</option>`).join('')}</select></div>
      <div class="nota">${icon('reloj', 18)}<span>Los packs se publican hasta <b>2 horas antes</b> del cierre, para que siempre se puedan retirar el mismo día.</span></div>
      <div class="card plana"><span class="fuerte">Packs al 50% del valor de mostrador</span><span class="mini">Te quedás con el 75% del precio del pack. APROVECHO cobra el 25% cuando se vende.</span></div>
      <div class="campo"><label>¿Qué podés ofrecer a veces?</label>
        <div class="chips">${CONDICIONES.map(x => `<button class="chip${S.condLocal.includes(x) ? ' on' : ''}" data-act="cond-local" data-v="${x}">${x}</button>`).join('')}</div>
        <span class="mini">Esto solo habilita la opción. En cada pack la marcás vos, si corresponde.</span></div>
      <button class="btn bloque" data-act="terminar-alta">Terminar</button>
    </div>`,
  };
}

// ---------------------------------------------------------------------------
// Hoy (B-04)
// ---------------------------------------------------------------------------
function hoyPantalla() {
  const mios = misPacksHoy();
  const todos = [...semillaMia(), ...mios];
  const publicados = todos.reduce((a, p) => a + (p.stockInicial || p.stock + (p.vendidos || 0)), 0);
  const vendidos = todos.reduce((a, p) => a + (p.vendidos || 0), 0);
  const ventas = reservasMias().filter(r => ['activa', 'retirada', 'no_retirada'].includes(r.estado)).reduce((a, r) => a + r.precio, 0);
  const recuperado = ventas * (1 - CONFIG.comision);
  const ult = S.capturas.filter(c => c.tipo === 'pesaje' && c.dia === hoy()).slice(-1)[0];
  const sugN = tienePlan('intelligence') ? sugerencias(S.sucursal, ahora(), S.sugerencias).filter(s => s.estado === 'nueva').length : 0;
  const activos = todos.filter(p => p.estado === 'activo' || p.estado === 'agotado');
  return {
    tabs: tabs('b/hoy'), clase: 'con-tabs gris',
    html: `<header class="barra" style="background:var(--fondo-2);padding-left:18px;padding-right:14px;gap:12px">${logoLocal(miComercio(), 44, 13)}<div class="titulo" style="font-size:20px;font-weight:700;padding:0">${esc(miComercio().nombre.replace('Panadería ', ''))}<span class="mini" style="display:block;font-family:var(--ui);font-weight:550;letter-spacing:-.01em">Hoy${sucLocal() || ' · cierra ' + cierre()}</span></div>${demoPill()}</header>
    <div class="cuerpo">
      <div class="card">
        <h2>¿Qué te sobró hoy?</h2>
        ${tienePlan('smart') ? `<p class="chico">Apoyá el excedente en la balanza para pesar y fotografiar.</p><button class="btn bloque" data-go="b/estacion">${icon('balanza', 20)} Abrir estación</button>` :
          `<p class="chico">Sacale una foto y revisá los packs que propone la IA.</p><button class="btn bloque" data-go="b/camara">${icon('camara', 20)} Sacar foto</button>`}
      </div>
      ${tienePlan('smart') ? `<button class="card toque" data-go="b/camara" style="text-align:left">
        <span class="fila" style="gap:8px">${icon('camara', 22, 'verde')}<span class="fuerte">Cargar con el celular</span>${badgeDato(false)}</span>
        <span class="chico">${ult ? `Último pesaje: ${hhmm(new Date(ult.t))} · ${dec(ult.kg)} kg de ${esc(ult.producto)}` : 'También podés cargar con una foto.'}</span>
      </button>` : ''}
      ${sugN ? `<button class="card toque verde" data-tab="b/intel" style="text-align:left"><div class="fila entre"><span class="fila" style="gap:8px">${icon('grafico', 22)}<span class="fuerte">${sugN} sugerencias nuevas</span></span>${icon('adelante', 20)}</div><span class="chico">Intelligence encontró patrones en tu desperdicio.</span></button>` : ''}
      <div class="resumen">
        <div class="resumen-top"><span class="col"><span class="eti">Ingreso recuperado hoy</span><span class="mini">${plata(ventas)} en ventas · ${plata(ventas * CONFIG.comision)} de comisión</span></span><strong data-contar="${recuperado}" data-fmt="plata">${plata(recuperado)}</strong></div>
        <div class="resumen-fila">
          <div><b data-contar="${publicados}">${publicados}</b><span>Publicados</span></div>
          <div><b data-contar="${vendidos}">${vendidos}</b><span>Vendidos</span></div>
          <div><b data-contar="${porRetirar()}">${porRetirar()}</b><span>A retirar</span></div>
        </div>
      </div>
      <div class="seccion"><h3>Tus packs de hoy</h3></div>
      ${activos.length ? `<div class="lista">${activos.map(p => `<button class="item" data-act="opciones-pack" data-id="${p.id}">
        <span class="ic-caja">${icon(p.origen === 'estacion' ? 'balanza' : 'camara', 20)}</span>
        <span class="col crece"><span class="fuerte trunc2">${esc(p.titulo || 'Pan de campo')}</span><span class="mini">${TAMANOS[p.tam]} · ${plata(p.precio)} · ${p.vendidos || 0} de ${p.stockInicial || p.stock + (p.vendidos || 0)} vendidos</span></span>
        ${p.estado === 'agotado' ? '<span class="badge">Agotado</span>' : `<span class="badge gris">Quedan ${p.stock}</span>`}</button>`).join('')}</div>`
        : vacio('camara', 'Todavía no publicaste nada hoy', 'Cuando saques la primera foto, tus packs aparecen acá.')}
    </div>`,
    montar: el => { if (!yaAnimoHoy) { yaAnimoHoy = true; animarNumeros(el, { num: v => num(v), plata: v => plata(v) }); } },
  };
}
let yaAnimoHoy = false;

// ---------------------------------------------------------------------------
// Publicar con foto (B-05 a B-09)
// ---------------------------------------------------------------------------
let flujo = null;
function camara() {
  return {
    html: `${barra({ titulo: 'Foto del excedente', cerrar: true, centro: true })}
    <div class="cuerpo">
      <label class="card toque" style="align-items:center;text-align:center;padding:26px 16px;gap:8px;background:var(--verde-50);box-shadow:inset 0 0 0 1.5px var(--verde-200)">
        <span class="ok-grande" style="width:74px;height:74px;box-shadow:none;animation:none">${icon('camara', 34)}</span>
        <span class="fuerte" style="font-size:18px">Sacar una foto</span>
        <span class="chico">Poné todo junto y sacá de arriba, con buena luz.</span>
        <input type="file" accept="image/*" capture="environment" data-act-change="foto-propia" hidden
      </label>
      <label class="btn bloque sec">${icon('galeria', 20)} Elegir de la galería<input type="file" accept="image/*" data-act-change="foto-propia" hidden></label>
      <div class="seccion"><h3>O probá con una foto de muestra</h3></div>
      <div class="muestras">${MUESTRAS.map(id => `<button class="muestra" data-act="usar-muestra" data-v="${id}"><div class="mini-foto">${fotoSvg(id)}</div><span>${esc(nombreMuestra(id))}</span></button>`).join('')}</div>
      ${nota('La detección está simulada en las fotos de muestra. Si cargás una foto tuya, completás los datos a mano.')}
    </div>`,
  };
}

let timers = [];
const limpiarTimers = () => { timers.forEach(clearTimeout); timers = []; };
function analizando() {
  if (!flujo) return { html: '', redirigir: 'b/camara' };
  const f = flujo;
  const cajas = f.muestraId ? foto(f.muestraId).cajas : [];
  const detectados = detecciones(f);
  return {
    clase: 'deteccion-comercio',
    html: `${barra({ titulo: '', cerrar: true })}
    <div class="cuerpo">
      <span class="eti">Lectura de la foto · Demo</span>
      <h1>Detectando el excedente</h1>
      <div class="foto foto-deteccion" id="foto-an">${f.muestraId ? fotoSvg(f.muestraId) : `<img src="${f.fotoUrl}" alt="Tu foto">`}</div>
      <p class="chico" aria-live="polite" id="detecciones-lista"></p>
      <div class="pasos" id="pasos">
        <div class="paso" data-p="0"><i></i>Reconociendo productos</div>
        <div class="paso" data-p="1"><i></i>Contando unidades</div>
        <div class="paso" data-p="2"><i></i>Cruzando con tu carta</div>
        <div class="paso" data-p="3"><i></i>Armando los packs</div>
      </div>
    </div>`,
    montar: el => {
      limpiarTimers();
      const pasos = [...el.querySelectorAll('.paso')];
      const marcar = (i, estado) => { const p = pasos[i]; p.classList.remove('ahora'); p.classList.add(estado); if (estado === 'hecho') p.querySelector('i').innerHTML = icon('check', 14); };
      const cont = el.querySelector('#foto-an');
      marcar(0, 'ahora');
      const paso = 2300 / Math.max(cajas.length, 1);
      const etiquetas = new Set();
      cajas.forEach((c, i) => timers.push(setTimeout(() => {
        const id = c.producto || f.producto;
        const det = detectados.find(x => x.producto === id);
        if (!det) return;
        const d = document.createElement('div');
        const dudosa = det.confianza < CONFIG.umbralDuda;
        d.className = 'caja-det' + (dudosa ? ' duda' : '');
        d.style.cssText = cajaPct(c);
        if (!etiquetas.has(id)) {
          d.innerHTML = `<b>${dudosa ? 'Por confirmar' : esc(etiquetaDeteccion(det))}</b>`;
          etiquetas.add(id);
        }
        cont.appendChild(d);
      }, 220 + i * paso)));
      timers.push(setTimeout(() => {
        marcar(0, 'hecho'); marcar(1, 'ahora');
        el.querySelector('#detecciones-lista').textContent = detectados.map(etiquetaDeteccion).join(' · ');
      }, 550));
      timers.push(setTimeout(() => { marcar(1, 'hecho'); marcar(2, 'ahora'); }, 1400));
      timers.push(setTimeout(() => { marcar(2, 'hecho'); marcar(3, 'ahora'); }, 2100));
      timers.push(setTimeout(() => {
        marcar(3, 'hecho');
        if (!f.muestraId || (detectados.length === 1 && f.confianza < CONFIG.umbralDuda)) { nav.go('b/duda', { replace: true }); return; }
        armarFlujo();
        nav.go('b/revisar', { replace: true });
      }, 2950));
    },
    desmontar: limpiarTimers,
  };
}
function detecciones(f) {
  return f.productos || (f.producto ? [f] : []);
}
function etiquetaDeteccion(d) {
  return `${producto(d.producto)?.nombre || 'Producto'} ${d.kg ? '· ' + dec(d.kg) + ' kg' : '×' + d.unidades}`;
}
function pesoDeteccion(d) {
  return d.kg ?? (d.unidades * (producto(d.producto)?.peso || 0) / 1000);
}
const precioPack = valor => Math.round(valor * 50) / 100;

function armarFlujo() {
  const f = flujo;
  f.packs = detecciones(f).flatMap((d, i) => {
    const prod = producto(d.producto);
    if (!prod?.precio) return [];
    const cantidad = prod.u === 'kg' ? d.kg : d.unidades;
    return agrupar(armarPacks(prod, cantidad, .5)).map(p => ({
      ...p, deteccion: i, precio: precioPack(p.valor),
      pesoG: f.pesoBalanza ? p.pesoG * f.pesoBalanza / pesoDeteccion(d) : p.pesoG,
    }));
  });
  flujo.cond = flujo.cond || [];
  flujo.retiro = flujo.retiro || 0;
}

export function prepararPropuestaInventario({ titulo, cantidad, pesoEstimado, precioUnitario, consumirInventario }) {
  if (!titulo?.trim() || !Number.isInteger(cantidad) || cantidad < 1 || !Number.isFinite(precioUnitario) || precioUnitario <= 0) return false;
  const valor = precioUnitario * cantidad;
  flujo = {
    inventario: true, consumirInventario, cond: [], retiro: 0, t0: Date.now(), correcciones: [],
    packs: [{ titulo: titulo.trim(), cantidad, pesoG: pesoEstimado > 0 ? Math.round(cantidad * pesoEstimado) : 0, valor, precio: precioPack(valor), stock: 1, tam: 'chico', cat: 'Almacén' }],
  };
  nav.go('b/revisar');
  return true;
}

function duda() {
  if (!flujo) return { html: '', redirigir: 'b/camara' };
  const f = flujo;
  const ops = f.opciones || [];
  const elegido = f.elegido || (ops[0] && ops[0][0]);
  const prodEl = producto(elegido);
  const esKg = prodEl?.u === 'kg';
  if (f.unidadesDuda == null) f.unidadesDuda = f.unidades || 6;
  if (f.kgDuda == null) f.kgDuda = f.kg || 1;
  return {
    html: `${barra({ titulo: f.muestraId ? 'Ayudame con esta' : '¿Qué es?', centro: true })}
    <div class="cuerpo">
      <div class="foto foto-deteccion">${f.muestraId ? fotoSvg(f.muestraId) : `<img src="${f.fotoUrl}" alt="Tu foto">`}
        ${f.muestraId && foto(f.muestraId).cajas[0] ? `<div class="caja-det duda" style="${cajaPct(foto(f.muestraId).cajas[0])}"><b>¿Qué es?</b></div>` : ''}</div>
      <h2>${f.muestraId ? 'No estoy seguro de qué es. ¿Cuál es?' : 'Contame qué hay en la foto'}</h2>
      ${f.muestraId ? '' : '<p class="chico" style="margin-top:-6px">En la demo la IA no mira tu foto: elegí el producto y cuántos hay.</p>'}
      <div class="lista">
        ${(ops.length ? ops : S.carta.filter(p => p.precio != null).slice(0, 5).map(p => [p.id, null])).map(([id, pr]) => `<button class="item" data-act="elegir-duda" data-v="${id}">
          <span class="col crece"><span class="fuerte">${esc(producto(id).nombre)}</span>${pr != null ? `<span class="mini">${Math.round(pr * 100)}% de probabilidad</span>` : ''}</span>
          ${id === elegido ? icon('check', 22, 'verde') : ''}</button>`).join('')}
        <button class="item" data-act="otro-producto"><span class="crece fuerte">Otra cosa de tu carta…</span>${icon('adelante', 20, 'chev')}</button>
      </div>
      <div class="card fila entre"><span class="fuerte">${esKg ? 'Peso' : 'Unidades'}</span>
        <div class="stepper"><button data-act="duda-menos" aria-label="Menos">${icon('menos', 18)}</button><span>${esKg ? dec(f.kgDuda) + ' kg' : f.unidadesDuda}</span><button data-act="duda-mas" aria-label="Más">${icon('mas', 18)}</button></div></div>
      <div style="flex:1"></div>
      <button class="btn bloque${elegido ? '' : ' off'}" data-act="confirmar-duda">Seguir</button>
    </div>`,
  };
}

function revisar() {
  if (!flujo || !flujo.packs) return { html: '', redirigir: 'b/camara' };
  const f = flujo;
  const detectados = detecciones(f);
  const n = f.packs.reduce((a, p) => a + p.stock, 0);
  const pesoTot = f.packs.reduce((a, p) => a + p.pesoG * p.stock, 0) / 1000;
  const ventas = f.packs.reduce((a, p) => a + p.precio * p.stock, 0);
  const c = miComercio();
  const ventanas = horarios(c.cierre);
  const alergenos = alergenosDetectados(f);
  return {
    html: `${barra({ titulo: 'Revisá y publicá', centro: true })}
    <div class="cuerpo">
      ${f.inventario ? '<span class="eti">Sugerencia del inventario</span>' : `<div class="card">
        ${f.muestraId || f.fotoUrl ? `<div class="foto foto-deteccion foto-revision">${f.muestraId ? fotoSvg(f.muestraId) : `<img src="${f.fotoUrl}" alt="Tu foto">`}</div>` : ''}
        <div class="fila entre"><h2>${f.medido ? 'Lectura de la estación' : 'Productos de la foto'}</h2>${f.medido ? badgeDato(true) : badgeDato(false)}</div>
        ${detectados.map((d, i) => {
          const prod = producto(d.producto);
          const esKg = prod.u === 'kg';
          return `<div class="deteccion-fila">
            <button class="fila entre deteccion-producto" data-act="otro-producto" data-i="${i}" aria-label="Cambiar ${esc(prod.nombre)}"><span class="fuerte">${esc(prod.nombre)}</span>${icon('editar', 18, 'verde')}</button>
            ${esKg && f.medido ? `<span class="fuerte">${dec(d.kg)} kg</span>` : `<div class="stepper"><button data-act="cant-menos" data-i="${i}" aria-label="Reducir cantidad de ${esc(prod.nombre)}">${icon('menos', 18)}</button><span>${esKg ? dec(d.kg) + ' kg' : d.unidades + ' u'}</span><button data-act="cant-mas" data-i="${i}" aria-label="Aumentar cantidad de ${esc(prod.nombre)}">${icon('mas', 18)}</button></div>`}
            ${!prod.precio || (d.confianza < CONFIG.umbralAlta && !d.revisado) ? `<span class="mini deteccion-aviso">${!prod.precio ? 'Falta un precio habitual para armar el pack.' : 'Confirmá la detección antes de publicar.'}</span>` : ''}
          </div>`;
        }).join('')}
      </div>`}
      <div class="seccion"><h3>Packs propuestos</h3><span class="mini">50% de descuento</span></div>
      ${f.packs.map((p, i) => `<div class="card sel" style="gap:6px">
        <div class="fila entre"><span class="fuerte">${p.stock} × Pack ${TAMANOS[p.tam].toLowerCase()}</span><span class="fuerte verde" style="font-size:19px">${plata(p.precio)}<span class="mini" style="font-family:var(--ui)"> c/u</span></span></div>
        <div class="fila entre"><span class="chico">${esc(p.titulo)}${p.pesoG > 0 ? ' · ' + (f.medido ? '' : '≈ ') + gramos(p.pesoG) : ''}</span><span class="tachado">${plata(p.valor)}</span></div>
        ${f.inventario ? '' : `<button class="btn chico gris quitar-propuesta" data-act="quitar-pack" data-i="${i}">${icon('menos', 16)} Uno menos</button>`}
      </div>`).join('')}
      ${!n ? '<p class="chico">Agregá un producto con precio en la carta para poder publicar.</p>' : ''}
      <div class="card plana"><span class="chico">Si se venden todos, te quedan <b>${plata(ventas * (1 - CONFIG.comision))}</b>.</span><span class="mini">Ventas ${plata(ventas)} · Comisión del 25% ${plata(ventas * CONFIG.comision)}</span></div>
      <div class="campo"><label>Retiro</label>
        <div class="seg">${ventanas.map((v, i) => `<button class="${f.retiro === i ? 'on' : ''}" data-act="retiro" data-v="${i}">${v}</button>`).join('')}</div>
        <span class="mini">Hoy de ${ventanas[f.retiro]} a ${c.cierre}</span></div>
      <div class="campo"><label>Condiciones · las marcás vos</label>
        <div class="chips">${CONDICIONES.map(x => `<button class="chip${f.cond.includes(x) ? ' on' : ''}" data-act="cond-pack" data-v="${x}"${S.condLocal.includes(x) ? '' : ' disabled'}>${x}</button>`).join('')}</div>
        ${S.condLocal.length < 3 ? '<span class="mini">Las que no ofrecés están apagadas. Se habilitan en Cuenta → Datos del local.</span>' : ''}</div>
      ${pesoTot ? `<div class="fila entre"><span class="chico">Comida en los packs: <b>${dec(pesoTot)} kg</b></span>${badgeDato(f.medido)}</div>` : ''}
      <div class="card comercio-check">
        <label class="campo"><span>Alérgenos posibles de este lote</span><input class="input" data-act-change="alergenos-pack" value="${esc(alergenos)}" placeholder="Ej. trigo, huevo y leche" maxlength="120"><span class="mini">${f.inventario ? 'Completalos según el etiquetado.' : 'Vienen de tu carta. Los confirmás al publicar.'}</span></label>
      </div>
      <button class="btn bloque" data-act="publicar" ${n ? '' : 'disabled'}>Publicar ${n} pack${n === 1 ? '' : 's'}</button>
    </div>`,
  };
}

function alergenosDetectados(f) {
  return f.alergenos ?? [...new Set(f.packs.flatMap(p => producto(p.productoId)?.alergenos || []))].join(', ');
}
function horarios(horaCierre) {
  const [h, m] = horaCierre.split(':').map(Number);
  return [60, 30, 120].map(resta => {
    const mins = h * 60 + m - resta;
    return `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
  });
}

function publicado(ids) {
  const lista = String(ids || '').split(',').map(id => S.packs.find(p => p.id === id)).filter(Boolean);
  if (!lista.length) return { html: '', redirigir: 'b/hoy' };
  const n = lista.reduce((a, p) => a + p.stockInicial, 0);
  const plataT = lista.reduce((a, p) => a + p.stockInicial * p.precio, 0);
  const kgT = lista.reduce((a, p) => a + p.stockInicial * p.pesoG, 0) / 1000;
  const medido = lista.every(p => p.medido);
  const seg = lista[0].segundosDesdeFoto;
  return {
    html: `<header class="barra"><div class="titulo"></div><button class="icbtn" data-tab="b/hoy" aria-label="Cerrar">${icon('x', 24)}</button></header>
    <div class="cuerpo" style="gap:16px">
      <div style="flex:.6"></div>
      <div class="ok-grande">${icon('check', 46)}</div>
      <h1 class="gran-titulo" style="text-align:center">Publicaste ${n} pack${n === 1 ? '' : 's'}</h1>
      <p class="chico" style="text-align:center">Ya los ven los clientes que están a menos de ${CONFIG.radioKm} km.</p>
      <div class="card">
        <div class="fila entre"><span class="chico">Si se venden todos, te quedan</span><span class="fuerte verde">${plata(plataT * (1 - CONFIG.comision))}</span></div>
        ${kgT ? `<div class="fila entre"><span class="chico">Comida en los packs</span><span class="fuerte">${dec(kgT)} kg</span>${badgeDato(medido)}</div>` : ''}
        ${seg != null ? `<div class="fila entre"><span class="chico">Tiempo desde la foto</span><span class="fuerte">${seg} s</span></div>` : ''}
      </div>
      <div style="flex:1"></div>
      <button class="btn bloque sec" data-go="c/pack/${lista[0].id}">${icon('usuario', 20)} Ver cómo lo ve el cliente</button>
      <button class="btn bloque" data-tab="b/hoy">Volver a Hoy</button>
    </div>`,
  };
}

function publicar() {
  const f = flujo;
  if (!f?.packs?.length) return [];
  if (f.consumirInventario && !f.consumirInventario()) {
    toast('La sugerencia del inventario ya no está disponible.', { ic: 'alerta' });
    return [];
  }
  const c = miComercio();
  const desde = horarios(c.cierre)[f.retiro];
  const seg = Math.round((Date.now() - f.t0) / 1000);
  const origen = f.medido ? 'estacion' : f.inventario ? 'inventario' : 'foto';
  const alergenos = alergenosDetectados(f).split(',').map(t => t.trim()).filter(Boolean);
  const capturas = detecciones(f).map((d, i) => {
    const prod = producto(d.producto);
    const packs = f.packs.filter(p => p.deteccion === i).reduce((s, p) => s + p.stock, 0);
    return { id: uid('cap'), dia: hoy(), t: ahora().getTime(), tipo: f.medido ? 'pesaje' : 'foto', producto: prod.nombre,
      productoId: prod.id, unidades: d.unidades, kg: f.pesoBalanza || pesoDeteccion(d),
      valor: prod.precio ? (prod.u === 'kg' ? f.pesoBalanza || d.kg : d.unidades) * prod.precio : null,
      confianza: d.confianza, destino: 'vender', packs, correcciones: f.correcciones || [] };
  });
  S.capturas.push(...capturas);
  const ids = [];
  for (const p of f.packs) {
    const prod = producto(p.productoId);
    const id = uid('p');
    ids.push(id);
    S.packs.push({ id, comercioId: 'c1', dia: hoy(), estado: 'activo', stock: p.stock, stockInicial: p.stock, vendidos: 0,
      tam: p.tam, precio: p.precio, valor: p.valor, pesoG: p.pesoG, cat: p.cat, cond: [...f.cond], titulo: p.titulo,
      productoId: prod?.id, nutri100: prod?.nutri, medido: !!f.medido, origen, alergenos, checklist: true,
      retiroDesde: desde, retiroHasta: c.cierre, creado: ahora().getTime(),
      capturaId: capturas[p.deteccion]?.id, segundosDesdeFoto: origen === 'foto' ? seg : null });
  }
  evento('pack_publicado', { n: ids.length, segundos: seg, origen, correcciones: (f.correcciones || []).length });
  if (f.medido) enBalanza = null;
  guardar();
  vibrar(25);
  flujo = null;
  return ids;
}

function registrarCorreccion(campo, ia, final) {
  if (!flujo) return;
  flujo.correcciones = flujo.correcciones || [];
  const ex = flujo.correcciones.find(c => c.campo === campo);
  if (ex) ex.final = final; else flujo.correcciones.push({ campo, ia, final });
}

// ---------------------------------------------------------------------------
// Estación (B-10, B-11)
// ---------------------------------------------------------------------------
const PESAJES = [
  { producto: 'pan', kg: .92, muestra: 'pan', conf: .91 },
  { producto: null, nombre: 'Recortes de masa', kg: .62, soloBasura: true, conf: .88 },
  { producto: 'medialuna', kg: .54, unidades: 12, muestra: 'medialunas', conf: .96 },
  { producto: 'torta', kg: .12, unidades: 1, muestra: 'torta', conf: .9 },
  { producto: null, nombre: 'Sándwiches de miga vencidos', kg: .21, soloBasura: true, conf: .83 },
  { producto: 'miga', kg: .14, unidades: 4, muestra: 'sandwiches', conf: .9 },
];
let enBalanza = null;
function estacion() {
  if (!tienePlan('smart')) return { html: '', redirigir: 'b/hoy' };
  const hoyCap = S.capturas.filter(c => ['pesaje', 'destino'].includes(c.tipo) && c.dia === hoy()).slice().reverse();
  const b = enBalanza;
  return {
    clase: 'gris estacion-comercio',
    html: `${barra({ titulo: 'Estación Smart', accion: '<span class="badge estacion-badge">Modo demo</span>' })}
    <div class="cuerpo estacion-panel">
      <div class="card estacion-pesaje${b ? ' sel' : ''}" id="balanza">
        <span class="eti">Balanza Systel · Tablet Samsung</span>
        <h1>En la balanza</h1>
        ${b ? `
          <div class="foto foto-deteccion estacion-foto">${b.muestra ? fotoSvg(b.muestra) : `<div class="estacion-sin-foto">${icon('balanza', 38)}</div>`}</div>
          <div class="fila entre"><span class="kpi"><span class="n num" id="peso">0,00 kg</span></span>${badgeDato(true)}</div>
          <p class="chico" id="reco" aria-live="polite">Leyendo el peso y la foto…</p>
          <fieldset class="estacion-destinos" id="botones-balanza" disabled>
            <legend>¿Qué vas a hacer con el excedente?</legend>
            <button class="btn bloque" data-act="pesaje-vender" ${b.soloBasura ? 'disabled' : ''}>${icon('etiqueta', 20)} Para vender</button>
            <button class="btn sec" data-act="destino-pesaje" data-v="donado" ${b.soloBasura ? 'disabled' : ''}>Donar</button>
            <button class="btn sec" data-act="destino-pesaje" data-v="reutilizado" ${b.soloBasura ? 'disabled' : ''}>Reutilizar</button>
            <button class="btn sec" data-act="destino-pesaje" data-v="basura">${icon('basura', 20)} Descartar</button>
          </fieldset>`
        : `<div class="vacio"><div class="circ">${icon('balanza', 30)}</div><p class="chico">Apoyá lo que sobró. La balanza lo pesa y la tablet toma la foto desde arriba.</p></div>
          <button class="btn bloque" data-act="simular-pesaje">${icon('balanza', 20)} Simular pesaje y foto</button>`}
      </div>
      <div class="estacion-resultados">
        ${resumenEstacion()}
        <div class="seccion"><h3>Registro de hoy</h3></div>
        ${hoyCap.length ? `<div class="lista">${hoyCap.map(c => `<div class="item">
          <span class="ic-caja">${icon(c.destino === 'basura' ? 'basura' : 'balanza', 20)}</span>
          <span class="col crece"><span class="fuerte trunc2">${esc(c.producto)}</span><span class="mini">${hhmm(new Date(c.t))} · ${dec(c.kg)} kg${c.motivo ? ' · ' + esc(c.motivo) : c.destino === 'vender' ? '' : ' · Motivo pendiente'}</span></span>
          ${c.destino !== 'vender' ? `<button class="btn chico gris" data-go="b/merma/${c.id}">${DESTINOS[c.destino]}</button>` : '<span class="badge">Para vender</span>'}</div>`).join('')}</div>`
          : '<p class="chico">Todavía no se pesó nada hoy.</p>'}
      </div>
    </div>`,
    montar: el => {
      if (!b || b.listo) { if (b) mostrarPesoFinal(el, b); return; }
      limpiarTimers();
      const pesoEl = el.querySelector('#peso');
      const pasos = 16;
      for (let i = 1; i <= pasos; i++) timers.push(setTimeout(() => {
        const v = b.kg * (1 - Math.pow(1 - i / pasos, 3)) + (i < pasos ? (Math.random() - .5) * .04 : 0);
        pesoEl.textContent = Math.max(0, v).toFixed(2).replace('.', ',') + ' kg';
      }, i * 60));
      timers.push(setTimeout(() => { b.listo = true; mostrarPesoFinal(el, b); vibrar(12); }, pasos * 60 + 450));
    },
    desmontar: limpiarTimers,
  };
}
function mostrarPesoFinal(el, b) {
  const caja = el.querySelector('.estacion-foto');
  if (caja && b.muestra && !caja.querySelector('.caja-det')) {
    const cajas = foto(b.muestra).cajas.slice(0, 6);
    caja.insertAdjacentHTML('beforeend', cajas.map(c => `<div class="caja-det" style="${cajaPct(c)}"><b>${esc(producto(c.producto)?.nombre.split(' ')[0] || '')}</b></div>`).join(''));
  }
  el.querySelector('#peso').textContent = b.kg.toFixed(2).replace('.', ',') + ' kg';
  el.querySelector('#reco').innerHTML = `${esc(b.producto ? producto(b.producto).nombre : b.nombre)}${b.unidades ? ' · ' + b.unidades + ' u' : ''} · ${Math.round(b.conf * 100)}%`;
  el.querySelector('#botones-balanza').disabled = false;
}

function resumenEstacion() {
  const pesajes = S.capturas.filter(c => c.tipo === 'pesaje' && c.dia === hoy());
  const retiros = reservasMias().filter(r => r.estado === 'retirada');
  let generado = 0, recuperado = 0, valor = 0, pendientes = 0;
  for (const c of pesajes) {
    const kgRetirados = retiros.reduce((total, r) => {
      const p = S.packs.find(p => p.id === r.packId && p.capturaId === c.id);
      return total + (p?.pesoG || 0) / 1000;
    }, 0);
    const kgPendientes = Math.max(0, c.kg - kgRetirados);
    generado += c.kg;
    recuperado += kgRetirados;
    if (kgPendientes <= 1e-6) continue;
    if (c.valor != null) valor += c.valor * kgPendientes / c.kg;
    else pendientes++;
  }
  return `<div class="card estacion-metricas">
    <h2>Balance de hoy</h2>
    <div class="fila entre"><span>Excedente pesado</span><strong>${dec(generado)} kg</strong>${badgeDato(true)}</div>
    <div class="fila entre"><span>Retirado con QR</span><strong>${dec(recuperado)} kg</strong>${badgeDato(true)}</div>
    <div class="fila entre"><span>Sin recuperar</span><strong>${dec(Math.max(0, generado - recuperado))} kg</strong>${badgeDato(true)}</div>
    <div class="fila entre"><span>Tasa de recuperación</span><strong>${generado ? pct(recuperado / generado) : '—'}</strong>${badgeDato(true)}</div>
    <div class="fila entre"><span>Valor sin recuperar</span><strong>${pendientes && !valor ? '—' : plata(valor)}</strong>${badgeDato(false)}</div>
    ${pendientes ? '<p class="mini">El valor considera los productos con precio de referencia.</p>' : ''}
    <p class="mini">El peso de la estación está simulado para la demo.</p>
  </div>`;
}

function merma(id) {
  const c = S.capturas.find(x => x.id === id);
  if (!c) return { html: '', redirigir: 'b/estacion' };
  return {
    html: `${barra({ titulo: DESTINOS[c.destino], centro: true })}
    <div class="cuerpo">
      <div class="card aviso"><div class="fila entre"><span class="kpi"><span class="n md">${dec(c.kg)} kg</span></span><span class="badge horno">No se publica</span></div><span class="chico">${esc(c.producto)} · ${hhmm(new Date(c.t))}</span></div>
      <h2>¿Por qué elegiste este destino?</h2>
      <div class="chips">${(c.destino === 'basura' ? MOTIVOS_MERMA : ['No se vendió', 'Excedente del día', 'Otro motivo']).map(m => `<button class="chip${c.motivo === m ? ' on' : ''}" data-act="motivo" data-id="${c.id}" data-v="${m}">${esc(m)}</button>`).join('')}</div>
      <p class="chico">Con esto, Intelligence te puede decir qué conviene producir menos y qué comprar más seguido.</p>
      <div style="flex:1"></div>
      <button class="btn bloque" data-act="guardar-merma" data-id="${c.id}" ${c.motivo ? '' : 'disabled'}>Guardar</button>
    </div>`,
  };
}

// ---------------------------------------------------------------------------
// Retiros (B-12, B-13)
// ---------------------------------------------------------------------------
function retiros() {
  const rs = reservasMias();
  const ext = (S.externas || []).filter(x => x.dia === hoy());
  const act = [...rs.filter(r => r.estado === 'activa'), ...ext.filter(x => x.estado === 'activa')];
  const ret = [...rs.filter(r => r.estado === 'retirada'), ...ext.filter(x => x.estado === 'retirada')];
  const fila = (r, retirada) => `<div class="item"><span class="ic-caja">${icon(retirada ? 'check' : 'usuario', 20)}</span>
    <span class="col crece"><span class="fuerte">${esc(r.cliente)}${r.externa ? ' <span class="mini">· otro celu</span>' : ''}</span><span class="mini">Pack ${TAMANOS[r.tam]?.toLowerCase() || ''} · ${esc(r.cat)} · ${retiroTxt(miComercio(), r.retiroDesde, r.retiroHasta)}</span></span>
    ${retirada ? '<span class="badge">Retirado</span>' : `<span class="fuerte num" style="letter-spacing:.12em">${esc(r.code)}</span>`}</div>`;
  return {
    tabs: tabs('b/retiros'), clase: 'con-tabs gris',
    html: `${barra({ titulo: 'Retiros', atras: false, accion: `<span class="mini" style="padding-right:10px">Hoy</span>` })}
    <div class="cuerpo">
      <button class="btn bloque" data-go="b/escanear">${icon('escanear', 22)} Escanear el QR del cliente</button>
      <form class="fila" data-form="codigo" style="gap:8px">
        <input class="input crece input-codigo" name="codigo" placeholder="O escribí el código" aria-label="Código de retiro de 4 letras" maxlength="4" autocomplete="off" autocapitalize="characters" spellcheck="false" enterkeyhint="go">
        <button class="btn" style="flex:none;width:96px" type="submit">Validar</button>
      </form>
      <div class="seccion"><h3>Por retirar · ${act.length}</h3></div>
      ${act.length ? `<div class="lista">${act.map(r => fila(r, false)).join('')}</div>` : '<p class="chico">No hay retiros pendientes. Cuando alguien reserve, aparece acá.</p>'}
      ${ret.length ? `<div class="seccion"><h3>Retirados · ${ret.length}</h3></div><div class="lista">${ret.map(r => fila(r, true)).join('')}</div>` : ''}
      ${nota('Al cierre, lo que no se retiró pasa a "No retirado". La plata no se devuelve.')}
    </div>`,
  };
}

function escanearPantalla() {
  return {
    html: `${barra({ titulo: 'Escanear', cerrar: true, centro: true })}
    <div class="cuerpo">
      <div class="visor"><video id="video" muted playsinline></video><div class="marco"></div><div class="ayuda" id="ayuda">Apuntá al QR del cliente</div></div>
      <form class="fila" data-form="codigo" style="gap:8px">
        <input class="input crece input-codigo" name="codigo" placeholder="O escribí el código" aria-label="Código de retiro de 4 letras" maxlength="4" autocomplete="off" autocapitalize="characters" spellcheck="false" enterkeyhint="go">
        <button class="btn" style="flex:none;width:96px" type="submit">Validar</button>
      </form>
    </div>`,
    montar: async el => {
      const v = el.querySelector('#video');
      try {
        if (!navigator.mediaDevices?.getUserMedia || !window.isSecureContext) throw new Error('sin camara');
        await escanear(v, txt => validar(txt, true));
      } catch (e) {
        el.querySelector('.visor').innerHTML = `<div class="vacio" style="position:absolute;inset:0;justify-content:center;color:#fff">${icon('camara', 34)}<p style="color:#fff">No hay acceso a la cámara.<br>Escribí el código de 4 letras abajo.</p></div>`;
      }
    },
    desmontar: detener,
  };
}

export function validar(texto, desdeQr) {
  const t = String(texto || '').trim();
  const pl = leerPayload(t);
  const code = (pl ? pl.code : t).toUpperCase();
  if (pl && pl.comercioId !== 'c1') return resultado({ error: `Este QR es de otro local (${pl.comercio}).` });
  if (pl && pl.dia !== hoy()) return resultado({ error: 'Esta reserva es de otro día y ya venció.' });
  const local = reservasMias().find(r => r.code === code) || S.reservas.find(r => r.code === code && r.comercioId === 'c1');
  if (local?.dia === hoy() && pl && local.packId !== pl.packId) return resultado({ error: 'El QR no coincide con el pack reservado.' });
  let item = null, externa = false;
  if (local && (!pl || local.dia === hoy())) item = local;
  else if (pl) {
    S.externas = S.externas || [];
    item = S.externas.find(x => x.code === code && x.dia === hoy()) || { code, cliente: pl.cliente, tam: pl.tam, cat: pl.cat, dia: pl.dia, estado: 'activa', externa: true };
    if (!S.externas.includes(item)) S.externas.push(item);
    externa = true;
  } else {
    item = (S.externas || []).find(x => x.code === code && x.dia === hoy());
    externa = !!item;
  }
  if (!item) return resultado({ error: desdeQr ? 'Este QR no es de una reserva de Aprovecho.' : `No encontramos una reserva con el código ${code}.` });
  if (item.estado === 'retirada') return resultado({ error: `El pack de ${item.cliente} ya se entregó.` });
  if (item.estado === 'cancelada' || item.estado === 'sin_pack') return resultado({ error: 'Esta reserva fue cancelada.' });
  if (!reservaActiva(item)) return resultado({ error: 'Esta reserva venció.' });
  resultado({ item, externa });
}
function reservaActiva(r) {
  return r?.estado === 'activa' && r.dia === hoy() && ahora() < new Date(`${r.dia}T${r.retiroHasta || cierre()}:00`);
}
function resultado({ error, item, externa }) {
  vibrar(error ? [30, 40, 30] : 20);
  if (error) {
    abrirHoja(`<div class="vacio" style="padding:10px 0"><div class="circ" style="background:var(--rojo-50);color:var(--rojo)">${icon('alerta', 30)}</div><h2>No se puede entregar</h2><p class="chico">${esc(error)}</p></div><button class="btn bloque gris" data-act="cerrar-hoja">Entendido</button>`);
    return;
  }
  abrirHoja(`<div class="fila entre"><h2>Código ${esc(item.code)}</h2><span class="badge">Válido</span></div>
    <div class="card plana"><span class="fuerte" style="font-size:18px">${esc(item.cliente)}</span><span class="chico">Pack ${TAMANOS[item.tam]?.toLowerCase() || ''} · ${esc(item.cat)}</span>
    ${externa ? '<span class="mini">Reserva hecha en otro celular (demo sin servidor: los datos vienen en el QR).</span>' : ''}</div>
    <button class="btn bloque" data-act="entregar" data-code="${esc(item.code)}">${icon('check', 20)} Confirmar entrega</button>
    ${externa ? '' : `<button class="btn bloque sec" data-act="sin-pack" data-code="${esc(item.code)}">El pack no está disponible</button>`}
    <button class="btn bloque gris" data-act="cerrar-hoja">Cancelar</button>`);
}

// ---------------------------------------------------------------------------
// Impacto (B-14)
// ---------------------------------------------------------------------------
let periodoImp = 'semana';
export function impactoDatos(periodo, suc) {
  const dias = filtrar(periodo, suc, ahora());
  const r = resumen(dias);
  const mios = [...semillaMia(), ...misPacksHoy()];
  const rs = reservasMias();
  const retiradas = rs.filter(r => r.estado === 'retirada');
  r.ventas = r.recuperado + rs.filter(r => ['activa', 'retirada', 'no_retirada'].includes(r.estado)).reduce((a, r) => a + r.precio, 0);
  r.comision = r.ventas * CONFIG.comision;
  r.recuperado = r.ventas - r.comision;
  r.kgRescatado += retiradas.reduce((a, x) => a + (Number(x.pesoG) || 0), 0) / 1000;
  r.packsVend += retiradas.length;
  r.packsPub += mios.reduce((a, p) => a + (p.stockInicial || p.stock + (p.vendidos || 0)), 0);
  r.pctVend = r.packsPub ? r.packsVend / r.packsPub : 0;
  const mermaHoy = S.capturas.filter(c => c.dia === hoy() && c.destino === 'basura');
  r.mermaKg += mermaHoy.reduce((a, c) => a + c.kg, 0);
  for (const c of mermaHoy) r.porMotivo[c.motivo || 'Sin motivo'] = (r.porMotivo[c.motivo || 'Sin motivo'] || 0) + c.kg;
  r.co2 = co2(r.kgRescatado);
  return { r, dias };
}
function graficoImpacto(periodo, dias) {
  const pd = porDia(dias);
  if (periodo === 'semana') {
    const ult = pd.slice(-6);
    const hoyKg = reservasMias().filter(r => r.estado === 'retirada').reduce((a, r) => a + (Number(r.pesoG) || 0), 0) / 1000;
    const vals = [...ult.map(x => x.kgRescatado), hoyKg];
    const labs = [...ult.map(x => DIAS_CORTO[new Date(x.dia + 'T12:00').getDay()]), 'Hoy'];
    return { vals, labs, titulo: 'kg rescatados por día' };
  }
  if (periodo === 'mes') {
    const sem = [];
    for (let i = 0; i < pd.length; i += 7) sem.push(pd.slice(i, i + 7));
    return { vals: sem.map(s => s.reduce((a, x) => a + x.kgRescatado, 0)), labs: sem.map(s => ddmm(new Date(s[0].dia + 'T12:00'))), titulo: 'kg rescatados por semana' };
  }
  const meses = new Map();
  for (const x of pd) { const k = x.dia.slice(0, 7); meses.set(k, (meses.get(k) || 0) + x.kgRescatado); }
  const e = [...meses.entries()].slice(-8);
  return { vals: e.map(x => x[1]), labs: e.map(x => MESES[+x[0].slice(5) - 1].slice(0, 3)), titulo: 'kg rescatados por mes' };
}
function impacto() {
  const { r, dias } = impactoDatos(periodoImp, 'olivos');
  const g = graficoImpacto(periodoImp, dias);
  const smart = tienePlan('smart');
  const topMot = Object.entries(r.porMotivo).sort((a, b) => b[1] - a[1])[0];
  return {
    tabs: tabs('b/impacto'), clase: 'con-tabs gris',
    html: `${barra({ titulo: 'Impacto', atras: false, accion: `<button class="btn chico gris" data-go="b/reporte" style="margin-right:6px">${icon('bajar', 18)} Descargar</button>` })}
    <div class="cuerpo">
      <div class="seg">${[['semana', 'Semana'], ['mes', 'Mes'], ['todo', 'Desde el alta']].map(([k, t]) => `<button class="${periodoImp === k ? 'on' : ''}" data-act="periodo-imp" data-v="${k}">${t}</button>`).join('')}</div>
      <div class="card">
        <div class="kpi"><span class="n verde">${plata(r.recuperado)}</span><span class="k">Ingreso recuperado · neto de comisión</span></div>
        <span class="mini">Ventas ${plata(r.ventas)} · Comisión del 25% ${plata(r.comision)}</span>
        ${barras(g.vals, g.labs, { destacar: g.vals.length - 1, fmt: v => dec(v), alto: 130 })}
        <span class="mini">${g.titulo}</span>
      </div>
      <div class="stats">
        <div class="stat"><span class="n">${dec(r.kgRescatado)}</span><span class="k">kg recuperados</span>${badgeDato(false)}</div>
        <div class="stat"><span class="n">${dec(r.co2)}</span><span class="k">kg CO₂e de huella asociada</span>${badgeDato(false)}</div>
        <div class="stat"><span class="n">${r.packsVend}</span><span class="k">packs recuperados</span></div>
      </div>
      ${scoreTarjeta()}
      ${smart ? resumenEstacion() : ''}
      ${smart ? `<div class="card aviso">
          <div class="fila entre"><span class="fuerte">Tiraste ${dec(r.mermaKg)} kg</span><span class="badge horno">Merma</span></div>
          <span class="chico">El motivo principal: ${esc((topMot?.[0] || '').toLowerCase())} (${dec(topMot?.[1] || 0)} kg).</span>
          ${tienePlan('intelligence') ? '' : `<button class="link" data-act="ver-planes" style="align-self:flex-start">Intelligence te dice qué la genera ${icon('adelante', 16)}</button>`}
        </div>` : `<div class="card plana"><span class="fuerte">¿Querés saber cuánto tirás?</span><span class="chico">Con la estación de Smart se pesa lo que se tira y el dato pasa de estimado a medido.</span><button class="link" data-act="ver-planes" style="align-self:flex-start">Ver planes ${icon('adelante', 16)}</button></div>`}
      ${nota('Historial simulado. La huella asociada se estima con el factor de 2,53 kg CO₂e por kilo de alimento (FAO, 2013).')}
    </div>`,
  };
}

const SCORE_PESOS = [['Cumplimiento', 40], ['Reducción del excedente', 30], ['Calidad', 15], ['Transparencia', 15]];
function datosScore() {
  const desde = isoDia(sumarDias(ahora(), -29));
  const rs = S.reservas.filter(r => r.comercioId === 'c1' && r.dia >= desde && r.estado !== 'cancelada' && (r.estado !== 'activa' || !reservaActiva(r)));
  const calificaciones = rs.filter(r => r.calificacion);
  const reportesConfirmados = rs.filter(r => r.reporte?.confirmado).length;
  const packs = S.packs.filter(p => p.comercioId === 'c1' && p.dia >= desde && !p.id.startsWith('ps'));
  const cumplimiento = rs.length ? rs.filter(r => r.estado === 'retirada').length / rs.length : null;
  const calidad = calificaciones.length ? Math.max(0, (calificaciones.reduce((n, r) => n + r.calificacion / 5, 0) - reportesConfirmados) / calificaciones.length) : null;
  const transparencia = packs.length ? packs.filter(p => p.checklist).length / packs.length : null;
  const smart = tienePlan('smart');
  const serie = smart
    ? S.capturas.filter(c => c.tipo === 'pesaje').map(c => ({ dia: c.dia, valor: c.kg }))
    : S.packs.filter(p => p.comercioId === 'c1' && !p.id.startsWith('ps') && p.origen === 'foto').map(p => ({ dia: p.dia, valor: p.stockInicial }));
  const dias = new Map();
  for (const { dia, valor } of serie) dias.set(dia, (dias.get(dia) || 0) + valor);
  const media = (d, hasta) => {
    const inicio = isoDia(sumarDias(ahora(), -d));
    const fin = isoDia(sumarDias(ahora(), -hasta));
    const valores = [...dias.entries()].filter(([dia]) => dia >= inicio && dia <= fin).map(([, v]) => v);
    return valores.length ? valores.reduce((a, v) => a + v, 0) / valores.length : null;
  };
  const semanas = [1, 2, 3, 4].map(i => media(i * 7 + 6, i * 7));
  const actual = media(6, 0);
  const base = semanas.reduce((s, v) => s + v, 0) / semanas.length;
  const reduccion = semanas.includes(null) || actual == null || !base || cumplimiento == null ? null :
    (smart || cumplimiento >= .9) ? Math.max(0, Math.min(1, (base - actual) / base)) : 0;
  const valores = [cumplimiento, reduccion, calidad, transparencia];
  const puntos = valores.includes(null) ? null : Math.round(valores.reduce((s, v, i) => s + v * SCORE_PESOS[i][1], 0));
  return { valores, puntos, smart };
}
function scoreTarjeta() {
  const { puntos } = datosScore();
  return `<button class="card toque score-comercio" data-go="b/score">
    <div class="fila entre"><h2>APROVECHO Score</h2><span class="badge">${puntos == null ? 'Calibrando' : puntos + '/100'}</span></div>
    <span class="chico">Cumplí con las entregas y reducí lo que sobra.</span>
    <span class="fuerte verde">Ver Score y ranking del barrio ${icon('adelante', 16)}</span>
  </button>`;
}
function score() {
  const { valores, puntos, smart } = datosScore();
  const ejemplos = [
    { nombre: 'La Mesa de Olivos', puntos: 92, mejora: 4, retiros: 36, reportes: 0 },
    { nombre: 'Almacén del Río', puntos: 87, mejora: 8, retiros: 27, reportes: 0 },
    { nombre: 'Rotisería La Plaza', puntos: 81, mejora: 3, retiros: 18, reportes: 0 },
  ];
  const ranking = [...ejemplos, { nombre: miComercio().nombre, puntos, mio: true, calibrando: puntos == null }]
    .sort((x, y) => (y.puntos ?? -1) - (x.puntos ?? -1));
  const destacado = ejemplos.filter(x => x.puntos >= 80 && x.retiros >= 20 && !x.reportes).sort((a, b) => b.mejora - a.mejora)[0];
  return {
    html: `${barra({ titulo: 'Score y ranking' })}
    <div class="cuerpo">
      <div class="card">
        <div class="fila entre"><h1>APROVECHO Score</h1><span class="badge">${puntos == null ? 'Calibrando' : puntos + '/100'}</span></div>
        <p class="chico">El Score usa cuatro semanas de historial para comparar tu excedente con el de tu propio comercio.</p>
        ${SCORE_PESOS.map(([titulo, max], i) => `<div class="fila entre"><span>${titulo}</span>${i === 1 ? badgeDato(smart) : ''}<strong>${valores[i] == null ? '—' : Math.round(valores[i] * max)}/${max}</strong></div>`).join('')}
        <p class="mini">Reglas propuestas para la demo. ${smart ? '' : 'Base estima la reducción usando los packs publicados como referencia.'}</p>
      </div>
      <div class="seccion"><h2>Ranking de Olivos</h2><span class="badge gris">Ejemplo</span></div>
      <div class="lista">${ranking.map((x, i) => `<div class="item${x.mio ? ' mio' : ''}"><span class="ic-caja">${i + 1}</span><span class="col crece"><span class="fuerte">${x.nombre}${x.mio ? ' · vos' : ''}</span>${x.mio && x.calibrando ? '<span class="mini">Calibrando: las primeras 4 semanas no cuentan para el ranking.</span>' : ''}</span><strong>${x.puntos == null ? '—' : x.puntos + '/100'}</strong></div>`).join('')}</div>
      <div class="card sel"><span class="eti">Comercio del mes · Ejemplo</span><h2>${destacado.nombre}</h2><p class="chico">Fue el comercio elegible que más mejoró su Score este mes (+${destacado.mejora} puntos).</p></div>
    </div>`,
  };
}

// ---------------------------------------------------------------------------
// Cuenta (B-21)
// ---------------------------------------------------------------------------
function cuenta() {
  const pl = PLANES[S.plan];
  const sig = S.plan === 'basico' ? 'smart' : S.plan === 'smart' ? 'intelligence' : null;
  return {
    tabs: tabs('b/cuenta'), clase: 'con-tabs gris',
    html: `${barra({ titulo: 'Cuenta', atras: false })}
    <div class="cuerpo">
      <div class="card sel">
        <div class="fila entre"><h2>Plan ${pl.nombre}</h2><span class="badge">Activo</span></div>
        <div class="pila-s">${pl.incluye.map(x => `<span class="fila chico" style="gap:8px">${icon('check', 18, 'verde')}${esc(x)}</span>`).join('')}</div>
        <span class="mini">${esc(CONFIG.precios[S.plan].txt)} · ${esc(CONFIG.precios[S.plan].sub)} · precio de ejemplo</span>
      </div>
      ${sig ? `<div class="card"><span class="fuerte">Pasá a ${PLANES[sig].nombre}</span><span class="chico">${esc(PLANES[sig].lema)}</span><button class="btn chico" data-act="ver-planes" style="align-self:flex-start">Ver qué incluye</button></div>` : ''}
      <div class="lista">
        <button class="item" data-act="ver-carta"><span class="ic-caja">${icon('etiqueta', 20)}</span><span class="col crece"><span class="fuerte">Tu carta</span><span class="mini">${S.carta.length} productos</span></span>${icon('adelante', 20, 'chev')}</button>
        <button class="item" data-go="b/local"><span class="ic-caja">${icon('local', 20)}</span><span class="col crece"><span class="fuerte">Datos del local</span><span class="mini">Cierre ${cierre()} · packs al 50%</span></span>${icon('adelante', 20, 'chev')}</button>
        <button class="item" data-go="b/score"><span class="ic-caja">${icon('grafico', 20)}</span><span class="col crece"><span class="fuerte">APROVECHO Score</span><span class="mini">Ranking y comercio del mes</span></span>${icon('adelante', 20, 'chev')}</button>
        ${tienePlan('smart') ? `<button class="item" data-go="b/estacion"><span class="ic-caja">${icon('balanza', 20)}</span><span class="col crece"><span class="fuerte">${nombreEquipo()}</span><span class="mini">Conectada · calibrada hoy 08:10</span></span>${icon('adelante', 20, 'chev')}</button>` : ''}
        <button class="item" data-go="b/reporte"><span class="ic-caja">${icon('bajar', 20)}</span><span class="col crece"><span class="fuerte">Descargar reporte</span><span class="mini">Excel o PDF</span></span>${icon('adelante', 20, 'chev')}</button>
      </div>
      <span class="eti">Modo demo</span>
      <div class="card">
        <span class="fuerte">Plan de la demo</span>
        <div class="seg">${Object.entries(PLANES).map(([k, v]) => `<button class="${S.plan === k ? 'on' : ''}" data-act="plan-demo" data-v="${k}">${v.nombre}</button>`).join('')}</div>
      </div>
      <div class="lista">
        <button class="item" data-act="entrar-cliente"><span class="ic-caja">${icon('usuario', 20)}</span><span class="col crece"><span class="fuerte">Pasar al modo cliente</span><span class="mini">Para ver tus packs como los ve la gente</span></span>${icon('adelante', 20, 'chev')}</button>
        <button class="item" data-act="reiniciar"><span class="ic-caja" style="background:var(--rojo-50);color:var(--rojo)">${icon('refrescar', 20)}</span><span class="col crece"><span class="fuerte">Reiniciar la demo</span><span class="mini">Borra lo que hiciste en este celu</span></span></button>
      </div>
      ${instalarUI(true)}
    </div>`,
  };
}

function hojaPlanes({ demo = false } = {}) {
  const h = abrirHoja(`${demo ? '<div class="fila entre"><h2>Demo</h2><span class="badge gris">Modo local</span></div><span class="eti">Plan</span>' : '<h2>Planes</h2>'}
    ${Object.entries(PLANES).map(([k, v]) => `<button class="card toque${S.plan === k ? ' sel' : ''}" data-plan="${k}" style="text-align:left">
      <div class="fila entre"><h3 style="font-size:18px">${v.nombre}</h3>${S.plan === k ? '<span class="badge">Tu plan</span>' : ''}</div>
      <p class="chico">${esc(v.lema)}</p>
      <div class="pila-s">${v.incluye.map(x => `<span class="fila mini" style="gap:6px">${icon('check', 15, 'verde')}${esc(x)}</span>`).join('')}</div>
      <span class="fuerte verde">${esc(CONFIG.precios[k].txt)} <span class="mini" style="font-weight:600">${esc(CONFIG.precios[k].sub)}</span></span>
    </button>`).join('')}
    <p class="mini">Precios de ejemplo. En la demo el cambio es inmediato; en la vida real, Smart e Intelligence incluyen coordinar la instalación de la estación.</p>
    ${demo ? `<div class="lista">
      <button class="item" data-act="entrar-cliente"><span class="ic-caja">${icon('usuario', 20)}</span><span class="col crece"><span class="fuerte">Pasar al modo cliente</span><span class="mini">Ver tus packs como los ve la gente</span></span>${icon('adelante', 20, 'chev')}</button>
      <button class="item" data-act="reiniciar"><span class="ic-caja" style="background:var(--rojo-50);color:var(--rojo)">${icon('refrescar', 20)}</span><span class="col crece"><span class="fuerte">Reiniciar la demo</span><span class="mini">Borra lo que hiciste en este celu</span></span></button>
    </div>` : ''}`);
  h.addEventListener('click', e => { const b = e.target.closest('[data-plan]'); if (b) { cambiarPlan(b.dataset.plan); cerrarHoja(); } });
}
export function cambiarPlan(k) {
  if (S.plan === k) return;
  S.plan = k; evento('plan', { plan: k }); guardar();
  toast(`Demo en plan ${PLANES[k].nombre}`);
  const r = nav.ruta;
  if (r === 'b/intel' && k !== 'intelligence') nav.go('b/impacto', { raiz: true });
  else if (r === 'b/impacto' && k === 'intelligence') nav.go('b/intel', { raiz: true });
  else if (r === 'b/estacion' && k === 'basico') nav.go('b/hoy', { raiz: true });
  else nav.render();
}

// ---------------------------------------------------------------------------
// Reporte (B-22)
// ---------------------------------------------------------------------------
let rep = { periodo: 'mes', formato: 'xlsx', secciones: null, desde: null, hasta: null, generando: false };
function reporte() {
  const disp = seccionesDisponibles();
  if (!rep.secciones) rep.secciones = disp.map(s => s[0]);
  rep.secciones = rep.secciones.filter(s => disp.some(d => d[0] === s));
  const intel = tienePlan('intelligence');
  const f = d => isoDia(d);
  if (!rep.desde) { rep.desde = f(sumarDias(ahora(), -30)); rep.hasta = f(ahora()); }
  return {
    clase: 'gris',
    html: `${barra({ titulo: 'Descargar reporte', cerrar: true, centro: true })}
    <div class="cuerpo">
      <span class="eti">Período</span>
      <div class="seg">${[['semana', 'Semana'], ['mes', 'Mes'], ['todo', 'Desde el alta'], ['fechas', 'Fechas']].map(([k, t]) => `<button class="${rep.periodo === k ? 'on' : ''}" data-act="rep-periodo" data-v="${k}">${t}</button>`).join('')}</div>
      ${rep.periodo === 'fechas' ? `<div class="fila" style="gap:10px"><label class="campo crece"><span class="mini">Desde</span><input class="input" type="date" data-rep="desde" value="${rep.desde}" max="${f(ahora())}"></label><label class="campo crece"><span class="mini">Hasta</span><input class="input" type="date" data-rep="hasta" value="${rep.hasta}" max="${f(ahora())}"></label></div>` : ''}
      ${intel ? `<button class="card toque fila entre" data-act="elegir-sucursal" style="text-align:left"><span class="col"><span class="mini">Sucursal</span><span class="fuerte">${S.sucursal === 'todas' ? 'Todas las sucursales' : esc(SUCURSALES.find(s => s.id === S.sucursal).nombre)}</span></span>${icon('abajo', 20)}</button>` : ''}
      <span class="eti">Qué incluir</span>
      <div class="lista">${disp.map(([k, t]) => `<label class="item"><span class="crece fuerte">${esc(t)}</span><span class="switch"><input type="checkbox" data-act-change="rep-sec" data-v="${k}" ${rep.secciones.includes(k) ? 'checked' : ''}><i></i></span></label>`).join('')}</div>
      ${!tienePlan('smart') ? '<p class="mini">Merma, sugerencias y sucursales se suman con Smart e Intelligence.</p>' : ''}
      <span class="eti">Formato</span>
      <div class="fila-btns">
        ${[['xlsx', 'excel', 'Excel', 'Para analizar: una hoja por tema'], ['pdf', 'pdf', 'PDF', 'Para compartir: con tu marca']].map(([k, ic, t, s]) => `<button class="card toque${rep.formato === k ? ' sel' : ''}" data-act="rep-formato" data-v="${k}" style="text-align:left;flex:1">${icon(ic, 26, 'verde')}<span class="fuerte">${t}</span><span class="mini">${s}</span></button>`).join('')}
      </div>
      <p class="mini">Incluye cómo se calcula cada número. El archivo coincide con lo que ves en la app.</p>
      <button class="btn bloque${rep.secciones.length ? '' : ' off'}" data-act="descargar" id="btn-descargar">${icon('bajar', 20)} Descargar ${rep.formato === 'xlsx' ? 'Excel' : 'PDF'}</button>
    </div>`,
    montar: el => {
      el.querySelectorAll('[data-rep]').forEach(i => i.addEventListener('change', () => { rep[i.dataset.rep] = i.value; }));
    },
  };
}
async function descargar(b) {
  if (rep.generando) return;
  rep.generando = true;
  const car = cargando(rep.formato === 'xlsx' ? 'Armando tu Excel…' : 'Armando tu PDF…');
  try {
    const periodo = rep.periodo === 'fechas' ? { desde: rep.desde < rep.hasta ? rep.desde : rep.hasta, hasta: rep.desde < rep.hasta ? rep.hasta : rep.desde } : rep.periodo;
    const D = datosReporte({ periodo, suc: S.sucursal, secciones: rep.secciones });
    await esperar(150);
    const blob = rep.formato === 'xlsx' ? await armarExcel(D) : await armarPdf(D);
    const nombre = nombreArchivo(rep.formato, typeof periodo === 'object' ? periodo : null);
    car.listo('Listo');
    await esperar(450);
    car.cerrar();
    const r = await entregar(blob, nombre);
    evento('reporte', { formato: rep.formato, periodo: rep.periodo, secciones: rep.secciones.length });
    guardar();
    if (r !== 'cancelado') toast(`Listo: ${nombre}`, { ic: rep.formato === 'xlsx' ? 'excel' : 'pdf', sinTabs: true });
  } catch (e) {
    console.error(e);
    car.cerrar();
    toast(rep.formato === 'pdf' ? 'No se pudo armar el PDF. Revisá la conexión e intentá de nuevo.' : 'No se pudo armar el archivo. Intentá de nuevo.', { ic: 'alerta', sinTabs: true });
  } finally {
    rep.generando = false;
    nav.render();
  }
}

export const pantallas = {
  'b/plan': altaPlan, 'b/carta': altaCarta, 'b/local': altaLocal, 'b/hoy': hoyPantalla,
  'b/camara': camara, 'b/analizando': analizando, 'b/duda': duda, 'b/revisar': revisar, 'b/publicado': publicado,
  'b/estacion': estacion, 'b/merma': merma, 'b/retiros': retiros, 'b/escanear': escanearPantalla,
  'b/impacto': impacto, 'b/score': score, 'b/cuenta': cuenta, 'b/reporte': reporte,
};

export const acciones = {
  'entrar-comercio': () => {
    S.rol = 'comercio'; asegurarComercios(); guardar();
    nav.go(S.onboarding.hecho ? (tienePlan('intelligence') ? 'b/hoy' : 'b/hoy') : 'b/plan', { raiz: true });
  },
  'plan-alta': ds => { S.plan = ds.v; guardar(); nav.render(); },
  'leer-carta': async () => { const c = cargando('Leyendo tu lista de precios…'); await esperar(1500); c.listo(`Leí ${S.carta.length} productos`); await esperar(650); c.cerrar(); cartaLeida = true; nav.render(); },
  'editar-precio': ds => editarPrecio(ds.id),
  'cond-local': ds => { const i = S.condLocal.indexOf(ds.v); i >= 0 ? S.condLocal.splice(i, 1) : S.condLocal.push(ds.v); guardar(); nav.render(); },
  'terminar-alta': () => {
    const el = document.querySelector('.pantalla.actual');
    const c = miComercio();
    c.nombre = el.querySelector('#nom-local').value.trim() || c.nombre;
    c.cierre = el.querySelector('#cierre').value;
    S.descuento = .5;
    S.onboarding.hecho = true; guardar();
    toast('¡Listo! Ya podés publicar tu primer pack.');
    nav.go('b/hoy', { raiz: true });
  },
  'usar-muestra': ds => {
    const rec = RECONOCIMIENTO[ds.v];
    flujo = { ...rec, productos: rec.productos?.map(d => ({ ...d })), muestraId: ds.v, t0: Date.now(), cond: [], retiro: 0, correcciones: [] };
    evento('foto_analizada', { muestra: ds.v, confianza: rec.confianza });
    nav.go('b/analizando');
  },
  'elegir-duda': ds => { flujo.elegido = ds.v; const p = producto(ds.v); if (p.u === 'kg' && flujo.kgDuda == null) flujo.kgDuda = 1; nav.render(); },
  'duda-menos': () => { const p = producto(flujo.elegido || flujo.opciones?.[0]?.[0]); if (p?.u === 'kg') flujo.kgDuda = Math.max(.1, Math.round((flujo.kgDuda - .1) * 10) / 10); else flujo.unidadesDuda = Math.max(1, flujo.unidadesDuda - 1); nav.render(); },
  'duda-mas': () => { const p = producto(flujo.elegido || flujo.opciones?.[0]?.[0]); if (p?.u === 'kg') flujo.kgDuda = Math.round((flujo.kgDuda + .1) * 10) / 10; else flujo.unidadesDuda += 1; nav.render(); },
  'confirmar-duda': () => {
    const id = flujo.elegido || flujo.opciones?.[0]?.[0];
    const p = producto(id);
    if (!p) return;
    registrarCorreccion('producto', flujo.producto || null, id);
    flujo.producto = id;
    if (p.u === 'kg') { flujo.kg = flujo.kgDuda; flujo.unidades = null; } else { if (flujo.unidades && flujo.unidades !== flujo.unidadesDuda) registrarCorreccion('unidades', flujo.unidades, flujo.unidadesDuda); flujo.unidades = flujo.unidadesDuda; flujo.kg = null; }
    flujo.confianza = 1; flujo.revisado = true;
    evento('correccion_ia', { tipo: 'baja_confianza', producto: id });
    armarFlujo();
    nav.go('b/revisar', { replace: true });
  },
  'otro-producto': ds => {
    const h = abrirHoja(`<h2>¿Qué es?</h2><div class="lista">${S.carta.filter(p => p.precio != null).map(p => `<button class="item" data-p="${p.id}"><span class="col crece"><span class="fuerte">${esc(p.nombre)}</span><span class="mini">${esc(p.cat)} · ${plata(p.precio)}${p.u === 'kg' ? '/kg' : ''}</span></span></button>`).join('')}</div>`);
    h.addEventListener('click', e => {
      const b = e.target.closest('[data-p]'); if (!b) return;
      cerrarHoja();
      const p = producto(b.dataset.p);
      if (nav.ruta === 'b/duda') { flujo.elegido = p.id; nav.render(); return; }
      const d = detecciones(flujo)[Number(ds.i || 0)];
      const pesoAnterior = pesoDeteccion(d);
      registrarCorreccion('producto:' + (ds.i || 0), d.producto, p.id);
      d.producto = p.id;
      d.kg = p.u === 'kg' ? flujo.pesoBalanza || pesoAnterior : null;
      d.unidades = p.u === 'kg' ? null : d.unidades || Math.max(1, Math.round(pesoAnterior * 1000 / p.peso));
      d.revisado = true;
      flujo.alergenos = undefined;
      if (flujo.check) flujo.check.alergenos = false;
      armarFlujo(); nav.render();
    });
  },
  'cant-menos': ds => cambiarCant(Number(ds.i), -1),
  'cant-mas': ds => cambiarCant(Number(ds.i), 1),
  'quitar-pack': ds => { const p = flujo.packs[+ds.i]; p.stock -= 1; if (p.stock <= 0) flujo.packs.splice(+ds.i, 1); nav.render(); },
  retiro: ds => { flujo.retiro = +ds.v; nav.render(); },
  'cond-pack': ds => {
    const i = flujo.cond.indexOf(ds.v);
    if (i >= 0) flujo.cond.splice(i, 1); else flujo.cond.push(ds.v);
    if (ds.v === 'Sin TACC' && flujo.check) flujo.check.alergenos = false;
    nav.render();
  },
  publicar: async () => {
    if (!flujo?.packs?.length) return;
    const alerg = alergenosDetectados(flujo).trim();
    const ok = await confirmar({
      titulo: 'Antes de publicar, confirmá',
      lista: [
        'La comida es de hoy y está en buen estado.',
        'Mantuviste la cadena de frío cuando corresponde.',
        alerg ? `Alérgenos informados: ${alerg}.` : 'Este lote no declara alérgenos.',
      ],
      si: 'Confirmo y publico', no: 'Volver a revisar',
    });
    if (!ok) return;
    const ids = publicar();
    if (ids.length) nav.go('b/publicado/' + ids.join(','), { replace: true });
  },
  'opciones-pack': ds => opcionesPack(ds.id),
  'simular-pesaje': () => {
    const i = (S.capturas.filter(c => c.tipo === 'pesaje').length) % PESAJES.length;
    enBalanza = { ...PESAJES[i], kg: Math.round(PESAJES[i].kg * (0.92 + Math.random() * .16) * 100) / 100, listo: false };
    nav.render();
  },
  'pesaje-vender': () => pesajeVender(),
  'destino-pesaje': ds => {
    const b = enBalanza;
    if (!b?.listo || !['donado', 'reutilizado', 'basura'].includes(ds.v) || (b.soloBasura && ds.v !== 'basura')) return;
    const prod = producto(b.producto);
    const c = { id: uid('cap'), dia: hoy(), t: ahora().getTime(), tipo: 'pesaje', producto: prod?.nombre || b.nombre,
      productoId: b.producto, kg: b.kg, confianza: b.conf, destino: ds.v, motivo: null,
      valor: prod?.precio ? (prod.u === 'kg' ? b.kg : b.unidades) * prod.precio : null };
    S.capturas.push(c); enBalanza = null; guardar();
    evento('pesaje', { destino: ds.v, kg: b.kg });
    nav.go('b/merma/' + c.id);
  },
  motivo: ds => { const c = S.capturas.find(x => x.id === ds.id); c.motivo = ds.v; vibrar(6); nav.render(); },
  'guardar-merma': ds => {
    const c = S.capturas.find(x => x.id === ds.id);
    if (!c?.motivo) return;
    guardar();
    toast(`${DESTINOS[c.destino]}: ${dec(c.kg)} kg · ${c.motivo.toLowerCase()}`, { ic: 'check', sinTabs: true });
    nav.atras();
  },
  entregar: ds => {
    const r = reservasMias().find(x => x.code === ds.code) || (S.externas || []).find(x => x.code === ds.code && x.dia === hoy());
    if (!reservaActiva(r)) { cerrarHoja(); toast('La reserva ya no está activa.', { ic: 'alerta' }); return; }
    r.estado = 'retirada'; r.retirada = ahora().getTime();
    if (!r.externa) sumarAlPerfil(r);
    evento('retiro', { code: r.code, externa: !!r.externa });
    guardar(); cerrarHoja(); vibrar(30);
    toast(`Entregado a ${r.cliente}`);
    if (nav.ruta === 'b/escanear') nav.atras(); else nav.render();
  },
  'sin-pack': async ds => {
    const r = reservasMias().find(x => x.code === ds.code);
    if (!reservaActiva(r)) return;
    cerrarHoja(true);
    const ok = await confirmar({ titulo: '¿El pack no está disponible?', texto: 'Se cancela la reserva y se registra un reintegro simulado para el cliente.', si: 'Cancelar la reserva', peligro: true });
    if (!ok || !reservaActiva(r)) return;
    r.estado = 'sin_pack';
    r.reintegro = r.pagado ?? r.precio;
    const p = S.packs.find(p => p.id === r.packId);
    if (p) p.vendidos = Math.max(0, (p.vendidos || 0) - 1);
    evento('sin_pack', { code: r.code });
    guardar();
    toast('Reserva cancelada. Registramos el reintegro.');
    if (nav.ruta === 'b/escanear') nav.atras(); else nav.render();
  },
  'cerrar-hoja': () => cerrarHoja(),
  'periodo-imp': ds => { periodoImp = ds.v; nav.render(); },
  'ver-planes': () => hojaPlanes(),
  'elegir-plan-demo': () => hojaPlanes({ demo: true }),
  'plan-demo': ds => cambiarPlan(ds.v),
  'ver-carta': () => {
    const h = abrirHoja(`<h2>Tu carta</h2><p class="chico">Tocá un producto para cambiar el precio.</p><div class="lista">${S.carta.map(p => `<button class="item" data-p="${p.id}"><span class="col crece"><span class="fuerte trunc2">${esc(p.nombre)}</span><span class="mini">${p.u === 'kg' ? 'por kg' : gramos(p.peso) + ' por unidad'}</span></span><span class="fuerte">${p.precio == null ? '—' : plata(p.precio)}</span></button>`).join('')}</div>`);
    h.addEventListener('click', e => { const b = e.target.closest('[data-p]'); if (b) { cerrarHoja(true); editarPrecio(b.dataset.p); } });
  },
  'rep-periodo': ds => { rep.periodo = ds.v; nav.render(); },
  'rep-formato': ds => { rep.formato = ds.v; nav.render(); },
  descargar: (ds, b) => descargar(b),
  'elegir-sucursal': () => elegirSucursal(),
  reiniciar: async () => {
    const ok = await confirmar({ titulo: '¿Reiniciar la demo?', texto: 'Se borra todo lo que hiciste en este celu: packs, reservas, pesajes y ajustes.', si: 'Reiniciar', peligro: true });
    if (!ok) return;
    reiniciar(); cartaLeida = false; flujo = null;
    toast('Demo reiniciada', { sinTabs: true });
    nav.go('bienvenida', { raiz: true });
  },
};

export const accionesCambio = {
  'foto-propia': input => {
    const f = input.files && input.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    flujo = { fotoUrl: url, t0: Date.now(), confianza: 0, cond: [], retiro: 0, correcciones: [], unidades: 6 };
    evento('foto_analizada', { propia: true });
    nav.go('b/analizando');
  },
  'alergenos-pack': input => { flujo.alergenos = input.value; },
  'rep-sec': input => { const v = input.dataset.v; const i = rep.secciones.indexOf(v); if (input.checked && i < 0) rep.secciones.push(v); if (!input.checked && i >= 0) rep.secciones.splice(i, 1); nav.render(); },
};

export const formularios = {
  codigo: form => {
    const v = form.codigo.value.trim().toUpperCase();
    if (v.length !== 4) { toast('El código tiene 4 caracteres.', { ic: 'alerta' }); return; }
    form.codigo.value = '';
    form.codigo.blur();
    validar(v, false);
  },
};

// ---------------------------------------------------------------------------
function cambiarCant(i, paso) {
  const d = detecciones(flujo)[i];
  const prod = producto(d.producto);
  const campo = prod.u === 'kg' ? 'kg' : 'unidades';
  if (campo === 'kg' && flujo.medido) return;
  const anterior = d[campo];
  d[campo] = campo === 'kg' ? Math.max(.1, Math.round((anterior + paso * .1) * 10) / 10) : Math.max(1, anterior + paso);
  registrarCorreccion(campo + ':' + i, anterior, d[campo]);
  d.revisado = true;
  armarFlujo();
  nav.render();
}

function editarPrecio(id) {
  const p = producto(id);
  const h = abrirHoja(`<h2>${esc(p.nombre)}</h2>
    <div class="campo"><label for="precio">Precio de venta${p.u === 'kg' ? ' por kg' : ''}</label><input class="input" id="precio" inputmode="numeric" pattern="[0-9]*" value="${p.precio ?? ''}" placeholder="Ej. 4000"></div>
    ${p.u === 'kg' ? '' : `<div class="campo"><label for="peso">Peso por unidad (g)</label><input class="input" id="peso" inputmode="numeric" pattern="[0-9]*" value="${p.peso}"></div>`}
    <button class="btn bloque" data-ok>Guardar</button>`);
  h.querySelector('[data-ok]').addEventListener('click', () => {
    const v = parseInt(h.querySelector('#precio').value.replace(/\D/g, ''), 10);
    if (!v || v < 50) { toast('Poné un precio válido.', { ic: 'alerta', sinTabs: true }); return; }
    p.precio = v;
    const peso = h.querySelector('#peso'); if (peso) { const g = parseInt(peso.value.replace(/\D/g, ''), 10); if (g > 0) p.peso = g; }
    guardar(); cerrarHoja(); nav.render();
  });
}

function opcionesPack(id) {
  const p = S.packs.find(x => x.id === id);
  if (!p) return;
  const reservado = (p.vendidos || 0) > 0;
  const h = abrirHoja(`<h2>${esc(p.titulo || 'Pack')}</h2>
    <p class="chico">${TAMANOS[p.tam]} · ${plata(p.precio)} · ${p.vendidos || 0} vendidos · quedan ${p.stock}</p>
    <div class="lista">
      <button class="item" data-o="ver"><span class="ic-caja">${icon('usuario', 20)}</span><span class="crece fuerte">Ver cómo lo ve el cliente</span></button>
      ${p.stock > 0 ? `<button class="item" data-o="bajar"><span class="ic-caja" style="background:var(--rojo-50);color:var(--rojo)">${icon('basura', 20)}</span><span class="col crece"><span class="fuerte">${reservado ? 'Bajar lo que queda' : 'Bajar el pack'}</span><span class="mini">${reservado ? 'Las reservas ya hechas se mantienen' : 'Deja de verse en el mapa'}</span></span></button>` : ''}
      ${tienePlan('smart') && p.medido && p.stock > 0 ? `<button class="item" data-o="destino"><span class="ic-caja">${icon('balanza', 20)}</span><span class="col crece"><span class="fuerte">Registrá el destino de lo que queda</span><span class="mini">Doná, reutilizá o descartá los packs disponibles.</span></span></button>` : ''}
    </div>`);
  h.addEventListener('click', e => {
    const b = e.target.closest('[data-o]'); if (!b) return;
    cerrarHoja(true);
    if (b.dataset.o === 'ver') nav.go('c/pack/' + p.id);
    else if (b.dataset.o === 'destino') destinoDePack(p);
    else { p.stock = 0; p.estado = 'bajado'; guardar(); toast('Pack bajado'); nav.render(); }
  });
}

function destinoDePack(p) {
  const h = abrirHoja(`<h2>Destino de los packs disponibles</h2>
    <p class="chico">Se aplica a los ${p.stock} packs que quedan. Las reservas siguen activas.</p>
    <label class="campo">Destino<select class="input" data-destino>
      <option value="">Elegí un destino</option><option value="donado">Donar</option><option value="reutilizado">Reutilizar</option><option value="basura">Descartar</option>
    </select></label>
    <label class="campo">Motivo<input class="input" data-motivo maxlength="120" placeholder="Ej. No se vendieron"></label>
    <button class="btn bloque" data-guardar>Registrar destino</button>`);
  h.querySelector('[data-guardar]').addEventListener('click', () => {
    const destino = h.querySelector('[data-destino]').value;
    const motivo = h.querySelector('[data-motivo]').value.trim();
    if (!destino || !motivo) { toast('Elegí un destino e ingresá el motivo.', { ic: 'alerta', sinTabs: true }); return; }
    if (!S.packs.includes(p) || p.stock <= 0) { cerrarHoja(); toast('Ya no quedan packs disponibles.'); return; }
    S.capturas.push({ id: uid('cap'), dia: hoy(), t: ahora().getTime(), tipo: 'destino', origenCapturaId: p.capturaId,
      producto: p.titulo, productoId: p.productoId, kg: p.pesoG * p.stock / 1000, destino, motivo });
    p.stock = 0;
    p.estado = 'bajado';
    guardar(); cerrarHoja(); toast('Destino registrado.'); nav.render();
  });
}

function pesajeVender() {
  const b = enBalanza;
  if (!b?.listo || !b.producto || b.soloBasura) return;
  const prod = producto(b.producto);
  flujo = { producto: prod.id, kg: prod.u === 'kg' ? b.kg : null, unidades: prod.u === 'kg' ? null : b.unidades,
    pesoBalanza: b.kg, confianza: b.conf, medido: true, muestraId: b.muestra, t0: Date.now(), cond: [], retiro: 0, correcciones: [] };
  armarFlujo();
  nav.go('b/revisar');
}

export function elegirSucursal() {
  const h = abrirHoja(`<h2>Sucursal</h2><div class="lista">${[['todas', 'Todas las sucursales'], ...SUCURSALES.map(s => [s.id, s.nombre])].map(([k, t]) => `<button class="item" data-s="${k}"><span class="ic-caja">${icon(k === 'todas' ? 'sucursales' : 'local', 20)}</span><span class="crece fuerte">${esc(t)}</span>${S.sucursal === k ? icon('check', 22, 'verde') : ''}</button>`).join('')}</div>`);
  h.addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (b) { S.sucursal = b.dataset.s; guardar(); cerrarHoja(); nav.render(); } });
}
