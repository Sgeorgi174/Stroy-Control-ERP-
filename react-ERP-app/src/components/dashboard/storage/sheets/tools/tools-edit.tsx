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
import { BrandSelectForForms } from "@/components/dashboard/select-tool-brand";

const toolSchema = z
  .object({
    name: z.string().min(1, "Это поле обязательно"),
    brandId: z.string().optional(),
    objectId: z.string().min(1, "Выберите объект"),
    isBulk: z.boolean().default(false),
    serialNumber: z.string().optional(),
    originalSerial: z.string().optional(),
    description: z.string().optional(),
    quantity: z.number().optional(),
    marketUrl: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      !data.isBulk &&
      (!data.serialNumber || data.serialNumber.trim().length === 0)
    ) {
      ctx.addIssue({
        path: ["serialNumber"],
        message: "Инвентарный № обязателен",
        code: z.ZodIssueCode.custom,
      });
    }
  });

type FormData = z.infer<typeof toolSchema>;

export function ToolsEdit({ tool }: { tool: Tool }) {
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });
  const updateTool = useUpdateTool(tool.id);
  const { closeSheet } = useToolsSheetStore();

  const { register, handleSubmit, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(toolSchema) as unknown as Resolver<FormData>,
    defaultValues: {
      name: tool.name,
      brandId: tool.brandId ?? "",
      serialNumber: tool.serialNumber ?? "",
      objectId: tool.objectId,
      isBulk: tool.isBulk,
      quantity: tool.quantity,
      description: tool.description ?? "",
      originalSerial: tool.originalSerial ?? "",
      marketUrl: tool.marketUrl ?? "",
    },
  });

  const selectedObjectId = watch("objectId");
  const selectedBrandId = watch("brandId");

  const onSubmit = (data: FormData) => {
    updateTool.mutate(
      {
        ...data,
        brandId: data.brandId || undefined,
        status: tool.status,
        ...(tool.isBulk
          ? { quantity: data.quantity }
          : { serialNumber: data.serialNumber?.trim() }),
      },
      {
        onSuccess: () => closeSheet(),
      },
    );
  };

  return (
    <div className="p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="name">Наименование *</Label>
          <Input id="name" {...register("name")} />
        </div>

        <div className="flex flex-col gap-2 w-[400px]">
          <Label>Марка (Бренд)</Label>
          <BrandSelectForForms
            selectedBrandId={selectedBrandId}
            onSelectChange={(id) => setValue("brandId", id)}
          />
        </div>

        {!tool.isBulk ? (
          <>
            <div className="flex flex-col gap-2 w-[400px]">
              <Label htmlFor="serialNumber">Инвентарный № *</Label>
              <Input id="serialNumber" {...register("serialNumber")} />
            </div>
            <div className="flex flex-col gap-2 w-[400px]">
              <Label htmlFor="originalSerial">Серийный №</Label>
              <Input id="originalSerial" {...register("originalSerial")} />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2 w-[400px]">
            <Label htmlFor="quantity">Количество</Label>
            <Input
              id="quantity"
              type="number"
              disabled
              {...register("quantity")}
            />
          </div>
        )}

        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="description">Описание</Label>
          <Input id="description" {...register("description")} />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Место хранения *</Label>
          <ObjectSelectForForms
            selectedObjectId={selectedObjectId}
            onSelectChange={(id) => id && setValue("objectId", id)}
            objects={objects}
          />
        </div>

        <div className="flex justify-center mt-10">
          <Button
            type="submit"
            className="w-[300px]"
            disabled={updateTool.isPending}
          >
            Обновить инструмент
          </Button>
        </div>
      </form>
    </div>
  );
}
