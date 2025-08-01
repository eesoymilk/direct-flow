<template>
  <UContainer class="py-8 space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-primary mb-2">公司設立登記</h1>
      <p class="text-text-secondary">請填寫以下資料以完成公司設立登記</p>
    </div>

    <!-- TODO: 
    - Better trigger button to indicate if the form is valid
    -->
    <UForm
      ref="registrationForm"
      :state="applicationStore.form"
      :schema="applicationStore.formSchema"
    >
      <UStepper
        ref="stepper"
        :items="stepperItems"
        :ui="{ trigger: '' }"
        class="w-full"
      >
        <template #form-part-1>
          <CompanyApplicationFormPart1 />
        </template>
        <template #form-part-2>
          <CompanyApplicationFormPart2 />
        </template>
        <template #form-part-3>
          <CompanyApplicationFormPart3 />
        </template>
        <template #form-part-4>
          <CompanyApplicationFormPart4 />
        </template>
      </UStepper>
      <div class="flex gap-2 justify-between mt-4">
        <UButton
          v-if="stepper?.hasPrev"
          class="mr-auto"
          leading-icon="i-lucide-arrow-left"
          @click="stepper?.prev()"
        >
          上一步
        </UButton>
        <UButton
          v-if="stepper?.hasNext"
          class="ml-auto"
          trailing-icon="i-lucide-arrow-right"
          @click="stepper?.next()"
        >
          下一步
        </UButton>
      </div>
    </UForm>
  </UContainer>
</template>

<script setup lang="ts">
import type { StepperItem } from "@nuxt/ui";

const stepperItems: StepperItem[] = [
  {
    slot: "form-part-4",
    title: "公司基本資料",
    description: "請填寫公司基本資料",
    icon: "i-lucide-house",
  },
  {
    slot: "form-part-2",
    title: "負責人與董事資料",
    description: "請填寫負責人與董事資料",
    icon: "i-lucide-user",
  },
  {
    slot: "form-part-3",
    title: "股東資料",
    description: "請填寫股東資料",
    icon: "i-lucide-users",
  },
  {
    slot: "form-part-1",
    title: "必要文件",
    description: "請上傳必要文件",
    icon: "i-lucide-file",
  },
];

const stepper = useTemplateRef("stepper");

const applicationStore = useCompanyApplicationStore();
</script>
