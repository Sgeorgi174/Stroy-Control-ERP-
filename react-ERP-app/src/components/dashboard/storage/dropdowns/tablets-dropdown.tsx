import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

type TabletDropDownProps = { tablet: Tablet };

export function TabletsDropDown({ tablet }: TabletDropDownProps) {
  const { openSheet } = useTabletSheetStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isReleaseDialogOpen, setIsReleaseDialogOpen] = useState(false);

  const deleteMutation = useDeleteTablet();
  const releaseMutation = useReleaseTablet();

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
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              openSheet("edit", tablet);
            }}
          >
            Редактировать
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              tablet.status === "LOST" || tablet.status === "WRITTEN_OFF"
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
              tablet.status === "LOST" || tablet.status === "WRITTEN_OFF"
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
