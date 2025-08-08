<template>
  <UContainer class="py-8 space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-primary mb-2">確認申請資料</h1>
      <p class="text-text-secondary">
        請仔細檢查以下資料是否正確，確認後將無法修改
      </p>
    </div>

    <!-- Company Basic Information -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-house" class="w-5 h-5" />
          <h3 class="text-lg font-semibold">公司基本資料</h3>
        </div>
      </template>

      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-500">候選公司名稱</label>
          <div class="mt-1 space-y-1">
            <div
              v-for="(name, index) in form.candicateNames"
              :key="index"
              class="p-2 bg-gray-50 rounded border"
            >
              {{ name }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-500">組織類型</label>
            <p class="mt-1">
              {{ getOrganizationTypeLabel(form.organizationType) }}
            </p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">公司地址</label>
            <p class="mt-1">{{ form.address }}</p>
          </div>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-500">營業項目描述</label>
          <p class="mt-1">{{ form.businessItemsDescription }}</p>
        </div>
      </div>
    </UCard>

    <!-- Responsible Person Information -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-user" class="w-5 h-5" />
          <h3 class="text-lg font-semibold">負責人資料</h3>
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="text-sm font-medium text-gray-500">姓名</label>
          <p class="mt-1">{{ form.responsiblePerson?.name }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-500">身分證字號</label>
          <p class="mt-1">{{ form.responsiblePerson?.idNumber }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-500">地址</label>
          <p class="mt-1">{{ form.responsiblePerson?.address }}</p>
        </div>
      </div>
    </UCard>

    <!-- Contact Person Information -->
    <UCard v-if="!form.isContactPersonSameAsResponsiblePerson">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-phone" class="w-5 h-5" />
          <h3 class="text-lg font-semibold">聯絡人資料</h3>
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="text-sm font-medium text-gray-500">姓名</label>
          <p class="mt-1">{{ form.contactPerson?.name }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-500">身分證字號</label>
          <p class="mt-1">{{ form.contactPerson?.idNumber }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-500">地址</label>
          <p class="mt-1">{{ form.contactPerson?.address }}</p>
        </div>
      </div>
    </UCard>

    <!-- Director Information -->
    <UCard v-if="!form.isDirectorSameAsResponsiblePerson">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-briefcase" class="w-5 h-5" />
          <h3 class="text-lg font-semibold">董事資料</h3>
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="text-sm font-medium text-gray-500">姓名</label>
          <p class="mt-1">{{ form.director?.name }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-500">身分證字號</label>
          <p class="mt-1">{{ form.director?.idNumber }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-500">地址</label>
          <p class="mt-1">{{ form.director?.address }}</p>
        </div>
      </div>
    </UCard>

    <!-- Shareholders Information -->
    <UCard v-if="form.shareholders && form.shareholders.length > 0">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-users" class="w-5 h-5" />
          <h3 class="text-lg font-semibold">股東資料</h3>
        </div>
      </template>

      <div class="space-y-4">
        <div
          v-for="(shareholder, index) in form.shareholders"
          :key="index"
          class="p-4 bg-gray-50 rounded-lg"
        >
          <h4 class="font-medium mb-2">股東 {{ index + 1 }}</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-500">姓名</label>
              <p class="mt-1">{{ shareholder.name }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500"
                >身分證字號</label
              >
              <p class="mt-1">{{ shareholder.idNumber }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">地址</label>
              <p class="mt-1">{{ shareholder.address }}</p>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Confirmation Actions -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
      <UButton color="neutral" variant="outline" size="lg" @click="goBack">
        返回修改
      </UButton>
      <UButton
        color="primary"
        size="lg"
        :loading="isSubmitting"
        @click="submitApplication"
      >
        確認提交申請
      </UButton>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const applicationStore = useCompanyApplicationStore();
const form = applicationStore.form;
const isSubmitting = ref(false);

// Get organization type label
const getOrganizationTypeLabel = (type: string | undefined) => {
  if (!type) return "未選擇";

  const labels = {
    limited_company: "有限公司",
    company_limited: "股份有限公司",
    sole_proprietorship: "獨資企業",
    partnership: "合夥企業",
  };
  return labels[type as keyof typeof labels] || type;
};

// Go back to form
const goBack = () => {
  navigateTo("/apply");
};

// Submit the application
const submitApplication = async () => {
  try {
    isSubmitting.value = true;

    // Submit to API
    const response = await $fetch("/api/company-application", {
      method: "POST",
      body: form,
    });

    // Show success notification
    const toast = useToast();
    toast.add({
      title: "申請提交成功",
      description: "您的公司設立申請已成功提交，我們會盡快處理",
      color: "success",
      icon: "i-lucide-check-circle",
    });

    // Reset form after successful submission
    applicationStore.resetForm();

    // Navigate to success page
    await navigateTo({
      path: "/apply/success",
      query: { id: (response as any)?.data?.application?.id },
    });
  } catch (error) {
    console.error("Error submitting form:", error);

    // Show error notification
    const toast = useToast();
    toast.add({
      title: "提交失敗",
      description:
        error instanceof Error
          ? error.message
          : "提交申請時發生錯誤，請稍後再試",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>
