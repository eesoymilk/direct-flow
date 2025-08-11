<template>
  <UPopover
    arrow
    :open="isPanelOpen"
    @update:open="isPanelOpen = $event"
    class="fixed bottom-4 right-4 z-50"
  >
    <UButton
      color="neutral"
      variant="solid"
      size="sm"
      icon="i-heroicons-bug-ant"
      class="rounded-full shadow-lg"
    />

    <template #content>
      <div class="p-4 space-y-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-bug-ant" class="w-5 h-5 text-orange-600" />
            <h3 class="font-semibold text-orange-800">Debug Mode</h3>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            icon="i-heroicons-x-mark"
            @click="isPanelOpen = false"
          />
        </div>

        <!-- Role Selection Switch -->
        <UButtonGroup>
          <UButton
            label="Staff"
            :variant="isStaff ? 'solid' : 'outline'"
            icon="i-heroicons-briefcase"
            class="w-24"
            @click="toggleRole('staff')"
          />
          <UButton
            label="Client"
            :variant="isClient ? 'solid' : 'outline'"
            icon="i-heroicons-user"
            class="w-24"
            @click="toggleRole('client')"
          />
        </UButtonGroup>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
const { isStaff, isClient, toggleRole } = useUserRole();
const isPanelOpen = ref(false);
defineShortcuts({
  o: () => (isPanelOpen.value = !isPanelOpen.value),
});
</script>
