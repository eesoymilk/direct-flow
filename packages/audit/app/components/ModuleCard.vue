<template>
  <div 
    class="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all group"
    @click="$emit('add', { title, description, icon, color })"
  >
    <div class="flex items-start gap-3">
      <div :class="`p-2 rounded-lg bg-${color}-100 group-hover:bg-${color}-200 transition-colors`">
        <UIcon :name="icon" :class="`h-4 w-4 text-${color}-600`" />
      </div>
      <div class="flex-1 min-w-0">
        <h4 class="font-medium text-gray-900 text-sm group-hover:text-gray-700">{{ title }}</h4>
        <p class="text-xs text-gray-600 mt-1 leading-tight">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  icon: string;
  color: string;
}

defineProps<Props>();
defineEmits<{
  add: [module: { title: string; description: string; icon: string; color: string }];
}>();
</script>