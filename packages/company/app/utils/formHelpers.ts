import { getLocalTimeZone, today } from "@internationalized/date";
import type * as z from "zod";

export const createEmptyPerson = (): PersonSchema => ({
  name: "",
  idNumber: "",
  address: "",
  telephone: "",
  cellphone: "",
  email: "",
  dateOfBirth: new Date(),
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
  dateOfBirth: new Date(),
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
  isRepresentativeSameAsResponsiblePerson: false,
  isContactPersonSameAsResponsiblePerson: false,
  isContactPersonSameAsRepresentative: false,
  responsiblePerson: createEmptyPerson(),
  representative: createEmptyPerson(),
  contactPerson: createEmptyPerson(),
  shareholders: [createEmptyShareholder()],
  // TODO: Add documents when file storage is ready
  // documents: createInitialDocuments(),
});
