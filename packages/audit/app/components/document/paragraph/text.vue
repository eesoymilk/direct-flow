<template>
  <span v-if="listItemIndex > 0"> {{ listItemIndex }}. </span>
  <span
    v-for="(child, index) in children"
    :key="index"
    :class="{
      'font-bold': child.bold,
      'text-blue-500': child.color === 'blue',
      'text-blue-800': child.color === 'dark-blue',
      'text-red-500': child.color === 'red',
      italic: child.italic,
      underline: child.underline,
      strike: child.strike,
      doubleStrike: child.doubleStrike,
    }"
  >
    {{ child.text }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  listItemIndex: number;
  children: ParagraphText[];
}
defineProps<Props>();
</script>
