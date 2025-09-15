<template>
  <div class="w-full relative">
    <!-- Root Node -->
    <div class="relative flex justify-center items-center mb-10 h-20">
      <div class="relative mx-auto">
        <label
          class="flex items-center justify-center cursor-pointer bg-white border-2 border-gray-300 rounded-lg px-6 py-4 min-w-48 hover:border-blue-400 hover:shadow-md transition-all duration-200 text-center has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:shadow-lg"
        >
          <input
            v-model="selectedOpinion"
            type="radio"
            name="auditOpinion"
            value="unqualified"
            class="sr-only"
          />
          <span class="text-sm font-medium text-gray-800 leading-tight"
            >無保留意見</span
          >
        </label>
      </div>
    </div>

    <!-- Connection Lines from Root -->
    <div class="absolute left-1/2 -translate-x-1/2 -z-10" style="top: 3.75rem">
      <div class="absolute h-8 left-0 top-0 w-0.5 bg-gray-300"></div>
      <div
        class="absolute h-0.5 top-8 bg-gray-300"
        style="left: -6.25rem; width: 12.5rem"
      ></div>
      <div
        class="absolute w-0.5 h-6 top-8 bg-gray-300"
        style="left: -6.25rem"
      ></div>
      <div
        class="absolute w-0.5 h-6 top-8 bg-gray-300"
        style="left: 6.25rem"
      ></div>
      <!-- Arrows pointing down -->
      <div
        class="absolute text-gray-400 text-lg"
        style="left: -6.25rem; top: 3.5rem; transform: translateX(-50%)"
      >
        ↓
      </div>
      <div
        class="absolute text-gray-400 text-lg"
        style="left: 6.25rem; top: 3.5rem; transform: translateX(-50%)"
      >
        ↓
      </div>
    </div>

    <!-- Level 1 - Two Qualified Opinions -->
    <div
      class="relative flex justify-center items-center mb-10 h-20 grid grid-cols-2 gap-32"
    >
      <div class="relative justify-self-end">
        <label
          class="flex items-center justify-center cursor-pointer bg-white border-2 border-gray-300 rounded-lg px-6 py-4 min-w-48 hover:border-blue-400 hover:shadow-md transition-all duration-200 text-center has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:shadow-lg"
        >
          <input
            v-model="selectedOpinion"
            type="radio"
            name="auditOpinion"
            value="qualified-errors"
            class="sr-only"
          />
          <span class="text-sm font-medium text-gray-800 leading-tight"
            >保留意見<br /><small class="text-xs text-gray-600 font-normal"
              >(報告有錯誤)</small
            ></span
          >
        </label>
      </div>

      <div class="relative justify-self-start">
        <label
          class="flex items-center justify-center cursor-pointer bg-white border-2 border-gray-300 rounded-lg px-6 py-4 min-w-48 hover:border-blue-400 hover:shadow-md transition-all duration-200 text-center has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:shadow-lg"
        >
          <input
            v-model="selectedOpinion"
            type="radio"
            name="auditOpinion"
            value="qualified-insufficient"
            class="sr-only"
          />
          <span class="text-sm font-medium text-gray-800 leading-tight"
            >保留意見<br /><small class="text-xs text-gray-600 font-normal"
              >(證據不足)</small
            ></span
          >
        </label>
      </div>
    </div>

    <!-- Connection Lines from Level 1 -->
    <div class="absolute -z-10" style="top: 11.25rem">
      <div
        class="absolute w-0.5 h-6 left-1/4 -translate-x-1/2 bg-gray-300"
      ></div>
      <div
        class="absolute w-0.5 h-6 left-3/4 -translate-x-1/2 bg-gray-300"
      ></div>
      <!-- Arrows pointing down -->
      <div
        class="absolute text-gray-400 text-lg left-1/4 -translate-x-1/2"
        style="top: 1.5rem"
      >
        ↓
      </div>
      <div
        class="absolute text-gray-400 text-lg left-3/4 -translate-x-1/2"
        style="top: 1.5rem"
      >
        ↓
      </div>
    </div>

    <!-- Level 2 - Final Opinions -->
    <div
      class="relative flex justify-center items-center mb-10 h-20 grid grid-cols-2 gap-32"
    >
      <div class="relative justify-self-end">
        <label
          class="flex items-center justify-center cursor-pointer bg-white border-2 border-gray-300 rounded-lg px-6 py-4 min-w-48 hover:border-blue-400 hover:shadow-md transition-all duration-200 text-center has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:shadow-lg"
        >
          <input
            v-model="selectedOpinion"
            type="radio"
            name="auditOpinion"
            value="adverse"
            class="sr-only"
          />
          <span class="text-sm font-medium text-gray-800 leading-tight"
            >否定意見</span
          >
        </label>
      </div>

      <div class="relative justify-self-start">
        <label
          class="flex items-center justify-center cursor-pointer bg-white border-2 border-gray-300 rounded-lg px-6 py-4 min-w-48 hover:border-blue-400 hover:shadow-md transition-all duration-200 text-center has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:shadow-lg"
        >
          <input
            v-model="selectedOpinion"
            type="radio"
            name="auditOpinion"
            value="disclaimer"
            class="sr-only"
          />
          <span class="text-sm font-medium text-gray-800 leading-tight"
            >無法表示意見</span
          >
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const selectedOpinion = ref<string>("");

const opinionNames = {
  unqualified: "無保留意見",
  "qualified-errors": "保留意見（報告有錯誤）",
  "qualified-insufficient": "保留意見（證據不足）",
  adverse: "否定意見",
  disclaimer: "無法表示意見",
};

const getOpinionName = (value: string) => {
  return opinionNames[value as keyof typeof opinionNames] || value;
};

// Emit the selected value to parent component
const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

watch(selectedOpinion, (newValue) => {
  emit("update:modelValue", newValue);
});

// Support v-model
const props = defineProps<{
  modelValue?: string;
}>();

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== selectedOpinion.value) {
      selectedOpinion.value = newValue || "";
    }
  },
  { immediate: true }
);
</script>
