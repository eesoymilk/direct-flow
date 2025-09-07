/**
 * Generic form validation composable
 * Provides reactive validation with Zod schemas and Nuxt UI integration
 */

import type { ZodSchema, ZodError } from 'zod';

interface ValidationOptions {
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  debounceMs?: number;
}

export const useFormValidation = <T>(
  schema: ZodSchema<T>,
  initialData: T,
  options: ValidationOptions = {}
) => {
  const {
    validateOnBlur = true,
    validateOnChange = false,
    debounceMs = 300,
  } = options;

  // Reactive state
  const formData = reactive<T>({ ...initialData });
  const errors = ref<Record<string, string[]>>({});
  const fieldErrors = ref<Record<string, string>>({});
  const isValid = ref(true);
  const isValidating = ref(false);
  const hasAttemptedSubmit = ref(false);

  // Computed properties
  const hasErrors = computed(() => Object.keys(errors.value).length > 0);
  
  const getFieldError = (fieldName: string) =>
    computed(() => fieldErrors.value[fieldName]);

  const isFieldValid = (fieldName: string) =>
    computed(() => !fieldErrors.value[fieldName]);

  // Methods
  const clearErrors = () => {
    errors.value = {};
    fieldErrors.value = {};
    isValid.value = true;
  };

  const setFieldError = (fieldName: string, message: string) => {
    fieldErrors.value[fieldName] = message;
    if (!errors.value[fieldName]) {
      errors.value[fieldName] = [];
    }
    errors.value[fieldName].push(message);
    isValid.value = false;
  };

  const clearFieldError = (fieldName: string) => {
    delete fieldErrors.value[fieldName];
    delete errors.value[fieldName];
    isValid.value = Object.keys(fieldErrors.value).length === 0;
  };

  const validateField = (fieldName: string, value: any) => {
    try {
      // Create a partial schema for single field validation
      const fieldSchema = schema.pick({ [fieldName]: true } as any);
      fieldSchema.parse({ [fieldName]: value });
      clearFieldError(fieldName);
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldError = error.errors.find(e => 
          e.path.includes(fieldName)
        );
        if (fieldError) {
          setFieldError(fieldName, fieldError.message);
        }
      }
      return false;
    }
  };

  const validateAll = async () => {
    isValidating.value = true;
    clearErrors();

    try {
      await schema.parseAsync(formData);
      isValid.value = true;
      return { success: true, data: formData };
    } catch (error) {
      if (error instanceof ZodError) {
        error.errors.forEach((err) => {
          const fieldName = err.path.join('.');
          if (!errors.value[fieldName]) {
            errors.value[fieldName] = [];
          }
          errors.value[fieldName].push(err.message);
          fieldErrors.value[fieldName] = err.message;
        });
      }
      isValid.value = false;
      return { success: false, errors: errors.value };
    } finally {
      isValidating.value = false;
    }
  };

  const handleSubmit = async (onSubmit: (data: T) => Promise<void> | void) => {
    hasAttemptedSubmit.value = true;
    const validation = await validateAll();
    
    if (validation.success) {
      try {
        await onSubmit(formData);
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('表單驗證失敗');
    }
  };

  const resetForm = () => {
    Object.assign(formData, initialData);
    clearErrors();
    hasAttemptedSubmit.value = false;
  };

  const updateField = (fieldName: string, value: any) => {
    (formData as any)[fieldName] = value;
    
    if (validateOnChange || hasAttemptedSubmit.value) {
      debounce(() => validateField(fieldName, value), debounceMs)();
    }
  };

  // Debounced validation for real-time feedback
  const debouncedValidateAll = debounce(validateAll, debounceMs);

  // Watch for changes and validate if enabled
  if (validateOnChange) {
    watch(
      formData,
      () => {
        if (hasAttemptedSubmit.value) {
          debouncedValidateAll();
        }
      },
      { deep: true }
    );
  }

  return {
    // State
    formData,
    errors: readonly(errors),
    fieldErrors: readonly(fieldErrors),
    isValid: readonly(isValid),
    isValidating: readonly(isValidating),
    hasErrors,
    hasAttemptedSubmit: readonly(hasAttemptedSubmit),

    // Methods
    getFieldError,
    isFieldValid,
    validateField,
    validateAll,
    clearErrors,
    clearFieldError,
    setFieldError,
    updateField,
    handleSubmit,
    resetForm,
  };
};