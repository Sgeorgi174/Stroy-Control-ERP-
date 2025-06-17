import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EmployeeAutocomplete } from "@/components/dashboard/select-employee-for-form";
import { employees } from "@/constants/employees";
import { useTabletSheetStore } from "@/stores/tablet-sheet-store";

// 1. Схема валидации Zod
const tabletSchema = z.object({
  name: z.string().min(1, "Это поле обязательно"),
  serialNumber: z.string().min(1, "Это поле обязательно"),
  employeeId: z.string().min(1, "Выберите сотрудника"),
});

type FormData = z.infer<typeof tabletSchema>;

export function TabletAdd() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(tabletSchema),
    defaultValues: {
      name: "",
      serialNumber: "",
      employeeId: "",
    },
  });

  const { closeSheet } = useTabletSheetStore();
  const selectedEmployeeId = watch("employeeId");

  const onSubmit = (data: FormData) => {
    try {
      const trimmedName = data.name.trim();
      const trimmedSerial = data.serialNumber.trim();

      console.log("Собранные данные:", {
        name: trimmedName,
        serialNumber: trimmedSerial,
        employeeId: data.employeeId,
      });

      reset();
      closeSheet();
      toast.success(
        `Успешно создана техника\nИмя: ${trimmedName}\nСерийник: ${trimmedSerial}\nСотрудника: ${data.employeeId}`
      );
    } catch (error) {
      toast.error("Не удалось создать технику");
      console.error("Ошибка:", error);
    }
  };

  return (
    <div className="p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Имя */}
        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="name">Наименование *</Label>
          <Input id="name" type="text" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Серийник */}
        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="serialNumber">Серийный № *</Label>
          <Input id="serialNumber" type="text" {...register("serialNumber")} />
          {errors.serialNumber && (
            <p className="text-sm text-red-500">
              {errors.serialNumber.message}
            </p>
          )}
        </div>

        {/* Сотрудник */}
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
            <p className="text-sm text-red-500">{errors.employeeId.message}</p>
          )}
        </div>

        {/* Кнопка */}
        <div className="flex justify-center mt-10">
          <Button type="submit" className="w-[200px]">
            Добавить
          </Button>
        </div>
      </form>
    </div>
  );
}
