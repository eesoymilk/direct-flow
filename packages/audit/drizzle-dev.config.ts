/// <reference types="node" />
import { defineConfig } from "drizzle-kit";

const databaseUrl =
  process.env.AUDIT_DATABASE_URL || "postgresql://audit:auditpass@localhost:5433/audit";
console.log(databaseUrl);

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/database/**/schema.ts",
  out: "./server/database/migrations",
  dbCredentials: {
    url: databaseUrl,
  },
});