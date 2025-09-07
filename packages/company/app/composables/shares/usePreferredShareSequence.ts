/**
 * Composable for managing preferred share sequence
 * Ensures preferred shares are made available in the correct order
 */

export const usePreferredShareSequence = (applicationId: Ref<string>) => {
  // Application-level state for which preferred shares are available
  const availablePreferredShares = ref<string[]>([]);
  const isLoading = ref(false);
  
  // Preferred shares must be enabled in sequence
  const PREFERRED_SHARE_SEQUENCE = [
    'preferred_a', // 甲種特別股
    'preferred_b', // 乙種特別股  
    'preferred_c', // 丙種特別股
    'preferred_d', // 丁種特別股
    'preferred_e', // 戊種特別股
  ];

  const { SHARE_TYPE_NAMES } = useShareTypes();

  // Computed properties
  const nextAvailablePreferredShare = computed(() => {
    const nextIndex = availablePreferredShares.value.length;
    return nextIndex < PREFERRED_SHARE_SEQUENCE.length 
      ? PREFERRED_SHARE_SEQUENCE[nextIndex]
      : null;
  });

  const canAddMorePreferredShares = computed(() => 
    availablePreferredShares.value.length < PREFERRED_SHARE_SEQUENCE.length
  );

  const availableShareTypes = computed(() => {
    // Always include ordinary shares
    const available = ['ordinary'];
    
    // Add preferred shares in sequence
    available.push(...availablePreferredShares.value);
    
    return available;
  });

  const availableShareTypeOptions = computed(() => 
    availableShareTypes.value.map(code => ({
      label: SHARE_TYPE_NAMES[code],
      value: code,
      description: code === 'ordinary' ? '普通股' : '特別股',
      isPreferred: code !== 'ordinary',
    }))
  );

  // Methods
  const addNextPreferredShare = async () => {
    const next = nextAvailablePreferredShare.value;
    if (!next) return false;

    try {
      isLoading.value = true;
      
      // Save to application preferences or database
      await $api(`/api/applications/${applicationId.value}/preferred-shares`, {
        method: 'POST',
        body: { shareType: next }
      });
      
      availablePreferredShares.value.push(next);
      
      return true;
    } catch (error) {
      console.error('Error adding preferred share:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const removeLastPreferredShare = async () => {
    if (availablePreferredShares.value.length === 0) return false;

    const lastShare = availablePreferredShares.value[availablePreferredShares.value.length - 1];
    
    try {
      isLoading.value = true;

      // Check if any shareholder has holdings of this type
      const { data: holdings } = await $api<ShareHolding[]>(
        `/api/applications/${applicationId.value}/share-holdings?shareType=${lastShare}`
      );

      if (holdings.length > 0) {
        throw new Error(`無法移除${SHARE_TYPE_NAMES[lastShare]}，已有股東持有此類股票`);
      }

      // Remove from application preferences
      await $api(`/api/applications/${applicationId.value}/preferred-shares/${lastShare}`, {
        method: 'DELETE'
      });

      availablePreferredShares.value.pop();
      
      return true;
    } catch (error) {
      console.error('Error removing preferred share:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const loadAvailableShares = async () => {
    if (!applicationId.value) return;

    try {
      isLoading.value = true;

      const { data } = await $api<string[]>(
        `/api/applications/${applicationId.value}/preferred-shares`
      );
      
      availablePreferredShares.value = data || [];
    } catch (error) {
      console.error('Error loading available shares:', error);
      availablePreferredShares.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const validateShareSequence = (holdings: ShareHolding[]) => {
    const errors: string[] = [];

    // Check if shares are being used in correct sequence
    const usedPreferredShares = new Set(
      holdings
        .map(h => h.shareType)
        .filter(type => type !== 'ordinary')
    );

    // Find the first gap in sequence
    let expectedSequenceLength = 0;
    for (let i = 0; i < PREFERRED_SHARE_SEQUENCE.length; i++) {
      const shareType = PREFERRED_SHARE_SEQUENCE[i];
      if (usedPreferredShares.has(shareType)) {
        expectedSequenceLength = i + 1;
      } else {
        break;
      }
    }

    // Check if there are any shares used after a gap
    for (let i = expectedSequenceLength; i < PREFERRED_SHARE_SEQUENCE.length; i++) {
      const shareType = PREFERRED_SHARE_SEQUENCE[i];
      if (usedPreferredShares.has(shareType)) {
        errors.push(
          `${SHARE_TYPE_NAMES[shareType]}必須在${SHARE_TYPE_NAMES[PREFERRED_SHARE_SEQUENCE[expectedSequenceLength]]}之後發行`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const getNextPreferredShareLabel = computed(() => {
    const next = nextAvailablePreferredShare.value;
    return next ? `新增${SHARE_TYPE_NAMES[next]}` : '已達特別股上限';
  });

  // Auto-load when applicationId changes
  watch(applicationId, (newId) => {
    if (newId) {
      loadAvailableShares();
    } else {
      availablePreferredShares.value = [];
    }
  }, { immediate: true });

  return {
    // State
    availablePreferredShares: readonly(availablePreferredShares),
    isLoading: readonly(isLoading),

    // Computed
    nextAvailablePreferredShare,
    canAddMorePreferredShares,
    availableShareTypes,
    availableShareTypeOptions,
    getNextPreferredShareLabel,

    // Methods
    addNextPreferredShare,
    removeLastPreferredShare,
    loadAvailableShares,
    validateShareSequence,
  };
};