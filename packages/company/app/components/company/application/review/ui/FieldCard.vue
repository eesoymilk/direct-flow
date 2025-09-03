<template>
  <UCard
    class="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
  >
    <!-- Field Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <div class="flex items-center gap-3">
          <h4 class="text-lg font-semibold text-gray-900">{{ label }}</h4>
          <UBadge
            v-if="statusLabel"
            :label="statusLabel"
            :color="statusBadgeColor"
            variant="subtle"
            class="text-xs font-medium"
          />
        </div>
      </div>
    </div>

    <!-- Field Value Display -->
    <div
      class="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-lg border border-blue-100 p-4 mb-4"
    >
      <slot>
        <p class="text-base text-gray-800 leading-relaxed font-medium">
          {{ value }}
        </p>
      </slot>
    </div>

    <!-- Field Actions -->
    <div class="flex justify-end gap-2 pt-2 border-t border-gray-100">
      <slot name="actions" />
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  value?: string;
  statusLabel?: string;
  statusBadgeColor?:
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "error"
    | "neutral";
}

defineProps<Props>();
</script>
