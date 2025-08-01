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
    <UFormField label="公司組織" name="organizationType">
      <UInput
        v-model="basicInfo.organizationType"
        placeholder="請輸入公司組織"
        class="w-full"
      />
    </UFormField>

    <UFormField label="公司名稱" name="name">
      <UInput
        v-model="basicInfo.name"
        placeholder="請輸入公司名稱"
        class="w-full"
      />
    </UFormField>

    <UFormField label="公司營業項目" name="businessScopes">
      <UTextarea
        v-model="basicInfo.businessScopes"
        placeholder="請輸入公司營業項目"
        class="w-full"
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
