export interface ReportModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  status: 'pending' | 'in_progress' | 'completed';
  data?: Record<string, any>;
  dependencies?: string[];
  validationRules?: ValidationRule[];
}

export interface ValidationRule {
  field: string;
  required: boolean;
  type: 'string' | 'number' | 'date' | 'file';
  message?: string;
}

export const useReportBuilder = () => {
  const selectedModules = ref<ReportModule[]>([]);
  const activeModule = ref<ReportModule | null>(null);

  // Available module templates
  const moduleTemplates: Record<string, Omit<ReportModule, 'id'>> = {
    companyInfo: {
      title: "公司基本資料",
      description: "公司名稱、統一編號、地址",
      icon: "i-lucide-building-2",
      color: "blue",
      status: "pending",
      validationRules: [
        { field: "companyName", required: true, type: "string", message: "公司名稱為必填" },
        { field: "taxId", required: true, type: "string", message: "統一編號為必填" },
        { field: "address", required: true, type: "string", message: "地址為必填" }
      ]
    },
    auditorInfo: {
      title: "會計師資訊",
      description: "會計師事務所、簽證會計師",
      icon: "i-lucide-user-check",
      color: "green",
      status: "pending",
      validationRules: [
        { field: "firmName", required: true, type: "string", message: "會計師事務所名稱為必填" },
        { field: "auditorName", required: true, type: "string", message: "簽證會計師為必填" }
      ]
    },
    balanceSheet: {
      title: "資產負債表",
      description: "流動/非流動資產與負債",
      icon: "i-lucide-scale",
      color: "purple",
      status: "pending",
      dependencies: ["companyInfo"],
      validationRules: [
        { field: "currentAssets", required: true, type: "number", message: "流動資產為必填" },
        { field: "currentLiabilities", required: true, type: "number", message: "流動負債為必填" }
      ]
    },
    incomeStatement: {
      title: "損益表",
      description: "營業收入、成本、費用",
      icon: "i-lucide-trending-up",
      color: "orange",
      status: "pending",
      dependencies: ["companyInfo"],
      validationRules: [
        { field: "revenue", required: true, type: "number", message: "營業收入為必填" },
        { field: "expenses", required: true, type: "number", message: "營業費用為必填" }
      ]
    },
    cashFlow: {
      title: "現金流量表",
      description: "營業、投資、融資活動",
      icon: "i-lucide-banknote",
      color: "emerald",
      status: "pending",
      dependencies: ["balanceSheet", "incomeStatement"],
      validationRules: [
        { field: "operatingCashFlow", required: true, type: "number", message: "營業活動現金流量為必填" }
      ]
    },
    accountingPolicies: {
      title: "會計政策",
      description: "重大會計政策揭露",
      icon: "i-lucide-file-text",
      color: "indigo",
      status: "pending",
      validationRules: [
        { field: "policies", required: true, type: "string", message: "會計政策內容為必填" }
      ]
    },
    relatedParty: {
      title: "關係人交易",
      description: "關係人及其交易",
      icon: "i-lucide-users",
      color: "pink",
      status: "pending",
      validationRules: [
        { field: "relatedParties", required: false, type: "string" }
      ]
    }
  };

  // Add module to report
  const addModule = (templateKey: string) => {
    const template = moduleTemplates[templateKey];
    if (!template) return;

    const newModule: ReportModule = {
      id: `${templateKey}_${Date.now()}`,
      ...template
    };

    // Check dependencies
    const missingDependencies = template.dependencies?.filter(dep => 
      !selectedModules.value.some(m => m.id.startsWith(dep))
    ) || [];

    if (missingDependencies.length > 0) {
      console.warn(`Missing dependencies: ${missingDependencies.join(', ')}`);
      return;
    }

    selectedModules.value.push(newModule);
    activeModule.value = newModule;
  };

  // Remove module
  const removeModule = (index: number) => {
    const moduleToRemove = selectedModules.value[index];
    
    // Check if other modules depend on this one
    const dependentModules = selectedModules.value.filter(m => 
      m.dependencies?.some(dep => moduleToRemove.id.startsWith(dep))
    );

    if (dependentModules.length > 0) {
      console.warn(`Cannot remove module: ${dependentModules.map(m => m.title).join(', ')} depends on it`);
      return;
    }

    selectedModules.value.splice(index, 1);
    if (activeModule.value?.id === moduleToRemove.id) {
      activeModule.value = selectedModules.value[0] || null;
    }
  };

  // Update module status
  const updateModuleStatus = (moduleId: string, status: ReportModule['status']) => {
    const module = selectedModules.value.find(m => m.id === moduleId);
    if (module) {
      module.status = status;
    }
  };

  // Update module data
  const updateModuleData = (moduleId: string, data: Record<string, any>) => {
    const module = selectedModules.value.find(m => m.id === moduleId);
    if (module) {
      module.data = { ...module.data, ...data };
    }
  };

  // Validate module
  const validateModule = (module: ReportModule): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    module.validationRules?.forEach(rule => {
      const value = module.data?.[rule.field];
      
      if (rule.required && (!value || value === '')) {
        errors.push(rule.message || `${rule.field} is required`);
      }
      
      if (value && rule.type === 'number' && isNaN(Number(value))) {
        errors.push(`${rule.field} must be a number`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Calculate completion percentage
  const getCompletionPercentage = computed(() => {
    if (selectedModules.value.length === 0) return 0;
    
    const completedCount = selectedModules.value.filter(m => m.status === 'completed').length;
    return Math.round((completedCount / selectedModules.value.length) * 100);
  });

  // Check if report can be generated
  const canGenerateReport = computed(() => {
    return selectedModules.value.length > 0 && 
           selectedModules.value.every(m => validateModule(m).isValid);
  });

  return {
    selectedModules,
    activeModule,
    moduleTemplates,
    addModule,
    removeModule,
    updateModuleStatus,
    updateModuleData,
    validateModule,
    getCompletionPercentage,
    canGenerateReport
  };
};