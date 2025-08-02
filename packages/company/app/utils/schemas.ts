import * as z from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MIN_DIMENSIONS = { width: 200, height: 200 };
const MAX_DIMENSIONS = { width: 4096, height: 4096 };
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
] as const;

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  );
};

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

export const personSchema = z.object({
  name: z.string().min(1, "姓名為必填"),
  idNumber: z.string().min(1, "身分證字號為必填"),
  address: z.string().min(1, "戶籍地址為必填"),
  // TODO: Add idCardFront and idCardBack when file storage is ready
  //   idCardFront: documentSchema,
  //   idCardBack: documentSchema,
});

export const formSchema = z.object({
  candicateNames: z
    .array(z.string().min(1, "公司名稱為必填"))
    .min(1, "請提供至少一個公司名稱")
    .max(5, "最多只能提供五個公司名稱"),
  organizationType: z.enum([
    "limited_company",
    "company_limited",
    "sole_proprietorship",
    "partnership",
  ]),
  businessItemsDescription: z.string().min(1, "營業項目描述為必填"),
  address: z.string().min(1, "公司地址為必填"),
  isDirectorSameAsResponsiblePerson: z.boolean(),
  isContactPersonSameAsResponsiblePerson: z.boolean(),
  isContactPersonSameAsDirector: z.boolean(),
});
