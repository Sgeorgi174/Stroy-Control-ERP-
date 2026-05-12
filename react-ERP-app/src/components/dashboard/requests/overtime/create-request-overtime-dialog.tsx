import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EmployeeOvertime } from "@/types/overtime";
import { DatePicker } from "@/components/ui/date-picker";
import { Clock, Loader2 } from "lucide-react";
import type { CreateEmployeeOvertimeDto } from "@/types/dto/overtime.dto";
import { useEmployees } from "@/hooks/employee/useEmployees";
import { EmployeeAutocomplete } from "../../select-employee-for-form";
import { ObjectSelectForForms } from "../../select-object-for-form";
import { useObjects } from "@/hooks/object/useObject";
import {
  useCreateOvertime,
  useUpdateOvertime,
} from "@/hooks/overtime/useOvertimes";

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: EmployeeOvertime | null;
}

export function OvertimeCreateDialog({
  open,
  onOpenChange,
  initialData,
}: Props) {
  const isEdit = !!initialData;

  const { data: employees = [], isLoading: isEmployeesLoading } = useEmployees({
    searchQuery: "",
    objectId: "all",
    type: "ACTIVE",
  });

  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  const [form, setForm] = useState<
    Omit<CreateEmployeeOvertimeDto, "date"> & { date: string }
  >({
    employeeId: "",
    hours: 0,
    description: "",
    date: getTodayString(),
    objectId: "",
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        const d = new Date(initialData.date);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

        setForm({
          employeeId: initialData.employee.id,
          hours: initialData.hours,
          description: initialData.description || "",
          date: dateStr,
          objectId: initialData.object.id,
        });
      } else {
        setForm({
          employeeId: "",
          hours: 0,
          description: "",
          date: getTodayString(),
          objectId: "",
        });
      }
    }
  }, [initialData, open]);

  const createMutation = useCreateOvertime();
  const updateMutation = useUpdateOvertime(initialData?.id || "");
  const currentMutation = isEdit ? updateMutation : createMutation;

  const handleSubmit = () => {
    const payload = {
      ...form,
      date: `${form.date}T00:00:00.000Z`,
    };

    currentMutation.mutate(payload, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const isValid =
    form.employeeId && form.objectId && form.hours > 0 && form.date;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[850px] max-h-[90%] overflow-auto">
        <DialogHeader className="mb-6">
          <DialogTitle>
            {isEdit
              ? "Редактирование переработки"
              : "Заявка на дополнительные часы"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-8">
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <Label>Сотрудник</Label>
              {isEmployeesLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground h-10">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Загрузка...
                </div>
              ) : (
                <EmployeeAutocomplete
                  width="400"
                  employees={employees}
                  selectedEmployeeId={form.employeeId}
                  onSelectChange={(id) => setForm({ ...form, employeeId: id })}
                />
              )}
            </div>

            <div className="space-y-2 flex flex-col">
              <Label>Дата работы</Label>
              <DatePicker
                selected={form.date}
                onSelect={(date) =>
                  setForm({ ...form, date: date || getTodayString() })
                }
              />
            </div>
          </div>

          <div className="flex justify-between">
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="hours">Количество часов</Label>
              <div className="relative">
                <Input
                  id="hours"
                  type="number"
                  step="0.5"
                  className="pr-8 w-[300px]"
                  value={form.hours || ""}
                  onChange={(e) =>
                    setForm({ ...form, hours: Number(e.target.value) })
                  }
                />
                <Clock className="w-4 h-4 absolute right-2 top-3 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <Label>Объект</Label>
              <ObjectSelectForForms
                className="w-[400px]"
                objects={objects}
                selectedObjectId={form.objectId}
                onSelectChange={(id) =>
                  setForm({ ...form, objectId: id || "" })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Комментарий к заявке</Label>
            <Textarea
              id="description"
              placeholder="Опишите, почему потребовались дополнительные часы..."
              className="min-h-[120px] resize-none"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || currentMutation.isPending}
            className="px-8"
          >
            {currentMutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            {isEdit ? "Сохранить изменения" : "Отправить на согласование"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
