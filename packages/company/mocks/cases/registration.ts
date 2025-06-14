import type { z } from "zod";

type CompanyRegistrationData = z.output<typeof companyBasicInfoSchema> & {
  responsiblePerson: z.output<typeof responsiblePersonSchema>;
  director: z.output<typeof directorSchema>;
  shareholders: z.output<typeof shareholderSchema>[];
  requiredDocuments: z.output<typeof requiredDocumentsSchema>;
};

export type CompanyRegistrationCase = {
  id: string;
  status: "pending" | "in-review" | "approved" | "rejected";
  updatedAt: Date;
  createdAt: Date;
  data: CompanyRegistrationData;
};

export const registrationCases: CompanyRegistrationCase[] = [
  {
    id: "1",
    status: "pending",
    updatedAt: new Date("2025-04-12"),
    createdAt: new Date("2025-03-12"),
    data: {
      name: "上海科技有限公司",
      businessScopes: ["IT", "Consulting"],
      address: "上海市浦东新区",
      houseTaxPayment: null as unknown as File,
      responsiblePerson: {
        name: "张三",
        idNumber: "310123199001011234",
        address: "上海市浦东新区",
        idCardFront: null as unknown as File,
        idCardBack: null as unknown as File,
      },
      director: {
        name: "李四",
        idNumber: "310123199001021234",
        address: "上海市浦东新区",
        idCardFront: null as unknown as File,
        idCardBack: null as unknown as File,
      },
      shareholders: [
        {
          name: "王五",
          idNumber: "310123199001031234",
          address: "上海市浦东新区",
          idCardFront: null as unknown as File,
          idCardBack: null as unknown as File,
        },
        {
          name: "赵六",
          idNumber: "310123199001041234",
          address: "上海市浦东新区",
          idCardFront: null as unknown as File,
          idCardBack: null as unknown as File,
        },
      ],
      requiredDocuments: {
        bankBookFront: null as unknown as File,
        bankBookInside: null as unknown as File,
        bankBookStamp: null as unknown as File,
        shareholderPayments: [],
        balanceProof: null as unknown as File,
        houseUseAgreement: null as unknown as File,
        shareholderAgreement: null as unknown as File,
        directorConsent: null as unknown as File,
        declaration: null as unknown as File,
        legalPersonDeclaration: null as unknown as File,
      },
    },
  },
];
