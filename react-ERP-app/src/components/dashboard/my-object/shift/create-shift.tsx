import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Step1SelectHours from "./step-1";
import Step2AssignTasks from "./step-2";
import Step3AbsenceReason from "./step-3";
import Step4Summary from "./step-4";
import { Plus } from "lucide-react";
import { useEmployees } from "@/hooks/employee/useEmployees";
import type { Positions } from "@/types/employee";
import { formatISO } from "date-fns";
import { useCreateShift } from "@/hooks/shift/useShift";

interface ShiftOpenDialogProps {
  objectId: string;
}

export function ShiftOpenDialog({ objectId }: ShiftOpenDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [plannedHours, setPlannedHours] = useState(0);
  const [employeeSelections, setEmployeeSelections] = useState<
    {
      id: string;
      selected: boolean;
      workedHours: number | null;
      firstName: string;
      lastName: string;
      position: Positions;
      task?: string;
      absenceReason?: string;
    }[]
  >([]);

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const { data: employees = [] } = useEmployees({
    objectId,
    searchQuery: "",
    type: "ACTIVE",
  });

  const createShiftMutation = useCreateShift();

  // Инициализируем employeeSelections для всех сотрудников при загрузке
  useEffect(() => {
    setEmployeeSelections(
      employees.map((emp) => ({
        id: emp.id,
        selected: false,
        workedHours: null,
        firstName: emp.firstName,
        lastName: emp.lastName,
        position: emp.position,
      }))
    );
  }, [employees]);

  const handleCreateShift = async () => {
    if (plannedHours <= 0) {
      // Можно добавить проверку на нулевые часы
      alert("Выберите количество часов для смены");
      return;
    }

    const shiftDate = formatISO(new Date()); // сегодняшняя дата

    const employeesForShift = employeeSelections.map((emp) => ({
      employeeId: emp.id,
      workedHours: emp.workedHours || 0,
      present: emp.selected,
      task: emp.task,
      absenceReason: emp.absenceReason,
    }));

    createShiftMutation.mutate(
      {
        shiftDate,
        plannedHours,
        objectId,
        employees: employeesForShift,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setStep(1);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Открыть смену
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Открытие смены
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <Step1SelectHours
            employees={employees}
            plannedHours={plannedHours}
            setPlannedHours={setPlannedHours}
            employeeSelections={employeeSelections}
            setEmployeeSelections={setEmployeeSelections}
          />
        )}

        {step === 2 && (
          <Step2AssignTasks
            employeeSelections={employeeSelections}
            setEmployeeSelections={setEmployeeSelections}
          />
        )}

        {step === 3 && (
          <Step3AbsenceReason
            employeeSelections={employeeSelections}
            setEmployeeSelections={setEmployeeSelections}
          />
        )}

        {step === 4 && <Step4Summary employeeSelections={employeeSelections} />}

        <DialogFooter className="flex justify-between mt-4">
          <Button variant="outline" onClick={prevStep} disabled={step === 1}>
            Назад
          </Button>

          {step < 4 ? (
            <Button onClick={nextStep}>Далее</Button>
          ) : (
            <Button
              onClick={handleCreateShift}
              disabled={createShiftMutation.isPending}
            >
              Открыть смену
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
