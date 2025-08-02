<template>
  <div class="space-y-4">
    <div class="flex items-center gap-6 mb-6">
      <h2 class="text-xl font-semibold text-text">股東資料</h2>
      <UButton
        icon="i-lucide-plus"
        label="新增股東"
        variant="soft"
        class="rounded-full"
        @click="applicationStore.addShareholder"
      />
    </div>

    <UForm
      v-for="(shareholder, index) in applicationStore.form.shareholders"
      :key="index"
      :state="shareholder"
      :schema="applicationStore.personSchema"
      attach
      class="space-y-4"
    >
      <UCard variant="subtle" class="relative overflow-visible">
        <div class="space-y-4">
          <UFormField label="姓名" name="name" class="w-full">
            <UInput
              v-model="shareholder.name"
              placeholder="請輸入股東姓名"
              class="w-full"
            />
          </UFormField>

          <UFormField label="身分證字號" name="idNumber">
            <UInput
              v-model="shareholder.idNumber"
              placeholder="請輸入股東身分證字號"
              class="w-full"
            />
          </UFormField>

          <UFormField label="戶籍地址" name="address">
            <UInput
              v-model="shareholder.address"
              placeholder="請輸入股東戶籍地址"
              class="w-full"
            />
          </UFormField>
        </div>

        <UButton
          :label="String(index + 1)"
          size="sm"
          color="secondary"
          class="absolute rounded-full -top-3 -left-3"
        />

        <UButton
          icon="i-lucide-x"
          size="sm"
          color="error"
          class="rounded-full absolute -top-3 -right-3 cursor-pointer"
          :disabled="applicationStore.form.shareholders.length === 1"
          @click="applicationStore.removeShareholder(index)"
        />
      </UCard>

      <USeparator
        v-if="index !== applicationStore.form.shareholders.length - 1"
        class="my-6"
      />
    </UForm>
  </div>
</template>

<script setup lang="ts">
const applicationStore = useCompanyApplicationStore();
</script>
