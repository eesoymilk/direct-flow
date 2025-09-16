<template>
  <div class="container mx-auto p-6">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">查核意見組織圖測試</h1>

      <!-- Current Selection Display -->
      <div class="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 class="text-lg font-semibold text-blue-900 mb-2">目前選擇的意見</h3>
        <div v-if="store.selectedOpinion" class="space-y-2">
          <p class="text-blue-800">
            <strong>意見類型：</strong
            >{{ getOpinionTitle(store.selectedOpinion) }}
          </p>
          <p class="text-blue-700 text-sm">
            <strong>說明：</strong
            >{{ getOpinionDescription(store.selectedOpinion) }}
          </p>
        </div>
        <div v-else class="text-blue-600">尚未選擇任何意見類型</div>
      </div>

      <!-- Organization Chart -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <AuditOpinionOrgChart @opinion-selected="onOpinionSelected" />
      </div>

      <!-- Selection History -->
      <div class="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">選擇歷史</h3>
        <div v-if="selectionHistory.length > 0" class="space-y-2">
          <div
            v-for="(selection, index) in selectionHistory"
            :key="index"
            class="flex items-center justify-between p-2 bg-white rounded border"
          >
            <span class="text-sm">
              {{ getOpinionTitle(selection.opinionType) }}
            </span>
            <span class="text-xs text-gray-500">
              {{ selection.timestamp.toLocaleTimeString() }}
            </span>
          </div>
        </div>
        <div v-else class="text-gray-500 text-sm">無選擇歷史</div>
      </div>

      <!-- Debug Information -->
      <details class="mt-8">
        <summary
          class="cursor-pointer text-sm text-gray-600 hover:text-gray-800"
        >
          除錯資訊
        </summary>
        <div class="mt-4 p-4 bg-gray-100 rounded text-xs">
          <pre class="whitespace-pre-wrap">{{
            JSON.stringify(
              {
                selectedOpinion: store.selectedOpinion,
                globalInfo: store.globalInfo,
                opinionSpecificData: store.opinionSpecificData,
                isGlobalInfoComplete: store.isGlobalInfoComplete,
              },
              null,
              2
            )
          }}</pre>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useAuditBuilderStore();

interface SelectionHistory {
  opinionType: OpinionType;
  timestamp: Date;
}

const selectionHistory = ref<SelectionHistory[]>([]);

const getOpinionTitle = (opinionType: OpinionType): string => {
  const opinionData = store.opinionTypes.find((op) => op.type === opinionType);
  return opinionData?.title || opinionType;
};

const getOpinionDescription = (opinionType: OpinionType): string => {
  const opinionData = store.opinionTypes.find((op) => op.type === opinionType);
  return opinionData?.description || "";
};

const onOpinionSelected = (opinionType: OpinionType) => {
  selectionHistory.value.unshift({
    opinionType,
    timestamp: new Date(),
  });

  // Keep only last 10 selections
  if (selectionHistory.value.length > 10) {
    selectionHistory.value = selectionHistory.value.slice(0, 10);
  }

  console.log("Opinion selected in parent:", opinionType);
};

// Initialize some global info for testing
onMounted(() => {
  if (!store.isGlobalInfoComplete) {
    store.generateMockData();
  }
});
</script>
