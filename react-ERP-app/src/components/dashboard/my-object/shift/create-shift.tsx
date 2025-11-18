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
import Step1SelectHours from "./step-1";
import Step2AssignTasks from "./step-2";
import Step3AbsenceReason from "./step-3";
import Step4Summary from "./step-4";
import { Plus } from "lucide-react";
import { useEmployees } from "@/hooks/employee/useEmployees";
import type { Positions } from "@/types/employee";
import { formatISO } from "date-fns";
import { useCreateShift } from "@/hooks/shift/useShift";
import {
  loadTaskHistory,
  saveTaskHistory,
} from "@/lib/utils/task-absence-history";
import type { ShiftTemplate } from "@/types/shift";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ShiftOpenDialogProps {
  objectId: string;
  shiftTemplates: ShiftTemplate[];
}

export function ShiftOpenDialog({
  objectId,
  shiftTemplates,
}: ShiftOpenDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const prevStepRef = useRef(step);

  const [mode, setMode] = useState<"new" | "template">("new");
  const [plannedHours, setPlannedHours] = useState(0);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
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

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const { data: employees = [] } = useEmployees({
    objectId,
    searchQuery: "",
    type: "ACTIVE",
  });

  const createShiftMutation = useCreateShift();

  // --- загрузка истории задач ---
  useEffect(() => {
    setTaskHistory(loadTaskHistory());
  }, []);

  // --- инициализация employeeSelections ---
  useEffect(() => {
    if (mode === "new") {
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
      setPlannedHours(0);
    } else if (mode === "template" && selectedTemplateId) {
      const template = shiftTemplates.find((t) => t.id === selectedTemplateId);
      if (!template) return;

      setPlannedHours(template.plannedHours);
      setEmployeeSelections(
        employees.map((emp) => {
          const tmplEmp = template.employees.find(
            (e) => e.employeeId === emp.id
          );
          return {
            id: emp.id,
            selected: tmplEmp?.present ?? false,
            workedHours: tmplEmp?.workedHours ?? null,
            firstName: emp.firstName,
            lastName: emp.lastName,
            position: emp.position,
            task: tmplEmp?.task,
            absenceReason: tmplEmp?.absenceReason,
          };
        })
      );
    }
  }, [employees, mode, selectedTemplateId, shiftTemplates]);

  // --- сохранение истории задач при смене шага ---
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

  const handleCreateShift = async () => {
    if (plannedHours <= 0) {
      alert("Выберите количество часов для смены");
      return;
    }

    const shiftDate = formatISO(new Date());

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
          setMode("new");
          setSelectedTemplateId(null);
        },
      }
    );
  };

  console.log(step);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Открыть смену
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Открытие смены
          </DialogTitle>
        </DialogHeader>

        {/* --- Табы сверху --- */}
        {step === 1 && (
          <>
            {/* --- Табы сверху --- */}
            <div className="flex gap-4 mb-4">
              <Button
                variant={mode === "new" ? "default" : "outline"}
                onClick={() => setMode("new")}
              >
                Новая смена
              </Button>
              <Button
                disabled={shiftTemplates.length < 1}
                variant={mode === "template" ? "default" : "outline"}
                onClick={() => setMode("template")}
              >
                Из шаблона
              </Button>
            </div>

            {mode === "template" && (
              <div className="mb-4 flex flex-col gap-2">
                <label className="font-medium">Выберите шаблон:</label>
                <Select
                  value={selectedTemplateId ?? ""}
                  onValueChange={(val) => setSelectedTemplateId(val || null)}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="-- Выберите шаблон --" />
                  </SelectTrigger>
                  <SelectContent>
                    {shiftTemplates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </>
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
