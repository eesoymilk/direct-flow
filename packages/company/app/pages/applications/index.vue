<template>
  <!-- TODO: Make this page only accessible to staff -->
  <!-- TODO: Make this page prettier -->
  <!-- TODO: Add search and filter -->
  <UContainer class="py-8 space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-primary mb-2">申請案件管理</h1>
      <p class="text-text-secondary">查看和管理所有公司設立申請案件</p>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-8">
      <UIcon
        name="i-lucide-loader-2"
        class="w-8 h-8 animate-spin mx-auto mb-4"
      />
      <p>載入申請案件中...</p>
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

    <!-- Applications List -->
    <div v-else-if="data" class="space-y-6">
      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UCard class="text-center">
          <div class="text-2xl font-bold text-primary">
            {{ data.totalCount }}
          </div>
          <div class="text-sm text-text-secondary">總申請數</div>
        </UCard>
        <UCard class="text-center">
          <div class="text-2xl font-bold text-blue-600">
            {{ getStatusCount("submitted") }}
          </div>
          <div class="text-sm text-text-secondary">已提交</div>
        </UCard>
        <UCard class="text-center">
          <div class="text-2xl font-bold text-yellow-600">
            {{ getStatusCount("staff_review") }}
          </div>
          <div class="text-sm text-text-secondary">審核中</div>
        </UCard>
        <UCard class="text-center">
          <div class="text-2xl font-bold text-green-600">
            {{ getStatusCount("approved") }}
          </div>
          <div class="text-sm text-text-secondary">已核准</div>
        </UCard>
      </div>

      <!-- Applications Table -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">申請案件列表</h3>
            <div class="text-sm text-text-secondary">
              第 {{ filters.page }} 頁，共
              {{ Math.ceil(data.totalCount / filters.limit) }} 頁
            </div>
          </div>
        </template>

        <UTable
          :data="data.applications"
          :columns="columns"
          :loading="pending"
          @select="(row) => viewApplication(row.original.id)"
          empty="目前沒有任何申請案件"
        />

        <!-- Pagination -->
        <template #footer>
          <div class="flex items-center justify-between">
            <div class="text-sm text-text-secondary">
              顯示
              {{ (filters.page - 1) * filters.limit + 1 }} -
              {{ Math.min(filters.page * filters.limit, data.totalCount) }}
              筆，共
              {{ data.totalCount }}
              筆
            </div>
            <div class="flex gap-2">
              <UButton
                size="sm"
                variant="outline"
                :disabled="filters.page <= 1"
                @click="changePage(filters.page - 1)"
              >
                上一頁
              </UButton>
              <UButton
                size="sm"
                variant="outline"
                :disabled="
                  filters.page >= Math.ceil(data.totalCount / filters.limit)
                "
                @click="changePage(filters.page + 1)"
              >
                下一頁
              </UButton>
            </div>
          </div>
        </template>
      </UCard>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <UIcon
        name="i-lucide-file-text"
        class="w-12 h-12 text-gray-400 mx-auto mb-4"
      />
      <p class="text-text-secondary">目前沒有任何申請案件</p>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
// TODO: Filter system
const filters = ref<{
  page: number;
  limit: number;
}>({
  page: 1,
  limit: 10,
});

const { data, pending, error, refresh } = useLazyFetch("/api/applications", {
  query: filters,
});

const columns = [
  {
    accessorKey: "id",
    header: "申請編號",
  },
  {
    accessorKey: "candicateNames",
    header: "公司名稱",
    cell: ({ row }: { row: any }) => {
      return row.original.candicateNames.join(", ");
    },
  },
  {
    accessorKey: "organizationType",
    header: "組織類型",
    cell: ({ row }: { row: any }) => {
      return getOrganizationTypeLabel(row.original.organizationType);
    },
  },
  {
    accessorKey: "responsiblePerson",
    header: "負責人",
    cell: ({ row }: { row: any }) => {
      return row.original.responsiblePerson.name;
    },
  },
  {
    accessorKey: "status",
    header: "狀態",
    cell: ({ row }: { row: any }) => {
      return getStatusLabel(row.original.status);
    },
  },
  {
    accessorKey: "createdAt",
    header: "申請日期",
    cell: ({ row }: { row: any }) => {
      return formatDate(row.original.createdAt);
    },
  },
];

// Helper functions
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

const getStatusCount = (status: string) => {
  return data.value?.applications.filter((app: any) => app.status === status)
    .length;
};

const changePage = (page: number) => {
  // TODO: Implement pagination
  console.log("Change to page:", page);
};

const viewApplication = (id: string) => {
  navigateTo(`/applications/${id}`);
};

const handleRefresh = () => {
  refresh();
};
</script>
