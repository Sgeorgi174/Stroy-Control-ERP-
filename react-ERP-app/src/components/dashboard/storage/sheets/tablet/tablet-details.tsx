import type { Tablet } from "@/types/tablet";
import { TransferHistoryTable } from "../../tables/transfer-history-table";

type TabletDetailsProps = { tablet: Tablet };

const statusMap = {
  ACTIVE: "Активен",
  INACTIVE: "Свободен",
  IN_REPAIR: "На ремонте",
  LOST: "Утерян",
  WRITTEN_OFF: "Списан",
};

export function TabletDetails({ tablet }: TabletDetailsProps) {
  return (
    <>
      <div className="p-5 flex flex-col gap-1">
        <p>
          Серийный номер:{" "}
          <span className="font-medium">{tablet.serialNumber}</span>
        </p>
        <p>
          Наименование: <span className="font-medium">{tablet.name}</span>
        </p>
        <p>
          Статус:{" "}
          <span className="font-medium">{statusMap[tablet.status]}</span>
        </p>
        <p>
          Кому выдан:{" "}
          <span className="font-medium">{`${tablet.employee?.lastName} ${tablet.employee?.firstName}`}</span>
        </p>
        <p>
          Телефон:{" "}
          <span className="font-medium">{tablet.employee?.phoneNumber}</span>
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
