import { SelectStatusToolOrDeviceForForms } from "@/components/dashboard/select-tool-device-status";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Device, DeviceStatus } from "@/types/device";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDeviceSheetStore } from "@/stores/device-sheet-store";
import { useChangeDeviceStatus } from "@/hooks/device/useChangeDeviceStatus";
import { DeviceDetailsBox } from "./device-details-box";

type DeviceChangeStatusProps = { device: Device };

const schema = z.object({
  status: z.enum(
    ["ON_OBJECT", "IN_TRANSIT", "IN_REPAIR", "LOST", "WRITTEN_OFF"],
    { message: "Новый статус обязателен" }
  ),
  comment: z.string().min(1, "Комментарий обязателен"),
});

type FormData = z.infer<typeof schema>;

export function DeviceChangeStatus({ device }: DeviceChangeStatusProps) {
  const { closeSheet } = useDeviceSheetStore();

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
      comment: undefined,
    },
  });

  const selectedStatus = watch("status");

  const { mutate: changeStatus, isPending } = useChangeDeviceStatus(device.id);

  const onSubmit = (data: FormData) => {
    changeStatus(
      {
        status: data.status,
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
      <DeviceDetailsBox device={device} />

      <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
      <p className="text-center font-medium text-xl mt-5">Смена статуса</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6 mt-10">
          {/* Новый статус */}
          <div className="flex flex-col gap-2">
            <Label>Новый статус</Label>
            <SelectStatusToolOrDeviceForForms
              currentStatus={device.status}
              selectedStatus={selectedStatus ?? ""}
              onSelectChange={(status) =>
                setValue("status", status as DeviceStatus)
              }
              disabled={isPending}
            />
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          {/* Комментарий */}
          <div className="flex flex-col w-[400px] gap-2">
            <Label>Комментарий</Label>
            <Textarea
              {...register("comment")}
              placeholder="Укажите причину смены статуса"
              className="resize-none"
              disabled={isPending}
            />
            {errors.comment && (
              <p className="text-sm text-red-500">{errors.comment.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <Button type="submit" className="w-[300px]" disabled={isPending}>
            {isPending ? "Обновление..." : "Сменить статус"}
          </Button>
        </div>
      </form>
    </div>
  );
}
