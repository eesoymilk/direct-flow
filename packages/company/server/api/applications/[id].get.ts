import { db } from "../../database";
import {
  companyApplications,
  people,
  applicationShareholders,
} from "../../database/schema/index";
import { eq, inArray } from "drizzle-orm";
import type { DetailedApplication } from "../../api/applications/types";

// Types for internal use
type ApplicationData = {
  id: string;
  candicateNames: string[];
  chosenName: string | null;
  organizationType:
    | "limited_company"
    | "company_limited"
    | "sole_proprietorship"
    | "partnership"
    | null;
  businessItemsDescription: string | null;
  address: string | null;
  status:
    | "submitted"
    | "staff_review"
    | "pending_client_update"
    | "approved"
    | "rejected";
  createdAt: Date;
  updatedAt: Date;
  responsiblePersonId: string | null;
  contactPersonId: string | null;
  representativeId: string | null;
};

type PersonData = {
  id: string;
  name: string;
  idNumber: string;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Fetch application by ID
async function fetchApplicationById(id: string): Promise<ApplicationData> {
  const application = await db
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
    .where(eq(companyApplications.id, id))
    .limit(1);

  if (application.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Application not found",
    });
  }

  return application[0];
}

// Fetch people by IDs
async function fetchPeopleByIds(personIds: string[]): Promise<PersonData[]> {
  if (personIds.length === 0) return [];

  return await db
    .select({
      id: people.id,
      name: people.name,
      idNumber: people.idNumber,
      address: people.address,
      createdAt: people.createdAt,
      updatedAt: people.updatedAt,
    })
    .from(people)
    .where(inArray(people.id, personIds));
}

// Fetch shareholders for an application
async function fetchApplicationShareholders(
  applicationId: string
): Promise<PersonData[]> {
  // Get shareholder person IDs from junction table
  const applicationShareholdersData = await db
    .select({
      personId: applicationShareholders.personId,
    })
    .from(applicationShareholders)
    .where(eq(applicationShareholders.applicationId, applicationId));

  const shareholderPersonIds = applicationShareholdersData.map(
    (s) => s.personId
  );

  // Fetch shareholder people details
  return await fetchPeopleByIds(shareholderPersonIds);
}

// Build detailed application response
function buildDetailedApplication(
  app: ApplicationData,
  peopleMap: Map<string, PersonData>,
  shareholders: PersonData[]
): DetailedApplication {
  return {
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
    shareholders,
  };
}

// Main handler function
export default eventHandler(async (event): Promise<DetailedApplication> => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Application ID is required",
      });
    }

    // Fetch application data
    const app = await fetchApplicationById(id);

    // Collect all person IDs
    const personIds = new Set<string>();
    if (app.responsiblePersonId) personIds.add(app.responsiblePersonId);
    if (app.contactPersonId) personIds.add(app.contactPersonId);
    if (app.representativeId) personIds.add(app.representativeId);

    // Fetch all related people
    const peopleData = await fetchPeopleByIds(Array.from(personIds));

    // Create a map for quick person lookup
    const peopleMap = new Map(peopleData.map((person) => [person.id, person]));

    // Fetch shareholders
    const shareholders = await fetchApplicationShareholders(app.id);

    // Build and return the detailed application response
    return buildDetailedApplication(app, peopleMap, shareholders);
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
