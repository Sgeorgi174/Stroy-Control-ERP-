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
import type { Device } from "@/types/device";
import { useDeviceSheetStore } from "@/stores/device-sheet-store";
import { useDeleteDevice } from "@/hooks/device/useDeleteDevice";

type DeviceDropDownProps = { device: Device };

export function DeviceDropDown({ device }: DeviceDropDownProps) {
  const { openSheet } = useDeviceSheetStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteMutation = useDeleteDevice();

  const handleDelete = async () => {
    deleteMutation.mutate(device.id, {
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
          <DropdownMenuItem onClick={() => openSheet("details", device)}>
            Подробнее
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => openSheet("edit", device)}>
            Редактировать
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={device.status !== "ON_OBJECT"}
            onClick={() => openSheet("transfer", device)}
          >
            Переместить
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={device.status === "IN_TRANSIT"}
            onClick={() => openSheet("change status", device)}
          >
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
        isLoading={deleteMutation.isPending}
        isDeleteDialogOpen={isDeleteDialogOpen}
        handleDelete={handleDelete}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        item={device}
      />
    </>
  );
}
