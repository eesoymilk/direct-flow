<template>
  <span
    v-for="(child, index) in children"
    :key="index"
    :class="{
      'font-bold': child.bold,
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
  children: ParagraphText[];
}
defineProps<Props>();
</script>
