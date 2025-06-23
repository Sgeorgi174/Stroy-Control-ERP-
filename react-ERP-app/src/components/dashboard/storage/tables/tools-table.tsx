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
import { TabletSkeleton } from "../../tablet-skeleton";
import { toolStatusMap } from "@/constants/toolStatusMap";

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
            <TableHead className="w-[30px]"></TableHead>
            <TableHead className="text-secondary font-bold">
              Серийный №
            </TableHead>
            <TableHead className="text-secondary font-bold">
              Наименование
            </TableHead>
            <TableHead className="text-secondary font-bold">Статус</TableHead>
            <TableHead className="text-secondary font-bold">Бригадир</TableHead>
            <TableHead className="text-secondary font-bold">Телефон</TableHead>
            <TableHead className="text-secondary font-bold">
              Место хранения
            </TableHead>

            <TableHead className="text-secondary font-bold"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isError && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-red-500">
                Ошибка при загрузке, попробуйте позже
              </TableCell>
            </TableRow>
          )}
          {tools.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-400">
                Ничего не найдено
              </TableCell>
            </TableRow>
          )}
          {isLoading && <TabletSkeleton />}
          {tools.map((tool) => (
            <TableRow key={tool.id}>
              <TableCell></TableCell>
              <TableCell className="font-medium">{tool.serialNumber}</TableCell>
              <TableCell
                onClick={() => openSheet("details", tool)}
                className=" cursor-pointer hover:underline"
              >
                {tool.name}
              </TableCell>
              <TableCell>{toolStatusMap[tool.status]}</TableCell>
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
