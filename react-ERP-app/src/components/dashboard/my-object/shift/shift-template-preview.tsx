import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ShiftTemplate } from "@/types/shift";
import { Check, Eye, TriangleAlert } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShiftTemplateEditDialog } from "./update-shift-template";
import { ShiftTemplateDeleteDialog } from "./delete-shift-template";
import type { Employee } from "@/types/employee";
import { diffTemplateEmployees } from "@/lib/utils/diffTemplateEmployees";

interface ShiftTemplatePreviewDialogProps {
  template: ShiftTemplate;
  employees: Employee[];
}

export function ShiftTemplatePreviewDialog({
  template,
  employees,
}: ShiftTemplatePreviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { removedEmployees, newEmployees } = diffTemplateEmployees({
    template,
    currentEmployees: employees,
  });

  const selectedEmployees = template.employees.filter((e) => e.present);
  const absentEmployees = template.employees.filter((e) => !e.present);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          role="button"
          className="flex items-center gap-4 p-3 bg-accent-foreground rounded-xl cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <p className="font-medium text-accent">{template.name}</p>
          <div className="h-[20px] w-[1px] bg-muted"></div>
          <Eye className="text-accent" />
        </div>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="w-[900px] sm:max-w-[1250px] max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>{template.name}</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditOpen(true)}
              >
                Редактировать
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
              >
                Удалить
              </Button>
            </div>
          </DialogTitle>
          {(removedEmployees.length > 0 || newEmployees.length > 0) && (
            <div className="bg-yellow-300/30 p-3 rounded-md space-y-2">
              <div className="flex gap-4 items-center">
                <TriangleAlert className="text-yellow-700" />
                <p className="font-medium">Требуется редактирование шаблона</p>
              </div>

              {removedEmployees.length > 0 && (
                <div>
                  <p className="font-medium text-red-700 mb-1">
                    Больше не работают на объекте:
                  </p>
                  <ul className="list-disc list-inside text-sm">
                    {removedEmployees.map((emp) => (
                      <li key={emp.id}>
                        {emp.employee.lastName} {emp.employee.firstName}{" "}
                        {emp.employee.fatherName}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {newEmployees.length > 0 && (
                <div>
                  <p className="font-medium text-green-700 mb-1">
                    Новые сотрудники на объекте:
                  </p>
                  <ul className="list-disc list-inside text-sm">
                    {newEmployees.map((emp) => (
                      <li key={emp.id}>
                        {emp.lastName} {emp.firstName} {emp.fatherName}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogHeader>

        <div className="w-full overflow-y-auto space-y-6 p-3 border rounded-md">
          <div>
            <h3 className="text-xl font-medium mb-4">
              Сотрудники с назначенными задачами
            </h3>
            {selectedEmployees.length === 0 ? (
              <p className="text-gray-500">Нет выбранных сотрудников.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Сотрудник</TableHead>
                    <TableHead className="w-[100px]">Местный</TableHead>
                    <TableHead className="w-[100px]">Часы</TableHead>
                    <TableHead>Задача</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedEmployees.map((emp) => (
                    <TableRow key={emp.id}>
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
          </div>

          <div>
            <h3 className="text-xl font-medium mb-4">
              Отсутствующие сотрудники
            </h3>
            {absentEmployees.length === 0 ? (
              <p className="text-gray-500">Нет отсутствующих сотрудников.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Сотрудник</TableHead>
                    <TableHead className="w-[100px]">Местный</TableHead>
                    <TableHead className="w-[100px]">Часы</TableHead>
                    <TableHead>Причина отсутствия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {absentEmployees.map((emp) => (
                    <TableRow key={emp.id}>
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
          </div>
        </div>
        <ShiftTemplateEditDialog
          template={template}
          open={editOpen}
          onClose={() => setEditOpen(false)}
        />
        <ShiftTemplateDeleteDialog
          templateId={template.id}
          templateName={template.name}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onDeleted={() => setOpen(false)}
        />
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
