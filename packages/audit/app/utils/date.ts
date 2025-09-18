export const AcToRocYear = (year: number): number => year - 1911;

export const formatRocDate = (date?: Date): string => {
  try {
    if (!date) throw new Error("無效的日期");

    const rocYear = AcToRocYear(date.getFullYear());

    if (rocYear < 0) throw new Error("無效的民國年份");

    const yearStr = new Intl.NumberFormat("zh-Hans-CN-u-nu-hanidec").format(
      rocYear
    );
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `民國${yearStr}年${month}月${day}日`;
  } catch (error) {
    console.error(error);
    return "[無效的日期]";
  }
};
