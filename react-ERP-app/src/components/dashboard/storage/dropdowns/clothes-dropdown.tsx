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
import { useAuth } from "@/hooks/auth/useAuth";

export function ClothesDropdown({ clothes }: { clothes: Clothes }) {
  const { openSheet } = useClothesSheetStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteMutation = useDeleteClothes();
  const { data: user } = useAuth();

  const handleDelete = async () => {
    deleteMutation.mutate(clothes.id, {
      onSettled: () => setIsDeleteDialogOpen(false),
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
          <button className="hover:bg-accent p-1 rounded cursor-pointer">
            <EllipsisVertical />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              openSheet("details", clothes);
            }}
          >
            Подробнее
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={
              clothes.quantity < 1 ||
              (user?.role === "FOREMAN" &&
                user?.object?.id !== clothes.objectId)
            }
            onClick={(e) => {
              e.stopPropagation();
              openSheet("give", clothes);
            }}
          >
            Выдать сотруднику
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={user?.role === "FOREMAN"}
            onClick={(e) => {
              e.stopPropagation();
              openSheet("edit", clothes);
            }}
          >
            Редактировать
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              clothes.quantity < 1 ||
              (user?.role === "FOREMAN" &&
                user?.object?.id !== clothes.objectId)
            }
            onClick={(e) => {
              e.stopPropagation();
              openSheet("transfer", clothes);
            }}
          >
            Переместить
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={user?.role === "FOREMAN"}
            onClick={(e) => {
              e.stopPropagation();
              openSheet("add", clothes);
            }}
          >
            Пополнить
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={clothes.quantity < 1 || user?.role === "FOREMAN"}
            onClick={(e) => {
              e.stopPropagation();
              openSheet("written_off", clothes);
            }}
          >
            Списать
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={user?.role === "FOREMAN"}
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
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
