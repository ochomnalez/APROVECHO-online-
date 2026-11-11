import { AUTH_CONFIG } from "./auth-config.js";
import { cargarScript } from "./util.js";

export const cuenta = {
  user: null,
  profile: null,
  merchant: null,
  ready: false,
  error: null,
  emailSugerido: "",
  recovery: new URLSearchParams(location.search).get("auth") === "recovery",
};
let client,
  changed = () => {},
  revision = 0;
export const configurado = () =>
  !!(AUTH_CONFIG.url && AUTH_CONFIG.publishableKey);
export async function backend() {
  if (!configurado())
    throw new Error("La conexión de cuentas todavía no está configurada.");
  if (!client) {
    await cargarScript("./vendor/supabase.js", "supabase");
    client = window.supabase.createClient(
      AUTH_CONFIG.url,
      AUTH_CONFIG.publishableKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: "pkce",
          storageKey: "aprovecho-auth-v1",
        },
      },
    );
  }
  return client;
}
export function destinoCuenta() {
  if (cuenta.recovery && cuenta.user) return "auth/clave";
  if (cuenta.profile?.role === "admin") return "admin";
  if (cuenta.profile?.role === "merchant") return "b/hoy";
  return "c/inicio";
}
export async function sincronizar(session) {
  const version = ++revision;
  if (!session) {
    Object.assign(cuenta, {
      user: null,
      profile: null,
      merchant: null,
      ready: true,
      error: null,
      recovery: false,
    });
    changed();
    return;
  }
  try {
    const api = await backend();
    const { data: verified, error: invalid } = await api.auth.getUser();
    if (invalid || !verified.user)
      throw new Error("Tu sesión venció. Volvé a ingresar.");
    const { data: profile, error } = await api
      .from("ap_profiles")
      .select("id,full_name,email,role,created_at")
      .eq("id", verified.user.id)
      .single();
    if (error)
      throw new Error(
        "No pudimos cargar tu cuenta. Revisá la conexión y reintentá.",
      );
    let merchant = null;
    if (profile.role === "merchant") {
      const result = await api
        .from("ap_merchants")
        .select("*")
        .eq("owner_id", profile.id)
        .single();
      if (result.error)
        throw new Error("No pudimos cargar los datos de tu comercio.");
      merchant = result.data;
    }
    if (version !== revision) return;
    Object.assign(cuenta, {
      user: verified.user,
      profile,
      merchant,
      ready: true,
      error: null,
    });
    changed();
  } catch (e) {
    if (version !== revision) return;
    Object.assign(cuenta, {
      user: null,
      profile: null,
      merchant: null,
      ready: true,
      error: e.message,
    });
    changed();
  }
}
export async function iniciarAuth(onChange) {
  changed = onChange;
  if (!configurado()) {
    cuenta.ready = true;
    changed();
    return;
  }
  try {
    const api = await backend();
    api.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") cuenta.recovery = true;
      if (event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") return;
      setTimeout(() => sincronizar(session), 0);
    });
    const { data, error } = await api.auth.getSession();
    if (error) throw error;
    await sincronizar(data.session);
  } catch (e) {
    cuenta.ready = true;
    if (["bad_code_verifier", "flow_state_not_found", "flow_state_expired", "otp_expired"].includes(e?.code)) {
      const url = new URL(location.href);
      for (const key of ["code", "error", "error_code", "error_description", "auth"]) url.searchParams.delete(key);
      history.replaceState(history.state, "", url.pathname + url.search + "#/auth/ingresar");
      cuenta.error = mensajeError(e);
    } else {
      cuenta.error = "No pudimos conectar con las cuentas. Reintentá cuando tengas conexión.";
    }
    changed();
  }
}
export async function salir() {
  const api = await backend();
  const { error } = await api.auth.signOut({ scope: "local" });
  if (error) throw error;
  await sincronizar(null);
}
export function mensajeError(error) {
  const code = error?.code;
  if (code === "invalid_credentials")
    return "El correo o la contraseña no coinciden.";
  if (code === "email_not_confirmed")
    return "Confirmá tu correo con el enlace que te enviamos antes de ingresar.";
  if (code === "over_email_send_rate_limit")
    return "El servicio de correo alcanzó su cupo de confirmaciones por hora. No pudimos completar esta solicitud. Si ya tenés cuenta, usá Ingresar; si no, reintentá más tarde.";
  if (code === "over_request_rate_limit")
    return "Hubo demasiadas solicitudes seguidas. Esperá unos minutos y volvé a intentar.";
  if (code === "email_address_not_authorized")
    return "El registro por correo todavía no está disponible para esta dirección. Contactá al equipo de APROVECHO.";
  if (["bad_code_verifier", "flow_state_not_found", "flow_state_expired", "otp_expired"].includes(code))
    return "El enlace ya no puede iniciar sesión. Volvé a Ingresar con tu correo y contraseña. Si todavía falta confirmar tu correo, usá el último enlace recibido.";
  if (code === "weak_password")
    return "Elegí una contraseña más larga y difícil de adivinar.";
  if (code === "user_already_exists")
    return "Si ya tenés cuenta, ingresá o recuperá tu contraseña.";
  return "No pudimos completar la solicitud. Revisá la conexión y volvé a intentar.";
}
