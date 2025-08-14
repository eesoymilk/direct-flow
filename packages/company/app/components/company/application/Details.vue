<template>
  <div class="space-y-6">
    <UTabs :items="tabItems" :unmount-on-hide="false" variant="link">
      <template #company-details>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Company Address -->
          <CompanyApplicationReviewEntry entry-path="candidateNames">
            <FormedInputTags
              :initial-value="reviewStore.getEntryValue('candidateNames')"
              placeholder="請輸入公司預查名稱"
              @submit="(value) => handleEntryEdit('candidateNames', value)"
            />
          </CompanyApplicationReviewEntry>

          <!-- Organization Type -->
          <CompanyApplicationReviewEntry entry-path="organizationType">
            <FormedRadioGroup
              :initial-value="reviewStore.getEntryValue('organizationType')"
              :radio-group-items="organizationTypeItems"
              @submit="(value) => handleEntryEdit('organizationType', value)"
            />
          </CompanyApplicationReviewEntry>

          <!-- Business Items Description -->
          <CompanyApplicationReviewEntry entry-path="businessItemsDescription">
            <FormedInput
              :initial-value="
                reviewStore.getEntryValue('businessItemsDescription')
              "
              placeholder="請輸入營業項目描述"
              @submit="
                (value) => handleEntryEdit('businessItemsDescription', value)
              "
            />
          </CompanyApplicationReviewEntry>

          <!-- Business Items -->
          <CompanyApplicationReviewEntry entry-path="businessItems">
            <FormedInputTags
              :initial-value="reviewStore.getEntryValue('businessItems')"
              placeholder="請輸入營業項目"
              @submit="(value) => handleEntryEdit('businessItems', value)"
            />
          </CompanyApplicationReviewEntry>

          <!-- Company Address -->
          <CompanyApplicationReviewEntry entry-path="address">
            <FormedInput
              :initial-value="reviewStore.getEntryValue('address')"
              placeholder="請輸入公司地址"
              @submit="(value) => handleEntryEdit('address', value)"
            />
          </CompanyApplicationReviewEntry>
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import { organizationTypeItems } from "./helpers";

const reviewStore = useCompanyApplicationReviewStore();

// TODO: use ui.trigger to style the tab items
const tabItems = ref([
  {
    label: "公司基本資料",
    icon: "i-lucide-building",
    slot: "company-details",
  },
  {
    label: "負責人資料",
    icon: "i-lucide-user",
    slot: "responsible-person",
  },
  {
    label: "聯絡人資料",
    icon: "i-lucide-user",
    slot: "contact-person",
  },
  {
    label: "董事資料",
    icon: "i-lucide-user",
    slot: "director",
  },
  {
    label: "股東資料",
    icon: "i-lucide-users",
    slot: "shareholders",
  },
] satisfies TabsItem[]);

const handleEntryEdit = (
  fieldPath: CompanyApplicationReviewEntryPath,
  value: string | string[]
) => {
  // 1. Add a modification issue to the entry
  reviewStore.setEntryState(fieldPath, "hasIssue", {
    issueType: "modification",
    severity: "medium",
    description: "本資料已被審查人員修改，請確認後再送出",
  });

  // 2. Update the entry value in the review store
  reviewStore.setEntryValue(fieldPath, value);
};
</script>
