<template>
  <UContainer>
    <div class="space-y-8 py-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">財報建構器</h1>
        <p class="text-gray-600">選擇適當的財報模組，建構符合審計準則的財報</p>
      </div>

      <div class="grid lg:grid-cols-2 gap-8">
        <!-- Left Panel: Opinion Type Selection -->
        <div class="space-y-6">
          <UCard class="p-6">
            <template #header>
              <h2 class="text-xl font-semibold text-gray-900">
                選擇查核意見類型
              </h2>
            </template>

            <div class="space-y-4">
              <div
                v-for="opinion in opinionTypes"
                :key="opinion.type"
                class="border rounded-lg p-4 cursor-pointer transition-all"
                :class="
                  selectedOpinion === opinion.type
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                "
                @click="selectedOpinion = opinion.type"
              >
                <div class="flex items-start gap-3">
                  <div class="mt-1">
                    <URadio
                      :model-value="selectedOpinion"
                      :value="opinion.type"
                      class="pointer-events-none"
                    />
                  </div>
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-900">
                      {{ opinion.title }}
                    </h3>
                    <p class="text-sm text-gray-600 mt-1">
                      {{ opinion.description }}
                    </p>
                    <div class="flex flex-wrap gap-2 mt-2">
                      <span
                        v-for="tag in opinion.tags"
                        :key="tag"
                        class="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Opinion Details Form -->
          <UCard v-if="selectedOpinion" class="p-6">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ getSelectedOpinionData()?.title }} - 詳細設定
              </h3>
            </template>

            <div class="space-y-4">
              <!-- Common fields -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  受查者名稱
                </label>
                <UInput
                  v-model="opinionData.entityName"
                  placeholder="請輸入受查者名稱"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  財務報表期間
                </label>
                <div class="grid grid-cols-2 gap-4">
                  <DatePicker
                    :value="opinionData.periodStart"
                    placeholder="起始日期"
                  />
                  <DatePicker
                    :value="opinionData.periodEnd"
                    placeholder="結束日期"
                  />
                </div>
              </div>

              <!-- Conditional fields based on opinion type -->
              <div v-if="selectedOpinion === 'qualified'" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    保留意見原因
                  </label>
                  <UTextarea
                    v-model="opinionData.qualificationReason"
                    placeholder="請描述導致保留意見的具體原因"
                    :rows="4"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    影響金額 (如適用)
                  </label>
                  <UInput
                    v-model="opinionData.materialAmount"
                    placeholder="請輸入金額"
                  />
                </div>
              </div>

              <div v-if="selectedOpinion === 'adverse'" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    否定意見原因
                  </label>
                  <UTextarea
                    v-model="opinionData.adverseReason"
                    placeholder="請描述導致否定意見的重大違反會計準則之情形"
                    :rows="4"
                  />
                </div>
              </div>

              <div v-if="selectedOpinion === 'disclaimer'" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    無法表示意見原因
                  </label>
                  <UTextarea
                    v-model="opinionData.disclaimerReason"
                    placeholder="請描述導致查核範圍受到限制的原因"
                    :rows="4"
                  />
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Right Panel: Preview -->
        <div class="space-y-6">
          <UCard class="p-6">
            <template #header>
              <h2
                class="text-xl font-semibold text-gray-900 flex items-center gap-2"
              >
                <UIcon name="i-lucide-eye" class="h-5 w-5" />
                財報預覽
              </h2>
            </template>

            <div v-if="selectedOpinion" class="space-y-4">
              <div
                class="bg-white border-2 border-gray-200 rounded-lg p-6 min-h-96"
              >
                <AuditOpinionPreview
                  :opinion-type="selectedOpinion"
                  :opinion-data="opinionData"
                />
              </div>
            </div>

            <div v-else class="text-center text-gray-500 py-12">
              <UIcon
                name="i-lucide-file-text"
                class="h-12 w-12 mx-auto mb-4 text-gray-300"
              />
              <p>請選擇查核意見類型以查看預覽</p>
            </div>
          </UCard>

          <!-- Actions -->
          <div class="flex gap-4">
            <UButton
              color="primary"
              size="lg"
              :disabled="!selectedOpinion"
              @click="generateReport"
              class="flex-1"
            >
              <UIcon name="i-lucide-file-down" class="h-4 w-4 mr-2" />
              產生財報
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              @click="saveTemplate"
              :disabled="!selectedOpinion"
            >
              <UIcon name="i-lucide-save" class="h-4 w-4 mr-2" />
              儲存範本
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
type OpinionType = "unqualified" | "qualified" | "adverse" | "disclaimer";

interface OpinionData {
  entityName: string;
  periodStart: Date;
  periodEnd: Date;
  qualificationReason?: string;
  materialAmount?: string;
  adverseReason?: string;
  disclaimerReason?: string;
}

const selectedOpinion = ref<OpinionType | null>(null);
const opinionData = ref<OpinionData>({
  entityName: "",
  periodStart: new Date(),
  periodEnd: new Date(),
});

const opinionTypes = [
  {
    type: "unqualified" as OpinionType,
    title: "無保留意見",
    description: "財務報表在所有重大方面均依照適用之財務報導架構編製",
    tags: ["標準意見", "無修正"],
  },
  {
    type: "qualified" as OpinionType,
    title: "保留意見",
    description: "除特定事項外，財務報表在所有重大方面均適當表達",
    tags: ["修正意見", "部分限制"],
  },
  {
    type: "adverse" as OpinionType,
    title: "否定意見",
    description: "財務報表整體而言並未適當表達",
    tags: ["修正意見", "重大違反"],
  },
  {
    type: "disclaimer" as OpinionType,
    title: "無法表示意見",
    description: "無法取得充分適切之查核證據作為查核意見之基礎",
    tags: ["修正意見", "查核範圍限制"],
  },
];

const getSelectedOpinionData = () => {
  return opinionTypes.find((op) => op.type === selectedOpinion.value);
};

const generateReport = async () => {
  if (!selectedOpinion.value) return;

  try {
    const reportData = {
      entityName: opinionData.value.entityName || "範例公司",
      periodStart: opinionData.value.periodStart || new Date("2023-01-01"),
      periodEnd: opinionData.value.periodEnd || new Date("2023-12-31"),
      reportDate: new Date(),
      firmName: "會計師事務所名稱",
      auditorName: "會計師姓名",
      opinionType: selectedOpinion.value,
      accountingFramework: "一般公認會計原則",
      qualificationReason: opinionData.value.qualificationReason,
      materialAmount: opinionData.value.materialAmount
        ? parseInt(opinionData.value.materialAmount)
        : undefined,
      adverseReason: opinionData.value.adverseReason,
      disclaimerReason: opinionData.value.disclaimerReason,
    };

    const blob = await generateAuditDocxBlob(reportData);

    // Download the file
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-report-${reportData.entityName}-${reportData.periodEnd.getFullYear()}.docx`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating report:", error);
  }
};

const saveTemplate = () => {
  // TODO: Implement template saving
  console.log("Saving template:", {
    opinionType: selectedOpinion.value,
    data: opinionData.value,
  });
};

useSeoMeta({
  title: "查核意見段建構器 - Direct Flow Audit",
  description: "建構符合審計準則的查核意見段，支援各種意見類型",
});
</script>
