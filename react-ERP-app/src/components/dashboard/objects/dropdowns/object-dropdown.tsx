import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { AlertDialogDelete } from "../../alert-dialog-delete";
import { AlertDialogRemove } from "../dialog-remove-foreman";
import type { Object } from "@/types/object";
import { useObjectSheetStore } from "@/stores/objects-sheet-store";
import { useDeleteObject } from "@/hooks/object/useDeleteObject";
import { useRemoveForeman } from "@/hooks/object/useRemoveForeman";

type ObjectDropDownProps = { object: Object };

export function ObjectDropDown({ object }: ObjectDropDownProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const { openSheet } = useObjectSheetStore();

  const { mutate: deleteObject, isPending: isDeleting } = useDeleteObject();
  const { mutate: removeForeman, isPending: isRemovingForeman } =
    useRemoveForeman(object.id);

  const handleDelete = () => {
    deleteObject(object.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
      onError: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  const handleRemove = () => {
    removeForeman(undefined, {
      onSuccess: () => {
        setIsRemoveDialogOpen(false);
      },
      onError: () => {
        setIsRemoveDialogOpen(false);
      },
    });
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
          <DropdownMenuItem onClick={() => openSheet("change foreman", object)}>
            Сменить бригадира
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!object.foreman}
            onClick={() => setIsRemoveDialogOpen(true)}
          >
            Снять бригадира
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
        isLoading={isDeleting}
      />

      {object.foreman && (
        <AlertDialogRemove
          isRemoveDialogOpen={isRemoveDialogOpen}
          handleRemove={handleRemove}
          setIsRemoveDialogOpen={setIsRemoveDialogOpen}
          item={object.foreman}
          isLoading={isRemovingForeman}
        />
      )}
    </>
  );
}
