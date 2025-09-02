import type { RadioGroupItem } from "@nuxt/ui";

export const organizationTypeItems = ref([
  {
    label: "股份有限公司",
    description: "適合大型企業和需要募集資本的公司",
    value: "company_limited",
    id: "company_limited",
  },
  {
    label: "有限公司",
    description: "適合中小型企業，股東責任有限",
    value: "limited_company",
    id: "limited_company",
  },
  {
    label: "獨資",
    description: "個人經營的事業，無須合夥人",
    value: "sole_proprietorship",
    id: "sole_proprietorship",
  },
  {
    label: "合夥",
    description: "兩人以上合作經營的事業",
    value: "partnership",
    id: "partnership",
  },
] satisfies RadioGroupItem[]);
