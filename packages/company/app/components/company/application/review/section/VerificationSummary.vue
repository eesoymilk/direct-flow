<template>
  <UAlert
    v-if="verifications.length > 0"
    color="success"
    variant="soft"
    :title="`已驗證欄位 (${verifications.length})`"
    icon="i-lucide-check-circle"
  >
    <template #description>
      <div class="flex flex-wrap gap-2 mt-3">
        <UBadge
          v-for="verification in verifications"
          :key="verification.fieldPath"
          :label="getFieldLabel(verification.fieldPath)"
          color="success"
          variant="subtle"
        />
      </div>
    </template>
  </UAlert>
</template>

<script setup lang="ts">
defineProps<{ verifications: ReviewVerificationSchema[] }>();
</script>
