<template>
  <UDropdownMenu :items="debugMenuItems" :popper="{ placement: 'bottom-end' }">
    <UButton
      color="neutral"
      variant="ghost"
      class="flex items-center gap-2 rounded-full"
      icon="i-heroicons-bug-ant"
    />
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { useUserRole } from "~/composables/useUserRole";

const { isClient, toggleRole } = useUserRole();

const debugMenuItems = computed<DropdownMenuItem[]>(() => [
  {
    label: "Client View",
    icon: "i-heroicons-eye",
    type: "checkbox" as const,
    checked: isClient.value,
    onUpdateChecked: toggleRole,
    onSelect: (e: Event) => e.preventDefault(),
  },
]);
</script>
