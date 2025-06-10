import { ObjectSelectForForms } from "@/components/dashboard/select-object-for-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { objects } from "@/constants/objects";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";
import type { Tool } from "@/types/tool";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type ToolsEditProps = { tool: Tool };

type FormData = {
  toObjectId: string | null;
  fromObjectId: string | null;
};

export function ToolsTransfer({ tool }: ToolsEditProps) {
  const { closeSheet } = useToolsSheetStore();

  const { handleSubmit, setValue, watch, reset } = useForm<FormData>({
    defaultValues: {
      fromObjectId: tool.objectId,
      toObjectId: objects[0].id,
    },
  });

  const selectedtoObjectId = watch("toObjectId");

  const onSubmit = (data: FormData) => {
    try {
      console.log("Собранные данные:", {
        objectId: data.toObjectId,
        toolId: tool.id,
      });
      reset();
      closeSheet();
      toast.success(`Успешно перемещен инструмент`);
    } catch (error) {
      toast.error("Не удалось создать инструмент");
      console.error("Ошибка:", error);
    }
  };

  return (
    <>
      <div className="p-5 flex flex-col gap-1">
        <p>
          Серийный номер:{" "}
          <span className="font-medium">{tool.serialNumber}</span>
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
          Место хранения:{" "}
          <span className="font-medium">{tool.storage.name}</span>
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
                selectedObjectId={selectedtoObjectId}
                onSelectChange={(id) => setValue("toObjectId", id)}
                objects={objects.filter(
                  (object) => object.id !== tool.objectId
                )}
              />
            </div>
          </div>
          <div className="flex justify-center mt-15">
            <Button type="submit" className="w-[200px]">
              Переместить
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
