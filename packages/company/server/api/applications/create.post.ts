const bodySchema = companyApplicationBaseSchema.extend({
  responsiblePerson: responsiblePersonSchema,
  contactPerson: contactPersonSchema,
  director: representativeSchema,
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
      isRepresentativeSameAsResponsiblePerson,
      isContactPersonSameAsResponsiblePerson,
      isContactPersonSameAsRepresentative,
      ...data
    } = body.data;

    return await db.transaction(async (tx) => {
      const responsiblePersonResult = await createPerson(tx, responsiblePerson);

      let directorResult: Person;
      if (isRepresentativeSameAsResponsiblePerson) {
        directorResult = responsiblePersonResult;
      } else {
        directorResult = await createPerson(tx, director);
      }

      let contactPersonResult: Person;
      if (isContactPersonSameAsResponsiblePerson) {
        contactPersonResult = responsiblePersonResult;
      } else if (isContactPersonSameAsRepresentative) {
        contactPersonResult = directorResult;
      } else {
        contactPersonResult = await createPerson(tx, contactPerson);
      }

      const application = await createCompanyApplication(tx, {
        ...data,
        responsiblePersonId: responsiblePersonResult.id,
        contactPersonId: contactPersonResult.id,
        representativeId: directorResult.id,
      });

      const shareholderData: { person: Person }[] = [];
      if (shareholders) {
        for (const shareholder of shareholders) {
          let shareholderResult: Person;

          if (shareholder.referenceType === "responsiblePerson") {
            shareholderResult = responsiblePersonResult;
          } else if (shareholder.referenceType === "representative") {
            shareholderResult = directorResult;
          } else if (shareholder.referenceType === "contactPerson") {
            shareholderResult = contactPersonResult;
          } else {
            // Ensure email is provided for new shareholders
            const shareholderPersonData = {
              ...shareholder,
              email: shareholder.email || '', // Provide default empty string if email is not provided
            };
            shareholderResult = await createPerson(tx, shareholderPersonData);
          }

          shareholderData.push({
            person: shareholderResult,
            // Removed shares field - now handled by share holdings system
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
