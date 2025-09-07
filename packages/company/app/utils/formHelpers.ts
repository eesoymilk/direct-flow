import type * as z from "zod";
import { CalendarDate } from "@internationalized/date";
// import { shallowRef } from "vue"; // Removed unused import

// Helper functions to create initial values for contact/responsible/representative persons
export const createEmptyPerson = (): PersonSchema => ({
  name: "",
  idNumber: "",
  address: "",
  telephone: "",
  cellphone: "",
  email: "",
  dateOfBirth: undefined, // Will be set to CalendarDate when needed in client-side
  // TODO: Add idCardFront and idCardBack when file storage is ready
  // idCardFront: undefined as any,
  // idCardBack: undefined as any,
});

export const createEmptyShareholder = (): z.output<
  typeof shareholderSchema
> => ({
  name: "",
  idNumber: "",
  address: "",
  telephone: "",
  cellphone: "",
  email: "",
  dateOfBirth: undefined, // Will be set to CalendarDate when needed in client-side
  // Removed shares field - now handled by share holdings system
  isReadonly: false,
  referenceType: undefined,
});

export const createInitialForm = () => ({
  candidateNames: [],
  organizationType: "corporation" as const, // Updated to new organization type
  isCloselyHeld: false,
  businessItemsDescription: "",
  address: "",
  capitalAmount: undefined,
  authorizedShares: undefined,
  // Removed ordinaryShares and preferredShares - now calculated from share holdings
  hasParValueFreeShares: false,
  isDirectorSameAsResponsiblePerson: false,
  isContactPersonSameAsResponsiblePerson: false,
  isContactPersonSameAsDirector: false,
  responsiblePerson: createEmptyPerson(),
  director: createEmptyPerson(),
  contactPerson: createEmptyPerson(),
  shareholders: [createEmptyShareholder()],
  // TODO: Add documents when file storage is ready
  // documents: createInitialDocuments(),
});
