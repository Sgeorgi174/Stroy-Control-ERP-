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
  if (!shift) return null;

  const presentEmployees = shift.employees.filter((e) => e.present);
  const absentEmployees = shift.employees.filter((e) => !e.present);

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
            <div className=" ">Общее кол-во часов</div>
          </div>

          <ShiftPDF shift={shift} object={object} />
        </div>

        {/* Таблица присутствующих */}
        <div>
          <h4 className="text-lg font-medium mb-2">Присутствующие</h4>
          <Table className="mb-6">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">ФИО</TableHead>
                <TableHead className="w-[100px]">Часы</TableHead>
                <TableHead>Развод</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {presentEmployees.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    {`${e.employee.lastName} ${e.employee.firstName.charAt(
                      0
                    )}.${e.employee.fatherName.charAt(0)}.`}
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
                <TableHead className="w-[100px]">Часы</TableHead>
                <TableHead>Причина</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {absentEmployees.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    {`${e.employee.lastName} ${e.employee.firstName.charAt(
                      0
                    )}.${e.employee.fatherName.charAt(0)}.`}
                  </TableCell>
                  <TableCell>{0}</TableCell>
                  <TableCell>{e.absenceReason || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SheetContent>
    </Sheet>
  );
}
