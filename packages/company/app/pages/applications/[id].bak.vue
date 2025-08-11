<template>
  <CompanyApplicationStaffView :application="data" />
  <UContainer class="py-8 space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <UBreadcrumb :links="breadcrumbLinks" />
        <h1 class="text-3xl font-bold text-primary mt-2">申請案件詳情</h1>
        <p class="text-text-secondary mt-1">查看申請案件的詳細資訊</p>
      </div>
      <div class="flex gap-2">
        <UButton variant="outline" icon="i-lucide-arrow-left" @click="goBack">
          返回列表
        </UButton>
        <UButton color="primary" icon="i-lucide-edit"> 編輯狀態 </UButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-8">
      <UIcon
        name="i-lucide-loader-2"
        class="w-8 h-8 animate-spin mx-auto mb-4"
      />
      <p>載入申請案件詳情中...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <UIcon
        name="i-lucide-alert-circle"
        class="w-8 h-8 text-red-500 mx-auto mb-4"
      />
      <p class="text-red-600">載入失敗: {{ error.message }}</p>
      <UButton @click="handleRefresh" class="mt-4"> 重新載入 </UButton>
    </div>

    <!-- Application Details -->
    <div v-else-if="data && (data as any).id" class="space-y-6">
      <!-- Status Banner -->
      <UCard>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <UBadge
              :color="getStatusColor((data as any).status) as any"
              :label="getStatusLabel((data as any).status)"
              size="lg"
            />
            <div>
              <div class="text-sm text-text-secondary">申請編號</div>
              <div class="font-mono text-sm">{{ (data as any).id }}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm text-text-secondary">申請日期</div>
            <div class="text-sm">{{ formatDate((data as any).createdAt) }}</div>
          </div>
        </div>
      </UCard>

      <!-- Company Information -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-building" class="w-5 h-5" />
            <h3 class="text-lg font-semibold">公司基本資料</h3>
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="text-sm font-medium text-gray-500"
              >候選公司名稱</label
            >
            <div class="mt-2 space-y-2">
              <div
                v-for="(name, index) in (data as any).candicateNames"
                :key="index"
                class="p-3 bg-gray-50 rounded-lg border"
              >
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium">{{ index + 1 }}.</span>
                  <span class="text-sm">{{ name }}</span>
                  <UBadge
                    v-if="index === 0"
                    color="success"
                    label="主要選擇"
                    size="xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-500">組織類型</label>
              <p class="mt-1 text-sm">
                {{ getOrganizationTypeLabel((data as any).organizationType) }}
              </p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-500">公司地址</label>
              <p class="mt-1 text-sm">
                {{ (data as any).address || "未提供" }}
              </p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-500"
                >營業項目描述</label
              >
              <p class="mt-1 text-sm">
                {{ (data as any).businessItemsDescription || "未提供" }}
              </p>
            </div>
          </div>
        </div>
      </UCard>

      <!-- People Information -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Responsible Person -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-user" class="w-5 h-5" />
              <h3 class="text-lg font-semibold">負責人</h3>
            </div>
          </template>

          <div v-if="(data as any).responsiblePerson" class="space-y-3">
            <div>
              <label class="text-sm font-medium text-gray-500">姓名</label>
              <p class="mt-1 text-sm">
                {{ (data as any).responsiblePerson.name }}
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500"
                >身分證字號</label
              >
              <p class="mt-1 text-sm font-mono">
                {{ (data as any).responsiblePerson.idNumber }}
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">地址</label>
              <p class="mt-1 text-sm">
                {{ (data as any).responsiblePerson.address || "未提供" }}
              </p>
            </div>
          </div>
          <div v-else class="text-center py-4 text-text-secondary">
            未提供負責人資料
          </div>
        </UCard>

        <!-- Contact Person -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-phone" class="w-5 h-5" />
              <h3 class="text-lg font-semibold">聯絡人</h3>
            </div>
          </template>

          <div v-if="(data as any).contactPerson" class="space-y-3">
            <div>
              <label class="text-sm font-medium text-gray-500">姓名</label>
              <p class="mt-1 text-sm">{{ (data as any).contactPerson.name }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500"
                >身分證字號</label
              >
              <p class="mt-1 text-sm font-mono">
                {{ (data as any).contactPerson.idNumber }}
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">地址</label>
              <p class="mt-1 text-sm">
                {{ (data as any).contactPerson.address || "未提供" }}
              </p>
            </div>
          </div>
          <div v-else class="text-center py-4 text-text-secondary">
            未提供聯絡人資料
          </div>
        </UCard>

        <!-- Director -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-briefcase" class="w-5 h-5" />
              <h3 class="text-lg font-semibold">董事</h3>
            </div>
          </template>

          <div v-if="(data as any).director" class="space-y-3">
            <div>
              <label class="text-sm font-medium text-gray-500">姓名</label>
              <p class="mt-1 text-sm">{{ (data as any).director.name }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500"
                >身分證字號</label
              >
              <p class="mt-1 text-sm font-mono">
                {{ (data as any).director.idNumber }}
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">地址</label>
              <p class="mt-1 text-sm">
                {{ (data as any).director.address || "未提供" }}
              </p>
            </div>
          </div>
          <div v-else class="text-center py-4 text-text-secondary">
            未提供董事資料
          </div>
        </UCard>
      </div>

      <!-- Shareholders -->
      <UCard
        v-if="
          (data as any).shareholders && (data as any).shareholders.length > 0
        "
      >
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-users" class="w-5 h-5" />
            <h3 class="text-lg font-semibold">股東資料</h3>
            <UBadge
              :label="`${(data as any).shareholders.length} 位股東`"
              size="sm"
            />
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(shareholder, index) in (data as any).shareholders"
            :key="shareholder.id"
            class="p-4 bg-gray-50 rounded-lg border"
          >
            <div class="flex items-center gap-2 mb-3">
              <span class="text-sm font-medium">股東 {{ index + 1 }}</span>
            </div>
            <div class="space-y-2">
              <div>
                <label class="text-xs font-medium text-gray-500">姓名</label>
                <p class="text-sm">{{ shareholder.name }}</p>
              </div>
              <div>
                <label class="text-xs font-medium text-gray-500"
                  >身分證字號</label
                >
                <p class="text-sm font-mono">{{ shareholder.idNumber }}</p>
              </div>
              <div>
                <label class="text-xs font-medium text-gray-500">地址</label>
                <p class="text-sm">{{ shareholder.address || "未提供" }}</p>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Timeline -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-clock" class="w-5 h-5" />
            <h3 class="text-lg font-semibold">處理時程</h3>
          </div>
        </template>

        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div>
              <div class="font-medium">申請提交</div>
              <div class="text-sm text-text-secondary">
                {{ formatDate((data as any).createdAt) }}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div
              class="w-3 h-3 rounded-full"
              :class="
                (data as any).status === 'staff_review'
                  ? 'bg-yellow-500'
                  : 'bg-gray-300'
              "
            ></div>
            <div>
              <div class="font-medium">審核中</div>
              <div class="text-sm text-text-secondary">等待審核</div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div
              class="w-3 h-3 rounded-full"
              :class="
                (data as any).status === 'approved'
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              "
            ></div>
            <div>
              <div class="font-medium">核准完成</div>
              <div class="text-sm text-text-secondary">申請核准</div>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Not Found State -->
    <div v-else class="text-center py-8">
      <UIcon
        name="i-lucide-file-x"
        class="w-12 h-12 text-gray-400 mx-auto mb-4"
      />
      <p class="text-text-secondary">找不到指定的申請案件</p>
      <UButton @click="goBack" class="mt-4"> 返回列表 </UButton>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const route = useRoute();
const applicationId = route.params.id as string;

const { data, pending, error, refresh } = await useLazyFetch(
  `/api/applications/:id`,
  {
    params: { id: applicationId },
  }
);

const breadcrumbLinks = [
  {
    label: "申請案件",
    to: "/applications",
  },
  {
    label: applicationId.slice(0, 8) + "...",
    to: `/applications/${applicationId}`,
  },
];

const getOrganizationTypeLabel = (type: string | null) => {
  if (!type) return "未選擇";

  const labels = {
    limited_company: "有限公司",
    company_limited: "股份有限公司",
    sole_proprietorship: "獨資企業",
    partnership: "合夥企業",
  };
  return labels[type as keyof typeof labels] || type;
};

const getStatusLabel = (status: string) => {
  const labels = {
    submitted: "已提交",
    staff_review: "審核中",
    pending_client_update: "待客戶更新",
    approved: "已核准",
    rejected: "已拒絕",
  };
  return labels[status as keyof typeof labels] || status;
};

const getStatusColor = (
  status: string
): "blue" | "yellow" | "orange" | "green" | "red" | "gray" => {
  const colors = {
    submitted: "blue" as const,
    staff_review: "yellow" as const,
    pending_client_update: "orange" as const,
    approved: "green" as const,
    rejected: "red" as const,
  };
  return colors[status as keyof typeof colors] || "gray";
};

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const goBack = () => {
  navigateTo("/applications");
};

const handleRefresh = () => {
  refresh();
};
</script>
