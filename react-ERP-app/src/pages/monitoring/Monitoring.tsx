import { MonitoringStats } from "@/components/monitoring/monitoring-stats";
import { ObjectCard } from "@/components/monitoring/object-card";
import { useObjects } from "@/hooks/object/useObject";
import { useShiftsWithFilters } from "@/hooks/shift/useShift";
import { useShiftDayData } from "@/hooks/useShiftDayData";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import type { Object } from "@/types/object";

export function Monitoring() {
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  const selectedShiftDate = useFilterPanelStore((s) => s.selectedShiftDate);

  const { stats, dayStart, dayEnd } = useShiftDayData(selectedShiftDate);

  const monthStart = new Date(
    selectedShiftDate.getFullYear(),
    selectedShiftDate.getMonth(),
    1
  );

  const { data: shiftDataMonth } = useShiftsWithFilters(
    {
      objectId: undefined,
      fromDate: monthStart.toISOString(),
      toDate: dayEnd.toISOString(),
    },
    true
  );

  const totalHoursMonth =
    shiftDataMonth?.reduce((acc, s) => acc + s.totalHours, 0) ?? 0;

  return (
    <>
      <MonitoringStats
        totalEmployees={stats.totalEmployees}
        present={stats.present}
        absent={stats.absent}
        totalHoursToday={stats.totalHours}
        totalHoursMonth={totalHoursMonth}
      />
      <div className="grid grid-cols-2 max-[1349px]:grid-cols-2 min-[1350px]:grid-cols-3 gap-5 mt-6">
        {objects
          .filter((object: Object) => object.name !== "Главный склад")
          .sort((a: Object, b: Object) => a.name.localeCompare(b.name))
          .map((object: Object) => {
            // считаем totalHoursMonth по объекту
            const objectMonthShifts = shiftDataMonth?.filter(
              (shift) => shift.objectId === object.id
            );
            const objectTotalHoursMonth =
              objectMonthShifts?.reduce((acc, s) => acc + s.totalHours, 0) ?? 0;

            return (
              <ObjectCard
                key={object.id}
                object={object}
                dayStart={dayStart}
                dayEnd={dayEnd}
                totalHoursMonth={objectTotalHoursMonth} // <-- передаем сюда
              />
            );
          })}
      </div>
    </>
  );
}
