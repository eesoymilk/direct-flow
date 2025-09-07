<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-semibold text-gray-900">
            {{ shareholder.person.name }} 的持股明細
          </h3>
          <p class="text-sm text-gray-500">
            身分證字號: {{ shareholder.person.idNumber }}
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <UBadge
            :color="totalInvestment > 0 ? 'green' : 'gray'"
            variant="subtle"
          >
            總投資金額: {{ formattedTotalInvestment }}
          </UBadge>
          <UButton
            icon="i-heroicons-plus"
            size="sm"
            @click="addNewHolding"
            :disabled="isLoading"
          >
            新增持股
          </UButton>
        </div>
      </div>
    </template>

    <!-- Holdings Table -->
    <UTable
      v-model="selectedHoldings"
      :columns="tableColumns"
      :rows="tableRows"
      :loading="isLoading"
      :empty-state="{
        icon: 'i-heroicons-chart-pie',
        label: '尚無持股記錄',
        description: '點擊「新增持股」按鈕開始記錄股東持股'
      }"
      class="w-full"
    >
      <!-- Share Type Column -->
      <template #shareType-data="{ row }">
        <div class="flex items-center space-x-2">
          <UBadge 
            :color="isPreferredShare(row.shareType) ? 'purple' : 'blue'" 
            variant="subtle"
          >
            {{ getShareTypeName(row.shareType) }}
          </UBadge>
        </div>
      </template>

      <!-- Quantity Column -->
      <template #quantity-data="{ row }">
        <span class="font-medium">
          {{ row.quantity.toLocaleString() }} 股
        </span>
      </template>

      <!-- Price Per Share Column -->
      <template #pricePerShare-data="{ row }">
        <span class="font-mono">
          {{ formatCurrency(row.pricePerShare) }}
        </span>
      </template>

      <!-- Total Amount Column -->
      <template #totalAmount-data="{ row }">
        <span class="font-medium text-green-600">
          {{ formatCurrency(row.totalAmount) }}
        </span>
      </template>

      <!-- Actions Column -->
      <template #actions-data="{ row }">
        <UDropdown :items="getRowActions(row)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal"
            size="sm"
          />
        </UDropdown>
      </template>
    </UTable>

    <!-- Add/Edit Holding Modal -->
    <UModal v-model="showHoldingModal">
      <ShareHoldingForm
        :holding="selectedHolding"
        :application-id="applicationId"
        :show-cancel="true"
        @save="handleSaveHolding"
        @cancel="closeHoldingModal"
        @remove="handleRemoveHolding"
      />
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          <h3 class="text-base font-semibold text-gray-900">
            確認刪除持股
          </h3>
        </template>

        <div class="space-y-3">
          <p class="text-sm text-gray-600">
            您確定要刪除以下持股記錄嗎？此操作無法復原。
          </p>
          <div v-if="holdingToDelete" class="p-3 bg-gray-50 rounded-lg">
            <div class="text-sm">
              <div><strong>股票類型:</strong> {{ getShareTypeName(holdingToDelete.shareType) }}</div>
              <div><strong>股數:</strong> {{ holdingToDelete.quantity.toLocaleString() }} 股</div>
              <div><strong>總金額:</strong> {{ formatCurrency(holdingToDelete.totalAmount) }}</div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton
              color="gray"
              variant="outline"
              @click="closeDeleteModal"
            >
              取消
            </UButton>
            <UButton
              color="red"
              :loading="isSaving"
              @click="confirmDelete"
            >
              確認刪除
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  shareholder: ApplicationShareholder;
  applicationId: string;
}

const props = defineProps<Props>();

// Composables
const { getShareTypeName, isPreferredShare } = useShareTypes();
const shareholderId = computed(() => props.shareholder.id);
const {
  holdings,
  isLoading,
  isSaving,
  totalInvestment,
  createHolding,
  updateHolding,
  deleteHolding,
  addEmptyHolding,
} = useShareHoldings(shareholderId);

// Local state
const selectedHoldings = ref([]);
const showHoldingModal = ref(false);
const showDeleteModal = ref(false);
const selectedHolding = ref<ShareHolding | undefined>();
const holdingToDelete = ref<ShareHolding | undefined>();

// Table configuration
const tableColumns = [
  { key: 'shareType', label: '股票類型', sortable: true },
  { key: 'quantity', label: '股數', sortable: true },
  { key: 'pricePerShare', label: '每股價格', sortable: true },
  { key: 'totalAmount', label: '股款總額', sortable: true },
  { key: 'actions', label: '操作' },
];

const tableRows = computed(() => holdings.value || []);

// Computed properties
const formattedTotalInvestment = computed(() => formatCurrency(totalInvestment.value));

// Methods
const formatCurrency = (amount: number) =>
  amount.toLocaleString('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  });

const getRowActions = (row: ShareHolding) => [
  [{
    label: '編輯',
    icon: 'i-heroicons-pencil',
    click: () => editHolding(row),
  }],
  [{
    label: '刪除',
    icon: 'i-heroicons-trash',
    click: () => showDeleteConfirmation(row),
    color: 'red',
  }],
];

const addNewHolding = () => {
  selectedHolding.value = undefined;
  showHoldingModal.value = true;
};

const editHolding = (holding: ShareHolding) => {
  selectedHolding.value = { ...holding };
  showHoldingModal.value = true;
};

const handleSaveHolding = async (holding: ShareHolding) => {
  try {
    if (holding.id && holding.id !== `temp-${Date.now()}`) {
      // Update existing
      await updateHolding(holding.id, holding);
    } else {
      // Create new
      await createHolding(holding);
    }
    closeHoldingModal();
  } catch (error) {
    console.error('Error saving holding:', error);
  }
};

const showDeleteConfirmation = (holding: ShareHolding) => {
  holdingToDelete.value = holding;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!holdingToDelete.value?.id) return;
  
  try {
    await deleteHolding(holdingToDelete.value.id);
    closeDeleteModal();
  } catch (error) {
    console.error('Error deleting holding:', error);
  }
};

const handleRemoveHolding = () => {
  if (selectedHolding.value?.id) {
    showDeleteConfirmation(selectedHolding.value);
  }
  closeHoldingModal();
};

const closeHoldingModal = () => {
  showHoldingModal.value = false;
  selectedHolding.value = undefined;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  holdingToDelete.value = undefined;
};
</script>