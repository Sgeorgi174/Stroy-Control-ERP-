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
