import {
  applicationShareholders,
  companyApplications,
  reviewRounds,
} from "../../database/schema/index";
import { eq, and, desc } from "drizzle-orm";
import {
  buildCompanyApplicationWhereConditions,
  buildCompanyApplicationOrderBy,
} from "./helper";

export const createCompanyApplication = async (
  db: DrizzleClient | DrizzleTransaction,
  applicationData: CompanyApplicationInsert
) => {
  const [result] = await db
    .insert(companyApplications)
    .values(applicationData)
    .returning();
  if (!result) {
    throw new Error("Failed to create company application");
  }
  return result;
};

export const createApplicationShareholderRelationships = async (
  db: DrizzleClient | DrizzleTransaction,
  applicationId: string,
  shareholderData: { person: { id: string } }[] // Removed shares field
) => {
  if (shareholderData.length === 0) {
    return;
  }

  const shareholderRelationships = shareholderData.map(({ person }) => ({
    applicationId,
    personId: person.id,
    // Removed shares field - now handled by share holdings system
  }));

  await db.insert(applicationShareholders).values(shareholderRelationships);
};

export const fetchCompanyApplications = async (
  db: DrizzleClient,
  params: QueryParams
) => {
  const {
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const pageNumber = Math.max(1, Number(page) || 1);
  const limitNumber = Math.min(100, Math.max(1, Number(limit) || 20));
  const offset = (pageNumber - 1) * limitNumber;
  const whereConditions = buildCompanyApplicationWhereConditions(params);
  const orderBy = buildCompanyApplicationOrderBy(sortBy, sortOrder);

  const applications = await db.query.companyApplications.findMany({
    with: {
      responsiblePerson: true,
      contactPerson: true,
      representative: true,
    },
    where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
    orderBy,
    limit: limitNumber,
    offset,
  });

  const totalCountResult = await db
    .select()
    .from(companyApplications)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

  return {
    applications,
    totalCount: totalCountResult.length,
  };
};

export const fetchCompanyApplicationById = async (
  db: DrizzleClient,
  id: string
) => {
  const application = await db.query.companyApplications.findFirst({
    where: eq(companyApplications.id, id),
    with: {
      responsiblePerson: true,
      contactPerson: true,
      representative: true,
      shareholders: {
        with: {
          person: true,
        },
      },
      reviewRounds: {
        orderBy: [desc(reviewRounds.roundNo)],
        with: {
          reviewIssues: true,
          reviewVerifications: true,
        },
      },
    },
  });

  return application;
};
