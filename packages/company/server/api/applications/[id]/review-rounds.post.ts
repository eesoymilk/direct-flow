import { z } from "zod";
import { eq } from "drizzle-orm";
import { companyApplications, reviewRounds, reviewIssues, reviewVerifications } from "../../../database/schema";

const ReviewIssueSchema = z.object({
  fieldPath: z.string(),
  issueType: z.enum(["missing", "invalid", "clarification", "modification"]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  description: z.string().optional(),
});

const ReviewVerificationSchema = z.object({
  fieldPath: z.string(),
  note: z.string().optional(),
});

const SubmitReviewRoundSchema = z.object({
  status: z.enum(["approved", "rejected", "filing"]),
  summary: z.string().optional(),
  issues: z.array(ReviewIssueSchema).default([]),
  verifications: z.array(ReviewVerificationSchema).default([]),
});

export default eventHandler(async (event) => {
  try {
    const applicationId = getRouterParam(event, "id");
    const body = await readBody(event);
    
    if (!applicationId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Application ID is required",
      });
    }

    // Validate request body
    const { status, summary, issues, verifications } = SubmitReviewRoundSchema.parse(body);

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

    // Get current user (placeholder - replace with actual auth)
    const currentUserSub = "staff-user-placeholder"; // TODO: Get from auth context

    // Start transaction
    const result = await db.transaction(async (tx) => {
      // Get the next round number
      const existingRounds = await tx.query.reviewRounds.findMany({
        where: eq(reviewRounds.applicationId, applicationId),
      });
      const nextRoundNo = existingRounds.length + 1;

      // Create the review round
      const [newRound] = await tx
        .insert(reviewRounds)
        .values({
          applicationId,
          status,
          summary,
          startedBySub: currentUserSub,
          completedBySub: currentUserSub,
          completedAt: new Date(),
          roundNo: nextRoundNo,
        })
        .returning();

      // Insert review issues if any
      if (issues.length > 0) {
        await tx.insert(reviewIssues).values(
          issues.map((issue) => ({
            roundId: newRound.id,
            fieldPath: issue.fieldPath,
            issueType: issue.issueType,
            severity: issue.severity,
            description: issue.description,
          }))
        );
      }

      // Insert review verifications if any
      if (verifications.length > 0) {
        await tx.insert(reviewVerifications).values(
          verifications.map((verification) => ({
            roundId: newRound.id,
            fieldPath: verification.fieldPath,
            verifiedBySub: currentUserSub,
            note: verification.note,
          }))
        );
      }

      // Update application status based on review status
      let newApplicationStatus: string;
      switch (status) {
        case "approved":
          newApplicationStatus = "approved";
          break;
        case "rejected":
          newApplicationStatus = "rejected";
          break;
        case "filing":
          newApplicationStatus = "pending_client_update";
          break;
        default:
          newApplicationStatus = application.status;
      }

      // Update application status if it changed
      if (newApplicationStatus !== application.status) {
        await tx
          .update(companyApplications)
          .set({ 
            status: newApplicationStatus as any,
            updatedAt: new Date(),
          })
          .where(eq(companyApplications.id, applicationId));
      }

      return {
        reviewRound: newRound,
        issueCount: issues.length,
        verificationCount: verifications.length,
        applicationStatus: newApplicationStatus,
      };
    });

    return {
      success: true,
      data: result,
      message: `Review round ${result.reviewRound.roundNo} submitted successfully`,
    };

  } catch (error: any) {
    console.error("Error submitting review round:", error);

    // Handle validation errors
    if (error.issues) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid request data",
        data: { errors: error.issues },
      });
    }

    // If it's already a handled error, re-throw it
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to submit review round",
      data: { message: error.message },
    });
  }
});