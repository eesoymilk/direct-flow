import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import FormPart1 from "../../app/components/company/application/form/part/1.vue";
import { useCompanyApplicationStore } from "../../app/composables/stores/companyApplication";

// Mock Nuxt UI components
vi.mock('@nuxt/ui', () => ({
  UFormField: {
    name: 'UFormField',
    template: '<div class="form-field"><label>{{ label }}</label><slot /></div>',
    props: ['label', 'name', 'required']
  },
  URadioGroup: {
    name: 'URadioGroup',
    template: '<div class="radio-group" @click="$emit(\'update:modelValue\', items[0]?.value)"><slot name="description" v-for="item in items" :item="item" /></div>',
    props: ['modelValue', 'items', 'valueKey', 'variant'],
    emits: ['update:modelValue']
  },
  UCheckbox: {
    name: 'UCheckbox',
    template: '<input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" class="checkbox" />{{ label }}',
    props: ['modelValue', 'label'],
    emits: ['update:modelValue']
  },
  UInput: {
    name: 'UInput',
    template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" :type="type" :min="min" :placeholder="placeholder" :disabled="disabled" class="input" />',
    props: ['modelValue', 'type', 'min', 'placeholder', 'disabled'],
    emits: ['update:modelValue']
  },
  UInputNumber: {
    name: 'UInputNumber',
    template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', Number($event.target.value))" type="number" :min="min" :placeholder="placeholder" :disabled="disabled" class="input-number" />',
    props: ['modelValue', 'min', 'placeholder', 'formatOptions', 'disabled'],
    emits: ['update:modelValue']
  },
  UInputTags: {
    name: 'UInputTags',
    template: '<input :value="modelValue?.join(\', \')" @input="$emit(\'update:modelValue\', $event.target.value.split(\', \'))" :placeholder="placeholder" :max="max" class="input-tags" />',
    props: ['modelValue', 'placeholder', 'max'],
    emits: ['update:modelValue']
  },
  UTextarea: {
    name: 'UTextarea',
    template: '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" :placeholder="placeholder" class="textarea"></textarea>',
    props: ['modelValue', 'placeholder'],
    emits: ['update:modelValue']
  }
}));

// Mock organization type items
vi.mock('../../app/components/company/application/helpers', () => ({
  organizationTypeItems: [
    { id: 'corporation', value: 'corporation', label: '股份有限公司', description: 'Corporation description' },
    { id: 'limited_company', value: 'limited_company', label: '有限公司', description: 'Limited company description' },
    { id: 'sole_proprietorship', value: 'sole_proprietorship', label: '獨資', description: 'Sole proprietorship description' },
    { id: 'partnership', value: 'partnership', label: '合夥', description: 'Partnership description' }
  ]
}));

describe("Organization Type Form Part 1", () => {
  let store: ReturnType<typeof useCompanyApplicationStore>;
  let wrapper: any;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useCompanyApplicationStore();
    store.resetForm();
  });

  const createWrapper = () => {
    return mount(FormPart1, {
      global: {
        plugins: [createPinia()]
      }
    });
  };

  describe("Organization Type Selection", () => {
    it("should render organization type selection", () => {
      wrapper = createWrapper();
      expect(wrapper.find('.radio-group').exists()).toBe(true);
    });

    it("should show corporation-specific checkboxes when corporation is selected", async () => {
      wrapper = createWrapper();
      store.formState.organizationType = "corporation";
      await wrapper.vm.$nextTick();
      
      // Should show closely held and par value free shares checkboxes in description template
      expect(wrapper.html()).toContain('閉鎖型股份有限公司');
      expect(wrapper.html()).toContain('無票面閉鎖型股份有限公司');
    });

    it("should not show corporation-specific checkboxes for other organization types", async () => {
      wrapper = createWrapper();
      store.formState.organizationType = "limited_company";
      await wrapper.vm.$nextTick();
      
      // Should not show corporation-specific checkboxes
      expect(wrapper.html()).not.toContain('閉鎖型股份有限公司');
      expect(wrapper.html()).not.toContain('無票面閉鎖型股份有限公司');
    });
  });

  describe("Shared Fields (Corporation and Limited Company)", () => {
    it("should show shared fields when corporation is selected", async () => {
      wrapper = createWrapper();
      store.formState.organizationType = "corporation";
      await wrapper.vm.$nextTick();

      expect(wrapper.html()).toContain('僑外投資事業');
      expect(wrapper.html()).toContain('陸資');
      expect(wrapper.html()).toContain('組織類型相關資料');
    });

    it("should show shared fields when limited company is selected", async () => {
      wrapper = createWrapper();
      store.formState.organizationType = "limited_company";
      await wrapper.vm.$nextTick();

      expect(wrapper.html()).toContain('僑外投資事業');
      expect(wrapper.html()).toContain('陸資');
      expect(wrapper.html()).toContain('組織類型相關資料');
    });

    it("should not show shared fields for other organization types", async () => {
      wrapper = createWrapper();
      store.formState.organizationType = "sole_proprietorship";
      await wrapper.vm.$nextTick();

      expect(wrapper.html()).not.toContain('僑外投資事業');
      expect(wrapper.html()).not.toContain('陸資');
      expect(wrapper.html()).not.toContain('組織類型相關資料');
    });

    it("should bind shared field values correctly", async () => {
      wrapper = createWrapper();
      store.formState.organizationType = "corporation";
      store.formState.isForeignInvestment = true;
      store.formState.isChineseInvestment = true;
      await wrapper.vm.$nextTick();

      const checkboxes = wrapper.findAll('input[type="checkbox"]');
      const foreignInvestmentCheckbox = checkboxes.find((cb: any) => 
        cb.element.parentElement?.textContent?.includes('僑外投資事業')
      );
      const chineseInvestmentCheckbox = checkboxes.find((cb: any) => 
        cb.element.parentElement?.textContent?.includes('陸資')
      );

      expect(foreignInvestmentCheckbox?.element?.checked).toBe(true);
      expect(chineseInvestmentCheckbox?.element?.checked).toBe(true);
    });
  });

  describe("Corporation-Specific Fields", () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      store.formState.organizationType = "corporation";
      await wrapper.vm.$nextTick();
    });

    it("should show corporation-specific fields", () => {
      expect(wrapper.html()).toContain('股份有限公司特有資料');
      expect(wrapper.html()).toContain('公開發行');
      expect(wrapper.html()).toContain('複數表決權特別股');
      expect(wrapper.html()).toContain('對於特定事項具否決權特別股');
      expect(wrapper.html()).toContain('特別股股東董監事相關權利');
    });

    it("should show shareholder count field when closely held", async () => {
      store.formState.isCloselyHeld = true;
      await wrapper.vm.$nextTick();

      expect(wrapper.html()).toContain('閉鎖性股份有限公司股東人數');
      expect(wrapper.html()).toContain('請輸入股東人數');
    });

    it("should not show shareholder count field when not closely held", async () => {
      store.formState.isCloselyHeld = false;
      await wrapper.vm.$nextTick();

      expect(wrapper.html()).not.toContain('閉鎖性股份有限公司股東人數');
    });

    it("should bind corporation-specific field values correctly", async () => {
      store.formState.isPublicOffering = true;
      store.formState.hasMultipleVotingRightsPreferredShares = true;
      store.formState.hasVetoRightsPreferredShares = false;
      store.formState.hasPreferredSharesBoardRights = true;
      await wrapper.vm.$nextTick();

      const checkboxes = wrapper.findAll('input[type="checkbox"]');
      const publicOfferingCheckbox = checkboxes.find((cb: any) => 
        cb.element.parentElement?.textContent?.includes('公開發行')
      );
      const multipleVotingCheckbox = checkboxes.find((cb: any) => 
        cb.element.parentElement?.textContent?.includes('複數表決權特別股')
      );

      expect(publicOfferingCheckbox?.element?.checked).toBe(true);
      expect(multipleVotingCheckbox?.element?.checked).toBe(true);
    });
  });

  describe("Limited Company-Specific Fields", () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      store.formState.organizationType = "limited_company";
      await wrapper.vm.$nextTick();
    });

    it("should show limited company-specific fields", () => {
      expect(wrapper.html()).toContain('有限公司特有資料');
      expect(wrapper.html()).toContain('一人公司');
      expect(wrapper.html()).toContain('是否為一人有限公司');
    });

    it("should not show corporation-specific fields", () => {
      expect(wrapper.html()).not.toContain('股份有限公司特有資料');
      expect(wrapper.html()).not.toContain('公開發行');
      expect(wrapper.html()).not.toContain('複數表決權特別股');
    });

    it("should bind limited company field values correctly", async () => {
      store.formState.isSoleProprietorshipLLC = true;
      await wrapper.vm.$nextTick();

      const checkboxes = wrapper.findAll('input[type="checkbox"]');
      const soleProprietorshipCheckbox = checkboxes.find((cb: any) => 
        cb.element.parentElement?.textContent?.includes('一人公司')
      );

      expect(soleProprietorshipCheckbox?.element?.checked).toBe(true);
    });
  });

  describe("Capital and Shares Section", () => {
    it("should always show capital amount field", async () => {
      wrapper = createWrapper();
      
      // Test with corporation
      store.formState.organizationType = "corporation";
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toContain('資本總額');

      // Test with limited company
      store.formState.organizationType = "limited_company";
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toContain('資本總額');
    });

    it("should show share-related fields for corporations", async () => {
      wrapper = createWrapper();
      store.formState.organizationType = "corporation";
      await wrapper.vm.$nextTick();

      expect(wrapper.html()).toContain('股份總數');
      expect(wrapper.html()).toContain('票面金額');
      expect(wrapper.html()).toContain('每股票面金額，選擇無票面金額時此欄位將被停用');
    });

    it("should not show share-related fields for limited companies", async () => {
      wrapper = createWrapper();
      store.formState.organizationType = "limited_company";
      await wrapper.vm.$nextTick();

      expect(wrapper.html()).not.toContain('股份總數');
      expect(wrapper.html()).not.toContain('票面金額');
    });

    it("should disable par value field when par value free shares is enabled", async () => {
      wrapper = createWrapper();
      store.formState.organizationType = "corporation";
      store.formState.hasParValueFreeShares = true;
      await wrapper.vm.$nextTick();

      const parValueInput = wrapper.find('input[placeholder*="票面金額"]');
      expect(parValueInput.element.disabled).toBe(true);
    });

    it("should enable par value field when par value free shares is disabled", async () => {
      wrapper = createWrapper();
      store.formState.organizationType = "corporation";
      store.formState.hasParValueFreeShares = false;
      await wrapper.vm.$nextTick();

      const parValueInput = wrapper.find('input[placeholder*="票面金額"]');
      expect(parValueInput.element.disabled).toBe(false);
    });

    it("should bind capital and share values correctly", async () => {
      wrapper = createWrapper();
      store.formState.organizationType = "corporation";
      store.formState.capitalAmount = 5000000;
      store.formState.totalShares = 100000;
      store.formState.parValue = 50;
      await wrapper.vm.$nextTick();

      const capitalInput = wrapper.find('.input-number');
      const shareInputs = wrapper.findAll('.input-number');
      
      expect(Number(capitalInput.element.value)).toBe(5000000);
      // Find totalShares and parValue inputs
      const totalSharesInput = shareInputs.find((input: any) => 
        input.element.placeholder?.includes('股份總數')
      );
      const parValueInput = shareInputs.find((input: any) => 
        input.element.placeholder?.includes('票面金額')
      );
      
      if (totalSharesInput) expect(Number(totalSharesInput.element.value)).toBe(100000);
      if (parValueInput) expect(Number(parValueInput.element.value)).toBe(50);
    });
  });

  describe("Form Field Interactions", () => {
    it("should update store when form fields change", async () => {
      wrapper = createWrapper();
      store.formState.organizationType = "corporation";
      await wrapper.vm.$nextTick();

      // Update foreign investment checkbox
      const checkboxes = wrapper.findAll('input[type="checkbox"]');
      const foreignInvestmentCheckbox = checkboxes.find((cb: any) => 
        cb.element.parentElement?.textContent?.includes('僑外投資事業')
      );

      if (foreignInvestmentCheckbox) {
        await foreignInvestmentCheckbox.setValue(true);
        expect(store.formState.isForeignInvestment).toBe(true);
      }

      // Update capital amount
      const capitalInput = wrapper.find('.input-number');
      await capitalInput.setValue('2000000');
      expect(store.formState.capitalAmount).toBe(2000000);
    });

    it("should handle shareholder count input for closely held corporations", async () => {
      wrapper = createWrapper();
      store.formState.organizationType = "corporation";
      store.formState.isCloselyHeld = true;
      await wrapper.vm.$nextTick();

      const shareholderCountInput = wrapper.find('input[placeholder*="股東人數"]');
      await shareholderCountInput.setValue('15');
      expect(store.formState.closelyHeldShareholderCount).toBe(15);
    });

    it("should handle candidate names input", async () => {
      wrapper = createWrapper();
      const candidateNamesInput = wrapper.find('.input-tags');
      await candidateNamesInput.setValue('測試公司1, 測試公司2');
      
      expect(store.formState.candidateNames).toEqual(['測試公司1', '測試公司2']);
    });

    it("should handle business description textarea", async () => {
      wrapper = createWrapper();
      const businessDescInput = wrapper.find('.textarea');
      await businessDescInput.setValue('軟體開發、資訊服務');
      
      expect(store.formState.businessItemsDescription).toBe('軟體開發、資訊服務');
    });

    it("should handle address input", async () => {
      wrapper = createWrapper();
      const addressInputs = wrapper.findAll('.input');
      const addressInput = addressInputs.find((input: any) => 
        input.element.placeholder?.includes('公司地址')
      );
      
      if (addressInput) {
        await addressInput.setValue('台北市信義區信義路五段7號');
        expect(store.formState.address).toBe('台北市信義區信義路五段7號');
      }
    });
  });

  describe("Responsive Behavior", () => {
    it("should apply responsive grid classes", async () => {
      wrapper = createWrapper();
      store.formState.organizationType = "corporation";
      await wrapper.vm.$nextTick();

      expect(wrapper.html()).toContain('grid-cols-1 md:grid-cols-2');
    });

    it("should have appropriate styling for different sections", async () => {
      wrapper = createWrapper();
      store.formState.organizationType = "corporation";
      await wrapper.vm.$nextTick();

      // Shared fields section
      expect(wrapper.html()).toContain('bg-gray-50');
      
      // Corporation-specific section
      expect(wrapper.html()).toContain('bg-blue-50');
      
      store.formState.organizationType = "limited_company";
      await wrapper.vm.$nextTick();
      
      // Limited company-specific section
      expect(wrapper.html()).toContain('bg-green-50');
    });
  });

  describe("Required Field Indicators", () => {
    it("should show required indicator for shareholder count when closely held", async () => {
      wrapper = createWrapper();
      store.formState.organizationType = "corporation";
      store.formState.isCloselyHeld = true;
      await wrapper.vm.$nextTick();

      // Check for required prop on shareholder count field
      const formFields = wrapper.findAllComponents({ name: 'UFormField' });
      const shareholderCountField = formFields.find((field: any) => 
        field.props().name === 'closelyHeldShareholderCount'
      );
      
      expect(shareholderCountField?.props().required).toBe(true);
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });
});