import { useEmployees } from "@/hooks/employee/useEmployees";
import { useShiftTemplatesByObject } from "@/hooks/shift-template/useShiftTemplate";
import { useShiftsWithFilters } from "@/hooks/shift/useShift";
import { endOfDay, startOfDay } from "date-fns";
import { useState } from "react";
import { NotificationCard } from "./notification/notification-card";
import { Card } from "@/components/ui/card";
import { Clock } from "@/components/ui/clock";
import { Calendar01 } from "@/components/calendar-01";
import { Check, Eye, HardHat, Users } from "lucide-react";
import { ShiftTemplateCreateDialog } from "./shift/create-shift-template";
import { ShiftTemplatePreviewDialog } from "./shift/shift-template-preview";
import { ShiftPDF } from "@/components/monitoring/pdf-button";
import type { Object } from "@/types/object";
import { ShiftOpenDialog } from "./shift/create-shift";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmployeeSheet } from "../employees/sheets/employee-sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/utils/format-date";

type MyObjectMasterPanelProps = {
  object: Object;
};
export function MyObjectMasterPanel({ object }: MyObjectMasterPanelProps) {
  const { data: shiftTemplates = [] } = useShiftTemplatesByObject(
    object.id,
    !!object.id // enabled = true только если objectId существует
  );

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Начало и конец выбранного дня
  const dayStart = startOfDay(selectedDate).toISOString();
  const dayEnd = endOfDay(selectedDate).toISOString();

  const { data: shiftData } = useShiftsWithFilters(
    {
      objectId: object.id || "none",
      fromDate: dayStart,
      toDate: dayEnd,
    },
    !!object.id
  );

  const { data: allShifts } = useShiftsWithFilters(
    { objectId: object.id },
    !!object.id
  );

  // --- загрузка сотрудников ---
  const {
    data: employees = [],
    isError: isErrorEmployees,
    isLoading: isLoadingEmployees,
  } = useEmployees({
    objectId: object.id,
    searchQuery: "",
    type: "ACTIVE",
  });

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
        <NotificationCard
          objectId={object.id}
          employees={employees}
          isLoading={isLoadingEmployees}
          isError={isErrorEmployees}
        />
        <div className="col-span-2 flex flex-col gap-5">
          <Card className="flex justify-center p-2 items-center">
            <Clock className="font-medium p-2 text-5xl" />
          </Card>

          <Calendar01
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            shiftDates={shiftDates}
          />
        </div>
      </div>

      <div className="p-5 shadow-md border rounded-2xl flex flex-col mt-8">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Users size={30} />
            <p className="font-bold text-3xl">Управление сменой</p>
          </div>
          <div className="flex gap-4 max-h-[75px]">
            {shiftTemplates && shiftTemplates?.length < 1 && (
              <ShiftTemplateCreateDialog
                employees={employees}
                objectId={object.id || "none"}
              />
            )}
            {shiftTemplates &&
              shiftTemplates.map((shiftTemplate) => (
                <ShiftTemplatePreviewDialog
                  key={shiftTemplate.id}
                  template={shiftTemplate}
                  employees={employees}
                />
              ))}
            {todayShift && <ShiftPDF shift={todayShift} object={object} />}
          </div>
        </div>

        {!todayShift ? (
          <div className="p-5 border rounded-2xl flex flex-col items-center gap-2 mt-6">
            <HardHat size={50} className="text-muted-foreground" />
            <p className="font-medium text-xl">Смена не открыта</p>
            <p className="text-muted-foreground">
              Нажмите "Открыть смену", чтобы назначить сотрудников на эту дату
            </p>
            <ShiftOpenDialog
              employees={employees}
              objectId={object.id || "none"}
              shiftTemplates={shiftTemplates}
            />
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-6">
            {/* Карточки с общей статистикой */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 flex flex-col items-center bg-table-green">
                <p className="font-medium text-xl">Присутствует</p>
                <p className="font-bold text-3xl">{presentEmployees.length}</p>
              </Card>
              <Card className="p-4 flex flex-col items-center bg-table-red ">
                <p className="font-medium text-xl">Отсутствует</p>
                <p className="font-bold text-3xl">{absentEmployees.length}</p>
              </Card>
              <Card className="p-4 flex flex-col items-center bg-table-blue">
                <p className="font-medium text-xl">Общее количество часов</p>
                <p className="font-bold text-3xl">{totalWorkedHours}</p>
              </Card>
            </div>

            {/* Таблица с сотрудниками, которые работают */}
            <Card className="p-5 border rounded-2xl">
              <div className="flex items-center justify-between">
                <h4 className="font-medium mb-4">Сотрудники на смене</h4>
                {shiftData[0].updatedReason && (
                  <div className="flex items-center gap-5">
                    <p className="text-muted-foreground">
                      Изменено: {formatDate(shiftData[0].updatedAt)}{" "}
                      {formatTime(shiftData[0].updatedAt)}
                    </p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          <Eye />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-80">
                        <h4 className="text-sm font-medium mb-1">
                          Причина изменения смены:
                        </h4>

                        <p className="text-sm whitespace-pre-wrap">
                          {shiftData[0].updatedReason}
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>

              {presentEmployees.length === 0 ? (
                <p className="text-gray-500">Нет сотрудников на смене</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">№</TableHead>
                      <TableHead className="w-[250px]">Сотрудник</TableHead>
                      <TableHead className="w-[150px]">Местный</TableHead>
                      <TableHead className="w-[150px]">Часы</TableHead>
                      <TableHead>Задача</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {presentEmployees.map((emp, index) => (
                      <TableRow key={emp.employeeId}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {`${
                            emp.employee.lastName
                          } ${emp.employee.firstName.charAt(
                            0
                          )}.${emp.employee.fatherName.charAt(0)}.`}
                        </TableCell>
                        <TableCell className="pl-6">
                          {emp.isLocal ? <Check className="w-[18px]" /> : ""}
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
                      <TableHead className="w-[100px]">№</TableHead>
                      <TableHead className="w-[250px]">Сотрудник</TableHead>
                      <TableHead className="w-[150px]">Местный</TableHead>
                      <TableHead className="w-[150px]">Часы</TableHead>
                      <TableHead>Причина отсутствия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {absentEmployees.map((emp, index) => (
                      <TableRow key={emp.employeeId}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {`${
                            emp.employee.lastName
                          } ${emp.employee.firstName.charAt(
                            0
                          )}.${emp.employee.fatherName.charAt(0)}.`}
                        </TableCell>
                        <TableCell className="pl-6">
                          {emp.isLocal ? <Check className="w-[18px]" /> : ""}
                        </TableCell>
                        <TableCell>{0}</TableCell>
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
      <EmployeeSheet />
    </div>
  );
}
