<template>
  <UContainer class="py-8 space-y-8">
    <!-- Header -->
    <div class="text-center">
      <UBadge
        icon="i-lucide-clipboard-check"
        label="申請確認"
        color="primary"
        variant="subtle"
        size="xl"
        class="mb-4"
      />
      <h1 class="text-4xl font-bold text-gray-900 mb-3">確認申請資料</h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        請仔細檢查以下資料是否正確，確認後將無法修改
      </p>
    </div>

    <!-- Company Basic Information -->
    <CompanyApplicationConfirmCompanyBasicInfo
      :form-state="formState"
      :is-stock-company="applicationStore.isStockCompany"
    />

    <!-- Person Information Grid -->
    <CompanyApplicationConfirmPersonInfoGrid :form-state="formState" />

    <!-- Shareholders Information -->
    <CompanyApplicationConfirmShareholdersInfo
      :shareholders="formState.shareholders"
      :is-stock-company="applicationStore.isStockCompany"
    />

    <!-- Share Summary (for stock companies) -->
    <CompanyApplicationConfirmShareSummary
      :shareholders="formState.shareholders"
      :is-stock-company="applicationStore.isStockCompany"
    />

    <!-- Final Summary Alert -->
    <UAlert
      icon="i-lucide-alert-triangle"
      color="warning"
      variant="soft"
      title="提交前確認"
      description="請再次確認所有資料正確無誤。提交後將無法修改，並將進入審核程序。"
      class="border-2 border-amber-200"
    />

    <!-- Confirmation Actions -->
    <CompanyApplicationConfirmConfirmationActions
      :is-submitting="isSubmitting"
      @go-back="goBack"
      @submit="submitApplication"
    />
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "apply-confirm",
});

const toast = useToast();
const applicationStore = useCompanyApplicationStore();
const { formState } = storeToRefs(applicationStore);
const isSubmitting = ref(false);

// Go back to form
const goBack = () => {
  navigateTo("/apply");
};

// Submit the application
const submitApplication = async () => {
  isSubmitting.value = true;

  try {
    const submitData = structuredClone(toRaw(formState.value));

    const { application } = await $fetch("/api/applications/create", {
      method: "POST",
      body: submitData,
    });

    if (!application) {
      throw new Error("Failed to submit application");
    }

    applicationStore.markSubmissionSuccess(
      application.id,
      application.createdAt
    );

    toast.add({
      title: "申請提交成功",
      description: "您的公司設立申請已成功提交，我們會盡快處理",
      color: "success",
      icon: "i-lucide-check-circle",
    });

    // Navigate to success page with query parameters
    navigateTo({
      path: "/apply/success",
      query: {
        id: application.id,
        submitted: application.createdAt,
      },
    });
  } catch (error) {
    console.error("Error submitting form:", error);
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
