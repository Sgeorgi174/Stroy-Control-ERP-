import { TransferHistoryTable } from "../../tables/transfer-history-table";
import type { Device } from "@/types/device";
import { DeviceDetailsBox } from "./device-details-box";
import { useGetDeviceHistory } from "@/hooks/device/useGetDeviceHistory";
import { useGetDeviceStatusChanges } from "@/hooks/device/useGetDeviceStatusChanges";
import { StatusChangesHistoryTable } from "../../tables/status-changes-table/status-changes-table";

type DeviceDetailsProps = { device: Device };

export function DeviceDetails({ device }: DeviceDetailsProps) {
  const {
    data: deviceHistoryData = [],
    isError: deviceHistoryError,
    isLoading: deviceHistoryLoading,
  } = useGetDeviceHistory(device.id);
  const {
    data: deviceStatusChangesData = [],
    isError: deviceStatusChangesError,
    isLoading: deviceStatusChangesLoading,
  } = useGetDeviceStatusChanges(device.id);

  return (
    <>
      <div className="p-5 flex flex-col gap-1">
        <DeviceDetailsBox device={device} />
        <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
        <p className="text-center font-medium text-xl mt-8">
          Последние перемещения
        </p>
        <TransferHistoryTable
          isError={deviceHistoryError}
          isLoading={deviceHistoryLoading}
          transferRecords={deviceHistoryData}
        />
        <p className="text-center font-medium text-xl mt-8">Смены статусов</p>
        <StatusChangesHistoryTable
          isError={deviceStatusChangesError}
          isLoading={deviceStatusChangesLoading}
          statusChangesRecords={deviceStatusChangesData}
        />
      </div>
    </>
  );
}
