import { toolStatusMap } from "@/constants/toolStatusMap";
import type { Tool } from "@/types/tool";

type DetailsBoxProps = {
  tool: Tool;
};

export function ToolsDetailsBox({ tool }: DetailsBoxProps) {
  return (
    <>
      <p>
        Серийный номер: <span className="font-medium">{tool.serialNumber}</span>
      </p>
      <p>
        Наименование: <span className="font-medium">{tool.name}</span>
      </p>
      <p>
        Статус:{" "}
        <span className="font-medium">{toolStatusMap[tool.status]}</span>
      </p>
      <p>
        Место хранения:{" "}
        <span className="font-medium">
          {tool.storage ? tool.storage.name : "-"}
        </span>
      </p>
      <p>
        Бригадир:
        <span className="font-medium">
          {" "}
          {tool.storage && tool.storage.foreman
            ? `${tool.storage.foreman.lastName} ${tool.storage.foreman.firstName}`
            : "-"}
        </span>
      </p>
      <p>
        Телефон:{" "}
        <span className="font-medium">
          {tool.storage && tool.storage.foreman
            ? tool.storage.foreman.phone
            : "-"}
        </span>
      </p>
    </>
  );
}
