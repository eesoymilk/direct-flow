<template>
  <div class="flex mb-4">
    <h2 class="text-xl font-semibold text-text">負責人與董事資料</h2>
  </div>
  <UForm
    ref="responsiblePersonForm"
    :state="responsiblePerson"
    :schema="responsiblePersonSchema"
    class="space-y-4"
  >
    <h3 class="text-lg font-semibold text-text">負責人資料</h3>
    <div class="grid grid-cols-6 gap-4">
      <UFormField label="姓名" name="name" class="col-span-3">
        <UInput
          v-model="responsiblePerson.name"
          placeholder="請輸入負責人姓名"
          class="w-full"
        />
      </UFormField>

      <UFormField label="身分證字號" name="idNumber" class="col-span-3">
        <UInput
          v-model="responsiblePerson.idNumber"
          placeholder="請輸入負責人身份證字號"
          class="w-full"
        />
      </UFormField>

      <UFormField label="戶籍地址" name="address" class="col-span-6">
        <UInput
          v-model="responsiblePerson.address"
          placeholder="請輸入負責人戶籍地址"
          class="w-full"
        />
      </UFormField>

      <UFormField label="身份證正面" name="idCardFront" class="col-span-3">
        <!-- TODO: Add preview image -->
        <UInput
          type="file"
          @change="
            (event) =>
              registrationStore.handleFileUpload(event, [
                'responsiblePerson',
                'idCardFront',
              ])
          "
          class="w-full"
        />
      </UFormField>

      <UFormField label="身份證背面" name="idCardBack" class="col-span-3">
        <!-- TODO: Add preview image -->
        <UInput
          type="file"
          @change="
            (event) =>
              registrationStore.handleFileUpload(event, [
                'responsiblePerson',
                'idCardBack',
              ])
          "
          class="w-full"
        />
      </UFormField>
    </div>
  </UForm>
  <USeparator class="my-6" />
  <UForm
    ref="directorForm"
    :state="director"
    :schema="directorSchema"
    class="space-y-4"
  >
    <h3 class="text-lg font-semibold text-text">董事資料</h3>
    <div class="grid grid-cols-6 gap-4">
      <UFormField label="姓名" name="name" class="col-span-3">
        <UInput
          v-model="director.name"
          placeholder="請輸入董事姓名"
          class="w-full"
        />
      </UFormField>

      <UFormField label="身分證字號" name="idNumber" class="col-span-3">
        <UInput
          v-model="director.idNumber"
          placeholder="請輸入董事身份證字號"
          class="w-full"
        />
      </UFormField>

      <UFormField label="戶籍地址" name="address" class="col-span-6">
        <UInput
          v-model="director.address"
          placeholder="請輸入董事戶籍地址"
          class="w-full"
        />
      </UFormField>

      <UFormField label="身份證正面" name="idCardFront" class="col-span-3">
        <!-- TODO: Add preview image -->
        <UInput
          type="file"
          @change="
            (event) =>
              registrationStore.handleFileUpload(event, [
                'director',
                'idCardFront',
              ])
          "
          class="w-full"
        />
      </UFormField>

      <UFormField label="身份證背面" name="idCardBack" class="col-span-3">
        <!-- TODO: Add preview image -->
        <UInput
          type="file"
          @change="
            (event) =>
              registrationStore.handleFileUpload(event, [
                'director',
                'idCardBack',
              ])
          "
          class="w-full"
        />
      </UFormField>
    </div>
  </UForm>
  <div class="flex gap-2 justify-between mt-4">
    <UButton
      leading-icon="i-lucide-arrow-left"
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
const toast = useToast();
const responsiblePersonForm = useTemplateRef("responsiblePersonForm");
const directorForm = useTemplateRef("directorForm");
const registrationStore = useCompanyRegistrationStore();

const { responsiblePerson, director } = storeToRefs(registrationStore);

const handleNextStep = async () => {
  try {
    await responsiblePersonForm.value?.validate();
    await directorForm.value?.validate();
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
