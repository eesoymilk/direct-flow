/** 人員資料 - Represents a person's information used in company-related documents */
type Person = {
  /** 身分證號 - Unique identifier for the person */
  id: string;
  /** 姓名 - Full name of the person */
  name: string;
  /** 身分證字號 - National ID number or passport number */
  idNumber: string;
  /** 地址 - Current residential address */
  address: string;
  /** 身分證正面 - Key/path to the front side of ID card image */
  idCardFrontKey: string;
  /** 身分證反面 - Key/path to the back side of ID card image */
  idCardBackKey: string;
};

/** 公司資料 - Represents a company's complete information including documents and personnel */
export type Company = {
  /** Unique identifier for the company */
  id: string;
  /** 公司名稱 - Registered company name */
  name: string;
  /** 營業項目 - List of business activities the company is authorized to conduct */
  businessItems: string[];
  /** 公司地址 - Registered business address */
  address: string;
  /** 房屋稅單 - Key/path to house tax payment document */
  houseTaxPaymentKey: string;
  /** 負責人 - Person responsible for the company's operations */
  responsiblePerson: Person;
  /** 董事 - Company director information */
  director: Person;
  /** 股東 - List of company shareholders */
  shareholders: Person[];
  /** 必要文件 - Collection of required company documents */
  requiredDocuments: {
    /** 存摺封面 - Key/path to front page of bank book */
    bankBookFrontKey: string;
    /** 存摺內頁 - Key/path to inside pages of bank book */
    bankBookInsideKey: string;
    /** 存摺印章頁 - Key/path to bank book stamp page */
    bankBookStampKey: string;
    /** 股東繳款紀錄 - List of shareholder payment records */
    shareholderPayments: string[];
    /** 餘額證明 - Key/path to balance proof document */
    balanceProofKey: string;
    /** 房屋使用同意書 - Key/path to house use agreement */
    houseUseAgreementKey: string;
    /** 股東同意書 - Key/path to shareholder agreement */
    shareholderAgreementKey: string;
    /** 董事同意書 - Key/path to director consent document */
    directorConsentKey: string;
    /** 聲明書 - Key/path to declaration document */
    declarationKey: string;
  };

  /** 外文名稱 - Company name in foreign language */
  foreignName: string;
  /** 公司組織 - Company organization type */
  organizationType: string;
  /** 統一編號 - Company tax ID number */
  taxId: string;
  /** 稅籍編號 - Tax registration number */
  logicSerialNumber: string;
  /** 電話 - Company phone number */
  phone: string;
  /** 傳真 - Company fax number */
  fax: string;
  /** 電子郵件 - Company email address */
  email: string;
  /** 代理人 - Company agent information */
  agent: Person;
  /** 工商憑證 - Business certificate */
  corporateCertificateKey: string;
};
