<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-primary mb-6">個人資料</h1>

      <div class="bg-surface rounded-lg p-6 mb-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormGroup label="姓名" name="name">
              <UInput
                v-model="form.name"
                type="text"
                placeholder="請輸入姓名"
              />
            </UFormGroup>

            <UFormGroup label="電子郵件" name="email">
              <UInput
                v-model="form.email"
                type="email"
                placeholder="請輸入電子郵件"
                disabled
              />
            </UFormGroup>

            <UFormGroup label="電話" name="phone">
              <UInput
                v-model="form.phone"
                type="tel"
                placeholder="請輸入電話"
              />
            </UFormGroup>

            <UFormGroup label="公司" name="company">
              <UInput
                v-model="form.company"
                type="text"
                placeholder="請輸入公司名稱"
              />
            </UFormGroup>
          </div>

          <div class="flex justify-end">
            <UButton type="submit" color="primary" :loading="isSubmitting">
              儲存變更
            </UButton>
          </div>
        </form>
      </div>

      <div class="bg-surface rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-6">變更密碼</h2>
        <form @submit.prevent="handlePasswordChange" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormGroup label="目前密碼" name="currentPassword">
              <UInput
                v-model="passwordForm.currentPassword"
                type="password"
                placeholder="請輸入目前密碼"
              />
            </UFormGroup>

            <UFormGroup label="新密碼" name="newPassword">
              <UInput
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="請輸入新密碼"
              />
            </UFormGroup>

            <UFormGroup label="確認新密碼" name="confirmPassword">
              <UInput
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="請再次輸入新密碼"
              />
            </UFormGroup>
          </div>

          <div class="flex justify-end">
            <UButton
              type="submit"
              color="primary"
              :loading="isPasswordSubmitting"
            >
              變更密碼
            </UButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "姓名至少需要2個字"),
  email: z.string().email("請輸入有效的電子郵件地址"),
  phone: z
    .string()
    .regex(/^(\d{2,3}-?|\(\d{2,3}\))\d{3,4}-?\d{4}$/, "請輸入有效的電話號碼"),
  company: z.string().min(2, "公司名稱至少需要2個字"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "密碼至少需要6個字"),
    newPassword: z.string().min(6, "密碼至少需要6個字"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "兩次輸入的密碼不一致",
    path: ["confirmPassword"],
  });

type Schema = z.output<typeof schema>;
type PasswordSchema = z.output<typeof passwordSchema>;

const form = reactive<Schema>({
  name: "",
  email: "",
  phone: "",
  company: "",
});

const passwordForm = reactive<PasswordSchema>({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const isSubmitting = ref(false);
const isPasswordSubmitting = ref(false);
const toast = useToast();

async function handleSubmit() {
  isSubmitting.value = true;
  try {
    // TODO: Implement profile update logic
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

    toast.add({
      title: "更新成功",
      description: "個人資料已更新",
      color: "success",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    toast.add({
      title: "更新失敗",
      description: "請稍後再試",
      color: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
}

async function handlePasswordChange() {
  isPasswordSubmitting.value = true;
  try {
    // TODO: Implement password change logic
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

    toast.add({
      title: "密碼已更新",
      description: "您的密碼已成功變更",
      color: "success",
    });

    // Clear password form
    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";
  } catch (error) {
    console.error("Password change error:", error);
    toast.add({
      title: "密碼變更失敗",
      description: "請稍後再試",
      color: "error",
    });
  } finally {
    isPasswordSubmitting.value = false;
  }
}

definePageMeta({
  layout: "default",
  middleware: ["auth"],
});
</script>
