import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Device } from "@/types/device";
import { useDeviceSheetStore } from "@/stores/device-sheet-store";
import { useTransferDevice } from "@/hooks/device/useTransferDevice";
import { useObjects } from "@/hooks/object/useObject";
import { DeviceDetailsBox } from "./device-details-box";
import type { Object } from "@/types/object";

type DeviceTransferProps = { device: Device };

const transferSchema = z
  .object({
    fromObjectId: z.string().min(1, "Исходный объект обязателен"),
    toObjectId: z.string().min(1, "Выберите объект для перемещения"),
  })
  .superRefine(({ fromObjectId, toObjectId }, ctx) => {
    if (fromObjectId === toObjectId) {
      ctx.addIssue({
        code: "custom",
        path: ["toObjectId"],
        message: "Нельзя переместить на тот же объект",
      });
    }
  });

type FormData = z.infer<typeof transferSchema>;

export function DeviceTransfer({ device }: DeviceTransferProps) {
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });
  const { closeSheet } = useDeviceSheetStore();

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      fromObjectId: device.objectId,
      toObjectId: "",
    },
    resolver: zodResolver(transferSchema),
  });

  const selectedToObjectId = watch("toObjectId");
  const { mutate: transferDevice, isPending } = useTransferDevice(device.id);

  const onSubmit = (data: FormData) => {
    transferDevice(
      { objectId: data.toObjectId },
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
      <p className="text-center font-medium text-xl mt-5">Перемещение</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex justify-between mt-10">
          <div className="flex flex-col gap-2">
            <Label>С какого склада</Label>
            <ObjectSelectForForms
              className="w-[300px]"
              disabled
              selectedObjectId={device.objectId}
              onSelectChange={(id) => {
                if (id !== null) {
                  setValue("toObjectId", id);
                }
              }}
              objects={objects}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>На какой склад *</Label>
            <ObjectSelectForForms
              className="w-[300px]"
              selectedObjectId={selectedToObjectId}
              onSelectChange={(id) => id && setValue("toObjectId", id)}
              objects={objects.filter((o: Object) => o.id !== device.objectId)}
              disabled={isPending}
            />
            {errors.toObjectId && (
              <p className="text-sm text-red-500">
                {errors.toObjectId.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <Button type="submit" className="w-[300px]" disabled={isPending}>
            {isPending ? "Перемещаем..." : "Переместить"}
          </Button>
        </div>
      </form>
    </div>
  );
}
