<template>
  <UContainer class="py-8 space-y-4">
    <h1 class="text-3xl font-bold text-primary mb-6">儀表板</h1>

    <!-- Company Status Section -->
    <UCard v-if="company">
      <template #header>
        <h2 class="text-xl font-semibold">公司狀態</h2>
      </template>
      <div class="flex items-center gap-4 p-4 bg-primary-50 rounded-lg">
        <UIcon
          name="i-heroicons-building-office"
          class="text-primary text-2xl"
        />
        <div class="space-y-1">
          <h3 class="font-medium">{{ company.name }}</h3>
          <div class="text-text-secondary text-sm space-y-0.5">
            <p>統一編號：{{ company.taxId }}</p>
            <p>{{ company.organizationType }}</p>
            <p>{{ company.address }}</p>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-document-text" class="text-primary" />
            <h3 class="font-semibold">變更登記</h3>
          </div>
        </template>
        <p class="text-text-secondary mb-4">
          辦理公司資料變更、地址變更、增資減資等登記業務
        </p>
        <div class="space-y-2">
          <UButton
            color="primary"
            variant="soft"
            to="/company/modification"
            class="w-full"
          >
            一般變更登記
          </UButton>
          <UButton
            color="primary"
            variant="soft"
            to="/company/address-change/same-city"
            class="w-full"
          >
            同縣市地址變更
          </UButton>
          <UButton
            color="primary"
            variant="soft"
            to="/company/capital/reduction"
            class="w-full"
          >
            減資登記
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Recent Activities -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">最近辦理項目</h2>
      </template>
      <div class="space-y-4">
        <div class="flex items-center gap-4 p-4 bg-surface-hover rounded-lg">
          <UIcon name="i-heroicons-document-text" class="text-primary" />
          <div class="flex-1">
            <h3 class="font-medium">地址變更登記</h3>
            <p class="text-text-secondary text-sm">辦理日期：2024/03/15</p>
          </div>
          <UBadge color="success">已完成</UBadge>
        </div>
        <div class="flex items-center gap-4 p-4 bg-surface-hover rounded-lg">
          <UIcon name="i-heroicons-document-text" class="text-primary" />
          <div class="flex-1">
            <h3 class="font-medium">增資登記</h3>
            <p class="text-text-secondary text-sm">辦理日期：2024/02/20</p>
          </div>
          <UBadge color="success">已完成</UBadge>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { companies } from "@/mocks/companies";

const company = companies[0];
</script>
