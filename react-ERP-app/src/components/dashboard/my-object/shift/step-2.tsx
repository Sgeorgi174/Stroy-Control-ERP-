import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import type { Positions } from "@/types/employee";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EmployeeSelection {
  id: string;
  selected: boolean;
  workedHours: number | null;
  firstName: string;
  lastName: string;
  position: Positions;
  task?: string;
}

interface Step2AssignTasksProps {
  employeeSelections: EmployeeSelection[];
  setEmployeeSelections: React.Dispatch<
    React.SetStateAction<EmployeeSelection[]>
  >;
  onNext?: () => void;
}

export default function Step2AssignTasks({
  employeeSelections,
  setEmployeeSelections,
  onNext,
}: Step2AssignTasksProps) {
  const handleTaskChange = (id: string, value: string) => {
    setEmployeeSelections((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, task: value } : emp))
    );
  };

  const selectedEmployees = employeeSelections.filter((emp) => emp.selected);

  if (selectedEmployees.length === 0) {
    return (
      <p className="text-gray-500">
        Нет выбранных сотрудников для назначения задач.
      </p>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-150px)]">
      <h3 className="text-xl font-medium mb-4">
        Назначение задач выбранным сотрудникам
      </h3>

      <div className="flex-1 overflow-y-auto rounded-md border p-3">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
            <TableRow>
              <TableHead>Сотрудник</TableHead>
              <TableHead>Должность</TableHead>
              <TableHead>Часы</TableHead>
              <TableHead>Задача</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedEmployees.map((emp) => (
              <TableRow key={emp.id} className="h-[53px]">
                <TableCell>
                  {emp.lastName} {emp.firstName}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{emp.position}</Badge>
                </TableCell>
                <TableCell>{emp.workedHours ?? "—"}</TableCell>
                <TableCell>
                  <Input
                    placeholder="Опишите задачу"
                    value={emp.task || ""}
                    onChange={(e) => handleTaskChange(emp.id, e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-end border-t pt-4 bg-background sticky bottom-0">
        <Button onClick={onNext}>Далее</Button>
      </div>
    </div>
  );
}
