import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Tablet } from "@/types/tablet";
import { useTabletSheetStore } from "@/stores/tablet-sheet-store";
import { EmployeeAutocomplete } from "@/components/dashboard/select-employee-for-form";
import { useUpdateTablet } from "@/hooks/tablet/useUpdateTablet";
import { useEmployees } from "@/hooks/employee/useEmployees";

const formSchema = z.object({
  name: z.string().min(1, "Наименование обязательно"),
  serialNumber: z.string().min(1, "Серийный номер обязателен"),
  employeeId: z.string().min(1, "Выберите сотрудника"),
});

type FormData = z.infer<typeof formSchema>;

type TabletEditProps = {
  tablet: Tablet;
};

export function TabletEdit({ tablet }: TabletEditProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: tablet.name,
      serialNumber: tablet.serialNumber,
      employeeId: tablet.employee?.id,
    },
    resolver: zodResolver(formSchema),
  });

  const selectedEmployeeId = watch("employeeId");

  const { closeSheet } = useTabletSheetStore();
  const updateTabletMutation = useUpdateTablet(tablet.id);
  const { data: employees = [] } = useEmployees({ searchQuery: "" });

  const onSubmit = (data: FormData) => {
    updateTabletMutation.mutate(
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
          <Input id="name" type="text" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Серийный номер */}
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
          <Button
            type="submit"
            className="w-[200px]"
            disabled={updateTabletMutation.isPending}
          >
            {updateTabletMutation.isPending ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </form>
    </div>
  );
}
