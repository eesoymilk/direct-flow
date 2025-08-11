<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Main Content Area -->
    <div class="lg:col-span-2 space-y-6">
      <!-- Application Details with Review Mode -->
      <CompanyApplicationDetails
        :application="application"
        :readonly="false"
        :review-mode="true"
        :review-issues="reviewIssues"
        @add-issue="addFieldIssue"
      />

      <!-- Review Actions Panel -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-check-circle" class="w-5 h-5" />
            <h3 class="text-lg font-semibold">審核操作</h3>
          </div>
        </template>

        <div class="space-y-4">
          <!-- Review Notes -->
          <div>
            <label class="text-sm font-medium text-gray-700 mb-2 block">
              審核備註
            </label>
            <UTextarea
              v-model="reviewNotes"
              placeholder="添加審核備註、發現的問題或建議..."
              class="w-full"
              :rows="4"
              autoresize
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3">
            <UButton
              color="success"
              icon="i-lucide-check"
              :loading="isProcessing"
              @click="approveApplication"
            >
              核准申請
            </UButton>

            <UButton
              color="warning"
              icon="i-lucide-edit"
              :loading="isProcessing"
              @click="requestClientUpdate"
            >
              要求客戶更新
            </UButton>

            <UButton
              color="error"
              icon="i-lucide-x"
              :loading="isProcessing"
              @click="rejectApplication"
            >
              拒絕申請
            </UButton>

            <UButton
              variant="outline"
              icon="i-lucide-save"
              :loading="isProcessing"
              @click="saveReviewNotes"
            >
              儲存備註
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Review Checklist -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-clipboard-check" class="w-5 h-5" />
            <h3 class="text-lg font-semibold">審核檢查清單</h3>
          </div>
        </template>

        <div class="space-y-3">
          <div
            v-for="item in reviewChecklist"
            :key="item.id"
            class="flex items-center gap-3 p-3 border rounded-lg"
            :class="
              item.isCompleted
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
            "
          >
            <UCheckbox
              v-model="item.isCompleted"
              :label="item.description"
              class="flex-1"
            />
            <UBadge
              :color="item.isCompleted ? 'success' : 'neutral'"
              :label="item.isCompleted ? '已完成' : '待檢查'"
              size="sm"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Sidebar -->
    <div class="space-y-6">
      <!-- Review Issues Panel -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-alert-circle" class="w-5 h-5" />
              <h3 class="text-lg font-semibold">審核問題</h3>
              <UBadge :label="reviewIssues.length" color="error" size="sm" />
            </div>
            <UButton
              size="sm"
              variant="outline"
              icon="i-lucide-plus"
              @click="showAddIssueModal = true"
            >
              添加
            </UButton>
          </div>
        </template>

        <div class="space-y-3">
          <div
            v-for="issue in reviewIssues"
            :key="issue.id"
            class="p-3 border rounded-lg"
            :class="getIssueSeverityClass(issue.severity)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="font-medium text-sm">
                    {{ issue.fieldName || "一般問題" }}
                  </span>
                  <UBadge
                    :color="getSeverityColor(issue.severity) as any"
                    :label="getSeverityLabel(issue.severity)"
                    size="xs"
                  />
                </div>
                <div class="text-sm text-gray-600 mb-2">
                  {{ issue.internalDescription }}
                </div>
                <div class="text-xs text-gray-500">
                  客戶訊息: {{ issue.clientMessage }}
                </div>
              </div>
              <UButton
                size="xs"
                color="error"
                variant="ghost"
                icon="i-lucide-x"
                @click="removeIssue(issue.id)"
              />
            </div>
          </div>

          <div
            v-if="reviewIssues.length === 0"
            class="text-center py-4 text-gray-500"
          >
            暫無審核問題
          </div>
        </div>
      </UCard>

      <!-- Review History -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-history" class="w-5 h-5" />
            <h3 class="text-lg font-semibold">審核歷史</h3>
          </div>
        </template>

        <div class="space-y-3">
          <div
            v-for="history in reviewHistory"
            :key="history.id"
            class="text-sm border-l-2 border-blue-200 pl-3"
          >
            <div class="flex justify-between items-start">
              <span class="font-medium text-gray-800">{{
                history.action
              }}</span>
              <span class="text-gray-500 text-xs">{{
                formatDate(history.date)
              }}</span>
            </div>
            <div class="text-gray-600 mt-1">{{ history.notes }}</div>
            <div class="text-gray-500 text-xs mt-1">
              審核人: {{ history.reviewer }}
            </div>
          </div>

          <div
            v-if="reviewHistory.length === 0"
            class="text-center py-4 text-gray-500"
          >
            暫無審核記錄
          </div>
        </div>
      </UCard>

      <!-- Quick Actions -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-zap" class="w-5 h-5" />
            <h3 class="text-lg font-semibold">快速操作</h3>
          </div>
        </template>

        <div class="space-y-2">
          <UButton
            variant="outline"
            size="sm"
            icon="i-lucide-download"
            class="w-full justify-start"
            @click="exportApplication"
          >
            匯出申請資料
          </UButton>

          <UButton
            variant="outline"
            size="sm"
            icon="i-lucide-mail"
            class="w-full justify-start"
            @click="sendNotification"
          >
            發送通知給客戶
          </UButton>

          <UButton
            variant="outline"
            size="sm"
            icon="i-lucide-clock"
            class="w-full justify-start"
            @click="setReminder"
          >
            設定提醒
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Add Issue Modal -->
    <UModal v-model="showAddIssueModal">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-plus" class="w-5 h-5" />
            <h3 class="text-lg font-semibold">添加審核問題</h3>
          </div>
        </template>

        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700 mb-2 block">
              問題類型
            </label>
            <USelect
              v-model="newIssue.type"
              :options="issueTypes"
              placeholder="選擇問題類型"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 mb-2 block">
              嚴重程度
            </label>
            <USelect
              v-model="newIssue.severity"
              :options="severityLevels"
              placeholder="選擇嚴重程度"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 mb-2 block">
              相關欄位 (可選)
            </label>
            <USelect
              v-model="newIssue.fieldPath"
              :options="fieldOptions"
              placeholder="選擇相關欄位"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 mb-2 block">
              內部描述
            </label>
            <UTextarea
              v-model="newIssue.internalDescription"
              placeholder="內部使用的問題描述..."
              :rows="3"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 mb-2 block">
              客戶訊息
            </label>
            <UTextarea
              v-model="newIssue.clientMessage"
              placeholder="顯示給客戶的訊息..."
              :rows="3"
            />
          </div>
        </div>

        <template #footer>
          <div class="flex gap-2 justify-end">
            <UButton variant="outline" @click="showAddIssueModal = false">
              取消
            </UButton>
            <UButton color="primary" @click="addNewIssue"> 添加問題 </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
interface ReviewIssue {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  fieldPath?: string;
  fieldName?: string;
  internalDescription: string;
  clientMessage: string;
  isResolved: boolean;
}

interface ReviewHistory {
  id: string;
  action: string;
  notes: string;
  reviewer: string;
  date: Date;
}

interface ReviewChecklistItem {
  id: string;
  description: string;
  isCompleted: boolean;
}

interface Props {
  application: any;
}

const props = defineProps<Props>();

// State
const reviewNotes = ref("");
const isProcessing = ref(false);
const showAddIssueModal = ref(false);

// Review issues
const reviewIssues = ref<ReviewIssue[]>([
  {
    id: "1",
    type: "missing_document",
    severity: "high",
    fieldPath: "responsiblePerson.idNumber",
    fieldName: "負責人身分證字號",
    internalDescription: "身分證字號格式驗證失敗",
    clientMessage: "請檢查身分證字號格式是否正確",
    isResolved: false,
  },
]);

// Review history
const reviewHistory = ref<ReviewHistory[]>([
  {
    id: "1",
    action: "開始審核",
    notes: "申請已分配給審核人員",
    reviewer: "系統",
    date: new Date(),
  },
]);

// Review checklist
const reviewChecklist = ref<ReviewChecklistItem[]>([
  { id: "1", description: "檢查公司名稱是否符合規定", isCompleted: false },
  { id: "2", description: "驗證負責人資料完整性", isCompleted: false },
  { id: "3", description: "確認營業項目描述", isCompleted: false },
  { id: "4", description: "檢查必要文件是否齊全", isCompleted: false },
  { id: "5", description: "驗證地址資訊", isCompleted: false },
]);

// New issue form
const newIssue = ref({
  type: "",
  severity: "medium" as const,
  fieldPath: "",
  internalDescription: "",
  clientMessage: "",
});

// Options
const issueTypes = [
  { label: "缺少文件", value: "missing_document" },
  { label: "資料不完整", value: "incomplete_data" },
  { label: "格式錯誤", value: "format_error" },
  { label: "資料不一致", value: "inconsistent_data" },
  { label: "其他問題", value: "other" },
];

const severityLevels = [
  { label: "低", value: "low" },
  { label: "中", value: "medium" },
  { label: "高", value: "high" },
  { label: "嚴重", value: "critical" },
];

const fieldOptions = [
  { label: "公司名稱", value: "company.candicateNames[0]" },
  { label: "組織類型", value: "company.organizationType" },
  { label: "公司地址", value: "company.address" },
  { label: "營業項目", value: "company.businessItemsDescription" },
  { label: "負責人姓名", value: "responsiblePerson.name" },
  { label: "負責人身分證", value: "responsiblePerson.idNumber" },
  { label: "負責人地址", value: "responsiblePerson.address" },
  { label: "聯絡人姓名", value: "contactPerson.name" },
  { label: "聯絡人身分證", value: "contactPerson.idNumber" },
  { label: "董事姓名", value: "director.name" },
  { label: "董事身分證", value: "director.idNumber" },
];

// Methods
const addFieldIssue = (fieldPath: string, issue: Partial<ReviewIssue>) => {
  const fieldOption = fieldOptions.find((opt) => opt.value === fieldPath);
  const newIssue: ReviewIssue = {
    id: Date.now().toString(),
    type: "format_error",
    severity: "medium",
    fieldPath,
    fieldName: fieldOption?.label,
    internalDescription: issue.internalDescription || "欄位資料有問題",
    clientMessage: issue.clientMessage || "請檢查此欄位的資料",
    isResolved: false,
  };
  reviewIssues.value.push(newIssue);
};

const addNewIssue = () => {
  const fieldOption = fieldOptions.find(
    (opt) => opt.value === newIssue.value.fieldPath
  );
  const issue: ReviewIssue = {
    id: Date.now().toString(),
    type: newIssue.value.type,
    severity: newIssue.value.severity,
    fieldPath: newIssue.value.fieldPath || undefined,
    fieldName: fieldOption?.label,
    internalDescription: newIssue.value.internalDescription,
    clientMessage: newIssue.value.clientMessage,
    isResolved: false,
  };

  reviewIssues.value.push(issue);
  showAddIssueModal.value = false;

  // Reset form
  newIssue.value = {
    type: "",
    severity: "medium",
    fieldPath: "",
    internalDescription: "",
    clientMessage: "",
  };
};

const removeIssue = (issueId: string) => {
  reviewIssues.value = reviewIssues.value.filter(
    (issue) => issue.id !== issueId
  );
};

const getIssueSeverityClass = (severity: string) => {
  const classes = {
    low: "bg-blue-50 border-blue-200",
    medium: "bg-yellow-50 border-yellow-200",
    high: "bg-orange-50 border-orange-200",
    critical: "bg-red-50 border-red-200",
  };
  return classes[severity as keyof typeof classes] || classes.medium;
};

const getSeverityColor = (severity: string) => {
  const colors = {
    low: "blue",
    medium: "yellow",
    high: "orange",
    critical: "red",
  };
  return colors[severity as keyof typeof colors] || "gray";
};

const getSeverityLabel = (severity: string) => {
  const labels = {
    low: "低",
    medium: "中",
    high: "高",
    critical: "嚴重",
  };
  return labels[severity as keyof typeof labels] || severity;
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Action methods
const approveApplication = async () => {
  isProcessing.value = true;
  try {
    // TODO: Call API to approve application
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

    reviewHistory.value.push({
      id: Date.now().toString(),
      action: "核准申請",
      notes: reviewNotes.value || "申請已核准",
      reviewer: "當前審核人",
      date: new Date(),
    });

    // TODO: Emit event to parent to refresh data
    console.log("Application approved");
  } catch (error) {
    console.error("Failed to approve application:", error);
  } finally {
    isProcessing.value = false;
  }
};

const requestClientUpdate = async () => {
  isProcessing.value = true;
  try {
    // TODO: Call API to request client update
    await new Promise((resolve) => setTimeout(resolve, 1000));

    reviewHistory.value.push({
      id: Date.now().toString(),
      action: "要求客戶更新",
      notes: reviewNotes.value || "要求客戶更新資料",
      reviewer: "當前審核人",
      date: new Date(),
    });

    console.log("Client update requested");
  } catch (error) {
    console.error("Failed to request client update:", error);
  } finally {
    isProcessing.value = false;
  }
};

const rejectApplication = async () => {
  isProcessing.value = true;
  try {
    // TODO: Call API to reject application
    await new Promise((resolve) => setTimeout(resolve, 1000));

    reviewHistory.value.push({
      id: Date.now().toString(),
      action: "拒絕申請",
      notes: reviewNotes.value || "申請已拒絕",
      reviewer: "當前審核人",
      date: new Date(),
    });

    console.log("Application rejected");
  } catch (error) {
    console.error("Failed to reject application:", error);
  } finally {
    isProcessing.value = false;
  }
};

const saveReviewNotes = async () => {
  isProcessing.value = true;
  try {
    // TODO: Call API to save review notes
    await new Promise((resolve) => setTimeout(resolve, 500));

    reviewHistory.value.push({
      id: Date.now().toString(),
      action: "儲存備註",
      notes: reviewNotes.value,
      reviewer: "當前審核人",
      date: new Date(),
    });

    console.log("Review notes saved");
  } catch (error) {
    console.error("Failed to save review notes:", error);
  } finally {
    isProcessing.value = false;
  }
};

const exportApplication = () => {
  // TODO: Implement export functionality
  console.log("Exporting application data");
};

const sendNotification = () => {
  // TODO: Implement notification functionality
  console.log("Sending notification to client");
};

const setReminder = () => {
  // TODO: Implement reminder functionality
  console.log("Setting reminder");
};
</script>
