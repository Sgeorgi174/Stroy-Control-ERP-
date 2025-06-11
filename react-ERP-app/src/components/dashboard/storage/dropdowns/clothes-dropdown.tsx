import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useClothesSheetStore } from "@/stores/clothes-sheet-store";
import type { Clothes } from "@/types/clothes";
import { useState } from "react";
import toast from "react-hot-toast";
import { AlertDialogDelete } from "../../alert-dialog-delete";

export function ClothesDropdown({ clothes }: { clothes: Clothes }) {
  const { openSheet } = useClothesSheetStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      // Здесь будет логика удаления
      // Например: await api.delete(`/tools/${tool.id}`);
      toast.success(`Инструмент "${clothes.name}" успешно удален`);
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
          <DropdownMenuItem onClick={() => openSheet("details", clothes)}>
            Подробнее
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openSheet("edit", clothes)}>
            Редактировать
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openSheet("transfer", clothes)}>
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
        item={clothes}
      />
    </>
  );
}
