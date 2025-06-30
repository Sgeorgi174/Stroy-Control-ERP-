import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useClothesSheetStore } from "@/stores/clothes-sheet-store";
import type { Clothes } from "@/types/clothes";
import { useState } from "react";
import { AlertDialogDelete } from "../../alert-dialog-delete";
import { useDeleteClothes } from "@/hooks/clothes/useClothes";

export function ClothesDropdown({ clothes }: { clothes: Clothes }) {
  const { openSheet } = useClothesSheetStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteMutation = useDeleteClothes();

  const handleDelete = async () => {
    deleteMutation.mutate(clothes.id, {
      onSettled: () => setIsDeleteDialogOpen(false),
    });
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
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={clothes.quantity === 0}
            onClick={() => openSheet("give", clothes)}
          >
            Выдать сотруднику
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => openSheet("edit", clothes)}>
            Редактировать
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={clothes.quantity === 0}
            onClick={() => openSheet("transfer", clothes)}
          >
            Переместить
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openSheet("add", clothes)}>
            Пополнить
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={clothes.quantity === 0}
            onClick={() => openSheet("written_off", clothes)}
          >
            Списать
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            variant="destructive"
          >
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogDelete
        isLoading={deleteMutation.isPending}
        isDeleteDialogOpen={isDeleteDialogOpen}
        handleDelete={handleDelete}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        item={clothes}
      />
    </>
  );
}
