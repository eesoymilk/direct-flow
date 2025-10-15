<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-text mb-4">相關負責人資料</h2>

    <h3 class="text-lg font-semibold text-text">負責人資料</h3>
    <UForm
      name="responsiblePerson"
      :schema="responsiblePersonSchema"
      class="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4"
      nested
    >
      <UFormField label="姓名" name="name" required>
        <UInput
          v-model="formState.responsiblePerson.name"
          placeholder="請輸入負責人姓名"
          class="w-full"
        />
      </UFormField>

      <UFormField label="身分證字號" name="idNumber" required>
        <UInput
          v-model="formState.responsiblePerson.idNumber"
          placeholder="請輸入負責人身份證字號"
          class="w-full"
        />
      </UFormField>

      <UFormField label="戶籍地址" name="address" required>
        <UInput
          v-model="formState.responsiblePerson.address"
          placeholder="請輸入負責人戶籍地址"
          class="w-full"
        />
      </UFormField>

      <UFormField label="出生日期" name="dateOfBirth" required>
        <DatePicker
          v-model="formState.responsiblePerson.dateOfBirth"
          date-format="yy/mm/dd"
          class="w-full h-8"
        />
      </UFormField>

      <UFormField label="手機" name="cellphone" required>
        <UInput
          v-model="formState.responsiblePerson.cellphone"
          placeholder="請輸入負責人手機 (09XXXXXXXX)"
          class="w-full"
        />
      </UFormField>

      <UFormField label="電子郵件" name="email" required>
        <UInput
          v-model="formState.responsiblePerson.email"
          placeholder="請輸入負責人電子郵件"
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
      />
    </div>

    <UForm
      v-if="!formState.isContactPersonSameAsResponsiblePerson"
      name="contactPerson"
      :schema="contactPersonSchema"
      class="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4"
      nested
    >
      <UFormField label="姓名" name="name" required>
        <UInput
          v-model="formState.contactPerson.name"
          placeholder="請輸入聯絡人姓名"
          class="w-full"
        />
      </UFormField>

      <UFormField label="身分證字號" name="idNumber" required>
        <UInput
          v-model="formState.contactPerson.idNumber"
          placeholder="請輸入聯絡人身分證字號"
          class="w-full"
        />
      </UFormField>

      <UFormField label="戶籍地址" name="address" required>
        <UInput
          v-model="formState.contactPerson.address"
          placeholder="請輸入聯絡人戶籍地址"
          class="w-full"
        />
      </UFormField>

      <UFormField label="出生日期" name="dateOfBirth" required>
        <DatePicker
          v-model="formState.contactPerson.dateOfBirth"
          date-format="yy/mm/dd"
          class="w-full h-8"
        />
      </UFormField>

      <UFormField label="手機" name="cellphone" required>
        <UInput
          v-model="formState.contactPerson.cellphone"
          placeholder="請輸入聯絡人手機 (09XXXXXXXX)"
          class="w-full"
        />
      </UFormField>

      <UFormField label="電子郵件" name="email" required>
        <UInput
          v-model="formState.contactPerson.email"
          placeholder="請輸入聯絡人電子郵件"
          class="w-full"
        />
      </UFormField>
    </UForm>

    <!-- Managerial Officer Section - Only for Sole Proprietorship -->
    <template v-if="formState.organizationType === 'sole_proprietorship'">
      <USeparator class="my-6" />

      <div class="flex items-center gap-4">
        <UCheckbox
          v-model="formState.hasManagerialOfficer"
          label="包含經理人"
          size="lg"
        />
        <span class="text-sm text-gray-500">(經理人、法定代理人經營)</span>
      </div>

      <template v-if="formState.hasManagerialOfficer">
        <div class="flex items-center gap-4 mt-4">
          <h3 class="text-lg font-semibold text-text">經理人資料</h3>
          <UCheckbox
            v-model="formState.isManagerialOfficerSameAsResponsiblePerson"
            label="同負責人"
            size="lg"
          />
        </div>

        <UForm
          v-if="!formState.isManagerialOfficerSameAsResponsiblePerson"
          name="managerialOfficer"
          :schema="managerialOfficerSchema"
          class="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4"
          nested
        >
          <UFormField label="姓名" name="name" required>
            <UInput
              v-model="formState.managerialOfficer.name"
              placeholder="請輸入經理人姓名"
              class="w-full"
            />
          </UFormField>

          <UFormField label="身分證字號" name="idNumber" required>
            <UInput
              v-model="formState.managerialOfficer.idNumber"
              placeholder="請輸入經理人身分證字號"
              class="w-full"
            />
          </UFormField>

          <UFormField label="戶籍地址" name="address" required>
            <UInput
              v-model="formState.managerialOfficer.address"
              placeholder="請輸入經理人戶籍地址"
              class="w-full"
            />
          </UFormField>

          <UFormField label="出生日期" name="dateOfBirth" required>
            <DatePicker
              v-model="formState.managerialOfficer.dateOfBirth"
              date-format="yy/mm/dd"
              class="w-full h-8"
            />
          </UFormField>

          <UFormField label="手機" name="cellphone" required>
            <UInput
              v-model="formState.managerialOfficer.cellphone"
              placeholder="請輸入經理人手機 (09XXXXXXXX)"
              class="w-full"
            />
          </UFormField>

          <UFormField label="電子郵件" name="email" required>
            <UInput
              v-model="formState.managerialOfficer.email"
              placeholder="請輸入經理人電子郵件"
              class="w-full"
            />
          </UFormField>
        </UForm>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
const applicationStore = useCompanyApplicationStore();
const { formState } = storeToRefs(applicationStore);
</script>
