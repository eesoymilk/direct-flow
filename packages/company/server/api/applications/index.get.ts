export default eventHandler(async (event) => {
  try {
    const db = useDrizzle();
    const query = getQuery(event);
    const params = query as QueryParams;

    const { applications, totalCount } = await fetchCompanyApplications(
      db,
      params
    );

    return { applications, totalCount };
  } catch (error: any) {
    console.error("Error fetching applications:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch applications",
      data: {
        message: error.message,
      },
    });
  }
});
