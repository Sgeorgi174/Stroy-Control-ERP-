import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";
import type { Tool } from "@/types/tool";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useObjects } from "@/hooks/object/useObject";
import { useUpdateTool } from "@/hooks/tool/useUpdateTool";

const formSchema = z.object({
  name: z.string().min(1, "Наименование обязательно"),
  serialNumber: z.string().min(1, "Серийный номер обязателен"),
  objectId: z.string().min(1, "Место хранения обязательно"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type ToolsEditProps = {
  tool: Tool;
};

export function ToolsEdit({ tool }: ToolsEditProps) {
  const { data: objects = [] } = useObjects({
    searchQuery: "",
    status: "OPEN",
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: tool.name,
      serialNumber: tool.serialNumber,
      objectId: tool.objectId || "",
      description: tool.description || "",
    },
    resolver: zodResolver(formSchema),
  });

  const { closeSheet } = useToolsSheetStore();

  const selectedObjectId = watch("objectId");

  // Используем хук мутации
  const updateToolMutation = useUpdateTool(tool.id);

  const onSubmit = (data: FormData) => {
    updateToolMutation.mutate(
      {
        name: data.name.trim(),
        serialNumber: data.serialNumber.trim(),
        objectId: data.objectId,
        isBulk: tool.isBulk,
        description: data.description ?? "",
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
    <div className="p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="name">Наименование *</Label>
          <Input id="name" type="text" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-[400px]">
          <Label htmlFor="serialNumber">Серийный № *</Label>
          <Input id="serialNumber" type="text" {...register("serialNumber")} />
          {errors.serialNumber && (
            <p className="text-sm text-red-500">
              {errors.serialNumber.message}
            </p>
          )}
        </div>

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

        <div className="flex justify-center mt-10">
          <Button
            type="submit"
            className="w-[300px]"
            disabled={updateToolMutation.isPending}
          >
            {updateToolMutation.isPending ? "Сохраняем..." : "Сохранить"}
          </Button>
        </div>
      </form>
    </div>
  );
}
