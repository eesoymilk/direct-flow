<template>
  <UCard class="border-l-4" :class="sectionBorderClass">
    <div>
      <CompanyApplicationReviewSectionHeader
        :section="section"
        :collapsible-open="collapsibleOpen"
      >
        <template #header-right>
          <div class="flex items-center gap-3">
            <UBadge
              :label="statusLabel"
              :color="statusBadgeColor"
              variant="subtle"
            />
            <UDropdownMenu :items="quickActionItems">
              <UButton icon="i-lucide-more-vertical" variant="ghost" />
            </UDropdownMenu>
            <UButton
              :icon="
                collapsibleOpen
                  ? 'i-lucide-chevron-up'
                  : 'i-lucide-chevron-down'
              "
              variant="ghost"
              @click="toggleCollapsible"
            />
          </div>
        </template>
      </CompanyApplicationReviewSectionHeader>

      <UCollapsible v-model:open="collapsibleOpen" class="w-full">
        <template #content>
          <div class="space-y-4 pt-4 md:space-y-6 md:pt-6">
            <CompanyApplicationReviewSectionIssuesSummary
              :issues="sectionIssues"
            />

            <CompanyApplicationReviewSectionVerificationSummary
              :verifications="sectionVerifications"
            />

            <!-- Field Review Cards -->
            <div class="grid gap-4 px-2">
              <UCard
                v-for="field in section.fields"
                :key="field"
                class="hover:shadow-md transition-shadow"
              >
                <div class="space-y-3">
                  <!-- Field Header -->
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <h4 class="font-medium text-gray-900">
                          {{ getFieldLabel(field) }}
                        </h4>
                        <UBadge
                          v-if="getFieldStatus(field)"
                          :label="getFieldStatus(field)"
                          :color="getFieldStatusBadgeColor(field)"
                          variant="subtle"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Field Value Display -->
                  <div
                    class="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
                  >
                    <p class="text-sm text-gray-900 leading-relaxed">
                      {{ getFieldDisplayValue(field) }}
                    </p>
                  </div>

                  <!-- Field Actions -->
                  <div class="w-full flex gap-2">
                    <UButton
                      v-if="!isFieldVerified(field)"
                      icon="i-lucide-check"
                      label="驗證"
                      color="success"
                      variant="subtle"
                      block
                      @click="verifyField(field)"
                    />
                    <CompanyApplicationReviewSectionIssueModal :field="field" />
                  </div>
                </div>
              </UCard>
            </div>
          </div>
        </template>
      </UCollapsible>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { getFieldValue, formatFieldValue } from "~/utils/fieldValues";

const props = defineProps<{ section: ReviewSection }>();
const reviewStore = useCompanyApplicationReviewStore();

// Local state
const collapsibleOpen = ref(false);

const sectionIssues = computed(() =>
  reviewStore.getSectionIssues(props.section.key)
);

const sectionVerifications = computed(() =>
  reviewStore.getSectionVerifications(props.section.key)
);

const quickActionItems = computed((): DropdownMenuItem[] => [
  [
    {
      label: "驗證全部欄位",
      icon: "i-lucide-check-circle",
      color: "success",
      onSelect: () => verifyAllFields(),
    },
    {
      label: "跳過此區塊",
      icon: "i-lucide-eye-off",
      color: "warning",
      onSelect: () => ignoreSection(),
    },
  ],
]);

const sectionBorderClass = computed(() => {
  if (sectionIssues.value.length > 0) {
    const hasCritical = sectionIssues.value.some(
      (i) => i.severity === "critical"
    );
    return hasCritical ? "border-l-error-500" : "border-l-warning-500";
  }
  if (sectionVerifications.value.length > 0) return "border-l-success-500";
  return "border-l-neutral-300";
});

const statusBadgeColor = computed(() => {
  if (sectionIssues.value.length > 0) {
    const hasCritical = sectionIssues.value.some(
      (i) => i.severity === "critical"
    );
    return hasCritical ? "error" : "warning";
  }
  if (sectionVerifications.value.length > 0) return "success";
  return "neutral";
});

const statusLabel = computed(() => {
  if (sectionIssues.value.length > 0) {
    const criticalCount = sectionIssues.value.filter(
      (i) => i.severity === "critical"
    ).length;
    if (criticalCount > 0) return `${criticalCount} 嚴重問題`;
    return `${sectionIssues.value.length} 問題`;
  }
  if (sectionVerifications.value.length > 0) {
    return "已驗證";
  }
  return "準備審核";
});

const toggleCollapsible = () => {
  collapsibleOpen.value = !collapsibleOpen.value;
};

const getFieldLabel = (fieldPath: string): string => {
  return useFieldLabel(fieldPath);
};

const getFieldStatus = (field: string): string => {
  const fullPath = `${props.section.key}.${field}`;
  const hasIssue = sectionIssues.value.some((i) => i.fieldPath === fullPath);
  const isVerified = sectionVerifications.value.some(
    (v) => v.fieldPath === fullPath
  );

  if (hasIssue) return "有問題";
  if (isVerified) return "已驗證";
  return "";
};

const getFieldStatusBadgeColor = (field: string) => {
  const status = getFieldStatus(field);
  if (status === "有問題") return "error";
  if (status === "已驗證") return "success";
  return "neutral";
};

const getFieldDisplayValue = (field: string): string => {
  const fullPath = `${props.section.key}.${field}`;
  const value = getFieldValue(reviewStore.application, fullPath);
  return formatFieldValue(value, fullPath);
};

const isFieldVerified = (field: string): boolean => {
  const fullPath = `${props.section.key}.${field}`;
  return sectionVerifications.value.some((v) => v.fieldPath === fullPath);
};

const verifyField = (field: string) => {
  const fullPath = `${props.section.key}.${field}`;
  reviewStore.addVerification({ fieldPath: fullPath });
};

const verifyAllFields = () => {
  reviewStore.verifySection(props.section.key, props.section.fields);
};

const ignoreSection = () => {
  // TODO: Implement section ignore functionality
  console.log("Ignoring section:", props.section.key);
};
</script>
