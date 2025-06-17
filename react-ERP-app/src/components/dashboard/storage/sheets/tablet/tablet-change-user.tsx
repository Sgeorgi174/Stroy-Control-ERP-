import type { Tablet } from "@/types/tablet";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTabletSheetStore } from "@/stores/tablet-sheet-store";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EmployeeAutocomplete } from "@/components/dashboard/select-employee-for-form";
import { employees } from "@/constants/employees";
import { Button } from "@/components/ui/button";

type TabletDetailsProps = { tablet: Tablet };

const formSchema = z.object({
  employeeId: z.string().min(1, "Выберите сотрудника"),
});

type FormData = z.infer<typeof formSchema>;

const statusMap = {
  ACTIVE: "Активен",
  INACTIVE: "Свободен",
  IN_REPAIR: "На ремонте",
  LOST: "Утерян",
  WRITTEN_OFF: "Списан",
};

export function TabletChangeUser({ tablet }: TabletDetailsProps) {
  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      employeeId: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { closeSheet } = useTabletSheetStore();

  const selectedEmployeeId = watch("employeeId");

  const onSubmit = (data: FormData) => {
    try {
      console.log("Собранные данные:", {
        employeeId: data.employeeId,
      });

      reset();
      closeSheet();
      toast.success(`Успешно Сотрудник: ${data.employeeId}`);
    } catch (error) {
      toast.error("Не удалось создать технику");
      console.error("Ошибка:", error);
    }
  };

  return (
    <div className="p-5 flex flex-col gap-1">
      <p>
        Серийный номер:{" "}
        <span className="font-medium">{tablet.serialNumber}</span>
      </p>
      <p>
        Наименование: <span className="font-medium">{tablet.name}</span>
      </p>
      <p>
        Статус: <span className="font-medium">{statusMap[tablet.status]}</span>
      </p>
      <p>
        Кому выдан:{" "}
        <span className="font-medium">
          {tablet.employee
            ? `${tablet.employee.lastName} ${tablet.employee.firstName}`
            : "Не назначен"}
        </span>
      </p>
      <p>
        Телефон:{" "}
        <span className="font-medium">
          {tablet.employee?.phoneNumber || "-"}
        </span>
      </p>

      <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />

      <p className="text-center font-medium text-xl mt-5">Перемещение</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between mt-10 px-10">
          {/* Предыдущий владелец */}
          <div className="flex flex-col gap-2">
            <Label>Предыдущий владелец</Label>
            <Input
              className="w-[250px]"
              type="text"
              disabled
              value={
                tablet.employee
                  ? `${tablet.employee.lastName} ${tablet.employee.firstName}`
                  : "Не назначен"
              }
            />
          </div>

          {/* Новый владелец */}
          <div className="flex flex-col gap-2">
            <Label>Сотрудник *</Label>
            <EmployeeAutocomplete
              employees={employees}
              onSelectChange={(employeeId) =>
                setValue("employeeId", employeeId, { shouldValidate: true })
              }
              selectedEmployeeId={selectedEmployeeId}
            />
            {errors.employeeId && (
              <p className="text-sm text-red-500">
                {errors.employeeId.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <Button type="submit" className="w-[200px]">
            Передать
          </Button>
        </div>
      </form>
    </div>
  );
}
