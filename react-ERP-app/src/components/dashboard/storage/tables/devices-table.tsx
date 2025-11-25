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
import { PendingTable } from "./pending-table";
import { StatusBadge } from "./status-badge";
import { statusMap } from "@/constants/statusMap";
import { formatDate } from "@/lib/utils/format-date";
import { useRowColors } from "@/hooks/useRowColor";
import { DevicePDFButton } from "../pdf-generate/device/device-pdf-generate";
import { useFilterPanelStore } from "@/stores/filter-panel-store";

type DeviceTableProps = {
  devices: Device[];
  isLoading: boolean;
  isError: boolean;
};

export function DevicesTable({
  devices,
  isLoading,
  isError,
}: DeviceTableProps) {
  const { openSheet } = useDeviceSheetStore();
  const { colors, setColor, resetColor } = useRowColors("device");
  const { selectedObjectId } = useFilterPanelStore();

  return (
    <div className="mt-6 rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-primary">
          <TableRow>
            <TableHead className="text-secondary font-bold">Дата</TableHead>
            <TableHead className="text-secondary font-bold">
              Инвент. №
            </TableHead>
            <TableHead className="text-secondary font-bold">
              Наименование
            </TableHead>
            <TableHead className="text-secondary font-bold">Статус</TableHead>
            <TableHead className="text-secondary font-bold">Мастер</TableHead>
            <TableHead className="text-secondary font-bold">Телефон</TableHead>
            <TableHead className="text-secondary font-bold">
              Место хранения
            </TableHead>

            <TableHead className="text-secondary font-bold">
              {selectedObjectId !== "all" && (
                <DevicePDFButton devices={devices} />
              )}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <PendingTable
            isError={isError}
            isLoading={isLoading}
            data={devices}
          />
          {devices.map((device) => (
            <TableRow
              key={device.id}
              onClick={() => openSheet("details", device)}
              className={`cursor-pointer bg-${
                colors[device.id] ? colors[device.id] : undefined
              } hover:bg-${colors[device.id] ? colors[device.id] : undefined}`}
            >
              <TableCell className="font-medium">
                {formatDate(device.createdAt)}
              </TableCell>
              <TableCell className="font-medium">
                {device.serialNumber}
              </TableCell>
              <TableCell className="hover:underline">{device.name}</TableCell>
              <TableCell>
                <StatusBadge
                  isAnimate={device.status === "IN_TRANSIT"}
                  Icon={statusMap[device.status]?.icon}
                  text={statusMap[device.status]?.label}
                />
              </TableCell>
              <TableCell>
                {device.storage && device.storage.foreman
                  ? `${device.storage.foreman.lastName} ${device.storage.foreman.firstName}`
                  : "Не назначен"}
              </TableCell>
              <TableCell>
                {device.storage && device.storage.foreman
                  ? device.storage.foreman.phone
                  : "-"}
              </TableCell>
              <TableCell>
                {device.storage ? device.storage.name : "-"}
              </TableCell>
              <TableCell>
                <div onClick={(e) => e.stopPropagation()}>
                  <DeviceDropDown
                    device={device}
                    setColor={setColor}
                    resetColor={resetColor}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
