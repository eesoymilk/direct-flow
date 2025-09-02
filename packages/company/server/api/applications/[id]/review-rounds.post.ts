import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import {
  companyApplications,
  reviewRounds,
  reviewIssues,
  reviewVerifications,
} from "../../../database/schema";

const bodySchema = reviewRoundSchema.extend({
  issues: reviewIssueSchema.array().default([]),
  verifications: reviewVerificationSchema.array().default([]),
});

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const { status, summary, issues, verifications } = await readValidatedBody(
    event,
    bodySchema.parse
  ).catch((error) => {
    console.error(error);
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request body",
    });
  });

  const db = useDrizzle();
  const applicationId = getRouterParam(event, "id");
  if (!applicationId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Application ID is required",
    });
  }

  const application = await db.query.companyApplications.findFirst({
    where: eq(companyApplications.id, applicationId),
  });

  if (!application) {
    throw createError({
      statusCode: 404,
      statusMessage: "Application not found",
    });
  }

  if (!user.sub) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const currentUserSub = user.sub;

  const result = await db.transaction(async (tx) => {
    const timestamp = new Date();

    const previousRound = await tx.query.reviewRounds.findFirst({
      where: eq(reviewRounds.applicationId, applicationId),
      orderBy: desc(reviewRounds.roundNo),
    });

    const [newRound] = await tx
      .insert(reviewRounds)
      .values({
        applicationId,
        status,
        summary,
        createdBySub: currentUserSub,
        roundNo: previousRound ? previousRound.roundNo + 1 : undefined,
      })
      .returning();

    if (!newRound) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create review round",
      });
    }

    if (previousRound) {
      await tx
        .update(reviewRounds)
        .set({
          status: "completed",
          updatedAt: timestamp,
        })
        .where(eq(reviewRounds.id, previousRound.id));
    }

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

    if (verifications.length > 0) {
      await tx.insert(reviewVerifications).values(
        verifications.map((verification) => ({
          roundId: newRound.id,
          fieldPath: verification.fieldPath,
          verifiedBySub: currentUserSub,
          verifiedAt: timestamp,
          note: verification.note,
        }))
      );
    }

    if (status !== application.status) {
      await tx
        .update(companyApplications)
        .set({
          status,
          updatedAt: timestamp,
        })
        .where(eq(companyApplications.id, applicationId));
    }

    return {
      reviewRound: newRound,
      issueCount: issues.length,
      verificationCount: verifications.length,
    };
  });

  return {
    success: true,
    data: result,
    message: `Review round ${result.reviewRound.roundNo} submitted successfully`,
  };
});
