<template>
  <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
    <!-- Main Review Content (3 columns) -->
    <div class="xl:col-span-2 space-y-6">
      <slot name="content" />
    </div>

    <!-- Sidebar (1 column) -->
    <div class="space-y-6">
      <slot name="sidebar" />
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed - layout component only provides structure
</script>
