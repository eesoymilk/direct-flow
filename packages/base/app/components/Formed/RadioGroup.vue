<template>
  <UForm :state="state" :schema="schema" @submit="handleSubmit">
    <UFormField name="value">
      <div class="flex items-center gap-2">
        <URadioGroup
          v-model="state.value"
          :items="radioGroupItems"
          :disabled="!isEditing"
          size="xs"
          value-key="id"
          orientation="horizontal"
          variant="table"
          class="w-full"
        />
        <FormedActions
          :is-editing="isEditing"
          @edit="isEditing = true"
          @cancel="handleCancel"
        />
      </div>
    </UFormField>
  </UForm>
</template>

<script setup lang="ts">
import type { RadioGroupItem } from "@nuxt/ui";
import * as z from "zod";

const schema = z.object({
  value: z.string().min(1, "請選擇值"),
});

const props = defineProps<{
  radioGroupItems: RadioGroupItem[];
  initialValue?: string;
}>();

const emit = defineEmits<{
  (e: "submit", value: string): void;
}>();

const state = ref<z.infer<typeof schema>>({
  value: props.initialValue ?? "",
});

const isEditing = ref(false);

const isDifferent = computed(() => {
  return state.value.value !== props.initialValue;
});

const handleCancel = () => {
  isEditing.value = false;
  state.value.value = props.initialValue ?? "";
};

const handleSubmit = () => {
  isEditing.value = false;
  if (isDifferent.value) {
    emit("submit", state.value.value);
  }
};
</script>
