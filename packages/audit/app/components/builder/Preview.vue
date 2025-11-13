<template>
  <UCard class="sticky top-[90px] flex-1">
    <template #header>
      <div class="flex justify-between items-center">
        <h2
          class="text-xl font-semibold text-gray-900 flex items-center gap-2"
        >
          <UIcon name="i-lucide-eye" size="20" />
          財報預覽
        </h2>
        <USwitch v-model="highlightVariable" label="審查模式" />
      </div>
    </template>

    <!-- Preview Content -->
    <div v-if="hasValidOpinion" class="space-y-4">
      <div
        class="bg-white border-2 border-gray-200 rounded-lg p-6 min-h-96"
      >
        <DocumentPreview :sections="sections" document-size="A4" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center text-gray-500 py-12">
      <UIcon
        name="i-lucide-file-text"
        class="h-12 w-12 mx-auto mb-4 text-gray-300"
      />
      <p>
        {{
          opinionMode === "dual"
            ? "請為兩個年度選擇查核意見類型以查看預覽"
            : "請選擇查核意見類型以查看預覽"
        }}
      </p>
    </div>

    <!-- Footer Actions -->
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          icon="i-lucide-file-down"
          label="產生財報"
          color="primary"
          size="lg"
          @click="generateReport"
        />
        <UButton
          icon="i-lucide-save"
          label="儲存範本"
          color="neutral"
          variant="outline"
          size="lg"
          @click="saveTemplate"
        />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
const store = useOpinionBuilderStore();
const { opinionInfo, highlightVariable } = storeToRefs(store);

const { sections } = useReportSections();
const { opinionMode } = useOpinionMode();

// Check if opinion selection is valid for preview
const hasValidOpinion = computed(() => {
  if (opinionInfo.value.mode === 'single') {
    return !!opinionInfo.value.opinion.opinionType;
  }

  if (opinionInfo.value.mode === 'dual') {
    return (
      opinionInfo.value.currentYearOpinion.opinionType &&
      opinionInfo.value.comparativeYearOpinion.opinionType
    );
  }

  return false;
});

// Action handlers
const generateReport = async () => {
  try {
    // TODO: Implement report generation
    console.log("Report generated and downloaded successfully");
  } catch (error) {
    console.error("Report generation failed:", error);
  }
};

const saveTemplate = async () => {
  try {
    // TODO: Implement template saving
  } catch (error) {
    console.error("Template saving failed:", error);
  }
};
</script>
