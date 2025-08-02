// import type {
//   ColumnType,
//   Generated,
//   Insertable,
//   JSONColumnType,
//   Selectable,
//   Updateable,
// } from "kysely";

// export type Database = {
//   company: CompanyTable;
//   person: PersonTable;
//   documents: DocumentTable;
//   company_documents: CompanyDocumentTable;
//   person_documents: PersonDocumentTable;
// };

// // Company basic information table
// export type CompanyTable = {
//   id: Generated<number>;
//   name: string; // 公司名稱
//   foreign_name: string | null; // 外文名稱
//   company_type:
//     | "limited_company" // 有限公司
//     | "company_limited" // 股份有限公司
//     | "sole_proprietorship" // 獨資
//     | "partnership"; // 合夥
//   business_items: JSONColumnType<string[]>; // 營業項目
//   business_id_number: string | null; // 統一編號
//   tax_serial_number: string | null; // 稅籍編號
//   address: string; // 公司地址
//   telephone: string | null; // 電話
//   fax: string | null; // 傳真
//   email: string | null; // 電子郵件
//   responsible_person_id: number; // 負責人ID
//   representative_id: number; // 代表人ID
//   created_at: ColumnType<Date, string | undefined, never>;
//   updated_at: ColumnType<Date, string | undefined>;
// };

// // Person table
// export type PersonTable = {
//   id: Generated<number>;
//   name: string;
//   id_number: string;
//   address: string | null;
//   id_card_front: string | null; // File path or URL
//   id_card_back: string | null; // File path or URL
//   created_at: ColumnType<Date, string | undefined, never>;
//   updated_at: ColumnType<Date, string | undefined>;
// };

// // General document table (just file metadata)
// export type DocumentTable = {
//   id: Generated<number>;
//   document_type_id: number;
//   file_path: string; // File path or URL
//   file_name: string; // Original file name
//   file_size: number; // File size in bytes
//   mime_type: string; // MIME type of the file
//   description: string | null; // Optional description
//   uploaded_by: number | null; // Person ID who uploaded the document
//   created_at: ColumnType<Date, string | undefined, never>;
//   updated_at: ColumnType<Date, string | undefined>;
// };

// // | 'bank_book_front' // 公司存摺正面
// // | 'bank_book_inside' // 公司存摺內頁
// // | 'bank_book_stamp' // 公司存摺戳章頁
// // | 'shareholder_payment' // 股東匯款條或存摺資料
// // | 'balance_proof' // 餘額證明或次日的存入100元證明
// // | 'house_use_agreement' // 房屋使用同意書
// // | 'shareholder_agreement' // 股東同意書
// // | 'director_consent' // 董監事願任同意書
// // | 'declaration' // 聲明書
// // | 'legal_person_declaration' // 法人聲明書
// // | 'house_tax_payment' // 房屋稅單
// // | 'id_card_front' // 身份證正面照片
// // | 'id_card_back' // 身份證背面照片
// // | 'other'; // 其他文件
// export type DocumentTypeTable = {
//   id: Generated<number>;
//   name: string;
//   description: string | null;
//   required: boolean;
//   created_at: ColumnType<Date, string | undefined, never>;
//   updated_at: ColumnType<Date, string | undefined>;
// };

// // Junction table for company-document relationships
// export type CompanyDocumentTable = {
//   id: Generated<number>;
//   company_id: number;
//   document_id: number;
//   created_at: ColumnType<Date, string | undefined, never>;
// };

// // Junction table for person-document relationships
// export type PersonDocumentTable = {
//   id: Generated<number>;
//   person_id: number;
//   document_id: number;
//   created_at: ColumnType<Date, string | undefined, never>;
// };

// // Type exports for each table
// export type Company = Selectable<CompanyTable>;
// export type NewCompany = Insertable<CompanyTable>;
// export type CompanyUpdate = Updateable<CompanyTable>;

// export type Person = Selectable<PersonTable>;
// export type NewPerson = Insertable<PersonTable>;
// export type PersonUpdate = Updateable<PersonTable>;

// export type Document = Selectable<DocumentTable>;
// export type NewDocument = Insertable<DocumentTable>;
// export type DocumentUpdate = Updateable<DocumentTable>;

// export type CompanyDocument = Selectable<CompanyDocumentTable>;
// export type NewCompanyDocument = Insertable<CompanyDocumentTable>;

// export type PersonDocument = Selectable<PersonDocumentTable>;
// export type NewPersonDocument = Insertable<PersonDocumentTable>;
