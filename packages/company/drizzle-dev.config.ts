/// <reference types="node" />
import { defineConfig } from "drizzle-kit";

const databaseUrl =
  process.env.DATABASE_URL || "postgresql://direct:devpass@localhost:5432/df";
console.log(databaseUrl);

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/database/**/schema.ts",
  out: "./server/database/migrations",
  dbCredentials: {
    url: databaseUrl,
  },
});
