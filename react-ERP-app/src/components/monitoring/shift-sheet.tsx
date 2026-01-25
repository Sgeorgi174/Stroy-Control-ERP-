import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import type { Object } from "@/types/object";
import type { Shift } from "@/types/shift";
import { ShiftPDF } from "./pdf-button";
import { Check, Eye, SquarePen } from "lucide-react";
import { useState } from "react";
import { ShiftEditDialog } from "./updateShift";
import { formatDate, formatTime } from "@/lib/utils/format-date";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useAuth } from "@/hooks/auth/useAuth";

interface ShiftSheetProps {
  shift: Shift | null;
  isOpen: boolean;
  onClose: () => void;
  object: Object;
}

export function ShiftSheet({
  shift,
  isOpen,
  onClose,
  object,
}: ShiftSheetProps) {
  const [isOpenEditShift, setIsEditShift] = useState(false);
  const { data: user } = useAuth();

  if (!shift) return null;

  const presentEmployees = shift.employees
    .filter((e) => e.present)
    .sort((a, b) => {
      const lastNameDiff = a.employee.lastName.localeCompare(
        b.employee.lastName,
      );
      if (lastNameDiff !== 0) return lastNameDiff;

      const firstNameDiff = a.employee.firstName.localeCompare(
        b.employee.firstName,
      );
      if (firstNameDiff !== 0) return firstNameDiff;

      return a.employee.fatherName.localeCompare(b.employee.fatherName);
    });

  const absentEmployees = shift.employees
    .filter((e) => !e.present)
    .sort((a, b) => {
      const lastNameDiff = a.employee.lastName.localeCompare(
        b.employee.lastName,
      );
      if (lastNameDiff !== 0) return lastNameDiff;

      const firstNameDiff = a.employee.firstName.localeCompare(
        b.employee.firstName,
      );
      if (firstNameDiff !== 0) return firstNameDiff;

      return a.employee.fatherName.localeCompare(b.employee.fatherName);
    });

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[960px] sm:max-w-full overflow-auto p-6">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">{object.name}</SheetTitle>
          <SheetDescription>
            Смена на {new Date(shift.shiftDate).toLocaleDateString()}
          </SheetDescription>
        </SheetHeader>

        <div className="flex gap-4 mt-4 mb-6">
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="text-xl font-bold">{shift.employees.length}</div>
            <div className=" text-blue-600">Всего сотрудников</div>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="text-xl font-bold">{presentEmployees.length}</div>
            <div className=" text-green-600">На смене</div>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="text-xl font-bold">
              {shift.employees.length - presentEmployees.length}
            </div>
            <div className=" text-red-600">Отсутствуют</div>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="text-xl font-bold">{shift.totalHours} ч</div>
            <div className=" ">Кол-во часов</div>
          </div>

          <ShiftPDF shift={shift} object={object} />
          {(user?.role === "ACCOUNTANT" || user?.role === "ADMIN") && (
            <div
              role="button"
              onClick={() => setIsEditShift(true)}
              className="p-4 bg-muted rounded-lg flex flex-col items-center  text-center cursor-pointer"
            >
              <SquarePen width={35} height={28} />
              <div className=" ">Редактировать</div>
            </div>
          )}
        </div>

        {/* Таблица присутствующих */}
        <div>
          <div className="flex justify-between">
            <h4 className="text-lg font-medium mb-2">Присутствующие</h4>
            {shift.updatedReason && (
              <div className="flex items-center gap-5">
                <p className="text-muted-foreground">
                  Изменено: {formatDate(shift.updatedAt)}{" "}
                  {formatTime(shift.updatedAt)}
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
                      {shift.updatedReason}
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
          <Table className="mb-6">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">ФИО</TableHead>
                <TableHead className="w-[100px]">Местный</TableHead>
                <TableHead className="w-[100px]">Часы</TableHead>
                <TableHead>Развод</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {presentEmployees.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    {`${e.employee.lastName} ${e.employee.firstName.charAt(
                      0,
                    )}.${e.employee.fatherName.charAt(0)}.`}
                  </TableCell>
                  <TableCell className="pl-6">
                    {e.isLocal ? <Check className="w-[15px]" /> : ""}
                  </TableCell>
                  <TableCell>{e.workedHours}</TableCell>
                  <TableCell>{e.task || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Таблица отсутствующих */}
        <div>
          <h4 className="text-lg font-medium mb-2">Отсутствующие</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">ФИО</TableHead>
                <TableHead className="w-[100px]">Местный</TableHead>
                <TableHead className="w-[100px]">Часы</TableHead>
                <TableHead>Причина</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {absentEmployees.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    {`${e.employee.lastName} ${e.employee.firstName.charAt(
                      0,
                    )}.${e.employee.fatherName.charAt(0)}.`}
                  </TableCell>
                  <TableCell className="pl-6">
                    {e.isLocal ? <Check className="w-[15px]" /> : ""}
                  </TableCell>
                  <TableCell>{0}</TableCell>
                  <TableCell>{e.absenceReason || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <ShiftEditDialog
          open={isOpenEditShift}
          shift={shift}
          onClose={() => setIsEditShift(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
