import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não definida no .env");
}

const client = postgres(process.env.DATABASE_URL, { max: 10 });
export const db = drizzle(client, { schema });
