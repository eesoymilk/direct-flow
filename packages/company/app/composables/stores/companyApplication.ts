export const useCompanyApplicationStore = defineStore(
  "companyApplication",
  () => {
    const toast = useToast();
    const formState = ref<
      CompanyApplicationFormSchema & {
        responsiblePerson: PersonSchema;
        representative: PersonSchema;
        contactPerson: PersonSchema;
        shareholders: ShareholderSchema[];
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

    const isStockCompany = computed(
      () => formState.value.organizationType === "corporation"
    );

    // Computed share calculations
    const ordinarySharesTotal = computed(() => {
      let totalQuantity = 0;
      let totalPrice = 0;
      let weightedPricePerShare = 0;

      for (const shareholder of formState.value.shareholders) {
        if (shareholder.shares?.ordinary) {
          const ordinary = shareholder.shares.ordinary;
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

      for (const shareholder of formState.value.shareholders) {
        if (shareholder.shares) {
          // Sum all preferred share types (preferred_a through preferred_e)
          const preferredTypes = SHARE_TYPES.filter((type) =>
            type.startsWith("preferred_")
          ) as ShareType[];

          for (const shareType of preferredTypes) {
            const share =
              shareholder.shares?.[
                shareType as keyof typeof shareholder.shares
              ];
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

    const addShareholder = () => {
      const newShareholder = createEmptyShareholder(
        formState.value.hasParValueFreeShares
      );
      formState.value.shareholders.push(newShareholder);
    };

    const addPersonAsShareholder = (
      personType: "responsiblePerson" | "representative" | "contactPerson"
    ) => {
      let sourcePerson;
      if (personType === "responsiblePerson") {
        sourcePerson = formState.value.responsiblePerson;
      } else if (personType === "representative") {
        sourcePerson = formState.value.representative;
      } else {
        sourcePerson = formState.value.contactPerson;
      }

      const existingShareholder = formState.value.shareholders.find(
        (s) => s.referenceType === personType
      );
      if (existingShareholder) {
        toast.add({
          title: "此人員已是股東",
          description: `${sourcePerson.name} 已在股東列表中`,
          color: "warning",
          icon: "i-lucide-alert-triangle",
        });
        return;
      }

      // Create readonly shareholder with reference
      const newShareholder: ShareholderSchema = {
        ...sourcePerson,
        address: sourcePerson.address || "",
        dateOfBirth: sourcePerson.dateOfBirth || new Date(),
        capitalContribution: undefined,
        isReadonly: true,
        referenceType: personType,
        shares: createEmptyShares(
          formState.value.hasParValueFreeShares ? 10 : 0
        ),
      };

      formState.value.shareholders.push(newShareholder);

      toast.add({
        title: "股東已加入",
        description: `已將${getPersonLabel(personType)} ${sourcePerson.name} 加入為股東（僅可編輯持股數）`,
        color: "success",
        icon: "i-lucide-user-check",
      });
    };

    const removeShareholder = (index: number) => {
      formState.value.shareholders.splice(index, 1);
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

      for (const shareholder of formState.value.shareholders) {
        if (shareholder.shares) {
          shareholder.shares[newShareType] = {
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
            formState.value.closelyHeldShareholderCount = undefined;
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

    // Watch closely held status and clear shareholder count when not applicable
    watch(
      () => formState.value.isCloselyHeld,
      (isCloselyHeld) => {
        if (!isCloselyHeld) {
          formState.value.closelyHeldShareholderCount = undefined;
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
      isStockCompany,
      // Share calculations
      ordinarySharesTotal: readonly(ordinarySharesTotal),
      preferredSharesTotal: readonly(preferredSharesTotal),
      totalShares: readonly(totalShares),
      // Actions
      addShareholder,
      addPersonAsShareholder,
      removeShareholder,
      addShareType,
      removeShareType,
      resetForm,
      markSubmissionSuccess,
      markSuccessViewed,
      populateWithMockData,
    };
  }
);
