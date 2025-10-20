import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Resolver } from "react-hook-form";
import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";
import { useForm } from "react-hook-form";
import { useObjects } from "@/hooks/object/useObject";
import { useCreateTool } from "@/hooks/tool/useCreateTool";
import { useCreateToolBag } from "@/hooks/tool/useCreateToolBag";
import { useState, useEffect } from "react";

// ✅ Единая схема, которая учитывает оба варианта (штучный / групповой)
const toolSchema = z
  .object({
    name: z.string().min(1, "Это поле обязательно"),
    objectId: z.string().min(1, "Выберите объект"),
    isBulk: z.boolean().default(false),
    serialNumber: z.string().optional(),
    quantity: z.number().optional(),
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
          message: "Серийный номер обязателен",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

type FormData = z.infer<typeof toolSchema>;

export function ToolsAdd() {
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  const createTool = useCreateTool();
  const createToolBag = useCreateToolBag();

  const [isBag, setIsBag] = useState(false);

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
      name: "",
      serialNumber: "",
      objectId: objects[0]?.id ?? "",
      isBulk: false,
      quantity: undefined,
    },
  });

  const isBulk = watch("isBulk");

  // Автоимя для сумки
  useEffect(() => {
    if (isBag) {
      setValue("name", "Сумка расключника");
    } else {
      setValue("name", "");
    }
  }, [isBag, setValue]);

  const { closeSheet } = useToolsSheetStore();
  const selectedObjectId = watch("objectId");

  const onSubmit = (data: FormData) => {
    const payload = {
      name: data.name.trim(),
      objectId: data.objectId,
      isBulk: data.isBulk,
      ...(data.isBulk
        ? { quantity: data.quantity }
        : { serialNumber: data.serialNumber?.trim() }),
    };

    const mutation = isBag ? createToolBag : createTool;

    mutation.mutate(payload, {
      onSuccess: () => {
        reset();
        closeSheet();
      },
    });
  };

  return (
    <div className="p-5">
      {/* 🔹 Переключатель типа инструмента */}
      <Tabs
        value={isBulk ? "true" : "false"}
        onValueChange={(val) => setValue("isBulk", val === "true")}
        className="mb-6 w-[400px]"
      >
        <TabsList>
          <TabsTrigger value="false">Штучный</TabsTrigger>
          <TabsTrigger value="true">Групповой</TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Чекбокс */}
        {!isBulk && (
          <div className="flex items-center gap-2">
            <Checkbox
              id="isBag"
              checked={isBag}
              onCheckedChange={(checked) => setIsBag(!!checked)}
            />
            <Label htmlFor="isBag">Создать сумку расключника</Label>
          </div>
        )}

        {/* Имя */}
        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="name">Наименование *</Label>
          <Input
            id="name"
            type="text"
            placeholder="Введите наименование"
            {...register("name")}
            readOnly={isBag}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Серийник или количество */}
        {!isBulk ? (
          <div className="flex flex-col gap-2 w-[400px]">
            <Label htmlFor="serialNumber">Серийный № *</Label>
            <Input
              id="serialNumber"
              placeholder="Введите серийный номер"
              type="text"
              {...register("serialNumber")}
            />
            {errors.serialNumber && (
              <p className="text-sm text-red-500">
                {errors.serialNumber.message}
              </p>
            )}
          </div>
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
            {isBag ? "Создать сумку" : "Добавить инструмент"}
          </Button>
        </div>
      </form>
    </div>
  );
}
