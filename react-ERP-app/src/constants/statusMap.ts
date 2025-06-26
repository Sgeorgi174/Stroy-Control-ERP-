import {
  BadgeX,
  CircleCheck,
  CircleDashed,
  PowerOff,
  Wrench,
} from "lucide-react";
import type { ToolStatus } from "@/types/tool";
import type { DeviceStatus } from "@/types/device";
import type { TabletStatus } from "@/types/tablet";

type Status = ToolStatus | DeviceStatus | TabletStatus;

type StatusConfig = {
  label: string;
  icon: React.ElementType;
  color: string;
};

export const statusMap: Record<Status, StatusConfig> = {
  ON_OBJECT: {
    label: "На объекте",
    icon: CircleCheck,
    color: "#23732E",
  },
  ACTIVE: {
    label: "Активен",
    icon: CircleCheck,
    color: "#23732E",
  },
  IN_REPAIR: {
    label: "На ремонте",
    icon: Wrench,
    color: "#C7BC22",
  },
  IN_TRANSIT: {
    label: "В пути",
    icon: CircleDashed,
    color: "#807F7F",
  },
  INACTIVE: {
    label: "Свободен",
    icon: PowerOff,
    color: "#807F7F",
  },
  LOST: {
    label: "Утерян",
    icon: BadgeX,
    color: "#971B1B",
  },
  WRITTEN_OFF: {
    label: "Списан",
    icon: BadgeX,
    color: "#971B1B",
  },
};
