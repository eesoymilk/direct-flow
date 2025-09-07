<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-text mb-4">負責人與聯絡人資料</h2>

    <h3 class="text-lg font-semibold text-text">負責人資料</h3>
    <UForm
      :state="formState.responsiblePerson"
      :schema="responsiblePersonSchema"
      attach
      class="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <UFormField label="姓名" name="name">
        <UInput
          v-model="formState.responsiblePerson.name"
          placeholder="請輸入負責人姓名"
          class="w-full"
        />
      </UFormField>

      <UFormField label="身分證字號" name="idNumber">
        <UInput
          v-model="formState.responsiblePerson.idNumber"
          placeholder="請輸入負責人身份證字號"
          class="w-full"
        />
      </UFormField>

      <UFormField label="戶籍地址" name="address">
        <UInput
          v-model="formState.responsiblePerson.address"
          placeholder="請輸入負責人戶籍地址"
          class="w-full"
        />
      </UFormField>

      <UFormField label="電話" name="telephone">
        <UInput
          v-model="formState.responsiblePerson.telephone"
          placeholder="請輸入負責人電話 (必須提供電話或手機其中一項)"
          class="w-full"
        />
      </UFormField>

      <UFormField label="手機" name="cellphone">
        <UInput
          v-model="formState.responsiblePerson.cellphone"
          placeholder="請輸入負責人手機 (必須提供電話或手機其中一項)"
          class="w-full"
        />
      </UFormField>

      <UFormField label="電子郵件" name="email">
        <UInput
          v-model="formState.responsiblePerson.email"
          placeholder="請輸入負責人電子郵件"
          class="w-full"
        />
      </UFormField>
    </UForm>

    <USeparator class="my-6" />

    <div class="flex items-center gap-4">
      <h3 class="text-lg font-semibold text-text">董事資料</h3>
      <UCheckbox
        v-model="formState.isRepresentativeSameAsResponsiblePerson"
        label="同負責人"
        size="lg"
        @update:model-value="
          (value) => {
            if (value && formState.isContactPersonSameAsRepresentative) {
              formState.isContactPersonSameAsRepresentative = false;
              formState.isContactPersonSameAsResponsiblePerson = true;
            }
          }
        "
      />
    </div>

    <UForm
      v-if="!formState.isRepresentativeSameAsResponsiblePerson"
      :state="formState.representative"
      :schema="representativeSchema"
      attach
      class="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <UFormField label="姓名" name="name">
        <UInput
          v-model="formState.representative.name"
          placeholder="請輸入代表人姓名"
          class="w-full"
        />
      </UFormField>

      <UFormField label="身分證字號" name="idNumber">
        <UInput
          v-model="formState.representative.idNumber"
          placeholder="請輸入代表人身分證字號"
          class="w-full"
        />
      </UFormField>

      <UFormField label="戶籍地址" name="address">
        <UInput
          v-model="formState.representative.address"
          placeholder="請輸入代表人戶籍地址"
          class="w-full"
        />
      </UFormField>

      <UFormField label="電話" name="telephone">
        <UInput
          v-model="formState.representative.telephone"
          placeholder="請輸入董事電話"
          class="w-full"
        />
      </UFormField>

      <UFormField label="手機" name="cellphone">
        <UInput
          v-model="formState.representative.cellphone"
          placeholder="請輸入董事手機"
          class="w-full"
        />
      </UFormField>

      <UFormField label="電子郵件" name="email">
        <UInput
          v-model="formState.representative.email"
          placeholder="請輸入董事電子郵件"
          class="w-full"
        />
      </UFormField>
    </UForm>

    <USeparator class="my-6" />

    <div class="flex items-center gap-4">
      <h3 class="text-lg font-semibold text-text">聯絡人資料</h3>
      <UCheckbox
        v-model="formState.isContactPersonSameAsResponsiblePerson"
        label="同負責人"
        size="lg"
        @update:model-value="
          () => (formState.isContactPersonSameAsRepresentative = false)
        "
      />
      <UCheckbox
        v-if="!formState.isRepresentativeSameAsResponsiblePerson"
        v-model="formState.isContactPersonSameAsRepresentative"
        label="同董事"
        size="lg"
        @update:model-value="
          () => (formState.isContactPersonSameAsResponsiblePerson = false)
        "
      />
    </div>

    <UForm
      v-if="
        !formState.isContactPersonSameAsResponsiblePerson &&
        !formState.isContactPersonSameAsRepresentative
      "
      :state="formState.contactPerson"
      :schema="contactPersonSchema"
      class="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <UFormField label="姓名" name="name">
        <UInput
          v-model="formState.contactPerson.name"
          placeholder="請輸入聯絡人姓名"
          class="w-full"
        />
      </UFormField>

      <UFormField label="身分證字號" name="idNumber">
        <UInput
          v-model="formState.contactPerson.idNumber"
          placeholder="請輸入聯絡人身分證字號"
          class="w-full"
        />
      </UFormField>

      <UFormField label="戶籍地址" name="address">
        <UInput
          v-model="formState.contactPerson.address"
          placeholder="請輸入聯絡人戶籍地址"
          class="w-full"
        />
      </UFormField>

      <UFormField label="電話" name="telephone">
        <UInput
          v-model="formState.contactPerson.telephone"
          placeholder="請輸入聯絡人電話 (必須提供電話或手機其中一項)"
          class="w-full"
        />
      </UFormField>

      <UFormField label="手機" name="cellphone">
        <UInput
          v-model="formState.contactPerson.cellphone"
          placeholder="請輸入聯絡人手機 (必須提供電話或手機其中一項)"
          class="w-full"
        />
      </UFormField>

      <UFormField label="電子郵件" name="email">
        <UInput
          v-model="formState.contactPerson.email"
          placeholder="請輸入聯絡人電子郵件"
          class="w-full"
        />
      </UFormField>
    </UForm>
  </div>
</template>

<script setup lang="ts">
const applicationStore = useCompanyApplicationStore();
const { formState } = storeToRefs(applicationStore);
</script>
