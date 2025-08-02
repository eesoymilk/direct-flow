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
            <div class="col-span-6">
              <h3 class="text-sm font-medium text-text-secondary mb-1">
                公司預查名稱
              </h3>
              <div class="space-y-1">
                <p
                  v-for="(name, index) in applicationStore.form.candicateNames"
                  :key="index"
                  class="text-text"
                >
                  {{ index + 1 }}. {{ name }}
                </p>
              </div>
            </div>
            <div class="col-span-3">
              <h3 class="text-sm font-medium text-text-secondary mb-1">
                公司組織
              </h3>
              <p class="text-text">
                {{
                  getOrganizationTypeLabel(
                    applicationStore.form.organizationType || ""
                  )
                }}
              </p>
            </div>
            <div class="col-span-3">
              <h3 class="text-sm font-medium text-text-secondary mb-1">
                公司地址
              </h3>
              <p class="text-text">{{ applicationStore.form.address }}</p>
            </div>
            <div class="col-span-6">
              <h3 class="text-sm font-medium text-text-secondary mb-1">
                營業項目描述
              </h3>
              <p class="text-text">
                {{ applicationStore.form.businessItemsDescription }}
              </p>
            </div>
          </div>

          <div class="border-t border-border pt-6">
            <h3 class="text-lg font-semibold text-text mb-4">負責人資料</h3>
            <div class="grid grid-cols-6 gap-4">
              <div class="col-span-3">
                <h3 class="text-sm font-medium text-text-secondary mb-1">
                  姓名
                </h3>
                <p class="text-text">
                  {{ applicationStore.form.responsiblePerson.name }}
                </p>
              </div>
              <div class="col-span-3">
                <h3 class="text-sm font-medium text-text-secondary mb-1">
                  身分證字號
                </h3>
                <p class="text-text">
                  {{ applicationStore.form.responsiblePerson.idNumber }}
                </p>
              </div>
              <div class="col-span-6">
                <h3 class="text-sm font-medium text-text-secondary mb-1">
                  戶籍地址
                </h3>
                <p class="text-text">
                  {{ applicationStore.form.responsiblePerson.address }}
                </p>
              </div>
            </div>
          </div>

          <div class="border-t border-border pt-6">
            <h3 class="text-lg font-semibold text-text mb-4">董事資料</h3>
            <div
              v-if="applicationStore.form.isDirectorSameAsResponsiblePerson"
              class="text-text-secondary"
            >
              <p>同負責人</p>
            </div>
            <div v-else class="grid grid-cols-6 gap-4">
              <div class="col-span-3">
                <h3 class="text-sm font-medium text-text-secondary mb-1">
                  姓名
                </h3>
                <p class="text-text">
                  {{ applicationStore.form.director.name }}
                </p>
              </div>
              <div class="col-span-3">
                <h3 class="text-sm font-medium text-text-secondary mb-1">
                  身分證字號
                </h3>
                <p class="text-text">
                  {{ applicationStore.form.director.idNumber }}
                </p>
              </div>
              <div class="col-span-6">
                <h3 class="text-sm font-medium text-text-secondary mb-1">
                  戶籍地址
                </h3>
                <p class="text-text">
                  {{ applicationStore.form.director.address }}
                </p>
              </div>
            </div>
          </div>

          <div class="border-t border-border pt-6">
            <h3 class="text-lg font-semibold text-text mb-4">聯絡人資料</h3>
            <div
              v-if="
                applicationStore.form.isContactPersonSameAsResponsiblePerson
              "
              class="text-text-secondary"
            >
              <p>同負責人</p>
            </div>
            <div
              v-else-if="applicationStore.form.isContactPersonSameAsDirector"
              class="text-text-secondary"
            >
              <p>同董事</p>
            </div>
            <div v-else class="grid grid-cols-6 gap-4">
              <div class="col-span-3">
                <h3 class="text-sm font-medium text-text-secondary mb-1">
                  姓名
                </h3>
                <p class="text-text">
                  {{ applicationStore.form.contactPerson.name }}
                </p>
              </div>
              <div class="col-span-3">
                <h3 class="text-sm font-medium text-text-secondary mb-1">
                  身分證字號
                </h3>
                <p class="text-text">
                  {{ applicationStore.form.contactPerson.idNumber }}
                </p>
              </div>
              <div class="col-span-6">
                <h3 class="text-sm font-medium text-text-secondary mb-1">
                  戶籍地址
                </h3>
                <p class="text-text">
                  {{ applicationStore.form.contactPerson.address }}
                </p>
              </div>
            </div>
          </div>

          <div class="border-t border-border pt-6">
            <h3 class="text-lg font-semibold text-text mb-4">股東資料</h3>
            <div
              v-for="(shareholder, index) in applicationStore.form.shareholders"
              :key="index"
              class="mb-6"
            >
              <h4 class="text-md font-medium text-text mb-3">
                股東 {{ index + 1 }}
              </h4>
              <div class="grid grid-cols-6 gap-4">
                <div class="col-span-3">
                  <h3 class="text-sm font-medium text-text-secondary mb-1">
                    姓名
                  </h3>
                  <p class="text-text">{{ shareholder.name }}</p>
                </div>
                <div class="col-span-3">
                  <h3 class="text-sm font-medium text-text-secondary mb-1">
                    身分證字號
                  </h3>
                  <p class="text-text">{{ shareholder.idNumber }}</p>
                </div>
                <div class="col-span-6">
                  <h3 class="text-sm font-medium text-text-secondary mb-1">
                    戶籍地址
                  </h3>
                  <p class="text-text">{{ shareholder.address }}</p>
                </div>
              </div>
              <USeparator
                v-if="index !== applicationStore.form.shareholders.length - 1"
                class="my-4"
              />
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
const organizationTypes = [
  { label: "股份有限公司", value: "limited_company" },
  { label: "有限公司", value: "company_limited" },
  { label: "獨資", value: "sole_proprietorship" },
  { label: "合夥", value: "partnership" },
];

const applicationStore = useCompanyApplicationStore();
const isSubmitting = ref(false);

function getOrganizationTypeLabel(value: string) {
  return organizationTypes.find((type) => type.value === value)?.label || value;
}

function goBack() {
  navigateTo("/apply");
}

async function handleSubmit() {
  isSubmitting.value = true;
  try {
    // TODO: Implement form submission
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    // Show success message and redirect
    navigateTo("/apply/success");
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>
