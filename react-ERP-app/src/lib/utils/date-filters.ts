import { startOfMonth, endOfMonth, format } from "date-fns";

export const getCurrentMonthRange = () => {
  const now = new Date();
  return {
    startDate: format(startOfMonth(now), "yyyy-MM-dd"),
    endDate: format(endOfMonth(now), "yyyy-MM-dd"),
  };
};
