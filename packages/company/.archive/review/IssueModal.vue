<template>
  <UModal :title="title" :description="description">
    <slot />
    <template #body>
      <UForm
        ref="issueFormRef"
        :state="issueFormState"
        :schema="reviewIssueSchema.omit({ fieldPath: true })"
        class="md:space-y-4 space-y-2"
        @submit="handleSubmit"
        @error="handleError"
      >
        <UFormField label="問題類型" name="issueType">
          <URadioGroup
            v-model="issueFormState.issueType"
            :items="issueTypeItems"
            value-key="id"
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
            value-key="id"
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
          @click="handleCancel(close)"
        />
        <UButton
          icon="i-lucide-alert-triangle"
          color="error"
          label="標記問題"
          @click="handleSubmitIssue(close)"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent, RadioGroupItem } from "@nuxt/ui";

const issueTypeItems: RadioGroupItem[] = [
  { label: "缺少資料", id: "missing" },
  { label: "資料無效", id: "invalid" },
  { label: "需要澄清", id: "clarification" },
  { label: "需要修改", id: "modification" },
] as const;

const severityItems: RadioGroupItem[] = [
  { label: "低", id: "low" },
  { label: "中", id: "medium" },
  { label: "高", id: "high" },
  { label: "嚴重", id: "critical" },
] as const;

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    fieldPath: string;
  }>(),
  {
    title: "標記問題",
    description: "請選擇問題類型和嚴重程度，並提供詳細描述以協助後續處理。",
  }
);

const emit = defineEmits<{
  submit: [issue: ReviewIssueSchema];
}>();

const issueFormRef = useTemplateRef("issueFormRef");

const issueFormState = ref<Partial<Omit<ReviewIssueSchema, "fieldPath">>>({});

const resetForm = () => {
  issueFormState.value = {};
};

const handleCancel = (close: () => void) => {
  resetForm();
  close();
};

const handleSubmitIssue = (close: () => void) => {
  try {
    if (!issueFormRef.value) throw new Error("Issue form ref not found");
    issueFormRef.value.submit();
    close();
  } catch (error) {
    console.error("Form validation failed:", error);
  }
};

const handleSubmit = (
  event: FormSubmitEvent<Omit<ReviewIssueSchema, "fieldPath">>
) => {
  console.log("Modal handleSubmit called", issueFormState.value);
  emit("submit", {
    ...event.data,
    fieldPath: props.fieldPath,
  });
  resetForm();
};

const handleError = (event: FormErrorEvent) => {
  console.error("Form validation failed:", event.errors);
};
</script>
