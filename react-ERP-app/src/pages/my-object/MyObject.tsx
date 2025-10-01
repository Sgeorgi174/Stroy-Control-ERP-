import { useState } from "react";
import { Calendar01 } from "@/components/calendar-01";
import { NotificationCard } from "@/components/dashboard/my-object/notification/notification-card";
import { ShiftOpenDialog } from "@/components/dashboard/my-object/shift/create-shift";
import { Card } from "@/components/ui/card";
import { Clock } from "@/components/ui/clock";
import { useAuth } from "@/hooks/auth/useAuth";
import { useShiftsWithFilters } from "@/hooks/shift/useShift";
import { HardHat, Users } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { startOfDay, endOfDay } from "date-fns";

export function MyObject() {
  const { data: user } = useAuth();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Начало и конец выбранного дня
  const dayStart = startOfDay(selectedDate).toISOString();
  const dayEnd = endOfDay(selectedDate).toISOString();

  const { data: shiftData } = useShiftsWithFilters(
    {
      objectId: user?.object?.id || "none",
      fromDate: dayStart,
      toDate: dayEnd,
    },
    !!user
  );

  const { data: allShifts } = useShiftsWithFilters(
    { objectId: user?.object?.id },
    !!user
  );

  const todayShift = shiftData?.[0]; // берем первую смену на выбранную дату
  const shiftDates = allShifts?.map((s) => new Date(s.shiftDate)) || [];

  // Подготовка данных для карточек
  const presentEmployees = todayShift?.employees.filter((e) => e.present) || [];
  const absentEmployees = todayShift?.employees.filter((e) => !e.present) || [];
  const totalWorkedHours = presentEmployees.reduce(
    (sum, e) => sum + (e.workedHours || 0),
    0
  );

  return (
    <div>
      <div className="grid grid-cols-5 gap-3 mt-6">
        <NotificationCard />
        <div className="col-span-2 flex flex-col gap-5">
          <Card className="flex justify-center p-2 items-center">
            <Clock className="font-medium p-2 text-5xl" />
          </Card>
          <Card className="p-5 shadow-md border rounded-2xl h-full flex justify-center items-center">
            <div className="w-full flex justify-center items-center max-w-[360px]">
              <Calendar01
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                shiftDates={shiftDates}
              />
            </div>
          </Card>
        </div>
      </div>

      <div className="p-5 shadow-md border rounded-2xl flex flex-col mt-8">
        <div className="flex items-center gap-2">
          <Users size={30} />
          <p className="font-bold text-3xl">Управление сменой</p>
        </div>

        {!todayShift ? (
          <div className="p-5 border rounded-2xl flex flex-col items-center gap-2 mt-6">
            <HardHat size={50} className="text-muted-foreground" />
            <p className="font-medium text-xl">Смена не открыта</p>
            <p className="text-muted-foreground">
              Нажмите "Открыть смену", чтобы назначить сотрудников на эту дату
            </p>
            <ShiftOpenDialog objectId={user?.object?.id || "none"} />
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-6">
            {/* Карточки с общей статистикой */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 flex flex-col items-center bg-green-100 text-green-800">
                <p>Присутствует</p>
                <p className="font-bold text-2xl">{presentEmployees.length}</p>
              </Card>
              <Card className="p-4 flex flex-col items-center bg-red-100 text-red-800">
                <p>Отсутствует</p>
                <p className="font-bold text-2xl">{absentEmployees.length}</p>
              </Card>
              <Card className="p-4 flex flex-col items-center bg-blue-100 text-blue-800">
                <p>Общее количество часов</p>
                <p className="font-bold text-2xl">{totalWorkedHours}</p>
              </Card>
            </div>

            {/* Таблица с сотрудниками, которые работают */}
            <Card className="p-5 border rounded-2xl">
              <h4 className="font-medium mb-4">Сотрудники на смене</h4>
              {presentEmployees.length === 0 ? (
                <p className="text-gray-500">Нет сотрудников на смене</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Сотрудник</TableHead>
                      <TableHead>Часы</TableHead>
                      <TableHead>Задача</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {presentEmployees.map((emp) => (
                      <TableRow key={emp.employeeId}>
                        <TableCell>
                          {emp.employee.firstName} {emp.employee.lastName}
                        </TableCell>
                        <TableCell>{emp.workedHours ?? "—"}</TableCell>
                        <TableCell>{emp.task || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>

            {/* Таблица с отсутствующими сотрудниками */}
            <Card className="p-5 border rounded-2xl">
              <h4 className="font-medium mb-4">Отсутствующие сотрудники</h4>
              {absentEmployees.length === 0 ? (
                <p className="text-gray-500">Все сотрудники на смене</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Сотрудник</TableHead>
                      <TableHead>Причина отсутствия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {absentEmployees.map((emp) => (
                      <TableRow key={emp.employeeId}>
                        <TableCell>
                          {emp.employee.firstName} {emp.employee.lastName}
                        </TableCell>
                        <TableCell>{emp.absenceReason || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
