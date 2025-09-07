/**
 * Composable for managing share types
 * Provides reactive share type data and utilities
 */
export const useShareTypes = () => {
  const { $api } = useNuxtApp();
  
  // Reactive state
  const shareTypes = ref<ShareType[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed getters
  const shareTypeOptions = computed(() => 
    shareTypes.value.map(type => ({
      label: type.name,
      value: type.code,
      description: type.isPreferred ? '特別股' : '普通股'
    }))
  );

  const ordinaryShareTypes = computed(() => 
    shareTypes.value.filter(type => !type.isPreferred)
  );

  const preferredShareTypes = computed(() => 
    shareTypes.value.filter(type => type.isPreferred)
  );

  // Methods
  const fetchShareTypes = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const { data } = await $api<ShareType[]>('/api/share-types');
      shareTypes.value = data;
      
    } catch (err: any) {
      error.value = err.message || '無法載入股票類型';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getShareTypeByCode = (code: string) => 
    shareTypes.value.find(type => type.code === code);

  const getShareTypeName = (code: string) => 
    getShareTypeByCode(code)?.name || code;

  const isPreferredShare = (code: string) => 
    getShareTypeByCode(code)?.isPreferred ?? false;

  // Auto-load on first use
  if (shareTypes.value.length === 0 && !isLoading.value) {
    fetchShareTypes();
  }

  return {
    // State
    shareTypes: readonly(shareTypes),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Computed
    shareTypeOptions,
    ordinaryShareTypes,
    preferredShareTypes,

    // Methods
    fetchShareTypes,
    getShareTypeByCode,
    getShareTypeName,
    isPreferredShare,
  };
};