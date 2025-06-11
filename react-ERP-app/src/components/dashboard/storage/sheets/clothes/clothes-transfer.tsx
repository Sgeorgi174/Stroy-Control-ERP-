import type { Clothes } from "@/types/clothes";
import { useForm } from "react-hook-form";
import { objects } from "@/constants/objects";
import toast from "react-hot-toast";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClothesSheetStore } from "@/stores/clothes-sheet-store";

type ClothesEditProps = { clothes: Clothes };

type FormData = {
  toObjectId: string | null;
  fromObjectId: string | null;
  quantity: number | null;
};

export function ClothesTransfer({ clothes }: ClothesEditProps) {
  const { closeSheet } = useClothesSheetStore();

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    register,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      fromObjectId: clothes.objectId,
      toObjectId: objects[0].id,
      quantity: null,
    },
  });

  const selectedtoObjectId = watch("toObjectId");

  const onSubmit = (data: FormData) => {
    try {
      console.log("Собранные данные:", {
        objectId: data.toObjectId,
        clotheId: clothes.id,
        quantity: data.quantity,
      });
      reset();
      closeSheet();
      toast.success(`Успешно перемещен комплект одежды`);
    } catch (error) {
      toast.error("Не удалось переместить комплект одежды");
      console.error("Ошибка:", error);
    }
  };

  return (
    <>
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
                {...register("quantity", {
                  required: "Это поле обязательно",
                  min: {
                    value: 1,
                    message: "Количество должно быть больше 0",
                  },
                  max: {
                    value: clothes.quantity,
                    message: `Превышает доступное количество (максимум ${clothes.quantity})`,
                  },
                  valueAsNumber: true,
                })}
              />
              {errors.quantity && (
                <p className="text-sm text-red-500">
                  {errors.quantity.message}
                </p>
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
                selectedObjectId={selectedtoObjectId}
                onSelectChange={(id) => setValue("toObjectId", id)}
                objects={objects.filter(
                  (object) => object.id !== clothes.objectId
                )}
              />
            </div>
          </div>
          <div className="flex justify-center mt-15">
            <Button
              type="submit"
              className="w-[200px]"
              disabled={!!errors.quantity}
            >
              Переместить
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
