<template>
  <UForm :state="state" :schema="schema" @submit="handleSubmit">
    <UFormField name="value">
      <div class="flex items-center gap-2">
        <UInputTags
          v-model="state.value"
          :placeholder="isEditing ? placeholder : ''"
          :disabled="!isEditing"
          :readonly="!isEditing"
          class="w-full"
          :max="5"
        />
        <FormedActions
          :is-editing="isEditing"
          orientation="vertical"
          @edit="isEditing = true"
          @cancel="handleCancel"
        />
      </div>
    </UFormField>
  </UForm>
</template>

<script setup lang="ts">
import * as z from "zod";

const schema = z.object({
  value: z.array(z.string()).min(1, "請輸入值"),
});

const props = defineProps<{
  placeholder: string;
  initialValue?: string[];
}>();

const emit = defineEmits<{
  (e: "submit", value: string[]): void;
}>();

const state = ref<z.infer<typeof schema>>({
  value: props.initialValue ?? [],
});

const isEditing = ref(false);

const isDifferent = computed(() => {
  for (let i = 0; i < state.value.value.length; i++) {
    if (state.value.value[i] !== props.initialValue?.[i]) {
      return true;
    }
  }
  return false;
});

const handleCancel = () => {
  isEditing.value = false;
  state.value.value = props.initialValue ?? [];
};

const handleSubmit = () => {
  isEditing.value = false;
  if (isDifferent.value) {
    emit("submit", state.value.value);
  }
};
</script>
