<template>
  <div class="text-sm space-y-2 sm:space-y-3">
    <div class="font-medium text-neutral-500 flex gap-1 items-center">
      <span>{{ label }}</span>
      <UButtonGroup v-if="reviewMode" class="ml-auto">
        <UButton
          label="新增問題"
          variant="subtle"
          size="sm"
          icon="pajamas-issue-new"
          color="warning"
          @click="() => $emit('addIssue')"
        />
        <UButton
          icon="i-lucide-check"
          variant="outline"
          size="sm"
          color="success"
          @click="() => $emit('verify')"
        />
      </UButtonGroup>
    </div>
    <slot />
    <UCard
      v-if="error"
      class="text-red-600 text-xs bg-red-50"
      :ui="{ body: 'sm:p-4 p-2' }"
    >
      <div class="flex items-center gap-1">
        <UIcon name="i-lucide-alert-triangle" size="16" />
        <span>{{ error }}</span>
      </div>
    </UCard>
    <USeparator class="sm:-mt-1" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  status: string;
  error?: string;
  reviewMode: boolean;
}>();

defineEmits<{
  (e: "addIssue"): void;
  (e: "verify"): void;
}>();
</script>
