import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEmployees } from "@/hooks/employee/useEmployees";
import { Input } from "@/components/ui/input";
import type { Positions } from "@/types/employee";
import { useCreateShiftTemplate } from "@/hooks/shift-template/useShiftTemplate";
import Step1SelectHours from "./step-1";
import Step2AssignTasks from "./step-2";
import Step3AbsenceReason from "./step-3";
import Step4Summary from "./step-4";
import {
  loadTaskHistory,
  saveTaskHistory,
} from "@/lib/utils/task-absence-history";

interface ShiftTemplateDialogProps {
  objectId: string;
}

export function ShiftTemplateCreateDialog({
  objectId,
}: ShiftTemplateDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const prevStepRef = useRef(step);

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const [templateName, setTemplateName] = useState("");
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

  const [taskHistory, setTaskHistory] = useState<string[]>([]);

  // --- загрузка сотрудников ---
  const { data: employees = [] } = useEmployees({
    objectId,
    searchQuery: "",
    type: "ACTIVE",
  });

  // --- инициализация сотрудников ---
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

  // --- загрузка истории задач из localStorage ---
  useEffect(() => {
    setTaskHistory(loadTaskHistory());
  }, []);

  // --- сохранение задач при смене шага ---
  useEffect(() => {
    if (prevStepRef.current !== step) {
      const newTasks = employeeSelections
        .map((emp) => emp.task)
        .filter((t): t is string => !!t);

      const updated = saveTaskHistory(taskHistory, newTasks);
      setTaskHistory(updated);

      prevStepRef.current = step;
    }
  }, [step, employeeSelections, taskHistory]);

  const createTemplateMutation = useCreateShiftTemplate();

  const handleCreateTemplate = () => {
    if (!templateName.trim()) {
      alert("Введите название шаблона");
      return;
    }
    if (plannedHours <= 0) {
      alert("Выберите количество часов для шаблона");
      return;
    }

    const employeesForTemplate = employeeSelections.map((emp) => ({
      employeeId: emp.id,
      workedHours: emp.workedHours || 0,
      present: emp.selected,
      task: emp.task,
      absenceReason: emp.absenceReason,
    }));

    createTemplateMutation.mutate(
      {
        name: templateName,
        plannedHours,
        objectId,
        employees: employeesForTemplate,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setStep(0);
          setTemplateName("");
          setPlannedHours(0);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Создать шаблон смены
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Создание шаблона смены
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-4 py-4"
        >
          {step === 0 && (
            <div className="flex flex-col gap-2">
              <label htmlFor="shift-name" className="font-medium">
                Название шаблона
              </label>
              <Input
                id="shift-name"
                name="shift-name"
                autoComplete="shift-template-name"
                placeholder="Например: Смена на 18.11.25"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
          )}

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
              taskHistory={taskHistory}
            />
          )}

          {step === 3 && (
            <Step3AbsenceReason
              employeeSelections={employeeSelections}
              setEmployeeSelections={setEmployeeSelections}
            />
          )}

          {step === 4 && (
            <Step4Summary employeeSelections={employeeSelections} />
          )}
        </form>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={step === 0}>
            Назад
          </Button>
          {step < 4 ? (
            <Button onClick={nextStep}>Далее</Button>
          ) : (
            <Button
              onClick={handleCreateTemplate}
              disabled={createTemplateMutation.isPending}
            >
              Создать шаблон
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
