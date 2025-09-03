type Color = "info" | "warning" | "neutral" | "success" | "error";

const applicationStatusLabelMap: Record<ApplicationStatus, string> = {
  submitted: "已提交",
  staff_review: "待審查",
  pending_client_update: "待更新",
  filing: "待核准",
  filed: "已核准",
  approved: "已核准",
  rejected: "已拒絕",
} as const;

const applicationStatusColorMap: Record<ApplicationStatus, Color> = {
  submitted: "info",
  staff_review: "warning",
  pending_client_update: "neutral",
  filing: "neutral",
  filed: "success",
  approved: "success",
  rejected: "error",
} as const;

export const getApplicationStatusLabel = (status?: ApplicationStatus) =>
  status ? applicationStatusLabelMap[status] : "未知狀態";

export const getApplicationStatusColor = (status?: ApplicationStatus) =>
  status ? applicationStatusColorMap[status] : "neutral";
