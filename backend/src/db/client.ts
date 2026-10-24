import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL must be set");
}

export const pool = new Pool({
  connectionString,
  // Neon requires TLS; `require` encrypts traffic without relaxing certificate checks.
  ssl: connectionString.includes(".neon.tech") ? { rejectUnauthorized: true } : undefined,
});

export const db = drizzle({client: pool});
