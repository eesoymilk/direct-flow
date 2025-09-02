<template>
  <div class="w-full space-y-2">
    <div class="flex items-center gap-2">
      <UIcon :name="icon" class="w-4 h-4 text-gray-500" />
      <label
        class="text-sm font-semibold text-gray-700 uppercase tracking-wide"
      >
        {{ label }}
      </label>
    </div>
    <div
      :class="[
        'p-3 rounded-lg border',
        variant === 'highlighted'
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
          : 'bg-gray-50',
      ]"
    >
      <p
        :class="[
          'font-medium',
          variant === 'highlighted'
            ? 'text-2xl font-bold text-green-700'
            : 'text-gray-900',
        ]"
      >
        {{ displayValue }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  icon: string;
  value: string | number | undefined | null;
  variant?: "default" | "highlighted";
  fullWidth?: boolean;
  formatter?: (value: any) => string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  fullWidth: false,
  formatter: undefined,
});

const displayValue = computed(() => {
  if (props.value === undefined || props.value === null || props.value === "") {
    return "未填寫";
  }

  if (props.formatter) {
    return props.formatter(props.value);
  }

  return String(props.value);
});
</script>
