<template>
  <UContainer class="py-8 space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-primary mb-2">公司設立登記</h1>
      <p class="text-text-secondary">請填寫以下資料以完成公司設立登記</p>
    </div>

    <!-- Development helper: Generate fake data button -->
    <div v-if="isDev" class="flex justify-center gap-2">
      <UButton
        color="neutral"
        variant="outline"
        leading-icon="i-lucide-wand-2"
        @click="generateFakeData"
      >
        生成測試資料
      </UButton>
      <UButton
        color="neutral"
        variant="outline"
        leading-icon="i-lucide-rotate-ccw"
        @click="resetForm"
      >
        重置表單
      </UButton>
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
    slot: "form-part-1",
    title: "公司基本資料",
    description: "請填寫公司基本資料",
    icon: "i-lucide-house",
  },
  {
    slot: "form-part-2",
    title: "相關負責人資料",
    description: "請填寫負責人、董事與聯絡人資料",
    icon: "i-lucide-user",
  },
  {
    slot: "form-part-3",
    title: "董事與股東資料",
    description: "請填寫董事與股東資料",
    icon: "i-lucide-users",
  },
  // {
  //   slot: "form-part-4",
  //   title: "必要文件",
  //   description: "請上傳必要文件",
  //   icon: "i-lucide-file",
  // },
];

const stepper = useTemplateRef("stepper");

const applicationStore = useCompanyApplicationStore();

// Check if we're in development mode
const isDev = computed(() => process.env.NODE_ENV === "development");

// Generate fake data with notification
const generateFakeData = () => {
  applicationStore.populateWithMockData();
  // Show success notification
  const toast = useToast();
  toast.add({
    title: "測試資料已生成",
    description: "表單已填入測試資料，您可以開始測試了",
    color: "success",
    icon: "i-lucide-check-circle",
  });
};

// Reset form with notification
const resetForm = () => {
  applicationStore.resetForm();
  // Show success notification
  const toast = useToast();
  toast.add({
    title: "表單已重置",
    description: "所有資料已清空",
    color: "info",
    icon: "i-lucide-rotate-ccw",
  });
};
</script>
