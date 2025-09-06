import * as z from "zod";
import { CalendarDate } from "@internationalized/date";

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const MIN_DIMENSIONS = { width: 200, height: 200 };
export const MAX_DIMENSIONS = { width: 4096, height: 4096 };
export const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
] as const;

// Utility functions
export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  );
};

export const getFileField = (name: string) => {
  return z.custom<File | null>().refine((file) => file !== null, {
    message: `請上傳${name}`,
  });
};

export const idNumberSchema = z.string().regex(/^[A-Z][1-2][0-9]{8}$/, {
  message: "身份證字號格式錯誤",
});

export const documentSchema = z.object({
  documentType: z.string().min(1, "文件類型為必填"),
  documentDescription: z.string(),
  file: z
    .instanceof(File, {
      message: "請選擇一個檔案",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `檔案太大。請選擇一個小於 ${formatBytes(MAX_FILE_SIZE)} 的檔案。`,
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type as any), {
      message: "請上傳有效的檔案 (JPEG, PNG, 或 PDF)。",
    })
    .refine(
      (file) => {
        // If it's a PDF, skip dimension validation
        if (file.type === "application/pdf") {
          return true;
        }

        // For images, validate dimensions
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const meetsDimensions =
                img.width >= MIN_DIMENSIONS.width &&
                img.height >= MIN_DIMENSIONS.height &&
                img.width <= MAX_DIMENSIONS.width &&
                img.height <= MAX_DIMENSIONS.height;
              resolve(meetsDimensions);
            };
            img.src = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        });
      },
      {
        message: `圖片尺寸無效。請上傳一個介於 ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height} 和 ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height} 像素的圖片。`,
      }
    ),
});

// Schema for contact person, representative, and responsible person
// Requires: name, id, address, (tel OR cel), email
export const getContactPersonSchema = (name: string) =>
  z
    .object(
      {
        name: z.string().min(1, { message: `${name}姓名不能為空` }),
        idNumber: idNumberSchema,
        address: z
          .string()
          .min(1, { message: `${name}戶籍地址不能為空` })
          .max(255, { message: `${name}戶籍地址最多255個字` }),
        telephone: z.string().optional(),
        cellphone: z.string().optional(),
        email: z
          .string()
          .email({ message: "請輸入有效的電子郵件" })
          .min(1, { message: `${name}電子郵件不能為空` }),
        dateOfBirth: z.instanceof(CalendarDate).optional(),
      },
      {
        message: `${name}資料不能為空`,
      }
    )
    .refine((data) => data.telephone || data.cellphone, {
      message: `${name}必須提供電話或手機其中一項`,
      path: ["telephone", "cellphone"], // This will show the error on telephone and cellphone fields
    });

// Schema for shareholders
// Requires: name, id, address, dateOfBirth
export const getShareholderPersonSchema = (name: string) =>
  z.object(
    {
      name: z.string().min(1, { message: `${name}姓名不能為空` }),
      idNumber: idNumberSchema,
      address: z
        .string()
        .min(1, { message: `${name}戶籍地址不能為空` })
        .max(255, { message: `${name}戶籍地址最多255個字` }),
      telephone: z.string().optional(),
      cellphone: z.string().optional(),
      email: z.string().email({ message: "請輸入有效的電子郵件" }).optional(),
      dateOfBirth: z.instanceof(CalendarDate, {
        message: `${name}出生日期不能為空`,
      }),
    },
    {
      message: `${name}資料不能為空`,
    }
  );

export * from "./response";
