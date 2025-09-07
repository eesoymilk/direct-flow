<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-base font-semibold text-gray-900">特別股管理</h4>
          <p class="text-sm text-gray-500">特別股必須依序開放，股東才能購買</p>
        </div>
        <UBadge 
          :color="availablePreferredShares.length > 0 ? 'green' : 'gray'"
          variant="subtle"
        >
          {{ availablePreferredShares.length }}/5 種特別股可用
        </UBadge>
      </div>
    </template>

    <!-- Current Available Shares -->
    <div class="space-y-4">
      <div v-if="availableShareTypes.length > 1">
        <h5 class="text-sm font-medium text-gray-700 mb-2">目前可購買股票類型</h5>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="shareType in availableShareTypes"
            :key="shareType"
            :color="shareType === 'ordinary' ? 'blue' : 'purple'"
            variant="subtle"
          >
            {{ SHARE_TYPE_NAMES[shareType] }}
          </UBadge>
        </div>
      </div>

      <!-- Preferred Share Sequence Timeline -->
      <div>
        <h5 class="text-sm font-medium text-gray-700 mb-3">特別股開放順序</h5>
        <div class="space-y-2">
          <div
            v-for="(shareType, index) in PREFERRED_SHARE_SEQUENCE"
            :key="shareType"
            class="flex items-center space-x-3"
          >
            <!-- Status Icon -->
            <div class="flex-shrink-0">
              <UIcon
                v-if="availablePreferredShares.includes(shareType)"
                name="i-heroicons-check-circle"
                class="w-5 h-5 text-green-500"
              />
              <UIcon
                v-else-if="index === availablePreferredShares.length"
                name="i-heroicons-clock"
                class="w-5 h-5 text-yellow-500"
              />
              <UIcon
                v-else
                name="i-heroicons-minus-circle"
                class="w-5 h-5 text-gray-300"
              />
            </div>

            <!-- Share Type Info -->
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <span 
                  class="text-sm"
                  :class="{
                    'text-green-700 font-medium': availablePreferredShares.includes(shareType),
                    'text-yellow-700': index === availablePreferredShares.length,
                    'text-gray-500': index > availablePreferredShares.length
                  }"
                >
                  {{ SHARE_TYPE_NAMES[shareType] }}
                </span>
                
                <UBadge
                  v-if="availablePreferredShares.includes(shareType)"
                  color="green"
                  variant="subtle"
                  size="xs"
                >
                  已開放
                </UBadge>
                <UBadge
                  v-else-if="index === availablePreferredShares.length"
                  color="yellow"
                  variant="subtle"
                  size="xs"
                >
                  可開放
                </UBadge>
                <UBadge
                  v-else
                  color="gray"
                  variant="subtle"
                  size="xs"
                >
                  未開放
                </UBadge>
              </div>
              
              <!-- Holdings Count for This Share Type -->
              <div
                v-if="availablePreferredShares.includes(shareType)"
                class="text-xs text-gray-500 mt-1"
              >
                {{ getShareHoldingsCount(shareType) }} 筆持股記錄
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between pt-4 border-t">
        <UButton
          v-if="availablePreferredShares.length > 0"
          color="red"
          variant="outline"
          size="sm"
          :loading="isLoading"
          :disabled="!canRemoveLastPreferredShare"
          @click="handleRemoveLastPreferredShare"
        >
          移除最後特別股
        </UButton>
        <div v-else></div>

        <UButton
          :disabled="!canAddMorePreferredShares"
          :loading="isLoading"
          size="sm"
          @click="handleAddNextPreferredShare"
        >
          {{ getNextPreferredShareLabel }}
        </UButton>
      </div>
    </div>

    <!-- Warning for Removing Shares -->
    <UAlert
      v-if="showRemovalWarning"
      color="amber"
      variant="soft"
      class="mt-4"
      :title="removalWarningMessage"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'gray', variant: 'link' }"
      @close="showRemovalWarning = false"
    />

    <!-- Confirmation Modal for Removal -->
    <UModal v-model="showRemovalModal">
      <UCard>
        <template #header>
          <h3 class="text-base font-semibold text-gray-900">
            確認移除特別股類型
          </h3>
        </template>

        <div class="space-y-3">
          <p class="text-sm text-gray-600">
            您確定要移除「{{ shareTypeToRemove ? SHARE_TYPE_NAMES[shareTypeToRemove] : '' }}」嗎？
          </p>
          <p class="text-sm text-red-600">
            移除後，所有股東將無法再購買此類型股票，且此操作無法復原。
          </p>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton
              color="gray"
              variant="outline"
              @click="cancelRemoval"
            >
              取消
            </UButton>
            <UButton
              color="red"
              :loading="isLoading"
              @click="confirmRemoval"
            >
              確認移除
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  applicationId: string;
  allHoldings?: ShareHolding[];
}

const props = defineProps<Props>();

// Composables
const applicationId = computed(() => props.applicationId);
const {
  availablePreferredShares,
  isLoading,
  canAddMorePreferredShares,
  availableShareTypes,
  getNextPreferredShareLabel,
  addNextPreferredShare,
  removeLastPreferredShare,
} = usePreferredShareSequence(applicationId);

const { SHARE_TYPE_NAMES } = useShareTypes();
const toast = useToast();

// Constants
const PREFERRED_SHARE_SEQUENCE = [
  'preferred_a',
  'preferred_b', 
  'preferred_c',
  'preferred_d',
  'preferred_e',
];

// Local state
const showRemovalWarning = ref(false);
const showRemovalModal = ref(false);
const shareTypeToRemove = ref<string | null>(null);
const removalWarningMessage = ref('');

// Computed
const canRemoveLastPreferredShare = computed(() => {
  const lastShare = availablePreferredShares.value[availablePreferredShares.value.length - 1];
  if (!lastShare || !props.allHoldings) return true;
  
  // Check if any holdings exist for the last preferred share
  return !props.allHoldings.some(holding => holding.shareType === lastShare);
});

// Methods
const getShareHoldingsCount = (shareType: string) => {
  if (!props.allHoldings) return 0;
  return props.allHoldings.filter(holding => holding.shareType === shareType).length;
};

const handleAddNextPreferredShare = async () => {
  try {
    const success = await addNextPreferredShare();
    if (success) {
      const addedShare = availablePreferredShares.value[availablePreferredShares.value.length - 1];
      toast.add({
        title: '特別股類型已新增',
        description: `${SHARE_TYPE_NAMES[addedShare]}現在可供股東購買`,
        color: 'green',
      });
    }
  } catch (error: any) {
    toast.add({
      title: '新增失敗',
      description: error.message || '無法新增特別股類型',
      color: 'red',
    });
  }
};

const handleRemoveLastPreferredShare = async () => {
  const lastShare = availablePreferredShares.value[availablePreferredShares.value.length - 1];
  if (!lastShare) return;

  // Check if there are holdings first
  const holdingsCount = getShareHoldingsCount(lastShare);
  if (holdingsCount > 0) {
    showRemovalWarning.value = true;
    removalWarningMessage.value = `無法移除${SHARE_TYPE_NAMES[lastShare]}，目前有 ${holdingsCount} 筆持股記錄`;
    return;
  }

  // Show confirmation modal
  shareTypeToRemove.value = lastShare;
  showRemovalModal.value = true;
};

const confirmRemoval = async () => {
  try {
    const success = await removeLastPreferredShare();
    if (success) {
      toast.add({
        title: '特別股類型已移除',
        description: `${SHARE_TYPE_NAMES[shareTypeToRemove.value!]}已從可用選項中移除`,
        color: 'green',
      });
    }
  } catch (error: any) {
    toast.add({
      title: '移除失敗',
      description: error.message || '無法移除特別股類型',
      color: 'red',
    });
  } finally {
    cancelRemoval();
  }
};

const cancelRemoval = () => {
  showRemovalModal.value = false;
  shareTypeToRemove.value = null;
};
</script>