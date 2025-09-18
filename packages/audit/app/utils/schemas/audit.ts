import * as z from "zod";

export const basicInfoSchema = z.object({
  entityName: z.string().min(1, "受查者名稱為必填"),
  currentRocYear: z.number({ required_error: "當期年份為必填" }),
  comparativeRocYear: z.number().optional(),
  firmName: z.string().min(1, "會計師事務所為必填"),
  auditorName: z.string().min(1, "會計師姓名為必填"),
  accountingFramework: z.enum(["businessAccountingGuidelines", "IFRS"], {
    required_error: "請選擇會計架構",
  }),
  reportDate: z.date({ required_error: "報告日期為必填" }),
});

export const opinionInfoSchema = z.object({
  opinionType: z.enum(["unqualified", "qualified", "adverse", "disclaimer"], {
    required_error: "請選擇查核意見類型",
  }),
  reason: z.string().optional(),
  materialAmount: z.number().optional(),
  otherMatterOption: z
    .object({
      type: z.enum([
        "previousReportHandledByOtherAuditor",
        "missingPreviousAuditReport",
      ]),
      previousAuditReportDate: z.date().optional(),
    })
    .optional(),
});

export const auditReportDataSchema = z.object({
  basicInfo: basicInfoSchema,
  opinionInfo: opinionInfoSchema,
});

export type BasicInfoForm = z.infer<typeof basicInfoSchema>;
export type OpinionInfoForm = z.infer<typeof opinionInfoSchema>;
export type AuditReportDataForm = z.infer<typeof auditReportDataSchema>;
