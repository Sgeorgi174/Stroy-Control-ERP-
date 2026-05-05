import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Resolver } from "react-hook-form";
import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { SelectPreffixForInventory } from "@/components/dashboard/select-preffix-inventory";
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
import { BrandSelectForForms } from "@/components/dashboard/select-tool-brand";

const toolSchema = z
  .object({
    name: z.string().min(1, "Это поле обязательно"),
    brandId: z.string().optional(),
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
    includeAllStatuses: "true",
  });
  const usedNumbers = tools
    .map((tool: Tool) => tool.serialNumber)
    .filter(Boolean);
  const createTool = useCreateTool();
  const [prefix, setPrefix] = useState<string | null>(null);
  const { closeSheet } = useToolsSheetStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(toolSchema) as unknown as Resolver<FormData>,
    defaultValues: {
      name: "",
      brandId: "",
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
  const selectedObjectId = watch("objectId");
  const selectedBrandId = watch("brandId");

  const onSubmit = (data: FormData) => {
    const payload = {
      ...data,
      name: data.name.trim().replace(/\s+/g, " "),
      brandId: data.brandId || undefined,
      description: data.description?.trim() || undefined,
      originalSerial: data.originalSerial?.trim() || undefined,
      ...(data.isBulk
        ? { quantity: data.quantity }
        : { serialNumber: data.serialNumber?.trim() }),
    };

    createTool.mutate(payload, {
      onSuccess: () => {
        reset();
        closeSheet();
      },
    });
  };

  useEffect(() => {
    setValue("serialNumber", "");
    setValue("quantity", isBulk ? 1 : undefined);
  }, [isBulk, setValue]);

  return (
    <div className="p-5">
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
        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="name">Наименование *</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Введите наименование"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-[400px]">
          <Label>Марка (Бренд)</Label>
          <BrandSelectForForms
            selectedBrandId={selectedBrandId}
            onSelectChange={(id) => setValue("brandId", id)}
          />
        </div>

        {!isBulk ? (
          <>
            <div className="flex gap-2">
              <div className="flex flex-col gap-2 w-[200px]">
                <Label htmlFor="serialNumber">Инвентарный № *</Label>
                <Input
                  id="serialNumber"
                  {...register("serialNumber")}
                  placeholder="Инвентарный №"
                />
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
              <div className="flex flex-col gap-2 pt-8">
                <Button
                  type="button"
                  disabled={!prefix}
                  onClick={() =>
                    setValue(
                      "serialNumber",
                      generateInventoryNumber(prefix!, usedNumbers),
                    )
                  }
                >
                  Сгенерировать
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-[400px]">
              <Label htmlFor="originalSerial">Серийный №</Label>
              <Input
                id="originalSerial"
                {...register("originalSerial")}
                placeholder="Заводской номер"
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2 w-[400px]">
            <Label htmlFor="quantity">Количество *</Label>
            <Input
              id="quantity"
              type="number"
              {...register("quantity", { valueAsNumber: true })}
            />
          </div>
        )}

        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="description">Описание</Label>
          <Input
            id="description"
            {...register("description")}
            placeholder="Детали..."
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Место хранения *</Label>
          <ObjectSelectForForms
            selectedObjectId={selectedObjectId}
            onSelectChange={(id) => id && setValue("objectId", id)}
            objects={objects}
          />
        </div>

        <div className="flex justify-center mt-6">
          <Button
            type="submit"
            className="w-[300px]"
            disabled={createTool.isPending}
          >
            Добавить инструмент
          </Button>
        </div>
      </form>
    </div>
  );
}
