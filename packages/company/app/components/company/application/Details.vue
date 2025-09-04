<template>
  <UTabs :items="tabItems" :unmount-on-hide="false" variant="link">
    <template #company-details>
      <div class="space-y-6">
        <CompanyApplicationReviewCompanyBasicInfoSection />
        <CompanyApplicationReviewCompanyBusinessItemsSection />
        <CompanyApplicationReviewCompanyMonetaryInfoSection />
      </div>
    </template>

    <template #responsible-person>
      <div class="space-y-6">
        <CompanyApplicationReviewPersonSection
          person-type="responsiblePerson"
        />
      </div>
    </template>

    <template #contact-person>
      <div class="space-y-6">
        <CompanyApplicationReviewPersonSection person-type="contactPerson" />
      </div>
    </template>

    <template #representative>
      <div class="space-y-6">
        <CompanyApplicationReviewPersonSection person-type="representative" />
      </div>
    </template>

    <template #shareholders>
      <div class="space-y-6">
        <CompanyApplicationReviewShareholdersSection />
      </div>
    </template>
  </UTabs>
</template>

<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

interface Props {
  application: any; // TODO: Add proper typing
}

defineProps<Props>();

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
