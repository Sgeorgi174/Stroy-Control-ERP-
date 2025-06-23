import { deviceStatusMap } from "@/constants/deviceStatusMap";
import type { Device } from "@/types/device";

type DeviceDetailsBoxProps = { device: Device };

export function DeviceDetailsBox({ device }: DeviceDetailsBoxProps) {
  return (
    <>
      <p>
        Серийный номер:{" "}
        <span className="font-medium">{device.serialNumber}</span>
      </p>
      <p>
        Наименование: <span className="font-medium">{device.name}</span>
      </p>
      <p>
        Статус:{" "}
        <span className="font-medium">{deviceStatusMap[device.status]}</span>
      </p>
      <p>
        Место хранения:{" "}
        <span className="font-medium">
          {device.storage ? device.storage.name : "-"}
        </span>
      </p>
      <p>
        Бригадир:
        <span className="font-medium">
          {" "}
          {device.storage && device.storage.foreman
            ? `${device.storage.foreman.lastName} ${device.storage.foreman.firstName}`
            : "-"}
        </span>
      </p>
      <p>
        Телефон:{" "}
        <span className="font-medium">
          {device.storage && device.storage.foreman
            ? device.storage.foreman.phone
            : "-"}
        </span>
      </p>
    </>
  );
}
