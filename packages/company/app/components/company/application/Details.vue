<template>
  <UTabs :items="tabItems" :unmount-on-hide="false" variant="link">
    <template #company-details>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CompanyApplicationReviewCompanyEntries />
      </div>
    </template>

    <template #responsible-person>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CompanyApplicationReviewPersonEntries
          person-type="responsiblePerson"
        />
      </div>
    </template>

    <template #contact-person>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CompanyApplicationReviewPersonEntries person-type="contactPerson" />
      </div>
    </template>

    <template #representative>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CompanyApplicationReviewPersonEntries person-type="representative" />
      </div>
    </template>

    <template #shareholders>
      <div class="space-y-4 md:space-y-6">
        <CompanyApplicationReviewShareholdersEntries />
      </div>
    </template>
  </UTabs>
</template>

<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

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
    label: "代表人資料",
    icon: "i-lucide-user",
    slot: "representative",
  },
  {
    label: "股東資料",
    icon: "i-lucide-users",
    slot: "shareholders",
  },
] satisfies TabsItem[]);
</script>
