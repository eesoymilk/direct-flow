// Staff-provided fields - only visible and editable by staff in first review round
export const STAFF_PROVIDED_FIELDS = [
  "chosenName", // Staff selects from candidateNames
  "businessItems", // Staff provides based on businessItemsDescription
] as const;

// Client document fields - documents that client must upload after first review
export const CLIENT_DOCUMENT_FIELDS = [
  "bankBookFront",
  "bankBookInside",
  "bankBookStamp",
  "shareholderPayments",
  "balanceProof",
  "houseUseAgreement",
  "shareholderAgreement",
  "directorConsent",
  "declaration",
  "legalPersonDeclaration",
  "idCardFront", // for persons
  "idCardBack", // for persons
] as const;

// Regular reviewable fields - all other application fields that can be reviewed normally
export const REVIEWABLE_FIELDS = [
  "candidateNames",
  "organizationType",
  "isCloselyHeld",
  "businessItemsDescription",
  "address",
  "capitalAmount",
  "authorizedShares",
  "ordinaryShares",
  "preferredShares",
  "hasParValueFreeShares",
  // Person fields (prefixed with person type)
  "responsiblePerson.name",
  "responsiblePerson.identityNumber",
  "responsiblePerson.birthDate",
  "responsiblePerson.address",
  "responsiblePerson.cellphone",
  "responsiblePerson.email",
  "representative.name",
  "representative.identityNumber",
  "representative.birthDate",
  "representative.address",
  "representative.cellphone",
  "representative.email",
  "contactPerson.name",
  "contactPerson.identityNumber",
  "contactPerson.birthDate",
  "contactPerson.address",
  "contactPerson.cellphone",
  "contactPerson.email",
  // Shareholder fields
  "shareholders",
] as const;

export type StaffProvidedField = (typeof STAFF_PROVIDED_FIELDS)[number];
export type ClientDocumentField = (typeof CLIENT_DOCUMENT_FIELDS)[number];
export type ReviewableField = (typeof REVIEWABLE_FIELDS)[number];

/**
 * Get the classification for a given field path
 */
export function getFieldClassification(fieldPath: string): FieldClassification {
  // Check staff-provided fields
  if (STAFF_PROVIDED_FIELDS.includes(fieldPath as StaffProvidedField)) {
    return "staff_provided";
  }

  // Check client document fields
  if (CLIENT_DOCUMENT_FIELDS.includes(fieldPath as ClientDocumentField)) {
    return "client_document";
  }

  // Check for person document fields (they follow pattern: personType.documentType)
  if (
    (fieldPath.includes(".") && fieldPath.endsWith("Front")) ||
    fieldPath.endsWith("Back")
  ) {
    const documentType = fieldPath.split(".")[1];
    if (CLIENT_DOCUMENT_FIELDS.includes(documentType as ClientDocumentField)) {
      return "client_document";
    }
  }

  // Default to reviewable field
  return "reviewable_field";
}

/**
 * Check if field should be hidden in first review round
 * Note: Staff-provided fields are now integrated into their respective sections
 * rather than being hidden entirely
 */
export function isFieldHiddenInFirstReview(fieldPath: string): boolean {
  // Staff-provided fields are no longer hidden, they're just handled differently
  // They appear in their respective sections (chosenName in companyBasicInfo, businessItems in companyBusinessItems)
  return false;
}

/**
 * Check if field is a staff-provided field that requires special handling
 */
export function isStaffProvidedField(fieldPath: string): boolean {
  return STAFF_PROVIDED_FIELDS.includes(fieldPath as StaffProvidedField);
}

/**
 * Check if field requires client action after first review
 */
export function requiresClientAction(fieldPath: string): boolean {
  const classification = getFieldClassification(fieldPath);
  return classification === "client_document";
}

/**
 * Get the section key for a staff-provided field
 */
export function getStaffProvidedFieldSection(fieldPath: string): string | null {
  switch (fieldPath) {
    case "chosenName":
      return "companyBasicInfo";
    case "businessItems":
      return "companyBusinessItems";
    default:
      return null;
  }
}

/**
 * Check if a section contains staff-provided fields
 */
export function sectionHasStaffProvidedFields(sectionKey: string): boolean {
  return (
    sectionKey === "companyBasicInfo" || sectionKey === "companyBusinessItems"
  );
}

/**
 * Get staff-provided fields for a specific section
 */
export function getStaffProvidedFieldsForSection(
  sectionKey: string
): StaffProvidedField[] {
  switch (sectionKey) {
    case "companyBasicInfo":
      return ["chosenName"];
    case "companyBusinessItems":
      return ["businessItems"];
    default:
      return [];
  }
}

/**
 * Get all fields by classification
 */
export function getFieldsByClassification(
  classification: FieldClassification
): readonly string[] {
  switch (classification) {
    case "staff_provided":
      return STAFF_PROVIDED_FIELDS;
    case "client_document":
      return CLIENT_DOCUMENT_FIELDS;
    case "reviewable_field":
      return REVIEWABLE_FIELDS;
    default:
      return [];
  }
}
