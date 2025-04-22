<template>
  <div
    class="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold text-primary">登入您的帳號</h2>
        <p class="mt-2 text-sm text-text-secondary">
          或
          <NuxtLink
            to="/register"
            class="font-medium text-primary hover:text-primary-600"
          >
            註冊新帳號
          </NuxtLink>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm space-y-4">
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
              autocomplete="current-password"
              placeholder="請輸入密碼"
            />
          </UFormGroup>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <UCheckbox
              v-model="form.rememberMe"
              name="remember-me"
              label="記住我"
            />
          </div>

          <div class="text-sm">
            <NuxtLink
              to="/forgot-password"
              class="font-medium text-primary hover:text-primary-600"
            >
              忘記密碼？
            </NuxtLink>
          </div>
        </div>

        <div>
          <UButton type="submit" color="primary" block :loading="isSubmitting">
            登入
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

const schema = z.object({
  email: z.string().email("請輸入有效的電子郵件地址"),
  password: z.string().min(6, "密碼至少需要6個字"),
  rememberMe: z.boolean().default(false),
});

type Schema = z.output<typeof schema>;

const form = reactive<Schema>({
  email: "",
  password: "",
  rememberMe: false,
});

const isSubmitting = ref(false);
const toast = useToast();

async function handleSubmit() {
  isSubmitting.value = true;
  try {
    // TODO: Implement login logic
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

    // Show success message
    toast.add({
      title: "登入成功",
      description: "歡迎回來！",
      color: "success",
    });

    // Redirect to dashboard
    navigateTo("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    toast.add({
      title: "登入失敗",
      description: "請檢查您的帳號密碼是否正確",
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
