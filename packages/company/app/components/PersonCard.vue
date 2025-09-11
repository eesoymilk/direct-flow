<template>
  <UCard
    :class="[
      'ring-1 ring-gray-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300 h-fit border-2',
      person.isReadonly
        ? 'border-blue-200 bg-blue-50/30'
        : 'border-gray-200 bg-white',
    ]"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <UIcon :name="icon" :size="20" />
          <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
        </div>
        <div v-if="showBadges" class="flex gap-1">
          <UBadge
            v-if="person.isReadonly"
            icon="i-lucide-lock"
            label="既有人員"
            color="primary"
            variant="soft"
            size="lg"
          />
          <UBadge
            v-if="showShares && person.shares"
            :label="`${person.shares.toLocaleString()} 股`"
            color="success"
            variant="soft"
            size="lg"
          />
        </div>
      </div>
    </template>

    <!-- Prominent Name Section -->
    <div class="text-center py-4 border-b border-gray-100">
      <h2 class="text-2xl font-bold text-gray-900 mb-1">
        {{ person.name }}
      </h2>
      <p class="text-sm text-gray-500">{{ subtitle }}</p>
    </div>

    <div class="space-y-4 pt-4">
      <!-- ID Number Field -->
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-credit-card" class="w-4 h-4 text-gray-400" />
          <label
            class="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            身分證字號
          </label>
        </div>
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p class="font-mono text-sm text-gray-800 font-medium">
            {{ person.idNumber }}
          </p>
        </div>
      </div>

      <!-- Address Field -->
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-gray-400" />
          <label
            class="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            地址
          </label>
        </div>
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p class="text-sm text-gray-700 leading-relaxed">
            {{ person.address }}
          </p>
        </div>
      </div>

      <!-- Email Field -->
      <div v-if="person.email" class="space-y-2">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-mail" class="w-4 h-4 text-gray-400" />
          <label
            class="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            電子郵件
          </label>
        </div>
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p class="text-sm text-gray-700 break-all font-medium">
            {{ person.email }}
          </p>
        </div>
      </div>

      <!-- Cellphone Field -->
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-smartphone" class="w-4 h-4 text-gray-400" />
          <label
            class="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            手機
          </label>
        </div>
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p class="font-mono text-sm text-gray-800 font-medium">
            {{ person.cellphone }}
          </p>
        </div>
      </div>

      <!-- Date of Birth Field -->
      <div v-if="person.dateOfBirth" class="space-y-2">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-calendar" class="w-4 h-4 text-gray-400" />
          <label
            class="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            出生日期
          </label>
        </div>
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p class="text-sm text-gray-700 font-medium">
            {{
              person.dateOfBirth
                ? `${person.dateOfBirth.getFullYear()}/${person.dateOfBirth.getMonth() + 1}/${person.dateOfBirth.getDate()}`
                : "未提供"
            }}
          </p>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Person {
  name: string;
  idNumber: string;
  address: string;
  email?: string;
  cellphone: string;
  dateOfBirth: Date;
  isReadonly?: boolean;
  shares?: number;
}

interface Props {
  person: Person;
  title: string;
  subtitle: string;
  icon: string;
  showBadges?: boolean;
  showShares?: boolean;
}

withDefaults(defineProps<Props>(), {
  showBadges: false,
  showShares: false,
});
</script>
