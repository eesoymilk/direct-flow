import type { DropdownMenuItem } from "@nuxt/ui";

/**
 * Composable for partner management UI logic.
 * Provides derived/computed UI values and utility functions for partner-related components.
 *
 * Returns:
 * - Computed UI values: personTypeLabel, partnerTypeItems, shareEntries, etc.
 * - Utility functions: updateQuantity, updatePricePerShare
 *
 * For store state and actions, use `useCompanyApplicationStore()` directly.
 */
export const usePartnerManagement = () => {
  const applicationStore = useCompanyApplicationStore();
  const { formState, shareTypes, isCorporation, shareCount } =
    storeToRefs(applicationStore);
  const { addPersonAsPartner } = applicationStore;

  const personTypeLabel = computed(() =>
    formState.value.organizationType === "partnership" ? "合夥人" : "股東"
  );

  const canAddShareType = computed(
    () => isCorporation.value && shareTypes.value.length < SHARE_TYPES.length
  );

  const canRemoveShareType = computed(
    () => isCorporation.value && shareTypes.value.length > 1
  );

  const partnerTypeItems = computed(
    (): { label: string; value: PartnerType }[] => {
      let partnerTypes: PartnerType[] = [];
      switch (formState.value.organizationType) {
        case "limited_company":
          partnerTypes = [
            "director",
            "shareholder",
            "manager",
            "corporateShareholder",
          ];
          break;
        case "corporation":
          partnerTypes = [
            "chairman",
            "viceChairman",
            "executiveDirector",
            "director",
            "supervisor",
            "shareholder",
            "corporateShareholder",
          ];
          break;
        case "partnership":
          partnerTypes = ["partner", "manager", "legalRepresentative"];
          break;
      }

      return partnerTypes.map((type) => ({
        label: getPartnerTypeLabel(type),
        value: type,
      }));
    }
  );

  const defaultPartnerType = computed((): PartnerType | undefined => {
    switch (formState.value.organizationType) {
      case "limited_company":
        return "shareholder";
      case "corporation":
        return "shareholder";
      case "partnership":
        return "partner";
      default:
        return undefined;
    }
  });

  const shareEntries = computed(() =>
    shareTypes.value.map((shareType) => ({
      label: getShareTypeLabel(shareType, shareCount.value),
      shareType,
    }))
  );

  const existingPeopleMenuItems = computed((): DropdownMenuItem[] => {
    const items: DropdownMenuItem[] = [];

    items.push({
      label: `加入負責人 (${formState.value.responsiblePerson.name})`,
      icon: "i-lucide-user",
      onSelect: () => addPersonAsPartner("responsiblePerson"),
    });

    if (!formState.value.isContactPersonSameAsResponsiblePerson) {
      items.push({
        label: `加入聯絡人 (${formState.value.contactPerson.name})`,
        icon: "i-lucide-phone",
        onSelect: () => addPersonAsPartner("contactPerson"),
      });
    }

    return items;
  });

  const updateQuantity = (
    partnerIndex: number,
    shareType: ShareType,
    quantity: number
  ) => {
    const partner = formState.value.partners[partnerIndex];
    if (!partner?.shares?.[shareType]) {
      throw new Error(
        `Share type ${shareType} not found for partner ${partnerIndex}`
      );
    }

    const hasParValueFreeShares = formState.value.hasParValueFreeShares;

    if (!hasParValueFreeShares) {
      // For normal shares, recalculate total price
      partner.shares[shareType].totalPrice =
        quantity * partner.shares[shareType].pricePerShare;
    }
    // For par value free shares, keep totalPrice as is (user inputs it manually)
  };

  const updatePricePerShare = (
    partnerIndex: number,
    shareType: ShareType,
    pricePerShare: number
  ) => {
    const partner = formState.value.partners[partnerIndex];
    if (!partner?.shares?.[shareType]) {
      throw new Error(
        `Share type ${shareType} not found for partner ${partnerIndex}`
      );
    }

    partner.shares[shareType].totalPrice =
      partner.shares[shareType].quantity * pricePerShare;
  };

  return {
    personTypeLabel,
    canAddShareType,
    canRemoveShareType,
    partnerTypeItems,
    defaultPartnerType,
    shareEntries,
    existingPeopleMenuItems,
    updateQuantity,
    updatePricePerShare,
  };
};
