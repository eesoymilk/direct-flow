<template>
  <UForm :state="state" :schema="schema" @submit="handleSubmit">
    <UFormField name="value">
      <div class="flex items-center gap-2">
        <UInput
          v-model="state.value"
          :placeholder="placeholder"
          :disabled="!isEditing"
          :readonly="!isEditing"
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
import * as z from "zod";

const schema = z.object({
  value: z.string().min(1, "請輸入值"),
});

const props = defineProps<{
  placeholder: string;
  initialValue?: string;
}>();

const emit = defineEmits<{
  (e: "submit", value: string): void;
}>();

const state = ref<z.infer<typeof schema>>({
  value: props.initialValue ?? "",
});

const isEditing = ref(false);

const handleCancel = () => {
  isEditing.value = false;
  state.value.value = props.initialValue ?? "";
};

const handleSubmit = () => {
  isEditing.value = false;
  if (state.value.value.trim() !== props.initialValue?.trim()) {
    emit("submit", state.value.value);
  }
};
</script>
