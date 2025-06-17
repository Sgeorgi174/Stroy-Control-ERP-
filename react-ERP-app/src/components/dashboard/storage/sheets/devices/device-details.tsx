import { TransferHistoryTable } from "../../tables/transfer-history-table";
import type { Device } from "@/types/device";

type DeviceDetailsProps = { device: Device };

const statusMap = {
  ON_OBJECT: "На объекте",
  IN_TRANSIT: "В пути",
  IN_REPAIR: "На ремонте",
  LOST: "Утерян",
  WRITTEN_OFF: "Списан",
};

export function DeviceDetails({ device }: DeviceDetailsProps) {
  return (
    <>
      <div className="p-5 flex flex-col gap-1">
        <p>
          Серийный номер:{" "}
          <span className="font-medium">{device.serialNumber}</span>
        </p>
        <p>
          Наименование: <span className="font-medium">{device.name}</span>
        </p>
        <p>
          Статус:{" "}
          <span className="font-medium">{statusMap[device.status]}</span>
        </p>
        <p>
          Место хранения:{" "}
          <span className="font-medium">{device.storage.name}</span>
        </p>
        <p>
          Бригадир:{" "}
          <span className="font-medium">{`${device.storage.user.lastName} ${device.storage.user.firstName}`}</span>
        </p>
        <p>
          Телефон:{" "}
          <span className="font-medium">{device.storage.user.phoneNumber}</span>
        </p>
        <div className="mt-6 mb-0 w-[450px] mx-auto h-px bg-border" />
        <p className="text-center font-medium text-xl mt-5">
          Последние перемещения
        </p>
        <TransferHistoryTable />
      </div>
    </>
  );
}
