import type { Tool } from "@/types/tool";
import { TransferHistoryTable } from "../../tables/transfer-history-table";

export function ToolsDetails({ tool }: { tool: Tool }) {
  return (
    <>
      <div className="p-5 flex flex-col gap-1">
        <p>
          Серийный номер:{" "}
          <span className="font-medium">{tool.serialNumber}</span>
        </p>
        <p>
          Наименование: <span className="font-medium">{tool.name}</span>
        </p>
        <p>
          Статус:{" "}
          <span className="font-medium">
            {tool.status === "ON_OBJECT" ? "На объекте" : "В пути"}
          </span>
        </p>
        <p>
          Место хранения:{" "}
          <span className="font-medium">{tool.storage.name}</span>
        </p>
        <p>
          Бригадир:
          <span className="font-medium">
            {" "}
            {tool.storage.foreman
              ? `${tool.storage.foreman.lastName} ${tool.storage.foreman.firstName}`
              : "Не назначен"}
          </span>
        </p>
        <p>
          Телефон:{" "}
          <span className="font-medium">
            {tool.storage.foreman ? tool.storage.foreman.phone : "-"}
          </span>
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
