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
import { CommentPopover } from "../comment-popover";
import { useRowColors } from "@/hooks/useRowColor";
import { ToolBulkPDFButton } from "../pdf-generate/tool-bulk/tool-bulk-pdf-generate";
import { useFilterPanelStore } from "@/stores/filter-panel-store";
import { DescriptionPopover } from "../description-popover";

type ToolsTableProps = {
  tools: Tool[];
  isLoading: boolean;
  isError: boolean;
};

export function ToolsTableBulk({ tools, isLoading, isError }: ToolsTableProps) {
  const { openSheet } = useToolsSheetStore();
  const { colors, setColor, resetColor } = useRowColors("tool-bulk");
  const { selectedObjectId } = useFilterPanelStore();

  return (
    <div className="mt-6 rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-primary">
          <TableRow>
            <TableHead className="text-secondary font-bold">
              Наименование
            </TableHead>
            <TableHead className="text-secondary font-bold">Описание</TableHead>
            <TableHead className="text-secondary font-bold">Кол-во</TableHead>
            <TableHead className="text-secondary font-bold">В пути</TableHead>
            <TableHead className="text-secondary font-bold">Мастер</TableHead>

            <TableHead className="text-secondary font-bold">
              Место хранения
            </TableHead>
            <TableHead className="text-secondary font-bold">
              Комментарий
            </TableHead>

            <TableHead className="text-secondary font-bold">
              {selectedObjectId !== "all" && (
                <ToolBulkPDFButton tools={tools} />
              )}
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
              <TableCell className=" hover:underline font-medium">
                {tool.name}
              </TableCell>
              <TableCell>
                {tool.description ? (
                  <DescriptionPopover text={tool.description} maxLength={40} />
                ) : (
                  ""
                )}
              </TableCell>
              <TableCell className="font-medium">{tool.quantity}</TableCell>
              <TableCell>
                {tool.inTransit
                  .filter((transit) => transit.status === "IN_TRANSIT")
                  .reduce((acc, curr) => acc + curr.quantity, 0)}
              </TableCell>
              <TableCell>
                {tool.storage && tool.storage.foreman
                  ? `${tool.storage.foreman.lastName} ${tool.storage.foreman.firstName}`
                  : "Не назначен"}
              </TableCell>

              <TableCell>{tool.storage ? tool.storage.name : "-"}</TableCell>
              <TableCell>
                {tool.comment ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <CommentPopover comment={tool.comment} />
                  </div>
                ) : (
                  <div></div>
                )}
              </TableCell>
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
