import { eq, desc } from "drizzle-orm";
import { companyApplications, reviewRounds } from "../../../database/schema";

export default eventHandler(async (event) => {
  try {
    const applicationId = getRouterParam(event, "id");
    
    if (!applicationId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Application ID is required",
      });
    }

    const db = useDrizzle();

    // Verify application exists
    const application = await db.query.companyApplications.findFirst({
      where: eq(companyApplications.id, applicationId),
    });

    if (!application) {
      throw createError({
        statusCode: 404,
        statusMessage: "Application not found",
      });
    }

    // Fetch review rounds with related data
    const rounds = await db.query.reviewRounds.findMany({
      where: eq(reviewRounds.applicationId, applicationId),
      with: {
        reviewIssues: true,
        reviewVerifications: true,
      },
      orderBy: desc(reviewRounds.roundNo),
    });

    return {
      success: true,
      data: {
        applicationId,
        rounds,
        totalRounds: rounds.length,
      },
    };

  } catch (error: any) {
    console.error("Error fetching review rounds:", error);

    // If it's already a handled error, re-throw it
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch review rounds",
      data: { message: error.message },
    });
  }
});