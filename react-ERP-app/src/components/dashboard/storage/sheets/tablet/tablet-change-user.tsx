import type { Tablet } from "@/types/tablet";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTabletSheetStore } from "@/stores/tablet-sheet-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EmployeeAutocomplete } from "@/components/dashboard/select-employee-for-form";
import { Button } from "@/components/ui/button";
import { useChangeEmployee } from "@/hooks/tablet/useChangeEmployee";
import { useEmployees } from "@/hooks/employee/useEmployees";
import { TabletDetailsBox } from "./tablet-details-box";

type TabletDetailsProps = { tablet: Tablet };

const formSchema = z.object({
  employeeId: z.string().min(1, "Выберите сотрудника"),
});

type FormData = z.infer<typeof formSchema>;

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
  const changeEmployeeMutation = useChangeEmployee(tablet.id);
  const { data: employees = [] } = useEmployees({
    searchQuery: "",
    objectId: "all",
    type: "ACTIVE",
  });

  const onSubmit = (data: FormData) => {
    changeEmployeeMutation.mutate(
      { employeeId: data.employeeId },
      {
        onSuccess: () => {
          reset();
          closeSheet();
        },
      }
    );
  };

  return (
    <div className="p-5 flex flex-col gap-1">
      <TabletDetailsBox tablet={tablet} />

      <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />

      <p className="text-center font-medium text-xl mt-5">Перемещение</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex justify-between mt-10">
          {/* Предыдущий владелец */}
          <div className="flex flex-col gap-2">
            <Label>Предыдущий пользователь</Label>
            <Input
              className="w-[300px]"
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
            <Label>Новый пользователь *</Label>
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
          <Button
            type="submit"
            className="w-[300px]"
            disabled={changeEmployeeMutation.isPending}
          >
            {changeEmployeeMutation.isPending ? "Передача..." : "Передать"}
          </Button>
        </div>
      </form>
    </div>
  );
}
