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
        {/* Останавливаем всплытие клика на триггере */}
        <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
          <button className="hover:bg-accent p-1 rounded cursor-pointer">
            <EllipsisVertical />
          </button>
        </DropdownMenuTrigger>

        {/* Останавливаем всплытие клика внутри меню */}
        <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              openSheet("details", object);
            }}
          >
            Подробнее
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              openSheet("edit", object);
            }}
          >
            Редактировать
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              openSheet("change foreman", object);
            }}
          >
            {object.foreman ? "Сменить мастера" : "Назначить мастера"}
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={!object.foreman}
            onClick={(e) => {
              e.stopPropagation();
              setIsRemoveDialogOpen(true);
            }}
          >
            Снять мастера
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              openSheet("add employee", object);
            }}
          >
            Добавить сотрудников
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            disabled
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              openSheet("close object", object);
            }}
          >
            Закрыть объект
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
