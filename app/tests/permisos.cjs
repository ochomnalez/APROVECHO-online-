const { PGlite } = require(process.env.PGLITE_MODULE || "@electric-sql/pglite");
const fs = require("node:fs"),
  assert = require("node:assert/strict");
(async () => {
  const db = new PGlite();
  await db.exec(`create role anon;create role authenticated;
 create schema auth;create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz,raw_user_meta_data jsonb default '{}');
 create function auth.uid() returns uuid language sql stable as $$ select (nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'sub')::uuid $$;`);
  await db.exec(
    `grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;`,
  );
  await db.exec(fs.readFileSync("supabase/schema.sql", "utf8"));
  const ids = [
    "11111111-1111-4111-8111-111111111111",
    "22222222-2222-4222-8222-222222222222",
    "33333333-3333-4333-8333-333333333333",
    "44444444-4444-4444-8444-444444444444",
  ];
  await db.query(
    `insert into private.ap_founders(email) values ('fundador@example.test')`,
  );
  for (let i = 0; i < 4; i++)
    await db.query(
      `insert into auth.users(id,email,email_confirmed_at,raw_user_meta_data) values ($1,$2,now(),$3)`,
      [
        ids[i],
        [
          "cliente@example.test",
          "local@example.test",
          "fundador@example.test",
          "otro@example.test",
        ][i],
        JSON.stringify({
          full_name: "Cuenta " + i,
          account_type: i === 1 ? "merchant" : "admin",
          role: "admin",
          merchant_name: "El comercio",
        }),
      ],
    );
  assert.deepEqual(
    (
      await db.query("select role from public.ap_profiles order by id")
    ).rows.map((x) => x.role),
    ["consumer", "merchant", "admin", "consumer"],
  );
  async function as(id, fn) {
    await db.exec("set role authenticated");
    await db.query(`select set_config('request.jwt.claims',$1,false)`, [
      JSON.stringify({ sub: id, role: "authenticated" }),
    ]);
    try {
      return await fn();
    } finally {
      await db.exec("reset role");
    }
  }
  await as(ids[0], async () => {
    assert.equal(
      (await db.query("select * from public.ap_profiles")).rows.length,
      1,
    );
    assert.equal(
      (await db.query("select * from public.ap_merchants")).rows.length,
      0,
    );
    await assert.rejects(
      db.exec(
        `update public.ap_profiles set role='admin' where id='${ids[0]}'`,
      ),
    );
    await assert.rejects(db.exec("select * from private.ap_founders"));
    await assert.rejects(
      db.exec(
        `insert into public.ap_profiles(id,email,full_name,role) values('${ids[3]}','evil','evil','admin')`,
      ),
    );
  });
  await as(ids[1], async () => {
    assert.equal(
      (await db.query("select * from public.ap_merchants")).rows.length,
      1,
    );
    await assert.rejects(
      db.exec(`update public.ap_merchants set status='approved'`),
    );
    await db.exec(
      "update public.ap_merchants set name='Nombre actualizado', address='Olivos'",
    );
    assert.equal(
      (await db.query("select status from public.ap_merchants")).rows[0].status,
      "pending",
    );
  });
  await as(ids[2], async () => {
    assert.equal(
      (await db.query("select * from public.ap_profiles")).rows.length,
      4,
    );
    await db.exec("update public.ap_merchants set status='approved'");
    const events = (await db.query("select * from public.ap_admin_events"))
      .rows;
    assert.equal(events.length, 1);
    assert.equal(events[0].actor_id, ids[2]);
  });
  await as(ids[3], async () => {
    assert.equal(
      (await db.query("select * from public.ap_admin_events")).rows.length,
      0,
    );
    assert.equal(
      (await db.query("select * from public.ap_merchants")).rows.length,
      0,
    );
  });
  await db.exec("set role anon");
  await assert.rejects(db.exec("select * from public.ap_profiles"));
  await db.exec("reset role");
  // Un correo permitido sin verificar todavía no recibe administración.
  const pending = "55555555-5555-4555-8555-555555555555";
  await db.exec(
    "insert into private.ap_founders(email) values('sin-confirmar@example.test')",
  );
  await db.query(
    "insert into auth.users(id,email) values($1,'sin-confirmar@example.test')",
    [pending],
  );
  assert.equal(
    (
      await db.query("select role from public.ap_profiles where id=$1", [
        pending,
      ])
    ).rows[0].role,
    "consumer",
  );
  await db.query("update auth.users set email_confirmed_at=now() where id=$1", [
    pending,
  ]);
  assert.equal(
    (
      await db.query("select role from public.ap_profiles where id=$1", [
        pending,
      ])
    ).rows[0].role,
    "admin",
  );
  console.log(
    "OK: SQL ejecutado en PostgreSQL/PGlite: triggers, RLS, aislamiento, rechazo de autoasignación admin, revisión y auditoría; correo fundador requiere verificación.",
  );
  await db.close();
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
