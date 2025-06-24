import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Tablet, TabletStatus } from "@/types/tablet";
import { SelectTabletStatusForForms } from "@/components/dashboard/select-tablet-status-for-form";
import { useTabletSheetStore } from "@/stores/tablet-sheet-store";
import { useChangeTabletStatus } from "@/hooks/tablet/useChangeTabletStatus"; // ✅ импорт hook'а
import { TabletDetailsBox } from "./tablet-details-box";

type TabletChangeStatusProps = { tablet: Tablet };

const schema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "IN_REPAIR", "LOST", "WRITTEN_OFF"], {
    message: "Новый статус обязателен",
  }),
  comment: z.string().min(1, "Комментарий обязателен"),
});

type FormData = z.infer<typeof schema>;

export function TabletChangeStatus({ tablet }: TabletChangeStatusProps) {
  const { closeSheet } = useTabletSheetStore();
  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: undefined,
      comment: "",
    },
  });

  const selectedStatus = watch("status");

  const mutation = useChangeTabletStatus(tablet.id); // ✅ получаем хук с id

  const onSubmit = (data: FormData) => {
    mutation.mutate(data, {
      onSuccess: () => {
        reset();
        closeSheet();
      },
    });
  };

  return (
    <div className="p-5 flex flex-col gap-1">
      <TabletDetailsBox tablet={tablet} />

      <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
      <p className="text-center font-medium text-xl mt-5">Смена статуса</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6 mt-10">
          <div className="flex flex-col gap-2">
            <Label>Новый статус</Label>
            <SelectTabletStatusForForms
              currentStatus={tablet.status}
              selectedStatus={selectedStatus}
              onSelectChange={(status) =>
                setValue("status", status as TabletStatus)
              }
            />
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          <div className="flex flex-col w-[400px] gap-2">
            <Label>Комментарий</Label>
            <Textarea
              {...register("comment")}
              placeholder="Укажите причину смены статуса"
              className="resize-none"
            />
            {errors.comment && (
              <p className="text-sm text-red-500">{errors.comment.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <Button
            type="submit"
            className="w-[200px]"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Сохранение..." : "Сменить статус"}
          </Button>
        </div>
      </form>
    </div>
  );
}
