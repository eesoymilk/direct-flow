export default eventHandler<{ body: CompanyApplicationSchema }>(
  async (event) => {
    try {
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

      const db = useDrizzle();
      const { responsiblePerson, contactPerson, director, ...data } = body.data;

      const result = await db.transaction(async (tx) => {
        const responsiblePersonResult = await createPerson(
          tx,
          responsiblePerson
        );

        const contactPersonResult = data.isContactPersonSameAsResponsiblePerson
          ? responsiblePersonResult
          : await createPerson(tx, contactPerson);

        const directorResult = data.isDirectorSameAsResponsiblePerson
          ? responsiblePersonResult
          : await createPerson(tx, director);

        const application = await createCompanyApplication(tx, {
          candidateNames: data.candidateNames,
          organizationType: data.organizationType,
          businessItemsDescription: data.businessItemsDescription,
          address: data.address,
          responsiblePersonId: responsiblePersonResult.id,
          contactPersonId: contactPersonResult.id,
          representativeId: directorResult.id,
        });

        let shareholderResults: Person[] = [];
        if (data.shareholders) {
          for (const shareholder of data.shareholders) {
            shareholderResults.push(await createPerson(tx, shareholder));
          }
        }

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

      return result;
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
