<template>
  <div class="space-y-1">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="grid grid-cols-12 gap-4 py-2 hover:bg-gray-50 transition-colors"
      :class="[
        item.isSubtotal || item.isTotal
          ? 'font-semibold border-t border-b border-gray-300 bg-gray-100'
          : '',
        item.indentLevel === 0 ? 'text-base' : 'text-sm',
        item.isTotal ? 'font-bold' : '',
      ]"
    >
      <!-- Line Name with Indentation -->
      <div
        class="col-span-7 flex items-center"
        :style="{ paddingLeft: `${item.indentLevel * 1.5}rem` }"
      >
        <span class="text-gray-700">{{ item.name }}</span>
        <span v-if="item.code" class="ml-2 text-xs text-gray-400">
          ({{ item.code }})
        </span>
      </div>

      <!-- Amount (Current Year) -->
      <div class="col-span-3 text-right font-mono">
        <span :class="item.amount < 0 ? 'text-error-600' : 'text-gray-900'">
          {{ formatAmount(item.amount) }}
        </span>
      </div>

      <!-- Empty column (no percentages in BS) -->
      <div class="col-span-2"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GeneratedBSLineItem } from "../../../types/financial";

interface Props {
  items: GeneratedBSLineItem[];
}

defineProps<Props>();

// Formatters
const formatAmount = (amount: number): string => {
  if (amount === 0) return "-";

  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat("zh-TW", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absAmount);

  return amount < 0 ? `(${formatted})` : formatted;
};

const formatPercentage = (percentage: number): string => {
  if (percentage === 0) return "-";

  return (
    new Intl.NumberFormat("zh-TW", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(percentage) + "%"
  );
};
</script>
