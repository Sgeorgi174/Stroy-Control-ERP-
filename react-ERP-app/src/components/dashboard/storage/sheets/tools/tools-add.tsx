import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Resolver } from "react-hook-form";
import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";
import { useForm } from "react-hook-form";
import { useObjects } from "@/hooks/object/useObject";
import { useCreateTool } from "@/hooks/tool/useCreateTool";
import { useState, useEffect } from "react";
import { useTools } from "@/hooks/tool/useTools";
import { generateInventoryNumber } from "@/lib/utils/generateInventaryNumber";
import type { Tool } from "@/types/tool";
import { SelectPreffixForInventory } from "@/components/dashboard/select-preffix-inventory";

// ✅ Единая схема, которая учитывает оба варианта (штучный / групповой)
const toolSchema = z
  .object({
    name: z.string().min(1, "Это поле обязательно"),
    objectId: z.string().min(1, "Выберите объект"),
    isBulk: z.boolean().default(false),
    serialNumber: z.string().optional(),
    description: z.string().optional(),
    quantity: z.number({ message: "Количество обязательно" }).optional(),
    originalSerial: z.string().optional(),
    marketUrl: z.string().optional(),
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

export function ToolsAdd() {
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  const { data: tools = [] } = useTools({
    isBulk: false,
    searchQuery: "",
    objectId: "all",
    status: undefined,
    includeAllStatuses: "true",
  });
  const usedNumbers = tools
    .map((tool: Tool) => tool.serialNumber)
    .filter(Boolean);

  const createTool = useCreateTool();

  const [prefix, setPrefix] = useState<string | null>(null);

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
      objectId: "",
      isBulk: false,
      quantity: undefined,
      description: "",
      originalSerial: "",
      marketUrl: "",
    },
  });

  const isBulk = watch("isBulk");

  const { closeSheet } = useToolsSheetStore();
  const selectedObjectId = watch("objectId");

  const onSubmit = (data: FormData) => {
    const payload = {
      name: data.name.trim().replace(/\s+/g, " "),
      objectId: data.objectId,
      description: data.description ? data.description.trim() : undefined,
      marketUrl: data.marketUrl ?? "",
      originalSerial: data.originalSerial
        ? data.originalSerial.trim()
        : undefined,
      isBulk: data.isBulk,
      ...(data.isBulk
        ? { quantity: data.quantity }
        : { serialNumber: data.serialNumber?.trim() }),
    };

    const mutation = createTool;

    mutation.mutate(payload, {
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
      setValue("quantity", 1);
    } else {
      // Одиночный: очищаем quantity
      setValue("quantity", undefined);
      setValue("serialNumber", "");
    }
  }, [isBulk, setValue]);

  return (
    <div className="p-5">
      {/* 🔹 Переключатель типа инструмента */}
      <Tabs
        value={isBulk ? "true" : "false"}
        onValueChange={(val) => setValue("isBulk", val === "true")}
        className="mb-6 w-[400px]"
      >
        <TabsList>
          <TabsTrigger value="false">Одиночный</TabsTrigger>
          <TabsTrigger value="true">Групповой</TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Чекбокс */}
        {/* {!isBulk && (
          <div className="flex items-center gap-2">
            <Checkbox
              id="isBag"
              checked={isBag}
              onCheckedChange={(checked) => setIsBag(!!checked)}
            />
            <Label htmlFor="isBag">Создать сумку расключника</Label>
          </div>
        )} */}

        {/* Имя */}
        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="name">Наименование *</Label>
          <Input
            id="name"
            type="text"
            placeholder="Введите наименование"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Серийник или количество */}
        {!isBulk ? (
          <>
            <div className="flex gap-2">
              <div className="flex flex-col gap-2 w-[200px]">
                <Label htmlFor="serialNumber">Инвентарный № *</Label>
                <Input
                  id="serialNumber"
                  placeholder="Инвентарный №"
                  type="text"
                  {...register("serialNumber")}
                />
                {errors.serialNumber && (
                  <p className="text-sm text-red-500">
                    {errors.serialNumber.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label>Генерация</Label>
                <SelectPreffixForInventory
                  prefix={prefix ?? ""}
                  setPrefix={setPrefix}
                  isTool={true}
                  className="w-[230px]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-transparent">Генерация</Label>
                <Button
                  type="button"
                  disabled={!prefix}
                  onClick={() => {
                    if (!prefix) return;
                    const generated = generateInventoryNumber(
                      prefix,
                      usedNumbers,
                    );
                    setValue("serialNumber", generated);
                  }}
                >
                  Сгенерировать
                </Button>
              </div>
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

        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="marketUrl">Ссылка на товар</Label>
          <Input
            id="marketUrl"
            type="text"
            placeholder="Укажите ссылку"
            {...register("marketUrl")}
          />
          {errors.marketUrl && (
            <p className="text-sm text-red-500">{errors.marketUrl.message}</p>
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
            "Добавить инструмент"
          </Button>
        </div>
      </form>
    </div>
  );
}
