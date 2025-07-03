import type { Employee } from "@/types/employee";
import { EmployeeDetailsBox } from "./details-box";
import { EmployeeSkillsBox } from "./skills-box";
import { Label } from "@/components/ui/label";
import { ObjectSelectForForms } from "../../select-object-for-form";
import { useObjects } from "@/hooks/object/useObject";
import { Button } from "@/components/ui/button";
import type { Object } from "@/types/object";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEmployeeSheetStore } from "@/stores/employee-sheet-store";
import { useTransferEmployee } from "@/hooks/employee/useTransferEmployee";

type EmployeeChangeObjectProps = { employee: Employee };

export function EmployeeChangeObject({ employee }: EmployeeChangeObjectProps) {
  const { closeSheet } = useEmployeeSheetStore();
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });
  const transferEmployeeMutation = useTransferEmployee(employee.id);

  const transferEmployeeSchema = z.object({
    fromObjectId: z.string().nullable(),
    toObjectId: z.string().refine((val) => val !== employee.objectId, {
      message: "Нельзя выбрать тот же объект",
    }),
  });

  type FormData = z.infer<typeof transferEmployeeSchema>;

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(transferEmployeeSchema),
    defaultValues: {
      fromObjectId: employee.objectId,
      toObjectId: "",
    },
  });

  const selectedToObjectId = watch("toObjectId");

  const onSubmit = async (data: FormData) => {
    try {
      await transferEmployeeMutation.mutateAsync({
        objectId: data.toObjectId,
      });
      reset();
      closeSheet();
    } catch (error) {
      console.error("Ошибка при перемещении:", error);
    }
  };

  return (
    <div className="p-5 flex flex-col gap-1">
      <EmployeeDetailsBox employee={employee} />
      <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
      <EmployeeSkillsBox employee={employee} />
      <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
      <p className="text-center font-medium text-xl mt-6">Смена объекта</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between mt-10 px-10">
          <div className="flex flex-col gap-2">
            <Label>С какого объекта</Label>
            <ObjectSelectForForms
              isEmptyElement
              className="w-[300px]"
              disabled
              selectedObjectId={employee.objectId ?? "none"}
              onSelectChange={(id) => setValue("fromObjectId", id ?? "none")}
              objects={objects}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>На какой объект*</Label>
            <ObjectSelectForForms
              className="w-[300px]"
              selectedObjectId={selectedToObjectId}
              onSelectChange={(id) => {
                if (id !== null) {
                  setValue("toObjectId", id);
                }
              }}
              objects={objects.filter(
                (item: Object) => item.id !== employee.objectId
              )}
            />
            {errors.toObjectId && (
              <p className="text-sm text-red-500">
                {errors.toObjectId.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <Button type="submit" className="w-[300px]">
            {"Переместить"}
          </Button>
        </div>
      </form>
    </div>
  );
}
