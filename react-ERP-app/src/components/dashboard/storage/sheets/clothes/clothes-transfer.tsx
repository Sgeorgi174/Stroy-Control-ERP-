import type { Clothes } from "@/types/clothes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClothesSheetStore } from "@/stores/clothes-sheet-store";
import { useTransferClothes } from "@/hooks/clothes/useClothes";
import { useObjects } from "@/hooks/object/useObject";
import type { Object } from "@/types/object";

type ClothesTransferProps = { clothes: Clothes };

export function ClothesTransfer({ clothes }: ClothesTransferProps) {
  const { closeSheet } = useClothesSheetStore();
  const transferClothesMutation = useTransferClothes(clothes.id);
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  const formSchema = z.object({
    fromObjectId: z.string(),
    toObjectId: z.string().refine((val) => val !== clothes.objectId, {
      message: "Нельзя выбрать тот же склад",
    }),
    quantity: z
      .number({ invalid_type_error: "Введите число" })
      .min(1, { message: "Минимум 1" })
      .max(clothes.quantity, {
        message: `Максимум ${clothes.quantity}`,
      }),
  });

  type FormData = z.infer<typeof formSchema>;

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromObjectId: clothes.objectId,
      toObjectId:
        objects[0].id === clothes.objectId ? objects[1].id : objects[0].id,
      quantity: 1,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await transferClothesMutation.mutateAsync({
        toObjectId: data.toObjectId,
        quantity: data.quantity,
      });

      reset();
      closeSheet();
    } catch (error) {
      console.error("Ошибка при перемещении:", error);
    }
  };

  return (
    <div className="p-5 flex flex-col gap-1">
      <p>
        Наименование: <span className="font-medium">{clothes.name}</span>
      </p>
      <p>
        Размер: <span className="font-medium">{clothes.size}</span>
      </p>
      <p>
        Сезон:{" "}
        <span className="font-medium">
          {clothes.season === "SUMMER" ? "Лето" : "Зима"}
        </span>
      </p>
      <p>
        Количество: <span className="font-medium">{clothes.quantity}</span>
      </p>
      <p>
        В пути: <span className="font-medium">{clothes.inTransit}</span>
      </p>
      <p>
        Место хранения:{" "}
        <span className="font-medium">{clothes.storage.name}</span>
      </p>

      <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />

      <p className="text-center font-medium text-xl mt-5">Перемещение</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between mt-10 px-10">
          <div className="flex flex-col gap-2">
            <Label>Количество *</Label>
            <Input
              className="w-[90px]"
              id="quantity"
              type="number"
              min="1"
              max={clothes.quantity}
              {...register("quantity", { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>С какого склада</Label>
            <ObjectSelectForForms
              disabled
              selectedObjectId={clothes.objectId}
              onSelectChange={(id) => setValue("fromObjectId", id)}
              objects={objects}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>На какой склад *</Label>
            <ObjectSelectForForms
              selectedObjectId={watch("toObjectId")}
              onSelectChange={(id) => setValue("toObjectId", id)}
              objects={objects.filter(
                (item: Object) => item.id !== clothes.objectId
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
          <Button
            type="submit"
            className="w-[200px]"
            disabled={transferClothesMutation.isPending}
          >
            {transferClothesMutation.isPending
              ? "Перемещение..."
              : "Переместить"}
          </Button>
        </div>
      </form>
    </div>
  );
}
