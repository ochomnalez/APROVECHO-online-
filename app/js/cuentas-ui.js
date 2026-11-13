import { esc } from "./util.js";
import {
  cuenta,
  backend,
  configurado,
  destinoCuenta,
  salir,
  mensajeError,
  sincronizar,
} from "./auth.js";
import { nav } from "./nav.js";
import { confirmar } from "./ui.js";

const marca = `<img class="logo-circular" src="./img/sello-aprovecho.webp" alt="APROVECHO" width="112" height="112">`;
function acceso(tipo = "ingresar") {
  const registro = tipo === "registro",
    recuperar = tipo === "recuperar",
    clave = tipo === "clave";
  const titulo = registro
    ? "Creá tu cuenta"
    : recuperar
      ? "Recuperá tu contraseña"
      : clave
        ? "Elegí una nueva contraseña"
        : "Qué bueno verte";
  return {
    clase: "auth-pantalla",
    html: `<div class="cuerpo acceso"><div class="auth-marca">${marca}<span class="auth-lema">Menos desperdicio, más aprovecho</span></div>
    <div class="auth-card"><h1>${titulo}</h1><p class="chico">${registro ? "Sumate al barrio. Elegí cómo vas a usar APROVECHO." : recuperar ? "Te enviamos un enlace para volver a entrar." : clave ? "Guardá tu nueva contraseña para volver a entrar." : "Ingresá y encontrá tu lugar en APROVECHO."}</p>
    <form data-form="cuenta" data-tipo="${tipo}" class="pila">
      ${
        registro
          ? `<label class="campo"><span>Tu nombre</span><input class="input" name="nombre" autocomplete="name" maxlength="80" required></label>
      <fieldset class="auth-roles"><legend>¿Cómo querés usar APROVECHO?</legend><label><input type="radio" name="rol" value="consumer" checked> Quiero comprar packs</label><label><input type="radio" name="rol" value="merchant"> Tengo un comercio</label></fieldset>
      <div class="campo" data-local hidden><label for="registro-local">Nombre del comercio</label><input class="input" id="registro-local" name="local" maxlength="100" autocomplete="organization"></div>`
          : ""
      }
      ${!clave ? '<label class="campo"><span>Correo electrónico</span><input class="input" name="email" type="email" autocomplete="email" inputmode="email" maxlength="254" required></label>' : ""}
      ${!recuperar ? `<label class="campo"><span>Contraseña</span><span class="auth-password"><input class="input" name="password" id="cuenta-password" type="password" autocomplete="${registro || clave ? "new-password" : "current-password"}" minlength="${registro || clave ? 10 : 1}" maxlength="128" required><button type="button" class="link" data-act="ver-clave" aria-controls="cuenta-password" aria-pressed="false">Mostrar</button></span>${registro || clave ? '<span class="mini">Usá al menos 10 caracteres.</span>' : ""}</label>` : ""}
      <p class="auth-mensaje" role="alert" tabindex="-1" ${cuenta.error ? "" : "hidden"}>${esc(cuenta.error || "")}</p>
      <button class="btn bloque" type="submit" ${configurado() ? "" : "disabled"}>${registro ? "Crear cuenta" : recuperar ? "Enviar enlace" : clave ? "Guardar contraseña" : "Ingresar"}</button>
      ${cuenta.error ? '<button type="button" class="link" data-act="cuenta-reintentar">Reintentar conexión</button>' : ""}
      ${configurado() ? "" : '<p class="mini">Estamos preparando la conexión de las cuentas. Volvé en unos minutos.</p>'}
    </form>
    ${!registro && !recuperar && !clave ? '<button class="link auth-link" data-go="auth/recuperar">Olvidé mi contraseña</button>' : ""}
    <div class="auth-pie">${registro ? "¿Ya tenés cuenta?" : recuperar || clave ? "¿Ya podés entrar?" : "¿Primera vez por acá?"} <button class="link" data-go="auth/${registro || recuperar || clave ? "ingresar" : "registro"}">${registro || recuperar || clave ? "Ingresá" : "Creá tu cuenta"}</button></div>
    </div><p class="mini auth-aclaracion">Tus cuentas se guardan de forma segura. Los packs, pagos, IA y balanza de esta versión siguen siendo de demostración.</p></div>`,
    montar: (el) => {
      const email = el.querySelector('[name="email"]');
      if (email && cuenta.emailSugerido) email.value = cuenta.emailSugerido;
      el.querySelectorAll("[name=rol]").forEach((r) =>
        r.addEventListener("change", () => {
          const local = el.querySelector("[data-local]");
          local.hidden = r.value !== "merchant";
          local.querySelector("input").required = !local.hidden;
        }),
      );
    },
  };
}
async function enviar(form) {
  if (form.dataset.busy || form.dataset.espera || form.dataset.completado || !form.reportValidity()) return;
  form.dataset.busy = "1";
  const btn = form.querySelector("[type=submit]"),
    msg = form.querySelector("[role=alert]");
  btn.disabled = true;
  msg.hidden = true;
  const f = new FormData(form),
    tipo = form.dataset.tipo;
  try {
    const api = await backend();
    let result;
    const email = String(f.get("email") || "").trim();
    const password = String(f.get("password") || "");
    const redirect = new URL("./", location.href).href;
    if (tipo === "registro")
      result = await api.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirect,
          data: {
            full_name: String(f.get("nombre")).trim(),
            account_type: f.get("rol"),
            merchant_name: String(f.get("local") || "").trim(),
          },
        },
      });
    else if (tipo === "recuperar")
      result = await api.auth.resetPasswordForEmail(email, {
        redirectTo: new URL("?auth=recovery", redirect).href,
      });
    else if (tipo === "clave") result = await api.auth.updateUser({ password });
    else result = await api.auth.signInWithPassword({ email, password });
    if (result.error) throw result.error;
    if (tipo === "recuperar" || (tipo === "registro" && !result.data.session)) {
      msg.hidden = false;
      msg.classList.add("exito");
      msg.textContent =
        tipo === "recuperar"
          ? "Si el correo tiene una cuenta, vas a recibir un enlace para recuperar tu contraseña."
          : "Revisá tu correo para confirmar la cuenta. Si ya estabas registrado, ingresá o recuperá tu contraseña.";
      msg.focus();
      const input = form.querySelector("[name=password]");
      if (input) input.value = "";
      cuenta.emailSugerido = email;
      form.dataset.completado = "1";
      btn.hidden = true;
      form.querySelectorAll("input").forEach(input => input.disabled = true);
      const volver = document.createElement("button");
      volver.type = "button";
      volver.className = "btn bloque";
      volver.dataset.go = "auth/ingresar";
      volver.textContent = "Ir a Ingresar";
      form.appendChild(volver);
    } else if (tipo === "clave") {
      cuenta.recovery = false;
      const retorno = new URL(location.href);
      retorno.searchParams.delete('auth');
      history.replaceState(history.state, '', retorno.pathname + retorno.search + retorno.hash);
      nav.go(destinoCuenta(), { raiz: true });
    } else await sincronizar(result.data.session);
  } catch (e) {
    msg.hidden = false;
    msg.classList.remove("exito");
    msg.textContent = mensajeError(e);
    msg.focus();
    if (e?.code === "over_email_send_rate_limit" || e?.code === "over_request_rate_limit") {
      form.dataset.espera = "1";
      const original = btn.textContent;
      let restantes = 60;
      btn.textContent = `Reintentar en ${restantes} s`;
      const reloj = setInterval(() => {
        if (!form.isConnected) { clearInterval(reloj); return; }
        restantes -= 1;
        btn.textContent = restantes > 0 ? `Reintentar en ${restantes} s` : original;
        if (restantes <= 0) { clearInterval(reloj); delete form.dataset.espera; btn.disabled = false; }
      }, 1000);
    }
  } finally {
    delete form.dataset.busy;
    btn.disabled = !!form.dataset.espera;
  }
}
const tipos = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
};
let adminFiltro = "todos",
  adminBusqueda = "",
  adminPagina = 0;
function admin() {
  return {
    clase: "admin-pantalla",
    html: `<header class="barra"><b>APROVECHO · Administración</b><button class="link" data-act="cerrar-sesion">Salir</button></header>
  <div class="cuerpo admin-cuerpo"><span class="eti">Panel de fundadores</span><h1>Así crece APROVECHO</h1><p class="chico">Altas reales de cuentas y comercios. Los packs de la demo no forman parte de estas métricas.</p><div class="admin-resumen" id="admin-resumen" aria-live="polite">Cargando indicadores…</div>
  <section class="card"><div class="fila entre"><h2>Comercios</h2><button class="link" data-act="admin-refrescar">Actualizar</button></div>
  <div class="admin-filtros"><label class="campo"><span>Estado</span><select class="input" id="admin-estado"><option value="todos">Todos</option>${Object.entries(
    tipos,
  )
    .map(
      ([v, t]) =>
        `<option value="${v}" ${adminFiltro === v ? "selected" : ""}>${t}</option>`,
    )
    .join("")}</select></label>
  <form data-form="admin-buscar" class="campo"><label for="admin-buscar">Nombre del comercio</label><div class="fila"><input class="input" id="admin-buscar" name="busqueda" value="${esc(adminBusqueda)}" maxlength="80"><button class="btn" type="submit">Buscar</button></div></form></div>
  <div id="admin-lista" aria-live="polite">Cargando comercios…</div><div class="fila entre"><button class="btn sec" data-act="admin-anterior" ${adminPagina === 0 ? "disabled" : ""}>Anterior</button><span class="mini">Página ${adminPagina + 1}</span><button class="btn sec" data-act="admin-siguiente" disabled>Siguiente</button></div></section>
  <p class="mini" id="admin-actualizado"></p></div>`,
    montar: (el) => {
      el.querySelector("#admin-estado").addEventListener("change", (e) => {
        adminFiltro = e.target.value;
        adminPagina = 0;
        nav.render();
      });
      cargarAdmin(el);
    },
  };
}
async function cargarAdmin(el) {
  const lista = el.querySelector("#admin-lista"),
    resumen = el.querySelector("#admin-resumen");
  try {
    const api = await backend();
    const counts = await Promise.all([
      api.from("ap_merchants").select("*", { count: "exact", head: true }),
      api
        .from("ap_merchants")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      api
        .from("ap_merchants")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved"),
      api
        .from("ap_profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "consumer"),
      api
        .from("ap_merchants")
        .select("*", { count: "exact", head: true })
        .gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString()),
    ]);
    if (counts.some((r) => r.error || r.count === null)) throw Error();
    if (!el.isConnected) return;
    resumen.innerHTML = [
      "Comercios registrados",
      "Por revisar",
      "Aprobados",
      "Consumidores",
      "Altas de comercios · 7 días",
    ]
      .map(
        (t, i) =>
          `<div class="card"><b>${counts[i].count}</b><span>${t}</span></div>`,
      )
      .join("");
    let query = api
      .from("ap_merchants")
      .select("*, ap_profiles!ap_merchants_owner_id_fkey(full_name,email)", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .order("id")
      .range(adminPagina * 20, adminPagina * 20 + 19);
    if (adminFiltro !== "todos") query = query.eq("status", adminFiltro);
    if (adminBusqueda)
      query = query.ilike(
        "name",
        "%" + adminBusqueda.replace(/[%_\\]/g, "") + "%",
      );
    const { data, error, count } = await query;
    if (error) throw error;
    if (!el.isConnected) return;
    lista.innerHTML = data.length
      ? data
          .map(
            (m) =>
              `<article class="admin-comercio"><div class="fila entre"><h3>${esc(m.name)}</h3><span class="badge ${m.status === "pending" ? "horno" : "gris"}">${tipos[m.status]}</span></div><p>${esc(m.ap_profiles?.full_name || "")} · ${esc(m.ap_profiles?.email || "")}</p><p class="mini">${esc(m.address || "Dirección pendiente")} · ${esc(m.category || "Rubro pendiente")} · Plan ${esc(m.plan)}</p><p class="mini">CUIT: ${esc(m.cuit || "Pendiente")} · Alta: ${new Date(m.created_at).toLocaleDateString("es-AR")}</p>${m.review_note ? `<p class="mini">Nota de revisión: ${esc(m.review_note)}</p>` : ""}<div class="fila-btns">${m.status !== "approved" ? `<button class="btn" data-act="admin-revisar" data-id="${m.id}" data-estado="approved">Aprobar</button>` : ""}${m.status !== "rejected" ? `<button class="btn sec" data-act="admin-revisar" data-id="${m.id}" data-estado="rejected">Rechazar</button>` : ""}${m.status !== "pending" ? `<button class="link" data-act="admin-revisar" data-id="${m.id}" data-estado="pending">Volver a pendiente</button>` : ""}</div></article>`,
          )
          .join("")
      : '<p class="chico">Todavía no hay comercios con estos filtros.</p>';
    el.querySelector("[data-act=admin-siguiente]").disabled =
      (adminPagina + 1) * 20 >= count;
    el.querySelector("#admin-actualizado").textContent =
      "Actualizado a las " +
      new Date().toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      });
  } catch (e) {
    if (el.isConnected) {
      lista.innerHTML =
        '<p role="alert">No pudimos cargar los datos. Reintentá con Actualizar.</p>';
      resumen.textContent = "Indicadores no disponibles";
    }
  }
}
function miCuenta() {
  const m = cuenta.merchant;
  return {
    html: `<header class="barra"><button class="link" data-go="${destinoCuenta()}">Volver</button><b>Mi cuenta</b></header><div class="cuerpo"><h1>${esc(cuenta.profile?.full_name || "")}</h1><p>${esc(cuenta.profile?.email || "")}</p><span class="badge">${cuenta.profile?.role === "merchant" ? "Comercio" : cuenta.profile?.role === "admin" ? "Administración" : "Consumidor"}</span>${m ? `<section class="card"><h2>${esc(m.name)}</h2><p>Estado del alta: <b>${tipos[m.status]}</b></p><p class="chico">${m.status === "pending" ? "Estamos revisando el alta de tu comercio. Mientras tanto podés recorrer la app con los packs de ejemplo." : m.status === "rejected" ? "Tu comercio requiere una revisión antes de operar." : "Tu comercio fue aprobado. Los packs y pagos de esta versión siguen siendo de demostración."}</p></section>` : ""}<form data-form="datos-cuenta" class="card pila"><h2>Tus datos</h2><label class="campo"><span>Nombre</span><input class="input" name="nombre" value="${esc(cuenta.profile?.full_name)}" maxlength="80" required></label>${m ? `<label class="campo"><span>Comercio</span><input class="input" name="local" value="${esc(m.name)}" maxlength="100" required></label><label class="campo"><span>Dirección</span><input class="input" name="direccion" value="${esc(m.address)}" maxlength="200" autocomplete="street-address"></label><label class="campo"><span>CUIT</span><input class="input" name="cuit" value="${esc(m.cuit)}" maxlength="20" inputmode="numeric"></label><label class="campo"><span>Rubro</span><input class="input" name="rubro" value="${esc(m.category)}" maxlength="80" placeholder="Panadería, rotisería, supermercado…"></label>` : ""}<p role="status" hidden></p><button class="btn" type="submit">Guardar datos</button></form><button class="btn bloque sec" data-act="cerrar-sesion">Cerrar sesión</button></div>`,
  };
}
export const pantallas = {
  "auth/cuenta": miCuenta,
  bienvenida: () => acceso(),
  "auth/ingresar": () => acceso(),
  "auth/registro": () => acceso("registro"),
  "auth/recuperar": () => acceso("recuperar"),
  "auth/clave": () => acceso("clave"),
  admin,
};
export const formularios = {
  cuenta: enviar,
  "datos-cuenta": async (form) => {
    if (form.dataset.busy || !form.reportValidity()) return;
    form.dataset.busy = "1";
    const btn = form.querySelector("[type=submit]"),
      msg = form.querySelector("[role=status]");
    btn.disabled = true;
    try {
      const api = await backend(),
        data = new FormData(form);
      const p = await api
        .from("ap_profiles")
        .update({ full_name: String(data.get("nombre")).trim() })
        .eq("id", cuenta.user.id);
      if (p.error) throw p.error;
      if (cuenta.merchant) {
        const m = await api
          .from("ap_merchants")
          .update({
            name: String(data.get("local")).trim(),
            address: String(data.get("direccion")).trim(),
            cuit: String(data.get("cuit")).trim(),
            category: String(data.get("rubro")).trim(),
          })
          .eq("id", cuenta.merchant.id);
        if (m.error) throw m.error;
      }
      const { data: s } = await api.auth.getSession();
      await sincronizar(s.session);
    } catch (e) {
      msg.hidden = false;
      msg.textContent = "No pudimos guardar todos los datos. Reintentá.";
    } finally {
      delete form.dataset.busy;
      btn.disabled = false;
    }
  },
  "admin-buscar": (form) => {
    adminBusqueda = form.busqueda.value.trim();
    adminPagina = 0;
    nav.render();
  },
};
export const acciones = {
  "cuenta-reintentar": async () => {
    const api = await backend();
    const { data } = await api.auth.getSession();
    await sincronizar(data.session);
  },
  "cerrar-sesion": async () => {
    try {
      await salir();
    } catch (e) {
      await confirmar({
        titulo: "No pudimos cerrar la sesión",
        texto: "Revisá la conexión y volvé a intentar.",
        si: "Entendido",
        no: "Volver",
      });
    }
  },
  "admin-refrescar": () => nav.render(),
  "admin-anterior": () => {
    adminPagina = Math.max(0, adminPagina - 1);
    nav.render();
  },
  "admin-siguiente": () => {
    adminPagina++;
    nav.render();
  },
  "admin-revisar": async (ds) => {
    const ok = await confirmar({
      titulo:
        ds.estado === "approved"
          ? "¿Aprobás este comercio?"
          : ds.estado === "rejected"
            ? "¿Rechazás este comercio?"
            : "¿Volvés a marcarlo pendiente?",
      texto: "El cambio queda registrado en el historial de administración.",
      si: "Confirmar",
    });
    if (!ok) return;
    try {
      const api = await backend();
      const { error } = await api
        .from("ap_merchants")
        .update({ status: ds.estado })
        .eq("id", ds.id);
      if (error) throw error;
      nav.render();
    } catch (e) {
      await confirmar({
        titulo: "No se pudo guardar el cambio",
        texto: "Revisá la conexión y tus permisos.",
        si: "Entendido",
        no: "Volver",
      });
    }
  },
};
acciones["ver-clave"] = (ds, btn) => {
  const input = document.getElementById("cuenta-password");
  if (!input) return;
  const mostrar = input.type === "password";
  input.type = mostrar ? "text" : "password";
  btn.textContent = mostrar ? "Ocultar" : "Mostrar";
  btn.setAttribute("aria-pressed", String(mostrar));
};
