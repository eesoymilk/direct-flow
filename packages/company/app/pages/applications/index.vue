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
      <UButton class="mt-4" @click="handleRefresh"> 重新載入 </UButton>
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
            {{ statusCounts.submitted || 0 }}
          </div>
          <div class="text-sm text-text-secondary">已提交</div>
        </UCard>
        <UCard class="text-center">
          <div class="text-2xl font-bold text-yellow-600">
            {{ statusCounts.staff_review || 0 }}
          </div>
          <div class="text-sm text-text-secondary">審核中</div>
        </UCard>
        <UCard class="text-center">
          <div class="text-2xl font-bold text-green-600">
            {{ statusCounts.approved || 0 }}
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
          empty="目前沒有任何申請案件"
          @select="(row) => viewApplication(row.original.id)"
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
        :size="12"
        class="text-gray-400 mx-auto mb-4"
      />
      <p class="text-text-secondary">目前沒有任何申請案件</p>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type { TableRow } from "@nuxt/ui";
import { format } from "date-fns";
import type { InternalApi } from "nitropack";

type Row = TableRow<
  InternalApi["/api/applications"]["get"]["applications"][number]
>;

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

const columns = computed(() => [
  {
    accessorKey: "id",
    header: "申請編號",
  },
  {
    accessorKey: "candidateNames",
    header: "公司名稱",
    cell: ({ row }: { row: Row }) => {
      return row.original.candidateNames.join(", ");
    },
  },
  {
    accessorKey: "organizationType",
    header: "組織類型",
    cell: ({ row }: { row: Row }) => {
      return getOrganizationTypeLabel(row.original.organizationType);
    },
  },
  {
    accessorKey: "responsiblePerson",
    header: "負責人",
    cell: ({ row }: { row: Row }) => {
      return row.original.responsiblePerson?.name || "未填寫";
    },
  },
  {
    accessorKey: "status",
    header: "狀態",
    cell: ({ row }: { row: Row }) => {
      return getApplicationStatusLabel(row.original.status);
    },
  },
  {
    accessorKey: "createdAt",
    header: "申請日期",
    cell: ({ row }: { row: Row }) => {
      return format(row.original.createdAt, "yyyy/MM/dd HH:mm:ss");
    },
  },
]);

const statusCounts = computed(() => {
  if (!data.value?.applications) return {};

  const counts: Record<string, number> = {};
  data.value.applications.forEach((app: any) => {
    counts[app.status] = (counts[app.status] || 0) + 1;
  });

  return counts;
});

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
