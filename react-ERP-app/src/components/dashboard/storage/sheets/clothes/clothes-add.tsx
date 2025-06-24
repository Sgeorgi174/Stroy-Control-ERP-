import type { Clothes } from "@/types/clothes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClothesSheetStore } from "@/stores/clothes-sheet-store";
import { useAddClothes } from "@/hooks/clothes/useClothes";
import { useObjects } from "@/hooks/object/useObject";

type ClothesAddProps = { clothes: Clothes };

export function ClothesAdd({ clothes }: ClothesAddProps) {
  const { closeSheet } = useClothesSheetStore();
  const addClothesMutation = useAddClothes(clothes.id);
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  const formSchema = z.object({
    fromObjectId: z.string(),
    quantity: z
      .number({ invalid_type_error: "Введите число" })
      .min(1, { message: "Количество должно быть больше 0" }),
  });

  type FormData = z.infer<typeof formSchema>;

  const {
    handleSubmit,
    setValue,
    reset,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromObjectId: clothes.objectId,
      quantity: 1,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await addClothesMutation.mutateAsync({
        quantity: data.quantity,
      });

      reset();
      closeSheet();
    } catch (error) {
      console.error("Ошибка при добавлении одежды:", error);
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

      <p className="text-center font-medium text-xl mt-5">Пополнение</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-center gap-52 mt-10 px-10">
          <div className="flex flex-col gap-2">
            <Label>Количество *</Label>
            <Input
              className="w-[150px]"
              id="quantity"
              type="number"
              min="1"
              {...register("quantity", { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Пополняемый склад</Label>
            <ObjectSelectForForms
              disabled
              selectedObjectId={clothes.objectId}
              onSelectChange={(id) => setValue("fromObjectId", id)}
              objects={objects}
            />
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <Button
            type="submit"
            className="w-[200px]"
            disabled={addClothesMutation.isPending}
          >
            {addClothesMutation.isPending ? "Пополнение..." : "Пополнить"}
          </Button>
        </div>
      </form>
    </div>
  );
}
