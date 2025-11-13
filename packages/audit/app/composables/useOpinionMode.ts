/**
 * Composable for managing opinion mode state
 * Handles switching between single and dual opinion modes
 * Manages year tab state for dual opinion mode
 */
export const useOpinionMode = () => {
  const store = useOpinionBuilderStore();
  const { basicInfo, opinionInfo } = storeToRefs(store);

  // Year tab state for dual opinion mode
  const selectedYearTab = ref<"current" | "comparative">("current");

  // Year tabs configuration
  const yearTabs = computed(() => [
    {
      label: `當期年度 (民國${basicInfo.value.currentRocYear || "___"}年)`,
      value: "current",
      icon: "i-lucide-calendar",
    },
    {
      label: `比較期年度 (民國${basicInfo.value.currentRocYear ? basicInfo.value.currentRocYear - 1 : "___"}年)`,
      value: "comparative",
      icon: "i-lucide-calendar-clock",
    },
  ]);

  /**
   * Computed property with getter/setter for opinion mode
   * Synced with store and handles initialization when mode changes
   */
  const opinionMode = computed<"single" | "dual">({
    get: () => opinionInfo.value.mode,
    set: (mode) => {
      if (mode === "single") {
        opinionInfo.value = {
          mode: "single",
          opinion: {
            year: basicInfo.value.currentRocYear || 0,
            opinionType: "unqualified",
          },
        };
      } else {
        opinionInfo.value = {
          mode: "dual",
          currentYearOpinion: {
            year: basicInfo.value.currentRocYear || 0,
            opinionType: "unqualified",
          },
          comparativeYearOpinion: {
            year: (basicInfo.value.currentRocYear || 1) - 1,
            opinionType: "unqualified",
          },
        };
      }
    },
  });

  return {
    opinionMode,
    selectedYearTab,
    yearTabs,
  };
};
