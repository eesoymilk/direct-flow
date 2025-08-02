import * as z from "zod";
import { personSchema, documentSchema } from "./schemas";

// Helper functions to create initial values
export const createEmptyPerson = (): z.output<typeof personSchema> => ({
  name: "",
  idNumber: "",
  address: "",
  // TODO: Add idCardFront and idCardBack when file storage is ready
  // idCardFront: undefined as any,
  // idCardBack: undefined as any,
});

export const createInitialDocuments = (): z.output<typeof documentSchema>[] => [
  {
    documentType: "bank_book_front",
    documentDescription: "公司存摺正面",
    file: undefined as any,
  },
  {
    documentType: "bank_book_inside",
    documentDescription: "公司存摺內頁",
    file: undefined as any,
  },
  {
    documentType: "bank_book_stamp",
    documentDescription: "公司存摺戳章頁",
    file: undefined as any,
  },
];

export const createInitialForm = () => ({
  responsiblePerson: createEmptyPerson(),
  director: createEmptyPerson(),
  contactPerson: createEmptyPerson(),
  shareholders: [createEmptyPerson()],
  // TODO: Add documents when file storage is ready
  // documents: createInitialDocuments(),
});
