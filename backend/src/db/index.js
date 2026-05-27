import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não definida no .env");
}

const isProd  = process.env.NODE_ENV === "production";
const client  = postgres(process.env.DATABASE_URL, {
    max:             isProd ? 5 : 3,
    idle_timeout:    20,
    connect_timeout: 10,
});
export const db = drizzle(client, { schema });
