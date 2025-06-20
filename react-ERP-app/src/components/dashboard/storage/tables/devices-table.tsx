import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Device } from "@/types/device";
import { DeviceDropDown } from "../dropdowns/device-dropdown";
import { useDeviceSheetStore } from "@/stores/device-sheet-store";
import { TabletSkeleton } from "../../tablet-skeleton";

type DeviceTableProps = {
  devices: Device[];
  isLoading: boolean;
  isError: boolean;
};

const deviceStatusMap = {
  ON_OBJECT: "На объекте",
  IN_TRANSIT: "В пути",
  IN_REPAIR: "На ремонте",
  LOST: "Утерян",
  WRITTEN_OFF: "Списан",
};

export function DevicesTable({
  devices,
  isLoading,
  isError,
}: DeviceTableProps) {
  const { openSheet } = useDeviceSheetStore();

  return (
    <div className="mt-6 rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-primary pointer-events-none">
          <TableRow>
            <TableHead className="w-[30px]"></TableHead>
            <TableHead className="text-secondary font-bold">
              Серийный №
            </TableHead>
            <TableHead className="text-secondary font-bold">
              Наименование
            </TableHead>
            <TableHead className="text-secondary font-bold">Статус</TableHead>
            <TableHead className="text-secondary font-bold">Бригадир</TableHead>
            <TableHead className="text-secondary font-bold">Телефон</TableHead>
            <TableHead className="text-secondary font-bold">
              Место хранения
            </TableHead>

            <TableHead className="text-secondary font-bold"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isError && <TableRow></TableRow>}
          {isLoading && <TabletSkeleton />}
          {devices.map((device) => (
            <TableRow key={device.id}>
              <TableCell></TableCell>
              <TableCell className="font-medium">
                {device.serialNumber}
              </TableCell>
              <TableCell
                onClick={() => openSheet("details", device)}
                className="hover:underline cursor-pointer"
              >
                {device.name}
              </TableCell>
              <TableCell>{deviceStatusMap[device.status]}</TableCell>
              <TableCell>
                {" "}
                {device.storage.foreman
                  ? `${device.storage.foreman.lastName} ${device.storage.foreman.firstName}`
                  : "Не назначен"}
              </TableCell>
              <TableCell>
                {device.storage.foreman ? device.storage.foreman.phone : "-"}
              </TableCell>
              <TableCell>{device.storage.name}</TableCell>
              <TableCell>
                <DeviceDropDown device={device} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
