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
import type { Tablet } from "@/types/tablet";
import { useTabletSheetStore } from "@/stores/tablet-sheet-store";
import { AlertDialogRelease } from "../alert-dialog-release";

type TabletDropDownProps = { tablet: Tablet };

export function TabletsDropDown({ tablet }: TabletDropDownProps) {
  const { openSheet } = useTabletSheetStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isReleaseDialogOpen, setIsReleaseDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      // Здесь будет логика удаления
      // Например: await api.delete(`/tools/${tool.id}`);
      toast.success(`Инструмент "${tablet.name}" успешно удален`);
    } catch (error) {
      toast.error("Не удалось удалить инструмент");
      console.error("Ошибка при удалении:", error);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleRelease = async () => {
    try {
      // Здесь будет логика возврата
      // Пример: await api.post(`/tablets/${tablet.id}/release`);
      toast.success(`Планшет "${tablet.name}" успешно возвращен`);
    } catch (error) {
      toast.error("Не удалось вернуть планшет");
      console.error("Ошибка при возврате:", error);
    } finally {
      setIsReleaseDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => openSheet("details", tablet)}>
            Подробнее
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => openSheet("edit", tablet)}>
            Редактировать
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openSheet("change user", tablet)}>
            {tablet.employee ? "Сменить владельца" : "Выдать планшет"}
          </DropdownMenuItem>
          {tablet.employee && (
            <DropdownMenuItem onClick={() => setIsReleaseDialogOpen(true)}>
              Вернуть планшет
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => openSheet("change status", tablet)}>
            Сменить статус
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
        item={tablet}
      />

      <AlertDialogRelease
        tablet={tablet}
        isReleaseDialogOpen={isReleaseDialogOpen}
        setIsReleaseDialogOpen={setIsReleaseDialogOpen}
        handleRelease={handleRelease}
      />
    </>
  );
}
