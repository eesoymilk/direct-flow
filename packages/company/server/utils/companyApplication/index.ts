import {
  applicationShareholders,
  companyApplications,
} from "../../database/schema/index";
import { eq, and } from "drizzle-orm";
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
  return result;
};

export const createApplicationShareholderRelationships = async (
  db: DrizzleClient | DrizzleTransaction,
  applicationId: string,
  shareholderPeople: { id: string }[]
) => {
  if (shareholderPeople.length === 0) {
    return;
  }

  const shareholderRelationships = shareholderPeople.map((person) => ({
    applicationId,
    personId: person.id,
  }));

  await db.insert(applicationShareholders).values(shareholderRelationships);
};

export const fetchCompanyApplications = async (
  db: DrizzleClient,
  params: QueryParams
): Promise<{ applications: CompanyApplication[]; totalCount: number }> => {
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
): Promise<CompanyApplication> => {
  const application = await db.query.companyApplications.findFirst({
    where: eq(companyApplications.id, id),
    with: {
      responsiblePerson: true,
      contactPerson: true,
      representative: true,
    },
  });

  if (!application) {
    throw createError({
      statusCode: 404,
      statusMessage: "Application not found",
    });
  }

  return application;
};
