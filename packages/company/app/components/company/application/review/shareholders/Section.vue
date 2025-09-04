<template>
  <CompanyApplicationReviewShareholdersSectionBase
    title="股東資料"
    description="股東的基本資料及持股資訊"
    empty-state-message="尚無股東資料"
    :is-open="sectionIsOpen"
    :shareholders-count="shareholders.length"
    :aggregate-status="status"
    :quick-action-items="quickActionItems"
    @toggle="handleToggleSection"
  >
    <CompanyApplicationReviewShareholdersShareholderCard
      v-for="(shareholder, index) in shareholders"
      :key="shareholder.id"
      :shareholder="shareholder"
      :index="index"
      :is-expanded="expandedShareholders[index] || false"
      :overall-status="getShareholderOverallStatus(index)"
      :shareholder-statuses="getShareholderStatuses(index)"
      :shareholder-statuses-props="getShareholderStatusesProps(index)"
      @toggle="toggleShareholderExpanded(index)"
      @verify-field="(field, index) => verifyShareholderField(field, index)"
      @add-field-issue="(issue) => addFieldIssue(issue)"
    />
  </CompanyApplicationReviewShareholdersSectionBase>
</template>

<script setup lang="ts">
import { useShareholderReviewSection } from "./useShareholderReviewSection";

const {
  shareholders,
  sectionIsOpen,
  status,
  quickActionItems,
  getShareholderStatuses,
  getShareholderOverallStatus,
  getShareholderStatusesProps,
  addFieldIssue,
  verifyShareholderField,
  handleToggleSection,
} = useShareholderReviewSection({
  sectionTitle: "股東資料",
  verifyAllLabel: "驗證全部",
  clearAllLabel: "清除標記",
  markReviewedLabel: "標記已檢視",
});

// Collapsible state management
const expandedShareholders = ref<Record<number, boolean>>({});

const toggleShareholderExpanded = (index: number) => {
  expandedShareholders.value[index] = !expandedShareholders.value[index];
};

// Initialize first few shareholders as expanded by default
onMounted(() => {
  // Expand first 3 shareholders by default for better UX
  shareholders.value.slice(0, 3).forEach((_, index) => {
    expandedShareholders.value[index] = true;
  });
});
</script>
