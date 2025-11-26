import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Resolver } from "react-hook-form";
import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";
import { useForm } from "react-hook-form";
import { useObjects } from "@/hooks/object/useObject";
import type { Tool } from "@/types/tool";
import { useUpdateTool } from "@/hooks/tool/useUpdateTool";
import { useEffect } from "react";

// ✅ Единая схема, которая учитывает оба варианта (штучный / групповой)
const toolSchema = z
  .object({
    name: z.string().min(1, "Это поле обязательно"),
    objectId: z.string().min(1, "Выберите объект"),
    isBulk: z.boolean().default(false),
    serialNumber: z.string().optional(),
    originalSerial: z.string().optional(),
    description: z.string().optional(),
    quantity: z.number({ message: "Количество обязательно" }).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isBulk) {
      if (!data.quantity || data.quantity < 1) {
        ctx.addIssue({
          path: ["quantity"],
          message: "Введите количество (минимум 1)",
          code: z.ZodIssueCode.custom,
        });
      }
    } else {
      if (!data.serialNumber || data.serialNumber.trim().length === 0) {
        ctx.addIssue({
          path: ["serialNumber"],
          message: "Инвентарный номер обязателен",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

type FormData = z.infer<typeof toolSchema>;

type ToolEditProps = {
  tool: Tool;
};

export function ToolsEdit({ tool }: ToolEditProps) {
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  const updateTool = useUpdateTool(tool.id);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(toolSchema) as unknown as Resolver<FormData>, // ✅ фикс ошибки типов
    defaultValues: {
      name: tool.name,
      serialNumber: tool.serialNumber ?? "",
      objectId: tool.objectId,
      isBulk: tool.isBulk,
      quantity: tool.quantity ?? undefined,
      description: tool.description ?? "",
      originalSerial: tool.originalSerial ?? "",
    },
  });

  const isBulk = watch("isBulk");

  const { closeSheet } = useToolsSheetStore();
  const selectedObjectId = watch("objectId");

  const onSubmit = (data: FormData) => {
    const payload = {
      name: data.name.trim(),
      objectId: data.objectId,
      description: data.description,
      originalSerial: data.originalSerial,
      status: tool.status,
      isBulk: data.isBulk,
      ...(tool.isBulk
        ? { quantity: data.quantity }
        : { serialNumber: data.serialNumber?.trim() }),
    };

    updateTool.mutate(payload, {
      onSuccess: () => {
        reset();
        closeSheet();
      },
    });
  };

  useEffect(() => {
    if (isBulk) {
      // Групповой: очищаем Инвентарный номер, ставим quantity по умолчанию
      setValue("serialNumber", "");
      setValue("quantity", tool.quantity);
    } else {
      // Одиночный: очищаем quantity
      setValue("quantity", undefined);
      setValue("serialNumber", tool.serialNumber);
    }
  }, [isBulk, setValue]);

  return (
    <div className="p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Имя */}
        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="name">Наименование *</Label>
          <Input
            id="name"
            type="text"
            placeholder="Введите наименование"
            disabled={tool.isBag}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Серийник или количество */}
        {!isBulk ? (
          <>
            <div className="flex flex-col gap-2 w-[400px]">
              <Label htmlFor="serialNumber">Инвентарный № *</Label>
              <Input
                id="serialNumber"
                placeholder="Введите инвентарный номер"
                type="text"
                {...register("serialNumber")}
              />
              {errors.serialNumber && (
                <p className="text-sm text-red-500">
                  {errors.serialNumber.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 w-[400px]">
              <Label htmlFor="originalSerial">Серийный №</Label>
              <Input
                id="originalSerial"
                placeholder="Введите серийный номер"
                type="text"
                {...register("originalSerial")}
              />
              {errors.originalSerial && (
                <p className="text-sm text-red-500">
                  {errors.originalSerial.message}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2 w-[400px]">
            <Label htmlFor="quantity">Количество *</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Введите количество"
              {...register("quantity", { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity.message}</p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="description">Описание \ Детали</Label>
          <Input
            id="description"
            type="text"
            placeholder="Укажите детали или описание"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Объект */}
        <div className="flex flex-col gap-2">
          <Label>Место хранения *</Label>
          <ObjectSelectForForms
            selectedObjectId={selectedObjectId}
            onSelectChange={(id) => {
              if (id) setValue("objectId", id);
            }}
            objects={objects}
          />
          {errors.objectId && (
            <p className="text-sm text-red-500">{errors.objectId.message}</p>
          )}
        </div>

        {/* Кнопка */}
        <div className="flex justify-center mt-10">
          <Button type="submit" className="w-[300px]">
            {"Обновить инструмент"}
          </Button>
        </div>
      </form>
    </div>
  );
}
