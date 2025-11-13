<template>
  <DatePicker
    :model-value="modelValue"
    @update:model-value="handleDateChange"
    :placeholder="placeholder"
    date-format="yy/mm/dd"
    v-bind="$attrs"
    :pt="pt"
  >
    <!-- Forward all slots to DatePicker -->
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}" />
    </template>
  </DatePicker>
</template>

<script setup lang="ts">
import type { DatePickerPassThroughOptions } from "primevue/datepicker";

interface Props {
  modelValue?: Date | null;
  placeholder?: string;
  pt?: DatePickerPassThroughOptions;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: "選擇日期",
});

const emit = defineEmits<{
  "update:modelValue": [value: Date | null];
}>();

/**
 * Handle date change from PrimeVue DatePicker
 * Normalizes the various possible types to Date | null
 */
const handleDateChange = (
  value: Date | Date[] | (Date | null)[] | null | undefined
) => {
  // Handle single date selection (our use case)
  if (value instanceof Date) {
    emit("update:modelValue", value);
  } else if (value === null || value === undefined) {
    emit("update:modelValue", null);
  }
  // Ignore array values since we only support single date selection
};
</script>

<script lang="ts">
/**
 * RocDatePicker - PrimeVue DatePicker wrapper with Taiwan locale
 *
 * This component wraps PrimeVue's DatePicker with Taiwan (zh-TW) formatting.
 * It supports all DatePicker features including:
 *
 * - All DatePicker props (passed via v-bind="$attrs")
 * - All DatePicker slots (header, footer, date, etc.)
 * - Passthrough (pt) for deep customization of internal elements
 *
 * Note: ROC calendar support is available in the useRocDate composable
 * but not currently implemented in this component.
 *
 * @example
 * <RocDatePicker v-model="date" placeholder="選擇日期" show-icon />
 *
 * @example With passthrough customization
 * <RocDatePicker
 *   v-model="date"
 *   :pt="{ root: { class: 'custom-class' }, input: { class: 'custom-input' } }"
 * />
 */
export default {
  name: "RocDatePicker",
  inheritAttrs: false,
};
</script>
