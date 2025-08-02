import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
export { sql, eq, and, or } from "drizzle-orm";

const connectionString =
  process.env.DATABASE_URL || "postgresql://direct:devpass@localhost:5432/df";

const pool = new Pool({ connectionString });

export const useDrizzle = () => drizzle({ client: pool, casing: "snake_case" });
