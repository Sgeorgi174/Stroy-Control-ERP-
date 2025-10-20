import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";
import type { Tool } from "@/types/tool";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useObjects } from "@/hooks/object/useObject";
import { ToolsDetailsBox } from "./tool-details-box";
import { Input } from "@/components/ui/input";
import { useAddQuantityTool } from "@/hooks/tool/useAddQuantityTool";

type ToolsTransferProps = { tool: Tool };
const formSchema = z.object({
  fromObjectId: z.string().nullable(),
  quantity: z
    .number({ invalid_type_error: "Введите количество" })
    .min(1, { message: "Количество должно быть больше 0" }),
});

type FormData = z.infer<typeof formSchema>;

export function ToolAddQuantity({ tool }: ToolsTransferProps) {
  const { closeSheet } = useToolsSheetStore();
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  const {
    handleSubmit,
    setValue,
    reset,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromObjectId: tool.objectId,
      quantity: undefined,
    },
  });

  const addToolMutation = useAddQuantityTool(tool.id);

  const onSubmit = (data: FormData) => {
    addToolMutation.mutate(
      { quantity: data.quantity },
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
      <p className="text-center font-medium text-xl mt-5">Пополнение</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex justify-between mt-10">
          <div className="flex flex-col gap-2">
            <Label>Пополняемый склад</Label>
            <ObjectSelectForForms
              className="w-[300px]"
              disabled
              selectedObjectId={tool.objectId ?? ""}
              onSelectChange={(id) => setValue("fromObjectId", id)}
              objects={objects}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Количество *</Label>
            <Input
              className="w-[300px]"
              id="quantity"
              type="number"
              min="1"
              {...register("quantity", { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <Button
            type="submit"
            className="w-[300px]"
            disabled={addToolMutation.isPending}
          >
            {addToolMutation.isPending ? "Пополняем..." : "Пополнить"}
          </Button>
        </div>
      </form>
    </div>
  );
}
