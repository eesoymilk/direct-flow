<template>
  <UModal
    :title="title"
    :description="description"
    @update:open="handleOpenModal"
  >
    <slot />
    <template #body>
      <UForm
        ref="issueFormRef"
        :schema="reviewIssueSchema"
        :state="formState"
        @submit="(e) => $emit('submit', e.data)"
        class="md:space-y-4 space-y-2"
      >
        <UFormField label="問題類型" name="issueType">
          <URadioGroup
            v-model="formState.issueType"
            :items="reviewIssueTypeItems"
            value-key="id"
            variant="table"
            orientation="horizontal"
            class="w-full"
          />
        </UFormField>
        <UFormField label="問題嚴重性" name="severity">
          <URadioGroup
            v-model="formState.severity"
            :items="reviewIssueSeverityItems"
            value-key="id"
            variant="table"
            orientation="horizontal"
            class="w-full"
          />
        </UFormField>
        <UFormField label="問題描述" name="description">
          <UTextarea
            v-model="formState.description"
            placeholder="請輸入問題描述 (選填)"
            class="w-full"
            autoresize
            :rows="5"
          />
        </UFormField>
      </UForm>
    </template>
    <template #footer="{ close }">
      <UButton
        v-if="reviewEntry?.state === 'hasIssue'"
        icon="i-lucide-trash"
        label="刪除問題"
        color="error"
        class="mr-auto"
        @click="
          () => {
            $emit('delete');
            close();
          }
        "
      />
      <UButton
        label="確認"
        icon="i-lucide-check"
        class="ml-auto"
        @click="
          () => {
            issueFormRef?.submit();
            close();
          }
        "
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { RadioGroupItem } from "@nuxt/ui";
import type { ReviewEntryPath } from "~/composables/stores/reviewEntry";

const reviewIssueTypeItems = [
  { label: "缺失", id: "missing" },
  { label: "無效", id: "invalid" },
  { label: "需要澄清", id: "clarification" },
] satisfies RadioGroupItem[];

const reviewIssueSeverityItems: RadioGroupItem[] = [
  { label: "低", id: "low" },
  { label: "中", id: "medium" },
  { label: "高", id: "high" },
  { label: "嚴重", id: "critical" },
];

const props = defineProps<{
  reviewPath: ReviewEntryPath;
}>();

defineEmits<{
  (e: "submit", event: ReviewIssue): void;
  (e: "delete"): void;
}>();

const reviewStore = useCompanyApplicationReviewStore();
const reviewEntry = computed(() =>
  reviewStore.getEntryByPath(props.reviewPath)
);

const issueFormRef = useTemplateRef("issueFormRef");
const formState = ref<Partial<ReviewIssue>>({});

const title = computed(() => {
  if (reviewEntry.value?.state === "hasIssue") {
    return "編輯問題";
  }
  return "新增問題";
});

const description = computed(() => {
  if (reviewEntry.value?.state === "hasIssue") {
    return "請修改問題描述";
  }
  return "請新增問題描述";
});

const handleOpenModal = (value: boolean) => {
  formState.value = {};

  if (value && reviewEntry.value?.state === "hasIssue") {
    formState.value = {
      issueType: reviewEntry.value.issue.issueType,
      severity: reviewEntry.value.issue.severity,
      description: reviewEntry.value.issue.description,
    };
  }
};
</script>
