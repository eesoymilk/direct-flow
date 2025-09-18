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

export const createEmptyShares = (
  defaultPricePerShare: number = 0
): Record<
  ShareType,
  { quantity: number; pricePerShare: number; totalPrice: number }
> => {
  return SHARE_TYPES.reduce(
    (acc, shareType) => {
      acc[shareType] = {
        quantity: 0,
        pricePerShare: defaultPricePerShare,
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

export const createEmptyPartner = (
  hasParValueFreeShares: boolean = false
): PartnerSchema => ({
  name: "",
  idNumber: "",
  address: "",
  cellphone: "",
  dateOfBirth: createDefaultAdultBirthDate(),
  capitalContribution: undefined,
  isReadonly: false,
  shares: createEmptyShares(hasParValueFreeShares ? 10 : 0),
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
  isContactPersonSameAsResponsiblePerson: false,

  // Shared fields for corporation and limited company
  isForeignInvestment: false,
  isChineseInvestment: false,

  // Corporation-specific fields
  isPublicOffering: false,
  hasMultipleVotingRightsPreferredShares: false,
  hasVetoRightsPreferredShares: false,
  hasPreferredSharesBoardRights: false,

  // Limited company-specific fields
  isSoleProprietorshipLLC: false,

  responsiblePerson: createEmptyPerson(),
  contactPerson: createEmptyPerson(),
  partners: [createEmptyPartner()],
  // TODO: Add documents when file storage is ready
  // documents: createInitialDocuments(),
});
