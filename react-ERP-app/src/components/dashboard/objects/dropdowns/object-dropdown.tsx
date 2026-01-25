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
import { usePauseObject } from "@/hooks/object/usePauseObject";
import { useUnpauseObject } from "@/hooks/object/useUnpauseObject";
import { AlertDialogConfirmPauseObject } from "../dialog-confirm-pause-object";

type ObjectDropDownProps = { object: Object };

export function ObjectDropDown({ object }: ObjectDropDownProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isPauseDialogOpen, setIsPauseDialogOpen] = useState(false);
  const { openSheet } = useObjectSheetStore();

  const { mutate: deleteObject, isPending: isDeleting } = useDeleteObject();
  const { mutate: removeForeman, isPending: isRemovingForeman } =
    useRemoveForeman(object.id);

  const { mutate: pause } = usePauseObject();
  const { mutate: unpause } = useUnpauseObject();

  const handleDelete = () => {
    deleteObject(object.id, {
      onSuccess: () => setIsDeleteDialogOpen(false),
      onError: () => setIsDeleteDialogOpen(false),
    });
  };

  const handleRemove = () => {
    removeForeman(undefined, {
      onSuccess: () => setIsRemoveDialogOpen(false),
      onError: () => setIsRemoveDialogOpen(false),
    });
  };

  const handlePauseToggle = () => {
    if (object.status === "OPEN") {
      pause(object.id, { onSuccess: () => setIsPauseDialogOpen(false) });
    } else if (object.status === "PAUSE") {
      unpause(object.id, { onSuccess: () => setIsPauseDialogOpen(false) });
    }
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
            onClick={(e) => {
              e.stopPropagation();
              setIsPauseDialogOpen(true);
            }}
          >
            {object.status === "OPEN"
              ? "Приостановить работу объекта"
              : "Возобновить работу объекта"}
          </DropdownMenuItem>

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

      {/* ========== Delete Dialog ========== */}
      <AlertDialogDelete
        isDeleteDialogOpen={isDeleteDialogOpen}
        handleDelete={handleDelete}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        item={object}
        isLoading={isDeleting}
      />

      {/* ========== Remove Foreman Dialog ========== */}
      {object.foreman && (
        <AlertDialogRemove
          isRemoveDialogOpen={isRemoveDialogOpen}
          handleRemove={handleRemove}
          setIsRemoveDialogOpen={setIsRemoveDialogOpen}
          item={object.foreman}
          isLoading={isRemovingForeman}
        />
      )}

      {/* ========== Pause / Unpause Dialog ========== */}
      <AlertDialogConfirmPauseObject
        open={isPauseDialogOpen}
        onOpenChange={setIsPauseDialogOpen}
        title={
          object.status === "OPEN"
            ? "Приостановка объекта"
            : "Возобновление объекта"
        }
        description={
          object.status === "OPEN"
            ? "Вы уверены, что хотите приостановить работу объекта?"
            : "Вы уверены, что хотите возобновить работу объекта?"
        }
        onConfirm={handlePauseToggle}
        confirmText={object.status === "OPEN" ? "Приостановить" : "Возобновить"}
      />
    </>
  );
}
