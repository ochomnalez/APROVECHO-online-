// Pantallas del consumidor.
import { esc, plata, dec, num, distanciaM, distTxt, gramos, pad, vibrar, esperar, codigo, uid } from './util.js';
import { icon } from './icons.js';
import { S, guardar, ahora, hoy, comercio, packsActivos, evento, ubicar, ZONA_NORTE, producto } from './store.js';
import { CONFIG, CATEGORIAS, CONDICIONES, TAMANOS, nutricion, co2, CATS_GRANDES, CATS_CHICAS, BANNERS, BUSQUEDAS } from './data.js';
import { barra, tabsCliente, abrirHoja, cerrarHoja, confirmar, toast, vacio, nota, demoBtnCliente, spinner, cargando, carrusel } from './ui.js';
import { ilus, logoLocal, fondoCategoria } from './ilus.js';
import { fotoComercio, fotoCategoria } from './fotos.js';
import { montarMapa, ponerPines, enfocar } from './mapa.js';
import { qrSvg, payload } from './qr.js';
import { nav } from './nav.js';
import { instalarUI } from './pwa.js';

const ZONAS = [
  ['Olivos', -34.5087, -58.4877], ['Vicente López', -34.5262, -58.4747], ['Martínez', -34.4926, -58.5057],
  ['San Isidro', -34.4708, -58.5286], ['Pilar', -34.4587, -58.9140], ['Belgrano, CABA', -34.5627, -58.4563],
  ['Palermo, CABA', -34.5780, -58.4265],
];

// ---------------------------------------------------------------------------
// helpers de packs para el consumidor
// ---------------------------------------------------------------------------
function inicioRetiro(c, desde) {
  if (desde) return desde;
  const [h, m] = c.cierre.split(':').map(Number);
  return `${pad((h + 23) % 24)}:${pad(m)}`;
}
export const retiroTxt = (c, desde, hasta = c.cierre) => `${inicioRetiro(c, desde)} – ${hasta}`;
const retiroPack = p => retiroTxt(p.c, p.retiroDesde, p.retiroHasta);
function horarioReserva(r, c) {
  const p = S.packs.find(x => x.id === r.packId && x.dia === r.dia);
  return { desde: inicioRetiro(c, r.retiroDesde || p?.retiroDesde), hasta: r.retiroHasta || p?.retiroHasta || c.cierre };
}
const retiroReserva = (r, c) => { const { desde, hasta } = horarioReserva(r, c); return retiroTxt(c, desde, hasta); };
const sello = tam => `<img src="./img/sello-aprovecho.webp" width="${tam}" height="${tam}" alt="APROVECHO" class="sello-cliente">`;
const fotoPack = (p, carga) => `<img class="foto-pack-cliente" src="${esc(fotoComercio(p.comercioId, p.cat, p.tam, p.productoId))}" alt=""${carga ? ' loading="lazy"' : ''}>`;
export function nutriPack(p) {
  const n100 = p.nutri100 || producto(p.productoId)?.nutri;
  return n100 && p.pesoG > 0 ? nutricion(n100, p.pesoG, p.medido ? 0.08 : CONFIG.rangoNutri) : null;
}
const zonaTxt = () => (S.ubic?.fuente === 'gps' ? 'Tu ubicación' : (S.ubic?.barrio || 'Olivos'));
const rating = c => String(c.rating).replace('.', ',');

function conDatos(p) { const c = comercio(p.comercioId); return { ...p, c, dist: distanciaM(S.ubic || ZONA_NORTE, c) }; }
const todosLosPacks = () => packsActivos().filter(packReservable).map(conDatos).sort((a, b) => a.dist - b.dist);

function packsVisibles() {
  const f = S.filtros;
  const q = (buscarMapa || '').trim().toLowerCase();
  return todosLosPacks().filter(p =>
    (!f.tam.length || f.tam.includes(p.tam)) &&
    (!f.cond.length || f.cond.every(x => p.cond.includes(x))) &&
    (!f.cat.length || f.cat.includes(p.cat)) &&
    p.dist <= f.distKm * 1000 &&
    (!q || p.c.nombre.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)),
  );
}
const filtrosActivos = () => S.filtros.tam.length + S.filtros.cond.length + S.filtros.cat.length + (S.filtros.distKm !== 3 ? 1 : 0);
let buscarMapa = '';
let selMapa = null;
let alturaHoja = 'media';

export function tarjetaPack(p, ancha = false) {
  const c = p.c;
  return `<button class="tarjeta-pack${ancha ? ' ancha' : ''}" data-go="c/pack/${p.id}">
    <div class="tp-img" style="background:${fondoCategoria[p.cat] || '#F1F6EE'}">
      ${fotoPack(p, true)}
      <span class="badge oferta b-izq">50% de descuento</span>
      ${p.stock <= 2 ? `<span class="badge oscuro b-der">${p.stock === 1 ? 'Queda 1' : 'Quedan 2'}</span>` : ''}
      <span class="tp-logo">${logoLocal(c, 44, 13)}</span>
    </div>
    <div class="tp-cuerpo">
      <div class="tp-cab"><b class="trunc">${esc(c.nombre)}</b><span class="tp-rating"><span class="estrella-mini">★</span>${rating(c)}</span></div>
      <span class="tp-meta">Pack ${TAMANOS[p.tam].toLowerCase()} · ${esc(p.cat)}${p.cond.length ? ' · ' + esc(p.cond.join(', ')) : ''}</span>
      <div class="tp-pie"><span class="tp-precio"><strong>${plata(p.precio)}</strong><span class="tachado">${plata(p.valor)}</span></span><span class="tp-retiro">${icon('reloj', 13)}${retiroPack(p).replaceAll(':00', '')} h · ${distTxt(p.dist)}</span></div>
    </div>
  </button>`;
}
function tarjetaLocal(c) {
  const packs = packsActivos().filter(p => p.comercioId === c.id && packReservable(p));
  const desde = packs.length ? Math.min(...packs.map(p => p.precio)) : null;
  return `<button class="tarjeta-local" data-go="c/local/${c.id}">${logoLocal(c, 96, 24, true)}
    <b>${esc(c.corto || c.nombre)}</b>
    <span class="mini">${desde ? `desde ${plata(desde)}` : 'Sin packs hoy'}</span></button>`;
}

// ---------------------------------------------------------------------------
// Bienvenida
// ---------------------------------------------------------------------------
function bienvenida() {
  return {
    html: `<div class="cuerpo centro" style="gap:22px;padding-top:calc(30px + var(--st))">
      <div class="pila aparece" style="align-items:center;gap:12px;text-align:center">
        ${sello(150)}
        <h1 class="wordmark" style="font-size:38px;line-height:1">APROVECHO</h1>
        <p style="color:var(--tinta-2);font-size:17px">Menos desperdicio, más aprovecho</p>
      </div>
      <p class="chico aparece" style="text-align:center;max-width:32ch;align-self:center;font-size:15px;animation-delay:.08s">Comida rica que sobró en los locales de tu barrio, a mitad de precio. Reservás, pasás a buscarla y listo.</p>
      <div class="pila aparece" style="animation-delay:.14s;margin-top:6px">
        <button class="btn bloque" data-act="entrar-cliente">Entrar como cliente</button>
        <button class="btn bloque sec" data-act="entrar-comercio">${icon('local', 20)} Entrar como local</button>
      </div>
      ${instalarUI()}
      <p class="mini" style="text-align:center">Demo de validación · los datos son simulados</p>
    </div>`,
  };
}

// ---------------------------------------------------------------------------
// Ubicación
// ---------------------------------------------------------------------------
function ubicacion() {
  return {
    html: `${barra({ titulo: '', atras: true })}
    <div class="cuerpo" style="gap:18px">
      <div style="align-self:center;margin-top:10px">${ilus('pin', 150)}</div>
      <h1 class="gran-titulo" style="text-align:center">Mostrame lo que hay cerca</h1>
      <p class="chico" style="text-align:center;font-size:15px">Usamos tu ubicación solo para ordenar los packs por distancia. No se guarda en ningún servidor.</p>
      <div style="flex:1"></div>
      <button class="btn bloque" data-act="usar-gps">${icon('ubicar', 20)} Usar mi ubicación</button>
      <button class="btn bloque sec" data-act="elegir-zona">Elegir una zona a mano</button>
    </div>`,
  };
}

// ---------------------------------------------------------------------------
// Inicio: la pantalla principal, al estilo de las apps de delivery
// ---------------------------------------------------------------------------
let primeraVezInicio = true;
function inicio() {
  const todos = todosLosPacks();
  const cerca = [...new Map(todos.map(p => [p.c.id, p.c])).values()];
  const agotan = todos.filter(p => p.stock <= 2).sort((a, b) => a.stock - b.stock);
  const mejores = [...todos].sort((a, b) => b.c.rating - a.c.rating).slice(0, 6);
  const k = S.consumidor;
  const txtBanner = t => t.replace('{kg}', dec(k.kg)).replace('{co2}', dec(co2(k.kg)));
  const esqueleto = primeraVezInicio;
  const limpiar = [];
  return {
    tabs: tabsCliente('c/inicio', S.reservas.filter(r => reservaActiva(r)).length),
    clase: 'con-tabs inicio',
    html: `<div class="cuerpo" id="scroll-inicio">
      <div class="inicio-enc">
        <button class="zona-btn" data-act="elegir-zona" aria-label="Cambiar de zona"><span class="mini">Retirá cerca de</span><b><span>${esc(zonaTxt())}</span>${icon('abajo', 18)}</b></button>
        ${demoBtnCliente()}
        <button class="avatar-perfil" data-tab="c/perfil" aria-label="Perfil">${esc((S.perfil.nombre || '?').charAt(0).toUpperCase())}</button>
      </div>
      <div class="pegajoso" id="pegajoso">
        <div class="zona-mini">${icon('pin', 16, 'verde')}<span class="trunc">${esc(zonaTxt())}</span></div>
        <button class="buscar-grande" data-go="c/buscar" aria-label="Buscar">${icon('buscar', 22)}<span class="rota" id="rota"><span>Buscá “${BUSQUEDAS[0]}”</span></span></button>
      </div>
      <div id="contenido-inicio">${esqueleto ? esqueletoInicio() : contenidoInicio(todos, cerca, agotan, mejores, txtBanner)}</div>
    </div>
    <button class="volver-arriba" id="volver-arriba">${icon('arriba', 16)} Volver arriba</button>`,
    montar: el => {
      const sc = el.querySelector('#scroll-inicio'), peg = el.querySelector('#pegajoso'), va = el.querySelector('#volver-arriba');
      const alScroll = () => {
        const y = sc.scrollTop;
        peg.classList.toggle('con-sombra', y > 56);
        va.classList.toggle('ver', y > 760);
      };
      sc.addEventListener('scroll', alScroll, { passive: true });
      va.addEventListener('click', () => sc.scrollTo({ top: 0, behavior: 'smooth' }));
      // sugerencias del buscador que van rotando
      let bi = 0;
      const rota = el.querySelector('#rota');
      const ti = setInterval(() => { bi = (bi + 1) % BUSQUEDAS.length; rota.innerHTML = `<span>Buscá “${esc(BUSQUEDAS[bi])}”</span>`; }, 2600);
      limpiar.push(() => clearInterval(ti));
      const arrancar = () => { const c = el.querySelector('.carrusel'); if (c) limpiar.push(carrusel(c)); };
      if (esqueleto) {
        primeraVezInicio = false;
        const t = setTimeout(() => {
          const cont = el.querySelector('#contenido-inicio');
          if (!cont) return;
          cont.innerHTML = contenidoInicio(todos, cerca, agotan, mejores, txtBanner);
          cont.classList.add('anim-fade');
          arrancar();
        }, 650);
        limpiar.push(() => clearTimeout(t));
      } else arrancar();
    },
    desmontar: () => { limpiar.forEach(f => f()); limpiar.length = 0; },
  };
}
function contenidoInicio(todos, cerca, agotan, mejores, txtBanner) {
  return `
    <div class="bloque-inicio demo-marcas"><span class="badge gris">Demo</span><span>Marcas de referencia · ofertas y distancias simuladas.</span></div>
    <div class="bloque-inicio" style="margin-top:6px"><div class="cats-grandes">
      ${CATS_GRANDES.map(c => `<button class="cat-grande categoria-con-foto" data-go="c/lista/${encodeURIComponent(c.id)}" style="background:${c.fondo}">${fotoPack({ cat: c.id }, true)}<b style="color:${c.tinta}">${c.titulo}</b></button>`).join('')}
    </div></div>
    <div class="carril" style="margin-top:12px">
      ${CATS_CHICAS.map(c => `<button class="cat-chica categoria-con-foto" data-go="c/lista/${encodeURIComponent(c.id)}" style="background:${c.fondo}">${fotoPack({ cat: c.id }, true)}<span>${c.titulo}</span></button>`).join('')}
    </div>
    <div class="carrusel">
      <div class="pista">${BANNERS.map(b => `<button class="banner ${b.tono}" ${b.ir ? `data-go="${b.ir}"` : `data-act="${b.act}"`}>
        <span class="b-deco"></span>
        <span class="b-eti">${esc(b.eti)}</span>
        <h3>${esc(txtBanner(b.titulo))}</h3>
        <p>${esc(txtBanner(b.texto))}</p>
        <span class="b-cta">${esc(b.cta)} ${icon('adelante', 15)}</span>
        <span class="b-arte">${fotoPack({ cat: ({merienda:'Panificados',sintacc:'Sin TACC',compartir:'agotan',impacto:'Vegano'})[b.id] }, true)}</span>
      </button>`).join('')}</div>
      <div class="puntos">${BANNERS.map(() => '<i></i>').join('')}</div>
    </div>
    <div class="bloque-inicio seccion" style="margin-top:22px"><h2>Cerca tuyo</h2><button class="flecha-redonda" data-tab="c/mapa" aria-label="Ver en el mapa">${icon('adelante', 18)}</button></div>
    <div class="carril" style="margin-top:6px">${cerca.map(tarjetaLocal).join('')}</div>
    ${agotan.length ? `<div class="bloque-inicio seccion" style="margin-top:18px"><h2>Se agotan pronto</h2><button class="flecha-redonda" data-go="c/lista/agotan" aria-label="Ver todos">${icon('adelante', 18)}</button></div>
    <div class="carril" style="margin-top:6px">${agotan.map(p => tarjetaPack(p)).join('')}</div>` : ''}
    <div class="bloque-inicio seccion" style="margin-top:18px"><h2>Los mejor puntuados</h2><button class="flecha-redonda" data-go="c/lista/mejores" aria-label="Ver todos">${icon('adelante', 18)}</button></div>
    <div class="carril" style="margin-top:6px">${mejores.map(p => tarjetaPack(p)).join('')}</div>
    <div class="bloque-inicio seccion" style="margin-top:18px"><h2>Todos los packs</h2><span class="mini">${todos.length} cerca tuyo</span></div>
    <div class="bloque-inicio pila" style="margin-top:8px;gap:14px">${todos.length ? todos.map(p => tarjetaPack(p, true)).join('') : vacio('bolsa', 'No hay packs cerca ahora', 'Suelen aparecer entre las 18 y las 20.')}</div>
    <div class="pie-inicio">${sello(44)}<span class="mini">Menos desperdicio, más aprovecho</span><a class="mini" href="./imagenes.html" target="_blank" rel="noopener">Créditos de fotos</a></div>`;
}
function esqueletoInicio() {
  const r = (w, h, extra = '') => `<div class="skeleton" style="width:${w};height:${h}px;${extra}"></div>`;
  return `<div class="bloque-inicio" style="margin-top:6px"><div class="cats-grandes">${r('100%', 132, 'border-radius:22px')}${r('100%', 132, 'border-radius:22px')}</div></div>
    <div class="carril" style="margin-top:12px">${r('94px', 96, 'border-radius:18px').repeat(4)}</div>
    <div class="bloque-inicio" style="margin-top:18px">${r('100%', 196, 'border-radius:24px')}</div>
    <div class="bloque-inicio" style="margin-top:22px;display:flex;gap:10px">${r('96px', 96, 'border-radius:24px').repeat(3)}</div>`;
}

// ---------------------------------------------------------------------------
// Buscar
// ---------------------------------------------------------------------------
let consulta = '';
function buscar() {
  return {
    html: `<header class="barra" style="padding-left:12px;padding-right:12px;gap:8px">
      <label class="buscador crece" style="box-shadow:0 0 0 1px var(--linea);height:46px">${icon('buscar', 20)}<input id="q" type="search" placeholder="Buscá local o comida" aria-label="Buscar un local o comida" value="${esc(consulta)}" autocomplete="off" enterkeyhint="search"></label>
      <button class="link" data-act="atras" style="padding:0 6px">Cancelar</button></header>
    <div class="cuerpo" id="resultados">${resultados()}</div>`,
    montar: el => {
      const q = el.querySelector('#q');
      requestAnimationFrame(() => q.focus());
      q.addEventListener('input', () => { consulta = q.value; el.querySelector('#resultados').innerHTML = resultados(); });
      q.addEventListener('keydown', e => { if (e.key === 'Enter') q.blur(); });
    },
  };
}
function resultados() {
  const t = consulta.trim().toLowerCase();
  if (!t) {
    return `<div class="pila-s"><span class="eti">Búsquedas populares</span><div class="chips">${BUSQUEDAS.map(b => `<button class="chip" data-act="usar-busqueda" data-v="${esc(b)}">${icon('buscar', 15)} ${esc(b)}</button>`).join('')}</div></div>
      <div class="seccion"><h2>Locales</h2></div>
      <div class="lista">${S.comercios.map(c => `<button class="item" data-go="c/local/${c.id}">${logoLocal(c, 44, 12)}<span class="col crece"><span class="fuerte">${esc(c.nombre)}</span><span class="mini">★ ${rating(c)} · ${esc(c.cat)} · ${distTxt(distanciaM(S.ubic || ZONA_NORTE, c))}</span></span>${icon('adelante', 20, 'chev')}</button>`).join('')}</div>`;
  }
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const tn = norm(t);
  const locales = S.comercios.filter(c => norm(c.nombre + ' ' + c.cat).includes(tn));
  const packs = todosLosPacks().filter(p => norm(p.c.nombre + ' ' + p.cat + ' ' + p.cond.join(' ') + ' ' + (p.titulo || '') + ' ' + (producto(p.productoId)?.nombre || '')).includes(tn)
    || (tn.includes('medialuna') && p.cat === 'Panificados') || (tn.includes('pizza') && p.comercioId === 'c7'));
  if (!locales.length && !packs.length) return vacio('buscar', `No encontramos “${consulta}”`, 'Probá con otra palabra, como “medialunas” o “viandas”.');
  return `${locales.length ? `<div class="seccion"><h2>Locales</h2></div><div class="lista">${locales.map(c => `<button class="item" data-go="c/local/${c.id}">${logoLocal(c, 44, 12)}<span class="col crece"><span class="fuerte">${esc(c.nombre)}</span><span class="mini">★ ${rating(c)} · ${esc(c.cat)}</span></span>${icon('adelante', 20, 'chev')}</button>`).join('')}</div>` : ''}
    ${packs.length ? `<div class="seccion"><h2>Packs</h2><span class="mini">${packs.length}</span></div><div class="pila" style="gap:14px">${packs.map(p => tarjetaPack(p, true)).join('')}</div>` : ''}`;
}

// ---------------------------------------------------------------------------
// Listas por categoría, condición o destacados
// ---------------------------------------------------------------------------
let ordenLista = 'cerca';
function lista(f) {
  const id = decodeURIComponent(f || '');
  const titulos = { agotan: 'Se agotan pronto', mejores: 'Los mejor puntuados', Panificados: 'Panaderías' };
  let packs = todosLosPacks();
  if (CATEGORIAS.includes(id)) packs = packs.filter(p => p.cat === id);
  else if (CONDICIONES.includes(id)) packs = packs.filter(p => p.cond.includes(id));
  else if (id === 'agotan') packs = packs.filter(p => p.stock <= 2);
  else if (id === 'mejores') packs = packs.filter(p => p.c.rating >= 4.6);
  if (ordenLista === 'precio') packs.sort((a, b) => a.precio - b.precio);
  else if (ordenLista === 'rating') packs.sort((a, b) => b.c.rating - a.c.rating);
  const cat = [...CATS_GRANDES, ...CATS_CHICAS].find(c => c.id === id);
  return {
    html: `${barra({ titulo: titulos[id] || id, centro: true })}
    <div class="cuerpo">
      ${cat ? `<div class="card plana fila" style="background:${cat.fondo};gap:14px"><div class="foto-lista-cliente">${fotoPack({ cat: id }, true)}</div><span class="col"><b style="font-size:17px">${packs.length} pack${packs.length === 1 ? '' : 's'} cerca</b><span class="chico">${CONDICIONES.includes(id) ? 'Lo declara cada local, pack por pack.' : 'Retirá hoy. Cada pack muestra su horario.'}</span></span></div>` : ''}
      <div class="chips scroll">${[['cerca', 'Más cerca'], ['precio', 'Más barato'], ['rating', 'Mejor puntuados']].map(([k, t]) => `<button class="chip${ordenLista === k ? ' on' : ''}" data-act="orden-lista" data-v="${k}">${t}</button>`).join('')}</div>
      ${packs.length ? packs.map(p => tarjetaPack(p, true)).join('') : vacio('bolsa', 'No hay packs de esto cerca', 'Probá en un rato o mirá otras categorías.', '<button class="btn chico sec" data-tab="c/inicio">Volver al inicio</button>')}
    </div>`,
  };
}

// ---------------------------------------------------------------------------
// Página de un local
// ---------------------------------------------------------------------------
function local(id) {
  const c = comercio(id);
  if (!c) return noEncontrado();
  const packs = todosLosPacks().filter(p => p.comercioId === id);
  const d = distanciaM(S.ubic || ZONA_NORTE, c);
  return {
    html: `<div class="cuerpo sin-pad">
      <div class="hero-local" style="height:170px;background:${c.logo.bg}">
        <img class="foto-pack-cliente fachada-local" src="${esc(c.marcaDemo ? c.fotoLocal : fotoCategoria(c.cat))}" alt="${esc(c.marcaDemo?'Fotografía de '+c.nombre:'Foto de referencia del comercio')}">
        <button class="icbtn sobre" data-act="atras" aria-label="Volver">${icon('atras', 24)}</button>
        <span class="hero-logo">${logoLocal(c, 84, 22, true)}</span>
      </div>
      <div class="pila" style="padding:38px 18px calc(28px + var(--sb));gap:14px">
        <div class="col" style="gap:4px"><h1 class="gran-titulo" style="font-size:26px">${esc(c.nombre)}</h1>
          <span class="chico"><span class="estrella-mini">★</span> ${rating(c)} (${c.resenas}) · ${esc(c.cat)} · ${distTxt(d)}</span></div>
        <div class="demo-marcas"><span class="badge gris">Demo</span><span>Esta marca no está presentada como adherida. Ofertas, calificaciones y ubicación son ejemplos.</span></div>
        <a class="mini creditos-enlace" href="./imagenes.html" target="_blank" rel="noopener">Créditos de fotografías</a>
        <div class="card plana fila entre"><span class="fila" style="gap:10px">${icon('reloj', 20, 'verde')}<span class="col"><span class="fuerte">Retiro hoy ${retiroTxt(c)}</span><span class="mini">Cierra a las ${c.cierre}</span></span></span>
          <a class="btn chico sec" href="https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}" target="_blank" rel="noopener">${icon('ruta', 16)} Ir</a></div>
        <div class="seccion"><h2>Packs de hoy</h2><span class="mini">${packs.length}</span></div>
        ${packs.length ? packs.map(p => tarjetaPack(p, true)).join('') : vacio('bolsa', 'Hoy no publicó packs todavía', 'Los locales suelen publicar entre las 18 y las 20.')}
      </div>
    </div>`,
  };
}

// ---------------------------------------------------------------------------
// Mapa
// ---------------------------------------------------------------------------
// la hoja baja deja ver el encabezado y el comienzo del primer pack por encima de la barra
const ALTURAS_HOJA = { baja: 'calc(var(--tab-h) + 112px + var(--sb))', media: '46%', alta: 'calc(100% - 120px - var(--st))' };
function mapa() {
  const lista = packsVisibles();
  const nf = filtrosActivos();
  const porComercio = new Map();
  for (const p of lista) {
    const x = porComercio.get(p.c.id) || { ...p.c, desde: Infinity, n: 0 };
    x.desde = Math.min(x.desde, p.precio); x.n += p.stock; porComercio.set(p.c.id, x);
  }
  const altura = ALTURAS_HOJA[alturaHoja];
  const filas = lista.length ? lista.map(p => `
    <button class="pack-fila${p.c.id === selMapa ? ' sel' : ''}" data-go="c/pack/${p.id}" data-com="${p.c.id}">
      ${logoLocal(p.c, 56, 16)}
      <div class="col crece">
        <span class="fuerte trunc2">${esc(p.c.nombre)}</span>
        <span class="chico trunc2">Pack ${TAMANOS[p.tam].toLowerCase()} · ${esc(p.cat)}${p.cond.length ? ' · ' + esc(p.cond.join(', ')) : ''}</span>
        <span class="mini">${distTxt(p.dist)} · hoy ${retiroPack(p)} · quedan ${p.stock}</span>
      </div>
      <div class="col" style="align-items:flex-end;gap:0"><span class="precio">${plata(p.precio)}</span><span class="tachado">${plata(p.valor)}</span></div>
    </button>`).join('')
    : vacio('bolsa', 'No hay packs con esos filtros', 'Probá sacar algún filtro o ampliar la distancia. Suelen aparecer entre las 18 y las 20.', nf ? '<button class="btn chico sec" data-act="limpiar-filtros">Sacar filtros</button>' : '');
  return {
    tabs: tabsCliente('c/mapa', S.reservas.filter(r => reservaActiva(r)).length),
    clase: 'con-tabs',
    html: `<div class="cuerpo sin-pad" style="position:relative;overflow:hidden">
      <div id="slot-mapa" style="position:absolute;inset:0"><div class="mapa-cargando" id="mapa-cargando"><span class="col" style="align-items:center;gap:12px">${spinner()}<span class="chico">Cargando el mapa…</span></span></div></div>
      <div class="mapa-arriba">
        <div class="fila" style="gap:10px">
          <label class="buscador crece">${icon('buscar', 20)}<input id="buscar" type="search" placeholder="Buscar en el mapa" aria-label="Buscar local o categoría en el mapa" value="${esc(buscarMapa)}" autocomplete="off" enterkeyhint="search"></label>
          ${demoBtnCliente(true)}
        </div>
        <div class="chips scroll" style="margin:0 -14px;padding:2px 14px 6px">
          <button class="chip${nf ? ' on' : ''}" data-act="abrir-filtros">${icon('filtros', 18)} Filtros${nf ? ' · ' + nf : ''}</button>
          ${Object.entries(TAMANOS).map(([k, v]) => `<button class="chip${S.filtros.tam.includes(k) ? ' on' : ''}" data-act="filtro-rapido" data-grupo="tam" data-v="${k}">${v}</button>`).join('')}
          ${CONDICIONES.map(v => `<button class="chip${S.filtros.cond.includes(v) ? ' on' : ''}" data-act="filtro-rapido" data-grupo="cond" data-v="${esc(v)}">${v}</button>`).join('')}
        </div>
      </div>
      <button class="boton-centrar" data-act="centrar" aria-label="Centrar en mi ubicación" style="bottom:calc(${altura} + 14px)">${icon('ubicar', 24)}</button>
      <section class="hoja-mapa" id="hoja-mapa" style="height:${altura}" aria-label="Packs cerca">
        <div class="asa-zona" id="asa-mapa"><div class="asa"></div></div>
        <div class="enc fila entre"><h2 style="font-size:19px">${lista.length ? `${lista.length} pack${lista.length > 1 ? 's' : ''} cerca` : 'Sin packs cerca'}</h2><span class="mini">${esc(zonaTxt())}</span></div>
        <div class="lista-packs" id="lista-packs">${filas}</div>
      </section>
    </div>`,
    montar: el => {
      const slot = el.querySelector('#slot-mapa');
      const centro = S.ubic || ZONA_NORTE;
      montarMapa(slot, {
        centro, comercios: [...porComercio.values()], seleccionado: selMapa,
        onPin: id => { selMapa = id; vibrar(); marcarSeleccion(el, id, true); },
        onMover: () => {},
      }).then(() => el.querySelector('#mapa-cargando')?.remove()).catch(() => {
        const c = el.querySelector('#mapa-cargando');
        if (c) c.innerHTML = `<span class="col" style="align-items:center;gap:10px;padding:0 30px;text-align:center">${icon('mapa', 30)}<span class="chico">Sin conexión no se puede mostrar el mapa. La lista de abajo sigue andando.</span></span>`;
      });
      const inp = el.querySelector('#buscar');
      inp.addEventListener('input', () => { buscarMapa = inp.value; refrescarLista(el); });
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') inp.blur(); });
      hojaArrastrable(el);
    },
  };
}
function refrescarLista(el) {
  const tmp = document.createElement('div'); tmp.innerHTML = mapa().html;
  el.querySelector('#lista-packs').innerHTML = tmp.querySelector('#lista-packs').innerHTML;
  el.querySelector('.enc h2').textContent = tmp.querySelector('.enc h2').textContent;
  const porC = new Map();
  for (const p of packsVisibles()) { const x = porC.get(p.c.id) || { ...p.c, desde: Infinity, n: 0 }; x.desde = Math.min(x.desde, p.precio); x.n += p.stock; porC.set(p.c.id, x); }
  ponerPines([...porC.values()], selMapa);
}
function marcarSeleccion(el, id, desplazar) {
  refrescarLista(el);
  const card = el.querySelector(`.pack-fila[data-com="${id}"]`);
  if (alturaHoja === 'baja') ponerAltura(el, 'media');
  if (card && desplazar) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  enfocar(comercio(id));
}
function ponerAltura(el, a) {
  alturaHoja = a;
  const h = el.querySelector('#hoja-mapa'), b = el.querySelector('.boton-centrar');
  const v = ALTURAS_HOJA[a];
  h.style.height = v; b.style.bottom = `calc(${v} + 14px)`;
}
function hojaArrastrable(el) {
  const h = el.querySelector('#hoja-mapa'), asa = el.querySelector('#asa-mapa');
  let y0 = null, h0 = 0;
  const alto = () => el.getBoundingClientRect().height;
  const baja = () => { const t = document.querySelector('#barra-tabs .tabs'); return t ? el.getBoundingClientRect().bottom - t.getBoundingClientRect().top + 102 : 176; };
  asa.addEventListener('pointerdown', e => { y0 = e.clientY; h0 = h.getBoundingClientRect().height; h.style.transition = 'none'; asa.setPointerCapture(e.pointerId); });
  asa.addEventListener('pointermove', e => { if (y0 == null) return; h.style.height = Math.max(baja() - 30, Math.min(alto() - 110, h0 - (e.clientY - y0))) + 'px'; });
  const fin = e => {
    if (y0 == null) return;
    const dy = e.clientY - y0; y0 = null; h.style.transition = '';
    const hAct = h.getBoundingClientRect().height, A = alto();
    if (Math.abs(dy) < 6) { ponerAltura(el, alturaHoja === 'alta' ? 'media' : 'alta'); return; }
    const op = [['baja', baja()], ['media', A * .46], ['alta', A - 120]];
    op.sort((a, b) => Math.abs(a[1] - hAct) - Math.abs(b[1] - hAct));
    ponerAltura(el, op[0][0]);
  };
  asa.addEventListener('pointerup', fin);
  asa.addEventListener('pointercancel', fin);
}

// ---------------------------------------------------------------------------
// Filtros (hoja)
// ---------------------------------------------------------------------------
function abrirFiltros() {
  const f = S.filtros;
  const html = () => {
    const n = packsVisibles().length;
    return `<div class="fila entre"><h2>Filtros</h2><button class="link" data-f="limpiar">Limpiar</button></div>
    <div class="pila-s"><span class="eti">Tamaño</span><div class="chips">${Object.entries(TAMANOS).map(([k, v]) => `<button class="chip${f.tam.includes(k) ? ' on' : ''}" data-f="tam" data-v="${k}">${v}</button>`).join('')}</div></div>
    <div class="pila-s"><span class="eti">Condición · la declara el local</span><div class="chips">${CONDICIONES.map(v => `<button class="chip${f.cond.includes(v) ? ' on' : ''}" data-f="cond" data-v="${v}">${v}</button>`).join('')}</div></div>
    <div class="pila-s"><span class="eti">Categoría</span><div class="chips">${CATEGORIAS.map(v => `<button class="chip${f.cat.includes(v) ? ' on' : ''}" data-f="cat" data-v="${v}">${v}</button>`).join('')}</div></div>
    <div class="pila-s"><div class="fila entre"><span class="eti">Distancia</span><span class="fuerte">Hasta ${f.distKm} km</span></div>
      <input class="rango" type="range" min="1" max="5" step="0.5" value="${f.distKm}" data-f="dist" aria-label="Distancia máxima"></div>
    <button class="btn bloque" data-f="ver">${n ? `Ver ${n} pack${n > 1 ? 's' : ''}` : 'No hay packs con esos filtros'}</button>`;
  };
  const hoja = abrirHoja(html(), { alCerrar: () => { guardar(); nav.render(); } });
  const pintar = () => { hoja.querySelector('.contenido').innerHTML = html(); };
  hoja.addEventListener('click', e => {
    const b = e.target.closest('[data-f]'); if (!b) return;
    const k = b.dataset.f;
    if (k === 'ver') { cerrarHoja(); return; }
    if (k === 'limpiar') Object.assign(f, { tam: [], cond: [], cat: [], distKm: 3 });
    else if (k !== 'dist') { const a = f[k]; const v = b.dataset.v; const i = a.indexOf(v); i >= 0 ? a.splice(i, 1) : a.push(v); vibrar(6); }
    pintar();
  });
  hoja.addEventListener('input', e => { if (e.target.dataset.f === 'dist') { f.distKm = +e.target.value; pintar(); } });
}

// ---------------------------------------------------------------------------
// Detalle del pack
// ---------------------------------------------------------------------------
function detalle(id) {
  const p0 = S.packs.find(x => x.id === id);
  if (!p0 || !comercio(p0.comercioId)) return noEncontrado();
  const p = conDatos(p0), c = p.c;
  const n = nutriPack(p);
  const r = x => num(x[0]) + '–' + num(x[1]);
  const agotado = !packReservable(p);
  const dato = (ic, titulo, texto, extra = '') => `<li><span class="dd-ic">${icon(ic, 20)}</span><span class="col crece"><b>${titulo}</b><span>${texto}</span></span>${extra}</li>`;
  return {
    clase: 'detalle',
    html: `<div class="det-barra" id="det-barra">
        <button class="icbtn sobre" data-act="atras" aria-label="Volver">${icon('atras', 24)}</button>
        <b class="trunc">${esc(c.nombre)}</b>
        <button class="icbtn sobre" data-act="compartir-pack" data-id="${p.id}" aria-label="Compartir">${icon('compartir', 21)}</button>
      </div>
      <div class="cuerpo sin-pad" id="sc-det">
      <div class="det-hero" style="background:${fondoCategoria[p.cat] || '#F1F6EE'}">
        ${fotoPack(p)}
        <span class="badge oferta det-off">50% de descuento</span>
      </div>
      <div class="det-hoja">
        <button class="det-local" data-go="c/local/${c.id}" aria-label="Ver ${esc(c.nombre)}">
          ${logoLocal(c, 46, 14)}
          <span class="col crece"><b class="trunc">${esc(c.nombre)}</b><span class="mini"><span class="estrella-mini">★</span> ${rating(c)} · ${c.resenas} reseñas · ${distTxt(p.dist)}</span></span>
          ${icon('adelante', 18)}
        </button>
        <div class="det-titulo">
          <h1>Pack sorpresa de ${esc(p.cat.toLowerCase())}</h1>
          <div class="det-precio"><strong>${plata(p.precio)}</strong><s>${plata(p.valor)}</s><span class="ahorro">Ahorrás ${plata(p.valor - p.precio)}</span></div>
        </div>
        <ul class="det-datos">
          ${dato('reloj', 'Retirás hoy', retiroPack(p) + ' h', agotado ? '<span class="badge gris">No disponible</span>' : `<span class="badge${p.stock <= 2 ? ' horno' : ''}">${p.stock === 1 ? 'Queda 1' : `Quedan ${p.stock}`}</span>`)}
          ${dato('caja', 'Tamaño ' + TAMANOS[p.tam].toLowerCase(), p.pesoG > 0 ? `${p.medido ? '' : '≈ '}${gramos(p.pesoG)} · ${p.medido ? 'Medido con balanza' : 'Estimado por foto'}` : 'Peso sin informar')}
          ${p.cond.length ? dato('hoja', esc(p.cond.join(' · ')), 'Lo declara el local') : ''}
          ${dato('info', 'Alérgenos', p.alergenos?.length ? esc(p.alergenos.join(', ')) + ' · Confirmados por el local' : 'Consultá con el comercio antes de reservar.')}
          ${dato('pin', distTxt(p.dist) + ' de vos', 'Retiro en el local · ' + esc(zonaTxt()), `<a class="btn chico sec" href="https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}" target="_blank" rel="noopener">${icon('ruta', 16)} Ir</a>`)}
        </ul>
        <section class="det-seccion">
          <h3>Qué puede traer</h3>
          <p>Lo que le sobró hoy a ${esc(c.nombre)} en ${esc(p.cat.toLowerCase())}. La foto es ilustrativa y el contenido exacto lo ves al retirarlo.</p>
        </section>
        ${n ? `<section class="det-seccion">
          <h3>Nutrición estimada <span class="mini">todo el pack</span></h3>
          <div class="nutri-tira"><div><b>${r(n[0])}</b><span>kcal</span></div><div><b>${r(n[1])}</b><span>g proteínas</span></div><div><b>${r(n[2])}</b><span>g carbos</span></div><div><b>${r(n[3])}</b><span>g grasas</span></div></div>
          <p class="mini">Estimación hecha por IA a partir del peso. No sirve para decidir por alergias o intolerancias: consultá al local.</p>
        </section>` : ''}
      </div>
    </div>
    <div class="det-cta">
      <span class="col"><span class="mini">Total</span><strong>${plata(p.precio)}</strong></span>
      <button class="btn crece" data-go="c/pago/${p.id}"${agotado ? ' disabled' : ''}>${agotado ? 'No disponible' : 'Reservar'}</button>
    </div>`,
    montar: el => {
      // la barra de arriba queda fija: transparente sobre la foto, sólida al bajar
      const sc = el.querySelector('#sc-det'), barra = el.querySelector('#det-barra');
      const mirar = () => barra.classList.toggle('solida', sc.scrollTop > 150);
      sc.addEventListener('scroll', mirar, { passive: true });
      mirar();
    },
  };
}

// ---------------------------------------------------------------------------
// Pago
// ---------------------------------------------------------------------------
let medioPago = 'mp';
let pagoEnCurso = false;
let errorPago = null;
let beneficioElegido = null;
const pagado = r => r.pagado ?? r.precio;
const usoBeneficio = (r, tipo) => r.beneficio === tipo && r.estado !== 'sin_pack' && !(r.estado === 'cancelada' && r.cancelacionGratis);
const packsPagosRetirados = () => S.consumidor.packs - S.reservas.filter(r => r.estado === 'retirada' && r.beneficio === 'gratis').length;
const beneficioDisponible = tipo => {
  const ganado = tipo === 'gratis' ? packsPagosRetirados() >= 10 : S.perfil.referidoDemo === true;
  return ganado && !S.reservas.some(r => usoBeneficio(r, tipo));
};
const beneficioActivo = p => beneficioElegido?.estado === S && beneficioElegido.id === p.id && beneficioDisponible(beneficioElegido.tipo) ? beneficioElegido.tipo : null;
const descuentoBeneficio = (p, tipo) => tipo === 'gratis' ? p.precio : tipo === 'referido' ? Math.round(p.precio * .1) : 0;
const fechaRetiro = (dia, hora) => new Date(`${dia}T${hora}:00`).getTime();
const packReservable = p => p.dia === hoy() && p.stock > 0 && p.estado === 'activo' && ahora().getTime() < fechaRetiro(p.dia, p.retiroHasta || comercio(p.comercioId)?.cierre);

function pago(id) {
  const p = S.packs.find(x => x.id === id);
  if (!p || !packReservable(p)) return noEncontrado();
  const c = comercio(p.comercioId);
  const beneficio = beneficioActivo(p);
  const descuento = descuentoBeneficio(p, beneficio);
  const total = p.precio - descuento;
  const op = (k, ic, t, s) => `<button class="item" data-act="medio-pago" data-v="${k}" aria-pressed="${medioPago === k}">
    <span class="ic-caja">${icon(ic, 20)}</span><span class="col crece"><span class="fuerte">${t}</span><span class="mini">${s}</span></span>
    <span style="width:22px;height:22px;border-radius:11px;flex:none;box-shadow:${medioPago === k ? 'inset 0 0 0 7px var(--verde)' : 'inset 0 0 0 2px var(--gris-2)'};transition:box-shadow .2s"></span></button>`;
  return {
    clase: 'gris',
    html: `${barra({ titulo: 'Confirmá tu reserva', centro: true })}
    <div class="cuerpo">
      ${errorPago?.estado === S && errorPago.id === id ? '<p role="alert" class="nota horno">No pudimos cobrar. No se generó una reserva ni un QR. Podés reintentar.</p>' : ''}
      <div class="card">
        <div class="fila">${logoLocal(c, 52, 15)}<div class="col crece"><span class="fuerte">Pack sorpresa · ${esc(p.cat)}</span><span class="chico">${esc(c.nombre)} · hoy ${retiroTxt(c, p.retiroDesde, p.retiroHasta)}</span></div></div>
        <div class="sep"></div>
        <div class="fila entre"><span class="chico">Valor en el local</span><span class="tachado">${plata(p.valor)}</span></div>
        <div class="fila entre"><span class="chico">Precio del pack · 50% de descuento</span><span>${plata(p.precio)}</span></div>
        ${descuento ? `<div class="fila entre"><span class="chico">${beneficio === 'gratis' ? 'Pack de regalo' : 'Beneficio por referido'}</span><span>−${plata(descuento)}</span></div>` : ''}
        <div class="fila entre"><span class="fuerte">Total</span><span class="fuerte verde" style="font-size:21px">${plata(total)}</span></div>
      </div>
      ${['gratis', 'referido'].filter(beneficioDisponible).map(tipo => `<button class="btn bloque sec" data-act="beneficio-pago" data-id="${p.id}" data-v="${tipo}" aria-pressed="${beneficio === tipo}">${beneficio === tipo ? 'Quitar' : 'Usar'} ${tipo === 'gratis' ? 'pack de regalo' : '10% por referido'}</button>`).join('')}
      ${total ? `<span class="eti">Cómo pagás</span><div class="lista">${op('mp', 'billetera', 'Mercado Pago', 'Dinero en cuenta o tarjetas guardadas')}${op('tarjeta', 'tarjeta', 'Tarjeta de débito o crédito', 'Visa, Mastercard, Amex')}</div>` : ''}
      ${nota('Podés cancelar gratis hasta 2 h antes del inicio del retiro.', 'reloj')}
      ${nota('Si no pasás a retirarlo en el horario, el pack se pierde y no hay reintegro.', 'alerta', 'horno')}
      <div style="flex:1"></div>
      <p class="mini" style="text-align:center">Pago simulado · demo</p>
      <button class="btn bloque" data-act="pagar" data-id="${p.id}">${total ? `Pagar ${plata(total)}` : 'Reservar pack de regalo'}</button>
      ${total ? `<button class="btn bloque sec" data-act="pagar" data-id="${p.id}" data-falla="true">Simular un pago fallido</button>` : ''}
    </div>`,
  };
}

async function pagar(id, falla) {
  if (pagoEnCurso) return;
  const p = S.packs.find(x => x.id === id);
  if (!p || !packReservable(p)) { toast('Ese pack ya no está disponible.', { ic: 'alerta' }); nav.go('c/inicio', { raiz: true }); return; }
  pagoEnCurso = true;
  const estado = S;
  const beneficio = beneficioActivo(p);
  const total = p.precio - descuentoBeneficio(p, beneficio);
  const carga = cargando(total ? 'Procesando el pago…' : 'Preparando tu reserva…');
  try {
    await esperar(700);
    const rutaPago = 'c/pago/' + id;
    if (S !== estado || nav.ruta !== rutaPago) return;
    if (falla || !S.packs.includes(p) || !packReservable(p)) {
      errorPago = { id, estado };
      nav.render();
      return;
    }
    const c = comercio(p.comercioId);
    let code;
    do { code = codigo(); } while (!/^[A-Z]{4}$/.test(code) || S.reservas.some(r => r.code === code) || S.externas?.some(r => r.code === code));
    const r = {
      id: uid('r'), code, packId: p.id, comercioId: p.comercioId, dia: hoy(), creada: ahora().getTime(),
      estado: 'activa', pago: total ? medioPago : null, cliente: S.perfil.nombre || 'Cliente', precio: p.precio, valor: p.valor,
      pagado: total, beneficio, pesoG: p.pesoG, medido: p.medido, cat: p.cat, tam: p.tam,
      retiroDesde: inicioRetiro(c, p.retiroDesde), retiroHasta: p.retiroHasta || c.cierre,
    };
    p.stock -= 1; p.vendidos = (p.vendidos || 0) + 1;
    if (p.stock <= 0) p.estado = 'agotado';
    S.reservas.unshift(r);
    evento('reserva', { packId: p.id, precio: total });
    guardar();
    errorPago = beneficioElegido = null;
    segReservas = 'activas';
    carga.listo(total ? '¡Pago aprobado!' : '¡Reserva confirmada!');
    vibrar(20);
    await esperar(350);
    if (S === estado && nav.ruta === rutaPago) nav.go('c/reserva/' + r.id, { raiz: true });
  } finally {
    carga.cerrar();
    pagoEnCurso = false;
  }
}

// ---------------------------------------------------------------------------
// QR de retiro
// ---------------------------------------------------------------------------
const HORA = 3600000;
const reservaActiva = (r, c = comercio(r.comercioId)) => r.estado === 'activa' && !!c && ahora().getTime() < fechaRetiro(r.dia, horarioReserva(r, c).hasta);
const cancelacionGratis = (r, c) => ahora().getTime() <= fechaRetiro(r.dia, horarioReserva(r, c).desde) - 2 * HORA;
const diaReserva = r => r.dia === hoy() ? 'Hoy' : `${r.dia.slice(8)}/${r.dia.slice(5, 7)}`;

function badgeReserva(r) {
  if (reservaActiva(r)) return '<span class="badge">Activa</span>';
  if (r.reporte) return '<span class="badge horno">En revisión</span>';
  if (r.estado === 'retirada') return '<span class="badge">Retirada</span>';
  if (r.estado === 'cancelada') return '<span class="badge gris">Cancelada</span>';
  if (r.estado === 'sin_pack') return '<span class="badge horno">Local sin pack</span>';
  return '<span class="badge horno">No retirada</span>';
}

function reserva(id) {
  const r = S.reservas.find(x => x.id === id);
  if (!r) return noEncontrado();
  const c = comercio(r.comercioId);
  if (!c) return noEncontrado();
  const activa = reservaActiva(r, c);
  const recien = ahora().getTime() - r.creada < 60000;
  const cerrada = r.estado === 'cancelada' || r.estado === 'sin_pack';
  return {
    clase: 'gris',
    html: `${barra({ titulo: 'Tu reserva', cerrar: true, centro: true })}
    <div class="cuerpo" style="gap:16px">
      ${recien && activa ? `<div class="ok-grande">${icon('check', 44)}</div><h1 class="gran-titulo" style="text-align:center">¡Reservado!</h1>` : `<div style="text-align:center">${badgeReserva(r)}</div>`}
      ${activa ? `<p class="chico" style="text-align:center;font-size:15px">Mostrá este código en <b>${esc(c.nombre)}</b>.</p>
        <div class="qr-caja" id="qr"><div style="aspect-ratio:1;display:grid;place-items:center">${spinner('grande')}</div></div>
        <div class="codigo-grande">${esc(r.code)}</div>` : ''}
      <div class="card">
        <div class="fila entre"><span class="chico">Comercio</span><span class="fuerte">${esc(c.nombre)}</span></div>
        <div class="fila entre"><span class="chico">Retiro</span><span class="fuerte">${diaReserva(r)} ${retiroReserva(r, c)}</span></div>
        <div class="fila entre"><span class="chico">Pack</span><span class="fuerte">${TAMANOS[r.tam]} · ${esc(r.cat)}</span></div>
        <div class="fila entre"><span class="chico">Pagaste</span><span class="fuerte">${plata(pagado(r))}</span></div>
      </div>
      ${cerrada ? nota(r.estado === 'sin_pack' || r.cancelacionGratis ? `Registramos un reintegro simulado de ${plata(r.reintegro ?? pagado(r))}.` : 'Cancelaste fuera del plazo de reintegro.', 'info') : ''}
      ${activa ? `<a class="btn bloque sec" href="https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}" target="_blank" rel="noopener">${icon('ruta', 20)} Cómo llegar</a>
        <button class="btn bloque sec" data-act="cancelar-reserva" data-id="${r.id}">Cancelar reserva</button>
        <p class="mini">${cancelacionGratis(r, c) ? 'Podés cancelar gratis hasta 2 h antes del inicio del retiro.' : 'Ya pasó el plazo de cancelación gratis.'}</p>` : ''}
      ${r.estado === 'retirada' && !r.calificacion && !r.reporte ? `<button class="btn bloque" data-go="c/calificar/${r.id}">${icon('estrella', 20)} Calificar</button>` : ''}
      ${r.estado === 'retirada' && !r.reporte ? `<button class="btn bloque sec" data-act="reportar-pack" data-id="${r.id}">Reportar pack en mal estado</button>` : ''}
      ${r.reporte ? `${nota('Guardamos el reporte y su foto en esta demo. La devolución se evalúa después de revisar el caso.', 'info')}
        <img class="foto-reporte" src="${esc(r.reporte.foto)}" alt="Foto adjunta al reporte">` : ''}
    </div>`,
    montar: activa ? async el => {
      const qr = el.querySelector('#qr');
      try {
        const pack = S.packs.find(x => x.id === r.packId) || { id: r.packId, tam: r.tam, cat: r.cat };
        qr.innerHTML = await qrSvg(payload(r, pack, c));
      } catch (e) {
        qr.innerHTML = `<div class="vacio" style="padding:20px">${icon('qr', 30)}<p class="mini">Sin conexión no se pudo dibujar el QR. El código de 4 letras funciona igual.</p></div>`;
      }
    } : undefined,
  };
}

async function cancelarReserva(id) {
  const r = S.reservas.find(x => x.id === id);
  if (!r || !reservaActiva(r)) return;
  const c = comercio(r.comercioId);
  const gratis = cancelacionGratis(r, c);
  const confirmarCancelacion = await confirmar({
    titulo: '¿Cancelás la reserva?',
    texto: gratis ? 'El pack vuelve a estar disponible. El reintegro es simulado.' : 'Ya pasó el plazo de cancelación gratis. Si cancelás ahora, no hay reintegro.',
    si: gratis ? 'Sí, cancelar reserva' : 'Cancelar sin reintegro', no: 'Mantener reserva', peligro: true,
  });
  if (!confirmarCancelacion || !S.reservas.includes(r) || !reservaActiva(r)) return;
  if (gratis && !cancelacionGratis(r, c)) {
    nav.render();
    toast('Pasó el plazo de reintegro. Revisá las condiciones antes de cancelar.', { ic: 'alerta' });
    return;
  }
  r.estado = 'cancelada';
  r.cancelada = ahora().getTime();
  r.cancelacionGratis = gratis;
  r.reintegro = gratis ? pagado(r) : 0;
  const p = S.packs.find(x => x.id === r.packId && x.dia === r.dia);
  if (p && ['agotado', 'activo'].includes(p.estado)) {
    p.stock += 1;
    p.vendidos = Math.max(0, (p.vendidos || 0) - 1);
    p.estado = 'activo';
  }
  evento('reserva_cancelada', { reservaId: id, reintegro: r.reintegro });
  segReservas = 'anteriores';
  guardar();
  nav.render();
  toast('Reserva cancelada.');
}

function reportarPack(id) {
  const r = S.reservas.find(x => x.id === id);
  if (!r || r.estado !== 'retirada' || r.reporte) return;
  let abierto = true;
  const h = abrirHoja(`<h2>Reportá el estado del pack</h2><p class="chico">Adjuntá una foto del pack para que se pueda revisar el caso. El reporte queda en esta demo.</p>
    <form class="pila">
      <div class="campo"><label for="foto-reporte">Foto del pack (obligatoria)</label><input class="input archivo-reporte" id="foto-reporte" type="file" accept="image/jpeg,image/png,image/webp" required></div>
      <div class="campo"><label for="detalle-reporte">¿Qué pasó? (opcional)</label><textarea class="input" id="detalle-reporte" maxlength="400"></textarea></div>
      <p class="chico" role="alert" hidden></p>
      <button class="btn bloque" type="submit">Registrar reporte</button>
    </form>`, { alCerrar: () => { abierto = false; } });
  const form = h.querySelector('form');
  const error = form.querySelector('[role="alert"]');
  const submit = form.querySelector('[type="submit"]');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (submit.disabled) return;
    const archivo = form.querySelector('#foto-reporte').files[0];
    error.hidden = true;
    submit.disabled = true;
    try {
      if (!archivo || !['image/jpeg', 'image/png', 'image/webp'].includes(archivo.type) || archivo.size > 8 * 1024 * 1024) throw new Error('Foto inválida');
      const imagen = await createImageBitmap(archivo);
      const escala = Math.min(1, 720 / Math.max(imagen.width, imagen.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(imagen.width * escala));
      canvas.height = Math.max(1, Math.round(imagen.height * escala));
      try { canvas.getContext('2d').drawImage(imagen, 0, 0, canvas.width, canvas.height); }
      finally { imagen.close(); }
      const foto = canvas.toDataURL('image/jpeg', .7);
      if (!abierto || !S.reservas.includes(r) || r.estado !== 'retirada' || r.reporte) return;
      r.reporte = { foto, detalle: form.querySelector('#detalle-reporte').value.trim().slice(0, 400), creado: ahora().getTime() };
      evento('pack_reportado', { reservaId: id });
      guardar();
      cerrarHoja();
      nav.render();
      toast('Reporte registrado en la demo.');
    } catch (e) {
      error.textContent = 'Elegí una foto JPG, PNG o WebP de hasta 8 MB que se pueda abrir.';
      error.hidden = false;
    } finally {
      submit.disabled = false;
    }
  });
}

// ---------------------------------------------------------------------------
// Mis reservas
// ---------------------------------------------------------------------------
let segReservas = 'activas';
function reservas() {
  const act = S.reservas.filter(r => reservaActiva(r));
  const ant = S.reservas.filter(r => !reservaActiva(r));
  const fila = r => {
    const c = comercio(r.comercioId);
    if (!c) return '';
    return `<button class="item" data-go="c/reserva/${r.id}">
      ${logoLocal(c, 44, 12)}<span class="col crece"><span class="fuerte trunc2">${esc(c.nombre)}</span><span class="mini">Pack ${TAMANOS[r.tam].toLowerCase()} · ${diaReserva(r)} · ${plata(pagado(r))}</span></span>${badgeReserva(r)}</button>`;
  };
  const cuerpo = segReservas === 'activas'
    ? (act.length ? act.map(r => {
      const c = comercio(r.comercioId);
      return `<button class="card toque" data-go="c/reserva/${r.id}" style="text-align:left">
        <div class="fila">${logoLocal(c, 48, 14)}<span class="col crece"><span class="fuerte">${esc(c.nombre)}</span><span class="chico">Pack ${TAMANOS[r.tam].toLowerCase()} · ${esc(r.cat)} · retiro ${retiroReserva(r, c)}</span></span><span class="badge">Hoy</span></div>
        <div class="fila entre"><span class="codigo-grande" style="font-size:24px;text-align:left;padding:0">${esc(r.code)}</span><span class="btn chico">${icon('qr', 18)} Mostrar QR</span></div>
      </button>`;
    }).join('') : `<div class="vacio">${ilus('caja', 120)}<h3>No tenés reservas activas</h3><p class="chico">Cuando reserves un pack, el código para retirarlo aparece acá.</p><button class="btn chico" data-tab="c/inicio">Ver packs cerca</button></div>`)
    : (ant.length ? `<div class="lista">${ant.map(fila).join('')}</div>` : vacio('reloj', 'Todavía no hay reservas anteriores', 'Tus packs retirados van a aparecer acá.'));
  return {
    tabs: tabsCliente('c/reservas', act.length), clase: 'con-tabs gris',
    html: `${barra({ titulo: 'Reservas', atras: false, grande: true, accion: demoBtnCliente() })}
    <div class="cuerpo">
      <div class="seg"><button class="${segReservas === 'activas' ? 'on' : ''}" data-act="seg-reservas" data-v="activas">Activas${act.length ? ' · ' + act.length : ''}</button><button class="${segReservas === 'anteriores' ? 'on' : ''}" data-act="seg-reservas" data-v="anteriores">Anteriores</button></div>
      ${cuerpo}
    </div>`,
  };
}

// ---------------------------------------------------------------------------
// Calificar
// ---------------------------------------------------------------------------
const ETIQUETAS = ['Buena cantidad', 'Rico', 'Coincidió con la pista', 'Buena atención', 'Llegó justo'];
let calif = { estrellas: 0, tags: [] };
function calificar(id) {
  const r = S.reservas.find(x => x.id === id);
  if (!r || r.estado !== 'retirada' || r.reporte || r.calificacion) return noEncontrado();
  const c = comercio(r.comercioId);
  return {
    html: `${barra({ titulo: '¿Qué tal estuvo?', cerrar: true, centro: true })}
    <div class="cuerpo" style="gap:20px">
      <div class="vacio" style="padding:10px 0 0">${logoLocal(c, 76, 22)}<h2>${esc(c.nombre)}</h2><p class="chico">Pack ${TAMANOS[r.tam].toLowerCase()} · ${esc(r.cat)}</p></div>
      <div class="estrellas" role="radiogroup" aria-label="Calificación">${[1, 2, 3, 4, 5].map(n => `<button role="radio" aria-checked="${calif.estrellas === n}" aria-label="${n} estrellas" class="${calif.estrellas >= n ? 'on' : ''}" data-act="estrella" data-v="${n}"><svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor"><path d="m12 3.6 2.5 5.2 5.7.8-4.1 4 1 5.6L12 16.5l-5.1 2.7 1-5.6-4.1-4 5.7-.8L12 3.6Z"/></svg></button>`).join('')}</div>
      <div class="chips" style="justify-content:center">${ETIQUETAS.map(t => `<button class="chip${calif.tags.includes(t) ? ' on' : ''}" data-act="tag-calif" data-v="${t}">${t}</button>`).join('')}</div>
      <textarea class="input" id="comentario" placeholder="Contanos algo más (opcional)" maxlength="400"></textarea>
      <div style="flex:1"></div>
      <button class="btn bloque${calif.estrellas ? '' : ' off'}" data-act="enviar-calif" data-id="${r.id}">Enviar</button>
    </div>`,
  };
}

// ---------------------------------------------------------------------------
// Perfil
// ---------------------------------------------------------------------------
// Escala de ejemplo de docs/ux/score-y-niveles.md.
const NIVELES = [
  { min: 0, a: 'Nueva', o: 'Nuevo', n: 'Nuevo' },
  { min: 3, a: 'Vecina', o: 'Vecino', n: 'Vecino' },
  { min: 10, a: 'Habitual', o: 'Habitual', n: 'Habitual' },
  { min: 25, a: 'Referente', o: 'Referente', n: 'Referente' },
  { min: 50, a: 'Embajadora', o: 'Embajador', n: 'Embajador' },
];
export function nivel(n) {
  let i = 0;
  NIVELES.forEach((x, j) => { if (n >= x.min) i = j; });
  return { i, act: NIVELES[i], sig: NIVELES[i + 1] };
}
function perfil() {
  const k = S.consumidor;
  const { i, act, sig } = nivel(k.packs);
  const forma = S.perfil.forma;
  const nombreNivel = x => (forma === 'a' ? x.a : forma === 'o' ? x.o : x.n);
  const prog = sig ? (k.packs - act.min) / (sig.min - act.min) : 1;
  const co = co2(k.kg);
  const progresoRegalo = Math.min(10, packsPagosRetirados());
  return {
    tabs: tabsCliente('c/perfil', S.reservas.filter(r => reservaActiva(r)).length), clase: 'con-tabs gris',
    html: `${barra({ titulo: 'Perfil', atras: false, grande: true, accion: demoBtnCliente() })}
    <div class="cuerpo">
      <div class="card">
        <div class="fila"><div class="avatar-perfil" style="width:60px;height:60px;border-radius:30px;font-size:24px">${esc((S.perfil.nombre || '?').charAt(0).toUpperCase())}</div>
          <div class="col crece"><span class="fuerte" style="font-size:19px">${esc(S.perfil.nombre || 'Sin nombre')}</span><span class="plan-tag" style="align-self:flex-start">${esc(nombreNivel(act))}</span></div></div>
        <div class="progreso"><i style="width:${Math.round(prog * 100)}%"></i></div>
        <span class="chico">${sig ? `Te faltan <b>${sig.min - k.packs} packs</b> para ${esc(nombreNivel(sig))}` : '¡Llegaste al nivel más alto!'}</span>
      </div>
      <div class="stats dos">
        <div class="stat"><span class="n">${num(k.packs)}</span><span class="k">Packs retirados · Registro simulado</span></div>
        <div class="stat"><span class="n">≈ ${dec(k.kg)} kg</span><span class="k">Alimento recuperado · Estimado</span></div>
        <div class="stat"><span class="n">≈ ${dec(co)} kg</span><span class="k">Huella asociada (CO₂e) · Estimada</span></div>
        <div class="stat"><span class="n">${plata(k.ahorro)}</span><span class="k">Ahorraste vs. precio de lista · Registro simulado</span></div>
      </div>
      <p class="mini">Huella estimada a partir de ${String(CONFIG.factorCO2).replace('.', ',')} kg de CO₂e por kg de alimento recuperado.</p>
      <div class="pila-s"><span class="eti">Niveles de ejemplo</span><div class="chips">${NIVELES.map((x, j) => `<span class="chip${j === i ? ' on' : ''}">${esc(x.n)} · ${x.min}+</span>`).join('')}</div></div>
      <span class="eti">Beneficios</span>
      <section class="card" aria-labelledby="titulo-pack-regalo">
        <h3 id="titulo-pack-regalo">10 packs, 1 de regalo</h3>
        <div class="progreso" role="progressbar" aria-label="Compras para tu pack de regalo" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${progresoRegalo}"><i style="width:${progresoRegalo * 10}%"></i></div>
        <p class="chico">${beneficioDisponible('gratis') ? 'Tenés un pack de regalo. Podés usarlo al reservar.' : progresoRegalo === 10 ? 'Ya usaste tu pack de regalo.' : `${progresoRegalo} de 10 packs pagos y retirados.`}</p>
        ${beneficioDisponible('gratis') ? '<button class="btn bloque sec" data-tab="c/inicio">Elegir un pack</button>' : ''}
      </section>
      <button class="item card" data-act="referidos"><span class="ic-caja">${icon('compartir', 20)}</span><span class="col crece"><span class="fuerte">Invitá a alguien</span><span class="mini">10% para vos y 10% para quien invites</span></span>${icon('adelante', 20, 'chev')}</button>
      <span class="eti" style="margin-top:6px">Ajustes</span>
      <div class="lista">
        <button class="item" data-act="editar-nombre"><span class="ic-caja">${icon('usuario', 20)}</span><span class="col crece"><span class="fuerte">Nombre</span><span class="mini">${esc(S.perfil.nombre || 'Sin nombre')}</span></span>${icon('adelante', 20, 'chev')}</button>
        <button class="item" data-act="forma-nivel"><span class="ic-caja">${icon('etiqueta', 20)}</span><span class="col crece"><span class="fuerte">Cómo se muestra tu nivel</span><span class="mini">${esc(nombreNivel(act))}</span></span>${icon('adelante', 20, 'chev')}</button>
        <button class="item" data-act="elegir-zona"><span class="ic-caja">${icon('pin', 20)}</span><span class="col crece"><span class="fuerte">Zona</span><span class="mini">${esc(zonaTxt())}</span></span>${icon('adelante', 20, 'chev')}</button>
        <button class="item" data-act="compartir-app"><span class="ic-caja">${icon('compartir', 20)}</span><span class="col crece"><span class="fuerte">Compartir la app</span><span class="mini">Pasale el link a un amigo</span></span>${icon('adelante', 20, 'chev')}</button>
        <button class="item" data-act="entrar-comercio"><span class="ic-caja">${icon('local', 20)}</span><span class="col crece"><span class="fuerte">Pasar al modo local</span><span class="mini">Ver la app como un comercio</span></span>${icon('adelante', 20, 'chev')}</button>
        <button class="item" data-act="reiniciar"><span class="ic-caja" style="background:var(--rojo-50);color:var(--rojo)">${icon('refrescar', 20)}</span><span class="col crece"><span class="fuerte">Reiniciar la demo</span><span class="mini">Borra lo que hiciste en este celu</span></span></button>
      </div>
      ${instalarUI(true)}
    </div>`,
  };
}

function noEncontrado() {
  return { html: `${barra({ titulo: '' })}<div class="cuerpo">${vacio('alerta', 'No encontramos eso', 'Puede que ya no esté disponible.', '<button class="btn chico" data-tab="c/inicio">Ir al inicio</button>')}</div>` };
}

// ---------------------------------------------------------------------------
export const pantallas = {
  bienvenida, 'c/ubicacion': ubicacion, 'c/inicio': inicio, 'c/buscar': buscar, 'c/lista': lista, 'c/local': local,
  'c/mapa': mapa, 'c/pack': detalle, 'c/pago': pago, 'c/reserva': reserva, 'c/reservas': reservas,
  'c/calificar': calificar, 'c/perfil': perfil,
};

export const acciones = {
  'entrar-cliente': () => { S.rol = 'cliente'; guardar(); nav.go(S.ubic ? 'c/inicio' : 'c/ubicacion', { raiz: true }); },
  'usar-gps': async () => {
    if (!('geolocation' in navigator) || !window.isSecureContext) { usarZona(ZONAS[0], 'No se puede usar el GPS acá: arrancamos en Olivos.'); return; }
    const c = cargando('Buscando tu ubicación…');
    navigator.geolocation.getCurrentPosition(pos => {
      c.cerrar();
      ubicar({ lat: pos.coords.latitude, lng: pos.coords.longitude, fuente: 'gps', barrio: 'tu zona' });
      evento('ubicacion', { fuente: 'gps' });
      nav.go('c/inicio', { raiz: true });
    }, () => { c.cerrar(); usarZona(ZONAS[0], 'No pudimos usar tu ubicación: arrancamos en Olivos.'); }, { enableHighAccuracy: false, timeout: 9000, maximumAge: 600000 });
  },
  'elegir-zona': () => {
    const h = abrirHoja(`<h2>Elegí una zona</h2><div class="lista">${ZONAS.map((z, i) => `<button class="item" data-z="${i}"><span class="ic-caja">${icon('pin', 20)}</span><span class="crece fuerte">${z[0]}</span>${(S.ubic?.barrio === z[0]) ? icon('check', 20, 'verde') : icon('adelante', 20, 'chev')}</button>`).join('')}</div>`);
    h.addEventListener('click', e => { const b = e.target.closest('[data-z]'); if (b) { cerrarHoja(); usarZona(ZONAS[+b.dataset.z]); } });
  },
  'menu-demo-cliente': () => {
    // los botones usan acciones que ya existen: main.js las resuelve y cada una cierra esta hoja al navegar
    abrirHoja(`<div class="fila entre"><h2>Demo</h2><span class="badge gris">Modo cliente</span></div>
      <div class="lista">
        <button class="item" data-act="entrar-comercio"><span class="ic-caja">${icon('local', 20)}</span><span class="col crece"><span class="fuerte">Pasar al modo local</span><span class="mini">Ver la app como un comercio: publicar, estación, Intelligence</span></span>${icon('adelante', 20, 'chev')}</button>
        <button class="item" data-act="elegir-zona"><span class="ic-caja">${icon('pin', 20)}</span><span class="col crece"><span class="fuerte">Cambiar de zona</span><span class="mini">${esc(zonaTxt())}</span></span>${icon('adelante', 20, 'chev')}</button>
        <button class="item" data-act="reiniciar"><span class="ic-caja" style="background:var(--rojo-50);color:var(--rojo)">${icon('refrescar', 20)}</span><span class="col crece"><span class="fuerte">Reiniciar la demo</span><span class="mini">Borra lo que hiciste en este celu</span></span></button>
      </div>
      <p class="mini">Los datos de la demo son simulados y quedan solo en este celu.</p>`);
  },
  'compartir-app': async () => {
    const datos = { title: 'Aprovecho', text: 'Comida rica que sobró en los locales del barrio, a mitad de precio. Instalala:', url: new URL('./', location.href).href };
    try {
      if (navigator.share) { await navigator.share(datos); return; }
      await navigator.clipboard.writeText(datos.url);
      toast('Link copiado. Pegalo donde quieras.', { ic: 'compartir' });
    } catch (e) { /* cancelado */ }
  },
  'compartir-pack': async ds => {
    const p0 = S.packs.find(x => x.id === ds.id); if (!p0) return;
    const p = conDatos(p0);
    const datos = { title: 'Aprovecho', text: `Pack sorpresa de ${p.c.nombre} a ${plata(p.precio)} (antes ${plata(p.valor)}).`, url: new URL('./', location.href).href };
    try {
      if (navigator.share) { await navigator.share(datos); return; }
      await navigator.clipboard.writeText(datos.text + ' ' + datos.url);
      toast('Copiado. Pegalo donde quieras.', { ic: 'compartir' });
    } catch (e) { /* cancelado */ }
  },
  'usar-busqueda': ds => { consulta = ds.v; nav.render(); },
  'orden-lista': ds => { ordenLista = ds.v; nav.render(); },
  'abrir-filtros': () => abrirFiltros(),
  'filtro-rapido': ds => { const a = S.filtros[ds.grupo]; const i = a.indexOf(ds.v); i >= 0 ? a.splice(i, 1) : a.push(ds.v); vibrar(6); guardar(); nav.render(); },
  'limpiar-filtros': () => { Object.assign(S.filtros, { tam: [], cond: [], cat: [], distKm: 3 }); buscarMapa = ''; guardar(); nav.render(); },
  centrar: () => { enfocar(S.ubic || ZONA_NORTE, 15); },
  'medio-pago': ds => { medioPago = ds.v; nav.render(); },
  'beneficio-pago': ds => {
    const p = S.packs.find(x => x.id === ds.id);
    if (!pagoEnCurso && p && ['gratis', 'referido'].includes(ds.v) && beneficioDisponible(ds.v)) {
      beneficioElegido = beneficioActivo(p) === ds.v ? null : { id: ds.id, tipo: ds.v, estado: S };
      nav.render();
    }
  },
  pagar: ds => pagar(ds.id, ds.falla === 'true'),
  'cancelar-reserva': ds => cancelarReserva(ds.id),
  'reportar-pack': ds => reportarPack(ds.id),
  'seg-reservas': ds => { segReservas = ds.v; nav.render(); },
  estrella: ds => { calif.estrellas = +ds.v; vibrar(8); nav.render(); },
  'tag-calif': ds => { const i = calif.tags.indexOf(ds.v); i >= 0 ? calif.tags.splice(i, 1) : calif.tags.push(ds.v); nav.render(); },
  'enviar-calif': ds => {
    const r = S.reservas.find(x => x.id === ds.id);
    if (!r || r.estado !== 'retirada' || r.reporte || r.calificacion || !calif.estrellas) return;
    r.calificacion = calif.estrellas; r.tags = [...calif.tags];
    r.comentario = (document.getElementById('comentario')?.value || '').slice(0, 400);
    evento('calificacion', { estrellas: r.calificacion, pista: r.tags.includes('Coincidió con la pista') });
    calif = { estrellas: 0, tags: [] };
    guardar();
    toast('¡Gracias! Tu calificación ayuda al local y a la IA.');
    nav.atras();
  },
  'editar-nombre': () => {
    const h = abrirHoja(`<h2>Tu nombre</h2><div class="campo"><label for="nom">Así te ve el local cuando retirás</label><input class="input" id="nom" maxlength="30" value="${esc(S.perfil.nombre)}" autocomplete="given-name"></div><button class="btn bloque" data-ok>Guardar</button>`);
    h.querySelector('[data-ok]').addEventListener('click', () => { S.perfil.nombre = h.querySelector('#nom').value.trim().slice(0, 30); guardar(); cerrarHoja(); nav.render(); });
  },
  'forma-nivel': () => {
    const { act } = nivel(S.consumidor.packs);
    const h = abrirHoja(`<h2>¿Cómo se muestra tu nivel?</h2><div class="lista">${[['a', act.a], ['o', act.o], ['n', act.n + ' (solo el nivel)']].map(([k, t]) => `<button class="item" data-fm="${k}"><span class="crece fuerte">${esc(t)}</span>${S.perfil.forma === k ? icon('check', 20, 'verde') : ''}</button>`).join('')}</div>`);
    h.addEventListener('click', e => { const b = e.target.closest('[data-fm]'); if (b) { S.perfil.forma = b.dataset.fm; guardar(); cerrarHoja(); nav.render(); } });
  },
  referidos: () => {
    const estado = S.perfil.referidoDemo ? (beneficioDisponible('referido') ? 'Tu 10% ya está disponible al reservar.' : 'Ya usaste tu 10% por referido.') : 'El 10% para ambos se activa con la primera compra de quien invitaste.';
    abrirHoja(`<h2>Invitá a alguien a APROVECHO</h2><p class="chico">${estado}</p><p class="mini">Ejemplo de la demo · APROVECHO cubre el descuento.</p>
      ${S.perfil.referidoDemo ? '' : '<button class="btn bloque" data-act="simular-referido">Simular primera compra de una persona invitada</button>'}`);
  },
  'simular-referido': () => {
    if (S.perfil.referidoDemo) return;
    S.perfil.referidoDemo = true;
    evento('referido_primera_compra_demo', { descuento: .1 });
    guardar();
    cerrarHoja();
    nav.render();
    toast('Se activó un 10% para cada persona.');
  },
};

function usarZona(z, aviso) {
  ubicar({ lat: z[1], lng: z[2], fuente: 'manual', barrio: z[0] });
  evento('ubicacion', { fuente: 'manual', zona: z[0] });
  if (aviso) toast(aviso, { ic: 'info', sinTabs: true });
  nav.go('c/inicio', { raiz: true });
}

// cuando el comercio entrega un pack en este mismo celu, suma al perfil del consumidor
export function sumarAlPerfil(r) {
  if (r.estado !== 'retirada' || r.externa || r.impactoSumado) return;
  r.impactoSumado = true;
  S.consumidor.packs += 1;
  S.consumidor.kg += (r.pesoG || 0) / 1000;
  S.consumidor.ahorro += r.valor - pagado(r);
}
