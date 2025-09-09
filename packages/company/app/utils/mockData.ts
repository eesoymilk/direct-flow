import { fakerZH_TW as faker } from "@faker-js/faker";

// Helper function to generate a random Taiwanese ID number (since Faker doesn't have this)
const generateTaiwaneseIdNumber = (): string => {
  const letters = "ABCDEFGHJKLMNPQRSTUVXYWZIO".split("");
  const letter = faker.helpers.arrayElement(letters);
  const oneOrTwo = faker.datatype.boolean() ? 1 : 2;
  const numbers = faker.string.numeric(8);
  return `${letter}${oneOrTwo}${numbers}`;
};

// Generate mock person data for contact/responsible/representative (includes email, tel/cel required)
export const generateMockPerson = (): PersonSchema => ({
  name: faker.person.fullName(),
  idNumber: generateTaiwaneseIdNumber(),
  address: faker.location.streetAddress(true), // Full address with city, state, zip
  telephone: faker.phone.number(),
  cellphone: faker.phone.number(),
  email: faker.internet.email(),
  // TODO: Add idCardFront and idCardBack when file storage is ready
  // idCardFront: undefined as any,
  // idCardBack: undefined as any,
});

// Generate mock share holdings for a given set of share types
export const generateMockShares = () =>
  SHARE_TYPES.reduce(
    (shareHoldings, shareType) => {
      const quantity = faker.number.int({ min: 1, max: 1000 });
      const pricePerShare = faker.number.float({
        min: 1,
        max: 1000,
        fractionDigits: 2,
      });
      const totalPrice = quantity * pricePerShare;

      shareHoldings[shareType] = {
        quantity,
        pricePerShare,
        totalPrice,
      };

      return shareHoldings;
    },
    {} as Record<
      ShareType,
      { quantity: number; pricePerShare: number; totalPrice: number }
    >
  );

// Generate mock shareholder data including shares (dateOfBirth required, contact info not displayed)
export const generateMockShareholder = (): ShareholderSchema => {
  const birthDate = faker.date.birthdate({ min: 18, max: 80, mode: "age" });
  return {
    name: faker.person.fullName(),
    idNumber: generateTaiwaneseIdNumber(),
    address: faker.location.streetAddress(true),
    dateOfBirth: birthDate,
    isReadonly: false,
    shares: generateMockShares(),
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
    min: 3,
    max: 6,
  });
  return selectedItems.join("、");
};

// Generate complete mock form data
export const generateMockFormData = ({
  organizationType: _organizationType,
}: {
  organizationType?: OrganizationType;
}) => {
  const form = createInitialForm();

  const organizationType =
    _organizationType || faker.helpers.arrayElement(ORGANIZATION_TYPES);

  const isStockCompany = organizationType === "corporation";

  const mockFormData: CompanyApplicationFormSchema = {
    candidateNames: generateMockCompanyNames(),
    organizationType,
    businessItemsDescription: generateMockBusinessDescription(),
    address: faker.location.streetAddress(true), // Full address with city, state, zip
    isRepresentativeSameAsResponsiblePerson: faker.datatype.boolean(),
    isContactPersonSameAsResponsiblePerson: faker.datatype.boolean(),
    isContactPersonSameAsRepresentative: false, // For simplicity
    ...(isStockCompany
      ? {
          capitalAmount: faker.number.int({ min: 100000, max: 50000000 }),
          paidInCapital: faker.number.int({ min: 100000, max: 50000000 }),
          isCloselyHeld: faker.datatype.boolean(),
          hasParValueFreeShares: faker.datatype.boolean(),
          parValue: faker.number.int({ min: 10, max: 1000 }),
          totalShares: faker.number.int({ min: 1000, max: 1000000 }),
        }
      : {}),
  };

  // Generate person data
  form.responsiblePerson = generateMockPerson();
  form.representative = mockFormData.isRepresentativeSameAsResponsiblePerson
    ? form.responsiblePerson
    : generateMockPerson();
  form.contactPerson = mockFormData.isContactPersonSameAsResponsiblePerson
    ? form.responsiblePerson
    : generateMockPerson();

  const shareholderCount = faker.number.int({ min: 3, max: 7 });
  const shareTypeCount = isStockCompany
    ? faker.number.int({ min: 1, max: 6 })
    : 1;

  form.shareholders = Array.from({ length: shareholderCount }, (_, index) =>
    generateMockShareholder()
  );

  return {
    ...mockFormData,
    responsiblePerson: form.responsiblePerson,
    representative: form.representative,
    contactPerson: form.contactPerson,
    shareholders: form.shareholders,
    shareTypeCount,
  };
};
