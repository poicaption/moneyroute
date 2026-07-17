// Seed a special all-access user with every product entitlement.
//
//   node scripts/seed-user.mjs [email] [password]
//
// Defaults: poicaption@moneyroute.app / manuklab1
// Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local.
// Idempotent: re-running updates the password and ensures entitlements exist.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnvLocal() {
  try {
    const text = readFileSync(join(root, ".env.local"), "utf8");
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      let val = m[2];
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!(m[1] in process.env)) process.env[m[1]] = val;
    }
  } catch {
    /* rely on process env */
  }
}

const ENTITLEMENT_KEYS = ["income_blueprint", "route_kit"];

async function main() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const email = process.argv[2] ?? "poicaption@moneyroute.app";
  const password = process.argv[3] ?? "manuklab1";

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Find existing user by email (paginate through the first pages).
  let userId = null;
  for (let page = 1; page <= 10 && !userId; page++) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    if (error) break;
    const found = data.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase(),
    );
    if (found) userId = found.id;
    if (data.users.length < 1000) break;
  }

  if (userId) {
    const { error } = await admin.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
    });
    if (error) {
      console.error("Failed to update user:", error.message);
      process.exit(1);
    }
    console.log(`Updated existing user ${email} (${userId})`);
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error || !data.user) {
      console.error("Failed to create user:", error?.message);
      process.exit(1);
    }
    userId = data.user.id;
    console.log(`Created user ${email} (${userId})`);
  }

  // Ensure every entitlement exists and is active.
  for (const key of ENTITLEMENT_KEYS) {
    const { data: existing } = await admin
      .from("entitlements")
      .select("id")
      .eq("user_id", userId)
      .eq("entitlement_key", key)
      .maybeSingle();

    if (existing) {
      await admin
        .from("entitlements")
        .update({ status: "active", expires_at: null })
        .eq("id", existing.id);
      console.log(`  entitlement ${key}: already present → ensured active`);
    } else {
      const { error } = await admin.from("entitlements").insert({
        user_id: userId,
        entitlement_key: key,
        status: "active",
      });
      if (error) {
        console.error(`  entitlement ${key}: insert failed`, error.message);
      } else {
        console.log(`  entitlement ${key}: granted`);
      }
    }
  }

  console.log("\nDone. Login with:");
  console.log(`  email:    ${email}`);
  console.log(`  password: ${password}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
