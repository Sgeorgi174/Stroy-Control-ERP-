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

type DeviceTableProps = {
  devices: Device[];
};

const deviceStatusMap = {
  ON_OBJECT: "На объекте",
  IN_TRANSIT: "В пути",
  IN_REPAIR: "На ремонте",
  LOST: "Утерян",
  WRITTEN_OFF: "Списан",
};

export function DevicesTable({ devices }: DeviceTableProps) {
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
              <TableCell>{`${device.storage.user.lastName} ${device.storage.user.firstName}`}</TableCell>
              <TableCell>{device.storage.user.phoneNumber}</TableCell>
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
