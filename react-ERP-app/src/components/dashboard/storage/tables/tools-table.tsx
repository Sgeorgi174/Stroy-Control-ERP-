import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToolsDropDown } from "../dropdowns/tools-dropdown";
import type { Tool } from "@/types/tool";
import { useToolsSheetStore } from "@/stores/tool-sheet-store";
import { PendingTable } from "./pending-table";
import { StatusBadge } from "./status-badge";
import { statusMap } from "@/constants/statusMap";

type ToolsTableProps = {
  tools: Tool[];
  isLoading: boolean;
  isError: boolean;
};

export function ToolsTable({ tools, isLoading, isError }: ToolsTableProps) {
  const { openSheet } = useToolsSheetStore();

  return (
    <div className="mt-6 rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-primary pointer-events-none">
          <TableRow>
            <TableHead className="text-secondary font-bold">
              Серийный №
            </TableHead>
            <TableHead className="text-secondary font-bold">
              Наименование
            </TableHead>
            <TableHead className="text-secondary font-bold w-[150px]">
              Статус
            </TableHead>
            <TableHead className="text-secondary font-bold">Бригадир</TableHead>
            <TableHead className="text-secondary font-bold">Телефон</TableHead>
            <TableHead className="text-secondary font-bold">
              Место хранения
            </TableHead>

            <TableHead className="text-secondary font-bold"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <PendingTable isError={isError} isLoading={isLoading} data={tools} />
          {tools.map((tool) => (
            <TableRow
              key={tool.id}
              onClick={() => openSheet("details", tool)}
              className="cursor-pointer"
            >
              <TableCell className="font-medium">{tool.serialNumber}</TableCell>
              <TableCell className=" hover:underline">{tool.name}</TableCell>
              <TableCell>
                <StatusBadge
                  isAnimate={tool.status === "IN_TRANSIT"}
                  color={statusMap[tool.status]?.color}
                  Icon={statusMap[tool.status]?.icon}
                  text={statusMap[tool.status]?.label}
                />
              </TableCell>
              <TableCell>
                {tool.storage && tool.storage.foreman
                  ? `${tool.storage.foreman.lastName} ${tool.storage.foreman.firstName}`
                  : "Не назначен"}
              </TableCell>
              <TableCell>
                {tool.storage && tool.storage.foreman
                  ? tool.storage.foreman.phone
                  : "-"}
              </TableCell>
              <TableCell>{tool.storage ? tool.storage.name : "-"}</TableCell>
              <TableCell>
                <ToolsDropDown tool={tool} /> {/* 💡 ВАЖНО */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
