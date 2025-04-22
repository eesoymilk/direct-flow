<template>
  <div class="py-4 border-t border-border">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div
          class="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
          :class="
            isClient
              ? 'bg-blue-100 text-blue-800'
              : 'bg-purple-100 text-purple-800'
          "
        >
          <UIcon
            :name="isClient ? 'i-heroicons-user' : 'i-heroicons-briefcase'"
            class="h-3 w-3"
          />
          <span>{{ isClient ? "Client" : "CPA" }}</span>
        </div>
        <span class="text-sm text-text-secondary">View</span>
      </div>
      <USwitch
        v-model="isClient"
        :on-value="true"
        :off-value="false"
        @update:model-value="toggleRole"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserRole } from "~/composables/useUserRole";

const { isClient, toggleRole } = useUserRole();
</script>
