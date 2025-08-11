import { companyApplications, people } from "../../database/schema/index";

// Export Drizzle's inferred types for reuse across APIs
export type CompanyApplication = typeof companyApplications.$inferSelect;
export type CompanyApplicationInsert = typeof companyApplications.$inferInsert;
export type Person = typeof people.$inferSelect;
export type PersonInsert = typeof people.$inferInsert;

// Common response interfaces using Drizzle types
export interface ApplicationWithPeople {
  id: string;
  candicateNames: string[];
  chosenName: string | null;
  organizationType: string | null;
  businessItemsDescription: string | null;
  address: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  responsiblePerson: Pick<
    Person,
    "id" | "name" | "idNumber" | "address"
  > | null;
  contactPerson: Pick<Person, "id" | "name" | "idNumber" | "address"> | null;
  director: Pick<Person, "id" | "name" | "idNumber" | "address"> | null;
  shareholders: Pick<Person, "id" | "name" | "idNumber" | "address">[];
}

export interface DetailedApplication {
  id: string;
  candicateNames: string[];
  chosenName: string | null;
  organizationType: string | null;
  businessItemsDescription: string | null;
  address: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  responsiblePerson: Pick<
    Person,
    "id" | "name" | "idNumber" | "address" | "createdAt" | "updatedAt"
  > | null;
  contactPerson: Pick<
    Person,
    "id" | "name" | "idNumber" | "address" | "createdAt" | "updatedAt"
  > | null;
  director: Pick<
    Person,
    "id" | "name" | "idNumber" | "address" | "createdAt" | "updatedAt"
  > | null;
  shareholders: Pick<
    Person,
    "id" | "name" | "idNumber" | "address" | "createdAt" | "updatedAt"
  >[];
}

// Query parameter interfaces
export interface ApplicationListQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  organizationType?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface StatusUpdateRequest {
  status: string;
  comment?: string;
}

export interface CommentRequest {
  comment: string;
  staffId?: string;
}

// Response interfaces
export interface ApplicationListResponse {
  applications: ApplicationWithPeople[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: Partial<ApplicationListQueryParams>;
}

export interface StatusUpdateResponse {
  application: CompanyApplication;
  previousStatus: string;
  newStatus: string;
  comment?: string;
  updatedAt: Date;
}

export interface CommentResponse {
  id: string;
  applicationId: string;
  staffId: string | null;
  comment: string;
  createdAt: Date;
}
