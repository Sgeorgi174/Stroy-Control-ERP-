import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";
import type { Tool } from "@/types/tool";
import { useState } from "react";
import { AlertDialogDelete } from "../../alert-dialog-delete";
import { useDeleteTool } from "@/hooks/tool/useDeleteTool";

type ToolDropDownProps = { tool: Tool };

export function ToolsDropDown({ tool }: ToolDropDownProps) {
  const { openSheet } = useToolsSheetStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteMutation = useDeleteTool();

  const handleDelete = async () => {
    deleteMutation.mutate(tool.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
      onError: () => {
        setIsDeleteDialogOpen(false); // Закрываем даже при ошибке
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        {/* Останавливаем всплытие клика на триггере */}
        <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
          <button className="hover:bg-accent p-1 rounded cursor-pointer">
            <EllipsisVertical />
          </button>
        </DropdownMenuTrigger>

        {/* Останавливаем всплытие клика внутри контента */}
        <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              openSheet("details", tool);
            }}
          >
            Подробнее
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              openSheet("edit", tool);
            }}
          >
            Редактировать
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={tool.status !== "ON_OBJECT"}
            onClick={(e) => {
              e.stopPropagation();
              openSheet("transfer", tool);
            }}
          >
            Переместить
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={
              tool.status === "IN_TRANSIT" ||
              tool.status === "LOST" ||
              tool.status === "WRITTEN_OFF"
            }
            onClick={(e) => {
              e.stopPropagation();
              openSheet("change status", tool);
            }}
          >
            Сменить статус
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
          >
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogDelete
        isDeleteDialogOpen={isDeleteDialogOpen}
        handleDelete={handleDelete}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        item={tool}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
