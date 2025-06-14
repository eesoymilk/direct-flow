<template>
  <div class="flex">
    <h2 class="text-xl font-semibold text-text mb-4">公司基本資料</h2>
  </div>
  <UForm
    ref="basicInfoForm"
    :state="basicInfo"
    :schema="companyBasicInfoSchema"
    class="space-y-4"
  >
    <UFormField label="公司名稱" name="name">
      <UInput
        v-model="basicInfo.name"
        placeholder="請輸入公司名稱"
        class="w-full"
      />
    </UFormField>

    <UFormField label="營業項目" name="businessScopes">
      <!-- TODO: Fix the search term reset on select not working -->
      <!-- Guess it's because the items are too many -->
      <UInputMenu
        v-model="basicInfo.businessItems"
        value-key="code"
        :items="businessScopeItems"
        multiple
        :reset-search-term-on-blur="true"
        :reset-search-term-on-select="true"
        class="w-full [&>input]:min-w-0 [&>input]:flex-1"
      />
    </UFormField>

    <UFormField label="公司地址" name="address">
      <UInput
        v-model="basicInfo.address"
        placeholder="請輸入公司地址"
        class="w-full"
      />
    </UFormField>

    <UFormField label="房屋稅單" name="houseTaxPayment">
      <UInput
        type="file"
        name="houseTaxPayment"
        @change="
          (event) =>
            registrationStore.handleFileUpload(event, [
              'basicInfo',
              'houseTaxPayment',
            ])
        "
        class="w-full"
      />
    </UFormField>
  </UForm>
  <div class="flex gap-2 justify-between mt-4">
    <UButton
      leading-icon="i-lucide-arrow-left"
      disabled
      @click="registrationStore.prevStep()"
    >
      上一步
    </UButton>
    <UButton trailing-icon="i-lucide-arrow-right" @click="handleNextStep">
      下一步
    </UButton>
  </div>
</template>

<script setup lang="ts">
import businessScopes from "@/assets/businessScopes.json";

const businessScopeItems = computed(() =>
  businessScopes.map((scope) => ({
    ...scope,
    label: `${scope.scopeNameTW} (${scope.code})`,
  }))
);

const toast = useToast();
const basicInfoForm = useTemplateRef("basicInfoForm");
const registrationStore = useCompanyRegistrationStore();

const { basicInfo } = storeToRefs(registrationStore);

const handleNextStep = async () => {
  try {
    await basicInfoForm.value?.validate();
    registrationStore.nextStep();
  } catch (error) {
    console.error("Error validating form:", error);
    toast.add({
      title: "錯誤",
      description: "表單驗證失敗，請檢查並修正表單中的錯誤",
      color: "error",
    });
  }
};
</script>
