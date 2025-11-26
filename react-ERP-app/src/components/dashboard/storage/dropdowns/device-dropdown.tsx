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
import { AlertDialogDelete } from "../../alert-dialog-delete";
import type { Device } from "@/types/device";
import { useDeviceSheetStore } from "@/stores/device-sheet-store";
import { useDeleteDevice } from "@/hooks/device/useDeleteDevice";
import { useAuth } from "@/hooks/auth/useAuth";

type DeviceDropDownProps = {
  device: Device;
  setColor: (id: string, color: string) => void;
  resetColor: (id: string) => void;
};

export function DeviceDropDown({
  device,
  setColor,
  resetColor,
}: DeviceDropDownProps) {
  const { openSheet } = useDeviceSheetStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteMutation = useDeleteDevice();

  const handleDelete = async () => {
    deleteMutation.mutate(device.id, {
      onSettled: () => setIsDeleteDialogOpen(false),
    });
  };
  const { data: user } = useAuth();

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
              openSheet("details", device);
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
                  setColor(device.id, "table-red"); // пастельный красный
                }}
              >
                <div className="w-[100px] h-[18px] bg-table-red"></div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(device.id, "table-orange"); // пастельный жёлтый
                }}
              >
                <div className="w-[100px] h-[18px] bg-table-orange"></div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(device.id, "table-blue"); // пастельный голубой
                }}
              >
                <div className="w-[100px] h-[18px] bg-table-blue"></div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(device.id, "table-purple"); // пастельный сиреневый
                }}
              >
                <div className="w-[100px] h-[18px] bg-table-purple"></div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(device.id, "table-green"); // пастельный зелёный
                }}
              >
                <div className="w-[100px] h-[18px] bg-table-green"></div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  resetColor(device.id);
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
              openSheet("edit", device);
            }}
          >
            Редактировать
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              device.status !== "ON_OBJECT" ||
              (user?.role === "FOREMAN" &&
                ![...user.primaryObjects, ...user.secondaryObjects].some(
                  (obj) => obj.id === device.objectId
                ))
            }
            onClick={(e) => {
              e.stopPropagation();
              openSheet("transfer", device);
            }}
          >
            Переместить
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              device.status === "IN_TRANSIT" ||
              device.status === "LOST" ||
              device.status === "WRITTEN_OFF" ||
              user?.role === "FOREMAN"
            }
            onClick={(e) => {
              e.stopPropagation();
              openSheet("change status", device);
            }}
          >
            Сменить статус
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={user?.role === "FOREMAN"}
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
        isLoading={deleteMutation.isPending}
        isDeleteDialogOpen={isDeleteDialogOpen}
        handleDelete={handleDelete}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        item={device}
      />
    </>
  );
}
