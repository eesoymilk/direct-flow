import { Pool } from "pg";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../database";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export type DrizzleClient = ReturnType<typeof drizzle<typeof schema>>;

export type DrizzleTransaction = Parameters<
  Parameters<DrizzleClient["transaction"]>[0]
>[0];

export const useDrizzle = (): DrizzleClient =>
  drizzle({ client: pool, schema, casing: "snake_case" });

export type QueryParams = {
  page?: number;
  limit?: number;
  status?: string;
  organizationType?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
