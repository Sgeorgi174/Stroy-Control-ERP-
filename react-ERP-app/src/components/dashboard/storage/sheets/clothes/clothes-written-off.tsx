import type { Clothes } from "@/types/clothes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClothesSheetStore } from "@/stores/clothes-sheet-store";
import { useWriteOffClothes } from "@/hooks/clothes/useClothes";
import { useObjects } from "@/hooks/object/useObject";
import { ClothesDetailsBox } from "./clothes-details-box";
import { Textarea } from "@/components/ui/textarea";

type ClothesWrittenOffProps = { clothes: Clothes };

export function ClothesWrittenOff({ clothes }: ClothesWrittenOffProps) {
  const { closeSheet } = useClothesSheetStore();
  const writeOffClothesMutation = useWriteOffClothes(clothes.id);
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  const formSchema = z.object({
    fromObjectId: z.string(),
    writeOffComment: z.string().min(1, { message: "Комментарий обязателен" }),
    quantity: z
      .number({ invalid_type_error: "Введите количество" })
      .min(1, { message: "Количество должно быть больше 0" })
      .max(clothes.quantity, {
        message: `Максимум ${clothes.quantity}`,
      }),
  });

  type FormData = z.infer<typeof formSchema>;

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromObjectId: clothes.objectId,
      quantity: undefined,
      writeOffComment: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await writeOffClothesMutation.mutateAsync({
        quantity: Number(data.quantity),
        writeOffComment: data.writeOffComment,
      });

      reset();
      closeSheet();
    } catch (error) {
      console.error("Ошибка при списании одежды:", error);
    }
  };

  return (
    <div className="p-5 flex flex-col gap-1">
      <ClothesDetailsBox clothes={clothes} />

      <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />

      <p className="text-center font-medium text-xl mt-5">Списание</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex justify-between mt-10">
          <div className="flex flex-col gap-2">
            <Label>Количество *</Label>
            <Input
              className="w-[300px]"
              id="quantity"
              type="number"
              {...register("quantity", { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label>С какого склада</Label>
            <ObjectSelectForForms
              className="w-[300px]"
              disabled
              selectedObjectId={clothes.objectId}
              onSelectChange={(id) => {
                if (id !== null) {
                  setValue("fromObjectId", id);
                }
              }}
              objects={objects}
            />
          </div>
        </div>
        <div className="flex flex-col w-[400px] gap-2">
          <Label>Комментарий</Label>
          <Textarea
            placeholder="Укажите причину списания"
            className="resize-none"
            {...register("writeOffComment")}
          />
          {errors.writeOffComment && (
            <p className="text-sm text-red-500">
              {errors.writeOffComment.message}
            </p>
          )}
        </div>
        <div className="flex justify-center mt-10">
          <Button
            type="submit"
            className="w-[200px]"
            disabled={writeOffClothesMutation.isPending}
          >
            {writeOffClothesMutation.isPending ? "Списание..." : "Списать"}
          </Button>
        </div>
      </form>
    </div>
  );
}
