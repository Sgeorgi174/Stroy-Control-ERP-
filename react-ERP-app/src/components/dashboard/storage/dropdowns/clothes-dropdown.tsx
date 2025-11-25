import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useClothesSheetStore } from "@/stores/clothes-sheet-store";
import type { Clothes } from "@/types/clothes";
import { useState } from "react";
import { AlertDialogDelete } from "../../alert-dialog-delete";
import { useDeleteClothes } from "@/hooks/clothes/useClothes";
import { useAuth } from "@/hooks/auth/useAuth";

export function ClothesDropdown({
  clothes,
  setColor,
  resetColor,
}: {
  clothes: Clothes;
  setColor: (id: string, color: string) => void;
  resetColor: (id: string) => void;
}) {
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
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Задать цвет</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(clothes.id, "table-red"); // пастельный красный
                }}
              >
                <div className="w-[100px] h-[18px] bg-table-red"></div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(clothes.id, "table-orange"); // пастельный жёлтый
                }}
              >
                <div className="w-[100px] h-[18px] bg-table-orange"></div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(clothes.id, "table-blue"); // пастельный голубой
                }}
              >
                <div className="w-[100px] h-[18px] bg-table-blue"></div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(clothes.id, "table-purple"); // пастельный сиреневый
                }}
              >
                <div className="w-[100px] h-[18px] bg-table-purple"></div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(clothes.id, "table-green"); // пастельный зелёный
                }}
              >
                <div className="w-[100px] h-[18px] bg-table-green"></div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  resetColor(clothes.id);
                }}
              >
                Сбросить цвет
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
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
