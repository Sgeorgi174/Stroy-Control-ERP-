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
import { useState } from "react";
import type { Tablet } from "@/types/tablet";
import { useTabletSheetStore } from "@/stores/tablet-sheet-store";
import { AlertDialogDelete } from "../../alert-dialog-delete";
import { AlertDialogRelease } from "../alert-dialog-release";
import { useDeleteTablet } from "@/hooks/tablet/useDeleteTablet";
import { useReleaseTablet } from "@/hooks/tablet/useReleaseTablet";
import { useAuth } from "@/hooks/auth/useAuth";

type TabletDropDownProps = {
  tablet: Tablet;
  setColor: (id: string, color: string) => void;
  resetColor: (id: string) => void;
};

export function TabletsDropDown({
  tablet,
  setColor,
  resetColor,
}: TabletDropDownProps) {
  const { openSheet } = useTabletSheetStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isReleaseDialogOpen, setIsReleaseDialogOpen] = useState(false);

  const deleteMutation = useDeleteTablet();
  const releaseMutation = useReleaseTablet();
  const { data: user } = useAuth();

  const handleDelete = () => {
    deleteMutation.mutate(tablet.id, {
      onSuccess: () => setIsDeleteDialogOpen(false),
      onError: () => setIsDeleteDialogOpen(false),
    });
  };

  const handleRelease = () => {
    releaseMutation.mutate(tablet.id, {
      onSuccess: () => setIsReleaseDialogOpen(false),
      onError: () => setIsReleaseDialogOpen(false),
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
              openSheet("details", tablet);
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
                  setColor(tablet.id, "table-red"); // пастельный красный
                }}
              >
                <div className="w-[100px] h-[18px] bg-table-red"></div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(tablet.id, "table-orange"); // пастельный жёлтый
                }}
              >
                <div className="w-[100px] h-[18px] bg-table-orange"></div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(tablet.id, "table-blue"); // пастельный голубой
                }}
              >
                <div className="w-[100px] h-[18px] bg-table-blue"></div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(tablet.id, "table-purple"); // пастельный сиреневый
                }}
              >
                <div className="w-[100px] h-[18px] bg-table-purple"></div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(tablet.id, "table-green"); // пастельный зелёный
                }}
              >
                <div className="w-[100px] h-[18px] bg-table-green"></div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  resetColor(tablet.id);
                }}
              >
                Сбросить цвет
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={user?.role === "FOREMAN"}
            onClick={(e) => {
              e.stopPropagation();
              openSheet("edit", tablet);
            }}
          >
            Редактировать
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              tablet.status === "LOST" ||
              tablet.status === "WRITTEN_OFF" ||
              user?.role === "FOREMAN"
            }
            onClick={(e) => {
              e.stopPropagation();
              openSheet("change user", tablet);
            }}
          >
            {tablet.employee ? "Сменить владельца" : "Выдать планшет"}
          </DropdownMenuItem>
          {tablet.employee && (
            <DropdownMenuItem
              disabled={user?.role === "FOREMAN"}
              onClick={(e) => {
                e.stopPropagation();
                setIsReleaseDialogOpen(true);
              }}
            >
              Вернуть планшет
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            disabled={
              tablet.status === "LOST" ||
              tablet.status === "WRITTEN_OFF" ||
              user?.role === "FOREMAN"
            }
            onClick={(e) => {
              e.stopPropagation();
              openSheet("change status", tablet);
            }}
          >
            Сменить статус
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={user?.role === "FOREMAN"}
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
        item={tablet}
        isLoading={deleteMutation.isPending}
      />

      <AlertDialogRelease
        tablet={tablet}
        isReleaseDialogOpen={isReleaseDialogOpen}
        setIsReleaseDialogOpen={setIsReleaseDialogOpen}
        handleRelease={handleRelease}
        isLoading={releaseMutation.isPending}
      />
    </>
  );
}
