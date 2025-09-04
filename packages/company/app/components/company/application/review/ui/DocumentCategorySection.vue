<template>
  <section class="space-y-4">
    <div class="border-b border-gray-200 pb-2">
      <h4 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <UIcon :name="icon" :class="iconClass" class="size-5" />
        {{ title }}
      </h4>
      <p class="text-sm text-gray-600 mt-1">{{ description }}</p>
    </div>

    <slot />
  </section>
</template>

<script setup lang="ts">
import type { ClassValue } from "clsx";

interface Props {
  title: string;
  description: string;
  icon: string;
  iconClass?: ClassValue;
}

defineProps<Props>();
</script>
