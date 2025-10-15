<template>
  <UContainer class="py-8 space-y-8">
    <div class="text-center">
      <h1 class="mb-2 text-3xl font-bold text-primary">公司設立登記</h1>
      <p class="text-text-secondary">請填寫以下資料以完成公司設立登記</p>
    </div>

    <!-- Development helper: Generate fake data button -->
    <div v-if="isDev" class="flex gap-2 justify-center">
      <UButton
        label="生成股份有限公司測試資料"
        variant="outline"
        leading-icon="i-lucide-wand-2"
        @click="() => handleGenerateMockData('corporation')"
      />
      <UButton
        label="生成隨機測試資料"
        variant="outline"
        leading-icon="i-lucide-building-2"
        @click="() => handleGenerateMockData()"
      />
      <UButton
        label="重置表單"
        color="neutral"
        variant="outline"
        leading-icon="i-lucide-rotate-ccw"
        @click="handleResetForm"
      />
    </div>

    <!-- TODO: 
    - Better trigger button to indicate if the form is valid
    -->
    <UForm
      ref="form"
      :schema="companyApplicationFormSchema"
      :state="formState"
      @error="handleFormError"
      @submit="handleFormSubmit"
    >
      <UStepper
        ref="stepper"
        :linear="false"
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
        <template
          v-if="
            formState.organizationType === 'corporation' ||
            formState.organizationType === 'limited_company' ||
            formState.organizationType === 'partnership'
          "
          #form-part-3
        >
          <CompanyApplicationFormPart3 />
        </template>
        <template
          v-if="formState.organizationType === 'corporation'"
          #form-part-4
        >
          <CompanyApplicationFormPart4 />
        </template>
      </UStepper>
      <div class="flex gap-2 justify-between mt-4">
        <UButton
          v-if="stepper?.hasPrev"
          label="上一步"
          class="mr-auto"
          leading-icon="i-lucide-arrow-left"
          @click="stepper?.prev()"
        />
        <UButton
          v-if="stepper?.hasNext"
          label="下一步"
          class="ml-auto"
          trailing-icon="i-lucide-arrow-right"
          @click="stepper?.next()"
        />
        <UButton
          v-if="!stepper?.hasNext"
          label="確認資料"
          type="button"
          @click="form?.submit()"
          class="ml-auto"
          color="primary"
          trailing-icon="i-lucide-check-square"
        />
      </div>
    </UForm>
  </UContainer>
</template>

<script setup lang="ts">
import type { StepperItem, FormErrorEvent, FormSubmitEvent } from "@nuxt/ui";

const form = useTemplateRef("form");

const toast = useToast();

const stepper = useTemplateRef("stepper");

const applicationStore = useCompanyApplicationStore();
const { formState } = storeToRefs(applicationStore);
const { resetForm, populateWithMockData } = applicationStore;

const stepperItems = computed((): StepperItem[] => {
  const basicItems = [
    {
      slot: "form-part-1",
      title: "公司基本資料",
      description: "請填寫公司基本資料",
      icon: "i-lucide-house",
    },
    {
      slot: "form-part-2",
      title: "相關人資料",
      description: "請填寫負責人與聯絡人資料",
      icon: "i-lucide-user",
    },
  ];

  if (
    formState.value.organizationType === "corporation" ||
    formState.value.organizationType === "limited_company" ||
    formState.value.organizationType === "partnership"
  ) {
    const personType =
      formState.value.organizationType === "partnership" ? "合夥人" : "股東";
    basicItems.push({
      slot: "form-part-3",
      title: `${personType}資料`,
      description: `請填寫${personType}資料`,
      icon: "i-lucide-users",
    });
  }

  if (formState.value.organizationType === "corporation") {
    basicItems.push({
      slot: "form-part-4",
      title: "股份資料",
      description: "請填寫股份資料",
      icon: "i-lucide-share",
    });
  }

  return basicItems;
});

const isDev = computed(() => {
  return true;
  return process.env.NODE_ENV === "development";
});

const handleGenerateMockData = (organizationType?: OrganizationType) => {
  populateWithMockData({ organizationType });

  const description = organizationType
    ? `表單已填入${getOrganizationTypeLabel(organizationType)}測試資料，可測試閉鎖型功能`
    : "表單已填入隨機組織類型測試資料，可測試閉鎖型功能";

  toast.add({
    title: "組織類型測試資料已生成",
    description,
    color: "primary",
    icon: "i-lucide-building-2",
  });
};

const handleResetForm = () => {
  resetForm();
  // Show success notification
  toast.add({
    title: "表單已重置",
    description: "所有資料已清空",
    color: "info",
    icon: "i-lucide-rotate-ccw",
  });
};

// TODO: Fix form error handling not working for nested form fields
const handleFormError = (event: FormErrorEvent) => {
  console.error("Form validation errors:", event.errors);

  const toastDescription = event.errors
    .map((error) => error.message)
    .join("、");

  // Show error notification
  toast.add({
    title: "表單驗證失敗",
    description: toastDescription,
    color: "error",
    icon: "i-lucide-alert-circle",
    ui: {
      description: "truncate",
    },
  });
};

const handleFormSubmit = (event: FormSubmitEvent<any>) => {
  console.log("Form submitted successfully!", event.data);
  // Navigate to confirmation page on successful validation
  navigateTo("/apply/confirm");
};
</script>
