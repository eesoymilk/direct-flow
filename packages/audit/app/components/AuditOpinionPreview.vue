<template>
  <div class="audit-report-preview font-serif text-sm leading-relaxed">
    <!-- Report Header -->
    <div class="text-center mb-8">
      <h1 class="text-lg font-bold mb-2">{{ template.header.title }}</h1>
      <div class="text-sm">
        <p>{{ template.header.entity }}</p>
        <p>{{ template.header.period }}</p>
      </div>
    </div>

    <!-- Report Sections -->
    <div v-for="section in template.sections" :key="section.title" class="mb-6">
      <h2 class="text-base font-bold mb-3 border-b border-gray-300 pb-1">
        {{ section.title }}
      </h2>
      <div class="space-y-3">
        <p v-for="paragraph in section.paragraphs" :key="paragraph" class="indent-8">
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
import { generateAuditReportTemplate } from '~/shared/utils/audit-report-generator';
import type { AuditReportData } from '~/shared/types/audit-report';

interface Props {
  opinionType: string;
  opinionData: {
    entityName?: string;
    periodStart?: Date;
    periodEnd?: Date;
    qualificationReason?: string;
    materialAmount?: string;
    adverseReason?: string;
    disclaimerReason?: string;
  };
}

const props = defineProps<Props>();

const getReportTemplate = () => {
  const reportData: AuditReportData = {
    entityName: props.opinionData.entityName || '[受查者名稱]',
    periodStart: props.opinionData.periodStart || new Date('2023-01-01'),
    periodEnd: props.opinionData.periodEnd || new Date('2023-12-31'),
    reportDate: new Date(),
    firmName: '會計師事務所名稱',
    auditorName: '會計師姓名',
    opinionType: props.opinionType as any,
    accountingFramework: '一般公認會計原則',
    qualificationReason: props.opinionData.qualificationReason,
    materialAmount: props.opinionData.materialAmount ? parseInt(props.opinionData.materialAmount) : undefined,
    adverseReason: props.opinionData.adverseReason,
    disclaimerReason: props.opinionData.disclaimerReason
  };

  return generateAuditReportTemplate(reportData);
};

const template = computed(() => getReportTemplate());
</script>

<style scoped>
.audit-report-preview {
  background: white;
  min-height: 600px;
  line-height: 1.8;
}

.audit-report-preview h1 {
  font-size: 18px;
}

.audit-report-preview h2 {
  font-size: 14px;
}

.audit-report-preview p {
  text-align: justify;
  margin-bottom: 8px;
}

.indent-8 {
  text-indent: 2rem;
}
</style>
