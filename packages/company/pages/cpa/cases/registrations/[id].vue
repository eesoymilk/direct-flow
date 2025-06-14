<template>
  <UContainer class="space-y-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-primary">公司註冊申請審核</h1>
          <UBadge
            :color="getStatusColor(registrationCase.status)"
            :label="getStatusLabel(registrationCase.status)"
          />
        </div>
        <p class="text-sm text-neutral-500">
          申請編號: {{ $route.params.id as string }}
        </p>
      </div>
      <UButton
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        @click="router.back()"
      >
        返回列表
      </UButton>
    </div>

    <!-- Status Banner -->
    <UCard>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-gray-500">
            提交日期: {{ formatDate(registrationCase.createdAt) }}
          </span>
        </div>
        <div class="flex space-x-2">
          <UButton
            v-if="registrationCase.status === 'pending'"
            size="lg"
            color="success"
            @click="approveCase"
          >
            批准申請
          </UButton>
          <UButton
            v-if="registrationCase.status === 'pending'"
            size="lg"
            color="error"
            variant="outline"
            @click="rejectCase"
          >
            拒絕申請
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- Main Content -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Tabs -->
      <UTabs :items="tabsItems" class="col-span-8">
        <template #basic>
          <div class="space-y-4">
            <h2 class="text-xl font-semibold text-primary">公司基本資料</h2>
            <div class="grid grid-cols-5 gap-2 items-center">
              <h3 class="col-span-1 text-md font-semibold text-secondary">
                公司名稱
              </h3>
              <UInput
                class="col-span-4 w-full"
                disabled
                :value="registrationCase.data.name"
              />
              <h3 class="col-span-1 text-md font-semibold text-secondary">
                營業項目
              </h3>
              <UInput
                class="col-span-4 w-full"
                disabled
                :value="registrationCase.data.businessItems"
              />
              <h3 class="col-span-1 text-md font-semibold text-secondary">
                公司地址
              </h3>
              <UInput
                class="col-span-4 w-full"
                disabled
                :value="registrationCase.data.address"
              />
              <h3 class="col-span-1 text-md font-semibold text-secondary">
                房屋稅繳納憑證
              </h3>
              <UPopover>
                <UButton
                  label="查看文件"
                  color="info"
                  variant="outline"
                  class="col-span-4 w-full flex justify-center"
                />
                <template #content>
                  <div class="size-48 m-4 inline-flex"></div>
                </template>
              </UPopover>
            </div>
            <USeparator />
            <h2 class="text-xl font-semibold text-primary">負責人資料</h2>
            <div class="grid grid-cols-5 gap-2 items-center">
              <h3 class="col-span-1 text-md font-semibold text-secondary">
                姓名
              </h3>
              <UInput
                class="col-span-4 w-full"
                disabled
                :value="registrationCase.data.responsiblePerson.name"
              />
              <h3 class="col-span-1 text-md font-semibold text-secondary">
                身分證字號
              </h3>
              <UInput
                class="col-span-4 w-full"
                disabled
                :value="registrationCase.data.responsiblePerson.idNumber"
              />
              <h3 class="col-span-1 text-md font-semibold text-secondary">
                地址
              </h3>
              <UInput
                class="col-span-4 w-full"
                disabled
                :value="registrationCase.data.responsiblePerson.address"
              />
              <h3 class="col-span-1 text-md font-semibold text-secondary">
                身份證正面
              </h3>
              <UPopover>
                <UButton
                  label="查看文件"
                  color="info"
                  variant="outline"
                  class="col-span-4 w-full flex justify-center"
                />
                <template #content>
                  <div class="size-48 m-4 inline-flex"></div>
                </template>
              </UPopover>
              <h3 class="col-span-1 text-md font-semibold text-secondary">
                身份證背面
              </h3>
              <UPopover>
                <UButton
                  label="查看文件"
                  color="info"
                  variant="outline"
                  class="col-span-4 w-full flex justify-center"
                />
                <template #content>
                  <div class="size-48 m-4 inline-flex"></div>
                </template>
              </UPopover>
            </div>
          </div>
        </template>

        <template #personnel>
          <div class="space-y-4">
            <!-- Director Section -->
            <h2 class="text-xl font-semibold text-primary">董事資料</h2>
            <div class="grid grid-cols-5 gap-2">
              <h3 class="col-span-1 text-md font-semibold text-secondary">
                姓名
              </h3>
              <UInput
                class="col-span-4 w-full"
                disabled
                :value="registrationCase.data.director.name"
              />
              <h3 class="col-span-1 text-md font-semibold text-secondary">
                身分證字號
              </h3>
              <UInput
                class="col-span-4 w-full"
                disabled
                :value="registrationCase.data.director.idNumber"
              />
              <h3 class="col-span-1 text-md font-semibold text-secondary">
                地址
              </h3>
              <UInput
                class="col-span-4 w-full"
                disabled
                :value="registrationCase.data.director.address"
              />
              <h3 class="col-span-1 text-md font-semibold text-secondary">
                身份證正面
              </h3>
              <UPopover>
                <UButton
                  label="查看文件"
                  color="info"
                  variant="outline"
                  class="col-span-4 w-full flex justify-center"
                />
                <template #content>
                  <div class="size-48 m-4 inline-flex"></div>
                </template>
              </UPopover>
              <h3 class="col-span-1 text-md font-semibold text-secondary">
                身份證背面
              </h3>
              <UPopover>
                <UButton
                  label="查看文件"
                  color="info"
                  variant="outline"
                  class="col-span-4 w-full flex justify-center"
                />
                <template #content>
                  <div class="size-48 m-4 inline-flex"></div>
                </template>
              </UPopover>
            </div>

            <USeparator />

            <!-- Shareholders Section -->
            <h2 class="text-xl font-semibold text-primary">股東資料</h2>
            <div
              v-for="(shareholder, index) in registrationCase.data.shareholders"
              :key="index"
              class="grid grid-cols-5 gap-2"
            >
              <h3 class="col-span-1 text-md font-semibold text-secondary">
                姓名
              </h3>
              <UInput
                class="col-span-4 w-full"
                disabled
                :value="shareholder.name"
              />
              <h3 class="col-span-1 text-md font-semibold text-secondary">
                身分證字號
              </h3>
              <UInput
                class="col-span-4 w-full"
                disabled
                :value="shareholder.idNumber"
              />
              <h3 class="col-span-1 text-md font-semibold text-secondary">
                地址
              </h3>
              <UInput
                class="col-span-4 w-full"
                disabled
                :value="shareholder.address"
              />
              <h3 class="col-span-1 text-md font-semibold text-secondary">
                身份證正面
              </h3>
              <UPopover>
                <UButton
                  label="查看文件"
                  color="info"
                  variant="outline"
                  class="col-span-4 w-full flex justify-center"
                />
                <template #content>
                  <div class="size-48 m-4 inline-flex"></div>
                </template>
              </UPopover>
              <h3 class="col-span-1 text-md font-semibold text-secondary">
                身份證背面
              </h3>
              <UPopover>
                <UButton
                  label="查看文件"
                  color="info"
                  variant="outline"
                  class="col-span-4 w-full flex justify-center"
                />
                <template #content>
                  <div class="size-48 m-4 inline-flex"></div>
                </template>
              </UPopover>
              <USeparator class="col-span-5 w-4/5 mx-auto py-2" />
            </div>
          </div>
        </template>

        <template #documents>
          <div class="space-y-4">
            <h2 class="col-span-4 text-xl font-semibold text-primary">
              所需文件
            </h2>
            <div class="grid grid-cols-5 gap-2">
              <h3 class="col-span-1 text-md font-semibold text-secondary">
                銀行存摺正面
              </h3>
              <UPopover>
                <UButton
                  label="查看文件"
                  color="info"
                  variant="outline"
                  class="col-span-4 w-full flex justify-center"
                />
                <template #content>
                  <div class="size-48 m-4 inline-flex"></div>
                </template>
              </UPopover>

              <h3 class="col-span-1 text-md font-semibold text-secondary">
                銀行存摺內頁
              </h3>
              <UPopover>
                <UButton
                  label="查看文件"
                  color="info"
                  variant="outline"
                  class="col-span-4 w-full flex justify-center"
                />
                <template #content>
                  <div class="size-48 m-4 inline-flex"></div>
                </template>
              </UPopover>

              <h3 class="col-span-1 text-md font-semibold text-secondary">
                銀行存摺印鑑頁
              </h3>
              <UPopover>
                <UButton
                  label="查看文件"
                  color="info"
                  variant="outline"
                  class="col-span-4 w-full flex justify-center"
                />
                <template #content>
                  <div class="size-48 m-4 inline-flex"></div>
                </template>
              </UPopover>

              <h3 class="col-span-1 text-md font-semibold text-secondary">
                股東出資證明
              </h3>
              <UPopover>
                <UButton
                  label="查看文件"
                  color="info"
                  variant="outline"
                  class="col-span-4 w-full flex justify-center"
                />
                <template #content>
                  <div class="size-48 m-4 inline-flex"></div>
                </template>
              </UPopover>

              <h3 class="col-span-1 text-md font-semibold text-secondary">
                資金平衡證明
              </h3>
              <UPopover>
                <UButton
                  label="查看文件"
                  color="info"
                  variant="outline"
                  class="col-span-4 w-full flex justify-center"
                />
                <template #content>
                  <div class="size-48 m-4 inline-flex"></div>
                </template>
              </UPopover>

              <h3 class="col-span-1 text-md font-semibold text-secondary">
                房屋使用同意書
              </h3>
              <UPopover>
                <UButton
                  label="查看文件"
                  color="info"
                  variant="outline"
                  class="col-span-4 w-full flex justify-center"
                />
                <template #content>
                  <div class="size-48 m-4 inline-flex"></div>
                </template>
              </UPopover>

              <h3 class="col-span-1 text-md font-semibold text-secondary">
                股東同意書
              </h3>
              <UPopover>
                <UButton
                  label="查看文件"
                  color="info"
                  variant="outline"
                  class="col-span-4 w-full flex justify-center"
                />
                <template #content>
                  <div class="size-48 m-4 inline-flex"></div>
                </template>
              </UPopover>
            </div>
          </div>
        </template>
      </UTabs>

      <!-- Sidebar -->
      <div class="col-span-4 space-y-4">
        <!-- Review Notes -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">審核備註</h2>
          </template>
          <UTextarea
            v-model="reviewNotes"
            placeholder="添加審核備註..."
            class="w-full"
            autoresize
          />
        </UCard>

        <!-- Review History -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">審核歷史</h2>
          </template>
          <div class="space-y-4">
            <div v-for="(history, index) in reviewHistory" :key="index">
              <div class="flex justify-between">
                <span class="font-medium">{{ history.action }}</span>
                <span class="text-gray-500 text-sm">
                  {{ formatDate(history.date) }}
                </span>
              </div>
              <p class="text-gray-600 text-sm mt-1">{{ history.notes }}</p>
              <p class="text-gray-500 text-xs mt-1">
                審核人: {{ history.reviewer }}
              </p>
              <USeparator
                class="mt-4"
                v-if="index !== reviewHistory.length - 1"
              />
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import type { CompanyRegistrationCase } from "~/mocks/cases/registration";
import { registrationCases } from "~/mocks/cases/registration";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";

// Route and Router
const route = useRoute();
const router = useRouter();
const caseId = route.params.id as string;

// State
const reviewNotes = ref("");

// Tabs
const tabsItems: TabsItem[] = [
  { label: "基本資料", slot: "basic" },
  { label: "董事和股東", slot: "personnel" },
  { label: "所需文件", slot: "documents" },
];

// Dummy data
const registrationCase = registrationCases[0] as CompanyRegistrationCase;

// Format date helper
const formatDate = (date: Date) => {
  try {
    return format(date, "yyyy年MM月dd日 HH:mm", {
      locale: zhTW,
    });
  } catch (error) {
    return date.toLocaleString();
  }
};

const reviewHistory = ref([
  {
    action: "提交申請",
    date: new Date("2023-06-15T10:30:00"),
    notes: "客戶提交了公司註冊申請",
    reviewer: "系統",
  },
  {
    action: "分配審核人",
    date: new Date("2023-06-15T11:00:00"),
    notes: "申請已分配給審核人",
    reviewer: "系統",
  },
]);

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

const saveReview = () => {
  // In a real implementation, this would save the review notes to the backend
  console.log("Saving review notes:", reviewNotes.value);
  alert("審核備註已保存");
};

const approveCase = () => {
  // In a real implementation, this would call an API
  registrationCase.status = "approved";
  reviewHistory.value.push({
    action: "批准申請",
    date: new Date(),
    notes: reviewNotes.value || "無備註",
    reviewer: "當前審核人",
  });
  alert("申請已批准");
};

const rejectCase = () => {
  // In a real implementation, this would call an API
  registrationCase.status = "rejected";
  reviewHistory.value.push({
    action: "拒絕申請",
    date: new Date(),
    notes: reviewNotes.value || "無備註",
    reviewer: "當前審核人",
  });
  alert("申請已拒絕");
};

const requestMoreInfo = () => {
  // In a real implementation, this would send a notification to the client
  reviewHistory.value.push({
    action: "請求更多信息",
    date: new Date(),
    notes: reviewNotes.value || "無備註",
    reviewer: "當前審核人",
  });
  alert("已發送請求更多信息的通知");
};

// Load case data on mount
onMounted(() => {
  // In a real implementation, this would fetch the case data from the backend
  console.log("Loading case data for ID:", caseId);
});
</script>
