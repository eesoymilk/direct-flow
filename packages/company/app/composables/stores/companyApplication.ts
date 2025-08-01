import * as z from "zod";

const personSchema = z.object({
  name: z.string().min(1, "姓名為必填"),
  idNumber: z.string().min(1, "身分證字號為必填"),
  address: z.string().min(1, "戶籍地址為必填"),
  idCardFront: z.instanceof(File),
  idCardBack: z.instanceof(File),
});

const formSchema = z.object({
  name: z.string().min(1, "公司名稱為必填"),
  organizationType: z.enum([
    "limited_company",
    "company_limited",
    "sole_proprietorship",
    "partnership",
  ]),
  businessItemsDescription: z.string().min(1, "營業項目描述為必填"),
  address: z.string().min(1, "公司地址為必填"),
  isDirectorSameAsResponsiblePerson: z.boolean(),
  isContactPersonSameAsResponsiblePerson: z.boolean(),
  isContactPersonSameAsDirector: z.boolean(),
});

type FormSchema = z.output<typeof formSchema>;

export const useCompanyApplicationStore = defineStore(
  "companyApplication",
  () => {
    const form = reactive<
      Partial<FormSchema> & {
        responsiblePerson: z.output<typeof personSchema>;
        director: z.output<typeof personSchema>;
        contactPerson: z.output<typeof personSchema>;
        shareholders: z.output<typeof personSchema>[];
      }
    >({
      responsiblePerson: {
        name: "",
        idNumber: "",
        address: "",
        idCardFront: undefined as any,
        idCardBack: undefined as any,
      },
      director: {
        name: "",
        idNumber: "",
        address: "",
        idCardFront: undefined as any,
        idCardBack: undefined as any,
      },
      contactPerson: {
        name: "",
        idNumber: "",
        address: "",
        idCardFront: undefined as any,
        idCardBack: undefined as any,
      },
      shareholders: [
        {
          name: "",
          idNumber: "",
          address: "",
          idCardFront: undefined as any,
          idCardBack: undefined as any,
        },
      ],
    });

    function addShareholder() {
      form.shareholders.push({
        name: "",
        idNumber: "",
        address: "",
        idCardFront: undefined as any,
        idCardBack: undefined as any,
      });
    }

    function removeShareholder(index: number) {
      form.shareholders.splice(index, 1);
    }

    return {
      personSchema,
      formSchema,
      form,

      addShareholder,
      removeShareholder,
    };
  }
);
