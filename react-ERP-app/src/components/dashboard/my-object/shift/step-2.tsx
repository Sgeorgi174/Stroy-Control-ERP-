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
import { Checkbox } from "@/components/ui/checkbox";

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
  taskHistory: string[];
}

export default function Step2AssignTasks({
  employeeSelections,
  setEmployeeSelections,
  taskHistory,
}: Step2AssignTasksProps) {
  const selectedEmployees = employeeSelections.filter((emp) => emp.selected);

  const handleTaskChange = (id: string, value: string) => {
    setEmployeeSelections((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, task: value } : emp))
    );
  };

  if (selectedEmployees.length === 0) {
    return (
      <p className="text-gray-500">
        Нет выбранных сотрудников для назначения задач.
      </p>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-medium mb-4">
        Назначение задач выбранным сотрудникам
      </h3>

      <div className="flex-1 overflow-y-auto rounded-md border p-3">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
            <TableRow>
              <TableHead>Сотрудник</TableHead>
              <TableHead>Местный</TableHead>
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
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{emp.position}</Badge>
                </TableCell>
                <TableCell>{emp.workedHours ?? "—"}</TableCell>

                <TableCell>
                  <Input
                    id={`task-${emp.id}`}
                    name="employee-task"
                    placeholder="Опишите задачу"
                    value={emp.task || ""}
                    onChange={(e) => handleTaskChange(emp.id, e.target.value)}
                    list={`task-suggestions-${emp.id}`}
                  />
                  <datalist id={`task-suggestions-${emp.id}`}>
                    {taskHistory.map((task, idx) => (
                      <option key={idx} value={task} />
                    ))}
                  </datalist>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
