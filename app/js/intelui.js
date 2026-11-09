// Pantallas de Intelligence (B-15 a B-20).
import { esc, plata, dec, num, pct, pct1, DIAS, isoDia, sumarDias, ddmm } from './util.js';
import { icon } from './icons.js';
import { S, guardar, ahora, evento } from './store.js';
import { CONFIG, MOTIVOS_DESCARTE } from './data.js';
import { tabsComercio, barra, barras, badgeConfianza, abrirHoja, cerrarHoja, toast, vacio, nota, demoPill } from './ui.js';
import { resumen, filtrar, semanas, sugerencias, estadisticas, ranking, SUCURSALES } from './intel.js';
import { impactoDatos, elegirSucursal, prepararPropuestaInventario } from './comercio.js';
import { leerInventario, verInventario } from './inventario.js';
import { nav } from './nav.js';

let sub = 'resumen';
let filtroTipo = 'Todas';
let periodoDatos = 'mes';
const SUBS = [['resumen', 'Resumen'], ['sugerencias', 'Sugerencias'], ['datos', 'Datos'], ['sucursales', 'Sucursales'], ['inventario', 'Inventario']];

// las estimaciones se muestran redondeadas: la cuenta exacta está en el detalle
const aprox = v => plata(Math.round(v / 100) * 100);
const nombreSuc = () => (S.sucursal === 'todas' ? 'Todas las sucursales' : SUCURSALES.find(s => s.id === S.sucursal).nombre);
const porRetirar = () => S.reservas.filter(r => r.comercioId === 'c1' && r.estado === 'activa').length;

function encabezado() {
  return `<header class="barra intel-encabezado"><h1>Intelligence</h1>
    <span class="mini intel-demo">Panel de cadena · Demo</span>
    <button class="icbtn" data-go="b/reporte" aria-label="Descargar reporte">${icon('bajar', 22)}</button>${demoPill()}</header>`;
}

function navegacion() {
  return `<aside class="intel-lateral">
    <nav class="pestanas intel-pestanas" aria-label="Secciones de Intelligence">
      ${SUBS.map(([k, t]) => `<button ${sub === k ? 'aria-current="page" class="on"' : ''} data-act="intel-sub" data-v="${k}">${t}</button>`).join('')}
    </nav>
    <button class="fila entre intel-sucursal" data-act="elegir-sucursal">
      <span class="fila">${icon(S.sucursal === 'todas' ? 'sucursales' : 'local', 18, 'verde')}<span class="fuerte">${esc(nombreSuc())}</span></span>${icon('abajo', 18)}
    </button>
  </aside>`;
}

function inventarioPantalla() {
  const inventario = verInventario();
  return `
    <section class="card">
      <h2>Inventario de envasados</h2>
      <p class="chico">${S.inventario ? 'CSV cargado en esta demo.' : 'Inventario de ejemplo. Podés cargar un CSV local.'}</p>
      <p class="mini">Columnas: sucursal, producto, cantidad, vencimiento (AAAA-MM-DD), precio_unitario (ARS). IDs de sucursal: ${SUCURSALES.map(s => s.id).join(', ')}.</p>
      <label class="intel-archivo">Seleccioná un CSV <input type="file" accept=".csv,text/csv" data-act-change="intel-csv"></label>
      <p class="chico" role="status" id="intel-resultado-csv"></p>
    </section>
    <section class="card">
      <h2>Productos y vencimientos</h2>
      <div class="intel-tabla"><table>
        <thead><tr><th scope="col">Producto</th><th scope="col">Sucursal</th><th scope="col">Unidades</th><th scope="col">Vence</th><th scope="col">Estado</th></tr></thead>
        <tbody>${inventario.map(p => `<tr><th scope="row">${esc(p.titulo)}</th><td>${esc(SUCURSALES.find(s => s.id === p.sucursal).nombre)}</td><td>${p.cantidad}</td>
          <td>${p.vencimiento.split('-').reverse().join('/')}</td><td><span class="badge ${p.estado === 'Vigente' ? 'gris' : 'horno'}">${p.estado}</span></td></tr>`).join('')}</tbody>
      </table></div>
      ${inventario.length ? '' : '<p class="chico">No hay productos para esta sucursal.</p>'}
    </section>
    <section class="card">
      <h2>Packs sugeridos</h2>
      <p class="chico">Se sugieren envasados por vencer que siguen aptos para consumo. Revisá la propuesta antes de publicar.</p>
      <div class="lista">${inventario.filter(p => p.estado === 'Por vencer' && p.cantidad > 0).map(p => `
        <button class="item" data-act="intel-proponer" data-id="${p.indice}">
          <span class="ic-caja">${icon('bolsa', 20)}</span><span class="col crece"><span class="fuerte">${esc(p.titulo)}</span>
          <span class="mini">${Math.min(p.cantidad, 2)} u. · ${plata(p.precioUnitario * Math.min(p.cantidad, 2) * .5)} · 50% de descuento</span></span>${icon('adelante', 18)}
        </button>`).join('') || '<p class="chico">No hay packs sugeridos para esta selección.</p>'}</div>
    </section>`;
}

// ---------------------------------------------------------------------------
function resumenPantalla() {
  const mes = resumen(filtrar('mes', S.sucursal, ahora()));
  const prev = resumen(filtrar({ desde: isoDia(sumarDias(ahora(), -60)), hasta: isoDia(sumarDias(ahora(), -31)) }, S.sucursal, ahora()));
  const sem = semanas(S.sucursal, 8, ahora());
  const sug = sugerencias(S.sucursal, ahora(), S.sugerencias);
  const nuevas = sug.filter(s => s.estado === 'nueva');
  const delta = (mes.pctDesp - prev.pctDesp) * 100;
  const { r: imp } = impactoDatos('mes', S.sucursal);
  return `
    <div class="card">
      <div class="fila arriba entre">
        <div class="kpi"><span class="n">${pct1(mes.pctDesp)}</span><span class="k">de lo producido terminó en la basura · últimos 30 días</span></div>
        <span class="badge${delta <= 0 ? '' : ' horno'}">${icon(delta <= 0 ? 'baja' : 'sube', 14)} ${dec(Math.abs(delta))} pts</span>
      </div>
      ${barras(sem.map(s => s.pctDesp * 100), sem.map(s => ddmm(new Date(s.desde + 'T12:00'))), { destacar: sem.length - 1, fmt: v => dec(v) + '%', alto: 118 })}
      <span class="mini">% de desperdicio por semana</span>
    </div>
    <div class="stats dos">
      <div class="stat"><span class="n verde">${plata(mes.costoEvitado)}</span><span class="k">Costo evitado · sugerencias aplicadas, 30 días</span></div>
      <div class="stat"><span class="n">${plata(imp.recuperado)}</span><span class="k">$ recuperados con packs · 30 días</span></div>
      <div class="stat"><span class="n">${dec(imp.kgRescatado)} kg</span><span class="k">Alimento recuperado · peso demo</span></div>
      <div class="stat"><span class="n">${dec(mes.mermaKg)} kg</span><span class="k">A la basura · Medido en la estación simulada</span></div>
    </div>
    <div class="card">
      <h3>Huella asociada a los alimentos recuperados</h3>
      <p>≈ ${dec(imp.co2)} kg CO₂e <span class="badge horno">Estimado</span></p>
      <p>≈ ${num(imp.kgRescatado * CONFIG.factorAgua)} litros de agua dulce <span class="badge horno">Estimado</span></p>
      <p class="mini">Factores FAO del plan: ${String(CONFIG.factorCO2).replace('.', ',')} kg CO₂e y ${CONFIG.factorAgua} litros por kg de alimento.</p>
    </div>
    ${nuevas.length ? `<button class="card toque sel" data-act="intel-sub" data-v="sugerencias" style="text-align:left">
      <div class="fila entre"><span class="badge">${icon('grafico', 14)} ${nuevas.length} sugerencia${nuevas.length > 1 ? 's' : ''} nueva${nuevas.length > 1 ? 's' : ''}</span>${icon('adelante', 20)}</div>
      <span class="fuerte" style="font-size:17px">${esc(nuevas[0].titulo)}</span>
      <span class="chico">≈ ${aprox(nuevas[0].plata)}/mes · ${nuevas[0].confianza === 'alta' ? 'confianza alta' : 'confianza ' + nuevas[0].confianza}</span>
    </button>` : ''}
    <div class="seccion"><h3>Fuentes de datos</h3></div>
    <div class="lista">
      <div class="item"><span class="ic-caja">${icon('balanza', 20)}</span><span class="col crece"><span class="fuerte">Estaciones</span><span class="mini">${S.sucursal === 'todas' ? '3 de 3 conectadas' : 'Conectada'}</span></span><span class="badge">● OK</span></div>
      <div class="item"><span class="ic-caja">${icon('grafico', 20)}</span><span class="col crece"><span class="fuerte">Historial de ventas</span><span class="mini">14 meses simulados</span></span><span class="badge">Demo</span></div>
      <div class="item"><span class="ic-caja">${icon('bolsa', 20)}</span><span class="col crece"><span class="fuerte">Packs de Aprovecho</span><span class="mini">${num(resumen(filtrar('todo', S.sucursal, ahora())).packsPub)} packs publicados</span></span><span class="badge">● OK</span></div>
    </div>
    <div class="card"><h3>Informe de analistas</h3><p class="chico">En el servicio, los analistas de APROVECHO revisan y validan los informes. Esta vista usa historial y conclusiones de demostración.</p><button class="btn sec" data-go="b/reporte">Ver reporte de ejemplo</button></div>
    ${nota('Demo: el historial de ventas y de la estación es simulado.')}`;
}

// ---------------------------------------------------------------------------
function sugerenciasPantalla() {
  const todas = sugerencias(S.sucursal, ahora(), S.sugerencias);
  const tipos = ['Todas', 'Producción', 'Ventas', 'Finanzas'];
  const lista = todas.filter(s => filtroTipo === 'Todas' || s.tipo === filtroTipo);
  const historial = semanas(S.sucursal, 4, ahora());
  const proyeccion = historial.reduce((suma, semana) => suma + semana.pctDesp, 0) / historial.length;
  const estadoTxt = s => ({ nueva: '', en_prueba: '<span class="badge gris">En prueba</span>', funciono: '<span class="badge">✓ Funcionó</span>', descartada: '<span class="badge gris">Descartada</span>' })[s.estado];
  return `
    <div class="card">
      <h2>Pronóstico de desperdicio</h2>
      <div class="fila entre"><span class="fuerte num">${pct1(proyeccion)} de lo producido</span><span class="badge horno">Estimado</span></div>
      <p class="chico">Referencia para la próxima semana. Promedio de cuatro semanas simuladas de la sucursal seleccionada.</p>
    </div>
    <div class="chips scroll">${tipos.map(t => `<button class="chip${filtroTipo === t ? ' on' : ''}" data-act="filtro-sug" data-v="${t}">${t}</button>`).join('')}</div>
    ${lista.length ? lista.map(s => `<button class="card toque${s.estado === 'descartada' ? '' : ''}" data-go="b/sugerencia/${s.id}" style="text-align:left;${s.estado === 'descartada' ? 'opacity:.6' : ''}">
      <div class="fila entre"><span class="eti">${esc(s.tipo)}</span>${s.estado === 'nueva' ? badgeConfianza(s.confianza) : estadoTxt(s)}</div>
      <span class="fuerte" style="font-size:17px;line-height:1.25">${esc(s.titulo)}</span>
      <span class="chico">${esc(s.porque)}</span>
      <div class="fila entre"><span class="fuerte verde">${s.plata ? '≈ ' + aprox(s.plata) + '/mes' : ''}${s.kg ? ` <span class="mini" style="font-weight:700">· ${dec(s.kg)} kg/mes</span>` : ''}</span><span class="link">Ver ${icon('adelante', 16)}</span></div>
    </button>`).join('') : vacio('grafico', 'Sin sugerencias de este tipo', 'Probá con otro filtro.')}
    ${nota('Predicciones orientativas, con impacto estimado. En el servicio, revisalas con el analista y el comercio antes de cambiar la producción.')}`;
}

// ---------------------------------------------------------------------------
function datosPantalla() {
  const e = estadisticas(S.sucursal, periodoDatos, ahora());
  const dias = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const horas = ['17 h', '18 h', '19 h', '20 h', '21 h'];
  const diaPico = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'][e.pico[1]];
  const tam = [['Chico', e.tam.chico], ['Mediano', e.tam.mediano], ['Grande', e.tam.grande]];
  const masVendido = tam.slice().sort((a, b) => b[1] - a[1])[0];
  return `
    <div class="seg">${[['semana', 'Semana'], ['mes', 'Mes'], ['todo', '14 meses']].map(([k, t]) => `<button class="${periodoDatos === k ? 'on' : ''}" data-act="periodo-datos" data-v="${k}">${t}</button>`).join('')}</div>
    <div class="card">
      <h3>¿A qué hora se reservan los packs?</h3>
      <div class="calor"><span></span>${dias.map(d => `<span>${d}</span>`).join('')}
        ${e.calor.map((f, h) => `<span>${horas[h]}</span>${f.map(v => `<i style="opacity:${(0.08 + v * .92).toFixed(2)}" title="${Math.round(v * 100)}%"></i>`).join('')}`).join('')}
      </div>
      <p class="chico">El pico es el <b>${diaPico}</b> a las <b>${17 + e.pico[0]} h</b>. Publicá con al menos una hora de anticipación.</p>
    </div>
    <div class="card">
      <h3>¿Qué pack se vende más?</h3>
      ${tam.map(([t, v]) => `<div class="hbar"><span>${t}</span><div class="progreso"><i style="width:${Math.round(v * 100)}%"></i></div><b>${pct(v)}</b></div>`).join('')}
      <p class="chico">El ${masVendido[0].toLowerCase()} es el que más sale: ${pct(masVendido[1])} de los packs vendidos.</p>
    </div>
    <div class="card">
      <h3>¿De dónde son tus clientes?</h3>
      ${e.zonas.map(([z, v]) => `<div class="hbar"><span class="trunc">${esc(z)}</span><div class="progreso medio"><i style="width:${Math.round(v * 100)}%"></i></div><b>${pct(v)}</b></div>`).join('')}
      <p class="mini">Barrio de la dirección de cada cliente, siempre agrupado: nunca se ve a una persona.</p>
    </div>
    <div class="card">
      <h3>¿En qué parte del mes se vende más?</h3>
      ${barras(e.tercios.map(v => v * 100), ['Días 1–10', '11–20', '21–31'], { destacar: e.caidaFinMes > 0 ? 2 : 0, warn: e.caidaFinMes > 0, fmt: v => Math.round(v) + '%', alto: 120 })}
      <span class="mini">Qué porcentaje de los packs publicados se vende</span>
      <p class="chico">${e.caidaFinMes > .03 ? `Del 21 en adelante se vende <b>${pct(e.caidaFinMes)} menos</b> de lo que publicás: conviene publicar packs más chicos.` : e.caidaFinMes < -.03 ? `A fin de mes se vende <b>${pct(-e.caidaFinMes)} más</b> que a principio.` : 'Se vende parecido en todo el mes.'}</p>
    </div>`;
}

// ---------------------------------------------------------------------------
function sucursalesPantalla() {
  const rk = ranking('mes', ahora());
  const peor = rk[rk.length - 1], mejor = rk[0];
  const pan = [...rk].sort((a, b) => b.panRatio - a.panRatio);
  const veces = pan[0].panRatio / pan[pan.length - 1].panRatio;
  return `
    <span class="eti">% de desperdicio sobre lo producido · 30 días</span>
    <div class="lista">${rk.map((s, i) => `<button class="item" data-act="ir-sucursal" data-v="${s.id}">
      <span class="ic-caja" style="font-family:var(--display);font-weight:800">${i + 1}</span>
      <span class="col crece"><span class="fuerte">${esc(s.nombre)}</span><span class="mini">${dec(s.kgBasura)} kg a la basura · ${plata(s.recuperado)} recuperados</span></span>
      <span class="col" style="align-items:flex-end;gap:2px"><span class="fuerte num">${pct1(s.pctDesp)}</span>
      <span class="badge${s.delta <= 0 ? '' : ' horno'}" style="height:20px;font-size:11px">${s.delta <= 0 ? '↓' : '↑'} ${dec(Math.abs(s.delta * 100))}</span></span>
    </button>`).join('')}</div>
    <div class="card sel">
      <span class="eti">La diferencia más grande</span>
      <span class="fuerte" style="font-size:17px">${esc(pan[0].nombre)} tira ${dec(veces)} veces más pan que ${esc(pan[pan.length - 1].nombre)} por cada kg que produce</span>
      <span class="chico">Mismo producto, misma receta: la diferencia está en cuánto se hornea en la tanda de la tarde.</span>
      <button class="link" data-go="b/sugerencia/suc-pan" style="align-self:flex-start">Ver la sugerencia ${icon('adelante', 16)}</button>
    </div>
    <p class="chico">El ranking va en % y no en kg: así una sucursal grande no queda castigada por producir más. ${esc(mejor.nombre)} es la referencia; ${esc(peor.nombre)}, la que más margen de mejora tiene.</p>
    ${nota('Tocá una sucursal para ver todo Intelligence filtrado por esa sucursal.')}`;
}

// ---------------------------------------------------------------------------
function intel() {
  if (S.plan !== 'intelligence') return { html: '', redirigir: 'b/impacto' };
  const cuerpo = { resumen: resumenPantalla, sugerencias: sugerenciasPantalla, datos: datosPantalla, sucursales: sucursalesPantalla, inventario: inventarioPantalla }[sub]();
  return {
    tabs: tabsComercio('b/intel', porRetirar()), clase: 'con-tabs gris intel-panel',
    html: `${encabezado()}<div class="intel-layout">${navegacion()}<div class="cuerpo intel-contenido">${cuerpo}</div></div>`,
  };
}

function detalleSugerencia(id) {
  const s = sugerencias(S.sucursal === 'todas' || id !== 'suc-pan' ? S.sucursal : 'todas', ahora(), S.sugerencias).find(x => x.id === id)
    || sugerencias('todas', ahora(), S.sugerencias).find(x => x.id === id);
  if (!s) return { html: `${barra({ titulo: '' })}<div class="cuerpo">${vacio('grafico', 'Esta sugerencia ya no aplica', 'Los datos cambiaron desde que se generó.')}</div>` };
  const g = s.grafico;
  const estado = {
    nueva: `<div class="fila-btns"><button class="btn gris" data-act="descartar-sug" data-id="${s.id}">Descartar</button><button class="btn" data-act="aplicar-sug" data-id="${s.id}">${s.experimento ? 'Probar 2 semanas' : 'Aplicar'}</button></div>`,
    en_prueba: `<div class="card suave"><span class="fuerte">${icon('reloj', 18, 'verde')} En prueba desde el ${ddmm(new Date(s.desde + 'T12:00'))}</span><span class="chico">Medimos el resultado el ${ddmm(sumarDias(new Date(s.desde + 'T12:00'), 14))}. Te avisamos si funcionó.</span><button class="link" data-act="cancelar-sug" data-id="${s.id}" style="align-self:flex-start">Dejar de probar</button></div>`,
    funciono: `<div class="card suave"><span class="fuerte">${icon('check', 18, 'verde')} Funcionó</span><span class="chico">${esc(s.porque)}</span></div>`,
    descartada: `<div class="card plana"><span class="fuerte">Descartada</span><span class="chico">Motivo: ${esc(s.motivo || 'sin motivo')}. No la volvemos a sugerir.</span><button class="link" data-act="cancelar-sug" data-id="${s.id}" style="align-self:flex-start">Volver a considerarla</button></div>`,
  }[s.estado];
  return {
    clase: 'gris intel-detalle',
    html: `${barra({ titulo: s.tipo, accion: `<span style="margin-right:8px">${badgeConfianza(s.confianza)}</span>` })}
    <div class="cuerpo">
      <h1 class="gran-titulo" style="font-size:25px">${esc(s.titulo)}</h1>
      <div class="card">
        <span class="eti">${esc(g.titulo)}</span>
        ${barras(g.valores, g.labels, { destacar: g.destacar, warn: s.tipo === 'Producción' && s.estado !== 'funciono', fmt: g.fmt, alto: 150 })}
      </div>
      <div class="card"><span class="eti">Por qué</span><p>${esc(s.porque)}</p></div>
      <div class="card"><span class="eti">La cuenta</span>${s.cuenta.map(c => `<p class="num" style="font-size:15px">${esc(c)}</p>`).join('')}
        ${s.plata ? `<div class="sep"></div><div class="fila entre"><span class="chico">Impacto estimado</span><span class="fuerte verde" style="font-size:19px">≈ ${aprox(s.plata)}/mes</span></div>` : ''}
      </div>
      <div class="card plana"><span class="eti">Confianza ${esc(s.confianza)}</span>
        <div class="confianza"><div class="progreso${s.confianza === 'alta' ? '' : s.confianza === 'media' ? ' medio' : ' bajo'}"><i style="width:${Math.round(s.confPct * 100)}%"></i></div><span class="mini fuerte">${Math.round(s.confPct * 100)}%</span></div>
        <span class="mini">Basada en ${s.semanas} semanas de datos. ${s.confianza === 'baja' ? 'Hay pocos datos: por eso se propone como prueba.' : 'El patrón se repite en la mayoría de las semanas.'}</span></div>
      ${s.accion && s.estado === 'nueva' ? `<p class="chico">${esc(s.accion)}</p>` : ''}
      ${estado}
    </div>`,
  };
}

export const pantallas = { 'b/intel': intel, 'b/sugerencia': detalleSugerencia };

export const acciones = {
  'intel-sub': ds => {
    sub = ds.v;
    nav.render();
    document.querySelector('.pantalla.actual .cuerpo')?.scrollTo(0, 0);
    document.querySelector('.pantalla.actual .intel-pestanas [aria-current="page"]')?.focus();
  },
  'filtro-sug': ds => { filtroTipo = ds.v; nav.render(); },
  'periodo-datos': ds => { periodoDatos = ds.v; nav.render(); },
  'intel-proponer': ds => {
    const fila = verInventario().find(p => p.indice === Number(ds.id) && p.estado === 'Por vencer' && p.cantidad > 0);
    if (!fila) return;
    const cantidad = Math.min(fila.cantidad, 2);
    const inventario = S.inventario;
    prepararPropuestaInventario({
      ...fila, cantidad,
      consumirInventario: () => {
        const actual = verInventario().find(p => p.indice === fila.indice);
        if (S.inventario !== inventario || actual?.estado !== 'Por vencer' || actual.cantidad < cantidad) return false;
        S.inventario ??= verInventario('todas').sort((a, b) => a.indice - b.indice);
        S.inventario[fila.indice].cantidad -= cantidad;
        return true;
      }
    });
  },
  'ir-sucursal': ds => { S.sucursal = ds.v; sub = 'resumen'; guardar(); nav.render(); toast(`Viendo ${SUCURSALES.find(s => s.id === ds.v).nombre}`); },
  'aplicar-sug': ds => {
    S.sugerencias[ds.id] = { estado: 'en_prueba', desde: isoDia(ahora()) };
    evento('sugerencia', { id: ds.id, accion: 'aplicar' }); guardar();
    toast('Aplicada. En 2 semanas medimos si funcionó.', { sinTabs: true });
    nav.render();
  },
  'cancelar-sug': ds => { delete S.sugerencias[ds.id]; guardar(); nav.render(); },
  'descartar-sug': ds => {
    const h = abrirHoja(`<h2>¿Por qué la descartás?</h2><p class="chico">Así no te sugerimos lo mismo otra vez.</p>
      <div class="lista">${MOTIVOS_DESCARTE.map(m => `<button class="item" data-m="${m}"><span class="crece fuerte">${m}</span></button>`).join('')}</div>`);
    h.addEventListener('click', e => {
      const b = e.target.closest('[data-m]'); if (!b) return;
      S.sugerencias[ds.id] = { estado: 'descartada', motivo: b.dataset.m };
      evento('sugerencia', { id: ds.id, accion: 'descartar', motivo: b.dataset.m }); guardar();
      cerrarHoja(); toast('Descartada', { sinTabs: true }); nav.render();
    });
  },
  'elegir-sucursal': () => elegirSucursal(),
};

export const accionesCambio = {
  'intel-csv': async input => {
    const archivo = input.files?.[0];
    if (!archivo) return;
    const sesion = S;
    try {
      if (archivo.size > 256 * 1024) throw new Error('Seleccioná un CSV de hasta 256 KB.');
      const filas = leerInventario(await archivo.text());
      if (S !== sesion || S.plan !== 'intelligence') return;
      S.inventario = filas;
      guardar();
      if (nav.ruta === 'b/intel') {
        nav.render();
        const resultado = document.getElementById('intel-resultado-csv');
        if (resultado) resultado.textContent = filas.length === 1 ? '1 producto cargado.' : filas.length + ' productos cargados.';
      }
    } catch (error) {
      const resultado = document.getElementById('intel-resultado-csv');
      if (resultado) resultado.textContent = error.message;
    }
  }
};
