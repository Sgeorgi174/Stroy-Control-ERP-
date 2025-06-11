import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";
import type { Tool } from "@/types/tool";
import { useState } from "react";
import toast from "react-hot-toast";
import { AlertDialogDelete } from "../../alert-dialog-delete";

export function ToolsDropDown({ tool }: { tool: Tool }) {
  const { openSheet } = useToolsSheetStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      // Здесь будет логика удаления
      // Например: await api.delete(`/tools/${tool.id}`);
      toast.success(`Инструмент "${tool.name}" успешно удален`);
    } catch (error) {
      toast.error("Не удалось удалить инструмент");
      console.error("Ошибка при удалении:", error);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => openSheet("details", tool)}>
            Подробнее
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openSheet("edit", tool)}>
            Редактировать
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openSheet("transfer", tool)}>
            Переместить
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogDelete
        isDeleteDialogOpen={isDeleteDialogOpen}
        handleDelete={handleDelete}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        item={tool}
      />
    </>
  );
}
