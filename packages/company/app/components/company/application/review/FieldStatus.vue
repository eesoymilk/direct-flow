<template>
  <div v-if="issue || isFieldVerified" class="mt-2">
    <!-- Issue Display -->
    <UAlert
      v-if="issue"
      icon="i-lucide-alert-triangle"
      :color="getSeverityColor(issue.severity)"
      variant="soft"
      :title="`${getSeverityLabel(issue.severity)}問題`"
      :description="issue.description || getIssueTypeLabel(issue.issueType)"
    >
      <template #actions>
        <UButton
          v-if="loggedIn"
          size="xs"
          color="red"
          variant="outline"
          @click="editIssue"
        >
          編輯
        </UButton>
      </template>
    </UAlert>

    <!-- Verification Display -->
    <UAlert
      v-else-if="isFieldVerified"
      icon="i-lucide-check-circle"
      color="success"
      variant="soft"
      title="已驗證"
      description="此欄位已通過審核"
    />
  </div>

  <!-- Quick Actions for Staff -->
  <div v-else-if="loggedIn" class="mt-2 flex gap-2">
    <UButton
      size="xs"
      color="green"
      variant="outline"
      icon="i-lucide-check"
      @click="verifyField"
    >
      驗證
    </UButton>
    <UButton
      size="xs"
      color="red"
      variant="outline"
      icon="i-lucide-alert-triangle"
      @click="flagIssue"
    >
      標記問題
    </UButton>
  </div>
</template>

<script setup lang="ts">
import {
  getSeverityColor,
  getSeverityLabel,
  getIssueTypeLabel,
} from "~/utils/labels";

interface Props {
  fieldPath: string;
  application?: any; // TODO: Add proper typing
}

const props = defineProps<Props>();
const { loggedIn } = useUserSession();

// Use review overlay to get field status - only if application is provided
const reviewOverlayData = props.application
  ? useReviewOverlay(props.application)
  : null;
const issue = computed(() => reviewOverlayData?.getIssue(props.fieldPath));
const isFieldVerified = computed(
  () => reviewOverlayData?.isVerified(props.fieldPath) || false
);

const verifyField = () => {
  // TODO: Implement field verification
  console.log(`Verifying field: ${props.fieldPath}`);
};

const flagIssue = () => {
  // TODO: Open issue modal
  console.log(`Flagging issue for field: ${props.fieldPath}`);
};

const editIssue = () => {
  // TODO: Open issue edit modal
  console.log(`Editing issue for field: ${props.fieldPath}`);
};
</script>
