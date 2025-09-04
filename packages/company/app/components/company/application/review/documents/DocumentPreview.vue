<template>
  <div class="space-y-3">
    <!-- Document Status Display -->
    <div class="flex items-center justify-between p-4 rounded-lg border" :class="statusClasses">
      <div class="flex items-center gap-3">
        <UIcon :name="statusIcon" :class="statusIconClass" class="w-6 h-6" />
        <div>
          <h5 class="font-medium text-gray-900">{{ documentType }}</h5>
          <p class="text-sm" :class="statusTextClass">{{ statusText }}</p>
        </div>
      </div>
      
      <!-- Document Actions -->
      <div class="flex items-center gap-2">
        <UBadge 
          :label="statusLabel" 
          :color="statusBadgeColor" 
          variant="subtle"
        />
        
        <!-- Upload Button (for missing documents in first review) -->
        <UButton
          v-if="documentStatus === 'missing' && canUpload"
          size="xs"
          color="primary"
          variant="outline"
          label="上傳文件"
          icon="i-heroicons-arrow-up-tray"
          @click="handleUpload"
        />
        
        <!-- View Button (for uploaded documents) -->
        <UButton
          v-if="documentStatus === 'uploaded'"
          size="xs"
          color="gray"
          variant="outline"
          label="查看"
          icon="i-heroicons-eye"
          @click="handleView"
        />
      </div>
    </div>

    <!-- File Upload Area (shown when missing and can upload) -->
    <div 
      v-if="documentStatus === 'missing' && canUpload && showUploadArea"
      class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center space-y-4 hover:border-gray-400 transition-colors"
    >
      <UIcon name="i-heroicons-cloud-arrow-up" class="w-12 h-12 text-gray-400 mx-auto" />
      <div>
        <h4 class="font-medium text-gray-900">上傳 {{ documentType }}</h4>
        <p class="text-sm text-gray-600 mt-1">
          支援 JPEG、PNG 或 PDF 格式，檔案大小不超過 2MB
        </p>
      </div>
      
      <div class="flex justify-center gap-2">
        <UButton
          color="primary"
          variant="outline"
          label="選擇檔案"
          icon="i-heroicons-folder"
          @click="triggerFileInput"
        />
        <UButton
          color="gray"
          variant="ghost"
          label="取消"
          @click="showUploadArea = false"
        />
      </div>
      
      <!-- Hidden file input -->
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        accept="image/jpeg,image/jpg,image/png,application/pdf"
        @change="handleFileSelect"
      />
    </div>

    <!-- Document Preview (for uploaded documents) -->
    <div 
      v-if="documentStatus === 'uploaded' && showPreview"
      class="border rounded-lg p-4 bg-gray-50"
    >
      <div class="flex items-center justify-between mb-2">
        <h5 class="font-medium text-gray-900">文件預覽</h5>
        <UButton
          size="xs"
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark"
          @click="showPreview = false"
        />
      </div>
      
      <!-- Mock preview - in reality would show actual file preview -->
      <div class="bg-white border rounded p-8 text-center">
        <UIcon name="i-heroicons-document" class="w-16 h-16 text-gray-400 mx-auto mb-2" />
        <p class="text-sm text-gray-600">{{ documentType }} 預覽</p>
        <p class="text-xs text-gray-500 mt-1">點擊查看完整文件</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  documentStatus: 'missing' | 'uploaded' | 'optional';
  documentType: string;
  fileUrl?: string | null;
  isOptional?: boolean;
  canUpload?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isOptional: false,
  canUpload: true,
});

const showUploadArea = ref(false);
const showPreview = ref(false);
const fileInput = ref<HTMLInputElement>();

const statusClasses = computed(() => {
  switch (props.documentStatus) {
    case 'missing':
      return 'bg-red-50 border-red-200';
    case 'uploaded':
      return 'bg-green-50 border-green-200';
    case 'optional':
      return 'bg-gray-50 border-gray-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
});

const statusIcon = computed(() => {
  switch (props.documentStatus) {
    case 'missing':
      return 'i-heroicons-exclamation-triangle';
    case 'uploaded':
      return 'i-heroicons-check-circle';
    case 'optional':
      return 'i-heroicons-minus-circle';
    default:
      return 'i-heroicons-document';
  }
});

const statusIconClass = computed(() => {
  switch (props.documentStatus) {
    case 'missing':
      return 'text-red-600';
    case 'uploaded':
      return 'text-green-600';
    case 'optional':
      return 'text-gray-500';
    default:
      return 'text-gray-500';
  }
});

const statusTextClass = computed(() => {
  switch (props.documentStatus) {
    case 'missing':
      return 'text-red-700';
    case 'uploaded':
      return 'text-green-700';
    case 'optional':
      return 'text-gray-600';
    default:
      return 'text-gray-600';
  }
});

const statusText = computed(() => {
  switch (props.documentStatus) {
    case 'missing':
      return props.isOptional ? '選填文件（未上傳）' : '必要文件（未上傳）';
    case 'uploaded':
      return '文件已上傳';
    case 'optional':
      return '選填文件（未上傳）';
    default:
      return '狀態未知';
  }
});

const statusLabel = computed(() => {
  switch (props.documentStatus) {
    case 'missing':
      return props.isOptional ? '選填' : '缺少';
    case 'uploaded':
      return '已上傳';
    case 'optional':
      return '選填';
    default:
      return '未知';
  }
});

const statusBadgeColor = computed(() => {
  switch (props.documentStatus) {
    case 'missing':
      return props.isOptional ? 'gray' : 'red';
    case 'uploaded':
      return 'green';
    case 'optional':
      return 'gray';
    default:
      return 'gray';
  }
});

const handleUpload = () => {
  showUploadArea.value = true;
};

const handleView = () => {
  showPreview.value = !showPreview.value;
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    // TODO: Implement actual file upload logic
    console.log('Selected file:', file);
    showUploadArea.value = false;
    
    // Mock success notification
    // In reality, this would upload the file and update the document status
  }
};
</script>