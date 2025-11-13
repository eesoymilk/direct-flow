<template>
  <UCard :class="['border-2', `border-${color}-200`, `bg-${color}-50/50`]">
    <div class="text-center">
      <UIcon
        :name="icon"
        :class="['w-8 h-8 mx-auto mb-2', `text-${color}-600`]"
      />
      <p :class="['text-sm font-medium', `text-${color}-700`]">
        {{ label }}
      </p>
      <p :class="['text-xl font-bold', `text-${color}-900`]">
        {{ displayValue }}
      </p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  icon: string;
  shares: number | undefined | null;
  color: "blue" | "green" | "purple";
  suffix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  suffix: "股",
});

const displayValue = computed(() => {
  const shares = props.shares || 0;
  return `${formatInteger(shares)} ${props.suffix}`;
});
</script>
