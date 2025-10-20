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
import { formatDate } from "@/lib/utils/format-date";
import { CommentPopover } from "../comment-popover";

type ToolsTableProps = {
  tools: Tool[];
  isLoading: boolean;
  isError: boolean;
};

export function ToolsTableBulk({ tools, isLoading, isError }: ToolsTableProps) {
  const { openSheet } = useToolsSheetStore();

  return (
    <div className="mt-6 rounded-lg border overflow-hidden">
      <Table>
        <TableHeader className="bg-primary pointer-events-none">
          <TableRow>
            <TableHead className="text-secondary font-bold">Дата</TableHead>

            <TableHead className="text-secondary font-bold">
              Наименование
            </TableHead>
            <TableHead className="text-secondary font-bold">Кол-во</TableHead>
            <TableHead className="text-secondary font-bold">Мастер</TableHead>
            <TableHead className="text-secondary font-bold">Телефон</TableHead>
            <TableHead className="text-secondary font-bold">
              Место хранения
            </TableHead>
            <TableHead className="text-secondary font-bold">
              Комментарий
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
              <TableCell className="font-medium">
                {formatDate(tool.createdAt)}
              </TableCell>

              <TableCell className=" hover:underline">{tool.name}</TableCell>
              <TableCell className="font-medium">{tool.quantity}</TableCell>
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
                  <ToolsDropDown tool={tool} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
