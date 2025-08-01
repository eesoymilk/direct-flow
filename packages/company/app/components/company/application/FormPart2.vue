<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-text mb-4">負責人與董事資料</h2>

    <h3 class="text-lg font-semibold text-text">負責人資料</h3>
    <UForm
      :state="applicationStore.form.responsiblePerson"
      :schema="applicationStore.personSchema"
      class="space-y-4"
    >
      <UFormField label="姓名" name="name" class="col-span-3">
        <UInput
          v-model="applicationStore.form.responsiblePerson.name"
          placeholder="請輸入負責人姓名"
          class="w-full"
        />
      </UFormField>

      <UFormField label="身分證字號" name="idNumber" class="col-span-3">
        <UInput
          v-model="applicationStore.form.responsiblePerson.idNumber"
          placeholder="請輸入負責人身份證字號"
          class="w-full"
        />
      </UFormField>

      <UFormField label="戶籍地址" name="address" class="col-span-6">
        <UInput
          v-model="applicationStore.form.responsiblePerson.address"
          placeholder="請輸入負責人戶籍地址"
          class="w-full"
        />
      </UFormField>
    </UForm>

    <USeparator class="my-6" />

    <div class="flex items-center gap-4">
      <h3 class="text-lg font-semibold text-text">董事資料</h3>
      <UCheckbox
        v-model="applicationStore.form.isDirectorSameAsResponsiblePerson"
        label="同負責人"
        size="lg"
        @update:model-value="
          (value) => {
            if (value && applicationStore.form.isContactPersonSameAsDirector) {
              applicationStore.form.isContactPersonSameAsDirector = false;
              applicationStore.form.isContactPersonSameAsResponsiblePerson = true;
            }
          }
        "
      />
    </div>

    <UForm
      v-if="!applicationStore.form.isDirectorSameAsResponsiblePerson"
      :state="applicationStore.form.director"
      :schema="applicationStore.personSchema"
      class="space-y-4"
    >
      <UFormField label="姓名" name="name" class="col-span-3">
        <UInput
          v-model="applicationStore.form.director.name"
          placeholder="請輸入董事姓名"
          class="w-full"
        />
      </UFormField>

      <UFormField label="身分證字號" name="idNumber" class="col-span-3">
        <UInput
          v-model="applicationStore.form.director.idNumber"
          placeholder="請輸入董事身分證字號"
          class="w-full"
        />
      </UFormField>

      <UFormField label="戶籍地址" name="address" class="col-span-6">
        <UInput
          v-model="applicationStore.form.director.address"
          placeholder="請輸入董事戶籍地址"
          class="w-full"
        />
      </UFormField>
    </UForm>

    <USeparator class="my-6" />

    <div class="flex items-center gap-4">
      <h3 class="text-lg font-semibold text-text">聯絡人資料</h3>
      <UCheckbox
        v-model="applicationStore.form.isContactPersonSameAsResponsiblePerson"
        label="同負責人"
        size="lg"
        @update:model-value="
          () => (applicationStore.form.isContactPersonSameAsDirector = false)
        "
      />
      <UCheckbox
        v-if="!applicationStore.form.isDirectorSameAsResponsiblePerson"
        v-model="applicationStore.form.isContactPersonSameAsDirector"
        label="同董事"
        size="lg"
        @update:model-value="
          () =>
            (applicationStore.form.isContactPersonSameAsResponsiblePerson = false)
        "
      />
    </div>

    <UForm
      :state="applicationStore.form.contactPerson"
      :schema="applicationStore.personSchema"
      class="space-y-4"
    >
      <UFormField label="姓名" name="name" class="col-span-3">
        <UInput
          v-model="applicationStore.form.contactPerson.name"
          placeholder="請輸入聯絡人姓名"
          class="w-full"
        />
      </UFormField>

      <UFormField label="身分證字號" name="idNumber" class="col-span-3">
        <UInput
          v-model="applicationStore.form.contactPerson.idNumber"
          placeholder="請輸入聯絡人身分證字號"
          class="w-full"
        />
      </UFormField>

      <UFormField label="戶籍地址" name="address" class="col-span-6">
        <UInput
          v-model="applicationStore.form.contactPerson.address"
          placeholder="請輸入聯絡人戶籍地址"
          class="w-full"
        />
      </UFormField>
    </UForm>
  </div>
</template>

<script setup lang="ts">
const applicationStore = useCompanyApplicationStore();
</script>
