<template>
  <UCard
    v-if="shareholders && shareholders.length > 0"
    class="ring-1 ring-gray-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-users" class="w-6 h-6 text-orange-600" />
          <div>
            <h3 class="text-xl font-bold text-gray-900">股東資料</h3>
            <p class="text-sm text-gray-500">
              共 {{ shareholders.length }} 位股東
            </p>
          </div>
        </div>
        <UBadge
          :label="`${shareholders.length} 人`"
          variant="subtle"
          size="lg"
        />
      </div>
    </template>

    <div class="space-y-6">
      <ShareholderCard
        v-for="(shareholder, index) in shareholders"
        :key="index"
        :shareholder="shareholder"
        :index="index"
        :is-stock-company="isCorporation"
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import ShareholderCard from "./ShareholderCard.vue";

interface Props {
  shareholders: ShareholderSchema[];
  isCorporation: boolean;
}

defineProps<Props>();
</script>
