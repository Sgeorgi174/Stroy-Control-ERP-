import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useGetFreeEmployees } from "@/hooks/employee/useGetFreeEmployees";
import { useAssignToObject } from "@/hooks/employee/useAssignToObject";
import { AddEmployeesTable } from "../tables/add-employees-table";
import { useObjectSheetStore } from "@/stores/objects-sheet-store";
import type { Object } from "@/types/object";

const formSchema = z.object({
  employeeIds: z
    .array(z.string().uuid(), {
      required_error: "Выберите хотя бы одного сотрудника",
    })
    .min(1, "Выберите хотя бы одного сотрудника"),
});

type FormValues = z.infer<typeof formSchema>;

type ObjectAddEmployeeProps = { object: Object };

export function ObjectAddEmployee({ object }: ObjectAddEmployeeProps) {
  const { data: employees = [], isError, isLoading } = useGetFreeEmployees();
  const { closeSheet } = useObjectSheetStore();
  const assignMutation = useAssignToObject();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeIds: [],
    },
  });

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = (data: FormValues) => {
    assignMutation.mutate(
      {
        objectId: object.id,
        employeeIds: data.employeeIds,
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
    <form onSubmit={handleSubmit(onSubmit)} className="p-5 flex flex-col gap-1">
      <p>
        Наименование: <span className="font-medium">{object.name}</span>
      </p>
      <p>
        Адрес: <span className="font-medium">{object.address}</span>
      </p>
      <p>
        Бригадир:{" "}
        <span className="font-medium">
          {object.foreman
            ? `${object.foreman.firstName} ${object.foreman.lastName}`
            : "-"}
        </span>
      </p>
      <p>
        Телефон:{" "}
        <span className="font-medium">{object.foreman?.phone || "-"}</span>
      </p>

      <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />

      <p className="text-center font-medium text-xl mt-5">Список сотрудников</p>

      <AddEmployeesTable
        isError={isError}
        isLoading={isLoading}
        employees={employees}
        onSelectionChange={(ids) => setValue("employeeIds", ids)}
      />

      {errors.employeeIds && (
        <p className="text-sm text-destructive text-center mt-2">
          {errors.employeeIds.message}
        </p>
      )}

      <button
        type="submit"
        disabled={assignMutation.isPending}
        className="mt-6 self-center bg-primary text-secondary px-6 py-2 rounded-md disabled:opacity-50"
      >
        Назначить сотрудников
      </button>
    </form>
  );
}
