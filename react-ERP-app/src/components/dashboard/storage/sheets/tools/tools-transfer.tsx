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

type ToolsTransferProps = { tool: Tool };
const transferSchema = z
  .object({
    fromObjectId: z.string().nullable().optional(),
    toObjectId: z.string().min(1, "Выберите объект для перемещения"),
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
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      fromObjectId: "",
      toObjectId: "",
    },
  });

  const selectedToObjectId = watch("toObjectId");

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
      <ToolsDetailsBox tool={tool} />

      <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
      <p className="text-center font-medium text-xl mt-5">Перемещение</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 m-auto w-[700px]"
      >
        <div className="flex justify-between mt-10">
          <div className="flex flex-col gap-2">
            <Label>С какого объекта</Label>
            <ObjectSelectForForms
              className="w-[300px]"
              disabled
              selectedObjectId={tool.objectId ?? ""}
              onSelectChange={(id) => setValue("fromObjectId", id)}
              objects={objects}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>На какой объект *</Label>
            <ObjectSelectForForms
              className="w-[300px]"
              selectedObjectId={selectedToObjectId}
              onSelectChange={(id) => id && setValue("toObjectId", id)}
              objects={objects.filter(
                (object: Object) => object.id !== tool.objectId
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
            disabled={transferToolMutation.isPending}
          >
            {transferToolMutation.isPending ? "Перемещаем..." : "Переместить"}
          </Button>
        </div>
      </form>
    </div>
  );
}
