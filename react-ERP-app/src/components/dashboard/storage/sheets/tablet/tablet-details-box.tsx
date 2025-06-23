import { tabletStatusMap } from "@/constants/tabletStatusMap";
import type { Tablet } from "@/types/tablet";

type TabletDetailsProps = {
  tablet: Tablet;
};

export function TabletDetailsBox({ tablet }: TabletDetailsProps) {
  return (
    <>
      <p>
        Серийный номер:{" "}
        <span className="font-medium">{tablet.serialNumber}</span>
      </p>
      <p>
        Наименование: <span className="font-medium">{tablet.name}</span>
      </p>
      <p>
        Статус:{" "}
        <span className="font-medium">{tabletStatusMap[tablet.status]}</span>
      </p>
      <p>
        Кому выдан:{" "}
        <span className="font-medium">
          {tablet.employee
            ? `${tablet.employee?.lastName} ${tablet.employee?.firstName} `
            : "-"}
        </span>
      </p>
      <p>
        Телефон:{" "}
        <span className="font-medium">
          {tablet.employee ? tablet.employee?.phoneNumber : "-"}
        </span>
      </p>
    </>
  );
}
