<template>
  <UCard
    class="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
  >
    <!-- Field Header -->
    <template #header>
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
    </template>

    <!-- Field Value Display -->
    <div v-if="slots.default || value" :class="displayClass">
      <slot>
        <p class="text-base text-gray-800 leading-relaxed font-medium">
          {{ value }}
        </p>
      </slot>
    </div>

    <slot name="custom-display" />

    <!-- Field Actions -->
    <template #footer>
      <div class="flex justify-end gap-2">
        <slot name="actions" />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { ClassValue } from "clsx";

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
  displayClass?: ClassValue;
}

const props = defineProps<Props>();

const slots = useSlots();

const displayClass = computed(() =>
  cn([
    "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-lg border border-blue-100 p-4",
    props.displayClass,
  ])
);
</script>
