import { ObjectCard } from "@/components/monitoring/object-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useObjects } from "@/hooks/object/useObject";
import { useShiftsWithFilters } from "@/hooks/shift/useShift";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import type { Object } from "@/types/object";

export function Monitoring() {
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  const selectedShiftDate = useFilterPanelStore((s) => s.selectedShiftDate);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dayStart = new Date(selectedShiftDate);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const { data: shiftDataToday } = useShiftsWithFilters(
    {
      objectId: undefined,
      fromDate: dayStart.toISOString(),
      toDate: dayEnd.toISOString(),
    },
    true
  );

  const { data: shiftDataMonth } = useShiftsWithFilters(
    {
      objectId: undefined,
      fromDate: monthStart.toISOString(),
      toDate: dayEnd.toISOString(),
    },
    true
  );

  const totalEmployeesToday =
    shiftDataToday?.reduce((acc, s) => acc + s.employees.length, 0) ?? 0;

  const totalPresentToday =
    shiftDataToday?.reduce(
      (acc, s) => acc + s.employees.filter((e) => e.present).length,
      0
    ) ?? 0;

  const totalAbsentToday =
    shiftDataToday?.reduce(
      (acc, s) => acc + s.employees.filter((e) => !e.present).length,
      0
    ) ?? 0;

  const totalHoursToday =
    shiftDataToday?.reduce((acc, s) => acc + s.totalHours, 0) ?? 0;

  const totalHoursMonth =
    shiftDataMonth?.reduce((acc, s) => acc + s.totalHours, 0) ?? 0;

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-6 mt-6">
        {/* 1. Всего сотрудников */}
        <Card className="flex flex-col items-center justify-center bg-table-blue">
          <CardHeader className="w-full">
            <CardTitle className="text-center font-medium text-xl">
              Всего сотрудников
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-3xl font-bold">{totalEmployeesToday}</p>
          </CardContent>
        </Card>

        {/* 2. Вышли */}
        <Card className="flex flex-col items-center justify-center py-6 bg-table-green">
          <CardHeader className="w-full">
            <CardTitle className="text-center text-xl">
              Вышли на смены
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-3xl font-bold">{totalPresentToday}</p>
          </CardContent>
        </Card>

        {/* 3. Не вышли */}
        <Card className="flex flex-col items-center justify-center py-6 bg-table-red">
          <CardHeader className="w-full">
            <CardTitle className="text-center text-xl">
              Не вышли на смены
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-3xl font-bold">{totalAbsentToday}</p>
          </CardContent>
        </Card>

        {/* 4. Часы (половинки) */}
        <div className="flex flex-col gap-2">
          <Card className="flex flex-col items-center justify-center py-2 gap-0 bg-table-purple">
            <CardHeader className="w-full">
              <CardTitle className="text-center">Часы за сегодня</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-3xl font-bold">{totalHoursToday}</p>
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center justify-center py-2 gap-0 bg-table-orange">
            <CardHeader className="w-full">
              <CardTitle className="text-center">Часы за месяц</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-3xl font-bold">{totalHoursMonth}</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-2 max-[1349px]:grid-cols-2 min-[1350px]:grid-cols-3 gap-5 mt-6">
        {objects
          .filter((object: Object) => object.name !== "Главный склад")
          .map((object: Object) => (
            <ObjectCard
              dayStart={dayStart}
              dayEnd={dayEnd}
              key={object.id}
              object={object}
            />
          ))}
      </div>
    </>
  );
}
