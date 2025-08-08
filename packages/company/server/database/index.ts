import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/index";

// Create the connection
const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({
  connectionString,
});
export const db = drizzle(pool, { schema });

// Export schema for use in API routes
export * from "./schema/index";
