import * as z from "zod";

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
