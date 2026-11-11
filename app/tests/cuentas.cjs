const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const p = await b.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  p.setDefaultTimeout(8000);
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  const profiles = {
    consumer: {
      id: "11111111-1111-4111-8111-111111111111",
      role: "consumer",
      email: "cliente@example.test",
      full_name: "Sofía",
    },
    merchant: {
      id: "22222222-2222-4222-8222-222222222222",
      role: "merchant",
      email: "local@example.test",
      full_name: "Martín",
    },
    admin: {
      id: "33333333-3333-4333-8333-333333333333",
      role: "admin",
      email: "fundador@example.test",
      full_name: "Fundador",
    },
  };
  const merchant = {
    id: "44444444-4444-4444-8444-444444444444",
    owner_id: profiles.merchant.id,
    name: "El comercio de Martín",
    status: "pending",
    plan: "basico",
    address: "Olivos",
    category: "Panadería",
    cuit: "",
    review_note: "",
    created_at: new Date().toISOString(),
    ap_profiles: profiles.merchant,
  };
  let who = "consumer",
    signup,
    recovery = 0,
    reviews = 0;
  const user = () => ({
    id: profiles[who].id,
    email: profiles[who].email,
    aud: "authenticated",
    role: "authenticated",
    app_metadata: {},
    user_metadata: {},
    created_at: new Date().toISOString(),
  });
  const session = () => ({
    access_token: [
      { alg: "HS256", typ: "JWT" },
      {
        sub: user().id,
        role: "authenticated",
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
      "test",
    ]
      .map((x) =>
        typeof x === "object"
          ? Buffer.from(JSON.stringify(x)).toString("base64url")
          : x,
      )
      .join("."),
    refresh_token: "test-refresh",
    token_type: "bearer",
    expires_in: 3600,
    user: user(),
  });
  const fulfill = (route, body = {}, status = 200, extra = {}) =>
    route.fulfill({
      status,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*",
        "access-control-expose-headers": "content-range,x-supabase-api-version",
        "x-supabase-api-version": "2024-01-01",
        ...extra,
      },
      body: JSON.stringify(body),
    });
  await p.route("**/js/auth-config.js", (r) =>
    r.fulfill({
      contentType: "application/javascript",
      body: `export const AUTH_CONFIG={url:'https://auth.aprovecho.test',publishableKey:'sb_publishable_test'};`,
    }),
  );
  await p.route("https://auth.aprovecho.test/**", async (r) => {
    const req = r.request(),
      url = new URL(req.url());
    if (req.method() === "OPTIONS") return fulfill(r, {});
    if (url.pathname.endsWith("/token")) {
      const body = JSON.parse(req.postData() || "{}");
      if (body.password === "incorrecta")
        return fulfill(
          r,
          {
            code: "invalid_credentials",
            error_code: "invalid_credentials",
            msg: "invalid",
          },
          400,
        );
      who = body.email?.startsWith("local")
        ? "merchant"
        : body.email?.startsWith("fundador")
          ? "admin"
          : "consumer";
      return fulfill(r, session());
    }
    if (url.pathname.endsWith("/user")) return fulfill(r, user());
    if (url.pathname.endsWith("/logout")) return fulfill(r, {});
    if (url.pathname.endsWith("/signup")) {
      signup = JSON.parse(req.postData());
      return fulfill(r, { user: user(), session: null });
    }
    if (url.pathname.endsWith("/recover")) {
      recovery++;
      return fulfill(r, {});
    }
    if (url.pathname.endsWith("/ap_profiles")) {
      const isSingle = req.headers().accept?.includes("vnd.pgrst.object");
      return fulfill(r, isSingle ? profiles[who] : [profiles[who]], 200, {
        "content-range": "0-0/1",
      });
    }
    if (url.pathname.endsWith("/ap_merchants")) {
      if (req.method() === "PATCH") {
        reviews++;
        Object.assign(merchant, JSON.parse(req.postData()));
        return fulfill(r, null);
      }
      const isSingle = req.headers().accept?.includes("vnd.pgrst.object");
      return fulfill(r, isSingle ? merchant : [merchant], 200, {
        "content-range": "0-0/1",
      });
    }
    return fulfill(r, {});
  });
  const go = (route) =>
    p.evaluate(
      async (r) => (await import("./js/nav.js")).nav.go(r, { raiz: true }),
      route,
    );
  async function login(email) {
    await p.getByLabel("Correo electrónico").fill(email);
    await p.locator("[name=password]").fill("ContrasenaLarga123");
    await p.getByRole("button", { name: "Ingresar", exact: true }).click();
  }
  async function logout() {
    await go("auth/cuenta");
    await p.getByRole("button", { name: "Cerrar sesión", exact: true }).click();
    await p.getByRole("heading", { name: "Qué bueno verte" }).waitFor();
  }
  try {
    await p.goto(process.env.APP_URL || "http://127.0.0.1:8767/app/");
    await p.waitForTimeout(1100);
    await go("admin");
    assert(p.url().endsWith("auth/ingresar"));
    await p.getByLabel("Correo electrónico").fill("cliente@example.test");
    await p.locator("[name=password]").fill("incorrecta");
    await p.getByRole("button", { name: "Ingresar", exact: true }).click();
    await p.getByRole("alert").filter({ hasText: "no coinciden" }).waitFor();
    await login("cliente@example.test");
    await p.locator('[data-go="auth/cuenta"]').first().waitFor();
    assert(p.url().endsWith("c/inicio"));
    await p.evaluate(async () => {
      const { S, guardar } = await import("./js/store.js");
      S.perfil.nombre = "Dato privado de cliente";
      guardar();
    });
    await go("admin");
    assert(p.url().endsWith("c/inicio"));
    await go("b/hoy");
    assert(p.url().endsWith("c/inicio"));
    await p.reload();
    await p.locator('[data-go="auth/cuenta"]').first().waitFor();
    assert(p.url().endsWith("c/inicio"));
    await logout();
    await login("local@example.test");
    await p
      .getByText("El comercio de Martín", { exact: false })
      .first()
      .waitFor();
    assert(p.url().endsWith("b/hoy"));
    assert.equal(
      await p.evaluate(
        async () => (await import("./js/store.js")).S.perfil.nombre,
      ),
      "Martín",
    );
    await go("b/cuenta");
    assert.equal(await p.locator('[data-act="entrar-cliente"]').count(), 0);
    await go("c/inicio");
    assert(p.url().endsWith("b/hoy"));
    await logout();
    await login("fundador@example.test");
    await p.getByRole("heading", { name: "Así crece APROVECHO" }).waitFor();
    await p.getByRole("button", { name: "Aprobar", exact: true }).waitFor();
    await p.waitForTimeout(400);
    await p.screenshot({ path: "work/cuentas-admin-mobile.png" });
    await p.getByRole("button", { name: "Aprobar", exact: true }).click();
    await p.getByRole("button", { name: "Confirmar", exact: true }).click();
    await p
      .locator("#admin-lista")
      .getByText("Aprobado", { exact: true })
      .waitFor();
    assert.equal(reviews, 1);
    await p.setViewportSize({ width: 1440, height: 900 });
    await p.screenshot({ path: "work/cuentas-admin-desktop.png" });
    await logout();
    await p
      .getByRole("button", { name: "Creá tu cuenta", exact: true })
      .click();
    await p.getByLabel("Tu nombre").fill("Persona nueva");
    await p.getByLabel("Tengo un comercio").check();
    await p.getByLabel("Nombre del comercio").fill("Nuevo local");
    await p.getByLabel("Correo electrónico").fill("nuevo@example.test");
    await p.locator("[name=password]").fill("ContrasenaLarga123");
    await p.getByRole("button", { name: "Crear cuenta", exact: true }).click();
    await p
      .getByRole("alert")
      .filter({ hasText: "Revisá tu correo" })
      .waitFor();
    assert.equal(signup.data.account_type, "merchant");
    assert(!("role" in signup.data));
    await go("auth/recuperar");
    await p.getByLabel("Correo electrónico").fill("cliente@example.test");
    await p.getByRole("button", { name: "Enviar enlace", exact: true }).click();
    await p.getByRole("alert").filter({ hasText: "Si el correo" }).waitFor();
    assert.equal(recovery, 1);
    assert.deepEqual(errors, []);
    console.log(
      "OK: UI con SDK real y API simulada: ingreso, error, registro, recuperación, persistencia, salida, roles, aislamiento local y panel admin/aprobación.",
    );
  } catch (e) {
    console.log(await p.locator("body").innerText());
    console.log(errors);
    console.log(
      await p.evaluate(async () => {
        try {
          const api = await (await import("./js/auth.js")).backend();
          const r = await api.auth.signInWithPassword({
            email: "cliente@example.test",
            password: "incorrecta",
          });
          return {
            message: r.error?.message,
            code: r.error?.code,
            name: r.error?.name,
          };
        } catch (e) {
          return { message: e.message, name: e.name };
        }
      }),
    );
    throw e;
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
