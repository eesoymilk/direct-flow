<template>
  <UCard
    class="bg-white rounded-2xl border-l-4 shadow-lg hover:shadow-xl transition-all duration-300"
    :class="sectionBorderClass"
  >
    <!-- Section Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <UIcon :name="statusIcon" :class="statusIconClass" class="w-6 h-6" />
        <div>
          <h3 class="text-xl font-bold text-gray-900 mb-1">
            {{ title }}
          </h3>
          <p class="text-sm text-gray-600 leading-relaxed">
            {{ description }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <UBadge
          :label="statusLabel"
          :color="statusBadgeColor"
          variant="subtle"
          class="px-3 py-1 text-xs font-semibold"
        />
        <slot name="header-actions" />
        <UButton
          :icon="isOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
          variant="ghost"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          @click="$emit('toggle')"
        />
      </div>
    </div>

    <UCollapsible :open="isOpen" class="w-full">
      <template #content>
        <div class="space-y-4 pt-4 md:space-y-6 md:pt-6">
          <slot />
        </div>
      </template>
    </UCollapsible>
  </UCard>
</template>

<script setup lang="ts">
import type { ClassValue } from "clsx";

interface Props {
  title: string;
  description: string;
  isOpen: boolean;
  sectionBorderClass: ClassValue;
  statusIcon: string;
  statusIconClass: ClassValue;
  statusLabel: string;
  statusBadgeColor:
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "error"
    | "neutral";
}

defineProps<Props>();
defineEmits<{
  toggle: [];
}>();
</script>
