import * as z from "zod";

type CompanyBasicInfoSchema = z.output<typeof companyBasicInfoSchema>;
type ResponsiblePersonSchema = z.output<typeof responsiblePersonSchema>;
type DirectorSchema = z.output<typeof directorSchema>;
type ShareholderSchema = z.output<typeof shareholderSchema>;
type RequiredDocumentsSchema = z.output<typeof requiredDocumentsSchema>;

const INITIAL_PERSON_INFO = {
  name: "",
  address: "",
  idNumber: "",
  idCardFront: null as unknown as File,
  idCardBack: null as unknown as File,
} as const;

export const useCompanyRegistrationStore = defineStore(
  "companyRegistration",
  () => {
    const currentStep = ref(0);
    const basicInfo = ref<CompanyBasicInfoSchema>({
      name: "",
      businessItems: [],
      address: "",
      houseTaxPayment: null as unknown as File,
    });

    const responsiblePerson = ref<ResponsiblePersonSchema>(INITIAL_PERSON_INFO);

    const director = ref<DirectorSchema>(INITIAL_PERSON_INFO);

    const shareholders = ref<ShareholderSchema[]>([INITIAL_PERSON_INFO]);

    const requiredDocuments = ref<RequiredDocumentsSchema>({
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
    });

    const nextStep = () => {
      currentStep.value++;
    };

    const prevStep = () => {
      currentStep.value--;
    };

    const addShareholder = () => {
      shareholders.value.push({
        name: "",
        idNumber: "",
        address: "",
        idCardFront: null as unknown as File,
        idCardBack: null as unknown as File,
      });
    };

    const removeShareholder = (index: number) => {
      shareholders.value.splice(index, 1);
    };

    const handleFileUpload = (event: Event, pathKeys: string[]) => {
      const input = event.target as HTMLInputElement;
      if (!input.files || !input.files[0]) return;

      const file = input.files[0];

      // TODO: Add additional type guard to ensure currentLevel is of the correct type
      let currentLevel: any = {
        basicInfo: basicInfo.value,
        responsiblePerson: responsiblePerson.value,
        director: director.value,
        shareholders: shareholders.value,
        requiredDocuments: requiredDocuments.value,
      };

      for (const [idx, key] of pathKeys.entries()) {
        if (idx === pathKeys.length - 1) {
          currentLevel[key] = file;
        } else {
          currentLevel = currentLevel[key];
        }
      }
    };

    const resetForm = () => {
      currentStep.value = 0;
      basicInfo.value = {
        name: "",
        businessItems: [],
        address: "",
        houseTaxPayment: null as unknown as File,
      };
      responsiblePerson.value = INITIAL_PERSON_INFO;
      director.value = INITIAL_PERSON_INFO;
      shareholders.value = [INITIAL_PERSON_INFO];
      requiredDocuments.value = {
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
      };
    };

    return {
      currentStep,
      basicInfo,
      responsiblePerson,
      director,
      shareholders,
      requiredDocuments,

      nextStep,
      prevStep,
      addShareholder,
      removeShareholder,
      handleFileUpload,
      resetForm,
    };
  }
);
