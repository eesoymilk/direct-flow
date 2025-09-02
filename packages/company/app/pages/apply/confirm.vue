<template>
  <UContainer class="py-8 space-y-8">
    <!-- Header -->
    <div class="text-center">
      <UBadge
        icon="i-lucide-clipboard-check"
        label="申請確認"
        color="primary"
        variant="subtle"
        class="mb-4"
      />
      <h1 class="text-4xl font-bold text-gray-900 mb-3">確認申請資料</h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        請仔細檢查以下資料是否正確，確認後將無法修改
      </p>
    </div>

    <!-- Company Basic Information -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-building-2" class="w-6 h-6 text-blue-600" />
            <h3 class="text-xl font-bold text-gray-900">公司基本資料</h3>
          </div>
          <UBadge color="success" variant="subtle">
            <UIcon name="i-lucide-check" class="w-3 h-3 mr-1" />
            已填寫
          </UBadge>
        </div>
      </template>

      <div class="space-y-6">
        <!-- Company Names -->
        <div>
          <div class="flex items-center gap-2 mb-3">
            <UIcon
              name="i-lucide-text-cursor-input"
              class="w-4 h-4 text-gray-500"
            />
            <label class="text-sm font-semibold text-gray-700 tracking-wide">
              候選公司名稱
            </label>
          </div>
          <div class="flex items-center gap-3 md:gap-4">
            <UChip
              v-for="(name, index) in form.candidateNames"
              :key="index"
              :text="index + 1"
              position="top-left"
              color="secondary"
              size="3xl"
            >
              <UBadge
                :label="name"
                color="primary"
                :variant="index === 0 ? 'solid' : 'soft'"
                size="xl"
              />
            </UChip>
          </div>
        </div>

        <!-- Company Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Organization Type -->
          <InfoDisplay
            label="組織類型"
            icon="i-lucide-building"
            :value="organizationTypeLabel"
          />

          <!-- Address -->
          <InfoDisplay
            label="公司地址"
            icon="i-lucide-map-pin"
            :value="form.address"
          />

          <!-- Capital Amount -->
          <InfoDisplay
            v-if="form.capitalAmount"
            class="md:col-span-2"
            label="資本額"
            icon="i-lucide-banknote"
            :value="form.capitalAmount"
            variant="highlighted"
            :formatter="(val) => `NT$ ${val?.toLocaleString()}`"
          />
        </div>

        <!-- Share information for stock companies -->
        <div
          v-if="
            applicationStore.isStockCompany &&
            (form.authorizedShares ||
              form.ordinaryShares ||
              form.preferredShares ||
              form.hasParValueFreeShares)
          "
        >
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-lucide-pie-chart" class="w-4 h-4 text-gray-500" />
            <label class="text-sm font-semibold text-gray-700 tracking-wide"
              >股份結構</label
            >
          </div>

          <div
            v-if="applicationStore.isStockCompany"
            class="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <ShareCard
              v-if="form.authorizedShares && form.authorizedShares > 0"
              label="實收資本額股數"
              icon="i-lucide-calculator"
              :shares="form.authorizedShares"
              color="blue"
            />

            <ShareCard
              v-if="form.ordinaryShares"
              label="普通股"
              icon="i-lucide-trending-up"
              :shares="form.ordinaryShares"
              color="green"
            />

            <ShareCard
              v-if="form.preferredShares"
              label="特別股"
              icon="i-lucide-star"
              :shares="form.preferredShares"
              color="purple"
            />
          </div>

          <UAlert
            v-if="
              form.hasParValueFreeShares &&
              form.organizationType === 'company_limited' &&
              form.isCloselyHeld
            "
            icon="i-lucide-info"
            color="primary"
            variant="soft"
            title="股份型態"
            description="採用無票面金額股份"
            class="mt-4"
          />
        </div>

        <!-- Business Description -->
        <InfoDisplay
          label="營業項目描述"
          icon="i-lucide-briefcase"
          :value="form.businessItemsDescription"
          full-width
        />
      </div>
    </UCard>

    <!-- Person Information Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Responsible Person Information -->
      <UCard
        class="ring-1 ring-gray-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300 h-fit"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-100 rounded-lg">
              <UIcon name="i-lucide-user-check" class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900">負責人</h3>
              <p class="text-sm text-gray-500">責任代表人</p>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <div>
            <label class="text-xs font-semibold text-gray-500 tracking-wide"
              >姓名</label
            >
            <p class="text-lg font-bold text-gray-900 mt-1">
              {{ form.responsiblePerson?.name }}
            </p>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-500 tracking-wide"
              >身分證字號</label
            >
            <p
              class="font-mono text-sm text-gray-700 mt-1 bg-gray-50 px-2 py-1 rounded"
            >
              {{ form.responsiblePerson?.idNumber }}
            </p>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-500 tracking-wide"
              >地址</label
            >
            <p class="text-sm text-gray-700 mt-1 leading-relaxed">
              {{ form.responsiblePerson?.address }}
            </p>
          </div>
        </div>
      </UCard>

      <!-- Director Information -->
      <UCard
        v-if="!form.isDirectorSameAsResponsiblePerson"
        class="ring-1 ring-gray-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300 h-fit"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-purple-100 rounded-lg">
              <UIcon
                name="i-lucide-briefcase"
                class="w-5 h-5 text-purple-600"
              />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900">董事</h3>
              <p class="text-sm text-gray-500">公司董事</p>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <div>
            <label class="text-xs font-semibold text-gray-500 tracking-wide">
              姓名
            </label>
            <p class="text-lg font-bold text-gray-900 mt-1">
              {{ form.director?.name }}
            </p>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-500 tracking-wide">
              身分證字號
            </label>
            <p
              class="font-mono text-sm text-gray-700 mt-1 bg-gray-50 px-2 py-1 rounded"
            >
              {{ form.director?.idNumber }}
            </p>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-500 tracking-wide">
              地址
            </label>
            <p class="text-sm text-gray-700 mt-1 leading-relaxed">
              {{ form.director?.address }}
            </p>
          </div>
        </div>
      </UCard>
      <UAlert
        v-else
        icon="i-lucide-briefcase"
        color="primary"
        variant="soft"
        title="董事"
        description="與負責人相同"
      />

      <!-- Contact Person Information -->
      <UCard
        v-if="
          !form.isContactPersonSameAsResponsiblePerson &&
          !form.isContactPersonSameAsDirector
        "
        class="ring-1 ring-gray-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300 h-fit"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-green-100 rounded-lg">
              <UIcon name="i-lucide-phone" class="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900">聯絡人</h3>
              <p class="text-sm text-gray-500">主要聯絡窗口</p>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <div>
            <label class="text-xs font-semibold text-gray-500 tracking-wide"
              >姓名</label
            >
            <p class="text-lg font-bold text-gray-900 mt-1">
              {{ form.contactPerson?.name }}
            </p>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-500 tracking-wide"
              >身分證字號</label
            >
            <p
              class="font-mono text-sm text-gray-700 mt-1 bg-gray-50 px-2 py-1 rounded"
            >
              {{ form.contactPerson?.idNumber }}
            </p>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-500 tracking-wide"
              >地址</label
            >
            <p class="text-sm text-gray-700 mt-1 leading-relaxed">
              {{ form.contactPerson?.address }}
            </p>
          </div>
        </div>
      </UCard>
      <UAlert
        v-else
        icon="i-lucide-user-check"
        color="primary"
        variant="soft"
        title="聯絡人"
        description="與負責人相同"
      />
    </div>

    <!-- Shareholders Information -->
    <UCard
      v-if="form.shareholders && form.shareholders.length > 0"
      class="ring-1 ring-gray-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-users" class="w-6 h-6 text-orange-600" />
            <div>
              <h3 class="text-xl font-bold text-gray-900">股東資料</h3>
              <p class="text-sm text-gray-500">
                共 {{ form.shareholders.length }} 位股東
              </p>
            </div>
          </div>
          <UBadge
            :label="`${form.shareholders.length} 人`"
            variant="subtle"
            size="lg"
          />
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UCard
          v-for="(shareholder, index) in form.shareholders"
          :key="index"
          :class="[
            shareholder.isReadonly
              ? 'border-2 border-blue-200 bg-blue-50/30'
              : 'border-2 border-gray-200 bg-white',
          ]"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-user" class="w-5 h-5 text-gray-600" />
                <h4 class="font-bold text-gray-900">股東 {{ index + 1 }}</h4>
              </div>
              <div class="flex gap-1">
                <UBadge
                  v-if="shareholder.isReadonly"
                  icon="i-lucide-lock"
                  label="既有人員"
                  color="primary"
                  variant="soft"
                  size="lg"
                />
                <UBadge
                  v-if="applicationStore.isStockCompany && shareholder.shares"
                  :label="`${shareholder.shares?.toLocaleString()} 股`"
                  color="success"
                  variant="soft"
                  size="lg"
                />
              </div>
            </div>
          </template>

          <div class="space-y-3">
            <div>
              <label class="text-xs font-semibold text-gray-500 tracking-wide"
                >姓名</label
              >
              <p class="text-lg font-bold text-gray-900 mt-1">
                {{ shareholder.name }}
              </p>
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500 tracking-wide"
                >身分證字號</label
              >
              <p
                class="font-mono text-sm text-gray-700 mt-1 bg-gray-50 px-2 py-1 rounded"
              >
                {{ shareholder.idNumber }}
              </p>
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500 tracking-wide"
                >地址</label
              >
              <p class="text-sm text-gray-700 mt-1 leading-relaxed">
                {{ shareholder.address }}
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </UCard>

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
    <div class="flex flex-col sm:flex-row gap-6 justify-center pt-8">
      <UButton
        color="neutral"
        variant="outline"
        size="xl"
        @click="goBack"
        class="min-w-[200px] shadow-md hover:shadow-lg transition-shadow"
      >
        <UIcon name="i-lucide-arrow-left" class="w-5 h-5 mr-2" />
        返回修改
      </UButton>
      <UButton
        color="primary"
        size="xl"
        icon="i-lucide-send"
        :disabled="isSubmitting"
        :loading="isSubmitting"
        :label="!isSubmitting ? '確認提交申請' : '提交中...'"
        @click="submitApplication"
        class="min-w-[200px] shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
      />
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "apply-confirm",
});

const toast = useToast();
const applicationStore = useCompanyApplicationStore();
const form = applicationStore.form;
const isSubmitting = ref(false);

// Get organization type label
const organizationTypeLabel = computed(() => {
  if (!applicationStore.form.organizationType) return "未選擇";

  const labels = {
    company_limited: applicationStore.form.isCloselyHeld
      ? "閉鎖型股份有限公司"
      : "股份有限公司",
    closely_held_company_limited: "閉鎖型股份有限公司",
    limited_company: "有限公司",
    sole_proprietorship: "獨資企業",
    partnership: "合夥企業",
  };
  return (
    labels[applicationStore.form.organizationType as keyof typeof labels] ||
    applicationStore.form.organizationType
  );
});

// Go back to form
const goBack = () => {
  navigateTo("/apply");
};

// Submit the application
const submitApplication = async () => {
  isSubmitting.value = true;

  try {
    const submitData = structuredClone(toRaw(form));
    if (
      submitData.organizationType === "company_limited" &&
      submitData.isCloselyHeld
    ) {
      submitData.organizationType = "closely_held_company_limited";
    }

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

    applicationStore.resetForm();

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
