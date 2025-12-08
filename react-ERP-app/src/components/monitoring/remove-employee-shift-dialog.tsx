import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import type { EmployeeSelection } from "@/types/employee-selection";
import type { Employee } from "@/types/employee";
import { useState, useEffect, useMemo } from "react";

type RemoveEmployeeFromShiftDialogProps = {
  open: boolean;
  onClose: () => void;
  employeeSelections: EmployeeSelection[];
  setEmployeeSelections: React.Dispatch<
    React.SetStateAction<EmployeeSelection[]>
  >;
  setEmployeesFromShift: React.Dispatch<React.SetStateAction<Employee[]>>;
};

export function RemoveEmployeeFromShiftDialog({
  open,
  onClose,
  employeeSelections,
  setEmployeeSelections,
  setEmployeesFromShift,
}: RemoveEmployeeFromShiftDialogProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      setSelectedIds([]);
      setSearch("");
    }
  }, [open]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleRemoveSelected = () => {
    setEmployeeSelections((prev) =>
      prev.filter((emp) => !selectedIds.includes(emp.id))
    );
    setEmployeesFromShift((prev) =>
      prev.filter((emp) => !selectedIds.includes(emp.id))
    );
    onClose();
  };

  // Фильтруем и сортируем сотрудников по поиску и фамилии
  const filteredEmployees = useMemo(() => {
    return employeeSelections
      .filter((emp) =>
        `${emp.lastName} ${emp.firstName} ${emp.fatherName || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [employeeSelections, search]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[800px] sm:max-w-[1250px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Удалить сотрудника из смены</DialogTitle>
        </DialogHeader>

        {/* Поиск */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Поиск сотрудника..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>

        <div className="max-h-[600px] overflow-y-auto mt-2">
          {filteredEmployees.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Нет сотрудников по вашему запросу.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">Выбор</TableHead>
                  <TableHead>ФИО</TableHead>
                  <TableHead>Должность</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((emp) => (
                  <TableRow key={emp.id} className="cursor-pointer">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(emp.id)}
                        onCheckedChange={() => toggleSelect(emp.id)}
                      />
                    </TableCell>
                    <TableCell>
                      {emp.lastName} {emp.firstName} {emp.fatherName || ""}
                    </TableCell>
                    <TableCell>{emp.position}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button
            onClick={handleRemoveSelected}
            disabled={selectedIds.length === 0}
            variant="destructive"
          >
            Удалить выбранных
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
