import { companyApplications } from "../../database/schema/index";
import { eq, desc, asc, like, gte, lte, or } from "drizzle-orm";

export const buildCompanyApplicationWhereConditions = (params: QueryParams) => {
  const whereConditions = [];

  // Status filter
  if (params.status && params.status !== "all") {
    whereConditions.push(eq(companyApplications.status, params.status as any));
  }

  // Organization type filter
  if (params.organizationType && params.organizationType !== "all") {
    whereConditions.push(
      eq(companyApplications.organizationType, params.organizationType as any)
    );
  }

  // Date range filter
  if (params.dateFrom) {
    whereConditions.push(
      gte(companyApplications.createdAt, new Date(params.dateFrom))
    );
  }
  if (params.dateTo) {
    whereConditions.push(
      lte(companyApplications.createdAt, new Date(params.dateTo))
    );
  }

  // Search filter (search in company names, person names, addresses)
  if (params.search) {
    const searchConditions = [
      // Search in business description
      like(
        companyApplications.businessItemsDescription || "",
        `%${params.search}%`
      ),
      // Search in address
      like(companyApplications.address || "", `%${params.search}%`),
    ];
    whereConditions.push(or(...searchConditions));
  }

  return whereConditions;
};

export const buildCompanyApplicationOrderBy = (
  sortBy: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
) => {
  switch (sortBy) {
    case "status":
      return sortOrder === "asc"
        ? asc(companyApplications.status)
        : desc(companyApplications.status);
    case "organizationType":
      return sortOrder === "asc"
        ? asc(companyApplications.organizationType)
        : desc(companyApplications.organizationType);
    case "updatedAt":
      return sortOrder === "asc"
        ? asc(companyApplications.updatedAt)
        : desc(companyApplications.updatedAt);
    case "createdAt":
    default:
      return sortOrder === "asc"
        ? asc(companyApplications.createdAt)
        : desc(companyApplications.createdAt);
  }
};
