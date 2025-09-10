<template>
  <UButton
    v-if="!isEditing"
    variant="ghost"
    icon="i-lucide-pencil"
    :color="isEditing ? 'success' : 'primary'"
    @click="emit('edit')"
  />
  <div
    v-else
    class="flex items-center gap-1"
    :class="orientation === 'horizontal' ? 'flex-row' : 'flex-col'"
  >
    <UButton
      variant="ghost"
      icon="i-lucide-x"
      color="secondary"
      @click="emit('cancel')"
    />
    <UButton
      type="submit"
      variant="ghost"
      icon="i-lucide-check"
      color="success"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    orientation?: "horizontal" | "vertical";
    isEditing: boolean;
  }>(),
  {
    orientation: "horizontal",
  }
);

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "cancel"): void;
}>();
</script>
