<template>
  <UCard :ui="{ header: { padding: 'px-4 py-3' }, body: { padding: 'px-4 py-4' } }">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold text-gray-900">
          {{ isEditing ? '編輯持股' : '新增持股' }}
        </h3>
        <UButton
          v-if="showRemove"
          color="red"
          variant="ghost"
          size="sm"
          icon="i-heroicons-trash"
          @click="$emit('remove')"
        />
      </div>
    </template>

    <UForm 
      :schema="shareHoldingSchema" 
      :state="localHolding" 
      class="space-y-4"
      @submit="handleSubmit"
    >
      <!-- Share Type Selection -->
      <UFormGroup label="股票類型" name="shareType">
        <USelectMenu
          v-model="localHolding.shareType"
          :options="availableShareTypeOptions"
          option-attribute="label"
          value-attribute="value"
          placeholder="選擇股票類型"
          :loading="shareTypesLoading"
        >
          <template #option="{ option }">
            <div class="flex items-center justify-between w-full">
              <span>{{ option.label }}</span>
              <UBadge 
                :color="option.description === '普通股' ? 'blue' : 'purple'" 
                variant="subtle"
                size="xs"
              >
                {{ option.description }}
              </UBadge>
            </div>
          </template>
        </USelectMenu>
      </UFormGroup>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <!-- Quantity Input -->
        <UFormGroup label="股數" name="quantity">
          <UInput
            v-model.number="localHolding.quantity"
            type="number"
            min="1"
            step="1"
            placeholder="輸入股數"
            @input="calculateTotal"
          >
            <template #trailing>
              <span class="text-xs text-gray-500">股</span>
            </template>
          </UInput>
        </UFormGroup>

        <!-- Price Per Share Input -->
        <UFormGroup label="每股價格" name="pricePerShare">
          <UInput
            v-model.number="localHolding.pricePerShare"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="輸入每股價格"
            @input="calculateTotal"
          >
            <template #trailing>
              <span class="text-xs text-gray-500">元</span>
            </template>
          </UInput>
        </UFormGroup>
      </div>

      <!-- Calculated Total (Read-only) -->
      <UFormGroup label="股款總額">
        <UInput
          :model-value="formattedTotal"
          readonly
          :ui="{ base: 'bg-gray-50' }"
        >
          <template #trailing>
            <span class="text-xs text-gray-500">元</span>
          </template>
        </UInput>
      </UFormGroup>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-2">
        <UButton
          v-if="showCancel"
          color="gray"
          variant="outline"
          @click="$emit('cancel')"
        >
          取消
        </UButton>
        <UButton
          type="submit"
          :loading="isSaving"
          :disabled="!isValid"
        >
          {{ isEditing ? '更新' : '新增' }}
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { shareHoldingSchema, calculateTotalAmount } from '~/shared/utils/schemas/shareHolding';

interface Props {
  holding?: ShareHolding;
  applicationId?: string;
  showRemove?: boolean;
  showCancel?: boolean;
  autoSave?: boolean;
}

interface Emits {
  (e: 'save', holding: ShareHolding): void;
  (e: 'remove'): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  showRemove: true,
  showCancel: true,
  autoSave: false,
});

const emit = defineEmits<Emits>();

// Composables - Use sequence-based share types instead of all types
const { availableShareTypeOptions, isLoading: shareTypesLoading } = usePreferredShareSequence(
  computed(() => props.applicationId || '')
);

// Local reactive state
const localHolding = reactive<ShareHolding>({
  id: '',
  shareType: 'ordinary',
  quantity: 0,
  pricePerShare: 0,
  totalAmount: 0,
  ...props.holding,
});

const isSaving = ref(false);

// Computed properties
const isEditing = computed(() => !!props.holding?.id);

const formattedTotal = computed(() => 
  localHolding.totalAmount.toLocaleString('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  })
);

const isValid = computed(() => {
  return localHolding.shareType &&
         localHolding.quantity > 0 &&
         localHolding.pricePerShare > 0;
});

// Methods
const calculateTotal = () => {
  if (localHolding.quantity > 0 && localHolding.pricePerShare > 0) {
    localHolding.totalAmount = calculateTotalAmount(
      localHolding.quantity,
      localHolding.pricePerShare
    );
  } else {
    localHolding.totalAmount = 0;
  }
};

const handleSubmit = async () => {
  if (!isValid.value) return;

  try {
    isSaving.value = true;
    emit('save', { ...localHolding });
  } catch (error) {
    console.error('Error saving share holding:', error);
  } finally {
    isSaving.value = false;
  }
};

// Watchers
watch([() => localHolding.quantity, () => localHolding.pricePerShare], () => {
  calculateTotal();
  
  if (props.autoSave && isValid.value && isEditing.value) {
    // Debounced auto-save for editing mode
    debounce(handleSubmit, 1000)();
  }
}, { immediate: true });

// Initialize total calculation
onMounted(() => {
  calculateTotal();
});
</script>