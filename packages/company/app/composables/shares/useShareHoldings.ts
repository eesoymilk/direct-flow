/**
 * Composable for managing individual shareholder holdings
 * Handles CRUD operations and calculations for share holdings
 */
export const useShareHoldings = (shareholderId?: Ref<string>) => {
  const { $api } = useNuxtApp();
  const toast = useToast();

  // Reactive state
  const holdings = ref<ShareHolding[]>([]);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref<string | null>(null);

  // Computed calculations
  const totalInvestment = computed(() => 
    holdings.value.reduce((sum, holding) => sum + (holding.totalAmount || 0), 0)
  );

  const ordinarySharesTotal = computed(() => 
    holdings.value
      .filter(holding => !useShareTypes().isPreferredShare(holding.shareType))
      .reduce((sum, holding) => sum + (holding.totalAmount || 0), 0)
  );

  const preferredSharesTotal = computed(() => 
    holdings.value
      .filter(holding => useShareTypes().isPreferredShare(holding.shareType))
      .reduce((sum, holding) => sum + (holding.totalAmount || 0), 0)
  );

  const holdingsByType = computed(() => {
    const grouped = holdings.value.reduce((acc, holding) => {
      if (!acc[holding.shareType]) {
        acc[holding.shareType] = [];
      }
      acc[holding.shareType].push(holding);
      return acc;
    }, {} as Record<string, ShareHolding[]>);

    return grouped;
  });

  // Methods
  const fetchHoldings = async () => {
    if (!shareholderId?.value) return;

    try {
      isLoading.value = true;
      error.value = null;

      const { data } = await $api<ShareHolding[]>(
        `/api/shareholders/${shareholderId.value}/holdings`
      );
      holdings.value = data;

    } catch (err: any) {
      error.value = err.message || '無法載入持股資料';
      console.error('Failed to fetch holdings:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const createHolding = async (holdingData: Omit<ShareHolding, 'id' | 'totalAmount'>) => {
    if (!shareholderId?.value) throw new Error('股東ID為必填');

    try {
      isSaving.value = true;
      
      const calculatedHolding = {
        ...holdingData,
        totalAmount: calculateTotalAmount(holdingData.quantity, holdingData.pricePerShare),
        shareholderId: shareholderId.value,
      };

      const { data } = await $api<ShareHolding>('/api/share-holdings', {
        method: 'POST',
        body: calculatedHolding,
      });

      holdings.value.push(data);
      
      toast.add({
        title: '持股新增成功',
        description: `${useShareTypes().getShareTypeName(data.shareType)} ${data.quantity}股`,
        color: 'green',
      });

      return data;

    } catch (err: any) {
      const message = err.message || '新增持股失敗';
      toast.add({
        title: '新增失敗',
        description: message,
        color: 'red',
      });
      throw err;
    } finally {
      isSaving.value = false;
    }
  };

  const updateHolding = async (id: string, updates: Partial<ShareHolding>) => {
    try {
      isSaving.value = true;

      // Recalculate total if quantity or price changed
      if (updates.quantity !== undefined || updates.pricePerShare !== undefined) {
        const holding = holdings.value.find(h => h.id === id);
        if (holding) {
          updates.totalAmount = calculateTotalAmount(
            updates.quantity ?? holding.quantity,
            updates.pricePerShare ?? holding.pricePerShare
          );
        }
      }

      const { data } = await $api<ShareHolding>(`/api/share-holdings/${id}`, {
        method: 'PATCH',
        body: updates,
      });

      const index = holdings.value.findIndex(h => h.id === id);
      if (index !== -1) {
        holdings.value[index] = data;
      }

      toast.add({
        title: '持股更新成功',
        color: 'green',
      });

      return data;

    } catch (err: any) {
      const message = err.message || '更新持股失敗';
      toast.add({
        title: '更新失敗',
        description: message,
        color: 'red',
      });
      throw err;
    } finally {
      isSaving.value = false;
    }
  };

  const deleteHolding = async (id: string) => {
    try {
      isSaving.value = true;

      await $api(`/api/share-holdings/${id}`, {
        method: 'DELETE',
      });

      const index = holdings.value.findIndex(h => h.id === id);
      if (index !== -1) {
        const deleted = holdings.value.splice(index, 1)[0];
        
        toast.add({
          title: '持股刪除成功',
          description: `${useShareTypes().getShareTypeName(deleted.shareType)}`,
          color: 'green',
        });
      }

    } catch (err: any) {
      const message = err.message || '刪除持股失敗';
      toast.add({
        title: '刪除失敗',
        description: message,
        color: 'red',
      });
      throw err;
    } finally {
      isSaving.value = false;
    }
  };

  const addEmptyHolding = () => {
    const emptyHolding: ShareHolding = {
      id: `temp-${Date.now()}`, // Temporary ID
      shareType: 'ordinary',
      quantity: 0,
      pricePerShare: 0,
      totalAmount: 0,
    };
    holdings.value.push(emptyHolding);
    return emptyHolding;
  };

  const validateHolding = (holding: ShareHolding) => {
    const errors: string[] = [];

    if (!holding.shareType) errors.push('請選擇股票類型');
    if (holding.quantity <= 0) errors.push('股數必須大於0');
    if (holding.pricePerShare <= 0) errors.push('股價必須大於0');

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  // Auto-fetch when shareholderId changes
  watch(shareholderId, (newId) => {
    if (newId) {
      fetchHoldings();
    } else {
      holdings.value = [];
    }
  }, { immediate: true });

  return {
    // State
    holdings: readonly(holdings),
    isLoading: readonly(isLoading),
    isSaving: readonly(isSaving),
    error: readonly(error),

    // Computed
    totalInvestment,
    ordinarySharesTotal,
    preferredSharesTotal,
    holdingsByType,

    // Methods
    fetchHoldings,
    createHolding,
    updateHolding,
    deleteHolding,
    addEmptyHolding,
    validateHolding,
  };
};