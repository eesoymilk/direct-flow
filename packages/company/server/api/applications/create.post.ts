import { db } from "../../database";
import {
  companyApplications,
  people,
  applicationShareholders,
} from "../../database/schema/index";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "../../database/schema/index";
import type {
  CompanyApplicationInsert,
  PersonInsert,
  CompanyApplication,
  Person,
} from "./types";

type Database = NodePgDatabase<typeof schema>;

// Helper function to create a person record
async function createPerson(
  tx: Database,
  personData: PersonInsert
): Promise<Person> {
  const [result] = await tx.insert(people).values(personData).returning();
  return result;
}

// Helper function to create company application
async function createCompanyApplication(
  tx: Database,
  applicationData: CompanyApplicationInsert
): Promise<CompanyApplication> {
  const [result] = await tx
    .insert(companyApplications)
    .values(applicationData)
    .returning();
  return result;
}

// Helper function to create shareholders
async function createApplicationShareholders(
  tx: Database,
  shareholders: PersonInsert[]
): Promise<Person[]> {
  if (shareholders.length === 0) {
    return [];
  }

  return Promise.all(
    shareholders.map((shareholder) => createPerson(tx, shareholder))
  );
}

// Helper function to create shareholder relationships
async function createApplicationShareholderRelationships(
  tx: Database,
  applicationId: string,
  shareholderPeople: Person[]
): Promise<void> {
  if (shareholderPeople.length === 0) {
    return;
  }

  const shareholderRelationships = shareholderPeople.map((person) => ({
    applicationId,
    personId: person.id,
  }));

  await tx.insert(applicationShareholders).values(shareholderRelationships);
}

export default eventHandler<{ body: CompanyApplicationSchema }>(
  async (event) => {
    try {
      // Use readValidatedBody for runtime type-safe validation
      const body = await readValidatedBody(event, (body) =>
        companyApplicationSchema.safeParse(body)
      );

      if (!body.success) {
        throw createError({
          statusCode: 400,
          statusMessage: "Validation failed",
          data: body.error.issues,
        });
      }

      const { responsiblePerson, contactPerson, director, ...data } = body.data;

      // Start a transaction
      const result = await db.transaction(async (tx) => {
        // 1. Create responsible person
        const responsiblePersonResult = await createPerson(
          tx,
          responsiblePerson
        );

        // 2. Create contact person (if different from responsible person)
        const contactPersonResult = data.isContactPersonSameAsResponsiblePerson
          ? responsiblePersonResult
          : await createPerson(tx, contactPerson);

        // 3. Create director (if different from responsible person)
        const directorResult = data.isDirectorSameAsResponsiblePerson
          ? responsiblePersonResult
          : await createPerson(tx, director);

        // 4. Create company application
        const application = await createCompanyApplication(tx, {
          candicateNames: data.candicateNames,
          organizationType: data.organizationType,
          businessItemsDescription: data.businessItemsDescription,
          address: data.address,
          responsiblePersonId: responsiblePersonResult.id,
          contactPersonId: contactPersonResult.id,
          representativeId: directorResult.id,
        });

        // 5. Create shareholders (if any)
        let shareholderResults: Person[] = [];
        if (data.shareholders) {
          shareholderResults = await createApplicationShareholders(
            tx,
            data.shareholders
          );
        }

        // 6. Create shareholder relationships
        if (shareholderResults.length > 0) {
          await createApplicationShareholderRelationships(
            tx,
            application.id,
            shareholderResults
          );
        }

        return {
          application,
          responsiblePerson: responsiblePersonResult,
          contactPerson: contactPersonResult,
          director: directorResult,
          shareholders: shareholderResults,
        };
      });

      return {
        success: true,
        data: result,
        message: "Company application submitted successfully",
      };
    } catch (error: any) {
      console.error("Error submitting company application:", error);

      // If it's already a validation error, re-throw it
      if (error.statusCode === 400) {
        throw error;
      }

      throw createError({
        statusCode: 500,
        statusMessage: "Failed to submit company application",
      });
    }
  }
);
