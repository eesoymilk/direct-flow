import * as z from "zod";
import { AUDITING_FRAMEWORKS, OPINION_TYPES } from "#shared/utils/constants";

export const basicInfoSchema = z
  .object({
    entityName: z.string().min(1, "受查者名稱為必填"),
    currentRocYear: z.number({ error: "當期年份為必填" }),
    isComparativeReport: z.boolean(),
    isConsolidatedReport: z.boolean(),
    firmName: z.string().min(1, "會計師事務所為必填"),
    firmAddress: z.string().optional(),
    auditorNames: z
      .array(z.string().min(1, "會計師姓名不可為空"))
      .min(1, "至少需要一位會計師"),
    accountingFramework: z.enum(AUDITING_FRAMEWORKS, {
      error: "請選擇會計架構",
    }),
    reportDate: z.date({ error: "報告日期為必填" }),
    useEquityMethodInvestment: z.boolean(),
  })
  .superRefine((data, ctx) => {
    // Validate auditor count based on framework
    if (data.accountingFramework === "IFRS" && data.auditorNames.length > 2) {
      ctx.addIssue({
        code: "custom",
        message: "IFRS 架構最多兩位會計師",
        path: ["auditorNames"],
      });
    } else if (
      data.accountingFramework === "businessAccountingGuidelines" &&
      data.auditorNames.length > 1
    ) {
      ctx.addIssue({
        code: "custom",
        message: "商業會計法架構只能一位會計師",
        path: ["auditorNames"],
      });
    }
  });

export const opinionInfoSchema = z.object({
  opinionType: z.enum(OPINION_TYPES, {
    error: "請選擇查核意見類型",
  }),
  reason: z.string().optional(),
  materialAmount: z.number().optional(),
  otherMatterOption: z
    .discriminatedUnion("type", [
      z.object({
        type: z.literal("previousReportHandledByOtherAuditor"),
        previousOpinionType: z.enum(
          ["unqualified", "qualified", "adverse", "disclaimer"],
          {
            error: "請選擇前次查核意見類型",
          }
        ),
        previousAuditReportDate: z.date({
          error: "請選擇前次查核報告日期",
        }),
      }),
      z.object({
        type: z.literal("missingPreviousAuditReport"),
      }),
      z.object({
        type: z.literal("custom"),
        customDescription: z.string({
          error: "自定義其他事項為必填",
        }),
      }),
    ])
    .optional(),
  keyAuditMatterOption: z
    .object({
      description: z.string({
        error: "關鍵查核事項描述為必填",
      }),
    })
    .optional(),
  emphasisOfMatterOption: z
    .object({
      description: z.string({
        error: "強調事項描述為必填",
      }),
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
