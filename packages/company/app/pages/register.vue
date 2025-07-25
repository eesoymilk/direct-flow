<template>
  <div
    class="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold text-primary">註冊新帳號</h2>
        <p class="mt-2 text-sm text-text-secondary">
          或
          <NuxtLink
            to="/login"
            class="font-medium text-primary hover:text-primary-600"
          >
            登入現有帳號
          </NuxtLink>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm space-y-4">
          <UFormGroup label="姓名" name="name">
            <UInput
              v-model="form.name"
              type="text"
              autocomplete="name"
              placeholder="請輸入姓名"
            />
          </UFormGroup>

          <UFormGroup label="電子郵件" name="email">
            <UInput
              v-model="form.email"
              type="email"
              autocomplete="email"
              placeholder="請輸入電子郵件"
            />
          </UFormGroup>

          <UFormGroup label="密碼" name="password">
            <UInput
              v-model="form.password"
              type="password"
              autocomplete="new-password"
              placeholder="請輸入密碼"
            />
          </UFormGroup>

          <UFormGroup label="確認密碼" name="confirmPassword">
            <UInput
              v-model="form.confirmPassword"
              type="password"
              autocomplete="new-password"
              placeholder="請再次輸入密碼"
            />
          </UFormGroup>
        </div>

        <div class="flex items-center">
          <UCheckbox
            v-model="form.agreeToTerms"
            name="agree-to-terms"
            label="我同意服務條款和隱私政策"
          />
        </div>

        <div>
          <UButton type="submit" color="primary" block :loading="isSubmitting">
            註冊
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

const schema = z
  .object({
    name: z.string().min(2, "姓名至少需要2個字"),
    email: z.string().email("請輸入有效的電子郵件地址"),
    password: z.string().min(6, "密碼至少需要6個字"),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "您必須同意服務條款和隱私政策",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "兩次輸入的密碼不一致",
    path: ["confirmPassword"],
  });

type Schema = z.output<typeof schema>;

const form = reactive<Schema>({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
});

const isSubmitting = ref(false);
const toast = useToast();

async function handleSubmit() {
  isSubmitting.value = true;
  try {
    // TODO: Implement registration logic
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

    // Show success message
    toast.add({
      title: "註冊成功",
      description: "歡迎加入我們！",
      color: "success",
    });

    // Redirect to dashboard
    navigateTo("/dashboard");
  } catch (error) {
    console.error("Registration error:", error);
    toast.add({
      title: "註冊失敗",
      description: "請稍後再試",
      color: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
}

definePageMeta({
  layout: "default",
  middleware: ["guest"],
});
</script>
