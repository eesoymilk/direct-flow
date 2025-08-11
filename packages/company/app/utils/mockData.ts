import { fakerZH_TW as faker } from "@faker-js/faker";
import { createEmptyPerson, createInitialForm } from "./formHelpers";
import type { z } from "zod";

// Helper function to generate a random Taiwanese ID number (since Faker doesn't have this)
const generateTaiwaneseIdNumber = (): string => {
  const letters = "ABCDEFGHJKLMNPQRSTUVXYWZIO".split("");
  const letter = faker.helpers.arrayElement(letters);
  const oneOrTwo = faker.datatype.boolean() ? 1 : 2;
  const numbers = faker.string.numeric(8);
  return `${letter}${oneOrTwo}${numbers}`;
};

// Generate mock person data using Taiwanese locale
export const generateMockPerson = (): z.output<typeof personSchema> => ({
  name: faker.person.fullName(),
  idNumber: generateTaiwaneseIdNumber(),
  address: faker.location.streetAddress(true), // Full address with city, state, zip
  // TODO: Add idCardFront and idCardBack when file storage is ready
  // idCardFront: undefined as any,
  // idCardBack: undefined as any,
});

// Generate mock document data
export const generateMockDocument = (): z.output<typeof documentSchema> => {
  const documentTypes = [
    { type: "bank_book_front", description: "公司存摺正面" },
    { type: "bank_book_inside", description: "公司存摺內頁" },
    { type: "bank_book_stamp", description: "公司存摺戳章頁" },
    { type: "business_license", description: "營業執照" },
    { type: "tax_registration", description: "稅籍登記" },
  ];

  const selectedType = faker.helpers.arrayElement(documentTypes);

  return {
    documentType: selectedType.type,
    documentDescription: selectedType.description,
    file: undefined as any, // TODO: Generate mock file when needed
  };
};

// Generate mock company names using Taiwanese locale
export const generateMockCompanyNames = (
  count: number = faker.number.int({ min: 2, max: 5 })
): string[] => {
  const companyTypes = ["有限公司", "股份有限公司", "企業社", "商行", "工作室"];
  const industries = [
    "科技",
    "貿易",
    "服務",
    "製造",
    "餐飲",
    "零售",
    "諮詢",
    "設計",
  ];

  const names: string[] = [];

  for (let i = 0; i < count; i++) {
    const industry = faker.helpers.arrayElement(industries);
    const companyType = faker.helpers.arrayElement(companyTypes);
    const name = faker.company.name();
    const fullName = `${name}${industry}${companyType}`;
    if (fullName) {
      names.push(fullName);
    }
  }

  // Ensure we always return at least one name
  if (names.length === 0) {
    names.push("測試科技有限公司");
  }

  return names;
};

// Generate mock business description
export const generateMockBusinessDescription = (): string => {
  const businessItems = [
    "資訊軟體服務",
    "電子商務",
    "國際貿易",
    "餐飲服務",
    "零售批發",
    "諮詢顧問",
    "設計服務",
    "製造加工",
    "物流運輸",
    "教育訓練",
  ];

  const selectedItems = faker.helpers.arrayElements(businessItems, {
    min: 1,
    max: 3,
  });
  return selectedItems.join("、");
};

// Generate complete mock form data
export const generateMockFormData = () => {
  const form = createInitialForm();

  // Generate basic form data
  const mockFormData: Partial<z.output<typeof formSchema>> = {
    candicateNames: generateMockCompanyNames(),
    organizationType: faker.helpers.arrayElement([
      "limited_company",
      "company_limited",
      "sole_proprietorship",
      "partnership",
    ]),
    businessItemsDescription: generateMockBusinessDescription(),
    address: faker.location.streetAddress(true), // Full address with city, state, zip
    isDirectorSameAsResponsiblePerson: faker.datatype.boolean(),
    isContactPersonSameAsResponsiblePerson: faker.datatype.boolean(),
    isContactPersonSameAsDirector: false, // For simplicity
  };

  // Generate person data
  form.responsiblePerson = generateMockPerson();
  form.director = mockFormData.isDirectorSameAsResponsiblePerson
    ? form.responsiblePerson
    : generateMockPerson();
  form.contactPerson = mockFormData.isContactPersonSameAsResponsiblePerson
    ? form.responsiblePerson
    : generateMockPerson();

  // Generate shareholders (2-5 shareholders)
  const shareholderCount = faker.number.int({ min: 2, max: 5 });
  form.shareholders = Array.from({ length: shareholderCount }, () =>
    generateMockPerson()
  );

  return {
    ...mockFormData,
    responsiblePerson: form.responsiblePerson,
    director: form.director,
    contactPerson: form.contactPerson,
    shareholders: form.shareholders,
  };
};
