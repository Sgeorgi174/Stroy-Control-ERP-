import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { AlertDialogDelete } from "../../alert-dialog-delete";
import type { Object } from "@/types/object";
import { useObjectSheetStore } from "@/stores/objects-sheet-store";

type ObjectDropDownProps = { object: Object };

export function ObjectDropDown({ object }: ObjectDropDownProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { openSheet } = useObjectSheetStore();

  const handleDelete = async () => {
    try {
      // Здесь будет логика удаления
      // Например: await api.delete(`/tools/${tool.id}`);
      toast.success(`Инструмент "${object.name}" успешно удален`);
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
          <DropdownMenuItem onClick={() => openSheet("details", object)}>
            Подробнее
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => openSheet("edit", object)}>
            Редактировать
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openSheet("add employee", object)}>
            Добавить сотрудников
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => openSheet("close object", object)}
            variant="destructive"
          >
            Закрыть объект
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogDelete
        isDeleteDialogOpen={isDeleteDialogOpen}
        handleDelete={handleDelete}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        item={object}
      />
    </>
  );
}
