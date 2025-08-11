import { db } from "../../database";
import {
  companyApplications,
  people,
  applicationShareholders,
} from "../../database/schema/index";
import { eq, desc, asc, like, inArray, gte, lte, and, or } from "drizzle-orm";
import type {
  ApplicationListQueryParams,
  ApplicationWithPeople,
  ApplicationListResponse,
} from "./types";

export default eventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event);
    const {
      page = 1,
      limit = 20,
      status,
      organizationType,
      search,
      dateFrom,
      dateTo,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query as ApplicationListQueryParams;

    // Validate pagination parameters
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(100, Math.max(1, Number(limit)));
    const offset = (pageNumber - 1) * limitNumber;

    // Build where conditions
    const whereConditions = [];

    // Status filter
    if (status && status !== "all") {
      whereConditions.push(eq(companyApplications.status, status as any));
    }

    // Organization type filter
    if (organizationType && organizationType !== "all") {
      whereConditions.push(
        eq(companyApplications.organizationType, organizationType as any)
      );
    }

    // Date range filter
    if (dateFrom) {
      whereConditions.push(
        gte(companyApplications.createdAt, new Date(dateFrom))
      );
    }
    if (dateTo) {
      whereConditions.push(
        lte(companyApplications.createdAt, new Date(dateTo))
      );
    }

    // Search filter (search in company names, person names, addresses)
    if (search) {
      const searchConditions = [
        // Search in business description
        like(companyApplications.businessItemsDescription || "", `%${search}%`),
        // Search in address
        like(companyApplications.address || "", `%${search}%`),
      ];
      whereConditions.push(or(...searchConditions));
    }

    // Build sort conditions
    let orderBy;
    switch (sortBy) {
      case "status":
        orderBy =
          sortOrder === "asc"
            ? asc(companyApplications.status)
            : desc(companyApplications.status);
        break;
      case "organizationType":
        orderBy =
          sortOrder === "asc"
            ? asc(companyApplications.organizationType)
            : desc(companyApplications.organizationType);
        break;
      case "updatedAt":
        orderBy =
          sortOrder === "asc"
            ? asc(companyApplications.updatedAt)
            : desc(companyApplications.updatedAt);
        break;
      case "createdAt":
      default:
        orderBy =
          sortOrder === "asc"
            ? asc(companyApplications.createdAt)
            : desc(companyApplications.createdAt);
        break;
    }

    // Get applications with related people data
    const applications = await db
      .select({
        id: companyApplications.id,
        candicateNames: companyApplications.candicateNames,
        chosenName: companyApplications.chosenName,
        organizationType: companyApplications.organizationType,
        businessItemsDescription: companyApplications.businessItemsDescription,
        address: companyApplications.address,
        status: companyApplications.status,
        createdAt: companyApplications.createdAt,
        updatedAt: companyApplications.updatedAt,
        responsiblePersonId: companyApplications.responsiblePersonId,
        contactPersonId: companyApplications.contactPersonId,
        representativeId: companyApplications.representativeId,
      })
      .from(companyApplications)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(orderBy)
      .limit(limitNumber)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select()
      .from(companyApplications)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const totalCount = totalCountResult.length;

    // Get all unique person IDs from applications
    const personIds = new Set<string>();
    applications.forEach((app) => {
      if (app.responsiblePersonId) personIds.add(app.responsiblePersonId);
      if (app.contactPersonId) personIds.add(app.contactPersonId);
      if (app.representativeId) personIds.add(app.representativeId);
    });

    // Fetch all related people in one query
    const peopleData =
      personIds.size > 0
        ? await db
            .select({
              id: people.id,
              name: people.name,
              idNumber: people.idNumber,
              address: people.address,
            })
            .from(people)
            .where(inArray(people.id, Array.from(personIds)))
        : [];

    // Create a map for quick person lookup
    const peopleMap = new Map(peopleData.map((person) => [person.id, person]));

    // Get application IDs for shareholder lookup
    const applicationIds = applications.map((app) => app.id);

    // Fetch all shareholders for these applications
    const applicationShareholdersData =
      applicationIds.length > 0
        ? await db
            .select({
              applicationId: applicationShareholders.applicationId,
              personId: applicationShareholders.personId,
            })
            .from(applicationShareholders)
            .where(
              inArray(applicationShareholders.applicationId, applicationIds)
            )
        : [];

    // Get all shareholder person IDs
    const shareholderPersonIds = new Set(
      applicationShareholdersData.map((s) => s.personId)
    );

    // Fetch all shareholder people details
    const shareholderPeopleData =
      shareholderPersonIds.size > 0
        ? await db
            .select({
              id: people.id,
              name: people.name,
              idNumber: people.idNumber,
              address: people.address,
            })
            .from(people)
            .where(inArray(people.id, Array.from(shareholderPersonIds)))
        : [];

    // Create a map for quick shareholder lookup
    const shareholderPeopleMap = new Map(
      shareholderPeopleData.map((person) => [person.id, person])
    );

    // Group shareholders by company ID
    const shareholdersByCompany = new Map<
      string,
      typeof shareholderPeopleData
    >();
    applicationShareholdersData.forEach((shareholder) => {
      const companyId = shareholder.applicationId;
      const person = shareholderPeopleMap.get(shareholder.personId);
      if (person) {
        if (!shareholdersByCompany.has(companyId)) {
          shareholdersByCompany.set(companyId, []);
        }
        shareholdersByCompany.get(companyId)!.push(person);
      }
    });

    // Combine applications with people data
    const applicationsWithPeople: ApplicationWithPeople[] = applications.map(
      (app) => ({
        id: app.id,
        candicateNames: app.candicateNames,
        chosenName: app.chosenName,
        organizationType: app.organizationType,
        businessItemsDescription: app.businessItemsDescription,
        address: app.address,
        status: app.status,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        responsiblePerson: app.responsiblePersonId
          ? peopleMap.get(app.responsiblePersonId) || null
          : null,
        contactPerson: app.contactPersonId
          ? peopleMap.get(app.contactPersonId) || null
          : null,
        director: app.representativeId
          ? peopleMap.get(app.representativeId) || null
          : null,
        shareholders: shareholdersByCompany.get(app.id) || [],
      })
    );

    const response: ApplicationListResponse = {
      applications: applicationsWithPeople,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNumber),
      },
      filters: {
        status,
        organizationType,
        search,
        dateFrom,
        dateTo,
        sortBy,
        sortOrder,
      },
    };

    return response;
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
