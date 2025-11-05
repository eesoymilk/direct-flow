import * as z from "zod";
import { AUDITING_FRAMEWORKS, OPINION_TYPES } from "#shared/utils/constants";

export const basicInfoSchema = z
  .object({
    entityName: z.string().min(1, "受查者名稱為必填"),
    currentRocYear: z.number({ error: "當期年份為必填" }),
    isComparativeReport: z.boolean(), // 包含比較年份
    isConsolidatedReport: z.boolean(), // 合併財報
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

// Year-specific opinion schema
export const yearOpinionSchema = z.object({
  year: z.number(),
  opinionType: z.enum(OPINION_TYPES, {
    error: "請選擇查核意見類型",
  }),
  reason: z.string().optional(),
  materialAmount: z.number().optional(),
});

const otherMatterOptionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("previousReportHandledByOtherAuditor"),
    previousOpinionType: z.enum(OPINION_TYPES, {
      error: "請選擇前次查核意見類型",
    }),
    previousAuditReportDate: z.date().optional(),
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
]);

const keyAuditMatterOptionSchema = z.object({
  description: z.string({
    error: "關鍵查核事項描述為必填",
  }),
});

const emphasisOfMatterOptionSchema = z.object({
  description: z.string({
    error: "強調事項描述為必填",
  }),
});

// Opinion configuration schema with discriminated union for single/dual modes
export const opinionInfoSchema = z
  .discriminatedUnion("mode", [
    z.object({
      mode: z.literal("single"),
      opinion: yearOpinionSchema,
      otherMatterOption: otherMatterOptionSchema.optional(),
      keyAuditMatterOption: keyAuditMatterOptionSchema.optional(),
      emphasisOfMatterOption: emphasisOfMatterOptionSchema.optional(),
    }),
    z.object({
      mode: z.literal("dual"),
      currentYearOpinion: yearOpinionSchema,
      comparativeYearOpinion: yearOpinionSchema,
      otherMatterOption: otherMatterOptionSchema.optional(),
      keyAuditMatterOption: keyAuditMatterOptionSchema.optional(),
      emphasisOfMatterOption: emphasisOfMatterOptionSchema.optional(),
    }),
  ])
  .superRefine((data, ctx) => {
    // Validation: reasons required for non-unqualified opinions
    if (data.mode === "single") {
      if (data.opinion.opinionType !== "unqualified" && !data.opinion.reason) {
        ctx.addIssue({
          code: "custom",
          message: "非無保留意見需要提供理由",
          path: ["opinion", "reason"],
        });
      }
      return;
    }

    if (
      data.currentYearOpinion.opinionType !== "unqualified" &&
      !data.currentYearOpinion.reason
    ) {
      ctx.addIssue({
        code: "custom",
        message: "當期非無保留意見需要提供理由",
        path: ["currentYearOpinion", "reason"],
      });
    }

    if (
      data.comparativeYearOpinion.opinionType !== "unqualified" &&
      !data.comparativeYearOpinion.reason
    ) {
      ctx.addIssue({
        code: "custom",
        message: "比較期非無保留意見需要提供理由",
        path: ["comparativeYearOpinion", "reason"],
      });
    }
  });

export const auditReportDataSchema = z
  .object({
    basicInfo: basicInfoSchema,
    opinionInfo: opinionInfoSchema,
  })
  .superRefine((data, ctx) => {
    // Validate dual opinions only allowed with comparative reports
    if (
      data.opinionInfo.mode === "dual" &&
      !data.basicInfo.isComparativeReport
    ) {
      ctx.addIssue({
        code: "custom",
        message: "雙意見模式僅適用於比較式財務報表",
        path: ["opinionInfo", "mode"],
      });
    }

    // Validate year consistency
    if (data.opinionInfo.mode === "dual") {
      const expectedCurrentYear = data.basicInfo.currentRocYear;
      const expectedComparativeYear = expectedCurrentYear
        ? expectedCurrentYear - 1
        : undefined;

      if (data.opinionInfo.currentYearOpinion.year !== expectedCurrentYear) {
        ctx.addIssue({
          code: "custom",
          message: `當期年度應為 ${expectedCurrentYear}`,
          path: ["opinionInfo", "currentYearOpinion", "year"],
        });
      }

      if (
        data.opinionInfo.comparativeYearOpinion.year !== expectedComparativeYear
      ) {
        ctx.addIssue({
          code: "custom",
          message: `比較期年度應為 ${expectedComparativeYear}`,
          path: ["opinionInfo", "comparativeYearOpinion", "year"],
        });
      }
    }
  });

export type BasicInfoForm = z.infer<typeof basicInfoSchema>;
export type OpinionInfoForm = z.infer<typeof opinionInfoSchema>;
export type AuditReportDataForm = z.infer<typeof auditReportDataSchema>;
