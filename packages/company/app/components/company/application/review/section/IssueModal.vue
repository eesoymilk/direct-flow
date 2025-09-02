<template>
  <UModal
    v-model="open"
    :title="`標記問題：${getFieldLabel(field)}`"
    description="請選擇問題類型和嚴重程度，並提供詳細描述以協助後續處理。"
  >
    <UButton
      icon="i-lucide-alert-triangle"
      label="標記問題"
      color="error"
      variant="subtle"
      block
    />
    <template #body>
      <UForm
        ref="issueFormRef"
        :state="issueFormState"
        :schema="reviewIssueSchema"
        @submit="submitIssue"
        class="md:space-y-4 space-y-2"
      >
        <UFormField label="問題類型" name="issueType">
          <URadioGroup
            v-model="issueFormState.issueType"
            :items="issueTypeItems"
            variant="table"
            orientation="horizontal"
            placeholder="選擇問題類型"
            class="w-full"
            :ui="{ item: 'flex-1' }"
          />
        </UFormField>

        <UFormField label="嚴重程度" name="severity">
          <URadioGroup
            v-model="issueFormState.severity"
            :items="severityItems"
            variant="table"
            orientation="horizontal"
            placeholder="選擇嚴重程度"
            class="w-full"
            :ui="{ item: 'flex-1' }"
          />
        </UFormField>

        <UFormField label="問題描述" name="description">
          <UTextarea
            v-model="issueFormState.description"
            placeholder="詳細描述問題..."
            :rows="5"
            autoresize
            class="w-full"
          />
        </UFormField>
      </UForm>
    </template>
    <template #footer="{ close }">
      <div class="w-full flex justify-end gap-3">
        <UButton
          label="取消"
          icon="i-lucide-x"
          variant="ghost"
          @click="closeIssueDialog"
        />
        <UButton
          icon="i-lucide-alert-triangle"
          color="error"
          label="標記問題"
          @click="
            () => {
              issueFormRef?.submit();
              close();
            }
          "
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { RadioGroupItem } from "@nuxt/ui";

defineProps<{ field: string }>();

const reviewStore = useCompanyApplicationReviewStore();
const issueFormRef = useTemplateRef("issueFormRef");

// Local state
const open = ref(false);

// Issue form - use schema type for form validation
const issueFormState = ref<ReviewIssueSchema>({
  fieldPath: "", // Will be set when dialog opens
  issueType: "invalid",
  severity: "medium",
  description: "",
});

const issueTypeItems: RadioGroupItem[] = [
  { label: "缺少資料", id: "missing" },
  { label: "資料無效", id: "invalid" },
  { label: "需要澄清", id: "clarification" },
  { label: "需要修改", id: "modification" },
];

const severityItems: RadioGroupItem[] = [
  { label: "低", id: "low" },
  { label: "中", id: "medium" },
  { label: "高", id: "high" },
  { label: "嚴重", id: "critical" },
];

const getFieldLabel = (fieldPath: string): string => {
  return useFieldLabel(fieldPath);
};

const closeIssueDialog = () => {
  open.value = false;
  Object.assign(issueFormState.value, {
    fieldPath: "",
    issueType: "invalid" as ReviewIssueType,
    severity: "medium" as ReviewIssueSeverity,
    description: "",
  });
};

const submitIssue = () => {
  // Form validation could be added here using the schema
  reviewStore.addIssue({
    fieldPath: issueFormState.value.fieldPath,
    issueType: issueFormState.value.issueType,
    severity: issueFormState.value.severity,
    description: issueFormState.value.description,
  });
  closeIssueDialog();
};
</script>
