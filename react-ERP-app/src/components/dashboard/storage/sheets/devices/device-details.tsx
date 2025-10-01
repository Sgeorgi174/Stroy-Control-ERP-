import type { Device } from "@/types/device";
import { DeviceDetailsBox } from "./device-details-box";
import { useGetDeviceHistory } from "@/hooks/device/useGetDeviceHistory";
import { useGetDeviceStatusChanges } from "@/hooks/device/useGetDeviceStatusChanges";
import { DeviceTransferHistory } from "./device-transfer-history";
import { DevicesStatusHistory } from "./device-status-history";

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
        <p className="font-medium text-xl mt-6">История</p>
        <DeviceTransferHistory
          isError={deviceHistoryError}
          isLoading={deviceHistoryLoading}
          transferRecords={deviceHistoryData.reverse()}
        />
        <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
        <DevicesStatusHistory
          isError={deviceStatusChangesError}
          isLoading={deviceStatusChangesLoading}
          statusChangesRecords={deviceStatusChangesData.reverse()}
        />
      </div>
    </>
  );
}
