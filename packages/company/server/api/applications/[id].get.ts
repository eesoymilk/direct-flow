export default eventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const db = useDrizzle();

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Application ID is required",
      });
    }

    const application = await fetchCompanyApplicationById(db, id);
    return application;
  } catch (error: any) {
    console.error("Error fetching application details:", error);

    // If it's already a handled error, re-throw it
    if (error.statusCode === 400 || error.statusCode === 404) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch application details",
      data: {
        message: error.message,
      },
    });
  }
});
