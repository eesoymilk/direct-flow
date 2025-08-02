import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { personDocuments } from "../person/schema";
import { companyDocuments } from "../company/schema";

// Document Types table
export const documentTypes = pgTable("document_types", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull().unique(),
  description: varchar("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Documents table
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentTypeId: integer("document_type_id").references(
    () => documentTypes.id,
    { onDelete: "set null" }
  ),
  filePath: varchar("file_path").notNull(), // File path or URL
  fileName: varchar("file_name").notNull(), // Original file name
  fileSize: integer("file_size").notNull(), // File size in bytes
  mimeType: varchar("mime_type").notNull(), // MIME type of the file
  description: varchar("description"), // Optional description
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations
export const documentTypesRelations = relations(documentTypes, ({ many }) => ({
  documents: many(documents),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  documentType: one(documentTypes, {
    fields: [documents.documentTypeId],
    references: [documentTypes.id],
  }),
  companyDocuments: many(companyDocuments),
  personDocuments: many(personDocuments),
}));
