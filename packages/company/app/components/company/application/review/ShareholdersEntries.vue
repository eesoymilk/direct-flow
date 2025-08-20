<template>
  <div class="flex justify-end col-span-full">
    <UButton
      icon="i-lucide-check"
      label="驗證所有股東資料"
      color="success"
      variant="outline"
      size="sm"
      @click="verifyAllShareholdersEntries"
    />
  </div>
  <div class="space-y-4 md:space-y-6">
    <div
      v-if="reviewStore.reviewEntries.shareholders.length === 0"
      class="text-center py-8"
    >
      <UIcon
        name="i-lucide-users"
        class="w-12 h-12 text-gray-300 mx-auto mb-4"
      />
      <p class="text-gray-500">此申請沒有股東資料</p>
    </div>

    <UCard
      v-else
      v-for="(shareholder, index) in reviewStore.reviewEntries.shareholders"
      variant="outline"
      :key="`shareholder-${index}`"
    >
      <!-- Shareholder Header -->
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-semibold text-gray-900">股東 {{ index + 1 }}</h3>
            <p class="text-sm text-gray-500">
              {{ shareholder.name.value }}
            </p>
          </div>
          <div>
            <UButton
              icon="i-lucide-check"
              :label="`驗證股東${index + 1}資料`"
              color="success"
              variant="outline"
              size="sm"
              @click="verifyShareholderEntries(index)"
            />
          </div>
        </div>
      </template>

      <!-- Shareholder Fields -->
      <div class="grid gap-4 md:grid-cols-2">
        <CompanyApplicationReviewEntry
          v-for="entry in getShareholderEntryPaths(index)"
          :key="entry.entryPath"
          :entry-path="entry.entryPath"
        >
          <FormedInput
            :initial-value="
              reviewStore.getEntry(entry.entryPath)?.value as string
            "
            :placeholder="entry.placeholder"
            @submit="(value) => reviewStore.editEntry(entry.entryPath, value)"
          />
        </CompanyApplicationReviewEntry>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { ShareholderField } from "~/composables/stores/reviewEntry";

type ShareholderEntryPath = {
  entryPath: ShareholderField;
  placeholder: string;
};

const reviewStore = useCompanyApplicationReviewStore();

const getShareholderEntryPaths = (index: number): ShareholderEntryPath[] => [
  {
    entryPath: `shareholders.${index}.name`,
    placeholder: `請輸入股東${index + 1}姓名`,
  },
  {
    entryPath: `shareholders.${index}.idNumber`,
    placeholder: `請輸入股東${index + 1}身分證號碼`,
  },
  {
    entryPath: `shareholders.${index}.address`,
    placeholder: `請輸入股東${index + 1}地址`,
  },
  {
    entryPath: `shareholders.${index}.telephone`,
    placeholder: `請輸入股東${index + 1}電話`,
  },
  {
    entryPath: `shareholders.${index}.cellphone`,
    placeholder: `請輸入股東${index + 1}手機`,
  },
  {
    entryPath: `shareholders.${index}.email`,
    placeholder: `請輸入股東${index + 1}電子郵件`,
  },
];

const verifyShareholderEntries = (index: number) => {
  getShareholderEntryPaths(index).forEach((entry) => {
    const currentEntry = reviewStore.getEntry(entry.entryPath);
    if (currentEntry && currentEntry.state === "reviewing") {
      reviewStore.setEntry(entry.entryPath, {
        ...currentEntry,
        state: "verified",
      });
    }
  });
};

const verifyAllShareholdersEntries = () => {
  reviewStore.reviewEntries.shareholders.forEach((shareholder, index) => {
    verifyShareholderEntries(index);
  });
};
</script>
