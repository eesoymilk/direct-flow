<template>
  <div class="bg-white min-h-[600px] leading-[1.8] font-serif text-sm">
    <!-- Report Header -->
    <div class="text-center mb-8">
      <h1 class="text-lg font-bold mb-4">{{ template.header.title }}</h1>
      <div class="text-left mb-6">
        <p class="font-medium">{{ template.header.recipient }}</p>
      </div>
    </div>

    <!-- Report Sections -->
    <div v-for="section in template.sections" :key="section.title" class="mb-6">
      <h2 class="text-sm font-bold mb-3 border-b border-gray-300 pb-1">
        {{ section.title }}
      </h2>
      <div class="space-y-3">
        <p
          v-for="(paragraph, index) in section.paragraphs"
          :key="index"
          class="text-justify mb-2"
          :class="{
            'indent-8': !paragraph.match(/^\d+\./),
            'pl-4': paragraph.match(/^\d+\./),
          }"
        >
          {{ paragraph }}
        </p>
      </div>
    </div>

    <!-- Report Footer -->
    <div class="mt-12 space-y-4">
      <div class="text-right">
        <p>{{ template.footer.firmName }}</p>
        <br />
        <p>會計師：{{ template.footer.auditorName }}</p>
        <br />
        <p>{{ template.footer.date }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useAuditBuilderStore();

const getReportTemplate = () => {
  const reportData = {
    entityName: store.globalInfo.entityName || "[受查者名稱]",
    periodStart: store.globalInfo.periodStart || new Date("2023-01-01"),
    periodEnd: store.globalInfo.periodEnd || new Date("2023-12-31"),
    comparativePeriodStart:
      store.globalInfo.comparativePeriodStart || undefined,
    comparativePeriodEnd: store.globalInfo.comparativePeriodEnd || undefined,
    reportDate: store.globalInfo.reportDate || new Date(),
    firmName: store.globalInfo.firmName || "安侯建業聯合會計師事務所",
    auditorName: store.globalInfo.auditorName || "會計師姓名",
    opinionType: store.selectedOpinion || "unqualified",
    accountingFramework:
      store.globalInfo.accountingFramework || "商業會計法及商業會計處理準則",
    qualificationReason:
      store.opinionSpecificData.qualificationReason || undefined,
    materialAmount: store.opinionSpecificData.materialAmount
      ? parseInt(store.opinionSpecificData.materialAmount)
      : undefined,
    adverseReason: store.opinionSpecificData.adverseReason || undefined,
    disclaimerReason: store.opinionSpecificData.disclaimerReason || undefined,
    independenceCompliance:
      store.combinedOpinionData.independenceCompliance ?? true,
    ethicalRequirementsCompliance:
      store.combinedOpinionData.ethicalRequirementsCompliance ?? true,
    goingConcern: store.opinionSpecificData.goingConcern || undefined,
    emphasisOfMatter: store.opinionSpecificData.emphasisOfMatter || undefined,
    otherMatter: store.opinionSpecificData.otherMatter || undefined,
    keyAuditMatters: store.opinionSpecificData.keyAuditMatters || undefined,
    previousAuditor: store.opinionSpecificData.previousAuditor || undefined,
    previousOpinion: store.opinionSpecificData.previousOpinion || undefined,
  };

  return generateAuditReportTemplate(reportData);
};

const template = computed(() => getReportTemplate());
</script>

