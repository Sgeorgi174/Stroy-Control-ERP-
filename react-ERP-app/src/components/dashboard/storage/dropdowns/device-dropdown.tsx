import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { AlertDialogDelete } from "../../alert-dialog-delete";
import type { Device } from "@/types/device";
import { useDeviceSheetStore } from "@/stores/device-sheet-store";

type DeviceDropDownProps = { device: Device };

export function DeviceDropDown({ device }: DeviceDropDownProps) {
  const { openSheet } = useDeviceSheetStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      // Здесь будет логика удаления
      // Например: await api.delete(`/tools/${tool.id}`);
      toast.success(`Техника "${device.name}" успешно удалена`);
    } catch (error) {
      toast.error("Не удалось удалить технику");
      console.error("Ошибка при удалении:", error);
    } finally {
      setIsDeleteDialogOpen(false);
    }
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
        isDeleteDialogOpen={isDeleteDialogOpen}
        handleDelete={handleDelete}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        item={device}
      />
    </>
  );
}
