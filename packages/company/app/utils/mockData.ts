import { fakerZH_TW as faker } from "@faker-js/faker";
import type { z } from "zod";
import { CalendarDate } from "@internationalized/date";
import { shallowRef } from "vue";

// Helper function to generate a random Taiwanese ID number (since Faker doesn't have this)
const generateTaiwaneseIdNumber = (): string => {
  const letters = "ABCDEFGHJKLMNPQRSTUVXYWZIO".split("");
  const letter = faker.helpers.arrayElement(letters);
  const oneOrTwo = faker.datatype.boolean() ? 1 : 2;
  const numbers = faker.string.numeric(8);
  return `${letter}${oneOrTwo}${numbers}`;
};

// Generate mock person data for contact/responsible/representative (includes email, tel/cel required)
export const generateMockPerson = (): z.output<typeof personSchema> => ({
  name: faker.person.fullName(),
  idNumber: generateTaiwaneseIdNumber(),
  address: faker.location.streetAddress(true), // Full address with city, state, zip
  telephone: faker.phone.number(),
  cellphone: faker.phone.number(),
  email: faker.internet.email(),
  dateOfBirth: undefined, // Not required for contact/responsible/representative persons
  // TODO: Add idCardFront and idCardBack when file storage is ready
  // idCardFront: undefined as any,
  // idCardBack: undefined as any,
});

// Generate mock shareholder data including shares (dateOfBirth required, contact info not displayed)
export const generateMockShareholder = (): z.output<
  typeof shareholderSchema
> => {
  const birthDate = faker.date.birthdate({ min: 18, max: 80, mode: "age" });
  return {
    name: faker.person.fullName(),
    idNumber: generateTaiwaneseIdNumber(),
    address: faker.location.streetAddress(true),
    telephone: "", // Not displayed in form
    cellphone: "", // Not displayed in form
    email: "", // Not displayed in form
    dateOfBirth: new CalendarDate(
      birthDate.getFullYear(),
      birthDate.getMonth() + 1,
      birthDate.getDate()
    ),
    shares: faker.number.int({ min: 1000, max: 100000 }), // Random shares between 1K-100K
    isReadonly: false,
  };
};

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

// Generate mock form data specifically for organization type testing
export const generateOrgTypeTestData = () => {
  const form = createInitialForm();

  // Randomly choose between company_limited and closely_held_company_limited
  const isCloselyHeld = faker.datatype.boolean();

  // Generate basic form data with only stock company types
  const mockFormData: Partial<z.output<typeof companyApplicationFormSchema>> = {
    candidateNames: generateMockCompanyNames(),
    organizationType: "company_limited", // Always use company_limited in frontend
    isCloselyHeld: isCloselyHeld,
    businessItemsDescription: generateMockBusinessDescription(),
    address: faker.location.streetAddress(true),
    isDirectorSameAsResponsiblePerson: faker.datatype.boolean(),
    isContactPersonSameAsResponsiblePerson: faker.datatype.boolean(),
    isContactPersonSameAsDirector: false,
    capitalAmount: faker.number.int({ min: 500000, max: 100000000 }), // Higher amounts for stock companies
    ordinaryShares: faker.number.int({ min: 1000, max: 500000 }),
    preferredShares: faker.number.int({ min: 0, max: 100000 }),
    // hasParValueFreeShares only makes sense for closely held companies
    hasParValueFreeShares: isCloselyHeld ? faker.datatype.boolean() : false,
  };

  // Calculate authorizedShares as sum (will be overridden by computed property)
  mockFormData.authorizedShares =
    (mockFormData.ordinaryShares || 0) + (mockFormData.preferredShares || 0);

  // Generate person data
  form.responsiblePerson = generateMockPerson();
  form.director = mockFormData.isDirectorSameAsResponsiblePerson
    ? form.responsiblePerson
    : generateMockPerson();
  form.contactPerson = mockFormData.isContactPersonSameAsResponsiblePerson
    ? form.responsiblePerson
    : generateMockPerson();

  // Generate shareholders (3-7 shareholders for stock companies)
  const shareholderCount = faker.number.int({ min: 3, max: 7 });
  form.shareholders = Array.from({ length: shareholderCount }, () =>
    generateMockShareholder()
  );

  return {
    ...mockFormData,
    responsiblePerson: form.responsiblePerson,
    director: form.director,
    contactPerson: form.contactPerson,
    shareholders: form.shareholders,
  };
};

// Generate complete mock form data
export const generateMockFormData = () => {
  const form = createInitialForm();

  // Generate basic form data
  const mockFormData: Partial<z.output<typeof companyApplicationFormSchema>> = {
    candidateNames: generateMockCompanyNames(),
    organizationType: faker.helpers.arrayElement([
      "company_limited",
      "limited_company",
      "sole_proprietorship",
      "partnership",
    ]),
    isCloselyHeld: faker.datatype.boolean(),
    businessItemsDescription: generateMockBusinessDescription(),
    address: faker.location.streetAddress(true), // Full address with city, state, zip
    isDirectorSameAsResponsiblePerson: faker.datatype.boolean(),
    isContactPersonSameAsResponsiblePerson: faker.datatype.boolean(),
    isContactPersonSameAsDirector: false, // For simplicity
    capitalAmount: faker.number.int({ min: 100000, max: 50000000 }),
    authorizedShares: faker.number.int({ min: 1000, max: 1000000 }),
    ordinaryShares: faker.number.int({ min: 500, max: 800000 }),
    preferredShares: faker.number.int({ min: 0, max: 200000 }),
    hasParValueFreeShares: faker.datatype.boolean(),
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
  form.shareholders = Array.from({ length: shareholderCount }, () => {
    // Only add shares for stock companies
    if (mockFormData.organizationType === "company_limited") {
      return generateMockShareholder();
    } else {
      // For non-stock companies, create person without shares
      const person = generateMockPerson();
      return { ...person, shares: undefined, isReadonly: false };
    }
  });

  return {
    ...mockFormData,
    responsiblePerson: form.responsiblePerson,
    director: form.director,
    contactPerson: form.contactPerson,
    shareholders: form.shareholders,
    capitalAmount: mockFormData.capitalAmount,
    authorizedShares: mockFormData.authorizedShares,
    ordinaryShares: mockFormData.ordinaryShares,
    preferredShares: mockFormData.preferredShares,
    hasParValueFreeShares: mockFormData.hasParValueFreeShares,
    isCloselyHeld: mockFormData.isCloselyHeld,
  };
};
