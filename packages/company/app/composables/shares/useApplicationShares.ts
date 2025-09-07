/**
 * Composable for managing application-level share calculations
 * Aggregates all shareholder holdings for the application
 */
export const useApplicationShares = (applicationId: Ref<string>) => {
  const { $api } = useNuxtApp();

  // Reactive state
  const shareholders = ref<ApplicationShareholder[]>([]);
  const allHoldings = ref<ShareHolding[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed aggregations
  const totalOrdinaryAmount = computed(() => 
    allHoldings.value
      .filter(holding => !useShareTypes().isPreferredShare(holding.shareType))
      .reduce((sum, holding) => sum + holding.totalAmount, 0)
  );

  const totalPreferredAmount = computed(() => 
    allHoldings.value
      .filter(holding => useShareTypes().isPreferredShare(holding.shareType))
      .reduce((sum, holding) => sum + holding.totalAmount, 0)
  );

  const totalCapitalRaised = computed(() => 
    totalOrdinaryAmount.value + totalPreferredAmount.value
  );

  const shareholderSummaries = computed(() => 
    shareholders.value.map(shareholder => {
      const shareholderHoldings = allHoldings.value.filter(
        holding => holding.shareholderId === shareholder.id
      );

      const totalInvestment = shareholderHoldings.reduce(
        (sum, holding) => sum + holding.totalAmount, 0
      );

      const ownershipPercentage = totalCapitalRaised.value > 0 
        ? (totalInvestment / totalCapitalRaised.value) * 100 
        : 0;

      return {
        shareholder,
        holdings: shareholderHoldings,
        totalInvestment,
        ownershipPercentage,
      };
    })
  );

  const shareTypeBreakdown = computed(() => {
    const breakdown = new Map<string, {
      shareType: string;
      typeName: string;
      totalQuantity: number;
      totalAmount: number;
      shareholderCount: number;
    }>();

    allHoldings.value.forEach(holding => {
      const key = holding.shareType;
      const existing = breakdown.get(key) || {
        shareType: key,
        typeName: useShareTypes().getShareTypeName(key),
        totalQuantity: 0,
        totalAmount: 0,
        shareholderCount: 0,
      };

      existing.totalQuantity += holding.quantity;
      existing.totalAmount += holding.totalAmount;
      
      // Count unique shareholders for this share type
      const shareholdersWithThisType = new Set(
        allHoldings.value
          .filter(h => h.shareType === key)
          .map(h => h.shareholderId)
      );
      existing.shareholderCount = shareholdersWithThisType.size;

      breakdown.set(key, existing);
    });

    return Array.from(breakdown.values());
  });

  // Methods
  const fetchApplicationShares = async () => {
    if (!applicationId.value) return;

    try {
      isLoading.value = true;
      error.value = null;

      const [shareholdersRes, holdingsRes] = await Promise.all([
        $api<ApplicationShareholder[]>(`/api/applications/${applicationId.value}/shareholders`),
        $api<ShareHolding[]>(`/api/applications/${applicationId.value}/share-holdings`),
      ]);

      shareholders.value = shareholdersRes.data;
      allHoldings.value = holdingsRes.data;

    } catch (err: any) {
      error.value = err.message || '無法載入股權資料';
      console.error('Failed to fetch application shares:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const updateApplicationShareTotals = async () => {
    if (!applicationId.value) return;

    try {
      await $api(`/api/applications/${applicationId.value}/share-totals`, {
        method: 'PATCH',
        body: {
          ordinarySharesAmount: totalOrdinaryAmount.value,
          preferredSharesAmount: totalPreferredAmount.value,
        },
      });

    } catch (err: any) {
      console.error('Failed to update application share totals:', err);
      throw err;
    }
  };

  const validateApplicationShares = () => {
    const errors: string[] = [];

    if (shareholders.value.length === 0) {
      errors.push('至少需要一位股東');
    }

    if (allHoldings.value.length === 0) {
      errors.push('至少需要一筆持股記錄');
    }

    const shareholdersWithoutHoldings = shareholders.value.filter(
      shareholder => !allHoldings.value.some(holding => holding.shareholderId === shareholder.id)
    );

    if (shareholdersWithoutHoldings.length > 0) {
      errors.push(`${shareholdersWithoutHoldings.length} 位股東尚未設定持股`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [] as string[],
    };
  };

  const exportShareData = () => {
    return {
      summary: {
        totalOrdinaryAmount: totalOrdinaryAmount.value,
        totalPreferredAmount: totalPreferredAmount.value,
        totalCapitalRaised: totalCapitalRaised.value,
        shareholderCount: shareholders.value.length,
      },
      shareholders: shareholderSummaries.value,
      shareTypes: shareTypeBreakdown.value,
      exportedAt: new Date().toISOString(),
    };
  };

  // Auto-fetch when applicationId changes
  watch(applicationId, (newId) => {
    if (newId) {
      fetchApplicationShares();
    } else {
      shareholders.value = [];
      allHoldings.value = [];
    }
  }, { immediate: true });

  // Auto-update totals when holdings change
  watch(
    [totalOrdinaryAmount, totalPreferredAmount],
    debounce(() => {
      updateApplicationShareTotals();
    }, 1000),
    { deep: true }
  );

  return {
    // State
    shareholders: readonly(shareholders),
    allHoldings: readonly(allHoldings),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Computed
    totalOrdinaryAmount,
    totalPreferredAmount,
    totalCapitalRaised,
    shareholderSummaries,
    shareTypeBreakdown,

    // Methods
    fetchApplicationShares,
    updateApplicationShareTotals,
    validateApplicationShares,
    exportShareData,
  };
};