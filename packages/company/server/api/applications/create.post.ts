const bodySchema = companyApplicationFormSchema.extend({
  responsiblePerson: responsiblePersonSchema,
  contactPerson: contactPersonSchema,
  director: directorSchema,
  shareholders: shareholderSchema.array(),
});

export default eventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, (body) =>
      bodySchema.safeParse(body)
    );

    if (!body.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation failed",
        data: body.error.issues,
      });
    }

    const db = useDrizzle();
    const {
      responsiblePerson,
      contactPerson,
      director,
      shareholders,
      ...data
    } = body.data;

    return await db.transaction(async (tx) => {
      const responsiblePersonResult = await createPerson(tx, responsiblePerson);

      let directorResult: Person;
      if (data.isDirectorSameAsResponsiblePerson) {
        directorResult = responsiblePersonResult;
      } else {
        directorResult = await createPerson(tx, director);
      }

      let contactPersonResult: Person;
      if (data.isContactPersonSameAsResponsiblePerson) {
        contactPersonResult = responsiblePersonResult;
      } else if (data.isContactPersonSameAsDirector) {
        contactPersonResult = directorResult;
      } else {
        contactPersonResult = await createPerson(tx, contactPerson);
      }

      const application = await createCompanyApplication(tx, {
        candidateNames: data.candidateNames,
        organizationType: data.organizationType,
        businessItemsDescription: data.businessItemsDescription,
        address: data.address,
        responsiblePersonId: responsiblePersonResult.id,
        contactPersonId: contactPersonResult.id,
        representativeId: directorResult.id,
      });

      let shareholderData: { person: Person; shares?: number }[] = [];
      if (shareholders) {
        for (const shareholder of shareholders) {
          let shareholderResult: Person;

          if (shareholder.referenceType === "responsiblePerson") {
            shareholderResult = responsiblePersonResult;
          } else if (shareholder.referenceType === "director") {
            shareholderResult = directorResult;
          } else if (shareholder.referenceType === "contactPerson") {
            shareholderResult = contactPersonResult;
          } else {
            shareholderResult = await createPerson(tx, shareholder);
          }

          shareholderData.push({
            person: shareholderResult,
            shares: shareholder.shares,
          });
        }
      }

      if (shareholderData.length > 0) {
        await createApplicationShareholderRelationships(
          tx,
          application.id,
          shareholderData
        );
      }

      return {
        application,
        responsiblePerson: responsiblePersonResult,
        contactPerson: contactPersonResult,
        director: directorResult,
        shareholders: shareholderData.map((s) => s.person),
      };
    });
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
});
