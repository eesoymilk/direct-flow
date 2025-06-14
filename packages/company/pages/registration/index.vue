<template>
  <UContainer class="py-8 space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-primary mb-2">公司設立登記</h1>
      <p class="text-text-secondary">請填寫以下資料以完成公司設立登記</p>
    </div>

    <UStepper
      v-model="registrationStore.currentStep"
      :items="stepperItems"
      class="w-full"
    >
      <template #basic-info>
        <CompanyRegisterationBasicInfoForm />
      </template>
      <template #responsible-person-and-director>
        <CompanyRegisterationResponsiblePersonAndDirectorForm />
      </template>
      <!-- <template #shareholders>
        <CompanyRegisterationShareholdersForm />
      </template>
      <template #required-documents>
        <CompanyRegisterationRequiredDocumentsForm />
      </template> -->
    </UStepper>
  </UContainer>
</template>

<script setup lang="ts">
import type { StepperItem } from "@nuxt/ui";

const stepperItems: StepperItem[] = [
  {
    slot: "basic-info",
    title: "公司基本資料",
    description: "請填寫公司基本資料",
    icon: "i-lucide-house",
  },
  {
    slot: "responsible-person-and-director",
    title: "負責人與董事資料",
    description: "請填寫負責人與董事資料",
    icon: "i-lucide-user",
  },
  {
    slot: "shareholders",
    title: "股東資料",
    description: "請填寫股東資料",
    icon: "i-lucide-users",
  },
  {
    slot: "required-documents",
    title: "必要文件",
    description: "請上傳必要文件",
    icon: "i-lucide-file",
  },
];

const registrationStore = useCompanyRegistrationStore();
</script>
