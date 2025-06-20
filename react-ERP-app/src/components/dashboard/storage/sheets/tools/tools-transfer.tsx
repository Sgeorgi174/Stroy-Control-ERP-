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

type ToolsTransferProps = { tool: Tool };

const transferSchema = z
  .object({
    fromObjectId: z.string().min(1, "Исходный объект обязателен"),
    toObjectId: z.string().min(1, "Выберите склад для перемещения"),
  })
  .superRefine(({ fromObjectId, toObjectId }, ctx) => {
    if (fromObjectId === toObjectId) {
      ctx.addIssue({
        code: "custom",
        path: ["toObjectId"],
        message: "Нельзя переместить на тот же склад",
      });
    }
  });
type FormData = z.infer<typeof transferSchema>;

export function ToolsTransfer({ tool }: ToolsTransferProps) {
  const { closeSheet } = useToolsSheetStore();
  const { data: objects = [] } = useObjects();

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      fromObjectId: tool.objectId,
      toObjectId: objects.find((o) => o.id !== tool.objectId)?.id ?? "",
    },
    resolver: zodResolver(transferSchema),
  });

  const selectedToObjectId = watch("toObjectId");

  // Используем хук мутации
  const transferToolMutation = useTransferTool(tool.id);

  const onSubmit = (data: FormData) => {
    transferToolMutation.mutate(
      { objectId: data.toObjectId },
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
      <p>
        Серийный номер: <span className="font-medium">{tool.serialNumber}</span>
      </p>
      <p>
        Наименование: <span className="font-medium">{tool.name}</span>
      </p>
      <p>
        Статус:{" "}
        <span className="font-medium">
          {tool.status === "ON_OBJECT" ? "На объекте" : "В пути"}
        </span>
      </p>
      <p>
        Место хранения: <span className="font-medium">{tool.storage.name}</span>
      </p>

      <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
      <p className="text-center font-medium text-xl mt-5">Перемещение</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-center gap-52 mt-10">
          <div className="flex flex-col gap-2">
            <Label>С какого склада</Label>
            <ObjectSelectForForms
              disabled
              selectedObjectId={tool.objectId}
              onSelectChange={(id) => setValue("fromObjectId", id)}
              objects={objects}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>На какой склад *</Label>
            <ObjectSelectForForms
              selectedObjectId={selectedToObjectId}
              onSelectChange={(id) => id && setValue("toObjectId", id)}
              objects={objects.filter((object) => object.id !== tool.objectId)}
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
            disabled={transferToolMutation.isPending}
          >
            {transferToolMutation.isPending ? "Перемещаем..." : "Переместить"}
          </Button>
        </div>
      </form>
    </div>
  );
}
