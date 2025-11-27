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
import { useRowColors } from "@/hooks/useRowColor";
import { ToolPDFButton } from "../pdf-generate/tool/tool-pdf-generate";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import { DescriptionPopover } from "../description-popover";

type ToolsTableProps = {
  tools: Tool[];
  isLoading: boolean;
  isError: boolean;
};

export function ToolsTable({ tools, isLoading, isError }: ToolsTableProps) {
  const { openSheet } = useToolsSheetStore();
  const { colors, setColor, resetColor } = useRowColors("tool");
  const { selectedObjectId } = useFilterPanelStore();

  console.log(tools);

  return (
    <div className="mt-6 rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-primary">
          <TableRow>
            <TableHead className="text-secondary font-bold">
              Инвент. №
            </TableHead>
            <TableHead className="text-secondary font-bold">
              Наименование
            </TableHead>
            <TableHead className="text-secondary font-bold">Описание</TableHead>
            <TableHead className="text-secondary font-bold">
              Серийный №
            </TableHead>
            <TableHead className="text-secondary font-bold w-[150px]">
              Статус
            </TableHead>
            <TableHead className="text-secondary font-bold">Мастер</TableHead>

            <TableHead className="text-secondary font-bold">
              Место хранения
            </TableHead>

            <TableHead className="text-secondary font-bold">
              {selectedObjectId !== "all" && <ToolPDFButton tools={tools} />}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <PendingTable isError={isError} isLoading={isLoading} data={tools} />
          {tools.map((tool) => (
            <TableRow
              key={tool.id}
              onClick={() => openSheet("details", tool)}
              className={`cursor-pointer bg-${
                colors[tool.id] ? colors[tool.id] : undefined
              } hover:bg-${colors[tool.id] ? colors[tool.id] : undefined}`}
            >
              <TableCell className="font-medium">{tool.serialNumber}</TableCell>
              <TableCell className=" hover:underline font-medium">
                {tool.name}
              </TableCell>
              <TableCell>
                {tool.description ? (
                  <DescriptionPopover text={tool.description} maxLength={20} />
                ) : (
                  ""
                )}
              </TableCell>
              <TableCell className=" hover:underline">
                {tool.originalSerial ?? ""}
              </TableCell>
              <TableCell>
                <StatusBadge
                  isAnimate={tool.status === "IN_TRANSIT"}
                  Icon={statusMap[tool.status]?.icon}
                  text={statusMap[tool.status]?.label}
                />
              </TableCell>
              <TableCell>
                {tool.storage && tool.storage.foreman
                  ? `${tool.storage.foreman.lastName} ${tool.storage.foreman.firstName}`
                  : "Не назначен"}
              </TableCell>
              <TableCell>{tool.storage ? tool.storage.name : "-"}</TableCell>
              <TableCell>
                <div onClick={(e) => e.stopPropagation()}>
                  <ToolsDropDown
                    tool={tool}
                    setColor={setColor}
                    resetColor={resetColor}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
