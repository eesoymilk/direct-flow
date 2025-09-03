<template>
  <div class="w-full flex gap-2">
    <UButton
      v-if="!isVerified"
      icon="i-lucide-check"
      label="驗證"
      color="success"
      variant="subtle"
      block
      @click="$emit('verify')"
    />
    <UButton
      icon="i-lucide-alert-triangle"
      label="標記問題"
      color="warning"
      variant="subtle"
      block
      @click="$emit('reportIssue')"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  isVerified?: boolean;
}

defineProps<Props>();

defineEmits<{
  verify: [];
  reportIssue: [];
}>();
</script>