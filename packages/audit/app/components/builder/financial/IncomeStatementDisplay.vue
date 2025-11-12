<template>
  <BuilderFinancialUnderConstruction />
</template>

<script setup lang="ts">
import type { FinancialStatementSet } from '../../../types/financial';

interface Props {
  statement: FinancialStatementSet;
}

// Props are defined but not used yet - will be used when implementation is ready
defineProps<Props>();
</script>
