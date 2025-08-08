import { db } from "../database";
import {
  companyApplications,
  people,
  applicationDocuments,
} from "../database/schema/index";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validate the form data
    if (!body.candicateNames || !body.organizationType || !body.address) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing required fields",
      });
    }

    // Start a transaction
    const result = await db.transaction(async (tx: any) => {
      // 1. Create responsible person
      const [responsiblePerson] = await tx
        .insert(people)
        .values({
          name: body.responsiblePerson.name,
          idNumber: body.responsiblePerson.idNumber,
          address: body.responsiblePerson.address,
        })
        .returning();

      // 2. Create contact person (if different from responsible person)
      let contactPerson = responsiblePerson;
      if (!body.isContactPersonSameAsResponsiblePerson) {
        const [contactPersonResult] = await tx
          .insert(people)
          .values({
            name: body.contactPerson.name,
            idNumber: body.contactPerson.idNumber,
            address: body.contactPerson.address,
          })
          .returning();
        contactPerson = contactPersonResult;
      }

      // 3. Create director (if different from responsible person)
      let director = responsiblePerson;
      if (!body.isDirectorSameAsResponsiblePerson) {
        const [directorResult] = await tx
          .insert(people)
          .values({
            name: body.director.name,
            idNumber: body.director.idNumber,
            address: body.director.address,
          })
          .returning();
        director = directorResult;
      }

      // 4. Create company application
      const [application] = await tx
        .insert(companyApplications)
        .values({
          candicateNames: body.candicateNames,
          organizationType: body.organizationType,
          businessItemsDescription: body.businessItemsDescription,
          address: body.address,
          responsiblePersonId: responsiblePerson.id,
          contactPersonId: contactPerson.id,
          representativeId: director.id,
          status: "submitted",
        })
        .returning();

      // 5. Create shareholders (if any)
      if (body.shareholders && body.shareholders.length > 0) {
        for (const shareholder of body.shareholders) {
          await tx.insert(people).values({
            name: shareholder.name,
            idNumber: shareholder.idNumber,
            address: shareholder.address,
          });
        }
      }

      return {
        application,
        responsiblePerson,
        contactPerson,
        director,
      };
    });

    return {
      success: true,
      data: result,
      message: "Company application submitted successfully",
    };
  } catch (error) {
    console.error("Error submitting company application:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to submit company application",
    });
  }
});
