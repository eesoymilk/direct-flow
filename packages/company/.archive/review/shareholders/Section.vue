<template>
  <CompanyApplicationReviewPartnersSectionBase
    title="股東資料"
    description="股東的基本資料及持股資訊"
    empty-state-message="尚無股東資料"
    :is-open="sectionIsOpen"
    :partners-count="partners.length"
    :aggregate-status="status"
    :quick-action-items="quickActionItems"
    @toggle="handleToggleSection"
  >
    <CompanyApplicationReviewPartnersPartnerCard
      v-for="(partner, index) in partners"
      :key="partner.id"
      :partner="partner"
      :index="index"
      :is-expanded="expandedPartners[index] || false"
      :overall-status="getPartnerOverallStatus(index)"
      :partner-statuses="getPartnerStatuses(index)"
      :partner-statuses-props="getPartnerStatusesProps(index)"
      @toggle="togglePartnerExpanded(index)"
      @verify-field="(field, index) => verifyPartnerField(field, index)"
      @add-field-issue="(issue) => addFieldIssue(issue)"
    />
  </CompanyApplicationReviewPartnersSectionBase>
</template>

<script setup lang="ts">
import { usePartnerReviewSection } from "./usePartnerReviewSection";

const {
  partners,
  sectionIsOpen,
  status,
  quickActionItems,
  getPartnerStatuses,
  getPartnerOverallStatus,
  getPartnerStatusesProps,
  addFieldIssue,
  verifyPartnerField,
  handleToggleSection,
} = usePartnerReviewSection({
  sectionTitle: "股東資料",
  verifyAllLabel: "驗證全部",
  clearAllLabel: "清除標記",
  markReviewedLabel: "標記已檢視",
});

// Collapsible state management
const expandedPartners = ref<Record<number, boolean>>({});

const togglePartnerExpanded = (index: number) => {
  expandedPartners.value[index] = !expandedPartners.value[index];
};

// Initialize first few partners as expanded by default
onMounted(() => {
  // Expand first 3 partners by default for better UX
  partners.value.slice(0, 3).forEach((_, index) => {
    expandedPartners.value[index] = true;
  });
});
</script>
