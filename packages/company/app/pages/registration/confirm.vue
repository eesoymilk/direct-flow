<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2">確認公司資料</h1>
        <p class="text-text-secondary">請確認以下資料是否正確</p>
      </div>

      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-document-check" class="text-primary" />
            <h2 class="text-xl font-semibold">基本資料</h2>
          </div>
        </template>

        <div class="space-y-6">
          <div class="grid grid-cols-6 gap-4">
            <div class="col-span-2">
              <h3 class="text-sm font-medium text-text-secondary mb-1">
                公司名稱（中文）
              </h3>
              <p class="text-text">{{ formState.companyNameTW }}</p>
            </div>
            <div class="col-span-2">
              <h3 class="text-sm font-medium text-text-secondary mb-1">
                外文名稱
              </h3>
              <p class="text-text">{{ formState.companyNameEN }}</p>
            </div>
            <div class="col-span-2">
              <h3 class="text-sm font-medium text-text-secondary mb-1">
                公司組織
              </h3>
              <p class="text-text">
                {{ getCompanyTypeLabel(formState.companyType) }}
              </p>
            </div>
            <div class="col-span-6">
              <h3 class="text-sm font-medium text-text-secondary mb-1">
                公司地址
              </h3>
              <p class="text-text">{{ formState.address }}</p>
            </div>
            <div class="col-span-3">
              <h3 class="text-sm font-medium text-text-secondary mb-1">
                統一編號
              </h3>
              <p class="text-text">{{ formState.guiNumber }}</p>
            </div>
            <div class="col-span-3">
              <h3 class="text-sm font-medium text-text-secondary mb-1">
                稅籍編號
              </h3>
              <p class="text-text">{{ formState.taxIdentificationNumber }}</p>
            </div>
            <div class="col-span-3">
              <h3 class="text-sm font-medium text-text-secondary mb-1">
                聯絡電話
              </h3>
              <p class="text-text">{{ formState.phone }}</p>
            </div>
            <div class="col-span-3">
              <h3 class="text-sm font-medium text-text-secondary mb-1">
                傳真號碼
              </h3>
              <p class="text-text">{{ formState.fax }}</p>
            </div>
            <div class="col-span-6">
              <h3 class="text-sm font-medium text-text-secondary mb-1">
                電子郵件
              </h3>
              <p class="text-text">{{ formState.email }}</p>
            </div>
            <div class="col-span-6">
              <h3 class="text-sm font-medium text-text-secondary mb-1">
                公司代理人
              </h3>
              <p class="text-text">{{ formState.representative }}</p>
            </div>
          </div>

          <div class="border-t border-border pt-6">
            <h3 class="text-lg font-semibold text-text mb-4">聯絡人資料</h3>
            <div class="grid grid-cols-6 gap-4">
              <div class="col-span-3">
                <h3 class="text-sm font-medium text-text-secondary mb-1">
                  姓名
                </h3>
                <p class="text-text">{{ formState.contactPerson.name }}</p>
              </div>
              <div class="col-span-3">
                <h3 class="text-sm font-medium text-text-secondary mb-1">
                  聯絡電話
                </h3>
                <p class="text-text">{{ formState.contactPerson.phone }}</p>
              </div>
              <div class="col-span-6">
                <h3 class="text-sm font-medium text-text-secondary mb-1">
                  電子郵件
                </h3>
                <p class="text-text">{{ formState.contactPerson.email }}</p>
              </div>
              <div class="col-span-6">
                <h3 class="text-sm font-medium text-text-secondary mb-1">
                  地址
                </h3>
                <p class="text-text">{{ formState.contactPerson.address }}</p>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-4">
            <UButton color="neutral" variant="ghost" @click="goBack">
              返回修改
            </UButton>
            <UButton
              color="primary"
              :loading="isSubmitting"
              @click="handleSubmit"
            >
              確認送出
            </UButton>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as z from "zod";

const COMPANY_TYPES_VALUES = [
  "limited",
  "corporation",
  "unlimited",
  "partnership",
] as const;

const schema = z.object({
  companyNameTW: z.string(),
  companyNameEN: z.string(),
  companyType: z.enum(COMPANY_TYPES_VALUES),
  guiNumber: z.string(),
  taxIdentificationNumber: z.string(),
  phone: z.string(),
  fax: z.string(),
  address: z.string(),
  email: z.string(),
  representative: z.string(),
  contactPerson: z.object({
    name: z.string(),
    address: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
});

type Schema = z.output<typeof schema>;

// TODO: Replace with actual form state management
const formState = ref<Schema>({
  companyNameTW: "示例公司",
  companyNameEN: "Example Company",
  companyType: "limited",
  guiNumber: "12345678",
  taxIdentificationNumber: "87654321",
  address: "台北市信義區信義路五段7號",
  phone: "02-2345-6789",
  fax: "02-2345-6790",
  email: "contact@example.com",
  representative: "張三",
  contactPerson: {
    name: "王小明",
    address: "台北市大安區忠孝東路四段169號",
    email: "contact@example.com",
    phone: "0912-345-678",
  },
});

const companyTypes = [
  { label: "有限公司", value: "limited" },
  { label: "股份有限公司", value: "corporation" },
  { label: "無限公司", value: "unlimited" },
  { label: "兩合公司", value: "partnership" },
];

const isSubmitting = ref(false);

function getCompanyTypeLabel(value: string) {
  return companyTypes.find((type) => type.value === value)?.label || value;
}

function goBack() {
  navigateTo("/registration/company-setup");
}

async function handleSubmit() {
  isSubmitting.value = true;
  try {
    // TODO: Implement form submission
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    // Show success message and redirect
    navigateTo("/registration/company-setup/success");
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>
