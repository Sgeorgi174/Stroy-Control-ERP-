import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EmployeeAutocomplete } from "@/components/dashboard/select-employee-for-form";
import { useTabletSheetStore } from "@/stores/tablet-sheet-store";
import { useCreateTablet } from "@/hooks/tablet/useCreateTablet";
import { useEmployees } from "@/hooks/employee/useEmployees";

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

  const selectedEmployeeId = watch("employeeId");
  const { closeSheet } = useTabletSheetStore();
  const createTabletMutation = useCreateTablet();
  const { data: employees = [] } = useEmployees({
    searchQuery: "",
    objectId: "all",
    type: "ACTIVE",
  });

  const onSubmit = (data: FormData) => {
    createTabletMutation.mutate(
      {
        name: data.name.trim(),
        serialNumber: data.serialNumber.trim(),
        employeeId: data.employeeId,
      },
      {
        onSuccess: () => {
          reset();
          closeSheet();
        },
      }
    );
  };

  return (
    <div className="p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Имя */}
        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="name">Наименование *</Label>
          <Input
            id="name"
            type="text"
            placeholder="Введите наименование"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Серийник */}
        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="serialNumber">Серийный № *</Label>
          <Input
            id="serialNumber"
            placeholder="Введите серийный номер"
            type="text"
            {...register("serialNumber")}
          />
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
          <Button
            type="submit"
            className="w-[300px]"
            disabled={createTabletMutation.isPending}
          >
            {createTabletMutation.isPending ? "Создание..." : "Добавить"}
          </Button>
        </div>
      </form>
    </div>
  );
}
