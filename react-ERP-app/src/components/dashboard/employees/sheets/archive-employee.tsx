import type { Employee } from "@/types/employee";
import { EmployeeDetailsBox } from "./details-box";
import { Card } from "@/components/ui/card";
import { DotIcon, TriangleAlertIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEmployeeSheetStore } from "@/stores/employee-sheet-store";
import { useArchiveEmployee } from "@/hooks/employee/useArchiveEmployee";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

type EmployeeArchiveProps = { employee: Employee };

const schema = z.object({
  comment: z.string().min(1, "Комментарий обязателен"),
});

type FormData = z.infer<typeof schema>;

export function EmployeeArchive({ employee }: EmployeeArchiveProps) {
  const { closeSheet } = useEmployeeSheetStore();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      comment: undefined,
    },
  });

  const { mutate: archiveEmployee, isPending } = useArchiveEmployee(
    employee.id
  );

  const onSubmit = (data: FormData) => {
    archiveEmployee(
      {
        comment: data.comment.trim(),
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
    <div className="p-5 flex flex-col gap-1">
      <EmployeeDetailsBox isWarning={false} employee={employee} />
      <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
      <p className="text-center font-medium text-xl mt-6">Перенос в архив</p>
      <Card className="bg-attention p-5 mt-6">
        <div className="flex gap-5">
          <TriangleAlertIcon
            className="w-[20px]"
            strokeWidth={3}
            color="#9A2525"
          />
          <p className="mb-1 font-medium">
            Внимание! Сотрудник будет перемещён в архив.
          </p>
        </div>
        <div className="flex gap-2">
          <DotIcon />
          <p>Это действие скроет сотрудника из списков активных.</p>
        </div>
        <div className="flex gap-2">
          <DotIcon />
          <p>
            Вы не сможете назначать его на объекты или выдавать ему
            оборудование.
          </p>
        </div>
        <div className="flex gap-2">
          <DotIcon />
          <p>Вы сможете восстановить сотрудника из архива.</p>
        </div>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <div className="flex flex-col w-[400px] gap-2">
          <Label>Комментарий</Label>
          <Textarea
            {...register("comment")}
            placeholder="Укажите причину смены статуса"
            className="resize-none w-[500px]"
            disabled={isPending}
          />
          {errors.comment && (
            <p className="text-sm text-red-500">{errors.comment.message}</p>
          )}
        </div>

        <div className="flex justify-center mt-10">
          <Button
            variant={"destructive"}
            type="submit"
            className="w-[300px]"
            disabled={isPending}
          >
            {isPending ? "Перемещение..." : "Переместить в архив"}
          </Button>
        </div>
      </form>
    </div>
  );
}
