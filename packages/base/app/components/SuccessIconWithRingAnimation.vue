<template>
  <div class="relative">
    <div
      class="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center ring-4 ring-green-50 shadow-lg"
    >
      <UIcon name="i-lucide-check-circle-2" class="w-14 h-14 text-green-600" />
    </div>
    <!-- Animated rings -->
    <div
      class="absolute inset-0 rounded-full border-4 border-green-200 animate-ping opacity-75"
    />
    <div
      class="absolute inset-2 rounded-full border-2 border-green-300 animate-pulse opacity-60"
    />
  </div>
</template>