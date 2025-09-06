import * as z from "zod";
import { CalendarDate } from "@internationalized/date";
import { shallowRef } from "vue";

// Helper functions to create initial values for contact/responsible/representative persons
export const createEmptyPerson = (): PersonSchema => ({
  name: "",
  idNumber: "",
  address: "",
  telephone: "",
  cellphone: "",
  email: "",
  dateOfBirth: undefined,
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
  dateOfBirth: new CalendarDate(2000, 1, 1), // Default CalendarDate
  shares: undefined,
  isReadonly: false,
  referenceType: undefined,
});

export const createInitialForm = () => ({
  candidateNames: [],
  organizationType: "company_limited" as const,
  isCloselyHeld: false,
  businessItemsDescription: "",
  address: "",
  capitalAmount: undefined,
  authorizedShares: undefined,
  ordinaryShares: undefined,
  preferredShares: undefined,
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
