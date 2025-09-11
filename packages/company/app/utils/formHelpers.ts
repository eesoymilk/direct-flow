import { getLocalTimeZone, today } from "@internationalized/date";
import type * as z from "zod";

// Create a date 18 years ago to set as default for adult persons
const createDefaultAdultBirthDate = (): Date => {
  const today = new Date();
  const eighteenYearsAgo = new Date(today);
  eighteenYearsAgo.setFullYear(today.getFullYear() - 18);
  return eighteenYearsAgo;
};

export const createEmptyPerson = (): PersonSchema => ({
  name: "",
  idNumber: "",
  address: "",
  email: "",
  cellphone: "",
  dateOfBirth: createDefaultAdultBirthDate(),
  // TODO: Add idCardFront and idCardBack when file storage is ready
  // idCardFront: undefined as any,
  // idCardBack: undefined as any,
});

const createEmptyShares = (): Record<
  ShareType,
  { quantity: number; pricePerShare: number; totalPrice: number }
> => {
  return SHARE_TYPES.reduce(
    (acc, shareType) => {
      acc[shareType] = {
        quantity: 0,
        pricePerShare: 0,
        totalPrice: 0,
      };
      return acc;
    },
    {} as Record<
      ShareType,
      { quantity: number; pricePerShare: number; totalPrice: number }
    >
  );
};

export const createEmptyShareholder = (): ShareholderSchema => ({
  name: "",
  idNumber: "",
  address: "",
  cellphone: "",
  dateOfBirth: createDefaultAdultBirthDate(),
  isReadonly: false,
  shares: createEmptyShares(),
});

export const createInitialForm = () => ({
  candidateNames: [],
  organizationType: "corporation" as const, // Updated to new organization type
  isCloselyHeld: false,
  businessItemsDescription: "",
  address: "",
  capitalAmount: undefined,
  parValue: undefined,
  totalShares: undefined,
  paidInCapital: undefined,
  // Removed ordinaryShares and preferredShares - now calculated from share holdings
  hasParValueFreeShares: false,
  isRepresentativeSameAsResponsiblePerson: false,
  isContactPersonSameAsResponsiblePerson: false,
  isContactPersonSameAsRepresentative: false,

  // Shared fields for corporation and limited company
  isForeignInvestment: false,
  isChineseInvestment: false,

  // Corporation-specific fields
  isPublicOffering: false,
  closelyHeldShareholderCount: undefined,
  hasMultipleVotingRightsPreferredShares: false,
  hasVetoRightsPreferredShares: false,
  hasPreferredSharesBoardRights: false,

  // Limited company-specific fields
  isSoleProprietorshipLLC: false,

  responsiblePerson: createEmptyPerson(),
  representative: createEmptyPerson(),
  contactPerson: createEmptyPerson(),
  shareholders: [createEmptyShareholder()],
  // TODO: Add documents when file storage is ready
  // documents: createInitialDocuments(),
});
