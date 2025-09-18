const bodySchema = companyApplicationBaseSchema.extend({
  responsiblePerson: responsiblePersonSchema,
  contactPerson: contactPersonSchema,
  partners: partnerSchema.array(),
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
      partners,
      isContactPersonSameAsResponsiblePerson,
      ...data
    } = body.data;

    return await db.transaction(async (tx) => {
      const responsiblePersonResult = await createPerson(tx, responsiblePerson);

      let contactPersonResult: Person;
      if (isContactPersonSameAsResponsiblePerson) {
        contactPersonResult = responsiblePersonResult;
      } else {
        contactPersonResult = await createPerson(tx, contactPerson);
      }

      const application = await createCompanyApplication(tx, {
        ...data,
        responsiblePersonId: responsiblePersonResult.id,
        contactPersonId: contactPersonResult.id,
      });

      const partnerData: { person: Person }[] = [];
      if (partners) {
        for (const partner of partners) {
          let partnerResult: Person;

          if (partner.referenceType === "responsiblePerson") {
            partnerResult = responsiblePersonResult;
          } else if (partner.referenceType === "contactPerson") {
            partnerResult = contactPersonResult;
          } else {
            // Ensure email is provided for new partners
            const partnerPersonData = {
              ...partner,
              email: partner.email || "", // Provide default empty string if email is not provided
            };
            partnerResult = await createPerson(tx, partnerPersonData);
          }

          partnerData.push({
            person: partnerResult,
            // Removed shares field - now handled by share holdings system
          });
        }
      }

      if (partnerData.length > 0) {
        await createApplicationPartnerRelationships(
          tx,
          application.id,
          partnerData
        );
      }

      return {
        application,
        responsiblePerson: responsiblePersonResult,
        contactPerson: contactPersonResult,
        partners: partnerData.map((s) => s.person),
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
