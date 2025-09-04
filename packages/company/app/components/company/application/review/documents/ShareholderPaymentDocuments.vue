<template>
  <div class="space-y-4">
    <!-- Status Overview -->
    <div
      class="flex items-center justify-between p-4 rounded-lg border"
      :class="statusClasses"
    >
      <div class="flex items-center gap-3">
        <UIcon :name="statusIcon" :class="statusIconClass" class="w-6 h-6" />
        <div>
          <h5 class="font-medium text-gray-900">股東匯款條或存摺資料</h5>
          <p class="text-sm" :class="statusTextClass">{{ statusText }}</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <UBadge
          :label="statusLabel"
          :color="statusBadgeColor"
          variant="subtle"
        />

        <!-- Add Document Button -->
        <UButton
          v-if="canUpload"
          size="xs"
          color="primary"
          variant="outline"
          label="新增文件"
          icon="i-heroicons-plus"
          @click="showAddDocument = true"
        />
      </div>
    </div>

    <!-- Document List -->
    <div v-if="documents.length > 0" class="space-y-3">
      <h6 class="font-medium text-gray-900">
        已上傳的匯款資料 ({{ documents.length }} 份)
      </h6>

      <div class="space-y-2">
        <div
          v-for="(doc, index) in documents"
          :key="index"
          class="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium"
            >
              {{ index + 1 }}
            </div>
            <div>
              <p class="font-medium text-gray-900">匯款資料 #{{ index + 1 }}</p>
              <p class="text-sm text-gray-600">股東匯款條或存摺資料</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <UButton
              size="xs"
              color="neutral"
              variant="outline"
              icon="i-heroicons-eye"
              @click="handleViewDocument(index)"
            />
            <UButton
              size="xs"
              color="error"
              variant="outline"
              icon="i-heroicons-trash"
              @click="handleDeleteDocument(index)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
    >
      <UIcon
        name="i-heroicons-document-minus"
        class="w-12 h-12 text-gray-400 mx-auto mb-3"
      />
      <h5 class="font-medium text-gray-900 mb-1">尚未上傳股東匯款資料</h5>
      <p class="text-sm text-gray-600 mb-4">
        請上傳至少一份股東匯款條或存摺資料
      </p>

      <UButton
        v-if="canUpload"
        color="primary"
        variant="outline"
        label="上傳第一份文件"
        icon="i-heroicons-cloud-arrow-up"
        @click="showAddDocument = true"
      />
    </div>

    <!-- Add Document Modal/Area -->
    <div v-if="showAddDocument" class="space-y-4">
      <UFileUpload
        v-model="selectedFiles"
        multiple
        accept="image/jpeg,image/jpg,image/png,application/pdf"
        label="上傳股東匯款資料"
        description="支援 JPEG、PNG 或 PDF 格式，檔案大小不超過 2MB"
        icon="i-heroicons-cloud-arrow-up"
        class="w-full min-h-48"
      />

      <div class="flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="ghost"
          label="取消"
          @click="cancelUpload"
        />
        <UButton
          v-if="selectedFiles && selectedFiles.length > 0"
          color="primary"
          label="確認上傳"
          @click="confirmUpload"
        />
      </div>
    </div>

    <!-- Requirements Info -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start gap-2">
        <UIcon
          name="i-heroicons-information-circle"
          class="w-5 h-5 text-blue-600 mt-0.5"
        />
        <div>
          <h6 class="font-medium text-blue-900">上傳要求</h6>
          <ul class="text-sm text-blue-800 mt-1 space-y-1">
            <li>• 至少需要上傳一份股東匯款條或存摺資料</li>
            <li>• 每位股東都需要提供相應的匯款證明</li>
            <li>• 匯款金額應與股東出資額相符</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  documents: string[];
  documentStatus: "missing" | "uploaded" | "optional";
  canUpload?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  canUpload: true,
});

const emit = defineEmits<{
  uploadDocument: [file: File];
  deleteDocument: [index: number];
  viewDocument: [index: number];
}>();

const showAddDocument = ref(false);
const selectedFiles = ref<File[] | null>(null);

const statusClasses = computed(() => {
  if (props.documents.length === 0) {
    return "bg-red-50 border-red-200";
  }
  return "bg-green-50 border-green-200";
});

const statusIcon = computed(() => {
  if (props.documents.length === 0) {
    return "i-heroicons-exclamation-triangle";
  }
  return "i-heroicons-check-circle";
});

const statusIconClass = computed(() => {
  if (props.documents.length === 0) {
    return "text-red-600";
  }
  return "text-green-600";
});

const statusTextClass = computed(() => {
  if (props.documents.length === 0) {
    return "text-red-700";
  }
  return "text-green-700";
});

const statusText = computed(() => {
  if (props.documents.length === 0) {
    return "尚未上傳任何股東匯款資料（至少需要1份）";
  }
  return `已上傳 ${props.documents.length} 份股東匯款資料`;
});

const statusLabel = computed(() => {
  if (props.documents.length === 0) {
    return "缺少";
  }
  return `${props.documents.length} 份`;
});

const statusBadgeColor = computed(() => {
  if (props.documents.length === 0) {
    return "error";
  }
  return "success";
});

const confirmUpload = () => {
  if (selectedFiles.value) {
    selectedFiles.value.forEach((file) => {
      emit("uploadDocument", file);
    });

    // Reset and close
    selectedFiles.value = null;
    showAddDocument.value = false;
  }
};

const cancelUpload = () => {
  selectedFiles.value = null;
  showAddDocument.value = false;
};

const handleViewDocument = (index: number) => {
  emit("viewDocument", index);
};

const handleDeleteDocument = (index: number) => {
  emit("deleteDocument", index);
};
</script>
