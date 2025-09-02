import { relations } from "drizzle-orm";
import { pgTable, serial, varchar, timestamp, uuid } from "drizzle-orm/pg-core";
import { documents } from "../document/schema";
import { companies } from "../company/schema";

// People table
export const people = pgTable("people", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  idNumber: varchar("id_number").notNull().unique(),
  address: varchar("address"),
  telephone: varchar("telephone"),
  cellphone: varchar("cellphone"),
  email: varchar("email"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Person Documents junction table
export const personDocuments = pgTable("person_documents", {
  id: serial("id").primaryKey(),
  personId: uuid("person_id")
    .notNull()
    .references(() => people.id, { onDelete: "cascade" }),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const peopleRelations = relations(people, ({ many }) => ({
  responsibleCompanies: many(companies, { relationName: "responsiblePerson" }),
  contactPersonCompanies: many(companies, { relationName: "contactPerson" }),
  representativeCompanies: many(companies, { relationName: "representative" }),
  personDocuments: many(personDocuments),
}));

export const personDocumentsRelations = relations(
  personDocuments,
  ({ one }) => ({
    person: one(people, {
      fields: [personDocuments.personId],
      references: [people.id],
    }),
    document: one(documents, {
      fields: [personDocuments.documentId],
      references: [documents.id],
    }),
  })
);
