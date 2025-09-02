<template>
  <UCard class="border-l-4" :class="sectionBorderClass">
    <!-- Section Header -->
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <UIcon :name="statusIcon" :class="statusIconClass" />
          <div>
            <h3 class="text-lg font-medium text-gray-900">
              {{ section.title }}
            </h3>
            <p class="text-sm text-gray-600">{{ section.description }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <UBadge
            :label="statusLabel"
            :color="statusBadgeColor"
            variant="subtle"
          />
          <UButton
            :icon="isExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
            variant="ghost"
            @click="toggleExpanded"
          />
        </div>
      </div>
    </template>

    <!-- Section Content (Expanded) -->
    <div v-if="isExpanded" class="space-y-4">
      <!-- Issues Summary -->
      <div
        v-if="sectionIssues.length > 0"
        class="bg-red-50 border border-red-200 rounded-lg p-4"
      >
        <h4 class="font-medium text-red-900 mb-2">
          Issues Found ({{ sectionIssues.length }})
        </h4>
        <div class="space-y-2">
          <div
            v-for="issue in sectionIssues"
            :key="issue.fieldPath"
            class="flex items-start justify-between bg-white rounded p-3 border border-red-200"
          >
            <div>
              <div class="font-medium text-sm text-gray-900">
                {{ getFieldLabel(issue.fieldPath) }}
              </div>
              <div class="text-sm text-red-600">
                {{ issue.issueType }} - {{ issue.severity }}
              </div>
              <div v-if="issue.description" class="text-sm text-gray-600 mt-1">
                {{ issue.description }}
              </div>
            </div>
            <UButton
              color="error"
              variant="ghost"
              size="xs"
              icon="i-lucide-x"
              @click="removeIssue(issue.fieldPath)"
            />
          </div>
        </div>
      </div>

      <!-- Verifications Summary -->
      <div
        v-if="sectionVerifications.length > 0"
        class="bg-green-50 border border-green-200 rounded-lg p-4"
      >
        <h4 class="font-medium text-green-900 mb-2">
          Verified Fields ({{ sectionVerifications.length }})
        </h4>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="verification in sectionVerifications"
            :key="verification.fieldPath"
            :label="getFieldLabel(verification.fieldPath)"
            color="success"
            variant="subtle"
          />
        </div>
      </div>

      <!-- Field Actions -->
      <div
        :class="{
          'border-t border-gray-200 pt-4':
            sectionIssues.length > 0 || sectionVerifications.length > 0,
        }"
      >
        <UButtonGroup orientation="vertical">
          <UButton
            icon="i-lucide-check"
            label="驗證全部欄位"
            color="success"
            variant="outline"
            block
            @click="verifyAllFields"
          />
          <UButton
            icon="i-lucide-eye-off"
            label="跳過此區塊"
            color="warning"
            variant="outline"
            block
            @click="ignoreSection"
          />
        </UButtonGroup>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="field in section.fields"
            :key="field"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <span class="font-medium text-sm">
                {{ getFieldLabel(field) }}
              </span>
              <span
                v-if="getFieldStatus(field)"
                class="ml-2 text-xs"
                :class="getFieldStatusColor(field)"
              >
                {{ getFieldStatus(field) }}
              </span>
            </div>
            <UButtonGroup>
              <UButton
                v-if="!isFieldVerified(field)"
                icon="i-lucide-check"
                label="驗證"
                color="success"
                variant="soft"
                size="xs"
                @click="verifyField(field)"
              />
              <UButton
                icon="i-lucide-alert-triangle"
                label="標記問題"
                color="error"
                variant="soft"
                size="xs"
                @click="openIssueDialog(field)"
              />
            </UButtonGroup>
          </div>

          <!-- Quick Actions -->
        </div>
      </div>
    </div>
  </UCard>

  <!-- Issue Dialog -->
  <UModal v-model="showIssueDialog">
    <div class="p-6">
      <h3 class="text-lg font-medium mb-4">
        Flag Issue: {{ getFieldLabel(selectedField) }}
      </h3>
      <form @submit.prevent="submitIssue" class="space-y-4">
        <UFormGroup label="Issue Type">
          <USelect v-model="issueForm.issueType" :options="issueTypeOptions" />
        </UFormGroup>
        <UFormGroup label="Severity">
          <USelect v-model="issueForm.severity" :options="severityOptions" />
        </UFormGroup>
        <UFormGroup label="Description">
          <UTextarea
            v-model="issueForm.description"
            placeholder="Describe the issue..."
          />
        </UFormGroup>
        <div class="flex gap-3 pt-4">
          <UButton type="submit" color="error">Flag Issue</UButton>
          <UButton variant="outline" @click="closeIssueDialog">Cancel</UButton>
        </div>
      </form>
    </div>
  </UModal>
</template>

<script setup lang="ts">
type Props = {
  section: ReviewSection;
};
type IssueTypeOption = { label: string; value: ReviewIssueType };
type SeverityOption = { label: string; value: ReviewIssueSeverity };

const props = defineProps<Props>();
const reviewStore = useCompanyApplicationReviewStore();

// Local state
const isExpanded = ref(false);
const showIssueDialog = ref(false);
const selectedField = ref("");

// Issue form - use schema type for form validation
const issueForm = reactive<ReviewIssueSchema>({
  fieldPath: "", // Will be set when dialog opens
  issueType: "invalid",
  severity: "medium",
  description: "",
});

const issueTypeOptions: IssueTypeOption[] = [
  { label: "Missing", value: "missing" },
  { label: "Invalid", value: "invalid" },
  { label: "Needs Clarification", value: "clarification" },
  { label: "Requires Modification", value: "modification" },
];

const severityOptions: SeverityOption[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];

// Computed properties
const sectionIssues = computed(() => {
  return reviewStore.getSectionIssues(props.section.key);
});

const sectionVerifications = computed(() => {
  return reviewStore.getSectionVerifications(props.section.key);
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

const statusIcon = computed(() => {
  if (sectionIssues.value.length > 0) return "i-lucide-alert-triangle";
  if (sectionVerifications.value.length > 0) return "i-lucide-check-circle";
  return "i-lucide-circle";
});

const statusIconClass = computed(() => {
  if (sectionIssues.value.length > 0) return "text-red-500";
  if (sectionVerifications.value.length > 0) return "text-green-500";
  return "text-gray-400";
});

const sectionBorderClass = computed(() => {
  if (sectionIssues.value.length > 0) {
    const hasCritical = sectionIssues.value.some(
      (i) => i.severity === "critical"
    );
    return hasCritical ? "border-l-red-500" : "border-l-yellow-500";
  }
  if (sectionVerifications.value.length > 0) return "border-l-green-500";
  return "border-l-gray-300";
});

// Methods
const toggleExpanded = (): void => {
  isExpanded.value = !isExpanded.value;
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

  if (hasIssue) return "Has Issue";
  if (isVerified) return "Verified";
  return "";
};

const getFieldStatusColor = (field: string): string => {
  const status = getFieldStatus(field);
  if (status === "Has Issue") return "text-red-600";
  if (status === "Verified") return "text-green-600";
  return "";
};

const isFieldVerified = (field: string): boolean => {
  const fullPath = `${props.section.key}.${field}`;
  return sectionVerifications.value.some((v) => v.fieldPath === fullPath);
};

const verifyField = (field: string): void => {
  const fullPath = `${props.section.key}.${field}`;
  reviewStore.addVerification({ fieldPath: fullPath });
};

const verifyAllFields = (): void => {
  reviewStore.verifySection(props.section.key, props.section.fields);
};

const ignoreSection = (): void => {
  // TODO: Implement section ignore functionality
  console.log("Ignoring section:", props.section.key);
};

const openIssueDialog = (field: string): void => {
  selectedField.value = field;
  issueForm.fieldPath = `${props.section.key}.${field}`;
  showIssueDialog.value = true;
};

const closeIssueDialog = (): void => {
  showIssueDialog.value = false;
  selectedField.value = "";
  Object.assign(issueForm, {
    fieldPath: "",
    issueType: "invalid" as ReviewIssueType,
    severity: "medium" as ReviewIssueSeverity,
    description: "",
  });
};

const submitIssue = (): void => {
  // Form validation could be added here using the schema
  reviewStore.addIssue({
    fieldPath: issueForm.fieldPath,
    issueType: issueForm.issueType,
    severity: issueForm.severity,
    description: issueForm.description,
  });
  closeIssueDialog();
};

const removeIssue = (fieldPath: string): void => {
  reviewStore.removeIssue(fieldPath);
};
</script>
