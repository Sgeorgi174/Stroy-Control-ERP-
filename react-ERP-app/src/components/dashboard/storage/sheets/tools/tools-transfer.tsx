import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";
import type { Tool } from "@/types/tool";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useObjects } from "@/hooks/object/useObject";
import { useTransferTool } from "@/hooks/tool/useTransferTool";
import { ToolsDetailsBox } from "./tool-details-box";
import type { Object } from "@/types/object";
import { useTransferToolBulk } from "@/hooks/tool/useTransferToolBulk";
import { Input } from "@/components/ui/input";

type ToolsTransferProps = { tool: Tool };

const transferSchema = z
  .object({
    fromObjectId: z.string().nullable().optional(),
    toObjectId: z.string().min(1, "Выберите объект для перемещения"),
    quantity: z.number().min(1, "Кол-во должно быть обязательно"),
  })
  .superRefine(({ fromObjectId, toObjectId }, ctx) => {
    if (fromObjectId && fromObjectId === toObjectId) {
      ctx.addIssue({
        code: "custom",
        path: ["toObjectId"],
        message: "Нельзя переместить на тот же объект",
      });
    }
  });

type FormData = z.infer<typeof transferSchema>;

export function ToolsTransfer({ tool }: ToolsTransferProps) {
  const { closeSheet } = useToolsSheetStore();
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      fromObjectId: tool.objectId ?? "",
      toObjectId: "",
      quantity: tool.isBulk ? undefined : 1,
    },
  });

  const transferToolMutation = useTransferTool(tool.id); // solo
  const transferToolBulkMutation = useTransferToolBulk(tool.id); // bulk

  const onSubmit = (data: FormData) => {
    const { toObjectId, quantity } = data;

    // SOLO TOOL
    if (!tool.isBulk) {
      transferToolMutation.mutate(
        { objectId: toObjectId },
        {
          onSuccess: () => {
            reset();
            closeSheet();
          },
        }
      );
      return;
    }

    // BULK TOOL
    transferToolBulkMutation.mutate(
      {
        objectId: toObjectId,
        quantity: quantity,
      },
      {
        onSuccess: () => {
          reset();
          closeSheet();
        },
      }
    );
  };

  return (
    <div className="p-5 flex flex-col gap-1">
      <ToolsDetailsBox tool={tool} />

      <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
      <p className="text-center font-medium text-xl mt-5">Перемещение</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex justify-between mt-10">
          {/* FROM OBJECT */}
          <div className="flex flex-col gap-2">
            <Label>С какого склада</Label>
            <ObjectSelectForForms
              disabled
              selectedObjectId={tool.objectId}
              onSelectChange={(id) => setValue("fromObjectId", id)}
              objects={objects}
            />
          </div>

          {/* QUANTITY */}
          <div className="flex flex-col gap-2">
            <Label>Количество *</Label>
            <Input
              className="w-[200px]"
              disabled={!tool.isBulk}
              id="quantity"
              type="number"
              min={1}
              max={tool.quantity}
              {...register("quantity", { valueAsNumber: true })}
            />

            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity.message}</p>
            )}

            {!tool.isBulk && (
              <p className="text-xs text-gray-500">
                Инструмент не количественный
              </p>
            )}
          </div>

          {/* TO OBJECT */}
          <div className="flex flex-col gap-2">
            <Label>На какой склад *</Label>
            <ObjectSelectForForms
              selectedObjectId={watch("toObjectId")}
              onSelectChange={(id) => id && setValue("toObjectId", id)}
              objects={objects.filter(
                (item: Object) => item.id !== tool.objectId
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
            className="w-[300px]"
            disabled={
              transferToolMutation.isPending ||
              transferToolBulkMutation.isPending
            }
          >
            {transferToolMutation.isPending ||
            transferToolBulkMutation.isPending
              ? "Перемещаем..."
              : "Переместить"}
          </Button>
        </div>
      </form>
    </div>
  );
}
