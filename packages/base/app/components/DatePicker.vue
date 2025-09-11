<template>
  <UPopover>
    <UButton
      :label="buttonLabel"
      block
      color="neutral"
      variant="subtle"
      icon="i-lucide-calendar"
      class="bg-white"
    />

    <template #content>
      <UCalendar
        v-model="modelValue"
        @update:model-value="
          () => $emit('selectDate', modelValue.toDate(getLocalTimeZone()))
        "
      />
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";

interface DatePickerProps {
  value: Date;
  emptyLabel?: string;
}

const props = withDefaults(defineProps<DatePickerProps>(), {
  emptyLabel: "請選擇日期",
});

defineEmits<{ selectDate: [date: Date] }>();

const df = new DateFormatter("zh-TW", {
  dateStyle: "long",
});

const modelValue = shallowRef(new CalendarDate(2000, 10, 7));

const buttonLabel = computed(() =>
  props.value ? df.format(props.value) : props.emptyLabel
);

watch(
  () => props.value,
  (newVal) => {
    modelValue.value = new CalendarDate(
      newVal.getFullYear(),
      newVal.getMonth() + 1,
      newVal.getDate()
    );
  },
  { immediate: true }
);
</script>
