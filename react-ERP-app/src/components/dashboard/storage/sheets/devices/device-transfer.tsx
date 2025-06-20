import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { objects } from "@/constants/objects&Users";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import type { Device } from "@/types/device";
import { useDeviceSheetStore } from "@/stores/device-sheet-store";

type DeiceTransferProps = { device: Device };

// Схема валидации
const transferSchema = z
  .object({
    fromObjectId: z.string().min(1, "Исходный объект обязателен"),
    toObjectId: z.string().min(1, "Выберите склад для перемещения"),
  })
  .superRefine(({ fromObjectId, toObjectId }, ctx) => {
    if (fromObjectId === toObjectId) {
      ctx.addIssue({
        code: "custom",
        path: ["toObjectId"],
        message: "Нельзя переместить на тот же склад",
      });
    }
  });
type FormData = z.infer<typeof transferSchema>;

const statusMap = {
  ON_OBJECT: "На объекте",
  IN_TRANSIT: "В пути",
  IN_REPAIR: "На ремонте",
  LOST: "Утерян",
  WRITTEN_OFF: "Списан",
};

export function DeviceTransfer({ device }: DeiceTransferProps) {
  const { closeSheet } = useDeviceSheetStore();

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      fromObjectId: device.storage.id,
      toObjectId: objects.find((o) => o.id !== device.storage.id)?.id ?? "",
    },
    resolver: zodResolver(transferSchema),
  });

  const selectedToObjectId = watch("toObjectId");

  const onSubmit = (data: FormData) => {
    try {
      console.log("Собранные данные:", {
        objectId: data.toObjectId,
        toolId: device.id,
      });
      reset();
      closeSheet();
      toast.success("Техника успешно перемещёна");
    } catch (error) {
      toast.error("Не удалось переместить технику");
      console.error("Ошибка:", error);
    }
  };

  return (
    <div className="p-5 flex flex-col gap-1">
      <p>
        Серийный номер:{" "}
        <span className="font-medium">{device.serialNumber}</span>
      </p>
      <p>
        Наименование: <span className="font-medium">{device.name}</span>
      </p>
      <p>
        Статус: <span className="font-medium">{statusMap[device.status]}</span>
      </p>
      <p>
        Место хранения:{" "}
        <span className="font-medium">{device.storage.name}</span>
      </p>

      <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
      <p className="text-center font-medium text-xl mt-5">Перемещение</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-center gap-52 mt-10">
          <div className="flex flex-col gap-2">
            <Label>С какого склада</Label>
            <ObjectSelectForForms
              disabled
              selectedObjectId={device.storage.id}
              onSelectChange={(id) => setValue("fromObjectId", id)}
              objects={objects}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>На какой склад *</Label>
            <ObjectSelectForForms
              selectedObjectId={selectedToObjectId}
              onSelectChange={(id) => id && setValue("toObjectId", id)}
              objects={objects.filter(
                (object) => object.id !== device.storage.id
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
          <Button type="submit" className="w-[200px]">
            Переместить
          </Button>
        </div>
      </form>
    </div>
  );
}
