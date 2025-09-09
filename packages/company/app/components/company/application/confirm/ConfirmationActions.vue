<template>
  <div class="flex flex-col sm:flex-row gap-6 justify-center pt-8">
    <UButton
      color="neutral"
      variant="outline"
      size="xl"
      class="min-w-[200px] shadow-md hover:shadow-lg transition-shadow"
      @click="$emit('goBack')"
    >
      <UIcon name="i-lucide-arrow-left" class="w-5 h-5 mr-2" />
      返回修改
    </UButton>
    <UButton
      color="primary"
      size="xl"
      icon="i-lucide-send"
      :disabled="isSubmitting"
      :loading="isSubmitting"
      :label="!isSubmitting ? '確認提交申請' : '提交中...'"
      class="min-w-[200px] shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
      @click="$emit('submit')"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  isSubmitting: boolean;
}

defineProps<Props>();

defineEmits<{
  goBack: [];
  submit: [];
}>();
</script>
