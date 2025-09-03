<template>
  <div class="space-y-4">
    <div class="flex items-center gap-4 mb-6">
      <h2 class="text-xl font-semibold text-text">股東資料</h2>
      <UButton
        icon="i-lucide-plus"
        label="新增股東"
        variant="soft"
        class="rounded-full"
        @click="applicationStore.addShareholder"
      />
      <UDropdownMenu
        :items="exsitingPeopleMenuItems"
        :popper="{ placement: 'bottom-start' }"
      >
        <UButton
          icon="i-lucide-user-plus"
          label="加入現有人員"
          variant="outline"
          class="rounded-full"
        />
      </UDropdownMenu>
    </div>

    <!-- Shareholders array validation wrapper -->
    <UForm
      :state="{ shareholders: applicationStore.form.shareholders }"
      :schema="z.object({ shareholders: shareholderArraySchema })"
      attach
    >
      <UFormField name="shareholders">
        <div class="space-y-6">
          <UForm
            v-for="(shareholder, index) in applicationStore.form.shareholders"
            :key="index"
            :state="shareholder"
            :schema="shareholderSchema"
            attach
            class="space-y-4"
          >
            <UCard
              variant="subtle"
              class="relative overflow-visible"
              :class="{
                'border-primary/20 bg-primary/5': shareholder.isReadonly,
              }"
            >
              <div
                v-if="shareholder.isReadonly && shareholder.referenceType"
                class="absolute top-2 right-2 flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full"
              >
                <UIcon name="i-lucide-link" class="w-3 h-3" />
                {{
                  getReferenceTypeLabel(shareholder.referenceType)
                }}（僅可編輯持股）
              </div>
              <div class="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormField label="姓名" name="name" class="w-full">
                  <UInput
                    v-model="shareholder.name"
                    :readonly="shareholder.isReadonly"
                    :disabled="shareholder.isReadonly"
                    placeholder="請輸入股東姓名"
                    class="w-full"
                    :class="{ 'opacity-60': shareholder.isReadonly }"
                  />
                </UFormField>

                <UFormField label="身分證字號" name="idNumber">
                  <UInput
                    v-model="shareholder.idNumber"
                    :readonly="shareholder.isReadonly"
                    :disabled="shareholder.isReadonly"
                    placeholder="請輸入股東身分證字號"
                    class="w-full"
                    :class="{ 'opacity-60': shareholder.isReadonly }"
                  />
                </UFormField>

                <UFormField label="戶籍地址" name="address">
                  <UInput
                    v-model="shareholder.address"
                    :readonly="shareholder.isReadonly"
                    :disabled="shareholder.isReadonly"
                    placeholder="請輸入股東戶籍地址"
                    class="w-full"
                    :class="{ 'opacity-60': shareholder.isReadonly }"
                  />
                </UFormField>

                <UFormField label="電話" name="telephone">
                  <UInput
                    v-model="shareholder.telephone"
                    :readonly="shareholder.isReadonly"
                    :disabled="shareholder.isReadonly"
                    placeholder="請輸入股東電話"
                    class="w-full"
                    :class="{ 'opacity-60': shareholder.isReadonly }"
                  />
                </UFormField>

                <UFormField label="手機" name="cellphone">
                  <UInput
                    v-model="shareholder.cellphone"
                    :readonly="shareholder.isReadonly"
                    :disabled="shareholder.isReadonly"
                    placeholder="請輸入股東手機"
                    class="w-full"
                    :class="{ 'opacity-60': shareholder.isReadonly }"
                  />
                </UFormField>

                <UFormField label="電子郵件" name="email">
                  <UInput
                    v-model="shareholder.email"
                    :readonly="shareholder.isReadonly"
                    :disabled="shareholder.isReadonly"
                    placeholder="請輸入股東電子郵件"
                    class="w-full"
                    :class="{ 'opacity-60': shareholder.isReadonly }"
                  />
                </UFormField>

                <!-- Shares field - only show for stock companies -->
                <UFormField
                  v-if="applicationStore.isStockCompany"
                  label="持股數"
                  name="shares"
                  class="w-full"
                >
                  <UInputNumber
                    v-model="shareholder.shares"
                    :min="0"
                    placeholder="請輸入持股數"
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
      </UFormField>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import * as z from "zod";

const applicationStore = useCompanyApplicationStore();

// Helper function to get reference type label
const getReferenceTypeLabel = (referenceType: string) => {
  const labels = {
    responsiblePerson: "負責人",
    director: "董事",
    contactPerson: "聯絡人",
  };
  return labels[referenceType as keyof typeof labels] || referenceType;
};

// Generate dropdown menu items for adding persons
const exsitingPeopleMenuItems = computed(() => {
  const items: DropdownMenuItem[] = [];

  items.push({
    label: `加入負責人 (${applicationStore.form.responsiblePerson.name})`,
    icon: "i-lucide-user",
    onSelect: () =>
      applicationStore.addPersonAsShareholder("responsiblePerson"),
  });

  if (!applicationStore.form.isDirectorSameAsResponsiblePerson) {
    items.push({
      label: `加入董事 (${applicationStore.form.director.name})`,
      icon: "i-lucide-briefcase",
      onSelect: () => applicationStore.addPersonAsShareholder("director"),
    });
  }

  if (
    !applicationStore.form.isContactPersonSameAsResponsiblePerson &&
    !applicationStore.form.isContactPersonSameAsDirector
  ) {
    items.push({
      label: `加入聯絡人 (${applicationStore.form.contactPerson.name})`,
      icon: "i-lucide-phone",
      onSelect: () => applicationStore.addPersonAsShareholder("contactPerson"),
    });
  }

  return items;
});
</script>
