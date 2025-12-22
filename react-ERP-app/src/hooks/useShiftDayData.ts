import { useMemo } from "react";
import { useShiftsWithFilters } from "@/hooks/shift/useShift";
import { getLocalDayKey } from "@/lib/utils/getLocalDayKey";

export function useShiftDayData(selectedDate: Date) {
  const dayStart = new Date(selectedDate);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const { data, isLoading } = useShiftsWithFilters(
    {
      objectId: undefined,
      fromDate: dayStart.toISOString(),
      toDate: dayEnd.toISOString(),
    },
    true
  );

  const selectedDayKey = getLocalDayKey(selectedDate);

  const shifts = useMemo(() => {
    return (data ?? []).filter(
      (shift) => getLocalDayKey(shift.shiftDate) === selectedDayKey
    );
  }, [data, selectedDayKey]);

  const stats = useMemo(() => {
    const totalEmployees = shifts.reduce(
      (acc, s) => acc + s.employees.length,
      0
    );

    const present = shifts.reduce(
      (acc, s) => acc + s.employees.filter((e) => e.present).length,
      0
    );

    const absent = shifts.reduce(
      (acc, s) => acc + s.employees.filter((e) => !e.present).length,
      0
    );

    const totalHours = shifts.reduce((acc, s) => acc + s.totalHours, 0);

    return {
      totalEmployees,
      present,
      absent,
      totalHours,
    };
  }, [shifts]);

  return {
    shifts,
    stats,
    dayStart,
    dayEnd,
    isLoading,
  };
}
