import fs from "fs";
import path from "path";
import pg from "pg";

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["'](.*)["']$/, "$1");
      env[key] = val;
    }
  }
  return env;
}

function parseDatabaseConfig(rawUrl) {
  const cleaned = rawUrl.trim().replace(/^["']/, "").replace(/["']$/, "");

  // Match: postgresql://<user>:<password>@<host>:<port>/<database>
  const schemeMatch = cleaned.match(/^[a-zA-Z0-9+.-]+:\/\/(.*)$/);
  if (!schemeMatch) return { connectionString: cleaned, ssl: { rejectUnauthorized: false } };

  const body = schemeMatch[1];
  const lastAt = body.lastIndexOf("@");
  if (lastAt === -1) return { connectionString: cleaned, ssl: { rejectUnauthorized: false } };

  const authPart = body.substring(0, lastAt);
  const hostPart = body.substring(lastAt + 1);

  const colonIdx = authPart.indexOf(":");
  if (colonIdx === -1) return { connectionString: cleaned, ssl: { rejectUnauthorized: false } };

  const user = authPart.substring(0, colonIdx);
  const password = authPart.substring(colonIdx + 1);

  const hostSlash = hostPart.indexOf("/");
  let hostAndPort = hostPart;
  let database = "postgres";

  if (hostSlash !== -1) {
    hostAndPort = hostPart.substring(0, hostSlash);
    database = hostPart.substring(hostSlash + 1).split("?")[0] || "postgres";
  }

  let [host, portStr] = hostAndPort.split(":");
  let port = portStr ? parseInt(portStr, 10) : 5432;

  return {
    user: decodeURIComponent(user),
    password: decodeURIComponent(password),
    host,
    port,
    database,
    ssl: { rejectUnauthorized: false },
  };
}

async function run() {
  const env = loadEnv();
  const dbUrl = env.DATABASE_URL || process.env.DATABASE_URL;

  if (!dbUrl || dbUrl.includes("[YOUR-DB-PASSWORD]") || dbUrl.includes("[YOUR-PASSWORD]")) {
    console.error("\n❌ DATABASE_URL is not configured with your actual database password in .env.");
    console.error("Please replace [YOUR-DB-PASSWORD] in .env with your Supabase PostgreSQL password.\n");
    process.exit(1);
  }

  console.log("\nConnecting to Supabase PostgreSQL...");
  const config = parseDatabaseConfig(dbUrl);
  const client = new pg.Client(config);

  try {
    await client.connect();
    console.log("Connected successfully!");

    const schemaPath = path.resolve(process.cwd(), "supabase", "schema.sql");
    const regSchemaPath = path.resolve(process.cwd(), "supabase", "registration_schema.sql");

    console.log("\n1. Executing supabase/schema.sql (profiles table, RLS, triggers)...");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");
    await client.query(schemaSql);
    console.log("  Profiles schema applied successfully!");

    console.log("\n2. Executing supabase/registration_schema.sql (events, registrations, attendance, roles)...");
    const regSchemaSql = fs.readFileSync(regSchemaPath, "utf8");
    await client.query(regSchemaSql);
    console.log("  Registration schema applied successfully!");

    console.log("\n3. Reloading PostgREST schema cache...");
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log("  Schema cache reloaded!");

    console.log("\n🎉 ALL DATABASE SCHEMAS AND POLICIES HAVE BEEN SUCCESSFULLY APPLIED!\n");
  } catch (err) {
    console.error("\n❌ Error executing SQL migrations:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
