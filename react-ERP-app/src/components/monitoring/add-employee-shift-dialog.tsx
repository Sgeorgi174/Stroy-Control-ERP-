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
import { useEmployees } from "@/hooks/employee/useEmployees";
import type { EmployeeSelection } from "@/types/employee-selection";
import type { Employee } from "@/types/employee";
import { useState, useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AddEmployeeToShiftDialogProps = {
  open: boolean;
  onClose: () => void;
  employeeSelections: EmployeeSelection[];
  setEmployeeSelections: React.Dispatch<
    React.SetStateAction<EmployeeSelection[]>
  >;
  setEmployeesFromShift: React.Dispatch<React.SetStateAction<Employee[]>>;
};

export function AddEmployeeToShiftDialog({
  open,
  onClose,
  employeeSelections,
  setEmployeeSelections,
  setEmployeesFromShift,
}: AddEmployeeToShiftDialogProps) {
  const [search, setSearch] = useState("");
  const [employeeType, setEmployeeType] = useState<"ACTIVE" | "ARCHIVE">(
    "ACTIVE"
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: allEmployees = [] } = useEmployees({
    objectId: "all",
    type: employeeType,
    searchQuery: "",
  });

  // Фильтруем сотрудников, которых ещё нет в смене и по поиску
  const available = useMemo(() => {
    return allEmployees
      .filter(
        (emp) =>
          !employeeSelections.some((s) => s.id === emp.id) &&
          `${emp.lastName} ${emp.firstName} ${emp.fatherName || ""}`
            .toLowerCase()
            .includes(search.toLowerCase())
      )
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [allEmployees, employeeSelections, search]);

  useEffect(() => {
    if (open) setSelectedIds([]);
  }, [open]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAddSelected = () => {
    const toAdd = available.filter((emp) => selectedIds.includes(emp.id));

    setEmployeeSelections((prev) =>
      [
        ...prev,
        ...toAdd.map((emp) => ({
          id: emp.id,
          selected: true,
          workedHours: null,
          task: "",
          absenceReason: "",
          isLocal: false,
          firstName: emp.firstName,
          lastName: emp.lastName,
          fatherName: emp.fatherName,
          position: emp.position,
        })),
      ].sort((a, b) => a.lastName.localeCompare(b.lastName))
    );

    setEmployeesFromShift((prev) =>
      [...prev, ...toAdd].sort((a, b) => a.lastName.localeCompare(b.lastName))
    );

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[800px] sm:max-w-[1250px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить сотрудника в смену</DialogTitle>
        </DialogHeader>

        {/* Поиск и выбор типа */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Поиск сотрудника..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-2 py-1 flex-1"
          />

          <Select
            value={employeeType}
            onValueChange={(v) => setEmployeeType(v as "ACTIVE" | "ARCHIVE")}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Тип" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Сотрудники</SelectLabel>
                <SelectItem value="ACTIVE">Актуальные</SelectItem>
                <SelectItem value="ARCHIVE">Архив</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="max-h-[600px] overflow-y-auto mt-2">
          {available.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Нет доступных сотрудников
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
                {available.map((emp) => (
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
            onClick={handleAddSelected}
            disabled={selectedIds.length === 0}
          >
            Добавить выбранных
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
