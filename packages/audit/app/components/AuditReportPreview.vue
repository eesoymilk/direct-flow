<template>
  <div class="bg-white min-h-[600px] leading-[1.8] font-serif text-sm">
    <!-- Report Header -->
    <div class="text-center mb-8">
      <h1 class="text-lg font-bold mb-4">{{ reportTemplate.header.title }}</h1>
      <div class="text-left mb-6">
        <p class="font-medium">{{ reportTemplate.header.recipient }}</p>
      </div>
    </div>

    <!-- Report Sections -->
    <div
      v-for="section in reportTemplate.sections"
      :key="section.title"
      class="mb-6"
    >
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
        <p>{{ reportTemplate.footer.firmName }}</p>
        <br />
        <p>會計師：{{ reportTemplate.footer.auditorName }}</p>
        <br />
        <p>{{ reportTemplate.footer.date }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const auditStore = useAuditBuilderStore();
const { reportTemplate } = storeToRefs(auditStore);
</script>
