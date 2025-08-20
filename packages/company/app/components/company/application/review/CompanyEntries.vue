<template>
  <div v-if="loggedIn" class="flex justify-end col-span-full">
    <UButton
      color="primary"
      label="驗證所有公司資料"
      icon="i-lucide-check"
      variant="outline"
      size="sm"
      @click="verifyAllCompanyEntries"
    />
  </div>

  <CompanyApplicationReviewEntry
    v-for="entry in companyEntries"
    :key="entry.entryPath"
    :entry-path="entry.entryPath"
    :ignorable="entry.ignorable"
  >
    <FormedInputTags
      v-if="
        entry.entryPath === 'company.candidateNames' ||
        entry.entryPath === 'company.businessItems'
      "
      :initial-value="entry.initialValue as string[]"
      :placeholder="entry.placeholder"
      @submit="
        (value) => reviewStore.editEntry(entry.entryPath, value, !loggedIn)
      "
    />
    <FormedRadioGroup
      v-else-if="entry.entryPath === 'company.organizationType'"
      :initial-value="entry.initialValue as string"
      :radio-group-items="organizationTypeItems"
      @submit="
        (value) => reviewStore.editEntry(entry.entryPath, value, !loggedIn)
      "
    />
    <FormedInput
      v-else
      :disabled="!loggedIn && !entry.issue"
      :initial-value="entry.initialValue as string"
      :placeholder="entry.placeholder"
      @submit="
        (value) => reviewStore.editEntry(entry.entryPath, value, !loggedIn)
      "
    />
  </CompanyApplicationReviewEntry>
</template>

<script setup lang="ts">
import type { CompanyField } from "~/composables/stores/reviewEntry";
import { organizationTypeItems } from "../helpers";

const { loggedIn } = useUserSession();

const reviewStore = useCompanyApplicationReviewStore();

const companyFields: CompanyField[] = [
  "candidateNames",
  "chosenName",
  "organizationType",
  "address",
  "businessItemsDescription",
  "businessItems",
];

const companyEntryLabels = {
  candidateNames: "預查名稱",
  chosenName: "選定名稱",
  organizationType: "組織型態",
  address: "地址",
  businessItemsDescription: "營業項目描述",
  businessItems: "營業項目",
};

const companyEntries = computed<
  {
    entryPath: `company.${CompanyField}`;
    initialValue: string | string[];
    placeholder: string;
    ignorable?: boolean;
    issue?: ReviewIssue;
  }[]
>(() =>
  companyFields.map((field) => {
    const entry = reviewStore.getEntry(`company.${field}`);
    if (!entry) {
      throw new Error(`Entry ${`company.${field}`} not found`);
    }
    if (entry.state === "hasIssue" && entry.issue) {
      return {
        entryPath: `company.${field}`,
        initialValue: entry.value,
        placeholder: `請輸入${companyEntryLabels[field]}`,
        ignorable: field === "businessItems" || field === "chosenName",
        issue: entry.issue,
      };
    }
    return {
      entryPath: `company.${field}`,
      initialValue: entry.value,
      placeholder: `請輸入${companyEntryLabels[field]}`,
      ignorable: field === "businessItems" || field === "chosenName",
    };
  })
);

const verifyAllCompanyEntries = () => {
  companyFields.forEach((field) => {
    const fieldPath = `company.${field}` as const;
    const currentEntry = reviewStore.getEntry(fieldPath);

    if (currentEntry && currentEntry.state === "reviewing") {
      reviewStore.setEntry(fieldPath, {
        ...currentEntry,
        state: "verified",
      });
    }
  });
};
</script>
