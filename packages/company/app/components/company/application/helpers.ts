import type { RadioGroupItem } from "@nuxt/ui";

export const organizationTypeItems = ref([
  {
    label: "股份有限公司",
    id: "limited_company",
  },
  {
    label: "有限公司",
    id: "company_limited",
  },
  {
    label: "獨資",
    id: "sole_proprietorship",
  },
  {
    label: "合夥",
    id: "partnership",
  },
] satisfies RadioGroupItem[]);
