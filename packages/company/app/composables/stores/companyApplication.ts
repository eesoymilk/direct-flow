export const useCompanyApplicationStore = defineStore(
  "companyApplication",
  () => {
    const toast = useToast();
    const formState = ref<
      CompanyApplicationFormSchema & {
        responsiblePerson: PersonSchema;
        contactPerson: PersonSchema;
        managerialOfficer: PersonSchema;
        partners: PartnerSchema[];
      }
    >(createInitialForm());

    const submissionState = ref<{
      justSubmitted: boolean;
      applicationId?: string;
      submissionTime?: string;
    }>({
      justSubmitted: false,
    });

    const shareCount = ref(1);

    const shareTypes = computed(() =>
      Array.from({ length: shareCount.value }, (_, i) => {
        const shareType = SHARE_TYPES[i];

        if (!shareType) {
          throw new Error(`Share type ${i} not found`);
        }

        return shareType;
      })
    );

    const isCorporation = computed(
      () => formState.value.organizationType === "corporation"
    );

    // Computed share calculations
    const ordinarySharesTotal = computed(() => {
      let totalQuantity = 0;
      let totalPrice = 0;
      let weightedPricePerShare = 0;

      for (const partner of formState.value.partners) {
        if (partner.shares?.ordinary) {
          const ordinary = partner.shares.ordinary;
          totalQuantity += ordinary.quantity;
          totalPrice += ordinary.totalPrice;
        }
      }

      // Calculate weighted average price per share
      if (totalQuantity > 0) {
        weightedPricePerShare = totalPrice / totalQuantity;
      }

      return {
        quantity: totalQuantity,
        pricePerShare: weightedPricePerShare,
        totalPrice: totalPrice,
      };
    });

    const preferredSharesTotal = computed(() => {
      let totalQuantity = 0;
      let totalPrice = 0;
      let weightedPricePerShare = 0;

      for (const partner of formState.value.partners) {
        if (partner.shares) {
          // Sum all preferred share types (preferred, preferred_a through preferred_e)
          const preferredTypes = SHARE_TYPES.filter(
            (type) => type === "preferred" || type.startsWith("preferred_")
          ) as ShareType[];

          for (const shareType of preferredTypes) {
            const share =
              partner.shares?.[shareType as keyof typeof partner.shares];
            if (share) {
              totalQuantity += share.quantity;
              totalPrice += share.totalPrice;
            }
          }
        }
      }

      // Calculate weighted average price per share
      if (totalQuantity > 0) {
        weightedPricePerShare = totalPrice / totalQuantity;
      }

      return {
        quantity: totalQuantity,
        pricePerShare: weightedPricePerShare,
        totalPrice: totalPrice,
      };
    });

    const totalShares = computed(() => {
      return {
        quantity:
          ordinarySharesTotal.value.quantity +
          preferredSharesTotal.value.quantity,
        totalPrice:
          ordinarySharesTotal.value.totalPrice +
          preferredSharesTotal.value.totalPrice,
      };
    });

    const addPartner = () => {
      const newPartner = createEmptyPartner();
      formState.value.partners.push(newPartner);
    };

    const addPersonAsPartner = (personType: PersonType) => {
      let sourcePerson;
      if (personType === "responsiblePerson") {
        sourcePerson = formState.value.responsiblePerson;
      } else {
        sourcePerson = formState.value.contactPerson;
      }

      const existingPartner = formState.value.partners.find(
        (s) => s.referenceType === personType
      );
      if (existingPartner) {
        toast.add({
          title: "此人員已是股東",
          description: `${sourcePerson.name} 已在股東列表中`,
          color: "warning",
          icon: "i-lucide-alert-triangle",
        });
        return;
      }

      // Create readonly partner with reference
      const newPartner: PartnerSchema = {
        ...sourcePerson,
        address: sourcePerson.address || "",
        dateOfBirth: sourcePerson.dateOfBirth || new Date(),
        capitalContribution: undefined,
        isReadonly: true,
        referenceType: personType,
        shares: createEmptyShares(0), // Always 0 for pricePerShare
      };

      formState.value.partners.push(newPartner);

      toast.add({
        title: "股東已加入",
        description: `已將${getPersonLabel(personType)} ${sourcePerson.name} 加入為股東（僅可編輯持股數）`,
        color: "success",
        icon: "i-lucide-user-check",
      });
    };

    const removePartner = (index: number) => {
      formState.value.partners.splice(index, 1);
    };

    const addShareType = () => {
      const maxShareTypes = SHARE_TYPES.length;
      if (shareTypes.value.length >= maxShareTypes) {
        toast.add({
          title: "最多只能新增6種股份類型",
          color: "warning",
          icon: "i-lucide-alert-triangle",
        });
        return;
      }

      const newShareType = SHARE_TYPES[shareCount.value];

      if (!newShareType) {
        throw new Error(`New share type ${newShareType} not found`);
      }

      for (const partner of formState.value.partners) {
        if (partner.shares) {
          partner.shares[newShareType] = {
            quantity: 0,
            pricePerShare: 0,
            totalPrice: 0,
          };
        }
      }

      shareCount.value++;
    };

    const removeShareType = () => {
      if (shareCount.value <= 1) {
        toast.add({
          title: "至少需要一種股份類型",
          color: "warning",
          icon: "i-lucide-alert-triangle",
        });
        return;
      }

      shareCount.value--;
    };

    const resetForm = () => {
      formState.value = createInitialForm();
      submissionState.value = { justSubmitted: false };
      shareCount.value = 1;
    };

    const markSubmissionSuccess = (
      applicationId: string,
      submissionTime: string
    ) => {
      submissionState.value = {
        justSubmitted: true,
        applicationId,
        submissionTime,
      };
    };

    const markSuccessViewed = () => {
      submissionState.value.justSubmitted = false;
    };

    const populateWithMockData = ({
      organizationType,
    }: {
      organizationType?: OrganizationType;
    }) => {
      const { shareTypeCount, ...mockData } = generateMockFormData({
        organizationType,
      });
      formState.value = mockData;
      shareCount.value = shareTypeCount;
    };

    // Watch organization type changes and clear irrelevant fields
    watch(
      () => formState.value.organizationType,
      (newType, oldType) => {
        if (newType !== oldType && oldType) {
          // Clear organization-specific fields when type changes
          if (newType !== "corporation") {
            // Clear corporation-specific fields
            formState.value.isPublicOffering = false;
            formState.value.hasMultipleVotingRightsPreferredShares = false;
            formState.value.hasVetoRightsPreferredShares = false;
            formState.value.hasPreferredSharesBoardRights = false;
            formState.value.isCloselyHeld = false;
            formState.value.hasParValueFreeShares = false;
            formState.value.parValue = undefined;
            formState.value.totalShares = undefined;
          }

          if (newType !== "limited_company") {
            // Clear limited company-specific fields
            formState.value.isSoleProprietorshipLLC = false;
          }

          // Clear shared fields if neither corporation nor limited company
          if (newType !== "corporation" && newType !== "limited_company") {
            formState.value.isForeignInvestment = false;
            formState.value.isChineseInvestment = false;
          }
        }

        // Initialize corporation-specific fields to defaults only if switching from non-corporation
        if (newType === "corporation" && oldType && oldType !== "corporation") {
          formState.value.isCloselyHeld = false;
          formState.value.hasParValueFreeShares = false;
        }
      },
      { immediate: true }
    );

    // Watch par value free shares and clear parValue when applicable
    watch(
      () => formState.value.hasParValueFreeShares,
      (hasParValueFree) => {
        if (hasParValueFree) {
          formState.value.parValue = undefined;
        }
      }
    );

    return {
      formState,
      submissionState: readonly(submissionState),
      shareCount: readonly(shareCount),
      shareTypes: readonly(shareTypes),
      isCorporation,
      // Share calculations
      ordinarySharesTotal: readonly(ordinarySharesTotal),
      preferredSharesTotal: readonly(preferredSharesTotal),
      totalShares: readonly(totalShares),
      // Actions
      addPartner,
      addPersonAsPartner,
      removePartner,
      addShareType,
      removeShareType,
      resetForm,
      markSubmissionSuccess,
      markSuccessViewed,
      populateWithMockData,
    };
  }
);
