<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">公司註冊申請審核</h1>
      <UButton color="primary" @click="refreshCases">刷新列表</UButton>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UFormGroup label="狀態">
          <USelect
            v-model="filters.status"
            :options="statusOptions"
            placeholder="選擇狀態"
          />
        </UFormGroup>
        <UFormGroup label="提交日期">
          <UInput
            v-model="filters.dateRange"
            type="date"
            placeholder="選擇日期"
          />
        </UFormGroup>
        <UFormGroup label="搜索">
          <UInput
            v-model="filters.search"
            placeholder="公司名稱/申請人"
            icon="i-heroicons-magnifying-glass"
          />
        </UFormGroup>
      </div>
    </div>

    <!-- Cases Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <UTable :columns="columns" :rows="filteredCases" :loading="loading">
        <template #status-data="{ row }">
          <UBadge
            :color="getStatusColor((row as any).status)"
            :label="getStatusLabel((row as any).status)"
          />
        </template>
        <template #actions-data="{ row }">
          <div class="flex space-x-2">
            <UButton
              color="primary"
              variant="ghost"
              size="xs"
              @click="viewCaseDetails((row as any).id)"
            >
              查看詳情
            </UButton>
            <UButton
              v-if="(row as any).status === 'pending'"
              color="success"
              variant="ghost"
              size="xs"
              @click="approveCase((row as any).id)"
            >
              批准
            </UButton>
            <UButton
              v-if="(row as any).status === 'pending'"
              color="error"
              variant="ghost"
              size="xs"
              @click="rejectCase((row as any).id)"
            >
              拒絕
            </UButton>
          </div>
        </template>
      </UTable>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex justify-end">
      <UPagination
        v-model="currentPage"
        :total="totalCases"
        :per-page="perPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

// Types
interface RegistrationCase {
  id: string;
  companyName: string;
  applicantName: string;
  submissionDate: string;
  status: "pending" | "approved" | "rejected" | "in-review";
  assignedTo: string;
}

// Router
const router = useRouter();

// State
const loading = ref(false);
const currentPage = ref(1);
const perPage = ref(10);
const totalCases = ref(100); // Dummy total

const filters = ref({
  status: "",
  dateRange: "",
  search: "",
});

// Dummy data
const cases = ref<RegistrationCase[]>([
  {
    id: "REG-001",
    companyName: "上海科技有限公司",
    applicantName: "張三",
    submissionDate: "2023-06-15",
    status: "pending",
    assignedTo: "李四",
  },
  {
    id: "REG-002",
    companyName: "北京貿易有限公司",
    applicantName: "王五",
    submissionDate: "2023-06-14",
    status: "in-review",
    assignedTo: "趙六",
  },
  {
    id: "REG-003",
    companyName: "廣州制造有限公司",
    applicantName: "錢七",
    submissionDate: "2023-06-13",
    status: "approved",
    assignedTo: "孫八",
  },
  {
    id: "REG-004",
    companyName: "深圳服務有限公司",
    applicantName: "周九",
    submissionDate: "2023-06-12",
    status: "rejected",
    assignedTo: "吳十",
  },
]);

// Computed
const statusOptions = [
  { label: "全部", value: "" },
  { label: "待審核", value: "pending" },
  { label: "審核中", value: "in-review" },
  { label: "已批准", value: "approved" },
  { label: "已拒絕", value: "rejected" },
];

const columns = [
  {
    key: "id",
    label: "申請編號",
  },
  {
    key: "companyName",
    label: "公司名稱",
  },
  {
    key: "applicantName",
    label: "申請人",
  },
  {
    key: "submissionDate",
    label: "提交日期",
  },
  {
    key: "status",
    label: "狀態",
  },
  {
    key: "assignedTo",
    label: "審核人",
  },
  {
    key: "actions",
    label: "操作",
  },
];

const filteredCases = computed(() => {
  let result = [...cases.value];

  // Apply status filter
  if (filters.value.status) {
    result = result.filter((item) => item.status === filters.value.status);
  }

  // Apply date filter
  if (filters.value.dateRange) {
    result = result.filter(
      (item) => item.submissionDate === filters.value.dateRange
    );
  }

  // Apply search filter
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase();
    result = result.filter(
      (item) =>
        item.companyName.toLowerCase().includes(searchTerm) ||
        item.applicantName.toLowerCase().includes(searchTerm)
    );
  }

  return result;
});

// Methods
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "warning";
    case "in-review":
      return "info";
    case "approved":
      return "success";
    case "rejected":
      return "error";
    default:
      return "neutral";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "待審核";
    case "in-review":
      return "審核中";
    case "approved":
      return "已批准";
    case "rejected":
      return "已拒絕";
    default:
      return "未知";
  }
};

const refreshCases = () => {
  loading.value = true;
  // Simulate API call
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const viewCaseDetails = (id: string) => {
  router.push(`/cpa/cases/registrations/${id}`);
};

const approveCase = (id: string) => {
  // In a real implementation, this would call an API
  const caseIndex = cases.value.findIndex((item) => item.id === id);
  if (caseIndex !== -1 && cases.value[caseIndex]) {
    cases.value[caseIndex].status = "approved";
  }
};

const rejectCase = (id: string) => {
  // In a real implementation, this would call an API
  const caseIndex = cases.value.findIndex((item) => item.id === id);
  if (caseIndex !== -1 && cases.value[caseIndex]) {
    cases.value[caseIndex].status = "rejected";
  }
};
</script>
