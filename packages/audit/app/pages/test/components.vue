<template>
  <UContainer class="py-8">
    <div class="space-y-8">
      <h1 class="text-3xl font-bold">Shared Components Test</h1>
      
      <!-- Test InfoDisplay -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">InfoDisplay Component</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoDisplay 
            label="Company Name" 
            icon="i-lucide-building-2"
            value="台積電股份有限公司"
          />
          <InfoDisplay 
            label="Revenue" 
            icon="i-lucide-dollar-sign"
            value="1000000"
            variant="highlighted"
            :formatter="formatCurrency"
          />
        </div>
      </div>

      <!-- Test DatePicker -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">DatePicker Component</h2>
        <div class="max-w-md">
          <DatePicker 
            :value="selectedDate" 
            @selectDate="selectedDate = $event"
          />
          <p class="mt-2 text-sm text-gray-600">Selected: {{ selectedDate?.toLocaleDateString() }}</p>
        </div>
      </div>

      <!-- Test SuccessIconWithRingAnimation -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Success Animation</h2>
        <SuccessIconWithRingAnimation />
      </div>

      <!-- Test Formed Input -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Formed Input</h2>
        <div class="max-w-md">
          <FormedInput 
            placeholder="Enter audit note..."
            initial-value="Initial audit note"
            @submit="handleSubmit"
          />
        </div>
      </div>

      <!-- Test utilities -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Utility Functions</h2>
        <div class="space-y-2">
          <p>formatNumber(123456): {{ formatNumber(123456) }}</p>
          <p>formatCurrency(1500000): {{ formatCurrency(1500000) }}</p>
          <p>formatPercentage(85.67): {{ formatPercentage(85.67) }}</p>
          <p>formatDate(new Date()): {{ formatDate(new Date()) }}</p>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { formatNumber, formatCurrency, formatPercentage, formatDate } from "~/utils/formatting";

useSeoMeta({
  title: "Component Test - Audit App"
});

const selectedDate = ref(new Date());

const handleSubmit = (value: string) => {
  console.log("Submitted:", value);
};
</script>