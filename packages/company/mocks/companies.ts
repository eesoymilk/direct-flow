import type { Company } from "@/types/company";

export const companies: Company[] = [
  {
    id: "1",
    name: "台灣創新科技股份有限公司",
    businessItems: ["F118010", "F119010", "F218010"],
    address: "台北市信義區信義路五段7號",
    houseTaxPaymentKey: "documents/house-tax/1.pdf",
    responsiblePerson: {
      id: "1",
      name: "張志明",
      idNumber: "A123456789",
      address: "台北市大安區敦化南路二段100號",
      idCardFrontKey: "documents/id-cards/1-front.jpg",
      idCardBackKey: "documents/id-cards/1-back.jpg"
    },
    director: {
      id: "2", 
      name: "李美玲",
      idNumber: "B987654321",
      address: "台北市松山區南京東路五段200號",
      idCardFrontKey: "documents/id-cards/2-front.jpg",
      idCardBackKey: "documents/id-cards/2-back.jpg"
    },
    shareholders: [
      {
        id: "3",
        name: "王大明",
        idNumber: "C456789012",
        address: "台北市中山區林森北路300號",
        idCardFrontKey: "documents/id-cards/3-front.jpg",
        idCardBackKey: "documents/id-cards/3-back.jpg"
      }
    ],
    requiredDocuments: {
      bankBookFrontKey: "documents/bank/1-front.jpg",
      bankBookInsideKey: "documents/bank/1-inside.jpg", 
      bankBookStampKey: "documents/bank/1-stamp.jpg",
      shareholderPayments: ["documents/payments/1.pdf"],
      balanceProofKey: "documents/balance/1.pdf",
      houseUseAgreementKey: "documents/agreements/house-1.pdf",
      shareholderAgreementKey: "documents/agreements/shareholders-1.pdf",
      directorConsentKey: "documents/consents/director-1.pdf",
      declarationKey: "documents/declarations/1.pdf"
    },
    foreignName: "Taiwan Innovation Technology Co., Ltd.",
    organizationType: "股份有限公司",
    taxId: "12345678",
    logicSerialNumber: "12345678",
    phone: "02-2345-6789",
    fax: "02-2345-6780",
    email: "contact@taiwantech.com",
    agent: {
      id: "4",
      name: "陳小華",
      idNumber: "D123456789",
      address: "台北市信義區松仁路50號",
      idCardFrontKey: "documents/id-cards/4-front.jpg",
      idCardBackKey: "documents/id-cards/4-back.jpg"
    },
    corporateCertificateKey: "documents/certificates/1.pdf"
  },
  {
    id: "2",
    name: "綠能永續企業有限公司",
    businessItems: ["E599010", "E601010", "E603050"],
    address: "台中市西屯區台灣大道三段99號",
    houseTaxPaymentKey: "documents/house-tax/2.pdf",
    responsiblePerson: {
      id: "5",
      name: "林永續",
      idNumber: "E234567890",
      address: "台中市北屯區文心路四段123號",
      idCardFrontKey: "documents/id-cards/5-front.jpg",
      idCardBackKey: "documents/id-cards/5-back.jpg"
    },
    director: {
      id: "6",
      name: "黃綠能",
      idNumber: "F345678901",
      address: "台中市南屯區向上路五段456號",
      idCardFrontKey: "documents/id-cards/6-front.jpg",
      idCardBackKey: "documents/id-cards/6-back.jpg"
    },
    shareholders: [
      {
        id: "7",
        name: "吳環保",
        idNumber: "G456789012",
        address: "台中市西區精誠路789號",
        idCardFrontKey: "documents/id-cards/7-front.jpg",
        idCardBackKey: "documents/id-cards/7-back.jpg"
      }
    ],
    requiredDocuments: {
      bankBookFrontKey: "documents/bank/2-front.jpg",
      bankBookInsideKey: "documents/bank/2-inside.jpg",
      bankBookStampKey: "documents/bank/2-stamp.jpg",
      shareholderPayments: ["documents/payments/2.pdf"],
      balanceProofKey: "documents/balance/2.pdf",
      houseUseAgreementKey: "documents/agreements/house-2.pdf",
      shareholderAgreementKey: "documents/agreements/shareholders-2.pdf",
      directorConsentKey: "documents/consents/director-2.pdf",
      declarationKey: "documents/declarations/2.pdf"
    },
    foreignName: "Green Sustainability Enterprise Co., Ltd.",
    organizationType: "有限公司",
    taxId: "87654321",
    logicSerialNumber: "87654321",
    phone: "04-2345-6789",
    fax: "04-2345-6780",
    email: "contact@greensus.com",
    agent: {
      id: "8",
      name: "張環境",
      idNumber: "H567890123",
      address: "台中市北區三民路三段168號",
      idCardFrontKey: "documents/id-cards/8-front.jpg",
      idCardBackKey: "documents/id-cards/8-back.jpg"
    },
    corporateCertificateKey: "documents/certificates/2.pdf"
  },
  {
    id: "3",
    name: "數位金融服務股份有限公司",
    businessItems: ["H301011", "H301021", "H301031"],
    address: "高雄市前鎮區中山二路2號",
    houseTaxPaymentKey: "documents/house-tax/3.pdf",
    responsiblePerson: {
      id: "9",
      name: "謝金融",
      idNumber: "I678901234",
      address: "高雄市鼓山區美術館路80號",
      idCardFrontKey: "documents/id-cards/9-front.jpg",
      idCardBackKey: "documents/id-cards/9-back.jpg"
    },
    director: {
      id: "10",
      name: "楊數位",
      idNumber: "J789012345",
      address: "高雄市苓雅區四維四路100號",
      idCardFrontKey: "documents/id-cards/10-front.jpg",
      idCardBackKey: "documents/id-cards/10-back.jpg"
    },
    shareholders: [
      {
        id: "11",
        name: "周科技",
        idNumber: "K890123456",
        address: "高雄市前金區中正四路120號",
        idCardFrontKey: "documents/id-cards/11-front.jpg",
        idCardBackKey: "documents/id-cards/11-back.jpg"
      }
    ],
    requiredDocuments: {
      bankBookFrontKey: "documents/bank/3-front.jpg",
      bankBookInsideKey: "documents/bank/3-inside.jpg",
      bankBookStampKey: "documents/bank/3-stamp.jpg",
      shareholderPayments: ["documents/payments/3.pdf"],
      balanceProofKey: "documents/balance/3.pdf",
      houseUseAgreementKey: "documents/agreements/house-3.pdf",
      shareholderAgreementKey: "documents/agreements/shareholders-3.pdf",
      directorConsentKey: "documents/consents/director-3.pdf",
      declarationKey: "documents/declarations/3.pdf"
    },
    foreignName: "Digital Financial Services Co., Ltd.",
    organizationType: "股份有限公司",
    taxId: "23456789",
    logicSerialNumber: "23456789",
    phone: "07-3456-7890",
    fax: "07-3456-7891",
    email: "contact@digifin.com",
    agent: {
      id: "12",
      name: "李數據",
      idNumber: "L901234567",
      address: "高雄市新興區民生一路150號",
      idCardFrontKey: "documents/id-cards/12-front.jpg",
      idCardBackKey: "documents/id-cards/12-back.jpg"
    },
    corporateCertificateKey: "documents/certificates/3.pdf"
  }
]